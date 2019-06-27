const app = require("express")();
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");

require("dotenv").config();

require("express-async-errors");

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

//To set
app.use(require("./routers"));

app.use(require("./errorHandler"));

async function start(silent = false) {
    try {
        await require("./lib/mongo").connect();
        if (!silent) console.log("Connected to database");

        await require("./lib/redis").connect();
        if (!silent) console.log("Connected to Redis");
        
        app.listen(process.env.appPort, process.env.appHost, () => {
            if (!silent) console.log(`Listenning on ${process.env.appHost}:${process.env.appPort}`);
        });
    } catch (error) {
        console.log(error);
        process.exit(-1);
    }
}

module.exports.app = app;
module.exports.start = start;