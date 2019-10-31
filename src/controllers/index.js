const request = require("request");

let getTopicAnswerUrl = (userId = "bei-piao-de-lu-62", topicId, offset = 0, limit = 20) => {
    return `https://www.zhihu.com/api/v4/members/${userId}/topics/${topicId}/answers?include=data%5B*%5D.comment_count&offset=${offset}&limit=${limit}&sort_by=created`;
}

exports.followingTopicContributions = (req, res) => {
    request.get("https://www.zhihu.com/api/v4/members/bei-piao-de-lu-62/following-topic-contributions", (error, response, body) => {
        if (error) {
            res.end(error);
            return;
        }
        let data = JSON.parse(body).data;
        let result = [];
        data.forEach(topicObj => {
            let topicAnswerUrl = getTopicAnswerUrl("bei-piao-de-lu-62", topicObj.topic.id);
            console.log(topicAnswerUrl);
            (async () => {
                await new Promise(resolve => {
                    request.get(topicAnswerUrl, (topicAnsweErr, topicAnsweRes, topicAnsweBody) => {
                        if (topicAnsweErr) {
                            res.end(error);
                            return;
                        }

                        let comment_counts = JSON.parse(topicAnsweBody).data.reduce((accumulator, currentValue) => {
                            return accumulator + currentValue.comment_count;
                        });
                        result.push(comment_counts);
                        resolve(result);
                    });
                });
                console.log(result);
                res.end(result);
            })();
        })

    });
}


