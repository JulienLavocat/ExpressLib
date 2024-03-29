const stack = require("./index");
const {
    apiKey,
    apiSecret,
    needConfig,
    validateBody,
    isTokenBlacklisted,
    jwt
} = stack.middlewares;
const utils = require("./lib/utils");

const schema = {
    $schema: "http://json-schema.org/draft-07/schema",
    type: "string",
}

const router = stack.router();
router.get("/",                                                                          (req, res) => res.send("Hello world!"));
router.get("/apiKey",                                               apiKey,              (req, res) => res.send(req.appConfig));
router.get("/apiSecret",                                            apiSecret,           (req, res) => res.send("Access authorized " + req.appId));
router.post("/schema",    validateBody(schema),                                          (req, res) => res.send("Schema is valid"));
router.get("/error",                                                                     (req, res) => {
    const err = new stack.HttpError("cancelled", "It works");
    err.setCode("not-found");
    err.setMessage("Can't found");
    err.setDetails({done: true});
    throw err;
});
router.get("/hang",                                                                      (req, res) => {
    setTimeout(() => {
        res.send("Hanged !");
    }, 4000)
});
router.get("/jwt", jwt, (req, res) => {

    try {
        utils.validateClaims(req.jwt, {
            type: "auth",
            iss: "indiebackend"
        });
        res.send("Authorized");
    } catch (error) {
        throw error;
    }
});

stack.use(router);

stack.start();
