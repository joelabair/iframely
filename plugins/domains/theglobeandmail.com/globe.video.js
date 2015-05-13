module.exports = {

    re: [
        /^https?:\/\/www\.theglobeandmail\.com\/[a-z\/\-]+video\/video+/i,
        /^https?:\/\/www\.theglobeandmail\.com\/video\//i
    ],

    mixins: [
        "favicon",
        "canonical",
        "og-description",
        "keywords",
        "og-site",
        "og-image",
        "og-title"
    ],

    getLink: function(meta) {

        return {
            href: meta["canonical"] + "?videoembed=true",
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            width: 480,
            height: 345
        };
    },

    tests: [
        "http://www.theglobeandmail.com/video/globe-now/video-globe-now-exploding-whale-ontario-election-dogecoin/article18394260/",
        "http://www.theglobeandmail.com/report-on-business/video/video-market-view-canadas-wild-weather-how-much-will-it-cost-consumers/article16325843/"
    ]
};