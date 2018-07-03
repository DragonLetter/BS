import React from 'react'
import { Timeline, Tag, Upload, Tabs, Row, Card, Layout, Breadcrumb, Collapse, InputNumber, Table, Icon, Steps, Form, Input, Select, Checkbox, DatePicker, Col, Radio, Button, Modal, Badge, Menu, Dropdown, message } from 'antd'
const FormItem = Form.Item;

const RetireBillModal = Form.create()((props) => {
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
        title = "赎单——" + record.lcNo;

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
                        <Col style={{ marginBottom: '12px', fontSize: '15px', color: '#32325d' }} span={6}>付款信息</Col>
                    </Row>
                    <Row gutter={40}>
                        <Col span={12} key={0}>
                            <FormItem {...formItemLayout} label={`应付金额`}>
                                <span>{amount}</span>
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
                </Form>
            </Layout>
        </Modal>
    );
});

export default RetireBillModal;
