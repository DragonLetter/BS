import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Input, Tabs, Button, Icon, Checkbox, Row, Col, Alert } from 'antd';
import styles from './Login.less';
import { fetch_get, fetch_post, request, clientIP} from '../../utils/common';

const FormItem = Form.Item;
const { TabPane } = Tabs;

@connect(state => ({
  login: state.login,
}))
@Form.create()
export default class Login extends Component {
    state = {
      count: 0,
      type: 'account',
      status: '',
    }

    componentWillReceiveProps(nextProps) {
    if (nextProps.login.status === 'ok') {
        this.props.dispatch(routerRedux.push('/'));
    }
}

  componentWillUnmount() {
      clearInterval(this.interval);
  }

  onSwitch = (key) => {
    this.setState({
      type: key,
    });
  }

  onGetCaptcha = () => {
    let count = 59;
    this.setState({ count });
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { type } = this.state;
    this.props.form.validateFields({ force: true },
      (err, values) => {
        // request('/api/user/login', {
        //     method: "POST",
        //     body: values,
        // })
        //   .then((data) => {
        //       window.location.href= clientIP + "/#/";
        //   })
        //   .catch((error) => {
        //       this.setState({
        //         status: "error",
        //       })
        //   });
        fetch_post('/api/user/login', values)
        .then((res) => {
            if (res.status >= 200 && res.status < 300) {
                window.location.href= clientIP + "/#/";
            } else {
              this.setState({
                  status: "error",
              });
            }
        })
      }
    );
  }

  renderMessage = (message) => {
    return (
      <Alert
        style={{ marginBottom: 24 }}
        message={message}
        type="error"
        showIcon
      />
    );
  }

  render() {
    const { form, login } = this.props;
    const { getFieldDecorator } = form;
    const { count, type } = this.state;
    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
          <Tabs animated={false} className={styles.tabs} activeKey={type} onChange={this.onSwitch}>
            <TabPane tab="" key="account">
              {
                this.state.status === 'error' &&
                this.renderMessage('账户或密码错误')
              }
              <FormItem>
                {getFieldDecorator('userName', {
                  rules: [{
                    required: type === 'account', message: '请输入账户名！',
                  }],
                })(
                  <Input
                    size="large"
                    prefix={<Icon type="user" className={styles.prefixIcon} />}
                    placeholder="请输入账户名"
                  />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{
                    required: type === 'account', message: '请输入密码！',
                  }],
                })(
                  <Input
                    size="large"
                    prefix={<Icon type="lock" className={styles.prefixIcon} />}
                    type="password"
                    placeholder="请输入密码"
                  />
                )}
              </FormItem>
            </TabPane>
          </Tabs>
          <FormItem className={styles.additional}>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox className={styles.autoLogin}>记住密码</Checkbox>
            )}
            <Button size="large" loading={login.submitting} className={styles.submit} type="primary" htmlType="submit">
              登录
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
