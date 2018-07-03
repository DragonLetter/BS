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

const ApproveDialog = Form.create()(
    (props) => {
        const options = [{ label: '', value: '' },];
        const { visible, onCancel, onOk, data, form } = props;
        const { getFieldDecorator } = form;
        const formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 19 }, };

        return (
            <Modal
                visible={visible}
                title="信用证开立"
                okText="提交"
                cancelText="取消"
                onCancel={onCancel}
                onOk={onOk}
                width='800'
            >
                <Form>
                    <FormItem {...formItemLayout} label="审核说明">
                        {
                            getFieldDecorator('comment', { rules: [{ required: true, message: '请填写审核说明, 内容必须填写.' }], })
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

const fileUploadOptions = {
    name: 'file',
    action: 'http://localhost:8080' + '/api/document/upload',
    withCredentials: true,
    onChange(info) {
        if (info.file.status !== 'uploading') {
            isFileUploaded = false;
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功`);
            lcAttachment.no = info.file.response.id.toString();
            lcAttachment.name = info.file.response.fileName;
            lcAttachment.uri = "";
            lcAttachment.hash = info.file.response.fileHash;
            lcAttachment.signature = info.file.response.signature;
            lcAttachment.uploader = "";
            isFileUploaded = true;
        } else if (info.file.status === 'error') {
            isFileUploaded = false;
            message.error(`${info.file.name} 上传失败`);
        }
    },
    onRemove(file) {
    }
};

// 信用证正本部分组件
const lccolumns = [
    { title: '名称', dataIndex: 'name', key: 'name', render: text => <a href="www.baidu.com">{text}</a> },
    { title: '编号', dataIndex: 'num', key: 'num' },
    { title: '上传时间', dataIndex: 'datetime', key: 'datetime' },
    { title: 'Action', dataIndex: '', key: 'x', render: () => <a href="#">Delete</a> },
];

const lcdata = [
    { key: 1, name: '江苏海洋国内信用证正本', num: '0x00340000344dfsdfs04340s', datetime: '2017/09/01 17:01' },
];

// 合同及附件证明材料部分组件
const columns = [
    { title: '名称', dataIndex: 'FileName', key: 'FileName' },
    { title: '上传人', dataIndex: 'Uploader', key: 'Uploader' },
    { title: '文件哈希值', dataIndex: 'FileHash', key: 'FileHash' },
];

const data = [
    { key: 1, name: '海洋化纤公司贸易合同', hash: '1FVKW4rp5rN23dqFVk2tYGY4niAXMB8eZC ', signature: '3JjPf13Rd8g6WAyvg8yiPnrsdjJt1NP4FC', datetime: '2017/09/01 17:01' },
    { key: 2, name: '企业营业执照扫描件', hash: '1FVKW4rp5rN23dqFVk2tYGY4niAXMB8eZC ', signature: '3JjPf13Rd8g6WAyvg8yiPnrsdjJt1NP4FC', datetime: '2017/09/01 17:01' },
    { key: 3, name: '资金证明文件扫描件', hash: '1FVKW4rp5rN23dqFVk2tYGY4niAXMB8eZC ', signature: '3JjPf13Rd8g6WAyvg8yiPnrsdjJt1NP4FC', datetime: '2017/09/01 17:01' },
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
            letters: {}
        }
    }

    componentDidMount = () => {
        this.getLCDraftDetail();
        this.getLCProcessFlows();
        this.getDepositData();
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
      //  if (!isFileUploaded) { return; }
        var result = {
            no: this.props.params.id,
            suggestion: values.comment,
            isAgreed: "true",
            depositDoc: lcAttachment
        };
        fetch_post("/api/bank/letterofcredit/bankissuing", result).then((res) => {
            if (res.status >= 200 && res.status < 300) {
                res.json().then((data) => {
                    this.closeApproveDialog();
                    message.success("审核完成, 等待企业确认.");
                });
            } else {
                message.error("交易执行失败，请检查审核信息.");
            }
        });
    }

    handleApprove = () => {
        const form = this.approveForm;
        form.validateFields((err, values) => {
            if (err) { return; }
            this.HandleRequestData(values);
        });

    }

    // TABS选择回调
    tabsCallback = (key) => {
        this.getLCDraftDetail();
        this.getLCProcessFlows();
        this.getDepositData();
    }

    render() {
        let data = this.state.letters ? this.state.letters : [],
            applicant = data.Applicant ? data.Applicant : [],
            beneficiary = data.Beneficiary ? data.Beneficiary : [],
            issuingBank = data.IssuingBank ? data.IssuingBank : [],
            advisingBank = data.AdvisingBank ? data.AdvisingBank : [],
            attachments = data.Attachments ? data.Attachments : [];
        return (
            <Layout style={{ padding: '1px 1px' }}>
                <Breadcrumb style={{ padding: '12px 16px', fontSize: 13, fontWeight: 800, background: '#F3F1EF' }}>
                    <Breadcrumb.Item>{CONSTANTS.DOMESTIC_LC}</Breadcrumb.Item>
                    <Breadcrumb.Item>{CONSTANTS.COMM_TRANSING}</Breadcrumb.Item>
                </Breadcrumb>
                <Content style={{ background: '#fff', padding: 0, margin: '0' }}>

                    <Tabs defaultActiveKey="1" onChange={this.tabsCallback} style={{ marginTop: '20px' }}>
                        <TabPane tab="开立审核" key="1">
                            <div style={{ backgroundColor: '#d4cfcf47', marginLeft: '14px', marginRight: '14px', padding: '15px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
                                <div>
                                    <Row>
                                        <Col style={{ marginBottom: '12px', fontSize: '12px', color: '#32325d', fontWeight: 'bold' }} span={3}>信用证编号</Col>
                                        <Col style={{ marginBottom: '12px', fontSize: '12px', color: '#6b7c93', fontWeight: 'bold' }} span={3}>{this.state.letters.LCNo}</Col>
                                    </Row>
                                </div>
                                <div>
                                    <Row>
                                        <Col style={{ marginTop: '15px', marginBottom: '12px', fontSize: '12px', color: '#32325d', fontWeight: 'bold' }} span={3}>保证金审核</Col>
                                    </Row>
                                    <Row>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>应缴金额</Col>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={6}>{this.state.deposit.depositAmount} RMB</Col>
                                        <Col span={3}></Col>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>实缴金额</Col>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={6}>{this.state.deposit.commitAmount} RMB</Col>
                                    </Row>
                                    <Row>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>保证金凭证</Col>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={6}>{this.state.deposit.isDocUploaded}</Col>
                                        <Col span={3}></Col>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>实缴金额</Col>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={6}>{this.state.deposit.commitAmount} RMB</Col>
                                    </Row>
                                </div>
                            </div>
                            <div style={{ marginTop: '20px', marginLeft: '16px', marginRight: '16px', marginBottom: '5px' }}>
                                <Row>
                                    <Col style={{ fontSize: '13px' }} span={24} offset={0}>
                                        <Button type='primary' style={{ marginLeft: '5px' }} onClick={this.showApproveDialog.bind(this)}><Icon type="check-circle" />信用证开立</Button>
                                    </Col>
                                </Row>
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

                                    <Row>
                                        <Col style={{ marginTop: '20px', marginBottom: '12px', fontSize: '12px', color: '#32325d', fontWeight: 'bold' }} span={6}>详细信息</Col>
                                    </Row>
                                    <Row>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>结算货币</Col>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{data.Currency}</Col>
                                        <Col span={3}></Col>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>金额</Col>
                                        <Col style={{ margin: '6px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{data.amount}</Col>
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
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>延期付款</Col>
                                        <Col span={3}></Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>远期付款期限</Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>发运100日后</Col>
                                    </Row>
                                    <Row>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>货物运输</Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>允许分批  允许转运</Col>
                                        <Col span={3}></Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>最迟装运日期</Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>2016/09/01</Col>
                                    </Row>

                                    <Row>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>装运地点</Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>河北沧州</Col>
                                        <Col span={3}></Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>目的地</Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>江苏泰州</Col>
                                    </Row>

                                    <Row>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>贸易性质</Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>货物贸易</Col>
                                        <Col span={3}></Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}></Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}></Col>
                                    </Row>

                                    <Row>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>货物描述</Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={21}>产品：已内酰胺 数量：80吨单价（含税）：CNY10900/吨总金额（含税）：CNY872,000.00</Col>
                                    </Row>

                                    <Row>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>其他条款</Col>
                                        <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d', minHeight: '40px' }} span={21}>信用证在国际贸易中还提供担保作用。国际贸易的买卖双方签订了货物买卖合同，双方会在合同条款中选择采用信用证的方法作为支付手段。通常买方向自己的开户银行申请开出信用证。在信用证担保关系中，买方称为“开证人”或“申请人”，银行称为“开证银行”，而卖方称为“受益人”。由于信用证是银行提供的，所以，银行从中提供了担保作用：银行一定会向卖方付款的。卖方发货后，取得单证。卖方在开证银行收到货款，及时将单证交给银行，银行再将单证的货权转让给买方。买方在申请银行开出信用证时，向银行交付了一定比例的保证金。当买方收到货物时就要向银行交付剩余的款额。所以，从上述运作过程中，可以看出银行提供了信用，信用证也是一种保证的合约。
                                    </Col>
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
                />
            </Layout>
        )
    }
}

export default LetterDraft
