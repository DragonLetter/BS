import React from 'react'
import 'whatwg-fetch'
import { Link, hashHistory } from 'react-router';
import '../../main.css'
import { fetch_get, fetch_post } from '../../common'
import * as CONSTANTS from '../../constants'

import { Timeline, Tag, Tabs, Row, Card, Layout, Breadcrumb, Collapse, InputNumber, Table, Icon, Steps, Form, Input, Select, Checkbox, DatePicker, Col, Radio, Button, Modal, Badge, Menu, Dropdown, message } from 'antd'
import letters from '../letters';
const Step = Steps.Step;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Header, Content, Sider } = Layout;

const ApproveDialog = Form.create()(
    (props) => {
        const options = [{ label: '', value: '' },];
        const { visible, onCancel, onOk, dataform, data, form } = props;
        const { getFieldDecorator } = form;
        const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 19 }, };

        return (
            <Modal
                visible={visible}
                title="接受申请"
                okText="提交"
                cancelText="取消"
                onCancel={onCancel}
                onOk={onOk}
                width='800'
            >
                <Form>
                    <FormItem label="信用证编号" labelCol={{ span: 4 }} wrapperCol={{ span: 6 }}>
                        {
                            getFieldDecorator('LCNumber', {
                                initialValue: dataform ? dataform.lcNo : "",
                                rules: [{ required: true, message: '请填写国结系统分配的信用证编号.' }],
                            })
                                (
                                <Input />
                                )
                        }
                    </FormItem>
                    <FormItem label="保证金金额" labelCol={{ span: 4 }} wrapperCol={{ span: 6 }}>
                        {
                            getFieldDecorator('depositAmount', {
                                initialValue: dataform ? dataform.depositAmount : "",
                                rules: [{ required: true, message: '请填写正确的金额.' }],
                            })
                                (
                                <InputNumber
                                    defaultValue={0}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                />
                                )
                        }
                    </FormItem>
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
        const { visible, onCancel, onReject, data, form } = props;
        const { getFieldDecorator } = form;
        const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 19 }, };

        return (
            <Modal
                visible={visible}
                title="国内信用证申请审核"
                okText="驳回"
                cancelText="取消"
                onCancel={onCancel}
                onOk={onReject}
                width='800'
            >
                <Form>
                    <FormItem {...formItemLayout} label="驳回说明">
                        {
                            getFieldDecorator('comment', { rules: [{ required: true, message: '请将审核的说明填写至此' }], })
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

const columns = [
    { title: '名称', dataIndex: 'FileName', key: 'FileName' },
    { title: '上传人', dataIndex: 'Uploader', key: 'Uploader' },
    { title: '文件哈希值', dataIndex: 'FileHash', key: 'FileHash' },
];

// const data = [
//     { key: 1, name: '海洋化纤公司贸易合同', hash: '1FVKW4rp5rN23dqFVk2tYGY4niAXMB8eZC ', signature: '3JjPf13Rd8g6WAyvg8yiPnrsdjJt1NP4FC', datetime: '2017/09/01 17:01'},
//     { key: 2, name: '企业营业执照扫描件', hash: '1FVKW4rp5rN23dqFVk2tYGY4niAXMB8eZC ', signature: '3JjPf13Rd8g6WAyvg8yiPnrsdjJt1NP4FC', datetime: '2017/09/01 17:01'},
//     { key: 3, name: '资金证明文件扫描件', hash: '1FVKW4rp5rN23dqFVk2tYGY4niAXMB8eZC ', signature: '3JjPf13Rd8g6WAyvg8yiPnrsdjJt1NP4FC', datetime: '2017/09/01 17:01'},
// ];

class LetterDraft extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            bordered: false,
            approveDialogVisible: false,
            rejectDialogVisible: false,
            afstate: {},
            letter: {}
        }
    }

    componentDidMount = () => {
        this.getLCApplyDetail();
        this.getLCProcessFlows();
        this.getAFStateInfo();
    }
    getAFStateInfo = () => {
        fetch_get("/api/applicationform/afstate/" + this.props.params.id)
            .then((res) => {
                if (res.status >= 200 && res.status < 300) {
                    res.json().then((data) => {
                        var afdata = {};
                        afdata.AFNo = data.AFNo;
                        afdata.step = data.step;
                        afdata.state = data.state;
                        if (data.lcNo != null && data.lcNo.length > 0)
                            afdata.lcNo = data.lcNo;
                        if (data.suggestion != null && data.suggestion.length > 0)
                            afdata.suggestion = data.suggestion;
                        if (data.depositAmount != null && data.depositAmount.length > 0)
                            afdata.depositAmount = data.depositAmount;
                        if (data.isAgreed != null && data.isAgreed.length > 0)
                            afdata.isAgreed = data.isAgreed;
                        if (data.backup != null && data.backup.length > 0)
                            afdata.backup = data.backup;
                        if (data.createdAt != null && data.createdAt.length > 0)
                            afdata.createdAt = data.createdAt;
                        if (data.updatedAt != null && data.updatedAt.length > 0)
                            afdata.updatedAt = data.updatedAt;
                        this.setState({
                            afstate: afdata,
                        });
                    });
                }
            });
    }
    getLCApplyDetail = () => {
        fetch_get("/api/applicationform/" + this.props.params.id)
            .then((res) => {
                if (res.status >= 200 && res.status < 300) {
                    res.json().then((data) => {
                        this.handleApplicationFrom(data);
                    });
                }
            });
    }

    getLCProcessFlows = () => {
        fetch_get("/api/bank/transaction/processflow/" + this.props.params.id)
            .then((res) => {
                if (res.status >= 200 && res.status < 300) {
                    res.json().then((data) => {
                        let progressflow = data.TransProgressFlow;
                        let items = progressflow.map(progressflow =>
                            <Timeline.Item color="red">
                                <p><span style={{ fontWeight: 800 }}>{progressflow.Status}</span>&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                <p style={{ marginTop: 6 }}>Description：<span>{progressflow.Description}</span> </p>
                                <p style={{ marginTop: 6 }}>From: {progressflow.Name} &nbsp;&nbsp;&nbsp;&nbsp;{progressflow.time.substr(0, progressflow.time.indexOf('.')).replace('T', ' ')}</p>
                            </Timeline.Item>
                        );
                        this.setState({ flowItems: items });
                    });
                }
            });
    }

    handleApplicationFrom = (data) => {
        this.setState({
            letter: data,
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

    HandleRequestData = (values) => {
        let approveData = {};
        approveData.no = this.props.params.id;
        approveData.depositAmount = values.depositAmount.toString();
        approveData.lcNo = values.LCNumber;
        approveData.suggestion = values.comment;
        approveData.isAgreed = "true";
        fetch_post("/api/bank/ApplicationAudit", approveData)
            .then((res) => {
                if (res.status >= 200 && res.status < 300) {
                    res.json().then((data) => {
                        this.closeApproveDialog();
                        message.error("审核完成, 等待企业确认.");
                    });
                } else {
                    message.error(CONSTANTS.ERROR_APPLICATION_FORM_APPROVED);
                }
            });
    }

    handleApprove = () => {
        const form = this.approveForm;
        form.validateFields((err, values) => {
            if (err) { return; }
            let appdata = {};
            appdata.depositAmount = values.depositAmount.toString();
            appdata.lcNo = values.LCNumber;
            appdata.suggestion = values.comment;
            appdata.isAgreed = "true";
            if (sessionStorage.getItem('userType') == 11) {
                var afstate = this.state.afstate;
                afstate.state = '12';
                afstate.lcNo = appdata.lcNo;
                afstate.depositAmount = appdata.depositAmount;
                afstate.suggestion = appdata.suggestion;
                afstate.isAgreed = appdata.isAgreed;
                fetch_post("/api/ApplicationForm/afstate/" + this.props.params.id, afstate)
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
                var afstate = this.state.afstate;
                afstate.state = '13';
                fetch_post("/api/ApplicationForm/afstate/" + this.props.params.id, afstate)
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

                appdata.no = this.props.params.id;
                fetch_post("/api/bank/ApplicationAudit", appdata)
                    .then((res) => {
                        if (res.status >= 200 && res.status < 300) {
                            res.json().then((data) => {
                                this.closeApproveDialog();
                                this.closeRejectDialog();
                                this.ApproveUpdateAfState();
                                message.success("审核完成, 等待企业确认.");
                            });
                        } else {
                            message.error(CONSTANTS.ERROR_APPLICATION_FORM_APPROVED);
                        }
                    });
            }
        });
    }

    //同意---更新经办/复合/授权数据库状态
    ApproveUpdateAfState = () => {
        var afstate = this.state.afstate;
        afstate.state = '11';//初始化身份--经办
        afstate.step = 'BankIssueLCStep' //流程到银行发证
        afstate.suggestion = "";
        appdata.depositAmount = "";
        fetch_post("/api/ApplicationForm/afstate/" + this.props.params.id, afstate)
            .then((res) => {
                if (res.status >= 200 && res.status < 300) {
                    res.json().then((data) => {
                        // message.success("授权审核完成, 等待企业确认.");
                    });
                } else {
                    message.error(CONSTANTS.ERROR_APPLICATION_FORM_APPROVED);
                }
            });
    }

    // 拒绝申请 Dialog
    closeRejectDialog = () => {
        this.setState({
            rejectDialogVisible: false,
        });
    }

    showRejectDialog = () => {
        this.setState({
            rejectDialogVisible: true,
        });
    }

    saveRejectRef = (form) => {
        this.rejectForm = form;
    }

    handleReject = () => {
        const form = this.rejectForm;
        form.validateFields((err, values) => {
            if (err) { return; }
            let appdata = {};
            // appdata.depositAmount = values.depositAmount.toString();
            appdata.lcNo = values.LCNumber;
            appdata.suggestion = values.comment;
            appdata.isAgreed = "false";
            if (sessionStorage.getItem('userType') == 12) {
                var afstate = this.state.afstate;
                afstate.state = '11';
                afstate.lcNo = appdata.lcNo;
                // afstate.depositAmount = appdata.depositAmount;
                afstate.suggestion = appdata.suggestion;
                afstate.isAgreed = appdata.isAgreed;
                fetch_post("/api/ApplicationForm/afstate/" + this.props.params.id, afstate)
                    .then((res) => {
                        if (res.status >= 200 && res.status < 300) {
                            res.json().then((data) => {
                                message.success("复合审核完成, 已驳回经办重新处理。");
                                this.closeRejectDialog();
                            });
                        } else {
                            message.error(CONSTANTS.ERROR_APPLICATION_FORM_APPROVED);
                        }
                    });
                return;
            } else if (sessionStorage.getItem('userType') == 13) {
                var afstate = this.state.afstate;
                afstate.state = '11';
                afstate.lcNo = appdata.lcNo;
                // afstate.depositAmount = appdata.depositAmount;
                afstate.suggestion = appdata.suggestion;
                afstate.isAgreed = appdata.isAgreed;
                fetch_post("/api/ApplicationForm/afstate/" + this.props.params.id, afstate)
                    .then((res) => {
                        if (res.status >= 200 && res.status < 300) {
                            res.json().then((data) => {
                                message.success("授权审核完成, 已驳回经办重新处理。");
                                this.closeRejectDialog();
                            });
                        } else {
                            message.error(CONSTANTS.ERROR_APPLICATION_FORM_APPROVED);
                        }
                    });
                return;
            }
            else {
                let approveData = {};
                approveData.no = this.props.params.id;
                approveData.depositAmount = "0.00";
                approveData.lcNo = "";
                approveData.suggestion = values.comment;
                approveData.isAgreed = "false";
                fetch_post("/api/bank/applicationaudit", approveData)
                    .then((res) => {
                        if (res.status >= 200 && res.status < 300) {
                            res.json().then((data) => {
                                message.error("审核完成, 已驳回企业重新处理。");
                                this.closeRejectDialog();
                                this.rejectUpdateAfState();
                            });
                        } else {
                            message.error(CONSTANTS.ERROR_APPLICATION_FORM_APPROVED);
                        }

                    });
            }
        });
    }

    //拒绝---更新经办/复合/授权数据库状态
    rejectUpdateAfState = () => {
        var afstate = this.state.afstate;
        afstate.state = '11';
        // afstate.suggestion = values.comment;
        afstate.isAgreed = "false";
        appdata.depositAmount = "";
        fetch_post("/api/ApplicationForm/afstate/" + this.props.params.id, afstate)
            .then((res) => {
                if (res.status >= 200 && res.status < 300) {
                    res.json().then((data) => {
                        // message.success("授权审核完成, 等待企业确认.");
                    });
                } else {
                    message.error(CONSTANTS.ERROR_APPLICATION_FORM_APPROVED);
                }
            });
    }

    // TABS选择回调
    tabsCallback = (key) => {
        this.getLCApplyDetail();
        this.getLCProcessFlows();
    }

    render() {
        let data = this.state.letter ? this.state.letter : [],
            applicationForm = data.ApplicationForm ? data.ApplicationForm : [],
            applicant = applicationForm.Applicant ? applicationForm.Applicant : [],
            beneficiary = applicationForm.Beneficiary ? applicationForm.Beneficiary : [],
            issuingBank = applicationForm.IssuingBank ? applicationForm.IssuingBank : [],
            advisingBank = applicationForm.AdvisingBank ? applicationForm.AdvisingBank : [],
            goodsInfo = applicationForm.GoodsInfo ? applicationForm.GoodsInfo : [],
            isAtSight = applicationForm.isAtSight === "true" ? "即期" : ("发运/服务交付" + applicationForm.afterSight + "日后"),
            attachments = applicationForm.Attachments ? applicationForm.Attachments : [],
            chargeInIssueBank = "在开证行产生的费用，由" + (applicationForm.chargeInIssueBank === "1" ? "申请人" : "受益人") + "提供。",
            chargeOutIssueBank = "在开证行外产生的费用，由" + (applicationForm.chargeOutIssueBank === "1" ? "申请人" : "受益人") + "提供。",
            docDelay = "单据必须自运输单据签发日" + applicationForm.docDelay + "日内提交，且不能低于信用证有效期。",
            Negotiate = applicationForm.Negotiate==="1"?"以下银行可议付":(applicationForm.Negotiate==="2"?"任意银行可议付":"不可议付"),
            Transfer = applicationForm.Transfer==="1"?"可转让":"不可转让",
            Confirmed = applicationForm.Confirmed==="1"?"可保兑":"不可保兑",
            OverLow = "短装:"+applicationForm.Lowfill+"    溢装:"+applicationForm.Overfill  ;

        let btnDivHtml;
        if (this.state.letter != null && this.state.letter.CurrentStep != "" && this.state.letter.CurrentStep == "BankConfirmApplyFormStep" &&
            parseInt(this.state.afstate.state) == sessionStorage.getItem('userType')) {
            btnDivHtml = (
                <div style={{ marginLeft: '16px', marginRight: '16px', marginBottom: '20px' }}>
                    <Row>
                        <Col style={{ fontSize: '13px' }} span={24} offset={0}>
                            <Button type='primary' style={{ marginLeft: '5px' }} onClick={this.showApproveDialog.bind(this)}><Icon type="check-circle" />接受申请</Button>
                            <Button type='danger' style={{ marginLeft: '5px' }} onClick={this.showRejectDialog.bind(this)}><Icon type="close-circle" />拒绝申请</Button>
                        </Col>
                    </Row>
                </div>
            );
        } else {
            btnDivHtml = (<div></div>);
        }

        return (
            <Layout style={{ padding: '1px 1px' }}>
                <Breadcrumb style={{ padding: '12px 16px', fontSize: 13, fontWeight: 800, background: '#F3F1EF' }}>
                    <Breadcrumb.Item>{CONSTANTS.DOMESTIC_LC}</Breadcrumb.Item>
                    <Breadcrumb.Item>{CONSTANTS.COMM_ALREADY_TRANS_TIME}: 6小时5分18秒</Breadcrumb.Item>
                </Breadcrumb>
                <Content style={{ background: '#fff', padding: 0, margin: '0' }}>

                    <Tabs defaultActiveKey="1" onChange={this.tabsCallback} style={{ marginTop: '20px' }}>
                        <TabPane tab="开征申请书" key="1">
                            <div style={{ margin: '15px 5px', marginLeft: '20px' }}>
                                <Row>
                                    <Col style={{ marginBottom: '12px', fontSize: '12px', color: '#32325d', fontWeight: 'bold' }} span={6}>申请人信息</Col>
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
                                <Row>
                                    <Col style={{ marginTop: '30px', marginBottom: '12px', fontSize: '12px', color: '#32325d', fontWeight: 'bold' }} span={6}>受益人信息</Col>
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
                                    <Col style={{ marginTop: '30px', marginBottom: '12px', fontSize: '12px', color: '#32325d', fontWeight: 'bold' }} span={6}>详细信息</Col>
                                </Row>
                                <Row>
                                    <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>结算货币</Col>
                                    <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{applicationForm.Currency}</Col>
                                    <Col span={3}></Col>
                                    <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>金额</Col>
                                    <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>信用证:{applicationForm.amount}  保证金:{applicationForm.EnsureAmount}</Col>
                                </Row>
                                <Row>
                                    <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>到期日</Col>
                                    <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{applicationForm.expiryDate}</Col>
                                    <Col span={3}></Col>
                                    <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>到期地点</Col>
                                    <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{applicationForm.ExpiryPlace}</Col>
                                </Row>
                                <Row>
                                    <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>付款期限</Col>
                                    <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{""}</Col>
                                    <Col span={3}></Col>
                                    <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>远期付款期限</Col>
                                    <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{isAtSight}</Col>
                                </Row>
                                <Row>
                                    <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>货物运输</Col>
                                    <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{goodsInfo.allowPartialShipment ? "允许分批" : "允许转运"}</Col>
                                    <Col span={3}></Col>
                                    <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>最迟装运日期</Col>
                                    <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{goodsInfo.latestShipmentDate}</Col>
                                </Row>

                                <Row>
                                    <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>装运地点</Col>
                                    <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{goodsInfo.ShippingPlace}</Col>
                                    <Col span={3}></Col>
                                    <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>目的地</Col>
                                    <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{goodsInfo.ShippingDestination}</Col>
                                </Row>

                                <Row>
                                    <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>贸易性质</Col>
                                    <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{goodsInfo.tradeNature == 1 ? "货物贸易" : "服务贸易"}</Col>
                                    <Col span={3}></Col>
                                    <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>溢短装</Col>
                                    <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{OverLow}</Col>
                                </Row>

                                <Row>
                                    <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>货物描述</Col>
                                    <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#32325d' }} span={21}>{goodsInfo.GoodsDescription}</Col>
                                </Row>

                                <Row>
                                    <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>其他条款</Col>
                                    <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#32325d', height: '40px' }} span={21}><div>{chargeInIssueBank}<br />{chargeOutIssueBank}<br />{docDelay}<br />发起日期不能早于开证日期。</div></Col>
                                </Row>
                            </div>

                            <div style={{ margin: '15px 5px', marginLeft: '20px', marginTop: '30px' }}>
                                <Row>
                                    <Col style={{ marginBottom: '6px', fontSize: '12px', color: '#32325d', fontWeight: 'bold' }} span={6}>合同及申请材料</Col>
                                </Row>
                                <Table
                                    columns={columns}
                                    dataSource={attachments}
                                    pagination={false}
                                    showHeader={false}
                                />
                            </div>

                            <div style={{ margin: '5px 8px', borderTop: '1px solid #e6ebf1', minHeight: 20 }}>

                            </div>
                            <div>
                                {btnDivHtml}
                            </div>
                        </TabPane>

                        <TabPane tab="交易进度" key="3">
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
                    dataform={this.state.afstate}
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

export default LetterDraft
