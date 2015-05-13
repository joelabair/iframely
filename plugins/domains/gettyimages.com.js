var $ = require('cheerio');

module.exports = {

    // Photos only for now. TODO: Stay tuned for when video embeds become available
    re: /^https?:\/\/www\.gettyimages\.(com|ca|com\.au|be|dk|de|es|fr|in|ie|it|nl|co\.nz|no|at|pt|ch|fi|se|ae|co\.uk|co\.jp)\/detail\/([a-zA-Z0-9\-]+)\/[a-zA-Z0-9\-]+\/(\d+)/i,

    provides: 'getty',

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "og-description",
        "og-site",
        "twitter-title"
    ],

    getData: function(urlMatch, request, cb) {

        request({
            uri: "http://embed.gettyimages.com/preview/" + urlMatch[3],
            json: true,
            limit: 1, 
            timeout: 1000
        }, function(error, response, body) {

            if (error) {
                return cb(error);
            }
            if (body.message) {
                return cb(body.message);
            }
            cb(null, {
                getty: body
            });
        });
    },

    getLink: function(getty) {


        var $container = $('<div>');
        try {
            $container.html(getty.embedTag);
        } catch (ex) {}

        var $iframe = $container.find('iframe');


        // if embed code contains <iframe>, return src
        if ($iframe.length == 1) {
            
            return {
                href: $iframe.attr('src'),
                type: CONFIG.T.text_html,
                rel: CONFIG.R.image,
                "aspect-ratio": $iframe.attr('width') / $iframe.attr('height'),
                "max-width": $iframe.attr('width')
            };

        }
    },

    tests: [
        "http://www.gettyimages.ca/detail/photo/reflection-of-trees-high-res-stock-photography/103260792",
        "http://www.gettyimages.com/detail/illustration/pizza-icons-white-series-royalty-free-illustration/185819032",
        "http://www.gettyimages.de/detail/nachrichtenfoto/sylvie-meis-and-daniel-hartwich-attend-the-8th-show-of-nachrichtenfoto/493388593"
    ]
};