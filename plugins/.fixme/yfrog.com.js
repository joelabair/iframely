module.exports = {

    re: [
        /^https?:\/\/(?:[a-z]+\.)?yfrog\.com\/([a-zA-Z0-9]+)/i,
        /^https?:\/\/twitter\.yfrog\.com\/([a-zA-Z0-9]+)/i
    ],

    mixins: [
        "canonical",
        "og-site",
        "copyright"
    ],

    getMeta: function (meta) {

        return {
            title: meta["html-title"].replace('\n', '').trim()
        }
    },

    getLink: function (meta) {

        if (meta.og) {
            return [{
                href: meta.og.image,
                type: CONFIG.T.image,
                rel: CONFIG.R.image
            }, {
                href: 'http://yfrog.com/favicon.ico',
                type: CONFIG.T.image,
                rel: CONFIG.R.icon
            }];
        }
    },

    tests: [ 
        "http://twitter.yfrog.com/mn444mbkj?sa=0",
        "http://yfrog.com/obwotspj"
    ]
};