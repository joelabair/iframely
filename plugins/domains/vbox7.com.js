module.exports = {

    re: [        
        /https?:\/\/vbox7\.com\/play:(\w+)/i
    ],

    mixins: ["*"],

    getLinks: function(urlMatch) {

        return {
            href: "//vbox7.com/emb/external.php?vid=" + urlMatch[1],
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player,  CONFIG.R.html5],
            "aspect-ratio": 16 / 9
        }
    },

    tests: [
        "http://vbox7.com/play:86abb51a7d?pos=src"
    ]
};