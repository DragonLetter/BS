
var nodeConf = require('../config/nodeconf.json');

// system and configure name
export const SYS_NAME = '数字信用证银行系统'
export const SYS_WELCOME_BACK ='欢迎回来'

export const SYS_LOGIN_NAME_TIPS = '请输入用户名！'
export const SYS_LOGIN_NAME_PLH = '用户名'
export const SYS_LOGIN_PASSWD_TIPS = '请输入密码！'
export const SYS_LOGIN_PASSWD_PLH = '密码'
export const SYS_LOGIN = '马上登录'


// leter of credit related.
export const LETTER_NUMBER = '信用证编号'
export const LETTER_APPLICANT = '申请人'
export const LETTER_BENEFICIARY = '受益人'
export const LETTER_ISSUING_BANK = '开证行'
export const LETTER_ADVISING_BANK = '通知行'
export const LETTER_AMOUNT = '开证金额'
export const LETTER_CURRENCY = '结算货币'
export const LETTER_STATUS = '结算进度'
export const LETTER_ISSUED_DATE = '信用证开立日期'
export const LETTER_APPLICANT_DATE = '发起日期'

// LC status
export const LC_APPLICANT = '开证申请'
export const LC_ISSUED = '正本开立'
export const LC_ADVISING = '正本通知'
export const LC_AMEND = '正本修改'
export const LC_DOCS_APPROVED = '来单审核'
export const LC_ACCEPTANCE = '承兑确认'
export const LC_CLOSED = '付款闭卷'

//信用证修改
export const AMEND_TITLE = '国内信用证修改'
export const AMEND_TIMES = '修改次数'
export const AMEND_STATUS = '修改进度'

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


// common business name.
export const DOMESTIC_LC = '国内信用证'

// common strings name.
export const COMM_OPERATION ='操作'
export const COMM_DETAILIS = '详情'
export const COMM_VIEW = '查看交易'
export const COMM_SELECT_DATE = '选择日期'
export const COMM_SELECT_TYPE = '结算进度'
export const COMM_TB_PROCESSED = '待处理的任务'
export const COMM_IM_PROCESSING_ = '立即处理'
export const COMM_ALREADY_TRANS_TIME = '已交易时间'
export const COMM_TRANSING = '交易进行中'
export const COMM_OP_FILE = '下载查看'

// error message
export const ERROR_LOGIN = '用户名密码错误，请重新登录！'
export const ERROR_APPLICATION_FORM_APPROVED = "交易执行失败, 请检查信用证编号, 金额是否正确。"
export const ERROR_SIGNED_FORM_AUDIT = "审核执行失败, 请检查信息是否正确。"

export const URL_FILE_SERVER = "http://" + nodeConf["FileServer"].IP + ":" + nodeConf["FileServer"].Port+"/"
