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

# Quick Start

## Install

```shell
$ npm install @piigo/expresslib
```

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