import React, { Component } from 'react';

import { Form, Icon, Input, Button, Checkbox, message} from 'antd';
const FormItem = Form.Item;

import { Link, hashHistory} from 'react-router';

import 'whatwg-fetch';

 class Register extends Component {
    constructor(props) {
        super(props);
    }

    submitLogin = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                
            }
        });
    }

    render() {
        const { getFieldDecorator  } = this.props.form;
        return(
            <div style={{width: "100%", height: "100%", backgroundImage: "url()"}}>
                <div style={{width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexFlow: 'column'}}>
                    <div style={{textAlign: 'center'}}>
                        <span style={{fontSize: 40, lineHeight: 3, marginLeft: 20, color: "#108ee9"}}>信用证钱包</span>
                    </div>
                    <div style={{border: "1px solid #cfdbe2", borderRadius: 8, padding: "40px 40px 20px 40px", background: "#fafafa", backgroundColor: "rgba(255, 255, 255, 0.5)"}}>
                        <Form onSubmit={this.submitLogin} className="login-form" style={{maxWidth: 400}}>
                            <div style={{textAlign: 'center', fontSize: 20, marginBottom: 20}}>创建你的钱包用户</div>
                            <FormItem>
                                {getFieldDecorator('userName', {
                                    rules:[{required: true, message: "请输入邮箱！"}],
                                })(
                                    <Input addonBefore={<Icon type="user" />} placeholder="邮箱" />
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('password', {
                                    rules:[{required: true, message: "请输入密码！"}]
                                })(
                                    <Input addonBefore={<Icon type="lock" />} type="password" placeholder="密码" />
                                )}
                            </FormItem>
                            <FormItem style={{marginBottom: 4}}>
                                {getFieldDecorator('password', {
                                    rules:[{required: true, message: "请确认密码！"}]
                                })(
                                    <Input addonBefore={<Icon type="lock" />} type="password" placeholder="确认密码" />
                                )}
                            </FormItem>
                            <FormItem style={{width: 400, marginTop: 15}}>
                                <Button type="primary" htmlType="submit" className="login-form-button" style={{width: "100%"}}>创建钱包用户</Button>
                            </FormItem>
                        </Form>
                    </div>
                    <div style={{textAlign: 'center', marginTop: 20}}>已经拥有账号？<a>登录</a></div>
                </div>
            </div>
        );
    }
}

Register = Form.create()(Register);

export default Register;