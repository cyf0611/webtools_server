const express = require('express');
const path = require('path');
const backRouter = express.Router();
const backController = require(path.join(__dirname, '../controllers/index.js'));

//获取当前角色关注的话题
backRouter.get("/following-topic-contributions", backController.followingTopicContributions);

module.exports = backRouter;