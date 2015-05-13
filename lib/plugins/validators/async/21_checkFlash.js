var utils = require('../../../utils');
var urlLib = require('url');

module.exports = {

    prepareLink: function(url, link, options, cb) {

        // Check if need link processing.

        function finish() {

            if (link.type === CONFIG.T.maybe_text_html) {
                // Warning: Need restore text_html type.
                link.type = CONFIG.T.text_html;
            }

            cb();
        }

        if (!link.href || (link.type !== CONFIG.T.flash && link.type !== CONFIG.T.maybe_text_html)) {
            return finish();
        }

        // Need this for // case (no protocol).
        var uri = urlLib.resolve(url, link.href);

        // Remove get params.
        var uriForCache = uri.replace(/\?.*$/i, '');

        // Detect swf extension in url as flash.
        if (uriForCache.match(/\.swf$/i)) {
            link.type = CONFIG.T.flash;
            return finish();
        }

        // Detect mp4 extension in url.
        if (uriForCache.match(/\.mp4$/i)) {
            link.type = CONFIG.T.video_mp4;
            return finish();
        }

        // Detect html extension in url as html.
        if (uriForCache.match(/\.html$/i)) {
            link.type = CONFIG.T.text_html;
            return finish();
        }

        utils.getContentType(uriForCache, uri, options, function(error, data) {

            var error = error || (data && data.error);

            if (error) {
                // Unknown error.
                link.error = error;
            } else {
                if (data.code && data.code != 200) {
                    // URI not found or other error. Exclude link from results.
                    link.error = data.code;
                }
            }

            // Store timing.
            if (options.debug && data && data._time) {
                link._flashContentType = {time: data._time};
            }

            if (data && data.type) {
                link.type = data.type;
            }

            finish();
        });
    }

};