import React from 'react'
import { Popconfirm, Upload, Row, Layout, Breadcrumb, Collapse, InputNumber, Table, Badge, Timeline, Icon, Steps, Form, Input, Select, Checkbox, DatePicker, Col, Radio, Button, Modal, message } from 'antd'
import { fetch_get, fetch_post, request, getFileUploadOptions } from '../utils/common';
import DraftModal from '../modals/DraftModal';
import PageHeaderLayout from '../layouts/PageHeaderLayout';
const { Header, Content, Sider } = Layout;
const Step = Steps.Step;
const Panel = Collapse.Panel;

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group
const { TextArea } = Input;

let contract = {}, attachments = [], formValues, No;

const AddDraftForm = Form.create()(
    (props) => {
        const options = [
            { label: '', value: '' },
        ];
        const { visible, onCancel, onSubmit, data, form, corpOptions, bankOptions } = props;
        const { getFieldDecorator } = form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };

        function handleSelect(value, option) {
            console.log(value, option);
            fetch_get("/api/corporation/" + value)
                .then((res) => {
                    if (res.status >= 200 && res.status < 300) {
                        //message.success("读取信息成功");
                        res.json().then((data) => {

                        });
                    }
                    if(res.status === 401){
                        res.redirect("/#/user/login");
                    }
                });
        }

        return (
            <Modal
                visible={visible}
                title="发起信用证申请"
                okText="下一步"
                cancelText="取消"
                onCancel={onCancel}
                onOk={onSubmit}
                width="90%"
                style={{ top: 20 }}
            >
                <Layout style={{ padding: '1px 1px' }}>
                    <div style={{ width: '100%', height: 30 }}><span style={{ float: 'right', padding: 5 }}>第一步，填写申请信息</span></div>
                    <Form style={{ margin: '0px 16px', borderTop: '1px solid #e6ebf1' }}>
                        <Row>
                            <Col style={{ marginBottom: '12px', fontSize: '12px', color: '#32325d' }} span={6}>账户信息</Col>
                        </Row>
                        <Row gutter={40}>
                            <Col span={12} key={0}>
                                <FormItem {...formItemLayout} label={`申请人`}>
                                    {getFieldDecorator('ApplyCorpId', {
                                        rules: [{ required: false, message: '请选择签约银行!' }],
                                    })(
                                        <InputNumber style={{ display: "none" }} />
                                        )}
                                    <span>{sessionStorage.getItem("corp")}</span>
                                </FormItem>
                            </Col>
                            <Col span={12} key={1}>
                                <FormItem {...formItemLayout} label={`受益人`}>
                                    {getFieldDecorator('BeneficiaryId', {
                                        rules: [{ required: true, message: '请选择受益人!' }],
                                    })(
                                        <Select placeholder="企业名称" maxLength="40" onSelect={handleSelect}>{corpOptions}</Select>
                                        )}
                                </FormItem>
                            </Col>
                        </Row>
                        {/* <Row>
                            <Col style={{marginBottom: '12px', fontSize: '12px', color: '#32325d' }} span={6}>受益人账户信息</Col>
                        </Row>
                        <Row gutter={40}>
                            <Col span={12} key={0}>
                                <FormItem {...formItemLayout} label={`申请人`}>
                                    {getFieldDecorator('BeneficiaryId', {
                                    rules: [{ required: true, message: '请选择受益人!' }],
                                    })(
                                        <Select placeholder="企业名称" maxLength = "40" onSelect={handleSelect}>{corpOptions}</Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12} key={1}>
                                <FormItem {...formItemLayout} label={`地址`}>
                                    <span id="beneficiaryAddress"></span>
                                </FormItem>
                            </Col>
                        </Row> */}
                        <Row>
                            <Col style={{ marginBottom: '12px', fontSize: '12px', color: '#32325d' }} span={6}>银行信息</Col>
                        </Row>
                        <Row gutter={40}>
                            <Col span={12} key={0}>
                                <FormItem {...formItemLayout} label={`开证银行`}>
                                    {getFieldDecorator('IssueBankId', {
                                        rules: [{ required: true, message: '请选择开证银行!' }],
                                    })(
                                        <Select placeholder="开证行名称" maxLength="40">{bankOptions}</Select>
                                        )}
                                </FormItem>
                            </Col>
                            {/* <Col span={12} key={3}>
                            <FormItem {...formItemLayout} label={`账号`}>
                                <span>12345678909876</span>
                            </FormItem>
                        </Col> */}
                            <Col span={12} key={1}>
                                <FormItem {...formItemLayout} label={`通知银行`}>
                                    {getFieldDecorator('AdvisingBankId', {
                                        rules: [{ required: true, message: '请选择通知银行!' }],
                                    })(
                                        <Select placeholder="通知行名称" maxLength="40">{bankOptions}</Select>
                                        )}
                                </FormItem>
                            </Col>
                        </Row>
                        {/* <Row>
                            <Col style={{ marginBottom: '12px', fontSize: '12px', color: '#32325d' }} span={6}>通知行信息</Col>
                        </Row>
                        <Row gutter={40}>
                            <Col span={12} key={2}>
                                <FormItem {...formItemLayout} label={`通知银行`}>
                                    {getFieldDecorator('AdvisingBankId', {
                                        rules: [{ required: true, message: '请选择通知银行!' }],
                                    })(
                                        <Select placeholder="通知行名称" maxLength = "40">{bankOptions}</Select>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={12} key={3}>
                                <FormItem {...formItemLayout} label={`账号`}>
                                    <span>12345678909876</span>
                                </FormItem>
                            </Col>
                        </Row> */}
                        <Row>
                            <Col style={{ marginBottom: '12px', fontSize: '12px', color: '#32325d' }} span={6}>申请详情</Col>
                        </Row>
                        <Row gutter={40}>
                            <Col span={12} key={0}>
                                <FormItem {...formItemLayout} label={`结算货币`}>
                                    {getFieldDecorator('Currency', {
                                        rules: [{ required: true, message: '请输入结算货币!' }],
                                    })(
                                        <Input placeholder="结算货币" />
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={12} key={1}>
                                <FormItem {...formItemLayout} label={`金额`}>
                                    {getFieldDecorator('Amount', {
                                        rules: [{ required: true, message: '请输入结算金额!' }],
                                    })(
                                        /* <div>
                                            <Input placeholder="RMB" style={{ width: '60%', marginRight: 10 }} />
                                            <Checkbox>允许浮动3%</Checkbox>
                                        </div> */
                                        <InputNumber
                                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                            placeholder="结算金额"
                                            style={{ width: "100%" }}
                                        />
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={12} key={2}>
                                <FormItem {...formItemLayout} label={`到期日`}>
                                    {getFieldDecorator('ExpiryDate', {
                                        rules: [{ required: true, message: '请输入到期日!' }],
                                    })(
                                        <DatePicker placeholder="到期日" style={{ width: '100%' }} />
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={12} key={3}>
                                <FormItem {...formItemLayout} label={`到期地点`}>
                                    {getFieldDecorator('ExpiryPlace', {
                                        rules: [{ required: true, message: '请输入到期地点!' }],
                                    })(
                                        <Input placeholder="到期地点" />
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={12} key={4}>
                                <FormItem {...formItemLayout} label={`远期付款期限`}>
                                    {getFieldDecorator('IsAtSight', {
                                        rules: [{ required: true, message: '请选择运期付款期限！' }],
                                    })(
                                        <RadioGroup>
                                            <Radio value={true}>即期</Radio>
                                            <Radio value={false}>发运/服务交付</Radio>
                                        </RadioGroup>
                                        )}
                                </FormItem>
                                <div style={{ marginTop: -62, marginRight: 160, float: 'right' }} >
                                    <InputNumber id="afterSightDay" style={{ width: 40 }} />日后
                                </div>
                            </Col>
                            <Col span={12} key={5}>
                                <FormItem {...formItemLayout} label={`货物运输`}>
                                    {getFieldDecorator('AllowPartialShippment', {
                                        rules: [{ required: true, message: '请选择货物运输方式！' }],
                                    })(
                                        <CheckboxGroup options={[{ label: '允许分批', value: '1' }, { label: '允许转运', value: '2' },]} />
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={12} key={6}>
                                <FormItem {...formItemLayout} label={`最迟装运日期`}>
                                    {getFieldDecorator('LastestShipDate', {
                                        rules: [{ required: true, message: '请选择最近装运日期！' }],
                                    })(
                                        <DatePicker placeholder="最迟装运日期" style={{ width: '100%' }} />
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={12} key={7}>
                                <FormItem {...formItemLayout} label={`运输方式`}>
                                    {getFieldDecorator('ShippingWay', {
                                        rules: [{ required: true, message: '请选择运输方式！' }],
                                    })(
                                        <Select>
                                            <Option value="公路">公路</Option>
                                            <Option value="铁路">铁路</Option>
                                            <Option value="海运">海运</Option>
                                            <Option value="航运">航运</Option>
                                        </Select>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={12} key={8}>
                                <FormItem {...formItemLayout} label={`装运地点`}>
                                    {getFieldDecorator('ShippingPlace', {
                                        rules: [{ required: true, message: '请输入装运地点!' }],
                                    })(
                                        <Input placeholder="装运地点" />
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={12} key={9}>
                                <FormItem {...formItemLayout} label={`目的地`}>
                                    {getFieldDecorator('ShippingDestination', {
                                        rules: [{ required: true, message: '请输入目的地!' }],
                                    })(
                                        <Input placeholder="目的地" />
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={12} key={10}>
                                <FormItem {...formItemLayout} label={`贸易性质`}>
                                    {getFieldDecorator('TradeType', {
                                        rules: [{ required: true, message: '请选择贸易性质!' }],
                                    })(
                                        <RadioGroup>
                                            <Radio value={1}>货物贸易</Radio>
                                            <Radio value={2}>服务贸易</Radio>
                                        </RadioGroup>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={24} key={12} style={{ marginLeft: "-10%" }}>
                                <FormItem {...formItemLayout} label={`货物描述`}>
                                    {getFieldDecorator('GoodsDescription', {
                                        rules: [{ required: true, message: '请输入货物描述!' }],
                                    })(
                                        <TextArea rows={4} placeholder="请输入货物描述" />
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={24} key={13} style={{ marginLeft: "-10%" }}>
                                <FormItem {...formItemLayout} label={`单据要求`}>
                                    {getFieldDecorator('DocumentRequire', {
                                        rules: [{ required: true, message: '请选择所要求的单据类型!' }],
                                    })(
                                        <CheckboxGroup options={[{ label: '增值税发票正本（发票联合抵扣联）注明信用证号和合同号', value: '1' }, { label: '由受益人提供的货物收据', value: '2' }, { label: '保险单', value: '3' },]} />
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={24} key={14} style={{ marginLeft: "-10%" }}>
                                {/* <FormItem {...formItemLayout} label={`其它条款`}>
                                    {getFieldDecorator('name', {
                                        rules: [{ required: true, message: '请输入货物描述!' }],
                                    })(
                                        <div>
                                            <span>[ ]在开证行产生的费用，由<CheckboxGroup options={[`申请人`, `收益人`]} />承担。</span><br/>
                                            <span>[ ]在开证行外产生的费用，由<CheckboxGroup options={[`申请人`, `收益人`]} />承担。</span><br/>
                                            <span>[ ]单据必须自运输单据签发日<Input style={{ width: 26 }} />日内提交，且不能低于信用证有效期</span><br/>
                                            <span>[ ]发起日期不能早于开证日期</span>
                                        </div>
                                        )}
                                </FormItem> */}
                                <FormItem {...formItemLayout} label={`其它条款`}>
                                    <span>[ ]在开证行产生的费用，由</span>
                                    {getFieldDecorator('ChargeInIssueBank', {
                                        rules: [{ required: true, message: '请选择费用承担方!' }],
                                    })(
                                        /* <span>[ ]在开证行产生的费用，由<RadioGroup>
                                            <Radio value={true}>申请人</Radio>
                                            <Radio value={false}>受益人</Radio>
                                        </RadioGroup>承担。</span> */
                                        <RadioGroup>
                                            <Radio value={1}>申请人</Radio>
                                            <Radio value={2}>受益人</Radio>
                                        </RadioGroup>
                                        )}
                                    <span>承担。</span>
                                </FormItem>
                                <FormItem {...formItemLayout} label={``} style={{ marginLeft: 226, marginTop: -5 }}>
                                    <span>[ ]在开证行外产生的费用，由</span>
                                    {getFieldDecorator('ChargeOutIssueBank', {
                                        rules: [{ required: true, message: '请选择费用承担方!' }],
                                    })(
                                        <RadioGroup>
                                            <Radio value={1}>申请人</Radio>
                                            <Radio value={2}>受益人</Radio>
                                        </RadioGroup>
                                        )}
                                    <span>承担。</span>
                                </FormItem>
                                <FormItem {...formItemLayout} label={``} style={{ marginLeft: 226, marginTop: -5 }}>
                                    {getFieldDecorator('DocDelay', {
                                        rules: [{ required: true, message: '请填写提交期限!' }],
                                    })(
                                        <div>
                                            <span>[ ]单据必须自运输单据签发日<Input style={{ width: 32 }} />日内提交，且不能低于信用证有效期</span><br />
                                            <span>[ ]发起日期不能早于开证日期</span>
                                        </div>
                                        )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Layout>
            </Modal>
        );
    }
);

const SecondStepForm = Form.create()(
    (props) => {
        const options = [
            { label: '', value: '' },
        ];
        const { visible, onCancel, onSubmit, data, form } = props;
        const { getFieldDecorator } = form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };

        function onContractChange(info){
            contract.FileName = info.file.name;
            contract.FileHash = info.file.response.fileHash;
            contract.FileSignature = info.file.response.signature;
            contract.Uploader = info.file.response.uploader;
        }

        function onAttachmentChange(info){
            let attachment = {};
            attachment.FileName = info.file.name;
            attachment.FileHash = info.file.response.fileHash;
            attachment.FileSignature = info.file.response.signature;
            attachment.Uploader = info.file.response.uploader;
            attachments.push(attachment);
        }

        // const contractFileUploadOptions = {
        //     name: 'file',
        //     action: 'http://39.104.175.115:8080/api/Document/Upload',
        //     withCredentials: true,
        //     onChange(info) {
        //         if (info.file.status !== 'uploading') {
        //             console.log(info.file, info.fileList);
        //         }
        //         if (info.file.status === 'done') {
        //             message.success(`${info.file.name} 上传成功`);
        //             contract.Contract.FileName = info.file.name;
        //             contract.Contract.FileHash = info.file.response.fileHash;
        //             contract.Contract.FileSignature = info.file.response.signature;
        //         } else if (info.file.status === 'error') {
        //             message.error(`${info.file.name} 上传失败`);
        //         }
        //     },
        //     onRemove(file) {
        //         //console.log(file);
        //     }
        // };

        const contractFileUploadOptions = getFileUploadOptions(onContractChange);
        
        const documentFileUploadOptions = getFileUploadOptions(onAttachmentChange);
        // const documentFileUploadOptions = {
        //     name: 'file',
        //     action: 'http://39.104.175.115:8080/api/Document/Upload',
        //     onChange(info) {
        //         if (info.file.status !== 'uploading') {
        //             console.log(info.file, info.fileList);
        //         }
        //         if (info.file.status === 'done') {
        //             let attachment = {};
        //             attachment.FileName = info.file.name;
        //             attachment.FileHash = info.file.response.fileHash;
        //             attachment.FileSignature = info.file.response.signature;
        //             contract.Attachments.push(attachment);
        //             message.success(`${info.file.name} 上传成功`);
        //         } else if (info.file.status === 'error') {
        //             message.error(`${info.file.name} 上传失败`);
        //         }
        //     },
        //     onRemove(file) {
        //         console.log(file);
        //     }
        // };

        return (
            <Modal
                visible={visible}
                title="发起信用证申请"
                okText="提交"
                cancelText="取消"
                onCancel={onCancel}
                onOk={onSubmit}
                width="80%"
                style={{ top: 20 }}
            >
                <Layout style={{ padding: '1px 1px' }}>
                    <div style={{ width: '100%', height: 30 }}><span style={{ float: 'right', padding: 5 }}>第二步，合同信息</span></div>
                    <Form style={{ margin: '0px 16px', borderTop: '1px solid #e6ebf1' }}>
                        <Row>
                            <Col style={{ marginBottom: '12px', fontSize: '15px', color: '#32325d' }} span={6}>合同</Col>
                        </Row>
                        <Row gutter={40} style={{ marginBottom: 10 }}>
                            <Col span={12} key={0}>
                                <Upload style={{ marginLeft: 30 }} {...contractFileUploadOptions}>
                                    <Button>
                                        <Icon type="upload" /> 点击上传
                                    </Button>
                                </Upload>
                            </Col>

                        </Row>
                        <Row>
                            <Col style={{ marginBottom: '12px', fontSize: '15px', color: '#32325d' }} span={6}>附件</Col>
                        </Row>
                        <Row gutter={40} style={{ marginBottom: 10 }}>
                            <Col span={12} key={0}>
                                <Upload style={{ marginLeft: 30 }} {...documentFileUploadOptions}>
                                    <Button>
                                        <Icon type="upload" /> 点击上传
                                    </Button>
                                </Upload>
                            </Col>
                        </Row>
                    </Form>
                </Layout>
            </Modal>
        );
    }
);

class LocalLC extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            bordered: false,
            pagination: true,
            showHeader: true,
            display: false,
            createDraftFromVisible: false,
            secondStepFromVisible: false,
            draftModalVisible: false,
            LCs: [],
            banks: [],
            corporations: [],
            index: 0,
            LCData: [],
            loading: true,
        }
    }

    handleLCInfo = (data) => {
        const lcs = [];
        No = "";
        for (let i = 0; i < data.length; i++) {
            lcs.push({
                key: i,
                id: data[i].Key,
                lcNo: data[i].Record.lcNo || "等待银行审核",
                beneficiary: data[i].Record.ApplicationForm.Beneficiary.Name,
                applicant: data[i].Record.ApplicationForm.Applicant.Name,
                advisingBank: data[i].Record.ApplicationForm.AdvisingBank.Name,
                issuingBank: data[i].Record.ApplicationForm.IssuingBank.Name,
                amount: data[i].Record.ApplicationForm.amount,
                state: data[i].Record.CurrentStep,
                applyTime: data[i].Record.ApplicationForm.applyTime.split("T")[0],
            })
        }
        this.setState({
            LCs: lcs,
            LCData: data,
        });
    }

    componentDidMount = () => {
        const userId = sessionStorage.getItem("userId");
        request("/api/ApplicationForm/FindByCorp/" + userId)
            .then((data) => {
                this.handleLCInfo(data);
                this.setState({
                    loading: false,
                });
            });

        request("/api/bank")
            .then((data) => {
                const banks = [];
                for (let i = 0; i < data.length; i++) {
                    banks.push({
                        key: i,
                        id: data[i].id,
                        bankNo: data[i].no,
                        bankName: data[i].name,
                        address: data[i].address,
                        accountName: data[i].accountName,
                        accountNo: data[i].accountNo,
                    })
                }

                this.setState({
                    banks: banks,
                });
            });

        request("/api/corporation")
            .then((data) => {
                const corporations = [];
                for (let i = 0; i < data.length; i++) {
                    corporations.push({
                        key: i,
                        id: data[i].id,
                        name: data[i].name,
                        nation: data[i].nation,
                        contact: data[i].contact,
                        email: data[i].email,
                        creationTime: data[i].creationTime,
                    })
                }

                this.setState({
                    corporations: corporations,
                });
            });
    }

    closeForm = () => {
        this.setState({
            createDraftFromVisible: false,
        });
    }

    closeSecondStepForm = () => {
        this.setState({
            secondStepFromVisible: false,
        });
    }

    closeDraftModal = () => {
        this.setState({
            draftModalVisible: false,
        });
    }

    showCreateDraftForm = () => {
        this.setState({
            createDraftFromVisible: true,
        })
    }

    saveCreateFormRef = (form) => {
        this.createForm = form;
    }

    saveSecondStepFormRef = (form) => {
        this.secondStepForm = form;
    }

    handleSubmit = () => {
        this.setState({
            createDraftFromVisible: false,
            loading: true,
        })
        const form = this.createForm;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values.ApplyCorpId = parseInt(sessionStorage.getItem("userId"));
            let allowPartialShippment = "0", docRequire = 0;
            values.AllowPartialShippment = (values.AllowPartialShippment ? values.AllowPartialShippment : []);
            values.DocumentRequire = (values.DocumentRequire ? values.DocumentRequire : []);
            if (values.AllowPartialShippment.includes("1")) {
                allowPartialShippment = "1";
            }
            if (values.AllowPartialShippment.includes("2")) {
                values.AllowTransShippment = "1";
            } else {
                values.AllowTransShippment = "0";
            }
            if (values.DocumentRequire.includes("1")) {
                if (values.DocumentRequire.includes("2")) {
                    if (values.DocumentRequire.includes("3")) {
                        docRequire = 7;
                    } else {
                        docRequire = 4;
                    }
                } else {
                    if (values.DocumentRequire.includes("3")) {
                        docRequire = 5;
                    } else {
                        docRequire = 1;
                    }
                }
            } else {
                if (values.DocumentRequire.includes("2")) {
                    if (values.DocumentRequire.includes("3")) {
                        docRequire = 6;
                    } else {
                        docRequire = 2;
                    }
                } else {
                    if (values.DocumentRequire.includes("3")) {
                        docRequire = 3;
                    } else {
                        docRequire = 0;
                    }
                }
            }
            values.DocumentRequire = docRequire;
            values.AllowPartialShippment = allowPartialShippment;

            if (values.IsAtSight) {
                values.AfterSight = 0;
            } else {
                values.AfterSight = document.getElementById("afterSightDay").value;
            }
            values.BeneficiaryId = parseInt(values.BeneficiaryId);
            values.IssueBankId = parseInt(values.IssueBankId);
            values.AdvisingBankId = parseInt(values.AdvisingBankId);
            values.AfterSight = parseInt(values.AfterSight);
            values.DocDelay = parseInt(values.DocDelay);
            formValues = values;
            request('/api/applicationform', {
                method: "POST",
                body: values,
            })
                .then((data) => {
                    message.success("创建成功!");
                    this.handleLCInfo(data);
                    // No = data[data.length - 1].Key;
                    let keyArray = [];
                    for (let i in data) {
                        keyArray.push(data[i].Key);
                    }
                    No = Math.max(...keyArray);
                    this.setState({
                        secondStepFromVisible: true,
                        loading: false,
                    });

                });
        })
    }

    handleSecondSubmit = () => {
        this.setState({
            secondStepFromVisible: false,
            loading: true,
        });
        let form = this.secondStepForm;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            let data = formValues;
            data.Contract = contract;
            data.No = No;
            data.Attachments = attachments;
            request('/api/applicationform', {
                method: "POST",
                body: data,
            })
            .then((data) => {
                this.setState({
                    loading: false,
                })
            });
        });
    }

    showDetailModal = (index, text) => {
        this.setState({
            index: index,
            draftModalVisible: true,
        })
    }

    submitLc = (index, text, record) => {
        let data = {};
    }

    render = () => {
        const columns = [
            { title: '信用证编号', dataIndex: 'lcNo', key: 'lcNo' },
            { title: '受益人', dataIndex: 'applicant', key: 'applicant' },
            { title: '受益人', dataIndex: 'beneficiary', key: 'beneficiary' },
            { title: '开证金额', dataIndex: 'amount', key: 'amount' },
            { title: '当前进度', dataIndex: 'state', key: 'state' },
            { title: '发起日期', dataIndex: 'applyTime', key: 'applyTime' },
            {
                title: '操作',
                dataIndex: 'id',
                key: 'id',
                render: (text, record, index) => {
                    return (
                        <span>
                            <a onClick={() => this.showDetailModal(index, text)}>详情  </a>
                            {/* <span className="ant-divider" />
                            <Popconfirm title="确定提交该信用证至银行?" okText="确定" cancelText="取消" onConfirm={() => this.submitLc(index, text, record)}>
                                <a href="#">提交</a>
                            </Popconfirm> */}
                        </span>
                    )
                }
            },
        ];
        const bankOptions = this.state.banks.map(bank => <Option key={bank.id}>{bank.bankName}</Option>), 
            corpOptions = this.state.corporations.map(corporation => <Option key={corporation.id}>{corporation.name}</Option>);
        return (
            <PageHeaderLayout title="国内信用证">
                <Content style={{ background: '#fff', padding: 10, margin: 0, minHeight: 280 }}>
                    <div style={{ marginBottom: 14, height: 30 }}>
                        <Button size='large' type='primary' style={{ float: 'right' }} onClick={this.showCreateDraftForm.bind(this)}><Icon type="plus" />开证申请</Button>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                        <Table
                            className="components-table-demo-nested"
                            columns={columns}
                            dataSource={this.state.LCs}
                            {...this.state}
                        />
                    </div>
                </Content>
                {/* <Content style={{ background: '#fff', padding: 16, margin: 0, minHeight: 280 }}>
                    <div>
                        <div style={{ marginBottom: 14, height: 30 }}>
                            <Button size='large' type='primary' style={{ float: 'right' }} onClick={this.showCreateDraftForm.bind(this)}><Icon type="plus" />开证申请</Button>
                        </div>
                        <Table columns={columns} dataSource={this.state.LCs} {...this.state} />
                    </div>
                </Content> */}
                <AddDraftForm
                    ref={this.saveCreateFormRef}
                    visible={this.state.createDraftFromVisible}
                    onCancel={this.closeForm}
                    //data={this.state.tData[this.state.index]}
                    //onEdit={this.handleEdit}
                    onSubmit={this.handleSubmit}
                    corpOptions={corpOptions}
                    bankOptions={bankOptions}
                />
                <SecondStepForm
                    ref={this.saveSecondStepFormRef}
                    visible={this.state.secondStepFromVisible}
                    onCancel={this.closeSecondStepForm}
                    onSubmit={this.handleSecondSubmit}
                //data={data}
                //data={this.state.tData[this.state.index]}
                //onEdit={this.handleEdit}
                />
                <DraftModal
                    //ref={this.saveFormRef}
                    visible={this.state.draftModalVisible}
                    onCancel={this.closeDraftModal}
                    data={this.state.LCData[this.state.index]}
                    onSubmit={this.closeDraftModal}
                />
            </PageHeaderLayout>
        )
    }
}

export default LocalLC;
