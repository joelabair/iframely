module.exports = {

    highestPriority: true,

    getMeta: function(oembed) {
        return {
            site: oembed.site_name || oembed.provider_name
        };
    }
}