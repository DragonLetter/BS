// 1.返回数据里记录的信息
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
    IssuingBankCheckBillStep: "IssuingBankCheckBillStep", //"发证行审核交单",
    ApplicantAcceptOrRejectStep: "ApplicantAcceptOrRejectStep", //"申请人审核交单",
    IssuingBankAcceptanceStep: "IssuingBankAcceptanceStep", //"发证行承兑或拒付",
    IssuingBankRejectStep: "IssuingBankRejectStep", //"开证行拒付交单",
    ApplicantRejectStep: "ApplicantRejectStep", //"申请人拒付交单",
    HandoverBillSuccStep: "HandoverBillSuccStep", //"受益人交单成功"
};

exports.LC_MODIFY_STEPS = {
    AmendApplicantSubmitStep: "AmendApplicantSubmitStep",
    AmendIssuingBankAcceptStep: "AmendIssuingBankAcceptStep",
    AmendIssuingBankRejectStep: "AmendIssuingBankRejectStep",
    AmendAdvisingBankAcceptStep: "AmendAdvisingBankAcceptStep",
    AmendAdvisingBankRejectStep: "AmendAdvisingBankRejectStep",
    AmendBeneficiaryAcceptStep: "AmendBeneficiaryAcceptStep",
    AmendBeneficiaryRejectStep: "AmendBeneficiaryRejectStep",
    AmendEnd: "AmendEnd"
}

// 2.展示给用户的信息
exports.LC_HANDOVER_STEPS_SHOW = {
    "BeneficiaryHandOverBillsStep": "受益人交单",
    "IssuingBankCheckBillStep": "发证行审核交单",
    "ApplicantAcceptOrRejectStep": "申请人审核交单",
    "IssuingBankAcceptanceStep": "发证行承兑或拒付",
    "IssuingBankRejectStep": "开证行拒付交单",
    "ApplicantRejectStep": "申请人拒付交单",
    "HandoverBillSuccStep": "受益人交单成功"
};


// 3.企业可以参与处理的步骤
// 信用证处理流程
exports.APPLICANT_PROCESSING_STEPS = ['保存', '填写信用证草稿', '申请人赎单'];
exports.BENEFICIARY_PROCESSING_STEPS = ["受益人接收信用证"];
// 信用证修改处理流程
exports.AMEND_PROCESSING_STEPS = ['通知行收到信用证通知', "受益人接收信用证", "申请人赎单", "开证行审核赎单", "闭卷"];
// 信用证交单处理流程
exports.APPLICANT_HANDOVER_PROCESSING_STEPS = ["申请人赎单"];

exports.LC_STATUS = ["信用证申请", "信用证草稿", "信用证正本", "信用证正本修改", "信用证生效", "交单", "承兑", "赎单", "拒付", "闭卷"];