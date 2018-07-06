import React from 'react'
import { Layout, Breadcrumb, Popconfirm, Table, Icon, Form, Input, Select, Checkbox, DatePicker, Button, Modal, message } from 'antd'
const { Header, Content, Sider } = Layout;
import {fetch_get, fetch_post} from '../common'
import * as CONSTANTS from '../constants'
import '../main.css'
import '../bank.css'

const FormItem = Form.Item
const Option = Select.Option

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
                        <FormItem {...formItemLayout} label="用户名称">
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '请输入用户名称!' }],
                            })(
                                <Input placeholder="用户名称" maxLength="40" />
                                )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="用户密码">
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入用户密码!' }],
                            })(
                                <Input placeholder="用户登录密码" maxLength="40" />
                                )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="姓">
                            {getFieldDecorator('firstName', {
                                rules: [{ required: true, message: '请输入用户姓!' }],
                            })(
                                <Input placeholder="姓" maxLength="40" />
                                )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="名">
                            {getFieldDecorator('lastName', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(
                                <Input placeholder="名" maxLength="40" />
                                )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="联系电话">
                            {getFieldDecorator('phone', {
                                rules: [{ required: true, message: '请输入联系电话!' }],
                            })(
                                <Input placeholder="联系电话" maxLength="40" />
                                )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="邮箱地址">
                            {getFieldDecorator('email', {
                                rules: [{ required: true, message: '请输入邮箱地址!' }],
                            })(
                                <Input placeholder="邮箱地址" maxLength="40" />
                                )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="所属域">
                            {getFieldDecorator('domain', {
                                rules: [{ required: true, message: '请输入用户所属域!' }],
                            })(
                                <Input placeholder="用户所属域" maxLength="40" />
                                )}
                        </FormItem>
                    </Form>
            </Modal>
        );
    }
);

class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            bordered: false,
            pagination: true,
            showHeader: true,
            display: false,
            creaeCorpVisible: false,
            users: [],
            corps: [],
            loading: true,
        }
    }
    renderAUserType = (type) => {
        switch(type){
            case 10:            return  '银行超管';
            case 11:            return  '银行经办';
            case 12:            return  '银行复核';
            case 13:            return  '银行授权';
            case 20:            return  '企业超管';
            case 21:            return  '企业用户';
            default:            return  '普通用户';
        }
    }
    handleCorpsInfo = (data) => {
        const users = [];
        for (let i = 0; i < data.length; i++) {
            users.push({
                key: i,
                username: data[i].username,
                firstName: data[i].firstName,
                lastName: data[i].lastName,
                phone: data[i].phone,
                domain: data[i].domain,
                email: data[i].email,
                userStatus: data[i].userStatus,
                userType: this.renderAUserType(data[i].userType),
            })
        }

        this.setState({
            users: users,
        });
    }

    componentDidMount = () => {
        fetch_get("/api/user/")
        .then((res) => {
            if(res.status >= 200 && res.status < 300){
                res.json().then((data) => {
                    this.handleCorpsInfo(data);
                    this.setState({
                        loading: false,
                    });
                });
            }
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
                    this.setState({
                        creaeCorpVisible: false,
                    });
        });
    }

    closeForm = () => {
        this.setState({
            creaeCorpVisible: false,
        });
    }

    showCreateDraftForm = () => {
                this.setState({
                    creaeCorpVisible: true,
                });
    }

    render() {
        const options = this.state.corps.map(corp => <Option key={corp.id}>{corp.name}</Option>);
        const columns = [
            {title: '用户名称',dataIndex: 'username',key: 'username',}, 
            {title: '姓名',key: 'name',render:(text,record,index)=> <p>{record.firstName+record.lastName}</p>}, 
            {title: '联系电话',dataIndex: 'phone',key: 'phone',}, 
            {title: '电子邮箱',key: 'email',dataIndex: 'email',}, 
            {title: '所属域',dataIndex: 'domain',key: 'domain',}, 
            {title: '用户类型',dataIndex: 'userType',key: 'userType',},
            {title: '操作', key: 'operation', render:(text, record, index) => <span><a>删除</a> <a>|</a> <a >修改</a></span>,}
            ];
        return (
            <Layout style={{ padding: '0 1px 1px' }}>
                <Breadcrumb style={{ padding: '12px 16px', height:'42px', background:'#F3F1EF' }}>
                    <Breadcrumb.Item>用户管理</Breadcrumb.Item>
                </Breadcrumb>
                <Content style={{ background: '#fff', padding: 16, margin: 0, minHeight: 280 }}>
                    <div>
                        <div style={{ marginBottom: 14, height: 30 }}>
                            <Button size='large' type='primary' style={{ float: 'right' }} onClick={this.showCreateDraftForm.bind(this)}><Icon type="plus" />添加用户</Button>
                        </div>
                        <Table columns={columns} dataSource={this.state.users} className="components-table-demo-nested" />
                    </div>
                </Content>
                <AddClientForm
                    ref={this.saveCreateFormRef}
                    visible={this.state.creaeCorpVisible}
                    onCancel={this.closeForm}
                    onCreate={this.handleCreate}
                    selectOptions={options}
                />
            </Layout>
        )
    }
}

export default Users;