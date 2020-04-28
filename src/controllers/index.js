const path = require('path');
const request = require("request");
const mysql = require(path.join(__dirname, '../scripts/mysql.js'));
const moment = require('moment');

let getTopicAnswerUrl = (userId = "bei-piao-de-lu-62", topicId, offset = 0, limit = 20) => {
    return `https://www.zhihu.com/api/v4/members/${userId}/topics/${topicId}/answers?include=data%5B*%5D.comment_count&offset=${offset}&limit=${limit}&sort_by=created`;
}

exports.followingTopicContributions = (req, res) => {
    console.log(req.query);
    res.json({ data: 'ok' });
}

exports.watermark = (req, res) => {
    function getWatermarkApi(url) {
        //return `http://wx.qq-5.com/app/index.php?i=2&t=0&v=2.0&from=wxapp&c=entry&a=wxapp&do=query&m=tommie_duanshiping&sign=4ebafe13731541e89d27b3666a13ec1e&url=${url}`;
        return `https://shuiyin.cyf0611.top/app/index.php?i=3&t=0&v=2.0&from=wxapp&c=entry&a=wxapp&do=query&state=we7sid-fae43caae3e6e5282abf50386a6ad67c&m=tommie_duanshiping&sign=fe42bfd89ac5fc37577f09ee6d080343&url=${url}`;
    }
    let url = req.query && req.query.url;
    mysql.logs({
        time: moment().format('YYYY-MM-DD HH:mm:ss'),
        url: url,
        cip: req.connection.remoteAddress.replace('::ffff:', ''),
        type: 1,
    });

    if (!url) {
        return res.json({ errno:1 ,data: '参数不合法' });
    }

    request(getWatermarkApi(url), (err, response, body) => {
        let data = JSON.parse(body);
        if (data && !data.errno) {
            data.data.downurl = unescape(data.data.downurl);
        }
        res.json(data);
    });
}


