'use strict';
var fabric = require("../fabric");
var constants = require("./Constants");
const log4js = require('../utils/log4js');
const Logger = log4js.getLogger('be');
var inspect = require('util').inspect;

var STATUS_ENUM = [
    "企业申请",
    "草稿审核",
    "正本开立",
    "正本修改",
    "会签共识",
    "交单",
    "承兑",
    "赎单",
    "拒付",
    "闭卷"
];

const STEP_ENUM = {
    "LCStart": "开始",
    "ApplicantSaveLCApplyFormStep": "保存",
    "BankConfirmApplyFormStep": "银行确认",
    "ApplicantFillLCDraftStep": "填写信用证草稿",
    "BankIssueLCStep": "银行发证",
    "AdvisingBankReceiveLCNoticeStep": "通知行收到信用证通知",
    "BeneficiaryReceiveLCStep": "受益人接收信用证",
    "ApplicantLCAmendStep": "申请人修改信用证",  // Service 未实现
    "MultiPartyCountersignStep": "多方会签",    // Service 未实现
    "BeneficiaryHandOverBillsStep": "受益人交单",
    "AdvisingBankReviewBillsStep": "通知行审核交单信息",
    "IssuingBankAcceptOrRejectStep": "发证行承兑或拒付",   // 开证行面向受益人
    "ApplicantRetireBillsStep": "申请人赎单",
    "IssuingBankReviewRetireBillsStep": "开证行审核赎单",  // 开证行面向申请人
    "IssuingBankCloseLCStep": "闭卷",
    "LCEnd": "结束",
};

/**
 * 获取符合条件的信用证交易（包含，历史的，正在进行中的）

 * Params：bankId
 * return: trans list
 **/
