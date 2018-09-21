import React from 'react'
import 'whatwg-fetch'
import { Link, hashHistory } from 'react-router';
import '../../main.css'
import { fetch_get, fetch_post } from '../../common'
import * as CONSTANTS from '../../constants'

import { Upload, Alert, Timeline, Tag, Tabs, Row, Card, Layout, Breadcrumb, Collapse, InputNumber, Table, Icon, Steps, Form, Input, Select, Checkbox, DatePicker, Col, Radio, Button, Modal, Badge, Menu, Dropdown, message } from 'antd'
const Step = Steps.Step;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Header, Content, Sider } = Layout;

let lcAttachment = { "no": "", "name": "", "uri": "", "hash": "", "signature": "", "uploader": "" };
let isFileUploaded = false;

var nodeConf = require('../../../config/nodeconf.json');
const serverBackEnd = "http://" + nodeConf["BackEnd"].IP + ":" + nodeConf["BackEnd"].Port;

const ApproveDialog = Form.create()(
    (props) => {
        const options = [{ label: '', value: '' },];
        const { visible, onCancel, onOk, dataform, data, form } = props;
        const { getFieldDecorator } = form;
        const formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 19 }, };

        return (
            <Modal
                visible={visible}
                title="信用证修改"
                okText="提交"
                cancelText="取消"
                onCancel={onCancel}
                onOk={onOk}
                width='800'
            >
                <Form>
                    <FormItem {...formItemLayout} label="审核说明">
                        {
                            getFieldDecorator('comment', {
                                initialValue: dataform ? dataform.suggestion : "",
                                rules: [{ required: true, message: '请填写审核说明, 内容必须填写.' }],
                            })
                                (
                                <TextArea rows={4} placeholder="请填写审核说明,内容必须填写。" />
                                )
                        }
                    </FormItem>
                </Form>
            </Modal>
        );
    }
);


const RejectDialog = Form.create()(
    (props) => {
        const options = [{ label: '', value: '' },];
        const { visible, onCancel, onReject, dataform, data, form } = props;
        const { getFieldDecorator } = form;
        const formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 19 }, };

        return (
            <Modal
                visible={visible}
                title="信用证修改"
                okText="驳回"
                cancelText="取消"
                onCancel={onCancel}
                onOk={onReject}
                width='800'
            >
                <Form>
                    <FormItem {...formItemLayout} label="驳回说明">
                        {
                            getFieldDecorator('comment', {
                                initialValue: dataform ? dataform.suggestion : "",
                                rules: [{ required: true, message: '请将审核的说明填写至此' }],
                            })
                                (
                                <TextArea rows={4} placeholder="请将审核的说明填写至此。" />
                                )
                        }
                    </FormItem>
                </Form>
            </Modal>
        );
    }
);



// 合同及附件证明材料部分组件
const columns = [
    { title: '名称', dataIndex: 'FileName', key: 'FileName' },
    { title: '上传人', dataIndex: 'Uploader', key: 'Uploader' },
    { title: '文件哈希值', dataIndex: 'FileHash', key: 'FileHash' },
];

