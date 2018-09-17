exports.STEPS = {
  "LCStart": "开始",
  "ApplicantSaveLCApplyFormStep": "保存",
  "BankConfirmApplyFormStep": "银行审核",
  "ApplicantFillLCDraftStep": "填写信用证草稿",
  "BankIssueLCStep": "银行发证",
  "AdvisingBankReceiveLCNoticeStep": "通知行收到信用证通知",
  "BeneficiaryReceiveLCStep": "受益人接收信用证",
  // "ApplicantLCAmendStep": "申请人修改信用证",
  // "MultiPartyCountersignStep": "多方会签",
  // "BeneficiaryHandOverBillsStep": "受益人交单",
  // "AdvisingBankReviewBillsStep": "通知行审核交单",
  // "IssuingBankAcceptOrRejectStep": "发证行承兑或拒付",
  "ApplicantRetireBillsStep": "申请人付款",
  "IssuingBankReviewRetireBillsStep": "开证行审核赎单",
  "IssuingBankCloseLCStep": "闭卷",
  "LCEnd": "结束"
};

exports.AMEND_STEPS = { 
  "AmendApplicantSubmitStep": "申请人发起修改",
  "AmendIssuingBankAcceptStep": "开证行同意发起修改",
  "AmendIssuingBankRejectStep": "开证行拒绝发起修改",
  "AmendAdvisingBankAcceptStep": "通知行同意发起修改",
  "AmendAdvisingBankRejectStep": "通知行拒绝发起修改",
  "AmendBeneficiaryAcceptStep": "受益人同意发起修改",
  "AmendBeneficiaryRejectStep": "受益人拒绝发起修改",
  "AmendEnd": "发起修改交易结束",  
};

exports.STEPS_NUM = {
  "LCStart": 1,
  "ApplicantSaveLCApplyFormStep": 2,
  "BankConfirmApplyFormStep": 3,
  "ApplicantFillLCDraftStep": 4,
  "BankIssueLCStep": 5,
  "AdvisingBankReceiveLCNoticeStep": 6,
  "BeneficiaryReceiveLCStep": 7,
  "ApplicantLCAmendStep": 8,
  "MultiPartyCountersignStep": 9,
  "BeneficiaryHandOverBillsStep": 10,
  "AdvisingBankReviewBillsStep": 11,
  "IssuingBankAcceptOrRejectStep": 12,
  "ApplicantRetireBillsStep": 13,
  "IssuingBankReviewRetireBillsStep": 14,
  "IssuingBankCloseLCStep": 15,
  "LCEnd": 16
};

exports.APPLICANT_PROCESSING_STEPS = ['保存', '填写信用证草稿', '申请人付款'];
exports.AMEND_PROCESSING_STEPS = ['通知行收到信用证通知', "受益人接收信用证", "申请人付款", "开证行审核赎单", "闭卷" ];
exports.BENEFICIARY_PROCESSING_STEPS = ["受益人接收信用证"];

exports.LC_STATUS = ["信用证申请", "信用证草稿", "信用证正本", "信用证正本修改", "信用证生效", "交单", "承兑", "赎单", "拒付", "闭卷"];