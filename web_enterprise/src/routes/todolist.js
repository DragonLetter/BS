import React from 'react'
import { fetch_get, request, getFileUploadOptions } from '../utils/common';
import { List, Spin, Card, Layout, Select, message, Tabs, Row, Col } from 'antd'
import PageHeaderLayout from '../layouts/PageHeaderLayout';
import ConfirmDraftModal from '../modals/ConfirmDraftModal';
import DepositModal from '../modals/DepositModal';
import RetireBillModal from '../modals/RetireBillModal';
import LCNoticeModal from '../modals/LCNoticeModal';
import DraftModal from '../modals/DraftModal';
import CheckBillsModal from '../modals/CheckBillsModal';
import AmendOperations from '../modals/AmendOperations';
import AmendDetailModal from '../modals/AmendDetailModal';

const constants = require("./constant");
const { Header, Content, Sider } = Layout;
const Option = Select.Option

class TodoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,  // 信用证数据是否已经加载
            confirmModalVisible: false,
            depositModalVisible: false,
            amendationModalVisible: false,
            retireBillModalVisible: false,
            LCNoticeModalVisible: false,
            draftModalVisible: false,
            draftModifyModalVisible: false,
            draftHandoverModalVisible: false,
            checkBillModalVisible: false,
            transactions: [],
            handoverTrans: [],
            modifyTrans: [],
            lcTransData: null,
            lcModifyTransData: null,
            lcHandoverTransData: null,
            corps: [],
            amendInfo: [],
            selectType: 'lcAll',
        }
    }

    // 获取数据相关函数
    componentDidMount = () => {
        this.getTransInfo();
    }

    getTransInfo = () => {
        var userId = sessionStorage.getItem("userId");
        if (null == userId) {
            fetch_get("/api/user/current").then((res) => {
                if (res.status >= 200 && res.status < 300) {
                    res.json().then((data) => {
                        userId = sessionStorage.getItem("userId");
                        if (null == userId) {
                            sessionStorage.setItem("userId", data.corp.id);
                            sessionStorage.setItem("user", data.username);
                            sessionStorage.setItem("domain", data.domain);
                            sessionStorage.setItem("corp", data.corp.name);
                            userId = sessionStorage.getItem("userId");
                        }
                        request("/api/transaction/corp/processing/" + userId)
                            .then((data) => {
                                this.handleTransInfo(data);
                            });
                    });
                }
            });
        } else {
            request("/api/transaction/corp/processing/" + userId)
                .then((data) => {
                    this.handleTransInfo(data);
                });
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
        const handoverTrans = [];
        const modifyTrans = [];
        var userId = sessionStorage.getItem("userId");
        for (let i = 0; i < data.length; i++) {
            // 获取申请人ID和受益人ID
            var applicantID = data[i].Record.LetterOfCredit.Applicant.No;
            var beneficiaryID = data[i].Record.LetterOfCredit.Beneficiary.No;
            // 信用证流程数据
            if ((constants.APPLICANT_PROCESSING_STEPS.includes(data[i].Record.CurrentStep) && userId == applicantID)
                || (constants.BENEFICIARY_PROCESSING_STEPS.includes(data[i].Record.CurrentStep) && userId == beneficiaryID)) {
                transactions.push({
                    id: data[i].Key,
                    lcNo: data[i].Record.lcNo || "尚未获得信用证编号",
                    applicant: data[i].Record.ApplicationForm.Applicant.Name,
                    beneficiary: data[i].Record.LetterOfCredit.Beneficiary.Name,
                    amount: data[i].Record.LetterOfCredit.amount,
                    status: data[i].Record.CurrentStep,
                    applyTime: data[i].Record.LetterOfCredit.applyTime.split("T")[0],
                    detail: data[i]
                })
            }

            // 信用证交单流程数据，只有进入 申请人审单状态 才有数据
            if (constants.APPLICANT_HANDOVER_PROCESSING_STEPS.includes(data[i].Record.CurrentStep) &&
                data[i].Record.LCTransDocsReceive) {
                for (let j = 0; j < data[i].Record.LCTransDocsReceive.length; j++) {
                    // 申请人处理交单后的审单
                    if (data[i].Record.LCTransDocsReceive[j].HandOverBillStep == constants.LC_HANDOVER_STEPS.ApplicantAcceptOrRejectStep
                        && userId == applicantID) {
                        handoverTrans.push({
                            id: data[i].Key,
                            lcNo: data[i].Record.lcNo || "尚未获得信用证编号",
                            billNo: data[i].Record.LCTransDocsReceive[j].No,
                            applicant: data[i].Record.ApplicationForm.Applicant.Name,
                            beneficiary: data[i].Record.LetterOfCredit.Beneficiary.Name,
                            amount: data[i].Record.LetterOfCredit.amount,
                            status: data[i].Record.CurrentStep,
                            applyTime: data[i].Record.LetterOfCredit.applyTime.split("T")[0],
                            detail: data[i],
                            billDetail: data[i].Record.LCTransDocsReceive[j],
                        })
                    }
                }
            }

            // 信用证修改流程数据
            var index = 0;
            if (constants.AMEND_PROCESSING_STEPS.includes(data[i].Record.CurrentStep) &&
                data[i].Record.AmendFormFlow) {
                for (let j = 0; j < data[i].Record.AmendFormFlow.length; j++) {
                    // 只有受益人有信用证修改处理流程
                    if (data[i].Record.AmendFormFlow[j].Status == constants.LC_MODIFY_STEPS.AmendBeneficiaryAcceptStep &&
                        userId == beneficiaryID) {
                        modifyTrans.push({
                            key: index,
                            id: data[i].Key,
                            amendNo: data[i].Record.AmendFormFlow[j].amendNo,
                            lcNo: data[i].Record.lcNo || "尚未获得信用证编号",
                            times: data[i].Record.AmendFormFlow[j].amendTimes,
                            applicant: data[i].Record.ApplicationForm.Applicant.Name,
                            beneficiary: data[i].Record.LetterOfCredit.Beneficiary.Name,
                            amount: data[i].Record.LetterOfCredit.amount,
                            status: data[i].Record.CurrentStep,
                            state: constants.AMEND_STEP[data[i].Record.AmendFormFlow[j].Status],
                            applyTime: data[i].Record.LetterOfCredit.applyTime.split("T")[0],
                            detail: data[i],
                            amendDetail: data[i].Record.AmendFormFlow[j]
                        })
                        index++;
                    }
                }
            }
        }

        this.setState({
            transactions: transactions,
            handoverTrans: handoverTrans,
            modifyTrans: modifyTrans,
            loading: false,
        });
    }

    // 申请人保存信用证表单相关函数
    saveCreateFormRef = (form) => {
        this.createForm = form;
    }

    handleApplicationFormSubmit = () => {
        this.setState({
            loading: true,
            confirmModalVisible: false,
        })
        var data = {};
        data.id = this.state.lcTransData.id;
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

    closeForm = () => {
        this.setState({
            confirmModalVisible: false,
        });
    }

    // 申请人填写保证金相关函数
    depositModalRef = (form) => {
        this.depositForm = form;
    }

    handleDepositSubmit = () => {
        let form = this.depositForm;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            // 判断已付金额是否合法
            var depositAmount = parseInt(this.state.lcTransData.detail.Record.LCTransDeposit.depositAmount);
            if (parseInt(values.commitAmount) > depositAmount) {
                message.error("已付金额不能超过应付金额:" + depositAmount + "!");
                return;
            }

            values.no = this.state.lcTransData.id;
            request('/api/letterOfCredit/deposit', {
                method: "POST",
                body: values,
            }).then((data) => {
                message.success("提交保证金成功!");
                this.getTransInfo();
                this.setState({
                    depositModalVisible: false,
                });
            })
        });
    }

    closeDepositModal = () => {
        this.setState({
            depositModalVisible: false,
        });
    }

    // 申请人付款相关函数
    retireBillModalRef = (form) => {
        this.retireBillForm = form;
    }

    handleRetireBillSubmit = () => {
        let form = this.retireBillForm;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            values.no = this.state.lcTransData.id;
            request('/api/letterOfCredit/retire', {
                method: "POST",
                body: values,
            }).then((data) => {
                message.success("付款成功!");
                this.getTransInfo();
                this.setState({
                    retireBillModalVisible: false,
                });
            })
        });
    }

    closeRetireBillModal = () => {
        this.setState({
            retireBillModalVisible: false,
        });
    }

    // 受益人审单相关函数
    LCNoticeModalRef = (form) => {
        this.lcNoticeForm = form;
    }

    handleLcNoticeSubmit = () => {
        let form = this.lcNoticeForm;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values.no = this.state.lcTransData.id;
            values.isAgreed += '';
            request('/api/LetterofCredit/beneficiaryHandle', {
                method: "POST",
                body: values,
            }).then((data) => {
                message.success("处理成功!");
                this.getTransInfo();
                this.setState({
                    LCNoticeModalVisible: false,
                })
            }).catch((error) => {
                message.error("处理失败！");
                this.setState({
                    LCNoticeModalVisible: false,
                });
            })
        });
    }

    closeLcNoticeModal = () => {
        this.setState({
            LCNoticeModalVisible: false,
        });
    }

    // 查看详情相关函数
    showDetail = (type, transaction) => {
        if (1 == type) {
            this.setState({
                lcTransData: transaction,
                draftModalVisible: true
            });
        } else if (2 == type) {
            this.setState({
                lcModifyTransData: transaction,
                draftModifyModalVisible: true
            });
        } else if (3 == type) {
            this.setState({
                lcHandoverTransData: transaction,
                draftHandoverModalVisible: true
            });
        }
    }

    closeDraftModal = () => {
        this.setState({
            draftModalVisible: false,
            draftModifyModalVisible: false,
            draftHandoverModalVisible: false
        });
    }

    // 信用证修改相关函数
    amendationModalRef = (form) => {
        this.amendInfo = form;
    }

    handleAmendSubmit = () => {
        let form = this.amendInfo;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            values.no = this.state.lcModifyTransData.id;
            values.amendNo = this.state.lcModifyTransData.amendNo;
            values.isAgreed += '';
            // alert(JSON.stringify(values));
            request('/api/LetterofCredit/beneficiaryLetterOfAmend', {
                method: "POST",
                body: values,
            }).then((data) => {
                message.success("修改成功!");
                this.getTransInfo();
                this.setState({
                    amendationModalVisible: false,
                })
            }).catch((error) => {
                message.error("处理失败！");
                this.setState({
                    amendationModalVisible: false,
                })
            })
        });
    }

    closeAmendationModal = () => {
        this.setState({
            amendationModalVisible: false,
        });
    }

    // 信用证交单处理函数
    checkBillsModalRef = (form) => {
        this.checkBillsForm = form;
    }

    acceptCheckBills = () => {
        let form = this.checkBillsForm;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            let req = {};
            req.lcNo = this.state.lcHandoverTransData.id;
            req.billNo = this.state.lcHandoverTransData.billNo;
            req.suggestion = values.suggestion;
            req.isAgreed = values.isAgreed + '';
            request('/api/LetterofCredit/appliciantCheckBills', {
                method: "POST",
                body: req,
            }).then((data) => {
                message.success("处理成功!");
                this.getTransInfo();
                this.setState({
                    checkBillModalVisible: false,
                });
            }).catch((error) => {
                message.error("处理失败！");
                this.setState({
                    checkBillModalVisible: false,
                });
            })
        });
    }

    cancelCheckBills = () => {
        this.setState({
            checkBillModalVisible: false,
        })
    }

    // 设置信用证开证、信用证修改、信用证交单三类
    getContainer = (type) => {
        var listLC = this.state.transactions,
            listLCAmend = this.state.modifyTrans,
            listLCHandover = this.state.handoverTrans,
            container = [],
            index = 0;

        // 没有任何事件显示
        if (('lcAll' == type && 0 == listLC.length && 0 == listLCAmend.length && 0 == listLCHandover.length) ||
            ('lcCommon' == type && 0 == listLC.length) ||
            ('lcAmend' == type && 0 == listLCAmend.length) ||
            ('lcHandover' == type && 0 == listLCHandover.length)) {
            return (
                <Content style={{ background: '#fff', padding: 16, margin: 0, minHeight: 280 }}>
                    <Spin spinning={this.state.loading} delay={500} >
                        {/* <List.Item key={item.id}><span>暂无任何待处理事件</span></List.Item></Spin> */}
                        <span>暂无任何待处理事件</span></Spin>
                </Content>
            );
        }

        // 1:信用证流程
        if (('lcAll' == type || 'lcCommon' == type) &&
            (0 < listLC.length)) {
            container[index] = (
                <Content style={{ background: '#fff', padding: 16, margin: 0, minHeight: 280 }}>
                    <Spin spinning={this.state.loading} delay={500} >
                        <div>
                            <List
                                rowKey="id"
                                grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
                                dataSource={listLC.length === 0 ? [{ "id": 0, title: "", description: "" }] : [...listLC]}
                                renderItem={
                                    item => (
                                        <List.Item key={item.id}>
                                            <Card title={item.lcNo}
                                                actions={[<a onClick={() => this.showDetail(1, item)}>查看详情</a>, <a onClick={() => this.handleTransaction(1, item)}>立即处理</a>]}>
                                                <span style={{ display: "block" }}>申请人：{item.applicant}</span>
                                                <span style={{ display: "block" }}>受益人：{item.beneficiary}</span>
                                                <span style={{ display: "block" }}>开证金额：{item.amount}</span>
                                                <span style={{ display: "block" }}>申请时间：{item.applyTime}</span>
                                                <span style={{ display: "block" }}>当前状态：{item.status}</span>
                                            </Card>
                                        </List.Item>
                                    )}
                            />
                        </div>
                    </Spin>
                </Content>
            );
            index++;
        }

        // 2:信用证修改
        if (('lcAll' == type || 'lcAmend' == type) &&
            (0 < listLCAmend.length)) {
            container[index] = (
                <Content style={{ background: '#fff', padding: 16, margin: 0, minHeight: 280 }}>
                    <Spin spinning={this.state.loading} delay={500} >
                        <div>
                            <List
                                rowKey="id"
                                grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
                                dataSource={listLCAmend.length === 0 ? [{ "id": 0, title: "", description: "" }] : [...listLCAmend]}
                                renderItem={
                                    item => (
                                        <List.Item key={item.id}>
                                            <Card title={item.lcNo}
                                                actions={[<a onClick={() => this.showDetail(2, item)}>查看详情</a>, <a onClick={() => this.handleTransaction(2, item)}>修改审核</a>]}>
                                                <span style={{ display: "block" }}>申请人：{item.applicant}</span>
                                                <span style={{ display: "block" }}>受益人：{item.beneficiary}</span>
                                                <span style={{ display: "block" }}>开证金额：{item.amount}</span>
                                                <span style={{ display: "block" }}>申请时间：{item.applyTime}</span>
                                                <span style={{ display: "block" }}>当前状态：{item.status}</span>
                                            </Card>
                                        </List.Item>
                                    )}
                            />
                        </div>
                    </Spin>
                </Content>
            );
            index++;
        }

        // 3:信用证交单
        if (('lcAll' == type || 'lcHandover' == type) &&
            (0 < listLCHandover.length)) {
            container[index] = (
                <Content style={{ background: '#fff', padding: 16, margin: 0, minHeight: 280 }}>
                    <Spin spinning={this.state.loading} delay={500} >
                        <div>
                            <List
                                rowKey="id"
                                grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
                                dataSource={listLCHandover.length === 0 ? [{ "id": 0, title: "", description: "" }] : [...listLCHandover]}
                                renderItem={
                                    item => (
                                        <List.Item key={item.id}>
                                            <Card title={<span> {item.lcNo}---交单号:{item.billNo} </span>}
                                                actions={[<a onClick={() => this.showDetail(3, item)}>查看详情</a>, <a onClick={() => this.handleTransaction(3, item)}>申请人审单</a>]}>
                                                <span style={{ display: "block" }}>申请人：{item.applicant}</span>
                                                <span style={{ display: "block" }}>受益人：{item.beneficiary}</span>
                                                <span style={{ display: "block" }}>开证金额：{item.amount}</span>
                                                <span style={{ display: "block" }}>申请时间：{item.applyTime}</span>
                                                <span style={{ display: "block" }}>当前状态：{item.status}</span>
                                            </Card>
                                        </List.Item>
                                    )}
                            />
                        </div>
                    </Spin>
                </Content >
            );
            index++;
        }

        return container;
    }

    handleTransaction = (type, transaction) => {
        // 1:信用证流程 2:信用证修改 3:信用证交单
        if (1 == type) {
            this.setState({
                lcTransData: transaction,
            });
            switch (transaction.status) {
                case constants.LC_STEPS.ApplicantSaveLCApplyFormStep:
                    this.setState({
                        confirmModalVisible: true,
                    });
                    break;
                case constants.LC_STEPS.ApplicantFillLCDraftStep:
                    this.setState({
                        depositModalVisible: true,
                    });
                    break;
                case constants.LC_STEPS.BeneficiaryReceiveLCStep:
                    this.setState({
                        LCNoticeModalVisible: true,
                    });
                    break;
                case constants.LC_STEPS.ApplicantRetireBillsStep:
                    this.setState({
                        retireBillModalVisible: true,
                    });
                    break;
            }
        } else if (2 == type) {
            this.setState({
                lcModifyTransData: transaction,
            });
            // 信用证修改流程
            if (constants.AMEND_PROCESSING_STEPS.includes(transaction.status)) {
                this.setState({
                    amendationModalVisible: true,
                });
            }
        } else if (3 == type) {
            this.setState({
                lcHandoverTransData: transaction,
            });
            // 信用证交单流程
            if (constants.APPLICANT_HANDOVER_PROCESSING_STEPS.includes(transaction.status)) {
                this.setState({
                    checkBillModalVisible: true,
                });
            }
        }
    }

    onSelectChange = (value) => {
        // 重新获取数据
        this.getTransInfo();
        this.setState({
            loading: false,
            selectType: value,
        });
    }

    render() {
        const options = this.state.corps.map(corp => <Option key={corp.id}>{corp.name}</Option>);
        const container = this.getContainer(this.state.selectType);

        return (
            <PageHeaderLayout title="待办事项">
                <Select style={{ width: 200, marginBottom:20 }} defaultValue='lcAll' onChange={(value) => { this.onSelectChange(value) }}>
                    <Option value="lcAll" >全部</Option>
                    <Option value="lcCommon">信用证开证</Option>
                    <Option value="lcAmend">信用证修改</Option>
                    <Option value="lcHandover">信用证交单</Option>
                </Select>
                {container}
                <ConfirmDraftModal
                    ref={this.saveCreateFormRef}
                    selectOptions={options}
                    visible={this.state.confirmModalVisible}
                    data={this.state.lcTransData}
                    onSubmit={this.handleApplicationFormSubmit}
                    onCancel={this.closeForm}
                />
                <DepositModal
                    ref={this.depositModalRef}
                    visible={this.state.depositModalVisible}
                    data={this.state.lcTransData}
                    onSubmit={this.handleDepositSubmit}
                    onCancel={this.closeDepositModal}
                />
                <RetireBillModal
                    ref={this.retireBillModalRef}
                    visible={this.state.retireBillModalVisible}
                    data={this.state.lcTransData}
                    onSubmit={this.handleRetireBillSubmit}
                    onCancel={this.closeRetireBillModal}
                />
                <LCNoticeModal
                    ref={this.LCNoticeModalRef}
                    visible={this.state.LCNoticeModalVisible}
                    data={this.state.lcTransData}
                    onSubmit={this.handleLcNoticeSubmit}
                    onCancel={this.closeLcNoticeModal}
                />
                <AmendOperations
                    ref={this.amendationModalRef}
                    visible={this.state.amendationModalVisible}
                    data={this.state.lcModifyTransData}
                    onOk={this.handleAmendSubmit}
                    onCancel={this.closeAmendationModal}
                />
                <CheckBillsModal
                    ref={this.checkBillsModalRef}
                    visible={this.state.checkBillModalVisible}
                    data={this.state.lcHandoverTransData}
                    onOk={this.acceptCheckBills}
                    onCancel={this.cancelCheckBills}
                />
                <DraftModal
                    visible={this.state.draftModalVisible}
                    data={this.state.lcTransData}
                    onSubmit={this.closeDraftModal}
                    onCancel={this.closeDraftModal}
                />
                <AmendDetailModal
                    visible={this.state.draftModifyModalVisible}
                    data={this.state.lcModifyTransData}
                    onSubmit={this.closeDraftModal}
                    onCancel={this.closeDraftModal}
                />
                <DraftModal
                    visible={this.state.draftHandoverModalVisible}
                    data={this.state.lcHandoverTransData}
                    onSubmit={this.closeDraftModal}
                    onCancel={this.closeDraftModal}
                />
            </PageHeaderLayout >
        )
    }
}

export default TodoList;
