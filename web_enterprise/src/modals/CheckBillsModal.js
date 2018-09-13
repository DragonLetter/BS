import React from 'react'
import { Row, Table, Form, Input, Col, Modal, Radio } from 'antd'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

const CheckBillsModal = Form.create()(
    (props) => {
        const formItemLayout = { labelCol: { span: 2 }, wrapperCol: { span: 5 }, };
        const Columns = [
            { title: '货运单号', dataIndex: 'BolNO', key: 'BolNO' },
            { title: '货物编号', dataIndex: 'GoodsNo', key: 'GoodsNo' },
            { title: '货物信息', dataIndex: 'GoodsDesc', key: 'GoodsDesc' },
            { title: '发货时间', dataIndex: 'ShippingTime', key: 'ShippingTime' }
        ];
        const { visible, onCancel, onOk, dataform, data, form } = props;
        const { getFieldDecorator } = form;

        var billData, title;
        if (data) {
            billData = data.billDetail;
            title = "信用证编号—" + data.title;
        }

        // 构造交单列表
        let handoverHtml = [];
        if (billData) {
            handoverHtml[0] = (<div style={{ margin: '16px 16px', borderTop: '1px solid #e6ebf1' }}>
                <Row>
                    <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={5}>交单编号：{billData.No}</Col>
                </Row>
                <Table bordered dataSource={billData.BillOfLandings} columns={Columns} pagination={false} />
            </div>);
        } else {
            handoverHtml[0] = <div></div>
        }

        return (
            <Modal
                visible={visible}
                title={title}
                okText="提交"
                cancelText="取消"
                onCancel={onCancel}
                onOk={onOk}
                width="80%"
            >
                <div style={{ marginTop: '0px', marginLeft: '10px', marginRight: '16px', marginBottom: '15px' }}>
                    {handoverHtml}
                </div>
                <Form>
                    <FormItem {...formItemLayout} label="说明">
                        {
                            getFieldDecorator('suggestion', {
                                initialValue: dataform ? dataform.suggestion : "",
                                rules: [{ required: true, message: '请填写审核说明, 内容必须填写' }],
                            })
                                (
                                <TextArea rows={4} placeholder="请填写审核说明, 内容必须填写" />
                                )
                        }
                    </FormItem>
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
                </Form>
            </Modal>
        );
    }
);

export default CheckBillsModal;