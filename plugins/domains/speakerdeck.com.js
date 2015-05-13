var $ = require('cheerio');

module.exports = {

    mixins: [
        "oembed-title",
        "oembed-site",
        "oembed-author"
    ],

    getLink: function (oembed) {
        var $container = $('<div>');
        try {
            $container.html(oembed.html);
        } catch(ex) {}

        var $iframe = $container.find('iframe');
        var doc; 

        if ($iframe.length == 1) {
            doc = {
                href: $iframe.attr('src'),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": oembed.width / oembed.height 
            }
        }

        var thumbnail;

        if (doc) {
            var id = doc.href.match(/\/\/speakerdeck\.com\/player\/([a-z0-9\-]+)/i)[1];

            if (id) {
                thumbnail = {
                    href: 'https://speakerd.s3.amazonaws.com/presentations/' + id + '/slide_0.jpg',
                    type: CONFIG.T.image,
                    rel: [CONFIG.R.thumbnail]
                };
            }
        }

        return [doc, thumbnail, {
                href: 'https://speakerdeck.com/favicon.ico',
                type: CONFIG.T.image,
                rel: [CONFIG.R.icon]
        }];
    },


    tests: [
        "https://speakerdeck.com/gr2m/rails-girls-zurich-keynote?slide=3"
    ]
};
