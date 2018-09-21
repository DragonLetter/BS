import React from 'react'
import moment from 'moment';
import 'moment/locale/zh-cn';

import { Timeline, Tag, Upload, Tabs, Row, Card, Layout, Breadcrumb, Collapse, InputNumber, Table, Icon, Steps, Form, Input, Select, Checkbox, DatePicker, Col, Radio, Button, Modal, Badge, Menu, Dropdown, message } from 'antd'
const Step = Steps.Step;

const { Header, Content, Sider } = Layout;
const { TextArea } = Input;
const FormItem = Form.Item;

const AmendationtModal = Form.create()((props) => {
    const { visible, onCancel, onSubmit, data, form } = props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 19 },
    };

    const record = data ? data.detail.Record : [],
        // applicationForm = record.ApplicationForm ? record.ApplicationForm : [],
        // applicant = applicationForm.Applicant ? applicationForm.Applicant : [],
        // beneficiary = applicationForm.Beneficiary ? applicationForm.Beneficiary : [],
        // issuingBank = applicationForm.IssuingBank ? applicationForm.IssuingBank : [],
        // advisingBank = applicationForm.AdvisingBank ? applicationForm.AdvisingBank : [],
        // goodsInfo = applicationForm.GoodsInfo ? applicationForm.GoodsInfo : [],
        // contract = applicationForm.Contract ? applicationForm.Contract : [],
        // deposit = record.LCTransDeposit ? record.LCTransDeposit : [],
        title = "信用证修改——" + record.lcNo;

    var amendTimes = 1;
    if (record.AmendFormFlow != null) {
        amendTimes = record.AmendFormFlow.length + 1;
    }

    var currency, amount, docDelay, expiryDate, shippingPlace, ensureAmount;
    if (record.LetterOfCredit != null) {
        // message.error(JSON.stringify(record.LetterOfCredit));
        currency  = record.LetterOfCredit.Currency;
        amount = record.LetterOfCredit.amount;
        docDelay = record.LetterOfCredit.docDelay;
        expiryDate = record.LetterOfCredit.expiryDate.substr(0, record.LetterOfCredit.expiryDate.indexOf('T'));
        shippingPlace = record.LetterOfCredit.GoodsInfo.ShippingPlace;
        ensureAmount = record.LetterOfCredit.EnsureAmount;    
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
                    <Row gutter={40} style={{ marginTop: 20 }}>
                        <Col span={12} key={0}>
                            <FormItem {...formItemLayout} label={`修改次数`}>
                                {getFieldDecorator('amendTimes', {
                                    initialValue: amendTimes + "",
                                    rules: [{ required: true, message: '请输入修改次数!' }],
                                })(
                                    <Input disabled={true} placeholder="修改次数" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12} key={1}>
                            <FormItem {...formItemLayout} label={`修改货币`}>
                                {getFieldDecorator('amendedCurrency', {
                                    initialValue :currency,
                                    rules: [{ required: true, message: '请输入修改货币!' }],
                                })(
                                    <Select>
                                        <Option value="CNY">人民币</Option>
                                        {/* <Option value="USD">美元</Option> */}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12} key={2}>
                            <FormItem {...formItemLayout} label={`修改金额`}>
                                {getFieldDecorator('amendedAmt', {
                                    initialValue :amount,                                    
                                    rules: [{ required: true, message: '请输入修改金额!' }],
                                })(
                                    <InputNumber
                                        min={0}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                        placeholder="修改金额"
                                        style={{ width: "100%" }}
                                    />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12} key={3}>
                            <FormItem {...formItemLayout} label={`期限增减`}>
                                {getFieldDecorator('addedDays', {
                                    // initialValue :docDelay,
                                    initialValue :"0",
                                    rules: [{ required: true, message: '请输入期限增减!' }],
                                })(
                                    <Input placeholder="期限增减" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12} key={4}>
                            <FormItem {...formItemLayout} label={`有效日期`}>
                                {getFieldDecorator('amendExpiryDate', {
                                    initialValue :moment(expiryDate),
                                    rules: [{ required: true, message: '请输入有效日期！' }],
                                })(
                                    <DatePicker defaultValue = {moment(expiryDate)} placeholder="有效日期" style={{ width: '100%' }} />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12} key={5}>
                            <FormItem {...formItemLayout} label={`发货地修改`}>
                                {getFieldDecorator('transPortName', {
                                    initialValue :shippingPlace,
                                    rules: [{ required: true, message: '请输入发货地修改！' }],
                                })(
                                    <Input placeholder="发货地修改" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12} key={6}>
                            <FormItem {...formItemLayout} label={`保证金增减`}>
                                {getFieldDecorator('addedDepositAmt', {
                                    // initialValue :ensureAmount,
                                    initialValue:"0",
                                    rules: [{ required: true, message: '请输入保证金增减！' }],
                                })(
                                    <Input placeholder="保证金增减" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Layout>
        </Modal>
    );
});


export default AmendationtModal;
