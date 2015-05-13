module.exports = {

    getLink: function(oembed) {
        return {
            href: oembed.icon_url,
            type: CONFIG.T.image,
            rel: [CONFIG.R.icon, CONFIG.R.oembed],
            width: oembed.icon_width,
            height: oembed.icon_height
        };
    }
};