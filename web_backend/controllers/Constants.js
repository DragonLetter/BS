exports.STEPS = {
    "LCStart": "开始",
    "ApplicantSaveLCApplyFormStep": "保存",
    "BankConfirmApplyFormStep": "银行审核",
    "ApplicantFillLCDraftStep": "填写信用证草稿",
    "BankIssueLCStep": "银行发证",
    "AdvisingBankReceiveLCNoticeStep": "通知行收到信用证通知",
    "BeneficiaryReceiveLCStep": "受益人接收信用证",
    "ApplicantLCAmendStep": "申请人修改信用证",
    "MultiPartyCountersignStep": "多方会签",
    "BeneficiaryHandOverBillsStep": "受益人交单",
    "AdvisingBankReviewBillsStep": "通知行审核交单",
    "IssuingBankAcceptOrRejectStep": "发证行承兑或拒付",
    "ApplicantRetireBillsStep": "申请人赎单",
    "IssuingBankReviewRetireBillsStep": "开证行审核赎单",
    "IssuingBankCloseLCStep": "闭卷",
    "LCEnd": "结束",
  };

  exports.APPLICANT_PROCESSING_STEPS = ['保存','填写信用证草稿','申请人赎单', '银行发证','通知行收到信用证通知', "申请人修改信用证", "发证行承兑或拒付"];

  exports.BENEFICIARY_PROCESSING_STEPS = ["受益人交单", "受益人接收信用证"];

  exports.LC_STATUS = ["信用证申请","信用证草稿","信用证正本","信用证正本修改","信用证生效","交单","承兑","赎单","拒付","闭卷"];