exports.getTxsByBankId = function (req, res, next) {
    var args = req.swagger.params;
    var bankId = args.bankId.value;
    var status = args.status.value;
    var lcNo = args.lcNo.value;
    var applicant = args.applicant.value;
    var beneficiary = args.beneficiary.value;
    var startDate = args.startDate.value;
    var endDate = args.endDate.value;

    Logger.debug("args:" + inspect(args));

    fabric.query(req, "getLcListByBankId", [bankId], function (err, resp) {
        if (resp == null || resp.result == null) {
            res.status(405).end();
            //res.end();
        } else {
            var txs = [];
            var resultObj = JSON.parse(resp.result);
            for (var i = 0; i < resultObj.length; i++) {
                // txs.push(chaincodeTx2ViewTx(resultObj[i]));
                var lc = resultObj[i];
                var lcStep = lc.Record.CurrentStep;
                var lcNum = lc.Record.lcNo;
                var lcApplicant = lc.Record.LetterOfCredit.Applicant.Name;
                var lcBeneficiary = lc.Record.LetterOfCredit.Beneficiary.Name;

                 //开证行和通知行是同一家银行
                if (lc.Record.ApplicationForm.IssuingBank.No == bankId
                    && lc.Record.ApplicationForm.AdvisingBank.No == bankId) {
                        Logger.debug("Issue bank is same with advising bank."
                        + "\n bankId:" + bankId
                        + "\n lcSetp:" + lcStep
                        + "\n lcNo:" + lcNo
                        + "\n lcNum:" + lcNum
                        + "\n applicant:" + applicant
                        + "\n lcApplicant:" + lcApplicant
                        + "\n beneficiary:" + beneficiary
                        + "\n lcBeneficiary:" + lcBeneficiary
                        + "\n current status:" + lc.Record.lcStatus
                        + "\n select status:" + status
                        + "\n enum status:" + STATUS_ENUM[lc.Record.lcStatus]
                        + "\n startDate:" + startDate
                        + "\n endData:" + endDate                        
                         + "\n selectTx:" + selectTxWithParams(lc.Record.ApplicationForm.applyTime, startDate, endDate, lcNo, lcNum, applicant, lcApplicant, beneficiary, lcBeneficiary, status, STATUS_ENUM[lc.Record.lcStatus]));

                    if (selectTxWithParams(lc.Record.ApplicationForm.applyTime, startDate, endDate, lcNo, lcNum, applicant, lcApplicant, beneficiary, lcBeneficiary, status, STATUS_ENUM[lc.Record.lcStatus])) {
                        txs.push(chaincodeTx2ViewTx(lc));
                    }                
                }else if (lc.Record.ApplicationForm.IssuingBank.No == bankId) {//开证行
                    Logger.debug("Issue bank info."
                        + "\n bankId:" + bankId
                        + "\n lcSetp:" + lcStep
                        + "\n lcNo:" + lcNo
                        + "\n lcNum:" + lcNum
                        + "\n applicant:" + applicant
                        + "\n lcApplicant:" + lcApplicant
                        + "\n beneficiary:" + beneficiary
                        + "\n lcBeneficiary:" + lcBeneficiary
                        + "\n current status:" + lc.Record.lcStatus
                        + "\n select status:" + status
                        + "\n enum status:" + STATUS_ENUM[lc.Record.lcStatus]
                        + "\n startDate:" + startDate
                        + "\n endData:" + endDate                    
                        + "\n selectTx:" + selectTxWithParams(lc.Record.ApplicationForm.applyTime, startDate, endDate, lcNo, lcNum, applicant, lcApplicant, beneficiary, lcBeneficiary, status, STATUS_ENUM[lc.Record.lcStatus]));
                   
                    // txs.push(chaincodeTx2ViewTx(lc));                    
                    if (selectTxWithParams(lc.Record.ApplicationForm.applyTime, startDate, endDate, lcNo, lcNum, applicant, lcApplicant, beneficiary, lcBeneficiary, status, STATUS_ENUM[lc.Record.lcStatus])) {
                        txs.push(chaincodeTx2ViewTx(lc));
                    }
                } else if (lc.Record.ApplicationForm.AdvisingBank.No == bankId) {//通知行
                    Logger.debug("Advising bank info."
                        + "\n bankId:" + bankId
                        + "\n lcSetp:" + lcStep
                        + "\n lcNo:" + lcNo
                        + "\n lcNum:" + lcNum
                        + "\n applicant:" + applicant
                        + "\n lcApplicant:" + lcApplicant
                        + "\n beneficiary:" + beneficiary
                        + "\n lcBeneficiary:" + lcBeneficiary
                        + "\n current status:" + lc.Record.lcStatus
                        + "\n select status:" + status
                        + "\n enum status:" + STATUS_ENUM[lc.Record.lcStatus]
                        + "\n startDate :" + startDate
                        + "\n endData :" + endDate                      
                        + "\n selectTx :" + selectTxWithParams(lc.Record.ApplicationForm.applyTime, startDate, endDate, lcNo, lcNum, applicant, lcApplicant, beneficiary, lcBeneficiary, status, STATUS_ENUM[lc.Record.lcStatus]));

                    // txs.push(chaincodeTx2ViewTx(lc));
                    if (selectTxWithParams(lc.Record.ApplicationForm.applyTime, startDate, endDate, lcNo, lcNum, applicant, lcApplicant, beneficiary, lcBeneficiary, status, STATUS_ENUM[lc.Record.lcStatus])) {
                        txs.push(chaincodeTx2ViewTx(lc));
                    }
                }
            }

            if (txs.length > 0) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(txs));
            } else {
                //res.end();
                res.status(405).end();
            }
        }
    });
};

function selectTxWithStatus(status, txStatus) {
    if (status == "" || status == undefined || status == "undefined" || status == null || status == "null") {        
        return true;
    } else if (status == txStatus) {
        return true;
    } else {
        return false;
    }
}

function selectTxWithLcNo(lcNo, lcNum) {
    if (lcNo == "" || lcNo == undefined || lcNo == null || lcNo == "null") {
        return true;
    } else if (lcNo == lcNum) {
        return true;
    } else {
        return false;
    }
}

function selectTxWithApplicant(applicant, lcApplicant) {
    if (applicant == "" || applicant == undefined || applicant == null || applicant == "null") {
        return true;
    } else if (applicant == lcApplicant) {
        return true;
    } else {
        return false;
    }
}

function selectTxWithBeneficiary(beneficiary, lcBeneficiary) {
    if (beneficiary == "" || beneficiary == undefined || beneficiary == null || beneficiary == "null") {
        return true;
    } else if (beneficiary == lcBeneficiary) {
        return true;
    } else {
        return false;
    }
}

