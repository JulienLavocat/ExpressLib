const app = require("express")();
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
        
const confOutput = require("dotenv").config();
if(confOutput.error) {
    console.error(confOutput.error);
    process.exit(-1);
}

require("express-async-errors");

let errorHandlerSet = false;

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

async function start(silent = false) {
    try {

        if (!errorHandlerSet)
            app.use(require("./errorHandler"));

        await require("./mongo").connect();
        if (!silent) console.log("Connected to database");

        await require("./redis").connect();
        if (!silent) console.log("Connected to Redis");

        app.listen(process.env.appPort, process.env.appHost, () => {
            if (!silent) console.log(`Listenning on ${process.env.appHost}:${process.env.appPort}`);
        });
    } catch (error) {
        console.log(error);
        process.exit(-2);
    }
}

function use(handler) {
    app.use(handler);
}

function setErrorHandler(errorHandler) {
    app.use(errorHandler);
    errorHandlerSet = true;
}

exports.app = app;
exports.start = start;
exports.use = use;
exports.setErrorHandler = setErrorHandler;