class AmendIssuing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            bordered: false,
            approveDialogVisible: false,
            rejectDialogVisible: false,
            deposit: {},
            depositDoc: {},
            amendState: {},
            letters: {},
            amend: {},
            rejectForm: {}
        }
    }

    componentDidMount = () => {
        this.getLCDraftDetail();
        // this.getLCProcessFlows();
        this.getDepositData();
        this.getAmendStateInfo();
        this.getAmendDetail();
    }

    getAmendStateInfo = () => {
        //初始化
        var amendData = {};
        amendData.AFNo = "";
        amendData.amendNo = "";
        amendData.step = "";
        amendData.state = "11";
        this.setState({
            amendState: amendData,
        });

        fetch_get("/api/bank/Application/AmendState/" + this.props.params.id + "?amendNo=" + this.props.params.amendId)
            .then((res) => {
                if (res.status >= 200 && res.status < 300) {
                    res.json().then((data) => {
                        if (data != null) {
                            var amendData = {};
                            amendData.AFNo = data.AFNo;
                            amendData.amendNo = data.AFNo;
                            amendData.step = data.step;
                            amendData.state = data.state;                           
                            if (data.lcNo != null && data.lcNo.length > 0)
                                amendData.lcNo = data.lcNo;
                            if (data.suggestion != null && data.suggestion.length > 0)
                                amendData.suggestion = data.suggestion;
                            this.setState({
                                amendState: amendData,
                            });
                        }
                    });
                }
            });
    }

    getLCDraftDetail = () => {
        fetch_get("/api/bank/transaction/draft/" + this.props.params.id)
            .then((res) => {
                if (res.status >= 200 && res.status < 300) {
                    res.json().then((data) => {
                        this.setState({
                            letters: data,
                        });
                    });
                }
            });
    }

    //获取信用信修改详情
    getAmendDetail = () => {
        fetch_get("/api/bank/Application/" + this.props.params.id)
            .then((res) => {
                if (res.status >= 200 && res.status < 300) {
                    res.json().then((data) => {
                        if (data.AmendFormFlow != null) {
                            for (var i = 0; i < data.AmendFormFlow.length; i++) {
                                if (this.props.params.amendId == data.AmendFormFlow[i].amendNo) {
                                    this.setState({
                                        amend: data.AmendFormFlow[i]
                                    });

                                    //信用证修改进度
                                    let progressflow = data.AmendFormFlow[i].AmendFormProgressFlow;
                                    let items = progressflow.map(progressflow =>
                                        <Timeline.Item color="red">
                                            <p><span style={{ fontWeight: 800 }}>{CONSTANTS.AMEND_PROCESS_FLOW_STEP[progressflow.Status]}</span>&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                            <p style={{ marginTop: 6 }}>Description：<span>{progressflow.Description}</span> </p>
                                            <p style={{ marginTop: 6 }}>From: {progressflow.Name} &nbsp;&nbsp;&nbsp;&nbsp;{progressflow.time.substr(0, progressflow.time.indexOf('.')).replace('T', ' ')}</p>
                                        </Timeline.Item>
                                    );

                                    this.setState({
                                        flowItems: items
                                    });
                                    break;
                                }
                            }
                        }
                    });
                }
            });
    }

    getDepositData = () => {
        fetch_get("/api/bank/transaction/deposit/" + this.props.params.id)
            .then((res) => {
                if (res.status >= 200 && res.status < 300) {
                    res.json().then((data) => {
                        this.handleDepositDate(data);
                    });
                }
            });
    }

    handleDepositDate = (data) => {
        var deposit = {
            commitAmount: data.commitAmount,
            depositAmount: data.depositAmount,
            isDocUploaded: data.DepositDoc.FileHash == "" ? "无" : "有"
        };
        this.setState({
            deposit: deposit,
        });
        this.setState({
            depositDoc: data.DepositDoc,
        });
    }


    // 接受申请 Dialog
    closeApproveDialog = () => {
        this.setState({
            approveDialogVisible: false,
        });
    }

    showApproveDialog = () => {
        this.setState({
            approveDialogVisible: true,
        });
    }

    saveApproveRef = (form) => {
        this.approveForm = form;
    }

    saveRejectRef = (form) => {
        this.rejectForm = form;
    }

    showRejectDialog = () => {
        this.setState({
            rejectDialogVisible: true,
        });
    }

    closeRejectDialog = () => {
        this.setState({
            rejectDialogVisible: false,
        });
    }

    HandleRequestData = (values) => {
        //  if (!isFileUploaded) { return; }
        var result = {
            no: this.props.params.id,
            amendNo: this.props.params.amendId,
            suggestion: values.comment,
            isAgreed: "true",
        };

        if ((sessionStorage.getItem("bankno") == this.state.letters.IssuingBank.No)
            && (this.state.amend.Status == "AmendIssuingBankAcceptStep")) //开证行
        {
            fetch_post("/api/bank/LetterofCredit/issueLetterOfAmend", result).then((res) => {
                if (res.status >= 200 && res.status < 300) {
                    res.json().then((data) => {
                        this.closeApproveDialog();
                        this.approveUpdateAmendState();
                        message.success("审核完成, 等待企业确认.");

                    });
                } else {
                    message.error("交易执行失败，请检查审核信息.");
                }
            });
        }
        else if ((sessionStorage.getItem("bankno") == this.state.letters.AdvisingBank.No)
            && (this.state.amend.Status == "AmendAdvisingBankAcceptStep")) //通知行
        {
            fetch_post("/api/bank/LetterofCredit/advisingLetterOfAmend", result).then((res) => {
                if (res.status >= 200 && res.status < 300) {
                    res.json().then((data) => {
                        this.closeApproveDialog();
                        this.approveUpdateAmendState();
                        message.success("审核完成, 等待企业确认.");

                    });
                } else {
                    message.error("交易执行失败，请检查审核信息.");
                }
            });
        }
    }

    approveUpdateAmendState = () => {
        var amendState = this.state.amendState;
        amendState.state = '11';//初始化身份--经办
        amendState.step = '' //
        amendState.suggestion = "";
        fetch_post("/api/bank/Application/AmendState/" + this.props.params.id + "?amendNo=" + this.props.params.amendId, amendState)
            .then((res) => {
                if (res.status >= 200 && res.status < 300) {
                    res.json().then((data) => {
                        this.closeApproveDialog();
                        // message.success("复核审核完成, 等待授权确认.");
                    });
                } else {
                    message.error(CONSTANTS.ERROR_APPLICATION_FORM_APPROVED);
                }
            });
    }

    HandleRejectRequestData = (values) => {
        //  if (!isFileUploaded) { return; }
        var result = {
            no: this.props.params.id,
            amendNo: this.props.params.amendId,
            suggestion: values.comment,
            isAgreed: "false",
        };

        if ((sessionStorage.getItem("bankno") == this.state.letters.IssuingBank.No)
            && (this.state.amend.Status == "AmendIssuingBankAcceptStep")) //开证行
        {
            fetch_post("/api/bank/LetterofCredit/issueLetterOfAmend", result).then((res) => {
                if (res.status >= 200 && res.status < 300) {
                    res.json().then((data) => {
                        this.closeApproveDialog();
                        this.rejectUpdateAmendState(values.commen);
                        message.success("审核完成, 等待企业确认.");

                    });
                } else {
                    message.error("交易执行失败，请检查审核信息.");
                }
            });
        }
        else if ((sessionStorage.getItem("bankno") == this.state.letters.AdvisingBank.No)
            && (this.state.amend.Status == "AmendAdvisingBankAcceptStep")) //通知行
        {
            fetch_post("/api/bank/LetterofCredit/advisingLetterOfAmend", result).then((res) => {
                if (res.status >= 200 && res.status < 300) {
                    res.json().then((data) => {
                        this.closeApproveDialog();
                        this.rejectUpdateAmendState(values.commen);
                        message.success("审核完成, 等待企业确认.");

                    });
                } else {
                    message.error("交易执行失败，请检查审核信息.");
                }
            });
        }
    }

    handleApprove = () => {
        const form = this.approveForm;
        form.validateFields((err, values) => {
            if (err) { return; }
            if (sessionStorage.getItem('userType') == 11) {
                var amendState = this.state.amendState;
                amendState.state = '12';
                amendState.AFNo = this.props.params.id;
                amendState.amendNo = this.props.params.amendId;
                amendState.lcNo = this.state.letters.LCNo;
                amendState.suggestion = values.comment;
                amendState.step = this.state.amend.Status;
                amendState.isAgreed = "true";
                fetch_post("/api/bank/Application/AmendState/" + this.props.params.id + "?amendNo=" + this.props.params.amendId, amendState)
                    .then((res) => {
                        if (res.status >= 200 && res.status < 300) {
                            res.json().then((data) => {
                                this.closeApproveDialog();
                                this.closeRejectDialog();
                                message.success("经办审核完成, 等待复核确认.");
                            });
                        } else {
                            message.error(CONSTANTS.ERROR_APPLICATION_FORM_APPROVED);
                        }
                    });
                return;
            }
            else if (sessionStorage.getItem('userType') == 12) {
                var amendState = this.state.amendState;
                amendState.state = '13';
                amendState.suggestion = values.comment;
                amendState.isAgreed = "true";
                fetch_post("/api/bank/Application/AmendState/" + this.props.params.id + "?amendNo=" + this.props.params.amendId, amendState)
                    .then((res) => {
                        if (res.status >= 200 && res.status < 300) {
                            res.json().then((data) => {
                                this.closeApproveDialog();
                                this.closeRejectDialog();
                                message.success("复核审核完成, 等待授权确认.");
                            });
                        } else {
                            message.error(CONSTANTS.ERROR_APPLICATION_FORM_APPROVED);
                        }
                    });
                return;
            } else {
                this.HandleRequestData(values);
            }
        });

    }

    handleReject = () => {
        const form = this.rejectForm;
        form.validateFields((err, values) => {
            if (err) { return; }
            if (sessionStorage.getItem('userType') == 12) {
                var amendState = this.state.amendState;
                amendState.state = '11';
                amendState.AFNo = this.props.params.id;
                amendState.amendNo = this.props.params.amendId;
                amendState.lcNo = this.state.letters.LCNo;
                amendState.suggestion = values.comment;
                amendState.step = this.state.amend.Status;
                amendState.isAgreed = "false";
                fetch_post("/api/bank/Application/AmendState/" + this.props.params.id + "?amendNo=" + this.props.params.amendId, amendState)
                    .then((res) => {
                        if (res.status >= 200 && res.status < 300) {
                            res.json().then((data) => {
                                this.closeApproveDialog();
                                this.closeRejectDialog();
                                message.success("复合审核完成, 已驳回经办重新处理。.");
                            });
                        } else {
                            message.error(CONSTANTS.ERROR_APPLICATION_FORM_APPROVED);
                        }
                    });
                return;
            }
            else if (sessionStorage.getItem('userType') == 13) {
                var amendState = this.state.amendState;
                amendState.state = '11';
                amendState.suggestion = values.comment;
                amendState.isAgreed = "false";
                fetch_post("/api/bank/Application/AmendState/" + this.props.params.id + "?amendNo=" + this.props.params.amendId, amendState)
                    .then((res) => {
                        if (res.status >= 200 && res.status < 300) {
                            res.json().then((data) => {
                                this.closeApproveDialog();
                                this.closeRejectDialog();
                                message.success("授权审核完成, 已驳回经办重新处理。.");
                            });
                        } else {
                            message.error(CONSTANTS.ERROR_APPLICATION_FORM_APPROVED);
                        }
                    });
                return;
            } else {

                this.HandleRejectRequestData(values);
            }
        });
    }

    rejectUpdateAmendState = (suggestion) => {
        var amendState = this.state.amendState;
        amendState.state = '11';//初始化身份--经办
        amendState.step = '' //流程到银行确认
        amendState.suggestion = suggestion;
        amendState.isAgreed = "false";
        fetch_post("/api/bank/Application/AmendState/" + this.props.params.id + "?amendNo=" + this.props.params.amendId, amendState)
            .then((res) => {
                if (res.status >= 200 && res.status < 300) {
                    res.json().then((data) => {
                        this.closeApproveDialog();
                        // message.success("复核审核完成, 等待授权确认.");
                    });
                } else {
                    message.error(CONSTANTS.ERROR_APPLICATION_FORM_APPROVED);
                }
            });
    }
    // TABS选择回调
    tabsCallback = (key) => {
        this.getAmendDetail();
        this.getLCDraftDetail();
        // this.getLCProcessFlows();
        this.getDepositData();
    }

    render() {
        let data = this.state.letters ? this.state.letters : [],
            // applicationForm = data.ApplicationForm ? data.ApplicationForm : [],
            applicant = data.Applicant ? data.Applicant : [],
            beneficiary = data.Beneficiary ? data.Beneficiary : [],
            issuingBank = data.IssuingBank ? data.IssuingBank : [],
            advisingBank = data.AdvisingBank ? data.AdvisingBank : [],
            goodsInfo = data.GoodsInfo ? data.GoodsInfo : [],
            isAtSight = data.isAtSight === "true" ? "即期" : ("发运/服务交付" + data.afterSight + "日后"),
            attachments = data.Attachments ? data.Attachments : [],
            chargeInIssueBank = "在开证行产生的费用，由" + (data.chargeInIssueBank === "1" ? "申请人" : "受益人") + "提供。",
            chargeOutIssueBank = "在开证行外产生的费用，由" + (data.chargeOutIssueBank === "1" ? "申请人" : "受益人") + "提供。",
            docDelay = "单据必须自运输单据签发日" + data.docDelay + "日内提交，且不能低于信用证有效期。",
            Negotiate = data.Negotiate === "1" ? "以下银行可议付" : (data.Negotiate === "2" ? "任意银行可议付" : "不可议付"),
            Transfer = data.Transfer === "1" ? "可转让" : "不可转让",
            Confirmed = data.Confirmed === "1" ? "可保兑" : "不可保兑",
            OverLow = "短装:" + data.Lowfill + "    溢装:" + data.Overfill;

        let bankNo = sessionStorage.getItem("bankno");
        let btnDivHtml;
        //如果当前是开证行审批，并且银行身份符合；则显示操作按钮
        if ((bankNo == issuingBank.No)
            && (this.state.amend.Status == "AmendIssuingBankAcceptStep")
            && (parseInt(this.state.amendState.state) == sessionStorage.getItem('userType'))) {
            btnDivHtml = (
                <div style={{ marginTop: '20px', marginLeft: '16px', marginRight: '16px', marginBottom: '5px' }}>
                    <Row>
                        <Col style={{ fontSize: '13px' }} span={24} offset={0}>
                            <Button type='primary' style={{ marginLeft: '5px' }} onClick={this.showApproveDialog.bind(this)}><Icon type="check-circle" />同意</Button>
                            <Button type='danger' style={{ marginLeft: '5px' }} onClick={this.showRejectDialog.bind(this)}><Icon type="close-circle" />驳回</Button>
                        </Col>
                    </Row>
                </div>
            );
        } else if ((bankNo == advisingBank.No) //如果当前是开证行审批，并且银行身份符合；则显示操作按钮
            && (this.state.amend.Status == "AmendAdvisingBankAcceptStep")
            && (parseInt(this.state.amendState.state) == sessionStorage.getItem('userType'))) {
            btnDivHtml = (
                <div style={{ marginTop: '20px', marginLeft: '16px', marginRight: '16px', marginBottom: '5px' }}>
                    <Row>
                        <Col style={{ fontSize: '13px' }} span={24} offset={0}>
                            <Button type='primary' style={{ marginLeft: '5px' }} onClick={this.showApproveDialog.bind(this)}><Icon type="check-circle" />同意</Button>
                            <Button type='danger' style={{ marginLeft: '5px' }} onClick={this.showRejectDialog.bind(this)}><Icon type="close-circle" />驳回</Button>
                        </Col>
                    </Row>
                </div>
            );
        }
        else {
            btnDivHtml = (<div></div>);
        }


        return (
            <Layout style={{ padding: '1px 1px' }}>
                <Breadcrumb style={{ padding: '12px 16px', fontSize: 13, fontWeight: 800, background: '#F3F1EF' }}>
                    <Breadcrumb.Item>{CONSTANTS.AMEND_TITLE}</Breadcrumb.Item>
                    <Breadcrumb.Item>{CONSTANTS.COMM_TRANSING}</Breadcrumb.Item>
                </Breadcrumb>
                <Content style={{ background: '#fff', padding: 0, margin: '0' }}>

                    <Tabs defaultActiveKey="1" onChange={this.tabsCallback} style={{ marginTop: '20px' }}>
                        <TabPane tab="信用证修改" key="1">
                            <div style={{ backgroundColor: '#d4cfcf47', marginLeft: '14px', marginRight: '14px', padding: '15px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
                                <div>
                                    <Row>
                                        <Col style={{ marginBottom: '12px', fontSize: '12px', color: '#32325d', fontWeight: 'bold' }} span={3}>信用证编号</Col>
                                        <Col style={{ marginBottom: '12px', fontSize: '12px', color: '#6b7c93', fontWeight: 'bold' }} span={3}>{this.state.letters.LCNo}</Col>
                                    </Row>
                                </div>
                                <div>
                                    <Row>
                                        <Col style={{ marginTop: '15px', marginBottom: '12px', fontSize: '12px', color: '#32325d', fontWeight: 'bold' }} span={3}>信用证修改审核</Col>
                                    </Row>
                                    <Row>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>修改编号</Col>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={6}>{this.state.amend.amendNo} </Col>
                                        <Col span={3}></Col>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>修改次数</Col>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={6}>{this.state.amend.amendTimes} </Col>
                                    </Row>
                                    <Row>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>修改币种</Col>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={6}>{this.state.amend.AmendedCurrency}</Col>
                                        <Col span={3}></Col>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>修改金额</Col>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={6}>{this.state.amend.amendedAmt} {this.state.amend.AmendedCurrency}</Col>
                                    </Row>
                                    <Row>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>期限增减</Col>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={6}>{this.state.amend.addedDays}</Col>
                                        <Col span={3}></Col>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>修改有效日期</Col>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={6}>{(this.state.amend.AmendExpiryDate + "").substr(0, (this.state.amend.AmendExpiryDate + "").indexOf('T'))}</Col>
                                    </Row>
                                    <Row>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>货物发货目的地</Col>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={6}>{this.state.amend.TransPortName}</Col>
                                        <Col span={3}></Col>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>保证金增减金额</Col>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={6}>{this.state.amend.addedDepositAmt} {this.state.amend.AmendedCurrency}</Col>
                                    </Row>
                                </div>
                            </div>

                            <div>
                                {btnDivHtml}
                            </div>

                        </TabPane>

                        <TabPane tab="信用证草稿" key="2">

                            <div style={{ margin: '15px 5px', marginLeft: '20px' }}>
                                <div>
                                    <Row>
                                        <Col style={{ marginTop: '5px', marginBottom: '12px', fontSize: '12px', color: '#32325d', fontWeight: 'bold' }} span={6}>通知行</Col>
                                    </Row>
                                    <Row>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>通知行</Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{advisingBank.Name}</Col>
                                        <Col span={3}></Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>地址</Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{advisingBank.Address}</Col>
                                    </Row>
                                </div>
                                <div>
                                    <Row>
                                        <Col style={{ marginTop: '20px', marginBottom: '12px', fontSize: '12px', color: '#32325d', fontWeight: 'bold' }} span={6}>申请人信息</Col>
                                    </Row>
                                    <Row>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>申请人</Col>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{applicant.Name}</Col>
                                        <Col span={3}></Col>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>地址</Col>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{applicant.Address}</Col>
                                    </Row>
                                    <Row>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>开户行</Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{applicant.DepositBank}</Col>
                                        <Col span={3}></Col>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>账号</Col>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{applicant.Account}</Col>
                                    </Row>
                                </div>

                                <div>
                                    <Row>
                                        <Col style={{ marginTop: '20px', marginBottom: '12px', fontSize: '12px', color: '#32325d', fontWeight: 'bold' }} span={6}>受益人信息</Col>
                                    </Row>
                                    <Row>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>受益人</Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{beneficiary.Name}</Col>
                                        <Col span={3}></Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>地址</Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{beneficiary.Address}</Col>
                                    </Row>
                                    <Row>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>开户行</Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{beneficiary.DepositBank}</Col>
                                        <Col span={3}></Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>账号</Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{beneficiary.Account}</Col>
                                    </Row>
                                    <Row key={5}>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>是否可议付</Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{Negotiate}</Col>
                                        <Col span={3}></Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>是否可转让</Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{Transfer}</Col>
                                    </Row>
                                    <Row key={5}>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>是否可保兑</Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{Confirmed}</Col>
                                        <Col span={3}></Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}></Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{}</Col>
                                    </Row>

                                    <Row>
                                        <Col style={{ marginTop: '20px', marginBottom: '12px', fontSize: '12px', color: '#32325d', fontWeight: 'bold' }} span={6}>详细信息</Col>
                                    </Row>
                                    <Row>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>结算货币</Col>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{data.Currency}</Col>
                                        <Col span={3}></Col>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>金额</Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>信用证:{data.amount}  保证金:{data.EnsureAmount}</Col>
                                    </Row>
                                    <Row>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>到期日</Col>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{data.expiryDate}</Col>
                                        <Col span={3}></Col>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>到期地点</Col>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{data.ExpiryPlace}</Col>
                                    </Row>
                                    <Row>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>付款期限</Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{""}</Col>
                                        <Col span={3}></Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>远期付款期限</Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{isAtSight}</Col>
                                    </Row>
                                    <Row>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>货物运输</Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{goodsInfo.allowPartialShipment ? "允许分批" : "允许转运"}</Col>
                                        <Col span={3}></Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>最迟装运日期</Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{goodsInfo.latestShipmentDate}</Col>
                                    </Row>

                                    <Row>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>装运地点</Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{goodsInfo.ShippingPlace}</Col>
                                        <Col span={3}></Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>目的地</Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{goodsInfo.ShippingDestination}</Col>
                                    </Row>

                                    <Row>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>贸易性质</Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{goodsInfo.tradeNature == 1 ? "货物贸易" : "服务贸易"}</Col>
                                        <Col span={3}></Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>溢短装</Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{OverLow}</Col>
                                    </Row>

                                    <Row>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>货物描述</Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={21}>{goodsInfo.GoodsDescription}</Col>
                                    </Row>

                                    <Row>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>其他条款</Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d', height: '40px' }} span={21}><div>{chargeInIssueBank}<br />{chargeOutIssueBank}<br />{docDelay}<br />发起日期不能早于开证日期。</div></Col>
                                    </Row>
                                    <Row>
                                        <Col style={{ marginTop: '20px', marginBottom: '6px', fontSize: '12px', color: '#32325d', fontWeight: 'bold' }} span={6}>合同及申请材料</Col>
                                    </Row>
                                    <Table
                                        columns={columns}
                                        dataSource={attachments}
                                        pagination={false}
                                        showHeader={false}
                                    />
                                </div>
                            </div>
                        </TabPane>

                        <TabPane tab="信用证修改进度" key="3">
                            <div style={{ margin: '10px 25px' }}>
                                <Row>
                                    <Timeline>
                                        {
                                            this.state.flowItems
                                        }
                                    </Timeline>
                                </Row>
                            </div>
                        </TabPane>
                    </Tabs>

                </Content>
                <ApproveDialog
                    ref={this.saveApproveRef}
                    visible={this.state.approveDialogVisible}
                    onCancel={this.closeApproveDialog}
                    onOk={this.handleApprove}
                    dataform={this.state.amendState}
                />
                <RejectDialog
                    ref={this.saveRejectRef}
                    visible={this.state.rejectDialogVisible}
                    onCancel={this.closeRejectDialog}
                    onReject={this.handleReject}
                />
            </Layout>
        )
    }
}

export default AmendIssuing
