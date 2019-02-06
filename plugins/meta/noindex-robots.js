var oembedUtils = require('../../lib/plugins/system/oembed/oembedUtils');

module.exports = {

    getData: function(url, meta, __noOembedLinks, cb) {

        var oembedLinks = oembedUtils.findOembedLinks(null, meta);

        return cb(
            meta.robots
            && /noindex/i.test(meta.robots)
            && !meta.description
            && !meta.og
            && !meta.twitter
            && !oembedLinks // null if length == 0.
            ? {
               responseStatusCode: 403,
               message: "The robots directive of this page prevents Iframely from parsing it"
            } : null);
    }

};