'use strict';
var fabric = require("../fabric");
var models = require('../models');
var sequenceHelper = require("./SequenceHelper");
var constants = require("./Constants");
var moment = require("moment");

exports.addApplicationForm = function (req, res, next) {
  var args = req.swagger.params;
  /**
   * 新建申请表
   * 
   *
   * body ApplicationForm ApplicationForm object that needs to be added to the store
   * no response value expected for this operation
   **/
  var values = args.body.value,
    p1 = models.Corporation.findById(values.ApplyCorpId),
    p2 = models.Corporation.findById(values.BeneficiaryId),
    p3 = models.Bank.findById(values.IssueBankId),
    p4 = models.Bank.findById(values.AdvisingBankId),
    p5 = models.SignedBank.find({
      where: {
        corporationId: values.ApplyCorpId,
        bankId: values.IssueBankId,
      }
    }),
    p6 = models.SignedBank.find({
      where: {
        corporationId: values.BeneficiaryId,
        bankId: values.AdvisingBankId,
      }
    }),
    lcId = sequenceHelper.GenerateNewId("LC"),
    applyId = sequenceHelper.GenerateNewId("LCApplication"), corpNo;
  Promise.all([p1, p2, p3, p4, p5, p6, lcId, applyId]).then(
    function ([applicant, beneficiary, issueBank, advisingBank, applicantSign, beneficiarySign, lcIdNumber, applyIdNumber]) {
      console.log(applicant, beneficiary, issueBank, advisingBank, applicantSign, beneficiarySign, lcIdNumber);
      var fabricArg1 = values.No ? values.No.toString() : lcIdNumber.toString();
      corpNo = applicant.id.toString();
      var fabricArg2 = {
        "No": applyIdNumber.toString(),
        "Applicant": {
          "No": applicant.id.toString(),
          "Name": applicant.name,
          "Domain": applicant.domain,
          "Account": applicant.account,
          "DepositBank": applicant.depositBank,
          "Address": applicant.address,
        },
        "Beneficiary": {
          "No": beneficiary.id.toString(),
          "Name": beneficiary.name,
          "Domain": beneficiary.domain,
          "Account": beneficiary.account,
          "DepositBank": beneficiary.depositBank,
          "Address": beneficiary.address,
        },
        "IssuingBank": {
          "No": issueBank.no,
          "Name": issueBank.name,
          "Domain": issueBank.domain,
          "Address": issueBank.address,
          "AccountNo": applicantSign.accountNo,
          "AccountName": applicantSign.accountName,
          "Remark": applicantSign.remark,
        },
        "AdvisingBank": {
          "No": advisingBank.no,
          "Name": advisingBank.name,
          "Domain": advisingBank.domain,
          "Address": advisingBank.address,
          "AccountNo": beneficiarySign.accountNo,
          "AccountName": beneficiarySign.accountName,
          "Remark": beneficiarySign.remark,
        },
        "ExpiryDate": values.ExpiryDate,
        "ExpiryPlace": values.ExpiryPlace,
        "IsAtSight": values.IsAtSight.toString(),
        "AfterSight": values.AfterSight.toString(),
        "GoodsInfo": {
          // "GoodsNo": "1234567",
          "AllowPartialShipment": values.AllowPartialShippment,
          "AllowTransShipment": values.AllowTransShipment,
          "LatestShipmentDate": values.LastestShipDate,
          "ShippingWay": values.ShippingWay,
          "ShippingPlace": values.ShippingPlace,
          "ShippingDestination": values.ShippingDestination,
          "TradeNature": values.TradeType.toString(),
          "GoodsDescription": values.GoodsDescription,
        },
        "DocumentRequire": values.DocumentRequire.toString(),
        "Currency": values.Currency,
        "Amount": values.Amount.toString(),
        "EnsureAmount": values.EnsureAmount,
        "Negotiate": values.Negotiate.toString(),
        "Transfer": values.Transfer.toString(),
        "Confirmed": values.Confirmed.toString(),
        "Lowfill": values.Lowfill,
        "Overfill": values.Overfill,
        "ApplyTime": moment().format(),
        "ChargeInIssueBank": values.ChargeInIssueBank.toString(),
        "ChargeOutIssueBank": values.ChargeOutIssueBank.toString(),
        "DocDelay": values.DocDelay.toString(),
        "OtherRequire": "none",
        "Contract": values.Contract ? values.Contract : {},
        "Attachments": values.Attachments ? values.Attachments : [],
      };
      fabric.invoke(req, "saveLCApplication", [fabricArg1, JSON.stringify(fabricArg2)], function (err, resp) {
        if (!err) {
          models.Afstate.findOne({
            'where': {
              'AFNo': fabricArg1,
            }
          }).then(function (data) {
            if (data == null) {
              console.log("query afstates:%s\n", fabricArg1);
              models.Afstate.create({
                'AFNo': fabricArg1,
                'step': 'BankConfirmApplyFormStep',
                'state': '11',
              }).then(function (data) {
                console.log("insert afstates");
              }).catch(function (e) {
              });
            }
          });
          submitApplicationFormByCorp(req, corpNo, fabricArg1, res, next);
        }
        else {
          console.log(err);
        }
      });
    });
};

