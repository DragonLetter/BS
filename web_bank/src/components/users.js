import React from 'react'
import { Link, hashHistory, browserHistory} from 'react-router';
import {Timeline, Tag, Tabs, Row, Card, Layout, Breadcrumb, Collapse, InputNumber, Table, Icon, Steps, Form, Input, Select, Checkbox, DatePicker, Col, Radio, Button, Modal, Badge, Menu, Dropdown, message} from 'antd'

import {fetch_get, fetch_post} from '../common'
import * as CONSTANTS from '../constants'
import '../main.css'
import '../bank.css'

const { Header, Content, Sider } = Layout;
const Step = Steps.Step;
const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;
const { MonthPicker, RangePicker } = DatePicker;

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
const userFrom = Form.create()(
    (props) => {
        const options = [
            { label: '', value: '' },
        ];
        const { visible, onCancel, onSubmit, data, form, corpOptions, bankOptions } = props;
        const { getFieldDecorator } = form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };

        function handleSelect(value, option) {
            console.log(value, option);
            fetch_get("/api/corporation/" + value)
                .then((res) => {
                    if (res.status >= 200 && res.status < 300) {
                        //message.success("读取信息成功");
                        res.json().then((data) => {

                        });
                    }
                    if(res.status === 401){
                        res.redirect("/#/user/login");
                    }
                });
        }

        return (
            <Modal
                visible={visible}
                title="用户信息"
                okText="保存"
                cancelText="取消"
                onCancel={onCancel}
                onOk={onSubmit}
                width="90%"
                style={{ top: 20 }}
            >
                <Layout style={{ padding: '1px 1px' }}>
                    <div style={{ width: '100%', height: 30 }}><span style={{ float: 'right', padding: 5 }}>第一步，填写申请信息</span></div>
                    <Form style={{ margin: '0px 16px', borderTop: '1px solid #e6ebf1' }}>
                    </Form>
                </Layout>
            </Modal>
        );
    }
);

class Users extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            bordered : false,
            pagination: true,
            showHeader: true,
            display: false,
            userFromVisible: false,
            users: []
        }
    }
    userFormRef = (form) =>{
        this.userForm = form;
    }
    closeUserForm = () => {
        this.setState({
            userFromVisible: false,
        });
    }
    handleSubmit = () => {
        this.setState({
            userFromVisible: false,
        });
        const form = this.userForm;
    }
    showUserForm = () => {
        this.setState({
            userFromVisible: true,
        })
    }

    handleUsers = (data) => {
        const users = [];
        for(let i = 0; i < data.length; i++){
            users.push({
                key: data[i].id,
                username: data[i].username,
                phone: data[i].phone,
                email: data[i].email,
                domain: data[i].domain,
                userType: data[i].userType
            })
        }

        this.setState({
            users: users,
        });
    }

    componentDidMount = (value) => {
        fetch_get("/api/user/")
        .then((res) => {
            if(res.status >= 200 && res.status < 300){
                res.json().then((data) => {
                    this.handleUsers(data);
                });
            }
        });
    }

    render(){
        const columns = [
            {title: '用户名称',dataIndex: 'username',key: 'username',}, 
            {title: '联系电话',dataIndex: 'phone',key: 'phone',}, 
            {title: '电子邮箱',key: 'email',dataIndex: 'email',}, 
            {title: '所属域',dataIndex: 'domain',key: 'domain',}, 
            {title: '用户类型',key: 'userType',render:(text, record, index) => renderAUserType(record),},
            {title: '操作', key: 'operation', render: (text, record, index) => <Button  type='button' onClick={this.showUserForm}>修改</Button>
        }];
        return (
            <Layout style={{ padding: '0 1px 1px' }}>
                <Breadcrumb style={{ padding: '12px 16px', height:'42px', background:'#F3F1EF' }}>
                    <Breadcrumb.Item>{'用户管理'}</Breadcrumb.Item>
                </Breadcrumb>
                <Content style={{ background: '#fff', padding: 0, margin: 0, minHeight: 280 }}>
                    <div style={{margin: '12px 16px'}}>
                        <Table
                        className="components-table-demo-nested"
                        columns={columns}
                        dataSource={this.state.users}
                        />
                    </div>
                </Content>
                <userFrom
                    ref={this.userFormRef}
                    visible={this.state.userFromVisible}
                    onCancel={this.closeForm}
                    onSubmit={this.handleSubmit}
                />
            </Layout>
        )
    }
}

export default Users