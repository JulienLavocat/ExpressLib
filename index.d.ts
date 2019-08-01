import * as e from "express";
import IORedis from "ioredis";
import { MongoClient } from "mongodb";
import { JsonWebTokenError } from "jsonwebtoken";

declare namespace expresslib {
  /**
   * Start the express app
   * @param silent define if start should be silent
   */
  function start(callback?: Function, silent?: boolean): void;
  /**
   * Use one or more request handlers (similar to express.use)
   * @param handler Request handlers to use
   */
  function use(handlers: e.RequestHandler[]): void;
  /**
   * Use one or more request handlers (similar to express.use) path-based
   * @param path Path on which handler will apply
   * @param handler Request handlers to use
   */
  function use(path: string, handlers: e.RequestHandler[]): void;
  /**
   * Set a new error handler, if not set a default one will be used
   * @param errorHandler Error handler function to use
   */
  function setErrorHandler(errorHandler: Function): void;
  /**
   * Return the express instance used by the lib
   */
  var express: e.Express;
  /**
   * Return an express Router class
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
   * Return library utility functions
   */
  var utils: Utils;

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
    /**
     * Return a new instance with of this error with the updated code
     */
    setCode(code: FunctionsErrorCode): void;
    /**
     * Return a new instance with of this error with the updated message
     */
    setMessage(message: string): void;
    /**
     * Return a new instance with of this error with the updated details
     */
    setDetails(details: any): void;
  }
}

interface Middlewares {
  /**
   * Check if a valid api key is contained in either req.body.apiKey or req.query.apiKey
   */
  apiKey(): void;
  /**
   * Check if a valid api secret is contained in either req.body.apiSecret or req.query.apiSecret
   */
  apiSecret(): void;
  /**
   * Check if req.body match the provided JSON-chema
   */
  validateBody(schema: any): void;
  /**
   * Check if req.body.token or req.query.token contains a valid JWT
   */
  jwt(): void;
  /**
   * Check if JWT isn't blacklisted (on logout by example)
   */
  isTokenBlacklisted(): void;
}

interface JWT {
  /**
   * Generate and sign a JWT using the provided secret key
   * @param {object} payload Data to encode in token
   * @return {string} JWT containing the payload
   */
  sign(payload: object): string;
  /**
   * Verify if token has been issued by service, and return it's decoded content
   * @param {string} token Token to verify
   * @return {object} Claims of the provided JWT
   * @throws JsonWebTokenError if verification failed
   */
  verify(token: string): any;
  /**
   * Decode a token and return it's claims. This method will NOT verify if the token
   * is VALID.
   * @param {string} token The token to decode
   * @return {object} Claims of the provided JWT
   */
  decode(token: string): any;
  /**
   * Verify and then re-issue a valid token re-using the old token payload
   * @param {string} token Token to refresh
   * @return {string} A refreshed token
   * @throws JsonWebTokenError if token refresh failed
   */
  refresh(token: string): string;
}

interface Utils {
  /**
   * Validate the current token claims against the provided ones.
   * @param {objec} claims Claims that the token should match
   * @throws HttpError with permission denied if token doesn't match one of the expected claims.
   */
  validateClaims(claims: object): void;
}

export = expresslib;
