import React from 'react'
import { request } from '../utils/common'
import { Layout, Breadcrumb, Collapse, InputNumber, Table, Icon, Steps, Form, Input, Select, Checkbox, DatePicker, Col, Radio, Button, Modal, message } from 'antd'
const { Header, Content, Sider } = Layout;
import PageHeaderLayout from '../layouts/PageHeaderLayout';
const Step = Steps.Step;
const Panel = Collapse.Panel;

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group
const { TextArea } = Input;

const columns = [{
    title: '客户名称',
    dataIndex: 'name',
    key: 'name',
}, {
    title: '国家',
    dataIndex: 'nation',
    key: 'nation',
}, {
    title: '联系人',
    dataIndex: 'contact',
    key: 'contact',
}, {
    title: '电子邮箱',
    key: 'email',
    dataIndex: 'email',
}, {
    title: '创建时间',
    key: 'creationTime',
    dataIndex: 'creationTime',
}];

const AddClientForm = Form.create()(
    (props) => {
        const options = [
            { label: '', value: '' },
        ];
        const { visible, onCancel, onCreate, data, form, selectOptions } = props;
        const { getFieldDecorator } = form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 15 },
        };
        const dateFormat = 'YYYY/MM/DD';
        return (
            <Modal
                visible={visible}
                title="添加客户"
                okText="确定"
                cancelText="取消"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form>
                    <FormItem {...formItemLayout} label="客户名称">
                        {getFieldDecorator('corporationId', {
                            rules: [{ required: true, message: '请输入客户名称!' }],
                        })(
                            <Select placeholder="客户名称" maxLength="40">{selectOptions}</Select>
                            )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="联系人">
                        {getFieldDecorator('contact', {
                            rules: [{ required: true, message: '请输入联系人!' }],
                        })(
                            <Input placeholder="联系人" maxLength="40" />
                            )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="邮箱地址">
                        {getFieldDecorator('email', {
                            rules: [{ required: true, message: '请输入邮箱地址!' }],
                        })(
                            <Input placeholder="邮箱地址" maxLength="40" />
                            )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="创建时间">
                        {getFieldDecorator('creationTime', {
                            rules: [{ required: true, message: '请输入创建时间!' }],
                        })(
                            <DatePicker placeholder="创建时间" style={{ width: '100%' }} format={dateFormat} />
                            )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
);

class ClientList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            bordered: false,
            pagination: true,
            showHeader: true,
            display: false,
            creaeCorpVisible: false,
            corporations: [],
            corps: [],
            loading: true,
        }
    }

    handleCorpsInfo = (data) => {
        const corporations = [];
        for (let i = 0; i < data.length; i++) {
            corporations.push({
                key: i,
                name: data[i].Corporation.name,
                nation: data[i].Corporation.nation,
                contact: data[i].contact,
                email: data[i].email,
                creationTime: data[i].creationTime,
            })
        }

        this.setState({
            corporations: corporations,
        });
    }

    componentDidMount = () => {
        request("/api/corpPartnership/" + sessionStorage.getItem("userId"))
            .then((data) => {
                this.handleCorpsInfo(data);
                this.setState({
                    loading: false,
                });
            })
            .catch((error) => {
                message.error("获取客户列表失败！")
            });
    }

    saveCreateFormRef = (form) => {
        this.createForm = form;
    }

    handleCreate = () => {
        const form = this.createForm;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values.hostCorpId = sessionStorage.getItem("userId");
            values.corporationId = parseInt(values.corporationId);
            request("/api/corpPartnership", {
                method: "POST",
                body: values,
            })
                .then((data) => {
                    message.success("创建成功!");
                    this.handleCorpsInfo(data);
                    form.resetFields();
                    this.setState({
                        creaeCorpVisible: false,
                    });
                })
                .catch((error) => {
                    message.error("创建失败！");
                });
        });
    }

    closeForm = () => {
        this.setState({
            creaeCorpVisible: false,
        });
    }

    showCreateDraftForm = () => {
        request("/api/corporation")
            .then((data) => {
                const corps = [];
                for (let i = 0; i < data.length; i++) {
                    corps.push({
                        key: i,
                        id: data[i].id,
                        name: data[i].name,
                        nation: data[i].nation,
                    })
                }

                this.setState({
                    corps: corps,
                    creaeCorpVisible: true,
                });
            });
    }

    render() {
        const options = this.state.corps.map(corp => <Option key={corp.id}>{corp.name}</Option>);
        return (
            <PageHeaderLayout title="合作客户列表">
                <Content style={{ background: '#fff', padding: 16, margin: 0, minHeight: 280 }}>
                    <div>
                        <div style={{ marginBottom: 14, height: 30 }}>
                            <Button size='large' type='primary' style={{ float: 'right' }} onClick={this.showCreateDraftForm.bind(this)}><Icon type="plus" />添加客户</Button>
                        </div>
                        <Table columns={columns} dataSource={this.state.corporations} {...this.state} />
                    </div>
                </Content>
                <AddClientForm
                    ref={this.saveCreateFormRef}
                    visible={this.state.creaeCorpVisible}
                    onCancel={this.closeForm}
                    onCreate={this.handleCreate}
                    selectOptions={options}
                />
            </PageHeaderLayout>
        )
    }
}

export default ClientList;