function selectTxWithDateRange(applyTime, startDate, endDate) {
    if (startDate === undefined || startDate === null) {
        startDate = '1990-01-01'
    }
    if (endDate === undefined || endDate === null) {
        endDate = '9999-01-01'
    }

    var appDate = new Date(applyTime);
    var stDate = new Date(startDate);
    var enDate = new Date(endDate);

    Logger.debug("applyDate[" + appDate + "] startDate[" + stDate + "] endDate[" + enDate + "]");

    if (appDate > stDate && appDate <= enDate) {
        return true;
    } else {
        return false;
    }
}

//信用证编号查询
function selectTxWithParams(applyTime, startDate, endDate, lcNo, lcNum, applicant, lcApplicant, beneficiary, lcBeneficiary, inputStatus, txStatus) {
    if (selectTxWithDateRange(applyTime, startDate, endDate) && selectTxWithStatus(inputStatus, txStatus)
        && selectTxWithLcNo(lcNo, lcNum)
        && selectTxWithApplicant(applicant, lcApplicant)
        && selectTxWithBeneficiary(beneficiary, lcBeneficiary)) {
        return true;
    } else {
        return false;
    }
}

/**
 * 获取指定银行正在进行中的交易列表
 *
 * Params：bankId, startDate, endDate
 * return: trans list
 **/
