var USUAL_HEIGHT = 599;
var USUAL_WIDTH = 1003;

function makeMediaResponsive(link) {
    if (!link.media) {
        link.media = {};
    }

    var m = link.media;

    if (!m["aspect-ratio"]) {

        if (m.width && m.height) {
            m["aspect-ratio"] = m.width / m.height;
            delete m.width;
            delete m.height;
        } else {
            m["aspect-ratio"] = CONFIG.DEFAULT_ASPECT_RATIO || 4 / 3;
        }

        if (typeof m["aspect-ratio"] === 'number') {
            m["aspect-ratio"] = Math.round(m["aspect-ratio"] * 10000) / 10000;
        }
    }

    if (!m["max-width"] && m["aspect-ratio"] && m["aspect-ratio"] < 1 && (USUAL_WIDTH / m["aspect-ratio"] > USUAL_HEIGHT)) {
        m["max-width"] = Math.round(m["aspect-ratio"] * USUAL_HEIGHT);
    }
}

function isEmpty(obj) {
    for (var key in obj) {
        return false;
    }
    return true;
}

function moveMediaAttrs(link) {

    if (!link.media) {
        var m = {};
        // TODO: make for()
        CONFIG.MEDIA_ATTRS.forEach(function(attr) {
            if (attr in link) {
                var v = link[attr];

                // All values converted tu numbers.
                if (typeof v === 'string') {

                    // "4/3"
                    // "4:3"
                    var devided = v.match(/^\s*([\d.]+)(?:\/|:)([\d.]+)\s*$/);
                    if (devided) {
                        v = devided[1] / devided[2];
                    } else {
                        try {
                            v = parseFloat(v);
                        } catch (ex) {
                            v = null;
                        }
                    }
                }

                if (!v) {
                    delete link[attr];
                    return;
                }

                if (typeof v === 'number') {
                    v = Math.round(v * 10000) / 10000;
                }

                m[attr] = v;
                delete link[attr];
            }
        });

        var _imageMeta = link._imageMeta;

        if (_imageMeta && !_imageMeta.error) {

            if (_imageMeta.width && _imageMeta.height && _imageMeta.type) {
                m.width = link._imageMeta.width;
                m.height = link._imageMeta.height;
                link.type = "image/" + link._imageMeta.type.toLowerCase();
            }
        }

        if (!isEmpty(m)) {
            link.media = m;
        }
    }
}

module.exports = {

    notPlugin: true,

    // Used from outside.

    prepareLink: function(link, options) {

        moveMediaAttrs(link);

        if (link.rel.indexOf('responsive') > -1
            && link.rel.indexOf(CONFIG.R.player) > -1) {

            makeMediaResponsive(link);
        }
    }
};
