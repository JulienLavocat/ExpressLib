const app = require("express")();
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");

require("dotenv").config();

const redisEnabled = parseBoolean(process.env.redisEnabled);
const mongodbEnabled = parseBoolean(process.env.mongodbEnabled);

require("express-async-errors");

let errorHandlerSet = false;

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

async function start(callback, silent = false) {
	try {

		if (!errorHandlerSet)
			app.use(require("./errors/errorHandler"));

		if(mongodbEnabled) {
			await require("./mongo").connect();
			if (!silent) console.log("Connected to mongodb");
		}

		if(redisEnabled) {
			await require("./redis").connect();
			if (!silent) console.log("Connected to Redis");
		}

		//const server = http.createServer(app);

		app.listen(process.env.appPort, process.env.appHost, () => {
			if (!silent) console.log(`Listenning on ${process.env.appHost}:${process.env.appPort}`);
			callback();
		});

	} catch (error) {
		console.log(error);
		process.exit(-2);
	}
}

function use(path, handlers) {
	if (!handlers)
		app.use(path);
	else
		app.use(path, handlers);
}

function setErrorHandler(errorHandler) {
	app.use(errorHandler);
	errorHandlerSet = true;
}

function enableMetrics(acceptor) {
	app.use("/metrics", acceptor, require("./metrics"));
}

function parseBoolean(value) {
	if(value === "true")
		return true;
	if(value === "false")
		return false;

	return false;
}

exports.app = app;
exports.start = start;
exports.use = use;
exports.enableMetrics = enableMetrics;
exports.setErrorHandler = setErrorHandler;