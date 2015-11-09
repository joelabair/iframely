module.exports = {

    re: [
        /^https?:\/\/my\.mail\.ru\/(inbox|mail)\/[a-zA-Z0-9\._\-]+\/video\/(\d+)\/(\d+)\.html/i
    ],

    mixins: [
        "*"
    ],

    getLink: function(og, url) {

        if (og.type !== 'video.other') {
            return;
        }

        return {
                href: 'http://videoapi.my.mail.ru/videos/embed/mail/' + url.replace(/^https?:\/\/my\.mail\.ru\/(inbox|mail)\//, ''),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.ssl, CONFIG.R.html5],
                "aspect-ratio": 626 / 367
            };
    },

    tests: [
        "http://my.mail.ru/mail/ee.vlz/video/22396/44907.html",
        "http://my.mail.ru/mail/stryukova_lv/video/6177/1029.html"
    ]
};