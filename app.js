const request = require("request");
const path = require('path');
const Koa = require("koa2");
const app = new Koa();

let router = require(path.join(__dirname, "./src/routes/index.js"));










app.use(router);
app.listen(3000);
