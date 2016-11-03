module.exports = {

    re: /^https?:\/\/mp3\.zing\.vn\/([a-zA-Z-]+)\/[0-9a-zA-Z-]+\/(\w+)\.html/i,

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "og-description",
        "keywords",
        "geo-url",
        "og-site",
        "og-title"
    ],

    getLink: function(og, urlMatch) {

        var aspect;
        var type;

        if (urlMatch[1] === 'album') {
            aspect = 860/240;
            type = 'album';
        } else if (urlMatch[1] === 'video-clip') {
            aspect = 1280/720;
            type = 'video';
        } else if (og.type === 'music.song') {
            aspect = 600/168;
            type = 'song';
        } else {
            // Not player.
            return;
        }

        return [{
            href: 'http://mp3.zing.vn/embed/' + type + '/' + urlMatch[2] + '?autostart=false',
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player],
            "aspect-ratio": aspect
        }, {
            href: 'http://mp3.zing.vn/embed/' + type + '/' + urlMatch[2] + '?autostart=true',
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.autoplay],
            "aspect-ratio": aspect
        }]
    },

    tests: [{   // Tracks.
        page: 'http://mp3.zing.vn/',
        selector: '.list-item-width'
    },{         // Albums.
        page: 'http://mp3.zing.vn/',
        selector: '.des-inside ._trackLink'
    }, {        // Videos.
        page: 'http://mp3.zing.vn/',
        selector: '.album-item:not(.des-inside) ._trackLink'
    },
        "http://mp3.zing.vn/album/What-Is-Love-Single-Ho-Ngoc-Ha/ZWZC0CWW.html",
        "http://mp3.zing.vn/video-clip/Co-Don-Tu-Luc-Ay-Tim/ZW7W98FD.html",
        "http://mp3.zing.vn/bai-hat/Giang-Sinh-Minh-Anh-Acoustic-Version-Duong-Tran-Nghia-T-Akayz/ZW6FOOWO.html",
    ]
};