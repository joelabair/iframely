var GracefulCluster = require('graceful-cluster').GracefulCluster;
var sysUtils = require('./utils');

process.title = 'iframely-cluster';

GracefulCluster.start({
    log: sysUtils.log,
	workersCount: process.env.NODE_FORKS,
    shutdownTimeout: CONFIG.SHUTDOWN_TIMEOUT,
    disableGraceful: CONFIG.DEBUG,
    restartOnTimeout: CONFIG.CLUSTER_WORKER_RESTART_ON_PERIOD,
    restartOnMemory: CONFIG.CLUSTER_WORKER_RESTART_ON_MEMORY_USED,
    serverFunction: function() {
        require('./server');
    }
});
