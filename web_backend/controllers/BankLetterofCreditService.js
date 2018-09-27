'use strict';
var fabric = require("../fabric");
var models = require('../models');
var pdf = require('html-pdf');
/**
 * 开证行：正式开立信用证，共识，并发送通知给网络参与方（开证 or 拒绝）
 * 
 *
 * Params：body
 * return: nil
 **/
exports.bankIssuing = function (req, res, next) {
    var args = req.swagger.params;
    let value = args.body.value, no = value.no, suggestion = value.suggestion, isAgreed = value.isAgreed,
        file = value.depositDoc, docArg = {
            "FileName": file.name,
            "FileUri": file.uri,
            "FileHash": file.hash,
            "FileSignature": file.signature,
            "Uploader": file.uploader,
        };

    fabric.invoke(req, "issueLetterOfCredit", [no, suggestion, isAgreed, JSON.stringify(docArg)], function (err, resp) {
        if (!err) {
            writePdf(req, no, res);
            // res.end(JSON.stringify("审核通过"));
        } else {
            res.end(JSON.stringify("区块链交易执行失败！"));
        }
    });
};

/**
 * 通知行：审核并签名共识（同意通知 or 拒绝通知）
 * 
 *
 * Params：body
 * return: nil
 **/
exports.advisingBankAudit = function (req, res, next) {
    var args = req.swagger.params;
    let value = args.body.value, no = value.no, suggestion = value.suggestion, isAgreed = value.isAgreed;
    fabric.invoke(req, "advisingBankReceiveLCNotice", [no, suggestion, isAgreed], function (err, resp) {
        if (!err) {
            res.end(JSON.stringify("审核通过"));
        } else {
            res.end(JSON.stringify("区块链交易执行失败！"));
        }
    });
};

/**
 * 开证行、通知行、受益人同意通知或者拒绝信用证正本修改
 *
 *
 * Params：body
 * return: nil
 **/
exports.amendCountersign = function (req, res, next) {
    var args = req.swagger.params;
    var values = args.body.value,
        p1 = values.no,
        p2 = values.opinion,
        p3 = values.isAgreed.toString();
    fabric.invoke(req, "lcAmendConfirm", [p1, p2, p3], function (err, resp) {
        if (!err) {
            res.end(JSON.stringify("审核通过"));
        } else {
            res.end(JSON.stringify("区块链交易执行失败！"));
        }
    });
};

/**
 * 开证行：发起修改同意或拒绝
 *
 * Params：body
 * return: nil
 **/
exports.issueLetterOfAmendHandle = function (req, res, next) {
    var args = req.swagger.params;
    var values = args.body.value, no = values.no, amendNo = values.amendNo,
        suggestion = values.suggestion, isAgreed = values.isAgreed.toString();

    fabric.invoke(req, "issueLetterOfAmend", [no, amendNo, suggestion, isAgreed], function (err, resp) {
        if (!err) {
            // writeAcceptancePdf(req, no, res)
            res.end(JSON.stringify("审核通过"));
        } else {
            res.end(JSON.stringify("区块链交易执行失败！"));
        }
    });
};

/**
 * 通知行：发起修改同意或拒绝
 *
 * Params：body
 * return: nil
 **/
exports.advisingLetterOfAmendHandle = function (req, res, next) {
    var args = req.swagger.params;
    var values = args.body.value, no = values.no, amendNo = values.amendNo,
        suggestion = values.suggestion, isAgreed = values.isAgreed.toString();

    fabric.invoke(req, "advisingLetterOfAmend", [no, amendNo, suggestion, isAgreed], function (err, resp) {
        if (!err) {
            // writeAcceptancePdf(req, no, res)
            res.end(JSON.stringify("审核通过"));
        } else {
            res.end(JSON.stringify("区块链交易执行失败！"));
        }
    });
};

/**
 * 通知行：确认交单
 *
 *
 * Params：body
 * return: nil
 **/
exports.advisingBankDocsReceivedAudit = function (req, res, next) {
    var args = req.swagger.params;
    var values = args.body.value, no = values.no,
        suggestion = values.suggestion, isAgreed = values.isAgreed.toString();

    fabric.invoke(req, "reviewBills", [no, suggestion, isAgreed], function (err, resp) {
        if (!err) {
            res.end(JSON.stringify("审核通过"));
        } else {
            res.end(JSON.stringify("区块链交易执行失败！"));
        }
    });
};
//开证行：到单审查
exports.billBankReceivedAudit = function (req, res, next) {
    var args = req.swagger.params;
    var values = args.body.value, no = values.no, bno = values.bno,
        suggestion = values.suggestion, isAgreed = values.isAgreed.toString();

    fabric.invoke(req, "reviewBills", [no, bno, suggestion, isAgreed], function (err, resp) {
        if (!err) {
            res.end(JSON.stringify("到单已处理！"));
        } else {
            res.end(JSON.stringify("区块链交易执行失败！"));
        }
    });
};
/**
 * 开证行：承兑或者拒付
 **/
exports.billAcceptancePayment = function (req, res, next) {
    var args = req.swagger.params;
    var values = args.body.value, no = values.no, bno = values.bno, amount = values.amount.toString(),
        suggestion = values.suggestion, isAgreed = values.isAgreed;

    fabric.invoke(req, "lcAcceptOrReject", [no, bno, amount, suggestion, isAgreed], function (err, resp) {
        if (!err) {
            writeBillPdf(req, no, res);
            writeAcceptancePdf(req, no, bno, isAgreed, res);
            // res.end(JSON.stringify("审核通过"));
        } else {
            res.end(JSON.stringify("区块链交易执行失败！"));
        }
    });
};

/**
 * 开证行：办理交单（拒绝之后，不符点修改）
 *
 *
 * Params：body
 * return: nil
 **/
exports.issuingBankDocsReceivedAudit = function (req, res, next) {
    var args = req.swagger.params;
    res.end();
};

/**
 * 开证行：承兑或者拒付
 *
 * Params：body
 * return: nil
 **/
exports.acceptancePayment = function (req, res, next) {
    var args = req.swagger.params;
    var values = args.body.value, no = values.no, amount = values.amount.toString(), dismatchPoints = values.dismatchPoints,
        suggestion = values.suggestion, isAgreed = values.isAgreed.toString();

    fabric.invoke(req, "lcAcceptOrReject", [no, amount, dismatchPoints, suggestion, isAgreed], function (err, resp) {
        if (!err) {
            // writeAcceptancePdf(req, no, res)
            // res.end(JSON.stringify("审核通过"));
        } else {
            res.end(JSON.stringify("区块链交易执行失败！"));
        }
    });
};

/**
 * 开证行：闭卷
 * 
 * Params：body
 * return: nil
 **/
exports.LCClosing = function (req, res, next) {
    var args = req.swagger.params;
    var values = args.body.value,
        p1 = values.no,
        p2 = values.description;

    fabric.invoke(req, "lcClose", [p1, p2], function (err, resp) {
        if (!err) {
            res.end(JSON.stringify("恭喜，信用证闭卷完成！"));
        } else {
            res.end(JSON.stringify("区块链交易执行失败！"));
        }
    });
};

exports.issuingBankReviseRetire = function (req, res, next) {
    let args = req.swagger.params,
        values = args.body.value,
        no = values.no,
        suggestion = values.no,
        isAgreed = values.isAgreed;

    fabric.invoke(req, "reviewRetireBills", [no, suggestion, isAgreed], function (err, resp) {
        if (!err) {
            res.end(JSON.stringify("审核通过"));
        } else {
            res.end(JSON.stringify("区块链交易执行失败！"));
        }
    });
}


/**
 * 生成pdf文件所需要的数据(正本)
 *
 * Params：id:lcNo
 * return: 
 **/
