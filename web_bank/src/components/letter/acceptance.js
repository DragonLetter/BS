import React from 'react'
import 'whatwg-fetch'
import { Link, hashHistory } from 'react-router';
import '../../main.css'
import { fetch_get, fetch_post } from '../../common'
import * as CONSTANTS from '../../constants'
import PDF from 'react-pdf-js'

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
        const formItemLayout = { labelCol: { span: 3 }, wrapperCol: { span: 19 }, };

        return (
            <Modal
                visible={visible}
                title="同意通知"
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
                    <FormItem label="承兑金额" labelCol={{ span: 4 }} wrapperCol={{ span: 6 }}>
                        {
                            getFieldDecorator('amount', {
                                initialValue: dataform ? dataform.depositAmount : "",
                                rules: [{ required: true, message: '请填写正确的金额.' }],
                            })
                                (
                                <InputNumber
                                    defaultValue={0}
                                    min={1}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                />
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
        const { visible, onCancel, onOk, dataform, data, form } = props;
        const { getFieldDecorator } = form;
        const formItemLayout = { labelCol: { span: 3 }, wrapperCol: { span: 19 }, };

        return (
            <Modal
                visible={visible}
                title="不符合驳回"
                okText="提交"
                cancelText="取消"
                onCancel={onCancel}
                onOk={onOk}
                width='800'
            >
                <Form>
                    <FormItem {...formItemLayout} label="不符合说明">
                        {
                            getFieldDecorator('comment', {
                                initialValue: dataform ? dataform.suggestion : "",
                                rules: [{ required: true, message: '说明内容必须填写.' }],
                            })
                                (
                                <TextArea rows={4} placeholder="不符点说明内容必须填写。" />
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

class LetterDraft extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            bordered: false,
            approveDialogVisible: false,
            rejectDialogVisible: false,
            deposit: {},
            depositDoc: {},
            afstate: {},
            letters: {}
        }
    }

    componentDidMount = () => {
        this.getLCDraftDetail();
        this.getLCProcessFlows();
        this.getDepositData();
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
                        this.setState({
                            afstate: afdata,
                        });
                    });
                }
            });
    }

    getLCDraftDetail = () => {
        fetch_get("/api/bank/transaction/draft/" + this.props.params.id)
            .then((res) => {
                if (res.status >= 200 && res.status < 300) {
                    res.json().then((data) => {
                        this.handleDraftData(data);
                    });
                }
            });
    }

    handleDraftData = (data) => {
        this.setState({
            letters: data,
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
        var remainDepositAmount = parseInt(data.depositAmount) - parseInt(data.commitAmount);
        var deposit = {
            commitAmount: data.commitAmount,
            depositAmount: data.depositAmount,
            remainDepositAmount: remainDepositAmount,
            isDocUploaded: data.DepositDoc.FileHash == "" ? "无" : "有"
        };
        this.setState({
            deposit: deposit,
        });
        this.setState({
            depositDoc: data.DepositDoc,
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

    closeApproveDialog = () => {
        this.setState({
            approveDialogVisible: false,
        });
    }

    closeRejectDialog = () => {
        this.setState({
            rejectDialogVisible: false,
        });
    }

    showApproveDialog = () => {
        this.setState({
            approveDialogVisible: true,
        });
    }

    showRejectDialog = () => {
        this.setState({
            rejectDialogVisible: true,
        });
    }

    saveApproveRef = (form) => {
        this.approveForm = form;
    }

    saveRejectRef = (form) => {
        this.rejectForm = form;
    }

    handleApprove = (value) => {
        const form = this.approveForm;
        form.validateFields((err, values) => {
            if (err) { return; }
            if (sessionStorage.getItem('userType') == 11) {
                var afstate = this.state.afstate;
                afstate.state = '12';
                afstate.lcNo = this.state.letters.LCNo;
                afstate.suggestion = values.comment;
                afstate.isAgreed = "true";
                afstate.step = 'IssuingBankAcceptOrRejectStep';
                afstate.depositAmount = values.amount.toString();
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
                afstate.suggestion = values.comment;
                afstate.step = 'IssuingBankAcceptOrRejectStep';
                afstate.depositAmount = values.amount.toString();
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
                var result = {
                    no: this.props.params.id,
                    amount: values.amount.toString(),
                    suggestion: values.comment,
                    dismatchPoints: "",
                    isAgreed: "true",
                };
                this.HandleRequest(result);
                this.approveUpdateAfState();
            }


        });
    }

    handleReject = (value) => {
        const form = this.rejectForm;
        form.validateFields((err, values) => {
            if (err) { return; }
            if (sessionStorage.getItem('userType') == 12) {
                var afstate = this.state.afstate;
                afstate.state = '11';
                afstate.lcNo = this.state.letters.LCNo;
                afstate.suggestion = values.comment;
                afstate.isAgreed = "false";
                afstate.step = 'IssuingBankAcceptOrRejectStep';
                // afstate.depositAmount = values.amount.toString();
                fetch_post("/api/ApplicationForm/afstate/" + this.props.params.id, afstate)
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
                var afstate = this.state.afstate;
                afstate.state = '11';
                afstate.suggestion = values.comment;
                afstate.isAgreed = "false";
                afstate.step = 'IssuingBankAcceptOrRejectStep';
                // afstate.depositAmount = values.amount.toString();
                fetch_post("/api/ApplicationForm/afstate/" + this.props.params.id, afstate)
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
                var result = {
                    no: this.props.params.id,
                    amount: "0.00",
                    suggestion: "",
                    dismatchPoints: "",
                    isAgreed: "false",
                };
                this.HandleRequest(result);
                this.rejectUpdateAfState(values);
            }

        });
    }

    HandleRequest = (result) => {
        fetch_post("/api/bank/letterofcredit/acceptancepayment", result).then((res) => {
            if (res.status >= 200 && res.status < 300) {
                res.json().then((data) => {
                    this.closeApproveDialog();
                    this.closeRejectDialog();
                    message.success("审核完成, 等待企业确认.");
                });
            } else {
                message.error("交易执行失败，请检查审核信息.");
            }
        });
    }

    approveUpdateAfState = () => {
        var afstate = this.state.afstate;
        afstate.state = '11';//初始化身份--经办
        afstate.step = 'IssuingBankReviewRetireBillsStep';//开证行审核付款
        afstate.suggestion = "";
        afstate.depositAmount = "";
        fetch_post("/api/ApplicationForm/afstate/" + this.props.params.id, afstate)
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

    rejectUpdateAfState = (values) => {
        var afstate = this.state.afstate;
        afstate.state = '11';//初始化身份--经办
        afstate.step = 'AdvisingBankReviewBillsStep' //流程到通知行审核交单
        afstate.suggestion = values.comment;
        afstate.isAgreed = "false";
        afstate.depositAmount = "";
        fetch_post("/api/ApplicationForm/afstate/" + this.props.params.id, afstate)
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

    tabsCallback = (key) => {
        this.getLCDraftDetail();
        this.getLCProcessFlows();
        this.getDepositData();
    }

    // printPdf = () => {
    //     // alert(this.state.printpdf);
    //     window.open(serverBackEnd + "/zb_" + this.props.params.id + "_" + this.state.letters.LCNo + ".pdf");
    // }

    render() {
        let data = this.state.letters ? this.state.letters : [],
            deposit = this.state.deposit ? this.state.deposit : [],
            applicant = data.Applicant ? data.Applicant : [],
            beneficiary = data.Beneficiary ? data.Beneficiary : [],
            issuingBank = data.IssuingBank ? data.IssuingBank : [],
            advisingBank = data.AdvisingBank ? data.AdvisingBank : [],
            attachments = data.Attachments ? data.Attachments : [];
        let boldata = [];
        if (this.state.depositDoc)
            boldata[0] = this.state.depositDoc;
        let lcdata = [];
        if (data.Contract)
            lcdata[0] = data.Contract;
        let btnDivHtml;
        let pdfPath = serverBackEnd + "/zb_" + this.props.params.id + "_" + this.state.letters.LCNo + ".pdf";

        if (parseInt(this.state.afstate.state) == sessionStorage.getItem('userType')) {
            btnDivHtml = (
                <div style={{ marginTop: '20px', marginLeft: '16px', marginRight: '16px', marginBottom: '5px' }}>
                    <Row>
                        <Col style={{ fontSize: '13px' }} span={24} offset={0}>
                            <Button type='primary' style={{ marginLeft: '5px' }} onClick={this.showApproveDialog.bind(this)}><Icon type="check-circle" />确认承兑</Button>
                            <Button type='danger' style={{ marginLeft: '5px' }} onClick={this.showRejectDialog.bind(this)}><Icon type="close-circle" />不符点驳回</Button>
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
                    <Breadcrumb.Item>{CONSTANTS.COMM_TRANSING}</Breadcrumb.Item>
                </Breadcrumb>
                <Content style={{ background: '#fff', padding: 0, margin: '0' }}>

                    <Tabs defaultActiveKey="1" onChange={this.tabsCallback} style={{ marginTop: '20px' }}>
                        <TabPane tab="到单审核" key="1">
                            <div style={{ backgroundColor: '#d4cfcf47', marginLeft: '14px', marginRight: '14px', padding: '15px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
                                <div>
                                    <Row>
                                        <Col style={{ marginBottom: '12px', fontSize: '12px', color: '#32325d', fontWeight: 'bold' }} span={3}>信用证编号</Col>
                                        <Col style={{ marginBottom: '12px', fontSize: '12px', color: '#6b7c93', fontWeight: 'bold' }} span={3}>{this.state.letters.LCNo}</Col>
                                    </Row>
                                </div>
                                <div>
                                    <Row>
                                        <Col style={{ marginTop: '15px', marginBottom: '12px', fontSize: '12px', color: '#32325d', fontWeight: 'bold' }} span={3}>到单信息</Col>
                                    </Row>
                                    <Row>
                                        <Col style={{ marginTop: '20px', marginBottom: '12px', fontSize: '12px', color: '#6b7c93' }} span={3}>申请人</Col>
                                        <Col style={{ marginTop: '20px', marginBottom: '12px', fontSize: '12px', color: '#32325d' }} span={6}>{applicant.Name}</Col>
                                        <Col span={3}></Col>
                                        <Col style={{ marginTop: '20px', marginBottom: '12px', fontSize: '12px', color: '#6b7c93' }} span={3}>受益人</Col>
                                        <Col style={{ marginTop: '20px', marginBottom: '12px', fontSize: '12px', color: '#32325d' }} span={6}>{beneficiary.Name}</Col>
                                    </Row>
                                    <Row>
                                        <Col style={{ marginTop: '5px', marginBottom: '12px', fontSize: '12px', color: '#6b7c93' }} span={3}>开证金额</Col>
                                        <Col style={{ marginTop: '5px', marginBottom: '12px', fontSize: '12px', color: '#32325d' }} span={6}>{data.amount}{data.Currency}</Col>
                                        <Col span={3}></Col>
                                        <Col style={{ marginTop: '5px', marginBottom: '12px', fontSize: '12px', color: '#6b7c93' }} span={3}>应缴余额</Col>
                                        <Col style={{ marginTop: '5px', marginBottom: '12px', fontSize: '12px', color: '#32325d' }} span={6}>{deposit.remainDepositAmount}{data.Currency}</Col>
                                    </Row>
                                    <Row>
                                        <Col style={{ marginTop: '5px', marginBottom: '12px', fontSize: '12px', color: '#6b7c93' }} span={3}>已缴金额</Col>
                                        <Col style={{ marginTop: '5px', marginBottom: '12px', fontSize: '12px', color: '#32325d' }} span={6}>{deposit.commitAmount}{data.Currency}</Col>
                                        <Col span={3}></Col>
                                        <Col style={{ marginTop: '5px', marginBottom: '12px', fontSize: '12px', color: '#6b7c93' }} span={3}>到期日</Col>
                                        <Col style={{ marginTop: '5px', marginBottom: '12px', fontSize: '12px', color: '#32325d' }} span={6}>{data.expiryDate}</Col>
                                    </Row>
                                </div>
                                <div>
                                    <Row>
                                        <Col style={{ marginTop: '15px', marginBottom: '12px', fontSize: '12px', color: '#32325d', fontWeight: 'bold' }} span={3}>货运单据附件</Col>
                                    </Row>
                                    <Table
                                        columns={columns}
                                        dataSource={boldata}
                                        pagination={false}
                                        showHeader={false}
                                    />
                                </div>
                            </div>
                            <div>
                                {btnDivHtml}
                            </div>
                        </TabPane>

                        <TabPane tab="信用证正本" key="2">
                            <div style={{ margin: '15px 5px', marginLeft: '20px' }}>
                                <div>
                                    <Row>
                                        <Col style={{ marginTop: '5px', marginBottom: '12px', fontSize: '12px', color: '#32325d', fontWeight: 'bold' }} span={6}>申请人信息</Col>
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
                                </div>
                                <div>
                                    <Row>
                                        <Col style={{ marginTop: '25px', marginBottom: '12px', fontSize: '12px', color: '#32325d', fontWeight: 'bold' }} span={6}>开证行信息</Col>
                                    </Row>
                                    <Row>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>开证行</Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{issuingBank.Name}</Col>
                                        <Col span={3}></Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>地址</Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{issuingBank.Address}</Col>
                                    </Row>
                                </div>
                                <div>
                                    <Row>
                                        <Col style={{ marginTop: '25px', marginBottom: '12px', fontSize: '12px', color: '#32325d', fontWeight: 'bold' }} span={6}>通知行信息</Col>
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

                                </div>
                                <Row>
                                    <Col style={{ marginTop: '30px', marginBottom: '6px', fontSize: '12px', color: '#32325d', fontWeight: 'bold' }} span={6}></Col>
                                </Row>
                                <Table
                                    columns={columns}
                                    dataSource={lcdata}
                                    pagination={false}
                                    showHeader={false}
                                />
                                <Table
                                    columns={columns}
                                    dataSource={attachments}
                                    pagination={false}
                                    showHeader={false}
                                />
                                <div>
                                </div>
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
                        <TabPane tab="面函" key="4" >
                            <iframe src={pdfPath} width="100%" height="400">

                            </iframe>
                            {/* <Button type="primary" style={{ marginLeft: '15px' }} onClick={() => this.printPdf()}>打印</Button>
                            <div>                                
                                <PDF
                                    file={pdfPath}
                                />
                            </div> */}

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
                    onOk={this.handleReject}
                />
            </Layout>
        )
    }
}

export default LetterDraft
