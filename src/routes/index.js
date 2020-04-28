const express = require('express');
const path = require('path');
const backRouter = express.Router();
const backController = require(path.join(__dirname, '../controllers/index.js'));

//获取当前角色关注的话题
backRouter.get("/collectData", backController.followingTopicContributions);
//水印解析
backRouter.get("/watermark", backController.watermark);
//聊天转账生成器
backRouter.get("/wxinfo", backController.wxinfo);




module.exports = backRouter;