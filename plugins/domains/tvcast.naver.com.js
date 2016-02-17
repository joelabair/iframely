var cheerio = require('cheerio');

module.exports = {

    re: [
        /^https?:\/\/tvcast\.naver\.com\/v\/(\d+)/i
    ],

    mixins: ['*'],

    provides: 'naver_html',

    getData: function(urlMatch, meta, request, cb) {

        if (!meta.naver || !meta.naver.video || !meta.naver.video.id) {
            return cb (null);
        } else {

            request({            
                uri: "http://tvcast.naver.com/api/clipShareHtml?videoId=" + meta.naver.video.id,
                json: true,
                prepareResult: function(error, response, body, cb) {

                    if (error) {
                        return cb(error);
                    }
                    cb(null, {
                        naver_html: body[0] // they return an array
                    });
                }
            }, cb);
        }
    },

    getLink: function(naver_html) {

        var $container = cheerio('<div>');
        try{
            $container.html(naver_html);
        } catch(ex) {}

        var $iframe = $container.find('iframe');

        if ($iframe.length == 1) {

            return {
                href: $iframe.attr('src').replace(/isAutoPlay=true/, 'isAutoPlay=false'),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": $iframe.attr('height') && $iframe.attr('width') ? $iframe.attr('width') / $iframe.attr('height') : CONFIG.DEFAULT_ASPECT_RATIO
            };
        }        

    },

    tests: [{
        noFeeds: true
    },
        "http://tvcast.naver.com/v/462633"
    ]
};