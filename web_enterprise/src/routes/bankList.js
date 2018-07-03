import React from 'react'
import { request } from '../utils/common'
import { Layout, Breadcrumb, Collapse, InputNumber, Table, Icon, Steps, Form, Input, Select, Checkbox, DatePicker, Col, Radio, Button, Modal, message } from 'antd'
import { Link, hashHistory } from 'react-router';
import PageHeaderLayout from '../layouts/PageHeaderLayout';
const { Header, Content, Sider } = Layout;
const Step = Steps.Step;
const Panel = Collapse.Panel;

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group
const { TextArea } = Input;

const columns = [{
    title: '银行编号',
    dataIndex: 'bankNo',
    key: 'bankNo',
}, {
    title: '名称',
    dataIndex: 'bankName',
    key: 'bankName',
}, {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
}, {
    title: '账户名称',
    key: 'accountName',
    dataIndex: 'accountName',
}, {
    title: '账号',
    key: 'accountNo',
    dataIndex: 'accountNo',
}];

const AddDraftForm = Form.create()(
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
                title="签约银行"
                okText="确定"
                cancelText="取消"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form>
                    <FormItem {...formItemLayout} label="银行名称">
                        {getFieldDecorator('bankId', {
                            rules: [{ required: true, message: '请选择签约银行!' }],
                        })(
                            <Select placeholder="银行名称" maxLength="40">{selectOptions}</Select>
                            )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="开户行地址">
                        {getFieldDecorator('address', {
                            rules: [{ required: true, message: '请输入开户行地址!' }],
                        })(
                            <Input placeholder="开户行地址" maxLength="40" />
                            )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="账户名称">
                        {getFieldDecorator('accountName', {
                            rules: [{ required: true, message: '请输入账户名称!' }],
                        })(
                            <Input placeholder="账户名称" maxLength="40" />
                            )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="账号">
                        {getFieldDecorator('accountNo', {
                            rules: [{ required: true, message: '请输入账号!' }],
                        })(
                            <Input placeholder="账号" maxLength="40" />
                            )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="备注">
                        {getFieldDecorator('remark', {
                            rules: [{ required: false, message: '备注!' }],
                        })(
                            <TextArea rows={4} placeholder="备注" />
                            )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
);

class Bank extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            bordered: false,
            pagination: true,
            showHeader: true,
            display: false,
            creaeDraftFromVisible: false,
            banks: [],
            signedbanks: [],
            loading: true,
        }
    }

    handleBankInfo = (data) => {
        const banks = [];
        for (let i = 0; i < data.length; i++) {
            banks.push({
                key: i,
                bankNo: data[i].Bank.no,
                bankName: data[i].Bank.name,
                address: data[i].address,
                accountName: data[i].accountName,
                accountNo: data[i].accountNo,
            })
        }

        this.setState({
            signedbanks: banks,
        });
    }

    componentDidMount = () => {
        request("/api/signedbank/" + sessionStorage.getItem("userId"))
            .then((data) => {
                this.handleBankInfo(data);
                this.setState({
                    loading: false,
                });
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
            values.corporationId = parseInt(sessionStorage.getItem("userId"));
            values.bankId = parseInt(values.bankId);
            request("/api/signedbank", {
                method: "POST",
                body: values,
            })
                .then((data) => {
                    this.handleBankInfo(data);
                })
                .catch((error) => {
                    message.error("创建失败！");
                });
            form.resetFields();
            this.setState({
                creaeDraftFromVisible: false,
            });
        });
    }

    closeForm = () => {
        this.setState({
            creaeDraftFromVisible: false,
        });
    }

    showCreateDraftForm = () => {
        request("/api/bank")
            .then((data) => {
                const banks = [];
                for (let i = 0; i < data.length; i++) {
                    banks.push({
                        key: i,
                        id: data[i].id,
                        bankNo: data[i].no,
                        bankName: data[i].name,
                        address: data[i].address,
                        accountName: data[i].accountName,
                        accountNo: data[i].accountNo,
                    })
                }

                this.setState({
                    banks: banks,
                    creaeDraftFromVisible: true,
                });
            });
    }

    render() {
        const options = this.state.banks.map(bank => <Option key={bank.id}>{bank.bankName}</Option>);
        return (
            <PageHeaderLayout title="签约银行列表">
                <Content style={{ background: '#fff', padding: 16, margin: 0, minHeight: 280 }}>
                    <div>
                        <div style={{ marginBottom: 14, height: 30 }}>
                            <Button size='large' type='primary' style={{ float: 'right' }} onClick={this.showCreateDraftForm.bind(this)}><Icon type="plus" />发起签约</Button>
                        </div>
                        <Table columns={columns} dataSource={this.state.signedbanks} {...this.state} />
                    </div>
                </Content>
                <AddDraftForm
                    ref={this.saveCreateFormRef}
                    visible={this.state.creaeDraftFromVisible}
                    onCancel={this.closeForm}
                    onCreate={this.handleCreate}
                    selectOptions={options}
                //data={this.state.tData[this.state.index]}
                //onEdit={this.handleEdit}
                />
            </PageHeaderLayout>
        )
    }
}

export default Bank;