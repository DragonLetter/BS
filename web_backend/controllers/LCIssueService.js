'use strict';
var fabric = require("../fabric")
exports.corporationConfirmDraft = function (req, res, next) { var args=req.swagger.params;
  /**
   * confirm LCIssue
   * Corporation confirms Draft
   *
   * body LCIssue LCIssue
   * no response value expected for this operation
   **/
  res.end();
}

exports.getLCIssueByLcNo = function (req, res, next) { var args=req.swagger.params;
  /**
   * 根据信用证编号获取信用证文本信息
   * 
   *
   * lcno String 
   * returns LCIssue
   **/
  fabric.query(req,"getLcByNo", [args.lcno.value], function (err, resp) {
    if (!err) {
      //TODO
      var lc= {
        "ApplyTime" : "2000-01-23T04:56:07.000+00:00",
        "ExpiryDate" : "2000-01-23T04:56:07.000+00:00",
        "ChargeInIssueBank" : 5,
        "ExpiryPlace" : "aeiou",
        "OtherRequire" : "aeiou",
        "DocumentRequire" : "aeiou",
        "DocDelay" : 2,
        "ShippingDestination" : "aeiou",
        "AdvisingBank" : "",
        "AfterSight" : 6,
        "IsAtSight" : false,
        "Currency" : "aeiou",
        "id" : 0,
        "LcNo" : "aeiou",
        "ChargeOutIssueBank" : 5,
        "Status" : 7,
        "Amount" : 1.46581298050294517310021547018550336360931396484375,
        "AllowTransShippment" : false,
        "ApplyCorp" : {
          "no" : "aeiou",
          "domain" : "aeiou",
          "name" : "aeiou"
        },
        "ContractId" : "aeiou",
        "ShippingPlace" : "aeiou",
        "ShippingWay" : "aeiou",
        "IssueBank" : {
          "no" : "aeiou",
          "address" : "aeiou",
          "accountName" : "aeiou",
          "domain" : "aeiou",
          "accountNo" : "aeiou",
          "name" : "aeiou",
          "remark" : "aeiou"
        },
        "LastestShipDate" : "2000-01-23T04:56:07.000+00:00",
        "GoodsDescription" : "aeiou",
        "Beneficiary" : "",
        "AllowPartialShippment" : false
      };
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(lc));
    }
  });
  
}

exports.lCIssueEdit = function (req, res, next) { var args=req.swagger.params;
  /**
   * 信用证修改
   * edit LCIssue
   *
   * body LCEdit lc edit info
   * no response value expected for this operation
   **/
  res.end();
}

exports.surrenderDocuments = function (req, res, next) { var args=req.swagger.params;
  /**
   * 信用证交单 handOverBills
   * surrender documents
   *
   * body LCDocumentsSurrender LCDocumentsSurrender
   * no response value expected for this operation
   **/
  //TODO 缺少信用证No
  fabric.invoke(req,"handOverBills", [args, JSON.stringify(args)], function (err, resp) {
    if (!err) {
    res.end();
  }
  });
};
