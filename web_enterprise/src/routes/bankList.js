import React from 'react';
import { request } from '../utils/common';
import { Layout, Breadcrumb, Collapse, InputNumber, Table, Icon, Steps, Form, Input, Select, Checkbox, DatePicker, Col, Radio, Button, Modal, message } from 'antd'
import PageHeaderLayout from '../layouts/PageHeaderLayout';

const { Header, Content, Sider } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;


const columns = [
    {
        title: '银行名称',
        key: 'bankName',
        dataIndex: 'bankName'
    },
    {
        title: '银行地址',
        key: 'address',
        dataIndex: 'address'
    },
    {
        title: '企业账号',
        key: 'accountNo',
        dataIndex: 'accountNo'
    },
    {
        title: '签约状态',
        key: 'status',
        dataIndex: 'status'
    }
];

const AddDraftForm = Form.create()(
    (props) => {
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
                    {/* <FormItem {...formItemLayout} label="开户行地址">
                        {getFieldDecorator('address', {
                            rules: [{ required: true, message: '请输入开户行地址!' }],
                        })(
                            <Input placeholder="开户行地址" maxLength="40" />
                        )}
                    </FormItem> */}
                    {/* <FormItem {...formItemLayout} label="账户名称">
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
                    </FormItem> */}
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
            corp: Object,
            signedbanks: [],
            loading: true,
        }
    }

    componentDidMount = () => {
        // 获取签约银行信息
        this.getSignedBankList();

        // 获取当前用户的企业信息
        this.getCurrentCorpInfo();
    }

    // 请求backend获取签约银行信息
    getSignedBankList = () => {
        request("/api/signedbank/" + sessionStorage.getItem("userId"))
            .then((data) => {
                const signedbanks = [];
                for (let i = 0; i < data.length; i++) {
                    var applyStatus;
                    if (data[i].StateSign == 0) {
                        applyStatus = "请求签约";
                    } else if (data[i].StateSign == 1) {
                        applyStatus = "签约成功";
                    } else {
                        applyStatus = "签约失败";
                    }
                    signedbanks.push({
                        key: i,
                        bankName: data[i].bank.name,
                        address: data[i].bank.address,
                        accountNo: data[i].corp.account,
                        status: applyStatus,
                        info: data[i] //原始数据
                    })
                }

                this.setState({
                    signedbanks: signedbanks,
                    loading: false
                });
            });
    }

    // 请求backend获取当前用户企业相关信息
    getCurrentCorpInfo = () => {
        request("/api/user/current")
            .then((data) => {
                this.setState({
                    corp: data.corp,
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

            // 查找已经签约银行列表中是否包含当前选中银行
            var bankID = parseInt(values.bankId);
            for (let i = 0; i < this.state.signedbanks.length; i++) {
                if (bankID == this.state.signedbanks[i].info.bank.id) {
                    if (this.state.signedbanks[i].info.StateSign == 0) {
                        message.error("正在同此银行进行签约，请等待！");
                    } else if (this.state.signedbanks[i].info.StateSign == 1) {
                        message.error("此银行已经进行签约，请重新选中其它银行！");
                    } else {
                        message.error("此银行签约失败，请在签约银行列表界面重新发起签约！");
                    }
                    return;
                }
            }

            // 获取签约银行的所有数据
            var bankinfo;
            for (let i = 0; i < this.state.banks.length; i++) {
                if (bankID == this.state.banks[i].bankinfo.id) {
                    bankinfo = this.state.banks[i].bankinfo;
                }
            }

            // 获取签约企业信息
            var corpinfo = this.state.corp;

            // 通过用户选择银行信息获取数据进行签约
            var req = {
                "No": this.state.corp.id + "_" + bankinfo.id,
                "Type": "Sign",
                "bank": {
                    "id": bankinfo.id.toString(),
                    "no": bankinfo.no,
                    "name": bankinfo.name,
                    "domain": bankinfo.domain,
                    "address": bankinfo.address,
                    "postcode": "",
                    "telephone": "",
                    "telefax": "",
                    "remark": bankinfo.remark
                },
                "corp": {
                    "id": corpinfo.id.toString(),
                    "name": corpinfo.name,
                    "domain": corpinfo.domain,
                    "nation": corpinfo.nation,
                    "contact": corpinfo.contact,
                    "email": corpinfo.email,
                    "account": corpinfo.account,
                    "depositBank": corpinfo.depositBank,
                    "address": corpinfo.address,
                    "postcode": "",
                    "telephone": "",
                    "telefax": "",
                    "creationTime": corpinfo.creationTime
                },
                "StateSign": 0
            };

            // 发送签约请求
            request("/api/signedbank", {
                method: "POST",
                body: req,
            }).then((data) => {
                // 获取签约银行信息
                this.getSignedBank();
            }).catch((error) => {
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
                        bankinfo: data[i]
                    })
                }
                this.setState({
                    banks: banks,
                    creaeDraftFromVisible: true,
                });
            });
    }

    render() {
        const options = this.state.banks.map(bank => <Option key={bank.bankinfo.id}>{bank.bankinfo.name}</Option>);
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
                // data={this.state.tData[this.state.index]}
                // onEdit={this.handleEdit}
                />
            </PageHeaderLayout>
        )
    }
}

export default Bank;