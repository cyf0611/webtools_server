const express = require('express');
const path = require('path');
const backRouter = express.Router();
const backController = require(path.join(__dirname, '../controllers/index.js'));


backRouter.get("/test", backController.test);

module.exports = backRouter;