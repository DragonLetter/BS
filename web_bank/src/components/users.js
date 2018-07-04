import React from 'react'
import { Layout, Breadcrumb, Collapse, InputNumber, Table, Icon, Steps, Form, Input, Select, Checkbox, DatePicker, Col, Radio, Button, Modal, message } from 'antd'
const { Header, Content, Sider } = Layout;
import {fetch_get, fetch_post} from '../common'
import * as CONSTANTS from '../constants'
import '../main.css'
import '../bank.css'

const Step = Steps.Step;
const Panel = Collapse.Panel;

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group
const { TextArea } = Input;

var renderAUserType = function(params) {
    switch(params.userType){
        case "10":            return  <p>{ '银行超管' }</p>;
        case "11":            return  <p>{ '银行经办' }</p>;
        case "12":            return  <p>{ '银行复核' }</p>;
        case "13":            return  <p>{ '银行授权' }</p>;
        case "20":            return  <p>{ '企业超管' }</p>;
        case "21":            return  <p>{ '企业用户' }</p>;
        default:            return  <p>{ '普通用户' }</p>;
    }
}
const optionsUT = [{
    key: '10',   name: '银行超管'  }, {
    key: '11',   name: '银行经办',  }, {
    key: '12',   name: '银行复核'  }, {
    key: '13',   name: '银行授权'  }, {
    key: '20',   name: '企业超管'  }, {
    key: '21',   name: '企业用户'  }, {
    key: '0',   name: '普通用户'  }];

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
        return (
            <Modal
                visible={visible}
                title="用户信息"
                okText="保存"
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
                    <FormItem {...formItemLayout} label="用户类型">
                        {getFieldDecorator('userType', {
                            rules: [{ required: true, message: '选择用户类型!' }],
                        })(
                            <Select placeholder="用户类型" maxLength="40">{selectOptions}</Select>
                            )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
);
const columns = [
    {title: '用户名称',dataIndex: 'username',key: 'username',}, 
    {title: '联系电话',dataIndex: 'phone',key: 'phone',}, 
    {title: '电子邮箱',key: 'email',dataIndex: 'email',}, 
    {title: '所属域',dataIndex: 'domain',key: 'domain',}, 
    {title: '用户类型',key: 'userType',render:(text, record, index) => renderAUserType(record)},
    {title: '操作', key: 'operation', render: (text, record, index) => <Button>修改</Button>
}];

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
            loading: true,
        }
    }

    showCreateDraftFormWData = function(params){
        this.setState({
            creaeCorpVisible: true,
        });
    }
    
    handleCorpsInfo = (data) => {
        const users = [];
        for (let i = 0; i < data.length; i++) {
            users.push({
                key: i,
                username: data[i].username,
                phone: data[i].phone,
                domain: data[i].domain,
                email: data[i].email,
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
            values.password = "123456";
            fetch_get("/api/user/selectOptions",{
                method: "POST",
                body: values,
            })
            .then((res) => {
                if(res.status >= 200 && res.status < 300){
                    res.json().then((data) => {
                        form.resetFields();
                        this.setState({
                            loading: false,
                        });
                    });
                }
            });
        });


        this.setState({
            creaeCorpVisible: false,
        });
    }

    closeForm = () => {
        this.setState({
            creaeCorpVisible: false,
        });
    }

    showCreateDraftForm = (record) => {
        this.setState({
            creaeCorpVisible: true,
        });
    }

    render() {
        const options = optionsUT.map(opt => <Option key={opt.key}>{opt.name}</Option>);
        return (
            <Layout title="用户列表">
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
                    selectOptions ={options}
                />
            </Layout>
        )
    }
}

export default Users;