import * as e from "express";
import IORedis from "ioredis";
import { MongoClient } from "mongodb";
import {JsonWebTokenError} from "jsonwebtoken";

declare namespace expresslib {
  /**
   * Start the express app
   * @param silent define if start should be silent
   */
  function start(silent?: boolean);
  /**
   *  Use a request handler (similar to express.use)
   * @param handler Request handler to use
   */
  function use(handler: e.IRouterHandler);
  /**
   * Set a new error handler, if not set a default one will be used
   * @param errorHandler Error handler function to use
   */
  function setErrorHandler(errorHandler: Function);
  /**
   * Return the express instance used by the lib
   */
  var express: e.Express;
  /**
   * Return  the terminus object used for healthcheck and gracefull shutdown
   */
  var terminus: Terminus;
  /**
   * Return a Router class
   */
  var router: e.Router;
  /**
   * Return the current redis instance
   */
  var redis: IORedis.Redis;
  /**
   * Return the currently used MongoClient instance
   */
  var mongodb: MongoClient;
  /**
   * Return all availables middlewares from the lib
   */
  var middlewares: Middlewares;
  /**
   * Return Json Web Tokens utilities (sign, verify, refresh)
   */
  var jwt: JWT;

  /**
   * Possible values:
   * - 'cancelled': The operation was cancelled (typically by the caller).
   * - 'unknown': Unknown error or an error from a different error domain.
   * - 'invalid-argument': Client specified an invalid argument. Note that this
   *   differs from 'failed-precondition'. 'invalid-argument' indicates
   *   arguments that are problematic regardless of the state of the system
   *   (e.g. an invalid field name).
   * - 'deadline-exceeded': Deadline expired before operation could complete.
   *   For operations that change the state of the system, this error may be
   *   returned even if the operation has completed successfully. For example,
   *   a successful response from a server could have been delayed long enough
   *   for the deadline to expire.
   * - 'not-found': Some requested document was not found.
   * - 'already-exists': Some document that we attempted to create already
   *   exists.
   * - 'permission-denied': The caller does not have permission to execute the
   *   specified operation.
   * - 'resource-exhausted': Some resource has been exhausted, perhaps a
   *   per-user quota, or perhaps the entire file system is out of space.
   * - 'failed-precondition': Operation was rejected because the system is not
   *   in a state required for the operation's execution.
   * - 'aborted': The operation was aborted, typically due to a concurrency
   *   issue like transaction aborts, etc.
   * - 'out-of-range': Operation was attempted past the valid range.
   * - 'unimplemented': Operation is not implemented or not supported/enabled.
   * - 'internal': Internal errors. Means some invariants expected by
   *   underlying system has been broken. If you see one of these errors,
   *   something is very broken.
   * - 'unavailable': The service is currently unavailable. This is most likely
   *   a transient condition and may be corrected by retrying with a backoff.
   * - 'data-loss': Unrecoverable data loss or corruption.
   * - 'unauthenticated': The request does not have valid authentication
   *   credentials for the operation.
   */
  type FunctionsErrorCode =
    | "ok"
    | "cancelled"
    | "unknown"
    | "invalid-argument"
    | "deadline-exceeded"
    | "not-found"
    | "already-exists"
    | "permission-denied"
    | "resource-exhausted"
    | "failed-precondition"
    | "aborted"
    | "out-of-range"
    | "unimplemented"
    | "internal"
    | "unavailable"
    | "data-loss"
    | "unauthenticated";
  /**
   * An explicit error that can be thrown from a handler to send an error to the
   * client that called the function.
   */
  class HttpError extends Error {
    /**
     * A standard error code that will be returned to the client. This also
     * determines the HTTP status code of the response, as defined in code.proto.
     */
    readonly code: FunctionsErrorCode;
    /**
     * Extra data to be converted to JSON and included in the error response.
     */
    readonly details?: any;
    constructor(code: FunctionsErrorCode, message: string, details?: any);
  }
}

interface Middlewares {

	/**
	 * Check if a valid api key is contained in either req.body.apiKey or req.query.apiKey
	 */
	apiKey();
	/**
	 * Check if a valid api secret is contained in either req.body.apiSecret or req.query.apiSecret
	 */
	apiSecret();
	/**
	 * Check if req.body match the provided JSON-chema
	 */
	validateBody(schema: any);

}

interface JWT {
  /**
   * Generate and sign a JWT using the provided secret key
   * @param payload Data to encode in token
   */
  sign(payload);
  /**
   * Verify if token has been issued by service, and return it's decoded content
   * @param token Token to verify
   * @throws JsonWebTokenError if verification failed
   */
  verify(token);
  /**
   * Verify and then re-issue a valid token re-using the old token payload
   * @param token Token to refresh
   * @throws JsonWebTokenError if token refresh failed
   */
  refresh(token);
}

/**
 * Not functionnal, shoudn't be used
 */
interface Terminus {

  

}

export = expresslib;