function writePdf(req, id, resw) {
    // console.log("----writeHtml id:%s\n",id);
    fabric.query(req, "getLcByNo", [id], function (error, resp) {
        if (resp == null || resp.result == null) {
            // console.log("1-----resp result is null!!!!");
            resw.end();
            return;
        }
        var resultObj = JSON.parse(resp.result).LetterOfCredit;
        var issuingBankName = resultObj.IssuingBank.Name;
        var afterSight = resultObj.afterSight === undefined || resultObj.afterSight === "" ? "________" : resultObj.afterSight;
        var datetmp = new Date(resultObj.applyTime.substr(0, (resultObj.applyTime).indexOf('T')));
        var applyTime_year = datetmp.getFullYear();
        var applyTime_month = datetmp.getMonth() + 1 < 10 ? '0' + (datetmp.getMonth() + 1) : datetmp.getMonth() + 1;
        var applyTime_day = datetmp.getDate() < 10 ? '0' + datetmp.getDate() : datetmp.getDate();

        var latestShipmentDate_tmp = new Date(resultObj.GoodsInfo.latestShipmentDate.substr(0, (resultObj.GoodsInfo.latestShipmentDate).indexOf('T')));
        var latestShipmentDate_year = latestShipmentDate_tmp.getFullYear();
        var latestShipmentDate_month = latestShipmentDate_tmp.getMonth() + 1 < 10 ? '0' + (latestShipmentDate_tmp.getMonth() + 1) : latestShipmentDate_tmp.getMonth() + 1;
        var latestShipmentDate_day = latestShipmentDate_tmp.getDate() < 10 ? '0' + latestShipmentDate_tmp.getDate() : latestShipmentDate_tmp.getDate();
        var overLow = "短装:" + resultObj.Lowfill + "    溢装:" + resultObj.Overfill;
        var chargeInIssueBank = "在开证行产生的费用，由" + (resultObj.chargeInIssueBank === "1" ? "申请人" : "受益人") + "提供。";
        var chargeOutIssueBank = "在开证行外产生的费用，由" + (resultObj.chargeOutIssueBank === "1" ? "申请人" : "受益人") + "提供。";
        var docDelay = "单据必须自运输单据签发日" + resultObj.docDelay + "日内提交，且不能低于信用证有效期。";

        // console.log(chargeInIssueBank);

        var checkNegotiateHtml;
        if (resultObj.Negotiate === "1") {
            checkNegotiateHtml = (
                "<span><input name='subject' type='checkbox' checked /> 以下银行可议付<span >&nbsp;&nbsp;</span>□ 任意银行可议付<span >&nbsp;&nbsp;</span>□ 不可议付</span>"
            );
        }
        else if (resultObj.Negotiate === "2") {
            checkNegotiateHtml = (
                "<span style='font-family:宋体'>□ 以下银行可议付<span >&nbsp;&nbsp; </span><input name='subject' type='checkbox' checked /> 任意银行可议付<span >&nbsp;&nbsp;</span>□ 不可议付</span>"
            );
        }
        else {
            checkNegotiateHtml = (
                "<span style='font-family:宋体'>□ 以下银行可议付<span >&nbsp;&nbsp; </span>□ 任意银行可议付<span >&nbsp;&nbsp;</span><input name='subject' type='checkbox' checked /> 不可议付</span>"
            )
        }

        var checkTransferHtml;
        if (resultObj.Transfer === "1") {
            checkTransferHtml = (
                "<span style='font-family:宋体'><input name='subject' type='checkbox' checked /> 可转让<span >&nbsp;&nbsp;&nbsp;&nbsp; </span>□ 不可转让</span>"
            );
        }
        else {
            checkTransferHtml = (
                "<span style='font-family:宋体'>□ 可转让<span >&nbsp;&nbsp;&nbsp;&nbsp; </span><input name='subject' type='checkbox' checked /> 不可转让</span>"
            )
        }

        var checkConfirmedHtml;
        if (resultObj.Confirmed === "1") {
            checkConfirmedHtml = (
                "<span style='font-family:宋体'><input name='subject' type='checkbox' checked /> 可保兑<span >&nbsp;&nbsp;&nbsp;&nbsp; </span>□ 不可保兑</span>"
            );
        }
        else {
            checkConfirmedHtml = (
                "<span style='font-family:宋体'>□ 可保兑<span >&nbsp;&nbsp;&nbsp;&nbsp; </span><input name='subject' type='checkbox' checked /> 不可保兑</span>"
            )
        }

        let checkIsAtSightHtml;
        if (resultObj.isAtSight) {
            checkIsAtSightHtml = (
                "<span style='font-family:宋体'><input name='subject' type='checkbox' checked /> 即期</span><span lang=EN-US>&nbsp;</span><span style='font-family:宋体'>□ 远期</span>"
            );
        }
        else {
            checkIsAtSightHtml = (
                "<span style='font-family:宋体'>□ 即期</span><span lang=EN-US>&nbsp; </span><span style='font-family:宋体'><input name='subject' type='checkbox' checked /> 远期</span>"
            );
        }

        var checkIsFarHtml;
        if (resultObj.isAtSight) {
            checkIsFarHtml = (
                "<span style='font-family:宋体; '>□ 货物装运日/服务交付日后</span> <span lang=EN-US><u>" + afterSight + "</u></span> <span style='font-family:宋体'>天</span> <span >&nbsp;<input name='subject' type='checkbox' checked /> 见单后<u><span lang=EN-US>&nbsp;&nbsp;</span></u>天<span lang=EN-US> </span></span>"
            );
        }
        else {
            checkIsFarHtml = (
                "<span style='font-family:宋体';><input name='subject' type='checkbox' checked /> 货物装运日/服务交付日后</span> <span lang=EN-US><u>&nbsp;" + afterSight + "&nbsp;</u></span> <span style='font-family:宋体'>天</span> <span>&nbsp; □ 见单后<u><span lang=EN-US>&nbsp;&nbsp;</span></u>天<span lang=EN-US> </span></span>"
            );
        }

        var checkallowPartialShipmentHtml;
        if (resultObj.GoodsInfo.allowPartialShipment) {
            checkallowPartialShipmentHtml = (
                "<span style='font-family:宋体'><input name='subject' type='checkbox' checked /> 允许</span><span lang=EN-US>&nbsp;&nbsp;</span><span style='font-family:宋体'>□ 不允许</span>"
            );
        }
        else {
            checkallowPartialShipmentHtml = (
                "<span><input name='subject' type='checkbox' checked /> 允许</span><span lang=EN-US>&nbsp;&nbsp;</span><span style='font-family:宋体'>□ 不允许</span>"
            );
        }

        var checkallowPartialShipment;
        if (resultObj.GoodsInfo.allowPartialShipment) {
            checkallowPartialShipment = (
                "<span> <input name='subject' type='checkbox' checked /> 允许</span><span lang=EN-US>&nbsp;&nbsp;&nbsp;&nbsp; </span><span style='font-family:宋体'>□ 不允许</span>"
            );
        }
        else {
            checkallowPartialShipment = (
                "<span> <input name='subject' type='checkbox' checked /> 允许</span><span lang=EN-US>&nbsp;&nbsp;&nbsp;&nbsp; </span><span style='font-family:宋体'>□ 不允许</span>"
            );
        }

        var htmlStr = '<html>' +
            '<head>' +
            '<meta http-equiv=Content-Type content="text/html; charset=utf-8">' +
            '<meta name=Generator content="pdf">' +
            '<title></title>' +
            '</head>' +
            '<body bgcolor=white lang=ZH-CN style=" margin-left:30pt; margin-right:30pt; font-size:10pt;">' +
            '<div style="layout-grid:15.6pt">' +
            "<p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
            "<p class=MsoNormal align=center style='text-align:center;'><b><span lang=EN-US style='font-size:16.0pt;font-family:宋体'>" + issuingBankName + "</span></b><b><span style='font-size:16.0pt;font-family:宋体'>国内信用证</span></b></p>" +
            "<span style='font-family:宋体'>开证日期：" +
            "<u><span lang=EN-US>&nbsp;" + applyTime_year + "&nbsp;</span></u>年" +
            "<u><span lang=EN-US>&nbsp;" + applyTime_month + "&nbsp;</span></u>月" +
            "<u><span lang=EN-US>&nbsp;" + applyTime_day + "&nbsp;</span></u>日" +
            "<span lang=EN-US style='text-align:right; float:right; align:right'>" +
            "信用证编号：<u><span lang=EN-US>&nbsp;" + resultObj.LCNo + "&nbsp;&nbsp;</span></u></span></br>" +
            "<table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0 style='border-collapse:collapse;font-size:10pt;margin-top:2pt'>" +
            "<tr style='page-break-inside:avoid;'>" +
            "<td width=26 rowspan=3 valign=top style='width:19.5pt;border:solid windowtext 1.0pt; border-bottom:none;padding:0cm 1.5pt 0cm 1.5pt;layout-flow:vertical-ideographic;'>" +
            "<p class=MsoNormal align=center style='margin-top:10pt;margin-right:5.65pt;margin-bottom:0cm;margin-left:5.65pt;margin-bottom:.0001pt;text-align:center;;text-autospace:none'><b><span style='font-family:宋体;color:black'>开证申请人</span></b></p>" +
            "</td>" +
            "<td width=53 valign=top style='width:39.75pt;border:solid windowtext 1.0pt;border-left:none;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal align=center style='text-align:center;text-autospace:none'><span style='font-family:宋体;color:black'>全称</span></p></td>" +
            "<td width=238 valign=top style='width:178.5pt;border:solid windowtext 1.0pt;border-left:none;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal style='text-autospace:none'><span lang=EN-US style='font-family:宋体;color:black'>" +
            resultObj.Applicant.Name + "</span></p></td>" +
            "<td width=21 rowspan=3 valign=top style='width:15.75pt;border-top:solid windowtext 1.0pt;border-left:none;border-bottom:none;border-right:solid windowtext 1.0pt;padding:0cm 1.5pt 0cm 1.5pt;layout-flow:vertical-ideographic;height:15.0pt'>" +
            "<p class=MsoNormal align=center style='margin-top:20pt;margin-right:5.65pt;margin-bottom:0cm;margin-left:5.65pt;margin-bottom:.0001pt;text-align:center;text-autospace:none'><b><span style='font-family:宋体;color:black'>受益人</span></b></p>" +
            "</td>" +
            "<td width=56 valign=top style='width:42.0pt;border:solid windowtext 1.0pt;border-left:none;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal align=center style='text-align:center;text-autospace:none'><span style='font-family:宋体;color:black'>全称</span></p></td>" +
            "<td width=224 valign=top style='width:168.1pt;border:solid windowtext 1.0pt;border-left:none;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal style='text-autospace:none'><span lang=EN-US style='font-family:宋体;color:black'>" +
            resultObj.Beneficiary.Name + "</span></p></td>" +
            "</tr>" +
            "<tr style='page-break-inside:avoid;height:30.75pt'>" +
            "<td width=53 valign=top style='width:39.75pt;border:none;border-right:solid windowtext 1.0pt;padding:0cm 1.5pt 0cm 1.5pt;height:30.75pt'>" +
            "<p class=MsoNormal align=center style='text-align:center;text-autospace:none'><span style='font-family:宋体;color:black'>地址</span></p>" +
            "<p class=MsoNormal align=center style='text-align:center;text-autospace:none'><span style='font-family:宋体;color:black'>邮编</span></p></td>" +
            "<td width=238 valign=top style='width:178.5pt;border:none;border-right:solid windowtext 1.0pt;padding:0cm 1.5pt 0cm 1.5pt;height:30.75pt'>" +
            "<p class=MsoNormal style='text-autospace:none'><span lang=EN-US style='font-family:宋体;color:black'>" +
            resultObj.Applicant.Address + "</span></p></td>" +
            "<td width=56 valign=top style='width:42.0pt;border:none;border-right:solid windowtext 1.0pt; padding:0cm 1.5pt 0cm 1.5pt;height:30.75pt'>" +
            "<p class=MsoNormal align=center style='text-align:center;text-autospace:none'><span style='font-family:宋体;color:black'>地址</span></p>" +
            "<p class=MsoNormal align=center style='text-align:center;text-autospace:none'><span style='font-family:宋体;color:black'>邮编</span></p></td>" +
            "<td width=224 valign=top style='width:168.1pt;border:none;border-right:solid windowtext 1.0pt;padding:0cm 1.5pt 0cm 1.5pt;height:30.75pt'>" +
            "<p class=MsoNormal style='text-autospace:none'><span lang=EN-US style='font-family:宋体;color:black'>" +
            resultObj.Beneficiary.Address + "</span></p></td></tr>" +
            "<tr style='page-break-inside:avoid;'>" +
            "<td width=53 valign=top style='width:39.75pt;border-top:solid windowtext 1.0pt; border-left:none;border-bottom:none;border-right:solid windowtext 1.0pt;  padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal align=center style='text-align:centertext-autospace:none'><span style='font-family:宋体;color:black'>电话</span></p></td>" +
            "<td width=238 valign=top style='width:178.5pt;border-top:solid windowtext 1.0pt;border-left:none;border-bottom:none;border-right:solid windowtext 1.0pt; padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal style='text-autospace:none'><span lang=EN-US style='font-family:宋体;color:black;'>&nbsp;</span></p></td>" +
            "<td width=56 valign=top style='width:42.0pt;border-top:solid windowtext 1.0pt;border-left:none;border-bottom:none;border-right:solid windowtext 1.0pt;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal align=center style='text-align:center;text-autospace:none'><span style='font-family:宋体;color:black'>电话</span></p></td>" +
            "<td width=224 valign=top style='width:168.1pt;border-top:solid windowtext 1.0pt;border-left:none;border-bottom:none;border-right:solid windowtext 1.0pt;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal style='text-autospace:none'><span lang=EN-US style='font-family:宋体;color:black;'>&nbsp;</span></p></td>" +
            "</tr>" +
            "<tr style='page-break-inside:avoid;'>" +
            "<td width=79 colspan=2 valign=top style='width:59.25pt;border:solid windowtext 1.0pt;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal align=center style='text-align:center;;text-autospace:none'><b><span style='font-family:宋体;color:black;'>信用证金额</span></b></p></td>" +
            "<td width=539 colspan=4 valign=top style='width:404.35pt;border:solid windowtext 1.0pt;border-left:none;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal align=left style='text-align:left;'><span style='font-family:宋体;color:black'>人民币（大小写）</span>" +
            "</br>" +
            resultObj.amount + "元</span></p></td>" +
            "</tr>" +
            "<tr style='page-break-inside:avoid;height:20.0pt'>" +
            "<td width=79 colspan=2 valign=top style='width:59.25pt;border:solid windowtext 1.0pt;border-top:none;padding:0cm 1.5pt 0cm 1.5pt;height:20.0pt'>" +
            "<p class=MsoNormal style='text-autospace:none'><b><span style='font-family:宋体;color:black'>通知行名称、行号、地址及邮编</span></b></p></td>" +
            "<td width=539 colspan=4 valign=top style='width:404.35pt;border-top:none;border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0cm 1.5pt 0cm 1.5pt;height:20.0pt'>" +
            "<p class=MsoNormal style='text-autospace:none'><span lang=EN-US style='font-family:宋体;color:black'>" +
            resultObj.AdvisingBank.Name + "</span></br>" +
            resultObj.AdvisingBank.AccountNo + "</span></br>" +
            resultObj.AdvisingBank.Address + "</span></p>" +
            "</td>" +
            "</tr>" +
            "<tr style='page-break-inside:avoid;'>" +
            "<td width=79 colspan=2 valign=top style='width:59.25pt;border:solid windowtext 1.0pt;border-top:none;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal style='text-autospace:none'><b><span style='font-family:宋体;color:black'>有效期及有效地点</span></b></p></td>" +
            "<td width=539 colspan=4 valign=top style='width:404.35pt;border-top:none;border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal style='text-autospace:none'><span lang=EN-US style='font-family:宋体;color:black'>" + resultObj.expiryDate.substr(0, (resultObj.expiryDate).indexOf('T')) + "</span></br>" +
            "<span>" + resultObj.ExpiryPlace + "</span></p></td>" +
            "</tr>" +
            "<tr style='page-break-inside:avoid;'>" +
            "<td width=79 colspan=2 valign=top style='width:59.25pt;border:solid windowtext 1.0pt;border-top:none;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal style='text-autospace:none'><b><span style='font-family:宋体;color:black'>是否可议付</span></b></p></td>" +
            "<td width=539 colspan=4 valign=top style='width:404.35pt;border-top:none;border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal style='text-autospace:none'>" + checkNegotiateHtml + "</p></td>" +
            "</tr>" +
            "<tr style='page-break-inside:avoid;'>" +
            "<td width=79 colspan=2 valign=top style='width:59.25pt;border:solid windowtext 1.0pt;border-top:none;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal style='text-autospace:none'><b><span style='font-family:宋体;color:black'>议付行名称及行号</span></b></p></td>" +
            "<td width=539 colspan=4 valign=top style='width:404.35pt;border-top:none;border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal align=center style='text-align:center;text-autospace:none'><span lang=EN-US style='font-family:宋体;color:black'>&nbsp;</span></p></td></tr>" +
            "<tr style='page-break-inside:avoid;'>" +
            "<td width=79 colspan=2 valign=top style='width:59.25pt;border:solid windowtext 1.0pt;border-top:none;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal style='text-autospace:none'><b><span style='font-family:宋体;color:black'>是否可转让</span></b></p></td>" +
            "<td width=539 colspan=4 valign=top style='width:404.35pt;border-top:none;border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal style='text-autospace:none'>" + checkTransferHtml + "</p></td>" +
            "</tr>" +
            "<tr style='page-break-inside:avoid;'>" +
            "<td width=79 colspan=2 valign=top style='width:59.25pt;border:solid windowtext 1.0pt;border-top:none;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal style='text-autospace:none'><b><span style='font-family:宋体;color:black'>转让行名称及行号</span></b></p></td>" +
            "<td width=539 colspan=4 valign=top style='width:404.35pt;border-top:none;border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal align=center style='text-align:center;text-autospace:none'><span lang=EN-US style='font-family:宋体;color:black'>&nbsp;</span></p></td></tr>" +

            "<tr style='page-break-inside:avoid;'>" +
            "<td width=79 colspan=2 valign=top style='width:59.25pt;border:solid windowtext 1.0pt;border-top:none;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal style='text-autospace:none'><b><span style='font-family:宋体;color:black'>是否可保兑</span></b></p></td>" +
            "<td width=539 colspan=4 valign=top style='width:404.35pt;border-top:none;border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal style='text-autospace:none'>" + checkConfirmedHtml + "</p></td>" +
            "</tr>" +
            "<tr style='page-break-inside:avoid;'>" +
            "<td width=79 colspan=2 valign=top style='width:59.25pt;border:solid windowtext 1.0pt;border-top:none;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal style='text-autospace:none'><b><span style='font-family:宋体;color:black'>保兑行名称及行号</span></b></p></td>" +
            "<td width=539 colspan=4 valign=top style='width:404.35pt;border-top:none;border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal align=center style='text-align:center;text-autospace:none'><span lang=EN-US style='font-family:宋体;color:black'>&nbsp;</span></p></td></tr>" +
            "</table>" +
            "<p class=MsoNormal ><b><span style='font-family:宋体'>交单期：</span></b><u><span lang=EN-US>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></u>" +
            "</br><span style='font-family:宋体'><b>付款期限: </span></b>" +
            checkIsAtSightHtml +
            "</br><span style='text-indent:8em;'>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
            checkIsFarHtml +
            "</span>" +
            "</br><span style='text-indent:8em;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;□  货物收据签发日<span lang=EN-US>/</span>服务提供日后<u><span lang=EN-US>&nbsp;&nbsp;&nbsp;</span></u>天<span> &nbsp;</span>□  其他<u><span lang=EN-US>&nbsp;&nbsp;&nbsp;</span></u></span>" +
            "</br><b><span>转&nbsp;&nbsp;运: </span></b>" +
            checkallowPartialShipmentHtml +
            "</br><b><span style='font-family:宋体'>货物运输或交货方式/服务方式：</span></b>" +
            "<u><span lang=EN-US>&nbsp;" + resultObj.GoodsInfo.ShippingWay + "&nbsp;</span></u>" +
            "</br ><b><span style='font-family:宋体'>分批装运货物/分次提供服务: </span></b>" +
            checkallowPartialShipment +
            "</br><b><span style='font-family:宋体'>货物装运地（港）：</span></b>" +
            "<span lang=EN-US>&nbsp;" + resultObj.GoodsInfo.ShippingPlace + "</span>" +
            "<span style='float:right'><b><span style='font-family:宋体;'>货物目的地、交货地（港）：</span></b>" +
            "<span lang=EN-US>" + resultObj.GoodsInfo.ShippingDestination + "</span></span>" +
            "</br><b><span style='font-family:宋体'>服务提供地点：</span></b>" +
            "<u><span lang=EN-US>&nbsp;" + resultObj.GoodsInfo.ShippingDestination + "&nbsp;</span></u>" +
            "</br><b><span style='font-family:宋体'>最迟装运货物/服务提供日期：</span></b>" +
            "<u><span lang=EN-US>" + latestShipmentDate_year + "</span></u><span style='font-family:宋体'>年</span>" +
            "<u><span lang=EN-US>" + latestShipmentDate_month + "</span></u><span style='font-family:宋体'>月</span>" +
            "<u><span lang=EN-US>" + latestShipmentDate_day + "</span></u><span style='font-family:宋体'>日,</span>" +
            "<b><span style='font-family:宋体'>分期装运/提供服务: </span></b>" +
            "<u><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></u></span>" +
            // "</div>" +
            // "<b><span lang=EN-US style='font-size:10.5pt;font-family:'Times New Roman',serif'><br clear=all style='page-break-before:always'></span></b>" +
            // "<div class=WordSection2 style='layout-grid:15.6pt'>" +
            // "<p class=MsoNormal><span>&nbsp;</span></p>" +
            "</br><b><span style='font-family:宋体'>货物/服务描述：</span></b>" +
            "</br><span lang=EN-US>&nbsp;" + resultObj.GoodsInfo.GoodsDescription + "</span>" +
            "</br><b><span style='font-family:宋体'>受益人应提交的单据</span></b><span style='font-family:宋体'>：</span></p>" +
            "</br><b><span style='font-family:宋体'>其他条款:</span></b>" +
            "</br><span lang=EN-US>1. </span><span style='font-family:宋体'>溢短装条款比例: " + overLow + "</span>" +
            "</br><span lang=EN-US>2.</span><span lang=EN-US style='font-family: 宋体'> </span><span style='font-family:宋体'>如果提交了单证不符的单据，我行将在付款时扣除<u><spanlang=EN-US>&nbsp;&nbsp;&nbsp;&nbsp; </span></u>元人民币的不符点费。</span>" +
            "</br><span>3. </span><span>" + chargeInIssueBank + "</span>" +
            "</br><span>4. </span><span>" + chargeOutIssueBank + "</span>" +
            "</br><span>5. </span><span>" + docDelay + "</span>" +
            "</br><span>6. </span><span>发起日期不能早于开证日期。</span>" +
            "<p class=MsoNormal><span lang=EN-US>&nbsp;</span></p>" +
            "<p class=MsoNormal><span lang=EN-US>&nbsp;</span></p>" +
            "<p class=MsoNormal style='text-indent:2em;'><span style='font-family:宋体'>本信用证依据《国内信用证结算办法》开立。本信用证为不可撤销信用证。我行保证在收到相符单据后，履行付款的责任。如信用证为远期信用证，我行将在收到相符单据次日起五个营业日内确认付款，并在到期日付款；如信用证为即期信用证，我行将在收到相符单据次日起五个营业日内付款。议付行或交单行应将每次提交单据情况背书记录在正本信用证背面，并在交单面函中说明。</span></p>" +
            "<span >开证行全称：" + resultObj.IssuingBank.Name + "</span>" +
            "</br><span >地址及邮编：" + resultObj.IssuingBank.Address + "</span>" +
            "</br><span >电话：</span>" +
            "</br><span >传真：</span>" +
            "</br><span style='float:right;padding-right:80pt' >开证行签章：</span></br></br></br>" +
            "<span style='font-family:宋体'>注：信开信用证一式四联，第一联正本</span><span lang=EN-US>,</span><span style='font-family:宋体'>交受益人；第二联副本，通知行留存；第三联副本，开证行留存；第四联副本，开证申请人留存。</span>" +
            "<b><p style='float:center;align:center;text-align:center;font-size:10pt'>交单记录（正本背面）</span></b></p>" +
            "<table class=MsoNormalTable border=1 cellspacing=0 cellpadding=0 style='margin-left:-5.3pt;border-collapse:collapse;border:none;font-size:10pt'>" +
            "<tr>" +
            "<td width=103 style='width:77.35pt;border:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt'>" +
            "<p class=MsoNormal align=center style='text-align:center'><span style='font-family:宋体'>交单日期</span></p></td>" +
            "<td width=103 style='width:77.35pt;border:solid black 1.0pt;border-left:none;padding:0cm 5.4pt 0cm 5.4pt'>" +
            "<p class=MsoNormal align=center style='text-align:center'><span style='font-family:宋体'>业务编号</span></p></td>" +
            "<td width=103 style='width:77.4pt;border:solid black 1.0pt;border-left:none; padding:0cm 5.4pt 0cm 5.4pt'>" +
            "<p class=MsoNormal align=center style='text-align:center'><span style='font-family:宋体'>交单金额</span></p></td>" +
            "<td width=103 style='width:77.4pt;border:solid black 1.0pt;border-left:none;padding:0cm 5.4pt 0cm 5.4pt'>" +
            "<p class=MsoNormal align=center style='text-align:center'><span style='font-family:宋体'>信用证余额</span></p></td>" +
            "<td width=103 style='width:77.4pt;border:solid black 1.0pt;border-left:none; padding:0cm 5.4pt 0cm 5.4pt'>" +
            "<p class=MsoNormal align=center style='text-align:center'><span style='font-family:宋体'>交单行<span lang=EN-US>/</span>议付行名称</span></p></td>" +
            "<td width=103 style='width:77.4pt;border:solid black 1.0pt;border-left:none;padding:0cm 5.4pt 0cm 5.4pt'>" +
            "<p class=MsoNormal align=center style='text-align:center'><span style='font-family:宋体'>经办人签字</span></p></td>" +
            "</tr>" +
            "<tr>" +
            "<td width=103 valign=top style='width:77.35pt;border:solid black 1.0pt;border-top:none;padding:0cm 5.4pt 0cm 5.4pt;'>" +
            "<p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
            "<td width=103 valign=top style='width:77.35pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;'><p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
            "<td width=103 valign=top style='width:77.4pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;'><p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
            "<td width=103 valign=top style='width:77.4pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt; padding:0cm 5.4pt 0cm 5.4pt;'><p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
            "<td width=103 valign=top style='width:77.4pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;'><p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
            "<td width=103 valign=top style='width:77.4pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;'><p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
            "</tr>" +
            "<tr >" +
            "<td width=103 valign=top style='width:77.35pt;border:solid black 1.0pt;border-top:none;padding:0cm 5.4pt 0cm 5.4pt;'>" +
            "<p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
            "<td width=103 valign=top style='width:77.35pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;'><p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
            "<td width=103 valign=top style='width:77.4pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;'><p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
            "<td width=103 valign=top style='width:77.4pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt; padding:0cm 5.4pt 0cm 5.4pt;'><p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
            "<td width=103 valign=top style='width:77.4pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;h'><p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
            "<td width=103 valign=top style='width:77.4pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;'><p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
            "</tr>" +
            "<tr style=''>" +
            "<td width=103 valign=top style='width:77.35pt;border:solid black 1.0pt;border-top:none;padding:0cm 5.4pt 0cm 5.4pt;'>" +
            "<p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
            "<td width=103 valign=top style='width:77.35pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;'><p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
            "<td width=103 valign=top style='width:77.4pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;'><p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
            "<td width=103 valign=top style='width:77.4pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt; padding:0cm 5.4pt 0cm 5.4pt;'><p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
            "<td width=103 valign=top style='width:77.4pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;'><p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
            "<td width=103 valign=top style='width:77.4pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;'><p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
            "</tr>" +
            "</table>" +
            "</div>"
        "</body>" +
            "</html>"
        // console.log(htmlStr);
        var path = require('path');

        var filePath = path.resolve(__dirname, '../pdf/');
        // html2Pdf(htmlStr, filePath + filename);

        createPdfFile(htmlStr, 'zb_' + id + "_" + resultObj.LCNo + '.pdf', resw);

    });
}

