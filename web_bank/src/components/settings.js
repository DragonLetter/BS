import React from 'react'
import { Link, hashHistory, browserHistory} from 'react-router';
import {fetch_get, fetch_post} from '../common'
import * as CONSTANTS from '../constants'
import '../main.css'
import '../bank.css'

import {Row, Card, Layout, Breadcrumb, Collapse, InputNumber, Table, Icon, Steps, Form, Input, Select, Checkbox, DatePicker, Col, Radio, Button, Modal, message} from 'antd'
const { Header, Content, Sider } = Layout;
const Step = Steps.Step;
const Panel = Collapse.Panel;
const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group
const { TextArea } = Input;

class Settings extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            bordered : false,
            pagination: true,
            display: false,
        }
    }

    render(){
        const { getFieldDecorator  } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 15 },
        };
        return (
            <Layout style={{ padding: '0 1px 1px' }}>
                <Breadcrumb style={{ padding: '12px 16px', height:'42px', background:'#F3F1EF' }}>
                    <Breadcrumb.Item>业务设置</Breadcrumb.Item>
                </Breadcrumb>
                <Content style={{ background: '#fff', padding: 0, margin: 0, minHeight: 280 }}>
                <div>
                <Row>
                    <Col span={24}>
                        <Card title={<div>
                            账户设置
                        </div> } bordered={false} noHovering>
                            <div>
                                <Form onSubmit={this.submitLogin} className="login-form" style={{maxWidth: 400}}>
                                    <FormItem {...formItemLayout} label="账户名">
                                        {getFieldDecorator('userName', {
                                            rules:[{required: true, message: "请输入账户名"}],
                                        })(
                                            <Input placeholder="账户名" />
                                        )}
                                    </FormItem>
                                    <FormItem {...formItemLayout} label="所在国家">
                                        {getFieldDecorator('userName', {
                                            rules:[{required: true, message: "请输入所在国家！"}],
                                        })(
                                            <Input placeholder="所在国家" />
                                        )}
                                    </FormItem>
                                    <FormItem {...formItemLayout} label="联系人">
                                        {getFieldDecorator('userName', {
                                            rules:[{required: true, message: "请输入联系人名称"}],
                                        })(
                                            <Input placeholder="联系人" />
                                        )}
                                    </FormItem>
                                    <FormItem {...formItemLayout} label="邮箱">
                                        {getFieldDecorator('userName', {
                                            rules:[{required: true, message: "请输入邮箱地址"}],
                                        })(
                                            <Input placeholder="邮箱" />
                                        )}
                                    </FormItem>
                                </Form>
                                <div style={{float: 'right'}}><Button style={{marginRight: 10}}>取消</Button><Button>确定</Button></div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
                </Content>
            </Layout>
        )
    }
}

Settings = Form.create()(Settings);

export default Settings
