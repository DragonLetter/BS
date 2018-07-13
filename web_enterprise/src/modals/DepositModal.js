import React from 'react'
import { Timeline, Tag, Upload, Tabs, Row, Card, Layout, Breadcrumb, Collapse, InputNumber, Table, Icon, Steps, Form, Input, Select, Checkbox, DatePicker, Col, Radio, Button, Modal, Badge, Menu, Dropdown, message } from 'antd'
const Step = Steps.Step;

const { Header, Content, Sider } = Layout;
const FormItem = Form.Item;
import { getFileUploadOptions } from '../utils/common';

let depositDoc = {};

const DepositModal = Form.create()((props) => {
    const { visible, onCancel, onSubmit, data, form } = props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 19 },
    };

    const record = data ? data.detail.Record : [],
        applicationForm = record.ApplicationForm ? record.ApplicationForm : [],
        applicant = applicationForm.Applicant ? applicationForm.Applicant : [],
        beneficiary = applicationForm.Beneficiary ? applicationForm.Beneficiary : [],
        issuingBank = applicationForm.IssuingBank ? applicationForm.IssuingBank : [],
        advisingBank = applicationForm.AdvisingBank ? applicationForm.AdvisingBank : [],
        goodsInfo = applicationForm.GoodsInfo ? applicationForm.GoodsInfo : [],
        contract = applicationForm.Contract ? applicationForm.Contract : [],
        deposit = record.LCTransDeposit ? record.LCTransDeposit : [],
        title = "缴纳保证金——" + record.lcNo;

    function onFileChange(info){
        depositDoc.FileName = info.file.name;
        depositDoc.FileHash = info.file.response.fileHash;
        depositDoc.FileSignature = info.file.response.signature;
        depositDoc.Uploader = info.file.response.uploader;
    }

    const depositFileUploadOptions = getFileUploadOptions(onFileChange);

    const normFile = function(){
        return depositDoc;
    }

    return (
        <Modal
            visible={visible}
            title={title}
            okText="提交"
            cancelText="取消"
            onCancel={onCancel}
            onOk={onSubmit}
            width="80%"
        >
            <Layout style={{ padding: '1px 1px' }}>
                <Form style={{ margin: '0px 16px', borderTop: '1px solid #e6ebf1' }}>
                    <Row>
                        <Col style={{ marginBottom: '12px', fontSize: '15px', color: '#32325d' }} span={6}>保证金信息</Col>
                    </Row>
                    <Row gutter={40}>
                        <Col span={12} key={0}>
                            <FormItem {...formItemLayout} label={`应付金额`}>
                                <span>{deposit.depositAmount}</span>
                            </FormItem>
                        </Col>
                        <Col span={12} key={1}>
                            <FormItem {...formItemLayout} label={`已付金额`}>
                                {getFieldDecorator('commitAmount', {
                                    rules: [{ required: true, message: '请填写已付金额!' }],
                                })(
                                    <Input placeholder="已付金额" maxLength="40"></Input>
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ marginBottom: '12px', fontSize: '15px', color: '#32325d' }} span={6}>单据上传</Col>
                    </Row>
                    <Row gutter={40} style={{ marginBottom: 10 }}>
                        <Col span={12} key={0}>
                            {/* <Upload style={{ marginLeft: 30 }} {...documentFileUploadOptions}>
                                <Button>
                                    <Icon type="upload" /> 点击上传
                            </Button>
                            </Upload> */}
                            <FormItem {...formItemLayout} label="点击上传">
                                {getFieldDecorator('depositDoc', {
                                    valuePropName: 'doc',
                                    getValueFromEvent: normFile,
                                    rules: [{ required: false, message: '请上传支付单据!' }],
                                })(
                                    <Upload {...depositFileUploadOptions}>
                                        <Button>
                                            <Icon type="upload" /> 上传
                                        </Button>
                                    </Upload>
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Layout>
        </Modal>
    );
});


export default DepositModal;