exports.getProcessingTxByBankId = function (req, res, next) {
    var args = req.swagger.params;
    var stepArrByIssuingBank = [
        'BankConfirmApplyFormStep',
        'BankIssueLCStep',
        'MultiPartyCountersignStep',
        'IssuingBankAcceptOrRejectStep',
        'IssuingBankReviewRetireBillsStep',
        'IssuingBankCloseLCStep'
    ];
    var stepArrByAdvisingBank = [
        'AdvisingBankReceiveLCNoticeStep',
        'MultiPartyCountersignStep',
        'AdvisingBankReviewBillsStep'
    ];

    var bankId = args.bankId.value;
    var status = args.status.value;
    var lcNo = args.lcNo.value;
    var applicant = args.applicant.value;
    var beneficiary = args.beneficiary.value;
    var startDate = args.startDate.value;
    var endDate = args.endDate.value;

    Logger.debug("args:" + inspect(args));

    fabric.query(req, "getLcListByBankId", [bankId], function (err, resp) {
        var txs = [];
        if (resp == null || resp.result == null) {
            res.status(405).end();
            //res.end();
        } else {
            var resultObj = JSON.parse(resp.result);
            for (var i = 0; i < resultObj.length; i++) {
                var lc = resultObj[i];
                var lcStep = lc.Record.CurrentStep;
                var lcNum = lc.Record.lcNo;
                var lcApplicant = lc.Record.LetterOfCredit.Applicant.Name;
                var lcBeneficiary = lc.Record.LetterOfCredit.Beneficiary.Name;

                //开证行和通知行是同一家银行
                if (lc.Record.ApplicationForm.IssuingBank.No == bankId
                    && lc.Record.ApplicationForm.AdvisingBank.No == bankId) {
                    Logger.debug("Issue bank is same with advising bank."
                        + "\n bankId:" + bankId
                        + "\n lcSetp:" + lcStep
                        + "\n lcNo:" + lcNo
                        + "\n lcNum:" + lcNum
                        + "\n applicant:" + applicant
                        + "\n lcApplicant:" + lcApplicant
                        + "\n beneficiary:" + beneficiary
                        + "\n lcBeneficiary:" + lcBeneficiary
                        + "\n current status:" + lc.Record.lcStatus
                        + "\n select status:" + status
                        + "\n enum status:" + STATUS_ENUM[lc.Record.lcStatus]
                        + "\n startDate:" + startDate
                        + "\n endData:" + endDate
                        + "\n stepArrByIssuingBank:" + stepArrByIssuingBank.indexOf(lcStep)
                        + "\n selectTx:" + selectTxWithParams(lc.Record.ApplicationForm.applyTime, startDate, endDate, lcNo, lcNum, applicant, lcApplicant, beneficiary, lcBeneficiary, status, STATUS_ENUM[lc.Record.lcStatus]));

                    if ((stepArrByIssuingBank.indexOf(lcStep) > -1 || stepArrByAdvisingBank.indexOf(lcStep) > -1)
                        && selectTxWithParams(lc.Record.ApplicationForm.applyTime, startDate, endDate, lcNo, lcNum, applicant, lcApplicant, beneficiary, lcBeneficiary, status, STATUS_ENUM[lc.Record.lcStatus])) {
                        txs.push(chaincodeTx2ViewTx(lc));
                    }
                } else if (lc.Record.ApplicationForm.IssuingBank.No == bankId) {//开证行
                    Logger.debug("Issue bank info."
                        + "\n bankId:" + bankId
                        + "\n lcSetp:" + lcStep
                        + "\n lcNo:" + lcNo
                        + "\n lcNum:" + lcNum
                        + "\n applicant:" + applicant
                        + "\n lcApplicant:" + lcApplicant
                        + "\n beneficiary:" + beneficiary
                        + "\n lcBeneficiary:" + lcBeneficiary
                        + "\n current status:" + lc.Record.lcStatus
                        + "\n select status:" + status
                        + "\n enum status:" + STATUS_ENUM[lc.Record.lcStatus]
                        + "\n startDate:" + startDate
                        + "\n endData:" + endDate
                        + "\n stepArrByIssuingBank:" + stepArrByIssuingBank.indexOf(lcStep)
                        + "\n selectTx:" + selectTxWithParams(lc.Record.ApplicationForm.applyTime, startDate, endDate, lcNo, lcNum, applicant, lcApplicant, beneficiary, lcBeneficiary, status, STATUS_ENUM[lc.Record.lcStatus]));

                    // txs.push(chaincodeTx2ViewTx(lc));                    
                    if (stepArrByIssuingBank.indexOf(lcStep) > -1
                        && selectTxWithParams(lc.Record.ApplicationForm.applyTime, startDate, endDate, lcNo, lcNum, applicant, lcApplicant, beneficiary, lcBeneficiary, status, STATUS_ENUM[lc.Record.lcStatus])) {
                        txs.push(chaincodeTx2ViewTx(lc));
                    }
                } else if (lc.Record.ApplicationForm.AdvisingBank.No == bankId) {//通知行
                    Logger.debug("Advising bank info."
                        + "\n bankId:" + bankId
                        + "\n lcSetp:" + lcStep
                        + "\n lcNo:" + lcNo
                        + "\n lcNum:" + lcNum
                        + "\n applicant:" + applicant
                        + "\n lcApplicant:" + lcApplicant
                        + "\n beneficiary:" + beneficiary
                        + "\n lcBeneficiary:" + lcBeneficiary
                        + "\n current status:" + lc.Record.lcStatus
                        + "\n select status:" + status
                        + "\n enum status:" + STATUS_ENUM[lc.Record.lcStatus]
                        + "\n startDate :" + startDate
                        + "\n endData :" + endDate
                        + "\n stepArrByIssuingBank :" + stepArrByIssuingBank.indexOf(lcStep)
                        + "\n selectTx :" + selectTxWithParams(lc.Record.ApplicationForm.applyTime, startDate, endDate, lcNo, lcNum, applicant, lcApplicant, beneficiary, lcBeneficiary, status, STATUS_ENUM[lc.Record.lcStatus]));

                    // txs.push(chaincodeTx2ViewTx(lc));
                    if (stepArrByAdvisingBank.indexOf(lcStep) > -1
                        && selectTxWithParams(lc.Record.ApplicationForm.applyTime, startDate, endDate, lcNo, lcNum, applicant, lcApplicant, beneficiary, lcBeneficiary, status, STATUS_ENUM[lc.Record.lcStatus])) {
                        txs.push(chaincodeTx2ViewTx(lc));
                    }
                }
            }
            if (txs.length > 0) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(txs));
            } else {
                res.status(405).end();
                //res.end();
            }
        }
    });
};

/**
 * 获取指定银行正在进行中的交易列表
 *
 * Params：chaincodeTx
 * return: viewTx
 **/
