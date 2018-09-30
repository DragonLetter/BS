import React from 'react'
import { Row, Table, Form, Input, Col, Modal, Radio } from 'antd'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

const AmendOperationsModal = Form.create()(
    (props) => {
        const formItemLayout = { labelCol: { span: 2 }, wrapperCol: { span: 5 }, };
        const { visible, onCancel, onOk, dataform, data, form } = props;
        const { getFieldDecorator } = form;

        var  title;
        if (data) {           
            title = "信用证编号—" + data.lcNo;
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

                <Form>
                    <FormItem {...formItemLayout} label="说明">
                        {
                            getFieldDecorator('suggestion', {
                                initialValue: dataform ? dataform.suggestion : "",
                                rules: [{ required: true, message: '请填写审核说明, 内容必须填写' }],
                            })
                                (
                                <TextArea rows={10} placeholder="请填写审核说明, 内容必须填写" />
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

export default AmendOperationsModal;