exports.updateAFState = function (req, res, next) {
  var args = req.swagger.params;
  models.Afstate.update(args.body.value,
    {
      'where': { 'AFNo': args.AFNo.value }
    }
  ).then(function (data) {
    console.log(data);
    if (data[0] == 0) {
      console.log('unknown applicationform');
      res.end(JSON.stringify("unknown applicationform"));
    } else if (data[0] == 1) {
      console.log('true');
      res.end(JSON.stringify("true"));
    } else {
      console.log('false');
      res.end(JSON.stringify("false"));
    }
  }).catch(function (e) {
    console.log(e);
  })
};

exports.getAFState = function (req, res, next) {
  var args = req.swagger.params;
  models.Afstate.findOne({
    'where': {
      'AFNo': args.AFNo.value,
    }
  }).then(function (data) {
    if (data) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data.dataValues || {}, null, 2));
    }
  });
};

function submitApplicationFormByCorp(req, corpNo, key, res, next) {
  var id = key;
  // console.log("----No:%s-----\n",id);
  fabric.invoke(req, "submitLCApplication", [id], function (err, resp) {
    if (!err) {
      //console.log("----corpId:%s-----\n",corpNo);
      var corpId = corpNo;
      getApplicationFormByCorp(req, corpId, res, next);
    }
    else {
      console.log(err);
    }
  });
}

exports.addFile = function (req, res, next) {
  var args = req.swagger.params;
  /**
   * add file to application
   * 
   *
   * body LCFile 
   * no response value expected for this operation
   **/
  res.end();
};

exports.deleteApplicationForm = function (req, res, next) {
  var args = req.swagger.params;
  /**
   * Deletes a ApplicationForm
   * 
   *
   * applicationFormId Long ApplicationForm id to delete
   * no response value expected for this operation
   **/
  res.end();
};

exports.findApplicationFormsByBank = function (req, res, next) {
  var args = req.swagger.params;
  /**
   * 根据开证行的编号获得信用证申请单
   *
   * bankNo String 开证行
   * returns List
   **/
  var bankNo = args.bankNo.value;
  fabric.query(req, "getLcListByIssuingBank", [bankNo], function (err, resp) {
    res.setHeader('Content-Type', 'application/json');
    res.end(resp.result);
  });

};

