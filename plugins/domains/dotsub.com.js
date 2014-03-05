module.exports = {

    mixins: [
        "oembed-title",
        "canonical",
        "oembed-site",
        "oembed-author",
        "oembed-duration",
        "oembed-description",
        "oembed-video-responsive",
        "og-image",
        "favicon"
    ],

    getLink: function(oembed) {

        var rx = /(?:(?:http[s]?:)?\/\/(?:.*\.)?)dotsub\.com\/(?:view|media)\/([^\/\"\'\?#&\s\[\]\(\)]+)/i;
        var m = rx.exec(oembed.html);
        if (m && m[1]) {
            oembed.video_id = m[1];
            return [{
                href: "//dotsub.com/media/" + oembed.video_id + '/embed/eng',
                type: CONFIG.T.text_html,
                rel: CONFIG.R.player,
                "aspect-ratio": oembed.width / oembed.height
            }];
        }
    },

    tests: [
        "http://dotsub.com/view/6c5d7514-5656-476a-9504-07dd4e2f6509"
    ]
};
