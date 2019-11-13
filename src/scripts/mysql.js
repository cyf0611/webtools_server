const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const moment = require('moment');

fs.readFile(path.join(__dirname, "../../config.json"), 'utf-8', (err, data) => {
    if (err) throw err;
    let config_data = JSON.parse(data);
    let connection = mysql.createConnection({
        host: config_data.host,
        user: config_data.user,
        password: config_data.password,
        database: config_data.database,
        charset: 'UTF8_GENERAL_CI',
        multipleStatements: true // 使用多条语句
    });
    connection.connect(err => {
        if (err) {
            console.log('数据库连接失败');
            console.log(err);
            return;
        }
        console.log('数据库连接成功');
    });


    connection.query(`select * from question`, (err, result) => {
        console.log(result);
    });
})