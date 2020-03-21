const request = require("request");
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const moment = require('moment');

app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.json());

let secretOrPrivateKey = "hf8d25rge*fhr2saf1we*s";// 这是加密的key（密钥）


// app.use('/login', (req, res) => {
//     res.setHeader("Content-Type", "text/json;charset=utf-8");
//     var obj = req.body;

//     if (obj.username === 'admin' && obj.password == '123456') {
//         let token = jwt.sign(obj, secretOrPrivateKey, {
//             expiresIn: 60 * 60 * 24 * 7  // 7天过期
//         });
//         res.json({ code: 200, msg: '登录成功', token: token });
//     } else {
//         res.json({ code: 300, msg: '密码或账户错误' });
//     }

// });

app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", '*'); //request.getHeader("Origin")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-csrf-token, token");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", 'true'); //带cookies
    let token = req.headers.token;
    jwt.verify(token, secretOrPrivateKey, (err, decode) => {
        if (!err) {  //  时间失效的时候 || 伪造的token
            res.json({ code: 10010, msg: '登录失效' });
            return;
        } else {
            next();
        }
    })
})

const router = require(path.join(__dirname, './src/routes/index.js'));





app.use("/api", router);

const server = app.listen(3000, () => {
    let port = server.address().port;
    console.log('服务开启成功，监听 %s 端口,supervisor', port, moment().format('YYYY-MM-DD HH:mm:ss'));
});
