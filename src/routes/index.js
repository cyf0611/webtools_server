const Router = require('koa-router')

let Route = new Router();

Route.get("/a", async (ctx) => {
    console.log("object");
    ctx.body = 'test22323';
})

module.exports = Route.routes();