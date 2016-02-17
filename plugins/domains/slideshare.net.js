var utils = require('../../lib/utils');
var $ = require('cheerio');

module.exports = {

    mixins: [
        "oembed-title",
        "oembed-author",
        "oembed-site",
        "canonical",
        "domain-icon"
    ],

    getMeta: function(meta) {

        if (!meta.slideshare) {
            return;
        }

        return {
            category: meta.slideshare.category,
            date: meta.slideshare.published,
            views: meta.slideshare.view_count
        };
    },

    getLink: function(oembed, options, cb) {


        if (oembed.slide_image_baseurl && oembed.slide_image_baseurl_suffix) {
            var links = [];

            var aspect = oembed.width / oembed.height;
            // It is actually hardcoded to 4:3 + 38px for nav bar :(
            // So we'll try to optimize it for option.maxwidth || 600px
            // For this, we'll get the aspect of the first slide - we need it anyway


            var firstSlide = (/^\/\//.test(oembed.slide_image_baseurl) ? 'http:' : '') + oembed.slide_image_baseurl + '1' + oembed.slide_image_baseurl_suffix;

            utils.getImageMetadata(firstSlide, options, function(error, data) {

                if (error || data.error) {

                    console.log ('Error getting first slide for Slideshare: ' + error);

                } else if (data.width && data.height) {

                    links.push({
                        href: firstSlide,
                        type: CONFIG.T.image, 
                        rel: CONFIG.R.thumbnail,
                        width: data.width,
                        height: data.height
                    });

                    var width = options.maxWidth || options.getProviderOptions('slideshare.width', 600);
                    aspect = width / (width / (data.width / data.height) + 38);

                }

                var $container = $('<div>');
                try {
                    $container.html(oembed.html);
                } catch(ex) {}

                var $iframe = $container.find('iframe');

                if ($iframe.length == 1) {
                    links.push({
                        href: $iframe.attr('src').replace('http:', ''),
                        type: CONFIG.T.text_html,
                        rel: [CONFIG.R.player, CONFIG.R.html5],
                        "aspect-ratio": aspect
                    });
                }

                links.push ({
                    href: oembed.thumbnail,
                    type: CONFIG.T.image,
                    rel: [CONFIG.R.thumbnail, CONFIG.R.oembed],
                    width: oembed.thumbnail_width,
                    height: data.height ? Math.round (oembed.thumbnail_width / (data.width / data.height)) : oembed.thumbnail_height
                });

                cb(null, links);                

            });
        }


    },

    tests: [{
        page: "http://www.slideshare.net/popular/today",
        selector: "a.iso_slideshow_link"
    },
        "http://www.slideshare.net/geniusworks/gamechangers-the-next-generation-of-business-innovation-by-peter-fisk#btnNext"
    ]
};