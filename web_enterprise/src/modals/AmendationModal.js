import React from 'react'
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
                    <Row gutter={40} style={{marginTop: 20}}>
                        <Col span={12} key={0}>
                            <FormItem {...formItemLayout} label={`修改次数`}>
                                {getFieldDecorator('amendTimes', {
                                    rules: [{ required: true, message: '请输入修改次数!' }],
                                })(
                                    <Input placeholder="修改次数" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12} key={1}>
                            <FormItem {...formItemLayout} label={`修改货币`}>
                                {getFieldDecorator('amendedCurrency', {
                                    rules: [{ required: true, message: '请输入修改货币!' }],
                                })(
                                    <Input placeholder="修改货币" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12} key={2}>
                            <FormItem {...formItemLayout} label={`修改金额`}>
                                {getFieldDecorator('amendedAmt', {
                                    rules: [{ required: true, message: '请输入修改金额!' }],
                                })(
                                    <InputNumber
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
                                    rules: [{ required: true, message: '请输入期限增减!' }],
                                })(
                                    <Input placeholder="期限增减" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12} key={4}>
                            <FormItem {...formItemLayout} label={`有效日期`}>
                                {getFieldDecorator('amendExpiryDate', {
                                    rules: [{ required: true, message: '请输入有效日期！' }],
                                })(
                                    <DatePicker placeholder="有效日期" style={{ width: '100%' }} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12} key={5}>
                            <FormItem {...formItemLayout} label={`发货地修改`}>
                                {getFieldDecorator('transPortName', {
                                    rules: [{ required: true, message: '请输入发货地修改！' }],
                                })(
                                    <Input placeholder="发货地修改" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12} key={6}>
                            <FormItem {...formItemLayout} label={`保证金增减`}>
                                {getFieldDecorator('addedDepositAmt', {
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