/**
 * 生成pdf文件所需要的数据（交单）
 *
 * Params：id:lcNo
 * return: 
 **/
function writeBillPdf(req, id, resw) {
    // console.log("----writeHtml id:%s\n", id);
    fabric.query(req, "getLcByNo", [id], function (error, resp) {
        if (resp == null || resp.result == null) {
            // console.log("1-----resp result is null!!!!");
            // resw.end();
            return;
        }
        var resultObj = JSON.parse(resp.result).LetterOfCredit;
        var issuingBankName = resultObj.IssuingBank.Name;
        var afterSight = resultObj.afterSight === undefined || resultObj.afterSight === "" ? "________" : resultObj.afterSight;
        var datetmp = new Date(resultObj.applyTime.substr(0, (resultObj.applyTime).indexOf('T')));
        var applyTime_year = datetmp.getFullYear();
        var applyTime_month = datetmp.getMonth() + 1 < 10 ? '0' + (datetmp.getMonth() + 1) : datetmp.getMonth() + 1;
        var applyTime_day = datetmp.getDate() < 10 ? '0' + datetmp.getDate() : datetmp.getDate();

        var latestShipmentDate_tmp = new Date(resultObj.GoodsInfo.latestShipmentDate.substr(0, (resultObj.GoodsInfo.latestShipmentDate).indexOf('T')));
        var latestShipmentDate_year = latestShipmentDate_tmp.getFullYear();
        var latestShipmentDate_month = latestShipmentDate_tmp.getMonth() + 1 < 10 ? '0' + (latestShipmentDate_tmp.getMonth() + 1) : latestShipmentDate_tmp.getMonth() + 1;
        var latestShipmentDate_day = latestShipmentDate_tmp.getDate() < 10 ? '0' + latestShipmentDate_tmp.getDate() : latestShipmentDate_tmp.getDate();
        var overLow = "短装:" + resultObj.Lowfill + "    溢装:" + resultObj.Overfill;
        var chargeInIssueBank = "在开证行产生的费用，由" + (resultObj.chargeInIssueBank === "1" ? "申请人" : "受益人") + "提供。";
        var chargeOutIssueBank = "在开证行外产生的费用，由" + (resultObj.chargeOutIssueBank === "1" ? "申请人" : "受益人") + "提供。";
        var docDelay = "单据必须自运输单据签发日" + resultObj.docDelay + "日内提交，且不能低于信用证有效期。";

        // console.log(chargeInIssueBank);
        //交单信息
        var resultBill = JSON.parse(resp.result).LCTransDocsReceive;
        // console.log(JSON.stringify(resultBill));

        var billHtmlTabs = "";
        var k;
        if (resultBill != null) {
            // console.log("le: "+resultBill.length);
            for (k = 0; k < resultBill.length; k++) {
                // console.log("no"+resultBill[k].No);
                // console.log(resultBill[k].HandoverAmount);
                // console.log(resultObj.IssuingBank.Name);
                // console.log(resultBill[k].ReceivedDate.substr(0, (resultBill[k].ReceivedDate).indexOf('T')));
                billHtmlTabs += (
                    "<tr>" +
                    "<td width=103  style='width:77.35pt;border:solid black 1.0pt;border-top:none;padding:0cm 5.4pt 0cm 5.4pt;'>" +
                    "<p class=MsoNormal align=center style='text-align:center'><span lang=EN-US>" + resultBill[k].ReceivedDate.substr(0, (resultBill[k].ReceivedDate).indexOf('T')) + "</span></p></td>" +
                    "<td width=103  style='width:77.35pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;'>" +
                    "<p class=MsoNormal align=center style='text-align:center'><span lang=EN-US>" + resultBill[k].No + "</span></p></td>" +
                    "<td width=103  style='width:77.4pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;'>" +
                    "<p class=MsoNormal align=center style='text-align:center'><span lang=EN-US>" + resultBill[k].HandoverAmount + "</span></p></td>" +
                    "<td width=103 style='width:77.4pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt; padding:0cm 5.4pt 0cm 5.4pt;'>" +
                    "<p class=MsoNormal align=center style='text-align:center'><span lang=EN-US>&nbsp;</span></p></td>" +
                    "<td width=103  style='width:77.4pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;'>" +
                    "<p class=MsoNormal align=center style='text-align:center'><span lang=EN-US>" + resultObj.IssuingBank.Name + "</span></p></td>" +
                    "<td width=103 style='width:77.4pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;'>" +
                    "<p class=MsoNormal align=center style='text-align:center'><span lang=EN-US>&nbsp;</span></p></td>" +
                    "</tr>"
                );
            }
        }
        else {
            billHtmlTabs += (
                "<tr>" +
                "<td width=103 valign=top style='width:77.35pt;border:solid black 1.0pt;border-top:none;padding:0cm 5.4pt 0cm 5.4pt;'>" +
                "<p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
                "<td width=103 valign=top style='width:77.35pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;'><p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
                "<td width=103 valign=top style='width:77.4pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;'><p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
                "<td width=103 valign=top style='width:77.4pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt; padding:0cm 5.4pt 0cm 5.4pt;'><p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
                "<td width=103 valign=top style='width:77.4pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;'><p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
                "<td width=103 valign=top style='width:77.4pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;'><p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
                "</tr>" +
                "<tr >" +
                "<td width=103 valign=top style='width:77.35pt;border:solid black 1.0pt;border-top:none;padding:0cm 5.4pt 0cm 5.4pt;'>" +
                "<p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
                "<td width=103 valign=top style='width:77.35pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;'><p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
                "<td width=103 valign=top style='width:77.4pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;'><p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
                "<td width=103 valign=top style='width:77.4pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt; padding:0cm 5.4pt 0cm 5.4pt;'><p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
                "<td width=103 valign=top style='width:77.4pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;h'><p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
                "<td width=103 valign=top style='width:77.4pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;'><p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
                "</tr>" +
                "<tr style=''>" +
                "<td width=103 valign=top style='width:77.35pt;border:solid black 1.0pt;border-top:none;padding:0cm 5.4pt 0cm 5.4pt;'>" +
                "<p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
                "<td width=103 valign=top style='width:77.35pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;'><p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
                "<td width=103 valign=top style='width:77.4pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;'><p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
                "<td width=103 valign=top style='width:77.4pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt; padding:0cm 5.4pt 0cm 5.4pt;'><p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
                "<td width=103 valign=top style='width:77.4pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;'><p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
                "<td width=103 valign=top style='width:77.4pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;'><p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
                "</tr>"
            );
        }

        var checkNegotiateHtml;
        if (resultObj.Negotiate === "1") {
            checkNegotiateHtml = (
                "<span><input name='subject' type='checkbox' checked /> 以下银行可议付<span >&nbsp;&nbsp;</span>□ 任意银行可议付<span >&nbsp;&nbsp;</span>□ 不可议付</span>"
            );
        }
        else if (resultObj.Negotiate === "2") {
            checkNegotiateHtml = (
                "<span style='font-family:宋体'>□ 以下银行可议付<span >&nbsp;&nbsp; </span><input name='subject' type='checkbox' checked /> 任意银行可议付<span >&nbsp;&nbsp;</span>□ 不可议付</span>"
            );
        }
        else {
            checkNegotiateHtml = (
                "<span style='font-family:宋体'>□ 以下银行可议付<span >&nbsp;&nbsp; </span>□ 任意银行可议付<span >&nbsp;&nbsp;</span><input name='subject' type='checkbox' checked /> 不可议付</span>"
            )
        }

        var checkTransferHtml;
        if (resultObj.Transfer === "1") {
            checkTransferHtml = (
                "<span style='font-family:宋体'><input name='subject' type='checkbox' checked /> 可转让<span >&nbsp;&nbsp;&nbsp;&nbsp; </span>□ 不可转让</span>"
            );
        }
        else {
            checkTransferHtml = (
                "<span style='font-family:宋体'>□ 可转让<span >&nbsp;&nbsp;&nbsp;&nbsp; </span><input name='subject' type='checkbox' checked /> 不可转让</span>"
            )
        }

        var checkConfirmedHtml;
        if (resultObj.Confirmed === "1") {
            checkConfirmedHtml = (
                "<span style='font-family:宋体'><input name='subject' type='checkbox' checked /> 可保兑<span >&nbsp;&nbsp;&nbsp;&nbsp; </span>□ 不可保兑</span>"
            );
        }
        else {
            checkConfirmedHtml = (
                "<span style='font-family:宋体'>□ 可保兑<span >&nbsp;&nbsp;&nbsp;&nbsp; </span><input name='subject' type='checkbox' checked /> 不可保兑</span>"
            )
        }

        let checkIsAtSightHtml;
        if (resultObj.isAtSight) {
            checkIsAtSightHtml = (
                "<span style='font-family:宋体'><input name='subject' type='checkbox' checked /> 即期</span><span lang=EN-US>&nbsp;</span><span style='font-family:宋体'>□ 远期</span>"
            );
        }
        else {
            checkIsAtSightHtml = (
                "<span style='font-family:宋体'>□ 即期</span><span lang=EN-US>&nbsp; </span><span style='font-family:宋体'><input name='subject' type='checkbox' checked /> 远期</span>"
            );
        }

        var checkIsFarHtml;
        if (resultObj.isAtSight) {
            checkIsFarHtml = (
                "<span style='font-family:宋体; '>□ 货物装运日/服务交付日后</span> <span lang=EN-US><u>" + afterSight + "</u></span> <span style='font-family:宋体'>天</span> <span >&nbsp;<input name='subject' type='checkbox' checked /> 见单后<u><span lang=EN-US>&nbsp;&nbsp;</span></u>天<span lang=EN-US> </span></span>"
            );
        }
        else {
            checkIsFarHtml = (
                "<span style='font-family:宋体';><input name='subject' type='checkbox' checked /> 货物装运日/服务交付日后</span> <span lang=EN-US><u>&nbsp;" + afterSight + "&nbsp;</u></span> <span style='font-family:宋体'>天</span> <span>&nbsp; □ 见单后<u><span lang=EN-US>&nbsp;&nbsp;</span></u>天<span lang=EN-US> </span></span>"
            );
        }

        var checkallowPartialShipmentHtml;
        if (resultObj.GoodsInfo.allowPartialShipment) {
            checkallowPartialShipmentHtml = (
                "<span style='font-family:宋体'><input name='subject' type='checkbox' checked /> 允许</span><span lang=EN-US>&nbsp;&nbsp;</span><span style='font-family:宋体'>□ 不允许</span>"
            );
        }
        else {
            checkallowPartialShipmentHtml = (
                "<span><input name='subject' type='checkbox' checked /> 允许</span><span lang=EN-US>&nbsp;&nbsp;</span><span style='font-family:宋体'>□ 不允许</span>"
            );
        }

        var checkallowPartialShipment;
        if (resultObj.GoodsInfo.allowPartialShipment) {
            checkallowPartialShipment = (
                "<span> <input name='subject' type='checkbox' checked /> 允许</span><span lang=EN-US>&nbsp;&nbsp;&nbsp;&nbsp; </span><span style='font-family:宋体'>□ 不允许</span>"
            );
        }
        else {
            checkallowPartialShipment = (
                "<span> <input name='subject' type='checkbox' checked /> 允许</span><span lang=EN-US>&nbsp;&nbsp;&nbsp;&nbsp; </span><span style='font-family:宋体'>□ 不允许</span>"
            );
        }

        var htmlStr = '<html>' +
            '<head>' +
            '<meta http-equiv=Content-Type content="text/html; charset=utf-8">' +
            '<meta name=Generator content="pdf">' +
            '<title></title>' +
            '</head>' +
            '<body bgcolor=white lang=ZH-CN style=" margin-left:30pt; margin-right:30pt; font-size:10pt;">' +
            '<div style="layout-grid:15.6pt">' +
            "<p class=MsoNormal><span lang=EN-US>&nbsp;</span></p></td>" +
            "<p class=MsoNormal align=center style='text-align:center;'><b><span lang=EN-US style='font-size:16.0pt;font-family:宋体'>" + issuingBankName + "</span></b><b><span style='font-size:16.0pt;font-family:宋体'>银行国内信用证</span></b></p>" +
            "<span style='font-family:宋体'>开证日期：" +
            "<u><span lang=EN-US>&nbsp;" + applyTime_year + "&nbsp;</span></u>年" +
            "<u><span lang=EN-US>&nbsp;" + applyTime_month + "&nbsp;</span></u>月" +
            "<u><span lang=EN-US>&nbsp;" + applyTime_day + "&nbsp;</span></u>日" +
            "<span lang=EN-US style='text-align:right; float:right; align:right'>" +
            "信用证编号：<u><span lang=EN-US>&nbsp;" + resultObj.LCNo + "&nbsp;&nbsp;</span></u></span></br>" +
            "<table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0 style='border-collapse:collapse;font-size:10pt;margin-top:2pt'>" +
            "<tr style='page-break-inside:avoid;'>" +
            "<td width=26 rowspan=3 valign=top style='width:19.5pt;border:solid windowtext 1.0pt; border-bottom:none;padding:0cm 1.5pt 0cm 1.5pt;layout-flow:vertical-ideographic;'>" +
            "<p class=MsoNormal align=center style='margin-top:10pt;margin-right:5.65pt;margin-bottom:0cm;margin-left:5.65pt;margin-bottom:.0001pt;text-align:center;;text-autospace:none'><b><span style='font-family:宋体;color:black'>开证申请人</span></b></p>" +
            "</td>" +
            "<td width=53 valign=top style='width:39.75pt;border:solid windowtext 1.0pt;border-left:none;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal align=center style='text-align:center;text-autospace:none'><span style='font-family:宋体;color:black'>全称</span></p></td>" +
            "<td width=238 valign=top style='width:178.5pt;border:solid windowtext 1.0pt;border-left:none;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal style='text-autospace:none'><span lang=EN-US style='font-family:宋体;color:black'>" +
            resultObj.Applicant.Name + "</span></p></td>" +
            "<td width=21 rowspan=3 valign=top style='width:15.75pt;border-top:solid windowtext 1.0pt;border-left:none;border-bottom:none;border-right:solid windowtext 1.0pt;padding:0cm 1.5pt 0cm 1.5pt;layout-flow:vertical-ideographic;height:15.0pt'>" +
            "<p class=MsoNormal align=center style='margin-top:20pt;margin-right:5.65pt;margin-bottom:0cm;margin-left:5.65pt;margin-bottom:.0001pt;text-align:center;text-autospace:none'><b><span style='font-family:宋体;color:black'>受益人</span></b></p>" +
            "</td>" +
            "<td width=56 valign=top style='width:42.0pt;border:solid windowtext 1.0pt;border-left:none;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal align=center style='text-align:center;text-autospace:none'><span style='font-family:宋体;color:black'>全称</span></p></td>" +
            "<td width=224 valign=top style='width:168.1pt;border:solid windowtext 1.0pt;border-left:none;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal style='text-autospace:none'><span lang=EN-US style='font-family:宋体;color:black'>" +
            resultObj.Beneficiary.Name + "</span></p></td>" +
            "</tr>" +
            "<tr style='page-break-inside:avoid;height:30.75pt'>" +
            "<td width=53 valign=top style='width:39.75pt;border:none;border-right:solid windowtext 1.0pt;padding:0cm 1.5pt 0cm 1.5pt;height:30.75pt'>" +
            "<p class=MsoNormal align=center style='text-align:center;text-autospace:none'><span style='font-family:宋体;color:black'>地址</span></p>" +
            "<p class=MsoNormal align=center style='text-align:center;text-autospace:none'><span style='font-family:宋体;color:black'>邮编</span></p></td>" +
            "<td width=238 valign=top style='width:178.5pt;border:none;border-right:solid windowtext 1.0pt;padding:0cm 1.5pt 0cm 1.5pt;height:30.75pt'>" +
            "<p class=MsoNormal style='text-autospace:none'><span lang=EN-US style='font-family:宋体;color:black'>" +
            resultObj.Applicant.Address + "</span></p></td>" +
            "<td width=56 valign=top style='width:42.0pt;border:none;border-right:solid windowtext 1.0pt; padding:0cm 1.5pt 0cm 1.5pt;height:30.75pt'>" +
            "<p class=MsoNormal align=center style='text-align:center;text-autospace:none'><span style='font-family:宋体;color:black'>地址</span></p>" +
            "<p class=MsoNormal align=center style='text-align:center;text-autospace:none'><span style='font-family:宋体;color:black'>邮编</span></p></td>" +
            "<td width=224 valign=top style='width:168.1pt;border:none;border-right:solid windowtext 1.0pt;padding:0cm 1.5pt 0cm 1.5pt;height:30.75pt'>" +
            "<p class=MsoNormal style='text-autospace:none'><span lang=EN-US style='font-family:宋体;color:black'>" +
            resultObj.Beneficiary.Address + "</span></p></td></tr>" +
            "<tr style='page-break-inside:avoid;'>" +
            "<td width=53 valign=top style='width:39.75pt;border-top:solid windowtext 1.0pt; border-left:none;border-bottom:none;border-right:solid windowtext 1.0pt;  padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal align=center style='text-align:centertext-autospace:none'><span style='font-family:宋体;color:black'>电话</span></p></td>" +
            "<td width=238 valign=top style='width:178.5pt;border-top:solid windowtext 1.0pt;border-left:none;border-bottom:none;border-right:solid windowtext 1.0pt; padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal style='text-autospace:none'><span lang=EN-US style='font-family:宋体;color:black;'>&nbsp;</span></p></td>" +
            "<td width=56 valign=top style='width:42.0pt;border-top:solid windowtext 1.0pt;border-left:none;border-bottom:none;border-right:solid windowtext 1.0pt;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal align=center style='text-align:center;text-autospace:none'><span style='font-family:宋体;color:black'>电话</span></p></td>" +
            "<td width=224 valign=top style='width:168.1pt;border-top:solid windowtext 1.0pt;border-left:none;border-bottom:none;border-right:solid windowtext 1.0pt;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal style='text-autospace:none'><span lang=EN-US style='font-family:宋体;color:black;'>&nbsp;</span></p></td>" +
            "</tr>" +
            "<tr style='page-break-inside:avoid;'>" +
            "<td width=79 colspan=2 valign=top style='width:59.25pt;border:solid windowtext 1.0pt;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal align=center style='text-align:center;;text-autospace:none'><b><span style='font-family:宋体;color:black;'>信用证金额</span></b></p></td>" +
            "<td width=539 colspan=4 valign=top style='width:404.35pt;border:solid windowtext 1.0pt;border-left:none;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal align=left style='text-align:left;'><span style='font-family:宋体;color:black'>人民币（大小写）</span>" +
            "</br>" +
            resultObj.amount + "元</span></p></td>" +
            "</tr>" +
            "<tr style='page-break-inside:avoid;height:20.0pt'>" +
            "<td width=79 colspan=2 valign=top style='width:59.25pt;border:solid windowtext 1.0pt;border-top:none;padding:0cm 1.5pt 0cm 1.5pt;height:20.0pt'>" +
            "<p class=MsoNormal style='text-autospace:none'><b><span style='font-family:宋体;color:black'>通知行名称、行号、地址及邮编</span></b></p></td>" +
            "<td width=539 colspan=4 valign=top style='width:404.35pt;border-top:none;border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0cm 1.5pt 0cm 1.5pt;height:20.0pt'>" +
            "<p class=MsoNormal style='text-autospace:none'><span lang=EN-US style='font-family:宋体;color:black'>" +
            resultObj.AdvisingBank.Name + "</span></br>" +
            resultObj.AdvisingBank.AccountNo + "</span></br>" +
            resultObj.AdvisingBank.Address + "</span></p>" +
            "</td>" +
            "</tr>" +
            "<tr style='page-break-inside:avoid;'>" +
            "<td width=79 colspan=2 valign=top style='width:59.25pt;border:solid windowtext 1.0pt;border-top:none;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal style='text-autospace:none'><b><span style='font-family:宋体;color:black'>有效期及有效地点</span></b></p></td>" +
            "<td width=539 colspan=4 valign=top style='width:404.35pt;border-top:none;border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal style='text-autospace:none'><span lang=EN-US style='font-family:宋体;color:black'>" + resultObj.expiryDate.substr(0, (resultObj.expiryDate).indexOf('T')) + "</span></br>" +
            "<span>" + resultObj.ExpiryPlace + "</span></p></td>" +
            "</tr>" +
            "<tr style='page-break-inside:avoid;'>" +
            "<td width=79 colspan=2 valign=top style='width:59.25pt;border:solid windowtext 1.0pt;border-top:none;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal style='text-autospace:none'><b><span style='font-family:宋体;color:black'>是否可议付</span></b></p></td>" +
            "<td width=539 colspan=4 valign=top style='width:404.35pt;border-top:none;border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal style='text-autospace:none'>" + checkNegotiateHtml + "</p></td>" +
            "</tr>" +
            "<tr style='page-break-inside:avoid;'>" +
            "<td width=79 colspan=2 valign=top style='width:59.25pt;border:solid windowtext 1.0pt;border-top:none;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal style='text-autospace:none'><b><span style='font-family:宋体;color:black'>议付行名称及行号</span></b></p></td>" +
            "<td width=539 colspan=4 valign=top style='width:404.35pt;border-top:none;border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal align=center style='text-align:center;text-autospace:none'><span lang=EN-US style='font-family:宋体;color:black'>&nbsp;</span></p></td></tr>" +
            "<tr style='page-break-inside:avoid;'>" +
            "<td width=79 colspan=2 valign=top style='width:59.25pt;border:solid windowtext 1.0pt;border-top:none;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal style='text-autospace:none'><b><span style='font-family:宋体;color:black'>是否可转让</span></b></p></td>" +
            "<td width=539 colspan=4 valign=top style='width:404.35pt;border-top:none;border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal style='text-autospace:none'>" + checkTransferHtml + "</p></td>" +
            "</tr>" +
            "<tr style='page-break-inside:avoid;'>" +
            "<td width=79 colspan=2 valign=top style='width:59.25pt;border:solid windowtext 1.0pt;border-top:none;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal style='text-autospace:none'><b><span style='font-family:宋体;color:black'>转让行名称及行号</span></b></p></td>" +
            "<td width=539 colspan=4 valign=top style='width:404.35pt;border-top:none;border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal align=center style='text-align:center;text-autospace:none'><span lang=EN-US style='font-family:宋体;color:black'>&nbsp;</span></p></td></tr>" +

            "<tr style='page-break-inside:avoid;'>" +
            "<td width=79 colspan=2 valign=top style='width:59.25pt;border:solid windowtext 1.0pt;border-top:none;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal style='text-autospace:none'><b><span style='font-family:宋体;color:black'>是否可保兑</span></b></p></td>" +
            "<td width=539 colspan=4 valign=top style='width:404.35pt;border-top:none;border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal style='text-autospace:none'>" + checkConfirmedHtml + "</p></td>" +
            "</tr>" +
            "<tr style='page-break-inside:avoid;'>" +
            "<td width=79 colspan=2 valign=top style='width:59.25pt;border:solid windowtext 1.0pt;border-top:none;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal style='text-autospace:none'><b><span style='font-family:宋体;color:black'>保兑行名称及行号</span></b></p></td>" +
            "<td width=539 colspan=4 valign=top style='width:404.35pt;border-top:none;border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0cm 1.5pt 0cm 1.5pt;'>" +
            "<p class=MsoNormal align=center style='text-align:center;text-autospace:none'><span lang=EN-US style='font-family:宋体;color:black'>&nbsp;</span></p></td></tr>" +
            "</table>" +
            "<p class=MsoNormal ><b><span style='font-family:宋体'>交单期：</span></b><u><span lang=EN-US>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></u>" +
            "</br><span style='font-family:宋体'><b>付款期限: </span></b>" +
            checkIsAtSightHtml +
            "</br><span style='text-indent:8em;'>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
            checkIsFarHtml +
            "</span>" +
            "</br><span style='text-indent:8em;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;□  货物收据签发日<span lang=EN-US>/</span>服务提供日后<u><span lang=EN-US>&nbsp;&nbsp;&nbsp;</span></u>天<span> &nbsp;</span>□  其他<u><span lang=EN-US>&nbsp;&nbsp;&nbsp;</span></u></span>" +
            "</br><b><span>转&nbsp;&nbsp;运: </span></b>" +
            checkallowPartialShipmentHtml +
            "</br><b><span style='font-family:宋体'>货物运输或交货方式/服务方式：</span></b>" +
            "<u><span lang=EN-US>&nbsp;" + resultObj.GoodsInfo.ShippingWay + "&nbsp;</span></u>" +
            "</br ><b><span style='font-family:宋体'>分批装运货物/分次提供服务: </span></b>" +
            checkallowPartialShipment +
            "</br><b><span style='font-family:宋体'>货物装运地（港）：</span></b>" +
            "<span lang=EN-US>&nbsp;" + resultObj.GoodsInfo.ShippingPlace + "</span>" +
            "<span style='float:right'><b><span style='font-family:宋体;'>货物目的地、交货地（港）：</span></b>" +
            "<span lang=EN-US>" + resultObj.GoodsInfo.ShippingDestination + "</span></span>" +
            "</br><b><span style='font-family:宋体'>服务提供地点：</span></b>" +
            "<u><span lang=EN-US>&nbsp;" + resultObj.GoodsInfo.ShippingDestination + "&nbsp;</span></u>" +
            "</br><b><span style='font-family:宋体'>最迟装运货物/服务提供日期：</span></b>" +
            "<u><span lang=EN-US>" + latestShipmentDate_year + "</span></u><span style='font-family:宋体'>年</span>" +
            "<u><span lang=EN-US>" + latestShipmentDate_month + "</span></u><span style='font-family:宋体'>月</span>" +
            "<u><span lang=EN-US>" + latestShipmentDate_day + "</span></u><span style='font-family:宋体'>日,</span>" +
            "<b><span style='font-family:宋体'>分期装运/提供服务: </span></b>" +
            "<u><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></u></span>" +
            // "</div>" +
            // "<b><span lang=EN-US style='font-size:10.5pt;font-family:'Times New Roman',serif'><br clear=all style='page-break-before:always'></span></b>" +
            // "<div class=WordSection2 style='layout-grid:15.6pt'>" +
            // "<p class=MsoNormal><span>&nbsp;</span></p>" +
            "</br><b><span style='font-family:宋体'>货物/服务描述：</span></b>" +
            "</br><span lang=EN-US>&nbsp;" + resultObj.GoodsInfo.GoodsDescription + "</span>" +
            "</br><b><span style='font-family:宋体'>受益人应提交的单据</span></b><span style='font-family:宋体'>：</span></p>" +
            "</br><b><span style='font-family:宋体'>其他条款:</span></b>" +
            "</br><span lang=EN-US>1. </span><span style='font-family:宋体'>溢短装条款比例: " + overLow + "</span>" +
            "</br><span lang=EN-US>2.</span><span lang=EN-US style='font-family: 宋体'> </span><span style='font-family:宋体'>如果提交了单证不符的单据，我行将在付款时扣除<u><spanlang=EN-US>&nbsp;&nbsp;&nbsp;&nbsp; </span></u>元人民币的不符点费。</span>" +
            "</br><span>3. </span><span>" + chargeInIssueBank + "</span>" +
            "</br><span>4. </span><span>" + chargeOutIssueBank + "</span>" +
            "</br><span>5. </span><span>" + docDelay + "</span>" +
            "</br><span>6. </span><span>发起日期不能早于开证日期。</span>" +
            "<p class=MsoNormal><span lang=EN-US>&nbsp;</span></p>" +
            "<p class=MsoNormal><span lang=EN-US>&nbsp;</span></p>" +
            "<p class=MsoNormal style='text-indent:2em;'><span style='font-family:宋体'>本信用证依据《国内信用证结算办法》开立。本信用证为不可撤销信用证。我行保证在收到相符单据后，履行付款的责任。如信用证为远期信用证，我行将在收到相符单据次日起五个营业日内确认付款，并在到期日付款；如信用证为即期信用证，我行将在收到相符单据次日起五个营业日内付款。议付行或交单行应将每次提交单据情况背书记录在正本信用证背面，并在交单面函中说明。</span></p>" +
            "<span >开证行全称：" + resultObj.IssuingBank.Name + "</span>" +
            "</br><span >地址及邮编：" + resultObj.IssuingBank.Address + "</span>" +
            "</br><span >电话：</span>" +
            "</br><span >传真：</span>" +
            "</br><span style='float:right;padding-right:80pt' >开证行签章：</span></br></br></br>" +
            "<span style='font-family:宋体'>注：信开信用证一式四联，第一联正本</span><span lang=EN-US>,</span><span style='font-family:宋体'>交受益人；第二联副本，通知行留存；第三联副本，开证行留存；第四联副本，开证申请人留存。</span>" +
            "<b><p style='float:center;align:center;text-align:center;font-size:10pt'>交单记录（正本背面）</span></b></p>" +
            "<table class=MsoNormalTable border=1 cellspacing=0 cellpadding=0 style='margin-left:-5.3pt;border-collapse:collapse;border:none;font-size:10pt'>" +
            "<tr>" +
            "<td width=103 style='width:77.35pt;border:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt'>" +
            "<p class=MsoNormal align=center style='text-align:center'><span style='font-family:宋体'>交单日期</span></p></td>" +
            "<td width=103 style='width:77.35pt;border:solid black 1.0pt;border-left:none;padding:0cm 5.4pt 0cm 5.4pt'>" +
            "<p class=MsoNormal align=center style='text-align:center'><span style='font-family:宋体'>业务编号</span></p></td>" +
            "<td width=103 style='width:77.4pt;border:solid black 1.0pt;border-left:none; padding:0cm 5.4pt 0cm 5.4pt'>" +
            "<p class=MsoNormal align=center style='text-align:center'><span style='font-family:宋体'>交单金额</span></p></td>" +
            "<td width=103 style='width:77.4pt;border:solid black 1.0pt;border-left:none;padding:0cm 5.4pt 0cm 5.4pt'>" +
            "<p class=MsoNormal align=center style='text-align:center'><span style='font-family:宋体'>信用证余额</span></p></td>" +
            "<td width=103 style='width:77.4pt;border:solid black 1.0pt;border-left:none; padding:0cm 5.4pt 0cm 5.4pt'>" +
            "<p class=MsoNormal align=center style='text-align:center'><span style='font-family:宋体'>交单行<span lang=EN-US>/</span>议付行名称</span></p></td>" +
            "<td width=103 style='width:77.4pt;border:solid black 1.0pt;border-left:none;padding:0cm 5.4pt 0cm 5.4pt'>" +
            "<p class=MsoNormal align=center style='text-align:center'><span style='font-family:宋体'>经办人签字</span></p></td>" +
            "</tr>" +
            billHtmlTabs +
            "</table>" +
            "</div>"
        "</body>" +
            "</html>"
        // console.log(htmlStr);
        var path = require('path');

        var filePath = path.resolve(__dirname, '../pdf/');
        // html2Pdf(htmlStr, filePath + filename);

        createPdf(htmlStr, filePath + '/zb_' + id + "_" + resultObj.LCNo + '.pdf', resw);

    });
}


