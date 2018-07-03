'use strict';
var fabric = require("../fabric");
var models = require('../models');
var constants = require("./Constants")

exports.getProcessingTransByCorpId = function (req, res, next) { var args=req.swagger.params;
    /**
     * 获取指定企业正在进行中的交易列表
     *
     *
     * corpId String
     * returns List
     **/
    let id = args.corpId.value, applyLCs = [], beneficiaryLCs = [], lcs;
    models.Corporation.findById(id).then(function (corp) {
        if (corp == null || Object.keys(corp).length == 0){
            res.end(JSON.stringify("该企业不在系统中"));
        }
        else if (Object.keys(corp).length > 0) {
            fabric.query(req,"getLcListByApplicant", [id], function (err, resp) {
                if (!err) {
                    let results = JSON.parse(resp.result);
                    results.map(lc => {
                        lc.Record.CurrentStep = constants.STEPS[lc.Record.CurrentStep];
                        lc.Record.TransProgressFlow.map(flow => {
                            flow.Status = constants.STEPS[flow.Status];
                          });
                        if (constants.APPLICANT_PROCESSING_STEPS.includes(lc.Record.CurrentStep)) {
                            applyLCs.push(lc);
                        }
                    });
                    fabric.query(req, "getLcListByBeneficiary", [id], function (err, resp) {
                        if (!err) {
                            let results = JSON.parse(resp.result);
                            results.map(lc => {
                                lc.Record.CurrentStep = constants.STEPS[lc.Record.CurrentStep];
                                lc.Record.TransProgressFlow.map(flow => {
                                    flow.Status = constants.STEPS[flow.Status];
                                });
                                if (constants.BENEFICIARY_PROCESSING_STEPS.includes(lc.Record.CurrentStep)) {
                                    beneficiaryLCs.push(lc);
                                }
                            });
                            lcs = applyLCs.concat(beneficiaryLCs);
                            if (lcs.length > 0) {
                                res.setHeader('Content-Type', 'application/json');
                                res.end(JSON.stringify(lcs));
                            } else {
                                res.end(JSON.stringify("暂无数据"));
                            }
                        }
                        else {
                            console.log(err);
                        }
                    });
                }
                else {
                    console.log(err);
                }
            });
        }
    });
};

exports.getProgressFlowByTransId = function (req, res, next) { var args=req.swagger.params;
    /**
     * 获取指定交易的交易进度信息
     *
     *
     * transId String
     * returns LCTransProgressFlow
     **/

    var id = args.transId.value;
    fabric.query(req,"getLcByNo", [id], function (error, resp) {
        if (resp.result == ""){
            res.end();
        }else {
            var resultObj = JSON.parse(resp.result);
            var progressFlow = lc2ProgressFlow(resultObj);
            if (progressFlow == null) {
                res.end();
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(progressFlow));
            }
        }
    });
};

function lc2ProgressFlow(lc){
    var tx={
        "TransProgressFlow":lc.TransProgressFlow,
        "CurrentStep": lc.CurrentStep,
    };
    return tx;
}
  
exports.getTransByCorpId = function (req, res, next) { var args=req.swagger.params;
    /**
     * 获取指定企业的所有交易列表
     *
     *
     * corpId String
     * returns List
     **/
    var id = args.corpId.value;
    models.Corporation.findById(id).then(function (corp) {
        if (corp == null || Object.keys(corp).length == 0){
            res.end();
        }
        else if (Object.keys(corp).length > 0) {
            fabric.query(req,"getLcListByApplicant", [id], function (err, resp) {
                if (!err) {
                    let results = JSON.parse(resp.result);
                    const lcs = results.map(lc => {
                        lc.Record.CurrentStep = constants.STEPS[lc.Record.CurrentStep];
                        return lc;
                    });
                    res.end(JSON.stringify(lcs));
                }else {
                    console.log(err);
                }
            });
        }
    });
};