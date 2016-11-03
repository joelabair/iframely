var urlLib = require('url');

module.exports = {

	highestPriority: true,

    getMeta: function(url, meta) {

        var canonical = (meta.canonical && meta.canonical.href || meta.canonical) || (meta.og && meta.og.url) || (meta.twitter && meta.twitter.url);

        if (canonical && typeof canonical === 'string') {

            canonical = urlLib.resolve(url, canonical);

            return {
                canonical: canonical
            };
        }
    }
};