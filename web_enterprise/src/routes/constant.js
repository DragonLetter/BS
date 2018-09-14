exports.LC_STEPS = {
    LCStart: "开始",
    ApplicantSaveLCApplyFormStep: "保存",
    BankConfirmApplyFormStep: "银行审核",
    ApplicantFillLCDraftStep: "填写信用证草稿",
    BankIssueLCStep: "银行发证",
    AdvisingBankReceiveLCNoticeStep: "通知行收到信用证通知",
    BeneficiaryReceiveLCStep: "受益人接收信用证",
    ApplicantRetireBillsStep: "申请人赎单",
    IssuingBankReviewRetireBillsStep: "开证行审核赎单",
    IssuingBankCloseLCStep: "闭卷",
    LCEnd: "结束"
};

exports.LC_HANDOVER_STEPS = {
    BeneficiaryHandOverBillsStep: "BeneficiaryHandOverBillsStep", //"受益人交单",
    IssuingBankReviewBillsStep: "IssuingBankCheckBillStep", //"发证行审核交单",
    ApplicantReviewBillsStep: "ApplicantAcceptOrRejectStep", //"申请人审核交单",
    IssuingBankAcceptOrRejectStep: "IssuingBankAcceptanceStep", //"发证行承兑或拒付",
    IssuingBankRejectBillsStep: "ApplicantRejectStep", //"开证行拒付交单",
    ApplicantRejectBillsStep: "IssuingBankRejectStep", //"申请人拒付交单",
    BeneficiaryBillsSuccStep: "HandoverBillSuccStep", //"受益人交单成功"
};

exports.LC_MODIFY_STEPS = {
    ApplicantLCAmendStep: "申请人修改信用证",
    MultiPartyCountersignStep: "多方会签",
}

exports.LC_STEPS_NUM = {
    LCStart: 1,
    ApplicantSaveLCApplyFormStep: 2,
    BankConfirmApplyFormStep: 3,
    ApplicantFillLCDraftStep: 4,
    BankIssueLCStep: 5,
    AdvisingBankReceiveLCNoticeStep: 6,
    BeneficiaryReceiveLCStep: 7,
    ApplicantLCAmendStep: 8,
    MultiPartyCountersignStep: 9,
    BeneficiaryHandOverBillsStep: 10,
    AdvisingBankReviewBillsStep: 11,
    IssuingBankAcceptOrRejectStep: 12,
    ApplicantRetireBillsStep: 13,
    IssuingBankReviewRetireBillsStep: 14,
    IssuingBankCloseLCStep: 15,
    LCEnd: 16
};

exports.APPLICANT_PROCESSING_STEPS = ['保存', '填写信用证草稿', '申请人赎单'];

exports.BENEFICIARY_PROCESSING_STEPS = ["受益人接收信用证"];

exports.LC_STATUS = ["信用证申请", "信用证草稿", "信用证正本", "信用证正本修改", "信用证生效", "交单", "承兑", "赎单", "拒付", "闭卷"];