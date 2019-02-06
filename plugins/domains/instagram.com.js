module.exports = {

    re: [
        /^https?:\/\/(?:www.)?instagram\.com\/(?:[a-zA-Z0-9_-]+\/)?(?:p|tv)\/([a-zA-Z0-9_-]+)\/?/i,
        /^https?:\/\/instagr\.am\/(?:[a-zA-Z0-9_-]+\/)?p\/([a-zA-Z0-9_-]+)/i,
        /^https?:\/\/instagram\.com\/(?:[a-zA-Z0-9_-]+\/)?(?:p|tv)\/([a-zA-Z0-9_-]+)$/i
    ],

    mixins: [
        "oembed-site",
        "oembed-author",
        // "og-image", it's the same as size L
        "domain-icon"
    ],

    getMeta: function (og, oembed) {
        
        return {
            title: og.title ? og.title.match(/([^•\"]+)/i)[0] : "Post on Instagram",
            description: oembed.title
        }

    },

    getLinks: function(urlMatch, meta, oembed, options) {
        var src = 'http://instagram.com/p/' + urlMatch[1] + '/media/?size=';

        var aspect = oembed.thumbnail_width && oembed.thumbnail_height ? oembed.thumbnail_width / oembed.thumbnail_height : 1/1

        var links = [
            // Images.
            {
                href: src + 't',
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail,
                width: Math.round(150 * aspect),
                height: 150 
            }, {
                href: src + 'm',
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail,
                width: Math.round(aspect * 306),
                height: 306
            }, {
                href: src + 'l',
                type: CONFIG.T.image,
                rel: (meta.og && meta.og.video) ? CONFIG.R.thumbnail : [CONFIG.R.image, CONFIG.R.thumbnail],
                width: Math.round(aspect * 612),
                height: 612
            }];

        if (meta.og && meta.og.video) {
            links.push({
                href: meta.og.video.url,
                type: meta.og.video.type || CONFIG.T.maybe_text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": meta.og.video.width / meta.og.video.height
            });
            links.push({
                href: meta.og.video.secure_url,
                type: meta.og.video.type || CONFIG.T.maybe_text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": meta.og.video.width / meta.og.video.height
            });
        }

        var media_only = options.getProviderOptions('instagram.media_only', false);

        if (oembed.type === 'rich' && !media_only) {

            var html = oembed.html;

            var showinfo = options.getProviderOptions(CONFIG.O.full, false) || options.getProviderOptions('instagram.showcaption', false); 
            if (showinfo && !/data\-instgrm\-captioned/i.test(html)) {
                html = html.replace(" data-instgrm-version=", " data-instgrm-captioned data-instgrm-version=");            
            }

            var hideinfo = options.getProviderOptions(CONFIG.O.compact, false);
            if (hideinfo && /data\-instgrm\-captioned/i.test(html)) {
                html = html.replace("data-instgrm-captioned ", "");
            }

            if (/src=\"\/\/www\.instagram.com\/embed\.js\"/i.test(html)) {
                html = html.replace ('src="//www.instagram.com/embed.js"', 'src="//platform.instagram.com/en_US/embeds.js"');
            }

            if (options.getProviderOptions('locale')) {
                html = html.replace('/en_US/embeds.js', '/' + options.getProviderOptions('locale').replace('-', '_') + '/embeds.js');
            }

            if (/instagram.com\/tv\//i.test(html)) {
                // html has /tv/ links in it - but those actually don't work as of 8/27/2018
                html = html.replace (/instagram.com\/tv\//g, 'instagram.com/p/');
            }

            links.push({
                html: html,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.app, CONFIG.R.ssl, CONFIG.R.html5, CONFIG.R.inline],
                'max-width': 660
            });
        }

        return links;
    },

    getData: function (url, options) {
        options.followHTTPRedirect = true; // avoid any issues with possible redirects

        if (!options.redirectsHistory && (/^https?:\/\/instagram\.com\//i.test(url) || /^http:\/\/www\.instagram\.com\//i.test(url))) {
            return {
                redirect: url.replace(/^http:\/\//, 'https://').replace(/^https:\/\/instagram\.com\//i, 'https://www.instagram.com')
            }
        }
    },

    tests: [{
        page: "http://blog.instagram.com/",
        selector: ".photogrid a"
    },
        "https://instagram.com/p/HbBy-ExIyF/",
        "http://www.instagram.com/p/a_v1-9gTHx/",
        "https://www.instagram.com/p/-111keHybD/",
        {
            skipMixins: [
                "oembed-title"
            ]
        }, {
            skipMethods: ['getData']
        }
    ]
};