function chaincodeTx2ViewTx(chaincodeTx) {
    var tx = {
        "id": chaincodeTx.Key,
        "no": chaincodeTx.Record.lcNo,
        "LCNumbers": chaincodeTx.Record.lcNo,
        "applicant": chaincodeTx.Record.LetterOfCredit.Applicant.Name,
        "beneficiary": chaincodeTx.Record.LetterOfCredit.Beneficiary.Name,
        "issuingBank": chaincodeTx.Record.LetterOfCredit.IssuingBank.Name,
        "advisingBank": chaincodeTx.Record.LetterOfCredit.AdvisingBank.Name,
        "amount": chaincodeTx.Record.LetterOfCredit.amount,
        "currency": chaincodeTx.Record.LetterOfCredit.Currency,
        "status": STEP_ENUM[chaincodeTx.Record.CurrentStep],
        "state": STATUS_ENUM[chaincodeTx.Record.lcStatus],
        "issuseDate": chaincodeTx.Record.LetterOfCredit.applyTime
    };
    return tx;
}

/**
 * 获取指定交易的交易进度信息
 *
 * Params：TxId
 * return: processflows
 **/
exports.getProcessFlowByTxId = function (req, res, next) {
    var args = req.swagger.params;
    var id = args.txId.value;

    Logger.debug("args:" + inspect(args));

    fabric.query(req, "getLcByNo", [id], function (error, resp) {
        if (resp == null || resp.result == null) {
            res.end();
        } else {
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

function lc2ProgressFlow(lc) {
    lc.TransProgressFlow = lc.TransProgressFlow.reverse();
    lc.TransProgressFlow.map(flow => { flow.Status = constants.STEPS[flow.Status]; });
    var tx = {
        "TransProgressFlow": lc.TransProgressFlow,
        "CurrentStep": lc.CurrentStep,
    };

    return tx;
}


/**
 * 获取指定交易(信用证)的草稿信息
 *
 * Params：TxId
 * return: LCDraftView
 **/
exports.getLCDraftByTxId = function (req, res, next) {
    var args = req.swagger.params;

    Logger.debug("args:" + inspect(args));

    fabric.query(req, "getLcByNo", [args.txId.value], function (error, resp) {
        if (resp == null || resp.result == "") {
            res.end();
        } else {
            var lc = JSON.parse(resp.result);
            var draft = JSON.parse(resp.result).LetterOfCredit;
            if (draft == null) {
                res.end();
            } else {
                draft.no = JSON.parse(resp.result).no;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(draft));
            }
            res.end();
        }
    });
};

/**
 * 获取指定交易的保证金记录
 *
 * Params：TxId
 * return: DepositView
 **/
exports.getDepositByTxId = function (req, res, next) {
    var args = req.swagger.params;

    Logger.debug("args:" + inspect(args));

    fabric.query(req, "getLcByNo", [args.txId.value], function (error, resp) {
        if (resp == null || resp.result == "") {
            res.end();
        } else {
            var deposit = JSON.parse(resp.result).LCTransDeposit;
            if (deposit == null) {
                res.end();
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(deposit));
            }
        }
    });
};

/**
 * 获取指定交易的保证金信息的电子凭证及附件
 *
 * Params：TxId
 * return: DepositDocs
 **/
exports.getDepositDocsByTxId = function (req, res, next) {
    var args = req.swagger.params;

    Logger.debug("args:" + inspect(args));

    fabric.query(req, "getLcByNo", [args.txId.value], function (error, resp) {
        if (resp == null || resp.result == "") {
            res.end();
        } else {
            var depositDoc = JSON.parse(resp.result).LCTransDeposit.DepositDoc;
            if (depositDoc == null) {
                res.end();
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(depositDoc));
            }
        }
    });
};

/**
 * 获取指定交易的合同及附件列表
 *
 * Params：TxId
 * return: Contract Attachments
 **/
exports.getContractsByTxId = function (req, res, next) {
    var args = req.swagger.params;

    Logger.debug("args:" + inspect(args));

    fabric.query(req, "getLcByNo", [args.txId.value], function (error, resp) {
        if (resp == null || resp.result == "") {
            res.end();
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(chaincodeTx2Contract(JSON.parse(resp.result))));
        }
    });
};

