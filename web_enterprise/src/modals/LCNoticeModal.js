import React from 'react'
import { Timeline, Tag, Upload, Tabs, Row, Card, Layout, Breadcrumb, Collapse, InputNumber, Table, Icon, Steps, Form, Input, Select, Checkbox, DatePicker, Col, Radio, Button, Modal, Badge, Menu, Dropdown, message } from 'antd'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

const LCNoticeModal = Form.create()((props) => {
    const { visible, onCancel, onSubmit, data, form } = props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 19 },
    };

    const record = data ? data.detail.Record : [],
        applicationForm = record.ApplicationForm ? record.ApplicationForm : [],
        deposit = record.LCTransDeposit ? record.LCTransDeposit : [],
        amount = applicationForm.amount - deposit.depositAmount,
        title = "处理信用证通知——" + record.lcNo;

    return (
        <Modal
            visible={visible}
            title={title}
            okText="提交"
            cancelText="取消"
            onCancel={onCancel}
            onOk={onSubmit}
            width="60%"
        >
            <Layout style={{ padding: '1px 1px' }}>
                <Form style={{ margin: '0px 16px', borderTop: '1px solid #e6ebf1' }}>
                    {/* <Row>
                        <Col style={{ marginBottom: '12px', fontSize: '15px', color: '#32325d' }} span={6}>付款信息</Col>
                    </Row> */}
                    <Row gutter={40}>
                        <Col span={12} key={0}>
                            <FormItem {...formItemLayout} label={`处理结果`}>
                                {getFieldDecorator('isAgreed', {
                                    rules: [{ required: true, message: '请选择是否同意!' }],
                                })(
                                    <RadioGroup>
                                        <Radio value={true}>同意</Radio>
                                        <Radio value={false}>不同意</Radio>
                                    </RadioGroup>
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={24} key={1} style={{ marginLeft: "-10%" }}>
                            <FormItem {...formItemLayout} label={`意见`}>
                                {getFieldDecorator('suggestion', {
                                    rules: [{ required: true, message: '请输入处理意见!' }],
                                })(
                                    <TextArea rows={4} placeholder="请输入处理意见" />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Layout>
        </Modal>
    );
});


export default LCNoticeModal;
