// 1.返回数据里记录的信息
exports.LC_STEPS = {
    LCStart: "开始",
    ApplicantSaveLCApplyFormStep: "保存",
    BankConfirmApplyFormStep: "银行审核",
    ApplicantFillLCDraftStep: "填写信用证草稿",
    BankIssueLCStep: "银行发证",
    AdvisingBankReceiveLCNoticeStep: "通知行收到信用证通知",
    BeneficiaryReceiveLCStep: "受益人接收信用证",
    ApplicantRetireBillsStep: "申请人付款",
    IssuingBankReviewRetireBillsStep: "开证行审核付款",
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

//信用证修改当前操作
export const AMEND_STEP = {	
	"AmendApplicantSubmitStep" : "申请人发起修改",
	"AmendIssuingBankAcceptStep" : "开证行审批",	
	"AmendAdvisingBankAcceptStep" : "通知行审批",	
	"AmendBeneficiaryAcceptStep" : "受益人审批",	
	"AmendEnd": "结束"
}

//信用证修改进度操作
export const AMEND_PROCESS_FLOW_STEP = {	
	"AmendApplicantSubmitStep" : "申请人发起修改",
	"AmendIssuingBankAcceptStep" : "开证行同意修改",
	"AmendIssuingBankRejectStep" : "开证行拒绝修改",
	"AmendAdvisingBankAcceptStep" : "通知行同意修改",
	"AmendAdvisingBankRejectStep" : "通知行拒绝修改",
	"AmendBeneficiaryAcceptStep" : "受益人同意修改",
	"AmendBeneficiaryRejectStep" : "受益人拒绝修改",
	"AmendEnd": "结束"
}


// 3.企业可以参与处理的步骤
// 信用证处理流程
exports.APPLICANT_PROCESSING_STEPS = ['保存', '填写信用证草稿', '申请人付款'];
exports.BENEFICIARY_PROCESSING_STEPS = ["受益人接收信用证"];
// 信用证修改处理流程
exports.AMEND_PROCESSING_STEPS = ['通知行收到信用证通知', "受益人接收信用证", "申请人付款", "开证行审核付款", "闭卷"];
// 信用证交单处理流程
exports.APPLICANT_HANDOVER_PROCESSING_STEPS = ["申请人付款"];

exports.LC_STATUS = ["信用证申请", "信用证草稿", "信用证正本", "信用证正本修改", "信用证生效", "交单", "承兑", "付款", "拒付", "闭卷"];