var sax = require('sax');
var urlLib = require('url');
var async = require('async');
var _ = require('underscore');

var utils = require('../../../utils');
var sysUtils = require('../../../../logging');
var cache = require('../../../cache');

var getUrl = utils.getUrl;
var getCharset = utils.getCharset;
var encodeText = utils.encodeText;
var lowerCaseKeys = utils.lowerCaseKeys;

exports.notPlugin = true;

/**
 * @private
 * Get the oembed uri via known providers
 * @param {String} uri The page uri
 * @return {String} The oembed uri
 */
function lookupStaticProviders(uri) {
    var providers = require('./providers.json');

    var protocolMatch = uri.match(/^(https?:\/\/)/);
    if (!protocolMatch || /^https?:\/\/blog\./i.test(uri)) {
        return null;
    }
    var uri2 = uri.substr(protocolMatch[1].length);

    uri = uri.replace(/#.+$/, "");

    var links;

    for (var j = 0; j < providers.length; j++) {
        var p = providers[j];
        var match;
        for (var i = 0; i < p.templates.length; i++) {
            match = uri2.match(p.templates[i]);
            if (match) break;
        }

        if (match) {

            var endpoint = p.endpoint;

            var groups = endpoint.match(/\{\d+\}/g);
            if (groups) {
                groups.forEach(function(g) {
                    var n = parseInt(g.match(/\{(\d+)\}/)[1]);
                    endpoint = endpoint.replace("{" + n + "}", match[n]);
                });

            } else if (endpoint.match(/\{url\}/)) {
                endpoint = endpoint.replace(/\{url\}/, encodeURIComponent(uri));

            } else {
                endpoint = endpoint + '?url=' + encodeURIComponent(uri);
            }

            links = ['json', 'xml'].map(function(format) {
                return {
                    href: endpoint.match(/\{format\}/)? endpoint.replace(/\{format\}/, format): endpoint + '&format=' + format,
                    rel: 'alternate',
                    type: 'application/' + format + '+oembed'
                };
            });
            break;
        }
    }

    return links;
}

module.exports.findOembedLinks = function(uri, meta) {
    // Filter oembed from meta.
    var alternate = meta && meta.alternate;
    if (alternate && !(alternate instanceof Array)) {
        alternate = [alternate];
        meta.alternate = alternate;
    }
    var oembedLinks = meta && meta.alternate && meta.alternate.filter(function(link) {
        return /^(application|text)\/(xml|json)\+oembed$/i.test(link.type);
    });

    if (uri && (!oembedLinks || !oembedLinks.length)) {
        // Find oembed in static providers list.
        oembedLinks = lookupStaticProviders(uri);

        if (meta && oembedLinks) {
            // Merge found links to meta.
            meta.alternate = (meta.alternate || []).concat(oembedLinks);
        }
    }

    if (oembedLinks && oembedLinks.length === 0) {
        oembedLinks = null;
    }

    return oembedLinks;
};

/**
 * @private
 * Fetches and parses oEmbed by oEmbed URL got from discovery.
 * @param {String} uri Full oEmbed endpoint plus URL and any needed format parameter.
 * @param {Function} callback Completion callback function. The callback gets two arguments (error, oembed) where oembed is json parsed oEmbed object.
 * */
module.exports.getOembed = function(uri, options, callback) {

    if (typeof options === 'function') {
        callback = options;
        options = null;
    }

    var ADD_OEMBED_PARAMS = [];
    if (options && options.ADD_OEMBED_PARAMS instanceof Array) {
        ADD_OEMBED_PARAMS = ADD_OEMBED_PARAMS.concat(options.ADD_OEMBED_PARAMS);
    }
    if (CONFIG.ADD_OEMBED_PARAMS) {
        ADD_OEMBED_PARAMS = ADD_OEMBED_PARAMS.concat(CONFIG.ADD_OEMBED_PARAMS);
    }

    try {
        // TODO: make 'for'.
        var params = _.find(ADD_OEMBED_PARAMS, function (params) {
            return _.find(params.re, function (re) {
                return uri.match(re);
            });
        });
        if (params) {
            var urlObj = urlLib.parse(uri, true, true);
            var query = urlObj.query;
            delete urlObj.search;

            _.extend(query, params.params);

            uri = urlLib.format(urlObj);
        }
    } catch(ex) {
        console.error("Error using ADD_OEMBED_PARAMS", ex);
    }

    var oembed_key = 'meta:' + uri;

    async.waterfall([

        function(cb) {
            if (options && (options.refresh || options.cache_ttl === 0)) {
                cb(null, null);
            } else {
                cache.get(oembed_key, cb);
            }
        },

        function(data, cb) {

            if (data) {
                sysUtils.log('   -- Using cached oembed for: ' + uri);
                return cb(null, data);
            }

            // Reformat uri to escape not allowed get param characters.
            var urlObj = urlLib.parse(uri, true);
            delete urlObj.search;
            uri = urlLib.format(urlObj);

            var cbCalled = false;

            // Need check to prevent double error on timeout.
            var cbWrapper = function(error, data) {
                if (cbCalled) return;
                cbCalled = true;
                cb(error, data);
            };

            getUrl(uri, {
                maxRedirects: 3
            })
                .on('response', function(res) {
                    if (res.statusCode == 200) {

                        stream2oembed(res, function(error, oembed) {
                            if (error) {
                                return cbWrapper(error);
                            }

                            var result = {};
                            for(var key in oembed) {
                                var goodKey = key.replace(/-/g, "_");
                                result[goodKey] = oembed[key];
                            }

                            cbWrapper(null, result);
                        });

                    } else {
                        cbWrapper(res.statusCode);
                    }
                })
                .on('error', cbWrapper);
        }

    ], function(error, data) {

        if (!error && data) {
            cache.set(oembed_key, data, {
                ttl: options && options.cache_ttl
            });
        }

        callback(error, data);
    });
};

/**
 * @private
 * Convert XML or JSON stream to an oEmbed object.
 */
function stream2oembed(stream, callback) {
    stream.headers['content-type'].match('xml') ?
        xmlStream2oembed(stream, callback) :
        jsonStream2oembed(stream, callback);
}

/**
 * @private
 * Convert XML stream to an oembed object
 */
function xmlStream2oembed(stream, callback) {
    var oembed;
    var prop;
    var value;
    var firstTag;

    var charset = getCharset(stream.headers && stream.headers['content-type']);

    var saxStream = sax.createStream();
    saxStream.on('error', function(err) {
        callback(err);
    });
    saxStream.on('opentag', function(tag) {
        if (!firstTag) {
            // Should be HEAD but HASH tag found on qik.
            firstTag = tag.name;
            oembed = {};
        } else if (oembed) {
            prop = tag.name.toLowerCase();
            value = "";
        }
    });
    saxStream.on('text', function(text) {
        if (prop) value += text;
    });
    saxStream.on('cdata', function(text) {
        if (prop) value += text;
    });
    saxStream.on('closetag', function(name) {
        if (name === firstTag) {
            callback(null, oembed);

        } else {
            if (prop) {
                value = encodeText(charset, value);

                if (prop.match(/(width|height)$/)) {

                    if (value.match(/^\d+(px)?$/)) {
                        value = parseInt(value, 10);
                    } else {
                        // For case like 100%.
                        value = undefined;
                    }
                }

                oembed[prop] = value;
            }
            prop = null;
        }
    });

    stream.pipe(saxStream);
}

/**
 * @private
 * Convert JSON stream to an oembed object
 */
function jsonStream2oembed(stream, callback) {

    var charset = getCharset(stream.headers && stream.headers['content-type']);

    var data = "";
    stream.on('data', function(chunk) {
        data += chunk;
    }).on('end', function() {
            try {
                data = JSON.parse(encodeText(charset, data));
            } catch (e) {
                callback(e);
                return;
            }

            for(var prop in data) {

                var value = data[prop];

                if (prop.match(/(width|height)$/) && (typeof value === "string")) {

                    if (value.match(/^\d+(px)?$/)) {
                        value = parseInt(value, 10);
                        data[prop] = value;
                    } else {
                        // For case like 100%.
                        data[prop] = undefined;
                    }
                }
            }

            lowerCaseKeys(data);

            callback(null, data);
        });
}