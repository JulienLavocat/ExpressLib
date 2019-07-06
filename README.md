# ExpressLib

A simple yet powerfull Express library to build REST API using Express, MongoDB and Redis.

# Features

 - Easy to setup using environment variables
 - Custom middlewares for JSON Web Tokens, API Key and Secret, JSON-Schema validation.
 - Security by default, using `helmet` to protect your app
 - Simple HTTP error management using `throw` and stack.HttpError
 - Redis and MongoDB client included
 - Gracefull shutdown (Not Yet Implemented)
 - JSON Web Tokens utils like `sign`, `verify`, and `refresh`

# TODO

 - Finish terminus support
 - Add request counter
 - Add request logger
 - Transform utils.validateClaims into a middleware

# Quick Start

## Install

```shell
$ npm install @piigo/expresslib
```

## Create .env

Create a new file named `.env` and then add the following text

```dosini
mongoUrl=<Your MongoDB connection url, ex: localhost:27017>
redisUrl=<Your redis url under the format host:port, ex: localhost:6379>
redisAuth=<Redis password, ex: qwerty>

appHost=<Address on which the http server will listen, ex: 0.0.0.0>
appPort=<Port on which the http server will listen, ex: 80>

jwtSecretKey=<Secret key to sign your JWT with, should be at least of 256 bits (1 character = 8 bits), ex: qwerty>
jwtExpiresIn=<Amount of time that your JWT will be valid, ex: 10m>

tokensPrefix=<Prefix to use for every apiKey and apiSecret, ex: tokens.>
```

Note: Currently you can provide environment variables throught a `.env` file.
You can still load environment variables in other way but don't forget to always have at least an empty .env file, otherwise application will crash.
A better support for environment variables will be provided in the near future, but pull request are always welcome.

## Usage

```javascript

const stack = require("@piigo/expresslib");
const middlewares = stack.middlewares;

const schema = {
    $schema: "http://json-schema.org/draft-07/schema",
    type: "string",
}

const router = stack.router();
router.get("/", (req, res) => res.send("Hello world!"));
router.get("/needApiKey", middlewares.apiKey, (req, res) => res.send("Access authorized " + req.appId));
router.get("/needApiSecret", middlewares.apiSecret, (req, res) => res.send("Access authorized " + req.appId));
router.post("/mustFollowSchema", middlewares.validateBody(schema), (req, res) => res.send("Schema is valid"));
router.get("/error", (req, res) => {throw new stack.HttpError("cancelled", "It works")});

stack.use(router);
stack.start();

```

# Documentation

## Middlewares

ExpressLib provides you with several middlewares

### apiKey

This middleware will check if there is an `apiKey` in either `body` or `query parameters`, fetch it's data in Redis and populates `req.apiKeyData` with it.

If one of those operations fails, a permission denied http error will be sent as result (if it's a redis error, it will be a http 500).

In order to create an API Key you just have to add a new key in redis (using SET) following this format:
`<tokensPrefix>.keys.<yourApiKey>` and set anythings you want as a value. Just remeber that the middleware will not perform any kind of parsing or transformation on data.
Here `<tokensPrefix>` refers to the `tokensPrefix` set in your configuration

### apiSecret

This middleware will check if there is an `apiSecret` in either `body` or `query parameters`, fetch it's data in Redis and populates `req.apiSecretData` with it.

If one of those operations fails, a permission denied http error will be sent as result (if it's a redis error, it will be a http 500).

In order to create an API Secret you just have to add a new key in redis (using SET) following this format:
`<tokensPrefix>.secret.<yourApiKey>` and set anythings you want as a value. Just remember that the middleware will not perform any kind of parsing or transformation on data.
Here `<tokensPrefix>` refers to the `tokensPrefix` set in your configuration.

### jwt

This middleware will check if a Json Web Token is present in either `body` or `query paramaters`, verify it's signature and populates req.jwt with the decoded token.

If one of those operations fails, a permission denied or invalid token error will be sent as  result.

Signature verification is achieved using the provided JWT-utils, which it-self use the `jwtSecretKey` environment variable.

### validateBody

This middleware will match the `req.body` using the provided json schema. If it fails an invalid argument error will be sent with the details of what's wrong in the request.

This middleware only match the body.
