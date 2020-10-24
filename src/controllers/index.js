const path = require('path');
const request = require("request");
const mysql = require(path.join(__dirname, '../scripts/mysql.js'));
const moment = require('moment');

let returnErr = (res, err) => {
    res.json({code: 502, msg: JSON.stringify(err)});
    return false;
}
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



exports.wxinfo = (req, res) => {
    res.json({errno: 0})
}


exports.getProduct = (req, res) => {
    mysql.getProduct((err, result) => {
        if(err) {
            return returnErr(res, err);
        }
        res.json({code: 200, data: result})
    })
}


exports.saveAmount = (req, res) => {
    let obj = req.body;
    let values = [];
    //解析数据
    if(obj && obj.data) {
        var data = JSON.parse(obj.data);
        data.forEach((v, i) => {
            values.push([v.product_id, v.amount || 0, obj.date, moment().format('YYYY-MM-DD HH:mm:ss')]);
        });
    }
    mysql.saveAmount(values, (err, result) => {
        if(err) {
            console.log("err", err);
            return returnErr(res, err);
        }
        res.json({code: 200})
    })
}


exports.getWeight = (req, res) => {
    let all_topic_obj = {};
    let befor_date = Date.parse(new Date())/1000 - 31*24*60*60;
    let flag = 1;
    request(getZhiHuApi(req.query.people, 1), (error, response, body) => {
        let data = JSON.parse(body);
        pageRequest(data.paging.next, data, true);
        function pageRequest(url, pageRequestData, is_has_data) {
            if(is_has_data) {
                for(let answer_index = 0;answer_index<pageRequestData.data.length; answer_index++) {
                    let answer_obj = pageRequestData.data[answer_index];
                    if(answer_obj.created_time<befor_date) {
                        flag = 0;
                        //计算得分
                        for(let k in all_topic_obj) {
                            let topic_obj = all_topic_obj[k];
                            topic_obj.score = (topic_obj.answer_conut + 3*Math.log(topic_obj.voteup_count)/Math.log(2))*10;
                        }
                        res.json(all_topic_obj);
                        break;
                    }
                    answer_obj.question.topics.forEach((topic_obj) => {//遍历该问题话题数组
                        if(all_topic_obj[topic_obj.id]) {
                            all_topic_obj[topic_obj.id].answer_conut += 1;
                            all_topic_obj[topic_obj.id].voteup_count += answer_obj.voteup_count;
                        }else {
                            all_topic_obj[topic_obj.id] = {
                                answer_conut: 1,
                                voteup_count: answer_obj.voteup_count
                            }
                        }
                    })
                }
                request(url, (err, res, pageRequestBody) => {
                    let pageRequestData = JSON.parse(pageRequestBody);
                    pageRequest(pageRequestData.paging.next, pageRequestData, pageRequestData.data.length && flag);
                })
            }
        }
    });
}

function getZhiHuApi(people, type) {
    switch(type) {
        case 1://获取个人主页回答
            return `https://api.zhihu.com/people/${people}/answers?include=data[*].voteup_count,thanks_count,label_info,question.topics`;
            break;
    }
}