/**
 * 生成承兑HTML文件所需要的数据（承兑）
 *
 * Params：id:lcNo
 * return: 
 **/
function writeAcceptancePdf(req, id, bno, isAgree, resw) {
    // console.log("----writeAcceptanceHtml id:%s bno:%s\n", id, bno);
    fabric.query(req, "getLcByNo", [id], function (error, resp) {
        if (resp == null || resp.result == null) {
            resw.end();
            // console.log("----error id:%s bno:%s\n", id, bno);
            return;
        }

        var resultObj = JSON.parse(resp.result).LetterOfCredit;
        //  console.log(resultObj.Applicant.Name);
        var issuingBank = resultObj.IssuingBank.Name;
        var lcNo = resultObj.LCNo;
        var applicantName = resultObj.Applicant.Name;
        var applicantAccount = resultObj.Applicant.Account;
        var applicantAccountNo = resultObj.IssuingBank.AccountNo;
        var applicantAccountName = resultObj.IssuingBank.Name;
        var beneficiaryName = resultObj.Beneficiary.Name;
        var beneficiaryAccount = resultObj.Beneficiary.Account;
        var beneficiaryAccountNo = resultObj.AdvisingBank.AccountNo;
        var beneficiaryAccountName = resultObj.AdvisingBank.Name;

        var resultBill = JSON.parse(resp.result).LCTransDocsReceive;
        var k;
        var handoverAmount = "";
        var receiveData = "";
        var desp = "";
        var billOfLandingsHtmlTabs = "";
        var j;
        if (resultBill != null) {
            // console.log("le: "+JSON.stringify(resultBill));
            for (k = 0; k < resultBill.length; k++) {
                if (bno == resultBill[k].No) {
                    handoverAmount = resultBill[k].HandoverAmount;
                    receiveData = resultBill[k].ReceivedDate.substr(0, (resultBill[k].ReceivedDate).indexOf('T'));
                    desp = resultBill[k].Discrepancy;
                    
                    var resultBillOfLandings  = resultBill[k].BillOfLandings;
                    // console.log("resultBillOfLandings: " + JSON.stringify(resultBillOfLandings));
                    if (resultBillOfLandings.length != 0) {
                        // console.log("le: "+resultBill.length);
                        billOfLandingsHtmlTabs += (                            
                            "<table class=MsoNormalTable border=1 cellspacing=0 cellpadding=0 style='margin-left:20pt;border-collapse:collapse;border:none;font-size:10pt'>" +
                            "<tr>" +
                            "<td width=103 style='width:77.35pt;border:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt'>" +
                            "<p class=MsoNormal align=center style='text-align:center'><span style='font-family:宋体'>货运单号</span></p></td>" +
                            "<td width=103 style='width:77.35pt;border:solid black 1.0pt;border-left:none;padding:0cm 5.4pt 0cm 5.4pt'>" +
                            "<p class=MsoNormal align=center style='text-align:center'><span style='font-family:宋体'>货物编号</span></p></td>" +
                            "<td width=103 style='width:77.4pt;border:solid black 1.0pt;border-left:none; padding:0cm 5.4pt 0cm 5.4pt'>" +
                            "<p class=MsoNormal align=center style='text-align:center'><span style='font-family:宋体'>货物描述</span></p></td>" +
                            "<td width=103 style='width:77.4pt;border:solid black 1.0pt;border-left:none;padding:0cm 5.4pt 0cm 5.4pt'>" +
                            "<p class=MsoNormal align=center style='text-align:center'><span style='font-family:宋体'>发货时间</span></p></td>" +
                            "</tr>"

                            // "</table>"
                        );

                        for (j = 0; j < resultBillOfLandings.length; j++) {
                            // console.log("no"+resultBill[k].No);
                            // console.log(resultBill[k].HandoverAmount);
                            // console.log(resultObj.IssuingBank.Name);
                            // console.log(resultBill[k].ReceivedDate.substr(0, (resultBill[k].ReceivedDate).indexOf('T')));
                            billOfLandingsHtmlTabs += (
                                "<tr>" +
                                "<td width=103 valign=top style='width:77.35pt;border:solid black 1.0pt;border-top:none;padding:0cm 5.4pt 0cm 5.4pt;'>" +
                                "<p class=MsoNormal align=center style='text-align:center'><span lang=EN-US>" + resultBillOfLandings[j].BolNO + "</span></p></td>" +
                                "<td width=103 valign=top style='width:77.35pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;'>" +
                                "<p class=MsoNormal align=center style='text-align:center'><span lang=EN-US>" + resultBillOfLandings[j].GoodsNo + "</span></p></td>" +
                                "<td width=103 valign=top style='width:77.4pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;'>" +
                                "<p class=MsoNormal align=center style='text-align:center'><span lang=EN-US>" + resultBillOfLandings[j].GoodsDesc + "</span></p></td>" +
                                "<td width=103 valign=top style='width:77.4pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0cm 5.4pt 0cm 5.4pt;'>" +
                                "<p class=MsoNormal align=center style='text-align:center'><span lang=EN-US>" + resultBillOfLandings[j].ShippingTime + "</span></p></td>" +
                                // "<p class=MsoNormal align=center style='text-align:center'><span lang=EN-US>" + resultBillOfLandings[j].ShippingTime.substr(0, (resultBillOfLandings[j].ShippingTime).indexOf('T')) + "</span></p></td>" +
                                "</tr>"
                            );
                        }

                        billOfLandingsHtmlTabs += ("</table>");
                    }
                    break;
                }
            }
        }

       
        var isAgreeText = "";
        if (isAgree == "true") {
            isAgreeText = ("（<span>√</span>）同意承付,并在此确认已收到上述信用证项下全套单据。</span></p>" +
                "<p class=MsoNormal style='text-indent:2em;line-height:150%'><span style='font-size:10.0pt;line-height:150%;font-family:仿宋'>" +
                "（<span lang=EN-US>&nbsp;</span>）由于以下不符点拒绝承付。</span></p>" +
                "<p class=MsoNormal style='text-indent:4em;line-height:150%'>不符点：</p>" +
                "<p class=MsoNormal style='text-indent:8em;line-height:150%'><span style='font-size:10.0pt;line-height:150%;font-family:仿宋'>"
                + desp
                + "</span></p>");
        }
        else {
            isAgreeText = ("（<span lang=EN-US>&nbsp;</span>）同意承付,并在此确认已收到上述信用证项下全套单据。</span></p>" +
                "<p class=MsoNormal style='text-indent:2em;line-height:150%'><span style='font-size:10.0pt;line-height:150%;font-family:仿宋'>" +
                "（<span >√</span>）由于以下不符点拒绝承付。</span></p>" +
                "<p class=MsoNormal style='text-indent:4em;line-height:150%'>不符点：</p>" +
                "<p class=MsoNormal style='text-indent:8em;line-height:150%'><span style='font-size:10.0pt;line-height:150%;font-family:仿宋'>"
                + desp
                + "</span></p>");
        }

        var htmlStr = '<html>' +
            '<head>' +
            '<meta http-equiv=Content-Type content="text/html; charset=utf-8">' +
            '<meta name=Generator content="pdf">' +
            '<title></title>' +
            '</head>' +
            '<body lang=ZH-CN style="text-justify-trim:punctuation;margin-left:30pt; margin-right:30pt"">' +
            "<div class=WordSection1 style='layout-grid:15.6pt; font-size:10pt' marg >" +
            "<p class=MsoNormal><span lang=EN-US>&nbsp;</span></p>" +
            "<p class=MsoNormal align=center style='font-size:12.0pt;text-align:center;line-height:150%'><b>承付/拒付通知书—支付凭证</span></b></p>" +
            "<p class=MsoNormal style='line-height:150%'><span style='font-size:10.0pt;line-height:150%;font-family:仿宋'>通知日期: " +
            "" + "</span>" +
            "<span style='align:right;float:right;text-align:right;padding-right:8em'>" + "编号：" + "" + "</span></p>" +
            "<p class=MsoNormal style='line-height:150%'><span style='font-size:10.0pt;line-height:150%;font-family:仿宋'>" +
            "致：" + issuingBank + "</span></p>" +
            "<p class=MsoNormal style='text-indent:2em;line-height:150%;'><span style='font-size:10.0pt;line-height:150%;font-family:仿宋'>信用证号：" +
            lcNo + "</span>" + "<span style='align:right;float:right;text-align:right;padding-right:8em'>" +
            "来单编号：" + bno + "</span></p>" +
            "<p class=MsoNormal style='text-indent:2em;line-height:150%'><span style='font-size:10.0pt;line-height:150%;font-family:仿宋'>到单日期：" +
            "" + "<span style='align:right;float:right;text-align:right;padding-right:8em'>" +
            "合同号：" + "" + "</span></p>" +
            "<p class=MsoNormal style='text-indent:2em;line-height:150%'><span style='font-size:10.0pt;line-height:150%;font-family:仿宋'>到单金额：" +
            handoverAmount + "<span style='align:right;float:right;text-align:right;padding-right:8em'>" +
            "承付到期日：" + "" + "</span></p>" +
            "<p class=MsoNormal style='text-indent:2em;line-height:150%'><span style='font-size:10.0pt;line-height:150%;font-family:仿宋'>单据清单：" +
            "" + "</span></p>" +
            billOfLandingsHtmlTabs +
            "<p class=MsoNormal style='text-indent:2em;line-height:150%'><span style='font-size:10.0pt;line-height:150%;font-family:仿宋'></span></p>" +

            "<p class=MsoNormal style='text-indent:2em;line-height:150%'><span style='font-size:10.0pt;line-height:150%;font-family:仿宋'>付款人名称：" +
            applicantName + "<span style='align:right;float:right;text-align:right;'>" +
            "收款人名称：" + beneficiaryName + " </span></p>" +
            "<p class=MsoNormal style='text-indent:2em;line-height:150%'><span style='font-size:10.0pt;line-height:150%;font-family:仿宋'>付款人账号：" +
            applicantAccount + "<span style='align:right;float:right;text-align:right;padding-right:2em'>" +
            "收款人账号：" + beneficiaryAccount + "</span></p>" +
            "<p class=MsoNormal style='text-indent:2em;line-height:150%'><span style='font-size:10.0pt;line-height:150%;font-family:仿宋'>付款人账户开户行：" +
            "<span style='align:right;float:right;text-align:right;padding-right:8em'>" +
            "收款人账户开户行：</span></p>" +

            "<p class=MsoNormal style='text-indent:2em;line-height:150%'><span style='font-size:10.0pt;line-height:150%;font-family:仿宋'>" +
            applicantAccountNo + "<span style='align:right;float:right;text-align:right;padding-right:6em'>" +
            beneficiaryAccountNo + "</span></p>" +

            "<p class=MsoNormal style='text-indent:2em;line-height:150%'><span style='font-size:10.0pt;line-height:150%;font-family:仿宋'>" +
            applicantAccountName + "<span style='align:right;float:right;text-align:right;padding-right:4em'>" +
            beneficiaryAccountName + "</span></p>" +

            "<p class=MsoNormal style='text-indent:2em;line-height:150%'><span style='font-size:10.0pt;line-height:150%;font-family:仿宋'></span></p>" +

            "<p class=MsoNormal style='line-height:150%'><span lang=EN-US style='font-size:10.0pt;line-height:150%;font-family:仿宋'>&nbsp;&nbsp;&nbsp; </span><span style='font-size:10.0pt;line-height:150%;font-family:仿宋'>上述信用证项下来单通知书业已收悉，我司</span></p>" +
            "<p class=MsoNormal style='text-indent:2em;line-height:150%'><span style='font-size:10.0pt;line-height:150%;font-family:仿宋'>" +
            isAgreeText
            + "<p class=MsoNormal style='line-height:150%;text-align:right;padding-right:6em'>申请人预留印鉴章及公章</p>" +
            "</div>"
        "</body>" +
            "</html>"
        // console.log(htmlStr);
        var path = require('path');

        var filePath = path.resolve(__dirname, '../pdf/');
        createPdfFile(htmlStr, 'cd_' + id + "_" + resultObj.LCNo + "_" + bno + '.pdf', resw);

    });
}


