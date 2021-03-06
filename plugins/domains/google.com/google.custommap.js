// Custom Google Maps

module.exports = {

    re: [
        /^https?:\/\/(?:www\.)?google\.(?:com?\.)?[a-z]+\/maps\/d\/(?:edit|embed|viewer)\?(?:[^&]+&)*mid=([a-zA-Z0-9\.\-_]+)/i,
        /^https?:\/\/(?:www\.)?google\.(?:com?\.)?[a-z]+\/maps\/d\/u\/0\/(?:edit|embed|viewer)\?(?:[^&]+&)*mid=([a-zA-Z0-9\.\-_]+)/i,
        /^https?:\/\/mapsengine\.google\.(?:com?\.)?[a-z]+\/map\/u\/0\/(?:edit|embed|viewer)\?(?:[^&]+&)*mid=([a-zA-Z0-9\.\-_]+)/i,
        /^https?:\/\/mapsengine\.google\.(?:com?\.)?[a-z]+\/map\/u\/0\/viewer\?(?:[^&]+&)*mid=([a-zA-Z0-9\.\-_]+)/i,
        /^https?:\/\/mapse\.google\.(?:com?\.)?[a-z]+\/map\/ms\?(?:[^&]+&)*mid=([a-zA-Z0-9\.\-_]+)/i
    ],

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "twitter-title"
    ],

    getLink: function(urlMatch) {

        return {
            href: "https://www.google.com/maps/d/embed?mid=" + urlMatch[1] + "&source=iframely", // &for is added to allow direct links to embeds. 
                                                                                                // otherwise, won't pass Iframely's validation
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.ssl, CONFIG.R.html5],
            "aspect-ratio": 640 / 480
        };
    },

    tests: [{
            noFeeds: true
        },
        "https://www.google.com/maps/d/viewer?mid=zkaGBGYwQzao.kWqUdP2InpAI",
        "https://www.google.com/maps/d/edit?mid=zHfMwAb37EWA.kW-Lq0FR1l5c",
        "https://www.google.com/maps/d/viewer?mid=z_qsuFRasJVo.kKU-PVbA1F_0",
        "https://www.google.de/maps/d/embed?mid=zwd3SU4roCAo.kfq8xISQPTjQ"
    ]
};