function getApplicationFormByCorp(req, corpNo, res, next) {
  models.Corporation.findById(corpNo).then(function (corp) {
    if (Object.keys(corp).length > 0) {
      let applyLCs, beneficiaryLCs, lcs;
      fabric.query(req, "getLcListByApplicant", [corpNo], function (err, resp) {
        if (!err) {
          let results = JSON.parse(resp.result);
          applyLCs = results.map(lc => {
            lc.Record.CurrentStep = constants.STEPS[lc.Record.CurrentStep];
            lc.Record.TransProgressFlow.map(flow => {
              flow.Status = constants.STEPS[flow.Status];
            });
            return lc;
          });
          // res.end(JSON.stringify(lcs));
          fabric.query(req, "getLcListByBeneficiary", [corpNo], function (err, resp) {
            if (!err) {
              let results = JSON.parse(resp.result);
              beneficiaryLCs = results.map(lc => {
                lc.Record.CurrentStep = constants.STEPS[lc.Record.CurrentStep];
                lc.Record.TransProgressFlow.map(flow => {
                  flow.Status = constants.STEPS[flow.Status];
                });
                return lc;
              });
              lcs = applyLCs.concat(beneficiaryLCs);
              res.end(JSON.stringify(lcs));
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

    } else {
      res.end();
    }
  });
}

function getApplicationFormByIssuingBank(bankId, res, next) {
  fabric.query(req, "getLcListByIssuingBank", [bankId], function (err, resp) {
    if (!err) {
      let results = JSON.parse(resp.result);
      const lcs = results.map(lc => {
        lc.Record.CurrentStep = constants.STEPS[lc.Record.CurrentStep];
        return lc;
      });
      res.end(JSON.stringify(lcs));
    }
    else {
      console.log(err);
      res.end();
    }
  });
}

exports.findApplicationFormsByCorp = function (req, res, next) {
  var args = req.swagger.params;
  /**
   * 根据企业号获得企业的申请单
   *
   * corpNo String 企业号
   * returns List
   **/
  var corpNo = args.corpNo.value;
  getApplicationFormByCorp(req, corpNo, res, next);
};

exports.findApplicationFormsByMyBank = function (req, res, next) {
  var args = req.swagger.params;
  /**
   * 银行端根据当前用户的银行编号获得信用证申请单
   *
   * returns List
   **/
  var examples = {};
  examples['application/json'] = [{
    "ExpiryDate": "2000-01-23T04:56:07.000+00:00",
    "ChargeInIssueBank": 3,
    "ExpiryPlace": "aeiou",
    "Amount": 9.301444243932575517419536481611430644989013671875,
    "AllowTransShippment": false,
    "ApplyCorpId": 0,
    "DocumentRequire": 7,
    "DocDelay": 4,
    "IssueBankId": 1,
    "ShippingDestination": "aeiou",
    "TradeType": 2,
    "AfterSight": 5,
    "ShippingPlace": "aeiou",
    "IsAtSight": false,
    "AdvisingBankId": 5,
    "ShippingWay": "aeiou",
    "Currency": "aeiou",
    "LastestShipDate": "2000-01-23T04:56:07.000+00:00",
    "GoodsDescription": "aeiou",
    "BeneficiaryId": 6,
    "AllowPartialShippment": false,
    "ChargeOutIssueBank": 2
  }];
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
};

exports.findApplicationFormsByMyCorp = function (req, res, next) {
  var args = req.swagger.params;
  /**
   * 企业端根据当前用户的企业号获得企业的申请单
   *
   * returns List
   **/
  var examples = {};
  examples['application/json'] = [{
    "ExpiryDate": "2000-01-23T04:56:07.000+00:00",
    "ChargeInIssueBank": 3,
    "ExpiryPlace": "aeiou",
    "Amount": 9.301444243932575517419536481611430644989013671875,
    "AllowTransShippment": false,
    "ApplyCorpId": 0,
    "DocumentRequire": 7,
    "DocDelay": 4,
    "IssueBankId": 1,
    "ShippingDestination": "aeiou",
    "TradeType": 2,
    "AfterSight": 5,
    "ShippingPlace": "aeiou",
    "IsAtSight": false,
    "AdvisingBankId": 5,
    "ShippingWay": "aeiou",
    "Currency": "aeiou",
    "LastestShipDate": "2000-01-23T04:56:07.000+00:00",
    "GoodsDescription": "aeiou",
    "BeneficiaryId": 6,
    "AllowPartialShippment": false,
    "ChargeOutIssueBank": 2
  }];
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
};

exports.getApplicationFormById = function (req, res, next) {
  var args = req.swagger.params;
  /**
   * Find ApplicationForm by ID
   * Returns a single ApplicationForm
   *
   * applicationFormId Long ID of ApplicationForm to return
   * returns ApplicationForm
   **/
  var id = args.ApplicationFormId.value.toString();
  fabric.query(req, "getLcByNo", [id], function (error, resp) {
    res.setHeader('Content-Type', 'application/json');
    res.end(resp.result);
  });
};

exports.getApplicationForms = function (req, res, next) {
  var args = req.swagger.params;
  /**
   * Get all ApplicationForms
   * Returns ApplicationForm list
   *
   * returns List
   **/
  var examples = {};
  examples['application/json'] = [{
    "ExpiryDate": "2000-01-23T04:56:07.000+00:00",
    "ChargeInIssueBank": 3,
    "ExpiryPlace": "aeiou",
    "Amount": 9.301444243932575517419536481611430644989013671875,
    "AllowTransShippment": false,
    "ApplyCorpId": 0,
    "DocumentRequire": 7,
    "DocDelay": 4,
    "IssueBankId": 1,
    "ShippingDestination": "aeiou",
    "TradeType": 2,
    "AfterSight": 5,
    "ShippingPlace": "aeiou",
    "IsAtSight": false,
    "AdvisingBankId": 5,
    "ShippingWay": "aeiou",
    "Currency": "aeiou",
    "LastestShipDate": "2000-01-23T04:56:07.000+00:00",
    "GoodsDescription": "aeiou",
    "BeneficiaryId": 6,
    "AllowPartialShippment": false,
    "ChargeOutIssueBank": 2
  }];
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
};

exports.updateApplicationForm = function (req, res, next) {
  var args = req.swagger.params;
  /**
   * Update an existing ApplicationForm
   * 
   *
   * body ApplicationForm ApplicationForm object that needs to be added to the store
   * no response value expected for this operation
   **/
  res.end();
};

exports.submitApplicationForm = function (req, res, next) {
  var args = req.swagger.params;
  var id = args.id.value.toString();
  fabric.invoke(req, "submitLCApplication", [id], function (err, resp) {
    if (!err) {
      var corpId = args.corpId.value.toString();
      getApplicationFormByCorp(req, corpId, res, next);
    }
    else {
      console.log(err);
    }
  });
};

exports.confirmApplicationForm = function (req, res, next) {
  var args = req.swagger.params;
  let value = args.body.value, no = value.no, depositAmount = value.depositAmount, lcNo = value.lcNo, suggestion = value.suggestion, isAgreed = value.isAgreed;
  fabric.invoke(req, "bankConfirmApplication", [no, lcNo, depositAmount, suggestion, isAgreed], function (err, resp) {
    if (!err) {
      res.end();
    } else {
      console.log(err);
    }
  });
};