function chaincodeTx2Contract(lc) {
    var attachments = [];
    for (var i = 0; i < lc.ApplicationForm.Contract.Attachments.length; i++) {
        var attachment = {
            "No": lc.ApplicationForm.Contract.Attachments[i].No,
            "FileName": lc.ApplicationForm.Contract.Attachments[i].FileName,
            "FileUri": lc.ApplicationForm.Contract.Attachments[i].FileUri,
            "FileHash": lc.ApplicationForm.Contract.Attachments[i].FileHash,
            "FileSignature": lc.ApplicationForm.Contract.Attachments[i].FileSignature,
            "Uploader": lc.ApplicationForm.Contract.Attachments[i].Uploader
        };
        attachments.push(attachment);
    }
    var tx = {
        "no": lc.id,
        "attachments": JSON.stringify(attachments)
    };
    return tx;
}

/**
 * 获取指定交易的信用证，正本附件
 *
 * Params：TxId
 * return: LC Original | 信用证正本附件
 **/
exports.getLCOriginalByTxId = function (req, res, next) {
    var args = req.swagger.params;

    Logger.debug("args:" + inspect(args));

    fabric.query(req, "getLcByNo", [args.txId.value], function (error, resp) {
        if (resp == null || resp.result == "") {
            res.end();
        } else {
            var lCOriginalAttachment = JSON.parse(resp.result).LetterOfCredit.LCOriginalAttachment;
            if (lCOriginalAttachment == null) {
                res.end();
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(lCOriginalAttachment));
            }
        }
    });
};

/**
 * 获取指定交易的来单信息
 *
 * Params：TxId
 * return: LCTransDocsReceived
 **/
exports.getLCDocsReceivedByTxId = function (req, res, next) {
    var args = req.swagger.params;

    Logger.debug("args:" + inspect(args));

    fabric.query(req, "getLcByNo", [args.txId.value], function (error, resp) {
        if (resp == null || resp.result == "") {
            res.end();
        } else {
            var lCTransDocsReceive = JSON.parse(resp.result).LCTransDocsReceive;
            if (lCTransDocsReceive == null) {
                res.end();
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(lCTransDocsReceive));
            }
        }
    });
};

/**
 * 获取指定交易的来单信息
 *
 * Params：TxId
 * return: LCTxAcceptPayment
 **/
exports.getLCAcceptPaymentByTxId = function (req, res, next) {
    var args = req.swagger.params;

    Logger.debug("args:" + inspect(args));

    fabric.query(req, "getLcByNo", [args.txId.value], function (error, resp) {
        if (resp == null || resp.result == "") {
            res.end();
        } else {
            var resultObj = JSON.parse(resp.result);
            var tx = {
                "no": resultObj.LcNo,
                "transactionId": resultObj.LcNo,
                "applicant": JSON.stringify(resultObj.LetterOfCredit.Applicant),
                "beneficiary": JSON.stringify(resultObj.LetterOfCredit.Beneficiary),
                "LCAmount": resultObj.LetterOfCredit.amount,
                "LCBalance": resultObj.NotPayAmount,
                "acceptAmount": resultObj.AcceptAmount,
                "acceptDate": resultObj.AcceptDate,
                "acceptExpireDate": resultObj.LetterOfCredit.ExpiryDate
            };

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(tx));
        }
    });
};

/**
 * 获取指定交易的闭卷信息
 *
 * Params：TxId
 * return: LCTxCLosing
 **/
exports.getLCClosingByTxId = function (req, res, next) {
    var args = req.swagger.params;

    Logger.debug("args:" + inspect(args));

    fabric.query(req, "getLcByNo", [args.txId.value], function (error, resp) {
        if (resp == null || resp.result == "") {
            res.end();
        } else {
            var resultObj = JSON.parse(resp.result);
            var tx = {
                "no": lc.LcNo,
                "transactionId": lc.LcNo,
                "applicant": JSON.stringify(lc.LetterOfCredit.Applicant),
                "beneficiary": JSON.stringify(lc.LetterOfCredit.Beneficiary),
                "LCAmount": lc.LetterOfCredit.amount,
                "LCBalance": lc.NotPayAmount,
                "isClosed": lc.IsClose,
                "comments": lc.Comments,
            };

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(tx));
        }
    });
};

