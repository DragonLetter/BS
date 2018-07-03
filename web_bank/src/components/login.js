import React, { Component } from 'react';

import { Form, Icon, Input, Button, Checkbox, message} from 'antd';
const FormItem = Form.Item;

import { Link, hashHistory} from 'react-router';

import {fetch_get, fetch_post} from '../common'
import 'jquery'
import * as CONSTANTS from '../constants'

const onClose = function (e) {
    console.log(e, 'I was closed.');
  };

class Login extends Component {
    constructor(props) {
        super(props);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                this.fetchRequest(values);
            }
        });
    }

    fetchRequest(values) {
        fetch_post("/api/user/login", values)
        .then((res) => {
            if(res.status >= 200 && res.status <= 300){
                hashHistory.push("/lcpayment/index");                
            } else{
                message.error(CONSTANTS.ERROR_LOGIN);
            }
        });
    }

    render() {
        const { getFieldDecorator  } = this.props.form;

        return(
            <div style={{width: "100%", height: "100%", backgroundImage: "url()"}}>
                <div style={{width: "100%", height: "80%", display: "flex", alignItems: "center", justifyContent: "center", flexFlow: 'column'}}>
                    <div style={{textAlign: 'center'}}>
                        <span style={{fontSize: 26, lineHeight: 3, marginLeft: 20, color: "#108ee9"}}>{CONSTANTS.SYS_NAME}</span>
                    </div>
                    <div style={{border: "1px solid #cfdbe2", borderRadius: 8, padding: "40px 40px 20px 40px", background: "#fafafa", backgroundColor: "rgba(255, 255, 255, 0.5)"}}>
                        <Form onSubmit={this.handleSubmit} className="login-form" style={{maxWidth: 320}}>
                            <div style={{textAlign: 'center', fontSize: 18, marginBottom: 20}}>{CONSTANTS.SYS_WELCOME_BACK}</div>
                            <FormItem>
                                { getFieldDecorator('userName', { rules:[{required: true, message: CONSTANTS.SYS_LOGIN_NAME_TIPS}], })(
                                    <Input addonBefore={<Icon type="user" />} placeholder={CONSTANTS.SYS_LOGIN_NAME_PLH} />
                                )}
                            </FormItem>
                            <FormItem style={{marginBottom: 4}}>
                                { getFieldDecorator('password', { rules:[{required: true, message: CONSTANTS.SYS_LOGIN_PASSWD_TIPS}] })(
                                    <Input addonBefore={<Icon type="lock" />} type="password" placeholder={CONSTANTS.SYS_LOGIN_PASSWD_PLH} />
                                )}
                            </FormItem>
                            <FormItem style={{width: 320, marginTop: 15}}>
                                <Button type="primary" htmlType="submit" className="login-form-button" style={{width: "100%"}}>{CONSTANTS.SYS_LOGIN}</Button>
                            </FormItem>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}

Login = Form.create()(Login);

export default Login;