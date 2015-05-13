var cheerio = require('cheerio');

module.exports = {

    getLink: function(oembed, whitelistRecord) {

        var $container = cheerio('<div>');
        try{
            $container.html(oembed.html5 || oembed.html);
        } catch(ex) {}

        var $iframe = $container.find('iframe');

        if ($iframe.length == 1) {

            var href = $iframe.attr('src');

            if (whitelistRecord.isAllowed('oembed.video', 'ssl') || whitelistRecord.isAllowed('oembed.rich', 'ssl')) {
                href = href.replace(/^http:\/\//i, '//');
            }

            return {
                href: href,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.oembed],
                "aspect-ratio": oembed.width / oembed.height
            };
        }
    }
};