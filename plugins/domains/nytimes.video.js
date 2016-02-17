module.exports = {

    re: [
        /^https?:\/\/www\.nytimes\.com\/video\/\w+\/(\d+)\//,
        /^https?:\/\/www\.nytimes\.com\/video\/\w+\/\w+\/(\d+)\//
    ], 

    mixins: [
        "*"
    ],

    getLink: function(meta, urlMatch) {

        if (meta.medium == "video") {
            return {
                href: "http://graphics8.nytimes.com/bcvideo/1.0/iframe/embed.html?videoId=" + urlMatch[1] + "&playerType=embed",
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": 1.45 // seems to work well on diff widths                
            }
        }
    },

    tests: [
        "http://www.nytimes.com/video/nyregion/100000003880254/a-complicated-love-story.html?playlistId=1194811622241",
        "http://www.nytimes.com/video/realestate/100000003852081/block-by-block-hoboken.html?playlistId=1194811622241",
        "http://www.nytimes.com/video/world/middleeast/100000004055530/turkey-footage-shows-plane-blast.html"
    ]
};