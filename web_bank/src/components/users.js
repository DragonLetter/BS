import React from 'react'
import { Layout, Breadcrumb, Popconfirm, Table, Icon, Form, Input, Select, Checkbox, DatePicker, Button, Modal, message } from 'antd'
const { Header, Content, Sider } = Layout;
import {fetch_get, fetch_post} from '../common'
import * as CONSTANTS from '../constants'
import '../main.css'
import '../bank.css'

const FormItem = Form.Item
const Option = Select.Option

const optionUT = [
    {key:0, value:'普通用户'},
    {key:11, value:'银行经办'},
    {key:12, value:'银行复核'},
    {key:13, value:'银行授权'},
    {key:10, value:'银行超管'},
    {key:21, value:'企业用户'},
    {key:20, value:'企业超管'},
];

const AddClientForm = Form.create()(
    (props) => {
        const options = [
            { label: '', value: '' },
        ];
        const { visible, onCancel, onCreate, onUpdate, onReset, form, selectOptions, curUser, pwdisable } = props;
        const { getFieldDecorator } = form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 15 },
        };
        return (
            <Modal
                visible={visible}
                curUser={curUser}
                title="用户信息"
                okText="保存"
                cancelText="取消"
                onCancel={onCancel}
                onOk={curUser? onUpdate:onCreate}
                footer={curUser?
                    [<Popconfirm title="Sure to delete?" onConfirm={() => {onReset}}><a>重置</a></Popconfirm>,
                    <Button key="back" onClick={onCancel}>取消</Button>,
                    <Button key="submit" onClick={onUpdate}>保存</Button>,]  :
                    [<Button key="back" onClick={onCancel}>取消</Button>,
                    <Button key="submit" onClick={onCreate}>保存</Button>]
                }
                >
                    <Form>
                        <FormItem {...formItemLayout} label="用户名称">
                            {getFieldDecorator('username', {
                                initialValue: curUser? curUser.username:"",
                                rules: [{ required: true, message: '请输入用户名称!' }],
                            })(
                                <Input placeholder="用户名称" maxLength="40" disabled={curUser?true:false}/>
                                )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="用户密码">
                            {getFieldDecorator('password', {
                                initialValue: curUser?"12":"",
                                rules: [{ required: true, message: '请输入用户密码!' }],
                            })(
                                <Input placeholder="用户登录密码" maxLength="40" type="password" disabled={pwdisable}/>
                                )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="联系人姓名">
                            {getFieldDecorator('contact', {
                                initialValue: curUser? curUser.contact:"",
                                rules: [{ required: true, message: '请输入用户姓名!' }],
                            })(
                                <Input placeholder="姓名" maxLength="40" />
                                )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="用户角色">
                            {getFieldDecorator('userType', {
                                initialValue: curUser? curUser.userType:"",
                                rules: [{ required: true, message: '请选择用户角色!' }],
                            })(
                                <Select placeholder="用户角色" maxLength="40">{selectOptions}</Select>
                                )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="联系电话">
                            {getFieldDecorator('phone', {
                                initialValue: curUser? curUser.phone:"",
                                rules: [{ required: true, message: '请输入联系电话!' }],
                            })(
                                <Input placeholder="联系电话" maxLength="40" />
                                )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="邮箱地址">
                            {getFieldDecorator('email', {
                                initialValue: curUser? curUser.email:"",
                                rules: [{ required: true, message: '请输入邮箱地址!' }],
                            })(
                                <Input placeholder="邮箱地址" maxLength="40" />
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
            user: Object,
            pwdisable:false,
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
    handleUsersInfo = (data) => {
        const users = [];
        for (let i = 0; i < data.length; i++) {
            users.push({
                key: i,
                username: data[i].username,
                contact: data[i].contact,
                password: data[i].password,
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
        fetch_get("/api/user/um/"+sessionStorage.getItem("domain"))
        .then((res) => {
            if(res.status >= 200 && res.status < 300){
                res.json().then((data) => {
                    this.handleUsersInfo(data);
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
            values.domain = sessionStorage.getItem('domain');
            values.userType = parseInt(values.userType);
            fetch_post("/api/user/um/",values)
            .then((res) => {
                if(res.status >= 200 && res.status < 300){
                    res.json().then((data) => {
                        form.resetFields();
                        this.setState({
                            creaeCorpVisible: false,
                        });
                    });
                }
            });
        });
    }
    handleUpdate = () => {
        const form = this.createForm;
        const user = this.state.user;
        form.validateFields((err, values) => {
            const password = values.password;
            values.username = user.username;
            values.password = user.password;
            values.userStatus = 0;
            values.domain = user.domain;
            values.userType = parseInt(values.userType);
            message.error(values);
            fetch_post("/api/user/um/update/"+password,values)
            .then((res) => {
                if(res.status >= 200 && res.status < 300){
                    res.json().then((data) => {
                        form.resetFields();
                        this.setState({
                            user: null,
                            creaeCorpVisible: false,
                        });
                    });
                }
            });
        });
    }
    handleReset = () => {
        this.setState({
            pwdisable: false,
        });
    }
    closeForm = () => {
        this.createForm.resetFields();
        this.setState({
            user: null,
            pwdisable: false,
            creaeCorpVisible: false,
        });
    }

    showCreateDraftForm = () => {
        this.setState({
            user: null,
            pwdisable: false,
            creaeCorpVisible: true,
        });
    }
    editUser = (key) => {
        const users = this.state.users;
        const curUser = users.find(item=>item.username==key);
        this.setState({
            user: curUser,
            pwdisable: true,
            creaeCorpVisible: true,
        })
    }
    deleteUser = (key) => {
        fetch_post("/api/user/nm/delete/"+key)
        .then((res) => {
            if(res.status >= 200 && res.status < 300){
                res.json().then((data) => {
                });
            }
        });
    }

    render() {
        const optionut = optionUT.map(opt => <Option key={opt.key}>{opt.value}</Option>);
        const columns = [
            {title: '用户名称',dataIndex: 'username',key: 'username',}, 
            {title: '姓名',key: 'contact', dataIndex:'contact'}, 
            {title: '联系电话',dataIndex: 'phone',key: 'phone',}, 
            {title: '电子邮箱',key: 'email',dataIndex: 'email',}, 
            {title: '所属域',dataIndex: 'domain',key: 'domain',}, 
            {title: '用户类型',dataIndex: 'userType',key: 'userType',},
            {title: '操作', key: 'operation', render:(text, record, index) => <span><Popconfirm title="Sure to delete?" onConfirm={() => this.deleteUser(record.username)}><a>删除</a></Popconfirm> <a>|</a> <a onClick={() => this.editUser(record.username)}>修改</a></span>,}
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
                    onUpdate={this.handleUpdate}
                    onReset={this.handleReset}
                    selectOptions={optionut}
                    curUser={this.state.user}
                    pwdisable={this.state.pwdisable}
                />
            </Layout>
        )
    }
}

export default Users;