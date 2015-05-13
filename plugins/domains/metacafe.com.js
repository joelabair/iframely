module.exports = {

    re: [
        /^https?:\/\/www\.metacafe\.com\/watch\/(\d+)/i
    ],

    mixins: [
        "canonical",
        "favicon",
        "copyright",
        "og-site",
        "og-title",
        "og-description",
        "author",
        "og-image"
    ],

    getMeta: function(meta) {

        return {
            duration: meta.video.duration
        }
    },

    getLink: function(urlMatch) {

        return {
            href: "http://www.metacafe.com/embed/" + urlMatch[1] + "/",
            rel: CONFIG.R.player,
            type: CONFIG.T.text_html,
            "aspect-ratio": 440 / 280 // There is also 
                                    // meta.video_width / meta.video_height, 
                                    // but that ratio would actually be worse than the one from embed code
        }
    },

    tests: [{
        page: "http://www.metacafe.com",
        selector: ".ItemTitle a"
    },
        "http://www.metacafe.com/watch/9677285/django_unchained_movie_review"
    ]
};