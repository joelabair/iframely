var async = require('async');
var cache = require('../../../cache');
var sysUtils = require('../../../../logging');

module.exports = {

    provides: ['__noCachedMeta', 'meta'],

    getData: function(url, options, whitelistRecord, cb) {

        if (options.refresh) {

            cb(null, {
                __noCachedMeta: true
            });

        } else {

            var meta_key = 'meta:' + url;

            var whitelistHash = whitelistRecord && whitelistRecord.getRecordHash();
            if (whitelistHash) {
                meta_key += ':' + whitelistHash;
            }

            function callback(error, data) {

                if (error) {
                    sysUtils.log('   -- Error loading cached meta for: ' + url + '. ' + error);
                }

                if (!error && data) {

                    sysUtils.log('   -- Using cached meta for: ' + url);

                    cb(error, {
                        meta: data
                    });

                } else {

                    cb(null, {
                        __noCachedMeta: true
                    });
                }
            }

            cache.get(meta_key, callback);
        }
    }

};