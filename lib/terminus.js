class Terminus {

    constructor() {
        this.options = {
            timeout: 30000,
            signals: ["SIGTERM", "SIGINT"],
            healthChecks: {}
        };
    }

    healthcheck(handler, route = "/healthcheck") {
        this.options.healthChecks[route] = handler;
        return this;
    }
    beforeShutdown(handler) {
        beforeShutdownHandler = handler;
        return this;
    }
    setOnSignal(handler) {
        this.onSignalHandler = handler;
        return this;
    }
    afterShutdown(handler) {
        afterShutdownHandler = handler;
        return this;
    }
    logger(handler) {
        this.options.logger = handler;
        return this;
    }
    onSendFailureDuringShutdown(handler) {
        this.options.onSendFailureDuringShutdown = handler;
        return this;
    }
    create() {

        // const onSignalPromises = [
        //     require("./redis").close(),
        //     require("./mongo").close()
        // ];
        // if (this.onSignalHandler)
        //     onSignalPromises.push(this.onSignalHandler);

        // this.options.onSignal = () => Promise.resolve();
        return this.options;
    };
}

module.exports = Terminus;