/**
 * 生成html
 *
 * Params：
 * return: 
 **/
// function createHtml(htmlStr, filename) {
//     var path = require('path');

//     var filePath = path.resolve(__dirname, '../pdf/');
//     html2Pdf(htmlStr, filePath + filename);


//readdir方法读取文件名
//readFile方法读取文件内容
//writeFile改写文件内容
// fs.readdir(filePath, 'utf8', function (err, data) {

//     data.forEach(function (item, index) {
//         console.log(item)
//         fs.readFile('../pdf/' + item, 'utf8', function (err, files) {
//             console.log(files)
//             // var result = files.replace(/要替换的内容/g, '替换后的内容');

//             // fs.writeFile('./js/' + item, result, 'utf8', function (err) {
//             //     if (err) return console.log(err);
//             // });

//         })
//     });

// });
// }
function createPdfFile(html, pdfName, resw) {
    // var path = require('path');
    // var filePath = path.resolve(__dirname, '../node_modules/phantomjs-prebuilt/bin/phantomjs');
    // console.log(html);
    // var options = { format: true };
    var options = {
        // phantomPath: filePath,
        filename: pdfName,
        format: 'A4',
        orientation: 'portrait',
        type: "pdf",
        timeout: 30000
    };

    pdf.create(html, options).toBuffer(function (err, buffer) {
        if (err) return console.log(err);
        // res.setHeader('Content-Type', 'application/json');
        var result = fileServer.uploadFileStream("coverletter", buffer.toJSON().data.toString(), pdfName);
        
        // console.log(buffer.toJSON().data.toString());                   
        // console.log(pdfName);
        // console.log(JSON.stringify(result));
        resw.end(JSON.stringify("审核通过"));
      });

    // pdf.create(html, options).toFile(function (err, res) {
    //     if (err) {
    //         resw.end(JSON.stringify("审核通过"));
    //         return console.log(err);
    //     }
    //     console.log(res);
    //     resw.end(JSON.stringify("审核通过"));
    // });
};

// function createPdf(html, pdfName, resw) {
//     var path = require('path');
//     var filePath = path.resolve(__dirname, '../node_modules/phantomjs-prebuilt/bin/phantomjs');
//     // console.log(html);
//     // var options = { format: true };
//     var options = {
//         phantomPath: filePath,
//         filename: pdfName,
//         format: 'A4',
//         orientation: 'portrait',
//         type: "pdf",
//         timeout: 30000
//     };
//     pdf.create(html, options).toFile(function (err, res) {
//         if (err) {
//             resw.end(JSON.stringify("审核通过"));
//             return console.log(err);
//         }
//         console.log(res);
//         resw.end(JSON.stringify("审核通过"));
//     });
// };

