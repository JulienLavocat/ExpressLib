//All code is extracted from firebase-functions sdk

var undefined;

/**
 * Standard error codes for different ways a request can fail, as defined by:
 * https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto
 *
 * This map is used primarily to convert from a client error code string to
 * to the HTTP format error code string, and make sure it's in the supported set.
 */
const errorCodeMap = {
    ok: 'OK',
    cancelled: 'CANCELLED',
    unknown: 'UNKNOWN',
    'invalid-argument': 'INVALID_ARGUMENT',
    'deadline-exceeded': 'DEADLINE_EXCEEDED',
    'not-found': 'NOT_FOUND',
    'already-exists': 'ALREADY_EXISTS',
    'permission-denied': 'PERMISSION_DENIED',
    unauthenticated: 'UNAUTHENTICATED',
    'resource-exhausted': 'RESOURCE_EXHAUSTED',
    'failed-precondition': 'FAILED_PRECONDITION',
    aborted: 'ABORTED',
    'out-of-range': 'OUT_OF_RANGE',
    unimplemented: 'UNIMPLEMENTED',
    internal: 'INTERNAL',
    unavailable: 'UNAVAILABLE',
    'data-loss': 'DATA_LOSS',
};
/**
 * An explicit error that can be thrown from a handler to send an error to the
 * client that called the function.
 */
class HttpError extends Error {
    constructor(code, message, details) {
        super(message);
        // This is a workaround for a bug in TypeScript when extending Error:
        // tslint:disable-next-line
        // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, HttpError.prototype);
        if (!errorCodeMap[code]) {
            throw new Error('Unknown error status: ' + code);
        }
        this.code = code;
        this.details = details;
    }

    setCode(code) {
        return new HttpError(code, this.message, this.details);
    }
    setMessage(msg) {
        return new HttpError(this.code, msg, this.details);
    }
    setDetails(details) {
        return new HttpError(this.code, this.message, details);
    }

    /**
     * @internal
     * A string representation of the Google error code for this error for HTTP.
     */
    get status() {
        return errorCodeMap[this.code];
    }
    /**
     * @internal
     * Returns the canonical http status code for the given error.
     */
    get httpStatus() {
        switch (this.code) {
            case 'ok':
                return 200;
            case 'cancelled':
                return 499;
            case 'unknown':
                return 500;
            case 'invalid-argument':
                return 400;
            case 'deadline-exceeded':
                return 504;
            case 'not-found':
                return 404;
            case 'already-exists':
                return 409;
            case 'permission-denied':
                return 403;
            case 'unauthenticated':
                return 401;
            case 'resource-exhausted':
                return 429;
            case 'failed-precondition':
                return 400;
            case 'aborted':
                return 409;
            case 'out-of-range':
                return 400;
            case 'unimplemented':
                return 501;
            case 'internal':
                return 500;
            case 'unavailable':
                return 503;
            case 'data-loss':
                return 500;
            // This should never happen as long as the type system is doing its job.
            default:
                throw 'Invalid error code: ' + this.code;
        }
    }
    /** @internal */
    toJSON() {
        const json = {
            status: this.status,
            message: this.message,
        };
        if (typeof this.details !== "undefined") {
            json.details = this.details;
        }
        return json;
    }
}

module.exports = HttpError;