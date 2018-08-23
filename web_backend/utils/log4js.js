/**
   * npm install log4js
   * 源码及文档地址：https://github.com/nomiddlename/log4js-node
   */
const path = require('path');

var log4js = require('log4js');
var logConf = require(path.join(__dirname, '../config/nodeconf.json'));
var logPath = path.join(__dirname, '../logs/');

/**
 * 第一种：
 * configure方法为配置log4js对象，内部有levels、appenders、categories三个属性
* levels:
*         配置日志的输出级别,共ALL<TRACE<DEBUG<INFO<WARN<ERROR<FATAL<MARK<OFF八个级别,default level is OFF
*         只有大于等于日志配置级别的信息才能输出出来，可以通过category来有效的控制日志输出级别
* appenders:
*         配置文件的输出源，一般日志输出type共有console、file、dateFile三种
*         console:普通的控制台输出
*         file:输出到文件内，以文件名-文件大小-备份文件个数的形式rolling生成文件
*         dateFile:输出到文件内，以pattern属性的时间格式，以时间的生成文件
* replaceConsole:
*         是否替换控制台输出，当代码出现console.log，表示以日志type=console的形式输出
*                 
*/
log4js.configure({
    replaceConsole: true,
    appenders: {
        stdout: {
            type: 'stdout'
        },
        req: {
            type: 'dateFile',
            filename: logPath + 'req',
            pattern: "-yyyyMMdd.log",
            alwaysIncludePattern: true
        },
        be: {
            type: 'dateFile',
            filename: logPath + 'be',
            pattern: "-yyyyMMdd.log",
            alwaysIncludePattern: true
        },
        err: {
            type: 'dateFile',
            filename: logPath + 'err',
            pattern: '-yyyyMMdd.log',
            alwaysIncludePattern: true
        }
    },
    categories: {
        default: { appenders: ['stdout'], level: 'debug' },
        be: { appenders: ['be'], level: logConf.Log4js.level },
        req: { appenders: ['req'], level: logConf.Log4js.level },
        err: { appenders: ['err'], level: 'error' }
    }
});

exports.getLogger = function (name) {
    return log4js.getLogger(name);
}

exports.useLogger = function (app, logger) {
    app.use(log4js.connectLogger(logger || log4js.getLogger('default'), {
        format: '[:remote-addr :method :url :status :response-timems][:referrer HTTP/:http-version :user-agent]'//自定义输出格式
    }))
}
