module.exports = {

    re: /^https:\/\/squareup\.com\/market\/[\w-]+\/[\w-]+/i,

    mixins: [
        "og-image",
        "favicon",
        "og-product",
        "canonical",
        "og-description",
        "keywords",
        "og-site",
        "og-title"
    ],

    getLink: function(url, og) {

        url = url.replace(/\?.*/, '');

        return {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.ssl],
            html: '<a href="' + url + '" class="sq-embed-item">' + og.title + '</a><script src="https://cdn.sq-api.com/market/embed.js" id="sq-embed-js" charset="utf-8"></script>',
            'aspect-ratio': 0.80,
            'max-width': 570,
            'max-height': 645
        };
    },

    tests: [{
        page: "https://squareup.com/market/categories/home?hl=en-UA",
        selector: '.item-element-content'
    },
        "https://squareup.com/market/mobile-concepts/spider-coffee-table?hl=en-UA"
    ]
};