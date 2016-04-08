#!/usr/bin/env node

var program = require('commander');

var pkg = require('./package.json');

var fs = require('fs');

program.version(pkg.version);

program.option('-u, --user <user>', 'user name');
program.option('-d, --date <date>', 'date');

var tpl = `{{user}}  {{date}}  工作周报
=================================

### 1、本周工作
* 项目名称：
    （1）：

### 2、下周安排
* 项目名称：
    （1）：

### 3、其它

`
var formatDate = function(date, fmt) {
    var o = {
        "M+": date.getMonth() + 1, //月份 
        "d+": date.getDate(), //日 
        "h+": date.getHours(), //小时 
        "m+": date.getMinutes(), //分 
        "s+": date.getSeconds(), //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

var mixin = function(source, target) {
    for (var i in target) {
        if (target.hasOwnProperty(i)) {
            source[i] = target[i];
        }
    }
    return source;
}

var generateStr = function(str, params) {
    // var defaultParams = {
    //     user: '骆也',
    //     date: formatDate(new Date(), 'yyyy-MM-dd')
    // }
    // var params = mixin(defaultParams, params);
    var str = str.replace(/{{user}}/ig, params.user).replace(/{{date}}/ig, params.date)
    return str;
}


program
    .command('new')
    .description('creat new file')
    .action(function() {
        var params = {};
        params.user = program.user ? program.user : '骆也';
        params.date = program.date ? program.date : formatDate(new Date(), 'yyyy-MM-dd');
        fs.writeFileSync('./' + params.date + '.md', generateStr(tpl, params), 'utf-8');
        console.log('创建成功 name: ' + params.user + ' date: ' + params.date);
    });

program.parse(process.argv);

if (!program.args.length) {
    program.help();
};
