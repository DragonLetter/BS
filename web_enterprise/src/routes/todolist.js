import React from 'react'
import { fetch_get, fetch_post, request, getFileUploadOptions } from '../utils/common';
import { List, Spin, Card, Layout, Breadcrumb, Collapse, InputNumber, Table, Icon, Steps, Form, Input, Select, Checkbox, DatePicker, Col, Radio, Button, Modal, message, Tabs } from 'antd'
const { Header, Content, Sider } = Layout;
const Step = Steps.Step;
const Panel = Collapse.Panel;
import PageHeaderLayout from '../layouts/PageHeaderLayout';

import ConfirmDraftModal from '../modals/ConfirmDraftModal';
import DepositModal from '../modals/DepositModal';
import AmendationModal from '../modals/AmendationModal';
import RetireBillModal from '../modals/RetireBillModal';
import LCNoticeModal from '../modals/LCNoticeModal';
import DraftModal from '../modals/DraftModal';
import HandoverBillsModal from '../modals/HandoverBillsModal'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group
const { TextArea } = Input;
const TabPane = Tabs.TabPane;

class TodoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingLCMain: true,
            loadingLCModify: true,
            loadingLCHandover: true,
            visible: false,
            bordered: false,
            pagination: true,
            showHeader: true,
            display: false,
            confirmModalVisible: false,
            transactions: [],
            corps: [],
            transactionData: null,
            depositModalVisible: false,
            amendationModalVisible: false,
            retireBillModalVisible: false,
            LCNoticeModalVisible: false,
            loading: true,
            draftModalVisible: false,
            handoverBillModalVisible: false,
            billInfo: [],
            billFile: [],
        }
    }

    handleTransInfo = (data) => {
        if (data === "暂无数据") {
            this.setState({
                loading: false,
            });
            return;
        }
        const transactions = [];
        for (let i = 0; i < data.length; i++) {
            transactions.push({
                id: data[i].Key,
                title: data[i].Record.lcNo || "尚未获得信用证编号",
                applicant: data[i].Record.ApplicationForm.Applicant.Name,
                beneficiary: data[i].Record.LetterOfCredit.Beneficiary.Name,
                amount: data[i].Record.LetterOfCredit.amount,
                status: data[i].Record.CurrentStep,
                applyTime: data[i].Record.LetterOfCredit.applyTime.split("T")[0],
                detail: data[i]
            })
        }

        this.setState({
            transactions: transactions,
            loading: false,
        });
    }

    getTransInfo = () => {
        const userId = sessionStorage.getItem("userId");
        request("/api/transaction/corp/processing/" + userId)
            .then((data) => {
                this.handleTransInfo(data);
            });
    }

    componentDidMount = () => {
        this.getTransInfo();
    }

    saveCreateFormRef = (form) => {
        this.createForm = form;
    }

    depositModalRef = (form) => {
        this.depositForm = form;
    }

    amendationModalRef = (form) => {
        this.amendForm = form;
    }

    retireBillModalRef = (form) => {
        this.retireBillForm = form;
    }

    LCNoticeModalRef = (form) => {
        this.lcNoticeForm = form;
    }

    closeForm = () => {
        this.setState({
            confirmModalVisible: false,
        });
    }

    closeDepositModal = () => {
        this.setState({
            depositModalVisible: false,
        });
    }

    closeAmendationModal = () => {
        this.setState({
            amendationModalVisible: false,
        });
    }

    closeRetireBillModal = () => {
        this.setState({
            retireBillModalVisible: false,
        });
    }

    closeLcNoticeModal = () => {
        this.setState({
            LCNoticeModalVisible: false,
        });
    }

    closeDraftModal = () => {
        this.setState({
            draftModalVisible: false,
        });
    }

    closeHandoverBillsModal = () => {
        this.setState({
            handoverBillModalVisible: false,
        });
    }

    handleTransaction = (transaction) => {
        // alert(transaction.id);
        this.setState({
            transactionData: transaction,
        });
        switch (transaction.status) {
            case "保存":
                this.setState({
                    confirmModalVisible: true,
                });
                break;
            case "填写信用证草稿":
                this.setState({
                    depositModalVisible: true,
                });
                break;
            case "银行发证":
            case "通知行收到信用证通知":
            case "申请人修改信用证":
            case "发证行承兑或拒付":
                this.setState({
                    amendationModalVisible: true,
                });
                break;
            case "受益人接收信用证":
                this.setState({
                    LCNoticeModalVisible: true,
                });
                break;
            case "受益人交单":
                this.setState({
                    handoverBillModalVisible: true,
                });
                break;
            case "申请人赎单":
                this.setState({
                    retireBillModalVisible: true,
                });
                break;
        }
    }

    showDetail = (transaction) => {
        this.setState({
            transactionData: transaction,
            draftModalVisible: true,
        });
    }

    handleApplicationFormSubmit = () => {
        this.setState({
            loading: true,
            confirmModalVisible: false,
        })
        var data = {};
        data.id = this.state.transactionData.id;
        data.corpId = sessionStorage.getItem("userId");
        request('/api/applicationform/submit', {
            method: "POST",
            body: data,
        }).then((data) => {
            this.getTransInfo();
            this.setState({
                loading: false,
            });
        });
    }

    handleDepositSubmit = () => {
        let form = this.depositForm;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            // 判断已付金额是否合法
            var depositAmount = parseInt(this.state.transactionData.detail.Record.LCTransDeposit.depositAmount);
            if (parseInt(values.commitAmount) > depositAmount) {
                message.error("已付金额不能超过应付金额:" + depositAmount + "!");
                return;
            }

            // contract.ContractNo = values.ContractNo;
            // let data = {};
            // data.Contract = contract;
            // data.no = this.state.transactionData.id;
            values.no = this.state.transactionData.id;
            request('/api/letterOfCredit/deposit', {
                method: "POST",
                body: values,
            })
                .then((data) => {
                    message.success("提交保证金成功!");
                    this.setState({
                        depositModalVisible: false,
                    });
                })
            // fetch_post('/api/letterOfCredit/deposit', values)
            //     .then((res) => {
            //         if (res.status >= 200 && res.status < 300) {
            //             message.success("提交保证金成功!");
            //             this.setState({
            //                 depositModalVisible: false,
            //             })
            //         } else {
            //             message.error("提交保证金失败！");
            //             this.setState({
            //                 depositModalVisible: false,
            //             })
            //         }
            //     })
        });
    }

    handleAmendSubmit = () => {
        let form = this.amendForm;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            // contract.ContractNo = values.ContractNo;
            // let data = {};
            // data.Contract = contract;
            // data.no = this.state.transactionData.id;
            values.no = this.state.transactionData.id;
            values.amendedAmt = "" + values.amendedAmt;
            request('/api/letterOfCredit/Amending', {
                method: "POST",
                body: values,
            })
                .then((data) => {
                    message.success("修改成功!");
                    this.setState({
                        amendationModalVisible: false,
                    })
                })
            // fetch_post('/api/letterOfCredit/Amending', values)
            //     .then((res) => {
            //         if (res.status >= 200 && res.status < 300) {
            //             message.success("修改成功!");
            //             this.setState({
            //                 amendationModalVisible: false,
            //             })
            //         } else {
            //             message.error("修改失败！");
            //             this.setState({
            //                 amendationModalVisible: false,
            //             })
            //         }
            //     })
        });
    }

    handleRetireBillSubmit = () => {
        let form = this.retireBillForm;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            // contract.ContractNo = values.ContractNo;
            // let data = {};
            // data.Contract = contract;
            // data.no = this.state.transactionData.id;
            values.no = this.state.transactionData.id;
            // values = {
            //     no: this.state.transactionData.id,
            //     commitAmount: this.state.transactionData.detail.Record.LCTransDeposit.commitAmount
            // }
            message.error(JSON.stringify(values));
            request('/api/letterOfCredit/retire', {
                method: "POST",
                body: values,
            }).then((data) => {
                message.success("赎单成功!");
                this.setState({
                    retireBillModalVisible: false,
                });
            })
            // fetch_post('/api/letterOfCredit/retire', values)
            //     .then((res) => {
            //         if (res.status >= 200 && res.status < 300) {
            //             message.success("赎单成功!");
            //             this.setState({
            //                 retireBillModalVisible: false,
            //             })
            //         } else {
            //             message.error("赎单失败！");
            //             this.setState({
            //                 retireBillModalVisible: false,
            //             })
            //         }
            //     })
        });
    }

    handleLcNoticeSubmit = () => {
        let form = this.lcNoticeForm;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values.no = this.state.transactionData.id;
            values.isAgreed += '';
            request('/api/LetterofCredit/beneficiaryHandle', {
                method: "POST",
                body: values,
            })
                .then((data) => {
                    message.success("处理成功!");
                    this.setState({
                        LCNoticeModalVisible: false,
                    })
                })
                .catch((error) => {
                    message.error("处理失败！");
                    this.setState({
                        LCNoticeModalVisible: false,
                    });
                })
            // fetch_post('/api/LetterofCredit/beneficiaryHandle', values)
            //     .then((res) => {
            //         if (res.status >= 200 && res.status < 300) {
            //             message.success("处理成功!");
            //             this.setState({
            //                 LCNoticeModalVisible: false,
            //             })
            //         } else {
            //             message.error("处理失败！");
            //             this.setState({
            //                 LCNoticeModalVisible: false,
            //             })
            //         }
            //     })
        });
    }

    handleBillChange = (data) => {
        this.setState({
            billInfo: data,
        });
    }

    handleFileChange = (fileList) => {
        this.setState({
            billFile: fileList,
        })
    }

    handleHandoverBillSubmit = () => {
        let values = {};
        values.no = this.state.transactionData.id;
        values.billInfo = this.state.billInfo;
        values.billFile = this.state.billFile;
        request('/api/LetterofCredit/beneficiaryHandoverBills', {
            method: "POST",
            body: values,
        })
            .then((data) => {
                message.success("处理成功!");
                this.setState({
                    handoverBillModalVisible: false,
                });
            })
            .catch((error) => {
                message.error("处理失败！");
                this.setState({
                    handoverBillModalVisible: false,
                })
            })
        // fetch_post('/api/LetterofCredit/beneficiaryHandoverBills', values)
        // .then((res) => {
        //     if (res.status >= 200 && res.status < 300) {
        //         message.success("处理成功!");
        //         this.setState({
        //             handoverBillModalVisible: false,
        //         })
        //     } else {
        //         message.error("处理失败！");
        //         this.setState({
        //             handoverBillModalVisible: false,
        //         })
        //     }
        // })
    }

    determineActions = (item) => {
        switch (item.status) {
            case "保存":
            case "填写信用证草稿":
            case "申请人赎单":
            case "受益人接收信用证":
            case "受益人交单":
                return ([<a onClick={() => this.showDetail(item)}>查看详情</a>, <a onClick={() => this.handleTransaction(item)}>立即处理</a>]);
            // case "银行确认":
            //case "银行发证":
            //return ([<a  onClick={() => this.showDetail(item)}>查看详情</a>]);
            case "通知行收到信用证通知":
            case "申请人修改信用证":
            case "发证行承兑或拒付":
                return ([<a onClick={() => this.showDetail(item)}>查看详情</a>, <a onClick={() => this.handleTransaction(item)}>发起修改</a>]);
            // case "受益人接收信用证":
            // case "受益人交单":
            //     return ([<span>等待受益人响应</span>]);
            // case "闭卷":
            // case "结束":
            //     return ([<span>信用证流转完成</span>]);
        }

    }

    render() {
        const options = this.state.corps.map(corp => <Option key={corp.id}>{corp.name}</Option>),
            list = this.state.transactions,
            container = (
                <div>
                    <List
                        rowKey="id"
                        grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
                        dataSource={list.length === 0 ? [{ "id": 0, title: "", description: "" }] : [...list]}
                        renderItem={
                            item => (item.title ? (
                                <List.Item key={item.id}>
                                    <Card title={item.title} actions={this.determineActions(item)}>
                                        <span style={{ display: "block" }}>申请人：{item.applicant}</span>
                                        <span style={{ display: "block" }}>受益人：{item.beneficiary}</span>
                                        <span style={{ display: "block" }}>开证金额：{item.amount}</span>
                                        <span style={{ display: "block" }}>申请时间：{item.applyTime}</span>
                                        <span style={{ display: "block" }}>当前状态：{item.status}</span>
                                    </Card>
                                </List.Item>
                            ) : (
                                    <List.Item key={item.id}>
                                        <span>暂无任何待处理事件</span>
                                    </List.Item>
                                )
                            )}
                    />
                </div>
            );
        return (
            // <PageHeaderLayout title="待办事项">
            //     <Content style={{ background: '#fff', padding: 16, margin: 0, minHeight: 280 }}>
            //         <Spin spinning={this.state.loading} delay={500} >{container}</Spin>
            //     </Content>
            //     <ConfirmDraftModal
            //         ref={this.saveCreateFormRef}
            //         visible={this.state.confirmModalVisible}
            //         onCancel={this.closeForm}
            //         onSubmit={this.handleApplicationFormSubmit}
            //         selectOptions={options}
            //         data={this.state.transactionData}
            //     />
            //     <DepositModal
            //         ref={this.depositModalRef}
            //         visible={this.state.depositModalVisible}
            //         onCancel={this.closeDepositModal}
            //         data={this.state.transactionData}
            //         onSubmit={this.handleDepositSubmit}
            //     />
            //     <AmendationModal
            //         ref={this.amendationModalRef}
            //         visible={this.state.amendationModalVisible}
            //         onCancel={this.closeAmendationModal}
            //         data={this.state.transactionData}
            //         onSubmit={this.handleAmendSubmit}
            //     />
            //     <HandoverBillsModal
            //         visible={this.state.handoverBillModalVisible}
            //         onCancel={this.closeHandoverBillsModal}
            //         data={this.state.transactionData}
            //         onSubmit={this.handleHandoverBillSubmit}
            //         onBillChange={this.handleBillChange}
            //         onFileChange={this.handleFileChange}
            //     />
            //     <RetireBillModal
            //         ref={this.retireBillModalRef}
            //         visible={this.state.retireBillModalVisible}
            //         onCancel={this.closeRetireBillModal}
            //         data={this.state.transactionData}
            //         onSubmit={this.handleRetireBillSubmit}
            //     />
            //     <LCNoticeModal
            //         ref={this.LCNoticeModalRef}
            //         visible={this.state.LCNoticeModalVisible}
            //         onCancel={this.closeLcNoticeModal}
            //         data={this.state.transactionData}
            //         onSubmit={this.handleLcNoticeSubmit}
            //     />
            //     <DraftModal
            //         visible={this.state.draftModalVisible}
            //         onCancel={this.closeDraftModal}
            //         data={this.state.transactionData}
            //         onSubmit={this.closeDraftModal}
            //     />
            // </PageHeaderLayout>
            <PageHeaderLayout title="待办事项">
                <Tabs defaultActiveKey="1" onChange={this.tabsCallback} style={{ marginTop: '20px' }}>
                    <TabPane tab="信用证开证" key="1">
                        <Content style={{ background: '#fff', padding: 16, margin: 0, minHeight: 280 }}>
                            <Spin spinning={this.state.loading} delay={500} >{container}</Spin>
                        </Content>
                        <ConfirmDraftModal
                            ref={this.saveCreateFormRef}
                            visible={this.state.confirmModalVisible}
                            onCancel={this.closeForm}
                            onSubmit={this.handleApplicationFormSubmit}
                            selectOptions={options}
                            data={this.state.transactionData}
                        />
                        <DepositModal
                            ref={this.depositModalRef}
                            visible={this.state.depositModalVisible}
                            onCancel={this.closeDepositModal}
                            data={this.state.transactionData}
                            onSubmit={this.handleDepositSubmit}
                        />
                        <RetireBillModal
                            ref={this.retireBillModalRef}
                            visible={this.state.retireBillModalVisible}
                            onCancel={this.closeRetireBillModal}
                            data={this.state.transactionData}
                            onSubmit={this.handleRetireBillSubmit}
                        />
                        <LCNoticeModal
                            ref={this.LCNoticeModalRef}
                            visible={this.state.LCNoticeModalVisible}
                            onCancel={this.closeLcNoticeModal}
                            data={this.state.transactionData}
                            onSubmit={this.handleLcNoticeSubmit}
                        />
                        <DraftModal
                            visible={this.state.draftModalVisible}
                            onCancel={this.closeDraftModal}
                            data={this.state.transactionData}
                            onSubmit={this.closeDraftModal}
                        />
                    </TabPane>
                    <TabPane tab="信用证修改" key="2">
                        <Content style={{ background: '#fff', padding: 16, margin: 0, minHeight: 280 }}>
                            <Spin spinning={this.state.loadingLCModify} delay={500} >{container}</Spin>
                        </Content>
                        <AmendationModal
                            ref={this.amendationModalRef}
                            visible={this.state.amendationModalVisible}
                            onCancel={this.closeAmendationModal}
                            data={this.state.transactionData}
                            onSubmit={this.handleAmendSubmit}
                        />
                    </TabPane>
                    <TabPane tab="信用证交单" key="3">
                        <Content style={{ background: '#fff', padding: 16, margin: 0, minHeight: 280 }}>
                            <Spin spinning={this.state.loadingLCHandover} delay={500} >{container}</Spin>
                        </Content>
                        <HandoverBillsModal
                            visible={this.state.handoverBillModalVisible}
                            onCancel={this.closeHandoverBillsModal}
                            data={this.state.transactionData}
                            onSubmit={this.handleHandoverBillSubmit}
                            onBillChange={this.handleBillChange}
                            onFileChange={this.handleFileChange}
                        />
                    </TabPane>
                </Tabs>
            </PageHeaderLayout >
        )
    }
}

export default TodoList;
