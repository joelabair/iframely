module.exports = {

    re: [
        /^https?:\/\/(?:www\.)?espnfc\.com\/[a-zA-Z\-0-9]+\/\d{2,3}\/video\/(\d+)\/?/i    
    ],

    mixins: ["*"],

    getData: function(urlMatch) {
            return {
                // some ESPN FC videos are not embeddable - there is no way to detect it except to check if the page 404s or not
                __promoUri: {
                    url: "http://www.espn.go.com/video/clip?id=" + urlMatch[1],
                    rel: 'no card' // value is not important
                }
            };

    },

    tests: [
        "http://www.espnfc.com/english-premier-league/23/video/2941397",
        // "http://www.espnfc.com/european-championship/74/video/2907466/watch-ronaldo-demands-moutinho-takes-pen"
    ]
};