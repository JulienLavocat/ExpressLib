const HttpError = require("./HttpError");
const Sentry = require("@sentry/node");
const JsonError = require("express-json-validator-middleware").ValidationError;
const MongoError = require("mongodb").MongoError;
const {
	JsonWebTokenError,
	NotBeforeError,
	TokenExpiredError
} = require("jsonwebtoken");

const transformers = require("./transformers");

module.exports = (error, req, res, next) => {
	transformError(error);

	if (error instanceof HttpError) {
		const status = error.httpStatus;
		const body = {
			success: false,
			error: error.toJSON()
		};
		return res.status(status).send(body);
	}

	console.error(error);

	let eventId;
	if(Sentry.getCurrentHub().getClient() !== null)
		eventId = Sentry.captureException(error);

	return unknowError(
		res,
		new HttpError(
			"internal",
			"An unknown error occured, please report it",
			eventId ? eventId : error.message
		)
	);
};

function transformError(error) {
	if (error instanceof JsonError) error = transformers.json(error);

	if (error instanceof MongoError) error = transformers.mongo(error);

	if (error instanceof JsonWebTokenError) error = transformers.jwt(error);

	if (error instanceof NotBeforeError) error = transformers.nbf(error);

	if (error instanceof TokenExpiredError)
		error = transformers.tokenExpired(error);
}

function unknowError(res, error) {
	const status = error.httpStatus;
	const body = {
		error: error.toJSON()
	};
	return res.status(status).send(body);
}
