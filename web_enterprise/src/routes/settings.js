import React from 'react'
import {Row, Card, Layout, Breadcrumb, Collapse, InputNumber, Table, Icon, Steps, Form, Input, Select, Checkbox, DatePicker, Col, Radio, Button, Modal, message} from 'antd'
const { Header, Content, Sider } = Layout;
import PageHeaderLayout from '../layouts/PageHeaderLayout';
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
            showHeader: true,
            display: false,
            creaeDraftFromVisible: false,
        }
    }

    closeForm = () => {
        this.setState({
            creaeDraftFromVisible: false,
        });
    }

    showCreateDraftForm = () => {
        this.setState({
            creaeDraftFromVisible: true,
        })
    }

    render(){
        const { getFieldDecorator  } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 15 },
        };
        return (
            <PageHeaderLayout title="业务设置">
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
                                                rules:[{required: true, message: "请输入账户名！"}],
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
                                        <FormItem {...formItemLayout} label="不知道是啥">
                                            {getFieldDecorator('userName', {
                                                rules:[{required: true, message: "请输入账户名！"}],
                                            })(
                                                <Input placeholder="账户名" />
                                            )}
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="不知道是啥">
                                            {getFieldDecorator('userName', {
                                                rules:[{required: true, message: "请输入账户名！"}],
                                            })(
                                                <Input placeholder="账户名" />
                                            )}
                                        </FormItem>
                                    </Form>
                                    <div style={{float: 'right'}}><Button style={{marginRight: 10}}>取消</Button><Button>确定</Button></div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                    <Row style={{marginTop: 10}}>
                        <Col span={24}>
                            <Card title={<div>
                                公开信息设置
                            </div> } bordered={false} noHovering>
                                <div>
                                    <Form onSubmit={this.submitLogin} className="login-form" style={{maxWidth: 400}}>
                                        <FormItem {...formItemLayout} label="业务名称">
                                            {getFieldDecorator('userName', {
                                                rules:[{required: true, message: "请输入业务名称！"}],
                                            })(
                                                <Input placeholder="业务名称" />
                                            )}
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="网址">
                                            {getFieldDecorator('userName', {
                                                rules:[{required: true, message: "请输入网址！"}],
                                            })(
                                                <Input placeholder="网址" />
                                            )}
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="不知道是啥">
                                            {getFieldDecorator('userName', {
                                                rules:[{required: true, message: "请输入账户名！"}],
                                            })(
                                                <Input placeholder="账户名" />
                                            )}
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="不知道是啥">
                                            {getFieldDecorator('userName', {
                                                rules:[{required: true, message: "请输入账户名！"}],
                                            })(
                                                <Input placeholder="账户名" />
                                            )}
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="邮箱">
                                            {getFieldDecorator('userName', {
                                                rules:[{required: true, message: "请输入邮箱！"}],
                                            })(
                                                <Input placeholder="邮箱" />
                                            )}
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="联系电话">
                                            {getFieldDecorator('userName', {
                                                rules:[{required: true, message: "请输入联系电话！"}],
                                            })(
                                                <Input placeholder="联系电话" />
                                            )}
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="不知道是啥">
                                            {getFieldDecorator('userName', {
                                                rules:[{required: true, message: "请输入账户名！"}],
                                            })(
                                                <Input placeholder="账户名" />
                                            )}
                                        </FormItem>
                                        <FormItem {...formItemLayout} label="地址">
                                            {getFieldDecorator('userName', {
                                                rules:[{required: true, message: "请输入地址！"}],
                                            })(
                                                <Input placeholder="地址" />
                                            )}
                                        </FormItem>
                                    </Form>
                                    <div style={{float: 'right'}}><Button style={{marginRight: 10}}>取消</Button><Button>确定</Button></div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </PageHeaderLayout>
        )
    }
}

Settings = Form.create()(Settings);

export default Settings; 