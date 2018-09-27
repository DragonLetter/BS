import React from 'react';
import PDF from 'react-pdf-js';
import { Popconfirm, Upload, Row, Layout, Breadcrumb, Collapse, InputNumber, Table, Badge, Timeline, Icon, Steps, Form, Input, Select, Checkbox, DatePicker, Col, Radio, Button, Modal, message } from 'antd';
import { fetch_get, fetch_post, request, getFileUploadOptions } from '../utils/common';
import AmendDetailModal from '../modals/AmendDetailModal';
import HandoverBillsModal from '../modals/HandoverBillsModal';
import PageHeaderLayout from '../layouts/PageHeaderLayout';

const constants = require("./constant");
const { Header, Content, Sider } = Layout;
const Step = Steps.Step;
const Panel = Collapse.Panel;
const InputGroup = Input.Group;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;

let contract = {}, attachments = [], formValues, No;


class Amend extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            bordered: false,
            pagination: true,
            showHeader: true,
            display: false,
            AmendDetailModalVisible: false,
            Amends: [],
            banks: [],
            signedbanks: [],
            corporations: [],
            Record: null,
            LCData: [],
            loading: true,

        }
    }

    componentDidMount = () => {
        const userId = sessionStorage.getItem("userId");
        request("/api/ApplicationForm/FindByCorp/" + userId)
            .then((data) => {
                this.handleAmendInfo(data);
                this.setState({
                    loading: false,
                });
            });


    }

    handleAmendInfo = (data) => {
        const amends = [];
        var index = 0;
        No = "";
        // alert(JSON.stringify(data));
        for (let i = 0; i < data.length; i++) {
            if (data[i].Record.AmendFormFlow != null) {
                for (let j = 0; j < data[i].Record.AmendFormFlow.length; j++) {
                    // alert("data: "+ JSON.stringify(data[i].Record.AmendFormFlow[j]));                   
                    amends.push({
                        key: index,
                        id: data[i].Key,
                        amendno: data[i].Record.AmendFormFlow[j].amendNo,
                        lcNo: data[i].Record.lcNo || "等待银行审核",
                        times: data[i].Record.AmendFormFlow[j].amendTimes,
                        beneficiary: data[i].Record.ApplicationForm.Beneficiary.Name,
                        applicant: data[i].Record.ApplicationForm.Applicant.Name,
                        amount: data[i].Record.ApplicationForm.amount,
                        state: constants.AMEND_STEP[data[i].Record.AmendFormFlow[j].Status],    
                        detail: data[i],
                        amendDetail: data[i].Record.AmendFormFlow[j]                   
                    })
                    index++;
                }
               
            }
                     
        }
        this.setState({
            Amends: amends,
            LCData: data,
        });
    }


    showDetailModal = (record, text) => {
        this.setState({
            Record: record,
            AmendDetailModalVisible: true,
        })
    }


    closeAmendDetailModal = () => {
        this.setState({
            AmendDetailModalVisible: false,
        });
    }


    render = () => {
        const columns = [
            { title: '信用证编号', dataIndex: 'lcNo', key: 'lcNo' },
            { title: '修改次数', dataIndex: 'times', key: 'times' },
            { title: '申请人', dataIndex: 'applicant', key: 'applicant' },
            { title: '受益人', dataIndex: 'beneficiary', key: 'beneficiary' },
            { title: '开证金额', dataIndex: 'amount', key: 'amount' },
            { title: '当前进度', dataIndex: 'state', key: 'state' },
            // { title: '发起日期', dataIndex: 'applyTime', key: 'applyTime' },

            {
                title: '操作',
                dataIndex: 'id',
                key: 'id',
                render: (text, record, index) => {
                    return (
                        <span>
                            <a onClick={() => this.showDetailModal(record, text)}>详情  </a>
                        </span>
                    )
                }
            },
        ];
        const bankOptions = this.state.signedbanks.map(bank => <Option key={bank.info.bank.id}>{bank.info.bank.name}</Option>),
            corpOptions = this.state.corporations.map(corporation => <Option key={corporation.id}>{corporation.name}</Option>);
        return (
            <PageHeaderLayout title="国内信用证修改">
                <Content style={{ background: '#fff', padding: 10, margin: 0, minHeight: 280 }}>
                    <div style={{ marginBottom: '12px' }}>
                        <Table
                            className="components-table-demo-nested"
                            columns={columns}
                            dataSource={this.state.Amends}
                            {...this.state}
                        />
                    </div>
                </Content>
                <AmendDetailModal
                    //ref={this.saveFormRef}
                    visible={this.state.AmendDetailModalVisible}
                    onCancel={this.closeAmendDetailModal}
                    data={this.state.Record}
                    onSubmit={this.closeAmendDetailModal}
                />

            </PageHeaderLayout>
        )
    }
}

export default Amend;
