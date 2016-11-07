var URL = require("url");

module.exports = {

    re: [        
        /^https?:\/\/m\.facebook\.com\/story\.php/i,
        /^https?:\/\/(?:www|m|business)\.facebook\.com\/login\.php/i,
        /^https?:\/\/m\.facebook\.com/i,
        /^https?:\/\/(?:touch\.|www\.)?facebook\.com\/l\.php\?u=/i,
        /^https?:\/\/www\.facebook\.com\/plugins\/video\.php\?href=/i        
    ],

    getData: function(url, meta, cb) {        

        // Little hack for FB mobile URLs, as FB embeds don't recognize it's own mobile links.
        if (url.indexOf("m.facebook.com/story.php") > -1) {
            return cb({redirect: url.replace("m.facebook.com/story.php", "www.facebook.com/permalink.php")});
        } else if (url.indexOf("m.facebook.com/") > -1) {
            return cb({redirect: url.replace("m.facebook.com", "www.facebook.com")});
        }

        if (url.indexOf('facebook.com/l.php?u=') > -1 || url.indexOf('facebook.com/plugins/video.php?href=') > -1) {
            var uri = URL.parse(url,true);
            var query = uri.query;

            // https://www.facebook.com/l.php?u=https://www.youtube.com/watch?v=OpONaotsgow
            // https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fcfgflint%2Fvideos%2Fvb.170211653052916%2F1080088265398579%2F%3Ftype%3D3&show_text=0&width=560
            return cb({redirect: decodeURIComponent(query.u || query.href)});
        }

        if (meta["html-title"] === "Facebook" || meta["html-title"] === "Leaving Facebook...") {
            // the content is not public
            return cb({responseStatusCode: 403});
        }

        if (/^https?:\/\/(?:www|m|business)\.facebook\.com\/login\.php/i.test(url)) {
            // redirect to login
            return cb({responseStatusCode: 403});
        }

        
        if (meta["html-title"] === "Content Not Found") {
            // for mobiles pages like https://m.facebook.com/story.php?story_fbid=654911224606798 fb doesn't return 404
            return cb({responseStatusCode: 404});
        }        

        cb(null);
    },

    tests: [{
        noFeeds: true
    }]
};