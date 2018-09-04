'use strict';
var fabric = require("../fabric")
const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');

exports.transfer = function (req, res, next) {
    var args = req.swagger.params;
    var accountA = args.accountA.value;
    var accountB = args.accountB.value;
    var amount = args.amount.value;
    var fabricArgs = [accountA, accountB, amount];

    Logger.debug("args:" + args
        + "\n fabric req:" + fabricArgs);

    fabric.invoke(req, "invoke", fabricArgs, function (err, resp) {
        if (!err) {
            Logger.debug("resp:" + resp.result);
            res.end(resp.result);
        }
        else {
            Logger.error(err);
        }
    });
}

exports.getAccountBalance = function (req, res, next) {
    var args = req.swagger.params;
    var account = args.account.value;

    Logger.debug("args:" + args
        + "\n fabric account:" + account);

    fabric.query(req, "query", [account], function (err, resp) {
        if (!err) {
            Logger.debug("resp:" + resp.result);
            res.end(resp.result);
        }
    });

}

