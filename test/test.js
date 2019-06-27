const stack = require("../index");
const middlewares = stack.middlewares;

const schema = {
    $schema: "http://json-schema.org/draft-07/schema",
    type: "string",
}

const router = stack.router();
router.get("/", (req, res) => res.send("Hello world!"));
router.get("/apiKey", middlewares.apiKey, (req, res) => res.send("Access authorized " + req.appId));
router.get("/apiSecret", middlewares.apiSecret, (req, res) => res.send("Access authorized " + req.appId));
router.post("/schema", middlewares.validateBody(schema), (req, res) => res.send("Schema is valid"));

stack.use(router);

stack.setErrorHandler(function(err, req, res, next) {
    if(err) console.error(err);
    process.exit(-1);
})

stack.start();
