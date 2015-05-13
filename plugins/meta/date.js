module.exports = {

    getMeta: function(meta, url) {

        var date = meta.date || meta.pubdate || meta.lastmod || (meta.article && meta.article.published_time);

        // Can be multiple dates.
        if (date && date instanceof Array) {
            date = date[0];
        }

        //if no date - try to extract it from URL, like /2014/12/03
        if (!date) {
            var urlMatch = url.match(/\/(\d{4})\/(\d{2})\/(\d{2})/);
            if (urlMatch) {
                date = urlMatch[1] + '-' + urlMatch[2] + '-' + urlMatch[3];
            }
        }

        return {
            date: date
        };
    }
};