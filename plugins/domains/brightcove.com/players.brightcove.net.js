module.exports = {

    re: [
        /^https?:\/\/players\.brightcove\.net\/(\d+)\/([a-zA-Z0-9\-]+|default)_default\/index.html\?videoId=([a-zA-Z0-9\-:]+)/i
    ],

    mixins: [
        "*"
    ],

    //HTML parser will 404 if BC account or player does not exist.
    getLink: function(url, urlMatch) {

        var rel = [CONFIG.R.player, CONFIG.R.html5];

        // this comes from `brightcove-in-page-promo` only and follows whitelistRecord
        if (/&autoplay=true/.test(url)) {rel.push(CONFIG.R.autoplay);}

        return {
            href: '//players.brightcove.net/' + urlMatch[1] + '/' + urlMatch[2] + '_default/index.html?videoId=' 
            + urlMatch[3] + (/&autoplay=true/.test(url) ? '&autoplay=true' : '') + '&for=embed',
            rel: rel,
            type: CONFIG.T.text_html,
            // aspect-ratio not known, use default...
        };
    }

};    