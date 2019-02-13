module.exports = {

    re: [
        /^https?:\/\/(?:www\.)?espn\.com\/video\/clip\?id=espn:(\d+)/i,
        /^https?:\/\/(?:www\.)?espn\.com\/video\/clip\?id=(\d+)/i,
        /^https?:\/\/xgames\.espn\.com\/xgames\/video\/(\d+)\//i,
        /^https?:\/\/(?:www\.)?secsports\.com\/video\/(\d+)/i,
        /^https?:\/\/(?:www\.)?espn\.com\/(?:videohub\/)?video\/clip\/_\/id\/(\d+)/i,
        /^https?:\/\/broadband\.espn\.go\.com\/video\/clip\?id=(\d+)/i
    ],

    mixins: ["*"],

    getLink: function(urlMatch) {

        // Fallback to Twitter:player as it was before March 8, 2016

        var player_id = urlMatch[1] === 'xgmames' ? 'id=' + urlMatch[2] + '&omniReportSuite=wdgespexpn' :
                        'cms=espn&id=espn:' + urlMatch[2];

        return {
            href: 'https://espn.go.com/video/iframe/twitter/?' + player_id,
            type: CONFIG.T.maybe_text_html, // ping href to check that it doesn't 404
            rel: [CONFIG.R.player, CONFIG.R.html5],
            "aspect-ratio": 16/9
        };
    },

    tests: [{
        noFeeds: true
    },
        "http://www.espn.com/video/clip?id=espn:14780138",
        "http://espn.go.com/video/clip?id=13328484",
        "http://xgames.espn.com/xgames/video/13380522/real-moto-drake-mcelroy",
        "http://www.secsports.com/video/17630059",
        "http://www.espn.com/video/clip/_/id/18883925",
        "http://www.espn.com/videohub/video/clip/_/id/18883925/categoryid/2378529",
        "http://broadband.espn.go.com/video/clip?id=17802645"
    ]
};