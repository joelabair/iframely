module.exports = {

    prepareLink: function(link) {

        if (link.href &&  link.type.indexOf('video/') > -1 && link.rel.indexOf(CONFIG.R.autoplay) > -1) {
            // Remove "autoplay" from html5 videos.
            link.rel.splice(link.rel.indexOf(CONFIG.R.autoplay), 1);
        }

        // Do not replace autoplay options if there is a rel autoplay, as otherwise the data may become inconsistent.
        if (link.href && link.rel.indexOf(CONFIG.R.player) > -1 && link.rel.indexOf(CONFIG.R.autoplay) == -1) {
            link.href = link.href.replace(/(auto_play)=true/i, '$1=false');
            link.href = link.href.replace(/(auto)=true/i, '$1=false');
            link.href = link.href.replace(/(auto)=1/i, '$1=0');
            link.href = link.href.replace(/(autoPlay)=1/i, '$1=0');
            link.href = link.href.replace(/(autoPlay)=true/i, '$1=false');
            link.href = link.href.replace(/(autoStart)=true/i, '$1=false');
            link.href = link.href.replace(/(autoStart)=1/i, '$1=0');
        }
    }
};