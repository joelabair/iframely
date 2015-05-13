module.exports = {

    mixins: [
        "favicon",
        "canonical",
        "twitter-description",
        "og-site",
        "twitter-title"
    ],

    getLink: function(og) {
// TODO: make // to relative url (og.image.url)
        return {
            href: og.image.url,
            rel: [CONFIG.R.og, og.image.width > 200 ? CONFIG.R.image : CONFIG.R.thumbnail],
            type: og.image.type,
            width: og.image.width,
            height: og.image.height
        };
    },

    tests: [ {
        page: "http://www.brainyquote.com/quotes/authors/a/aristotle.html",
        selector: ".bq-aut a"
    },
        "http://www.brainyquote.com/quotes/quotes/s/socrates107382.html",
        "http://www.brainyquote.com/quotes/quotes/s/socrates101211.html"
    ]
};