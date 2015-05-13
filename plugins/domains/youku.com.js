module.exports = {

    //http://v.youku.com/v_show/id_XNDkwNjg2NzQw.html?f=18736842    
    re: [
        /^https?:\/\/v\.youku\.com\/v_show\/id_(\w{3,})\.html/i,
        /^https?:\/\/news\.youku\.com\/(\w{3,})/i
    ],

    mixins: [
        "html-title",
        "description",
        "keywords"
    ],

    getLink: function (urlMatch) {

        return [{
            href: "http://player.youku.com/embed/"+ urlMatch[1],
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            "aspect-ratio": 16/10 //As stated it in docs
        }, {
                href: "http://youku.com/favicon.ico",
                type: CONFIG.T.image,
                rel: CONFIG.R.icon
        }]
    },

    tests: [
        "http://v.youku.com/v_show/id_XNDkwNjg2NzQw.html?f=18736842"
    ]
};