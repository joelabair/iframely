module.exports = {

    mixins: ["*"],

    getLink: function(twitter) {

        if (twitter.player) {
            return {
                href: (twitter.player.value || twitter.player).replace(/^https:\/\//, 'http://').replace(/&?twitter=true/, ''),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ration": twitter.player.width / twitter.player.height
            };
        }
    },

    tests: [
        "http://video.nhl.com/videocenter/console?catid=917&id=263236"
    ]
};