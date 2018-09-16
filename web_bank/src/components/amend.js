import React from 'react'
import { Link, hashHistory, browserHistory } from 'react-router';
import { Timeline, Tag, Tabs, Row, Card, Layout, Breadcrumb, Collapse, InputNumber, Table, Icon, Steps, Form, Input, Select, Checkbox, DatePicker, Col, Radio, Button, Modal, Badge, Menu, Dropdown, message } from 'antd'

import { fetch_get, fetch_post } from '../common'
import * as CONSTANTS from '../constants'
import '../main.css'
import '../bank.css'

const { Header, Content, Sider } = Layout;
const Step = Steps.Step;
const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;
const { MonthPicker, RangePicker } = DatePicker;

const columns = [
    { title: CONSTANTS.LETTER_NUMBER, dataIndex: 'number', key: 'number' },
    { title: CONSTANTS.AMEND_TIMES, key: 'times', dataIndex: 'times' },
    { title: CONSTANTS.AMEND_STATUS, key: 'status', dataIndex: 'status', render: (text, record) => <Tag>{record.status}</Tag> },
    { title: CONSTANTS.LETTER_APPLICANT, dataIndex: 'applicant', key: 'applicant' },
    { title: CONSTANTS.LETTER_BENEFICIARY, dataIndex: 'beneficiary', key: 'beneficiary' },
    { title: CONSTANTS.LETTER_AMOUNT, dataIndex: 'amount', key: 'amount' },
    { title: CONSTANTS.COMM_OPERATION, key: 'operation', render: (text, record, index) => renderAction(record) }
];

var renderAction = function (params) { 
    return (<a href={'/#/amendpayment/issuing/' + params.no + "/" + params.amendno}>{CONSTANTS.COMM_DETAILIS}</a>);

    // switch (params.status) {
    //     case "开证行审批":            
    //     case "通知行审批":          
    //     case "受益人审批":           
    //     case "结束":
    //     return (<a href={'/#/amendpayment/issuing/' + params.no + "/" + params.amendno}>{CONSTANTS.COMM_DETAILIS}</a>);
    // }
}



class Letters extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            bordered: false,
            pagination: true,
            showHeader: true,
            display: false,
            creaeDraftFromVisible: false,
            letters: []
        }
    }

    handleLetters = (data) => {
        const letters = [];
        var index = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i].amend != null) {
                for (let j = 0; j < data[i].amend.length; j++) {
                    // alert("data: "+ JSON.stringify(data[i].amend[j]));                   
                    letters.push({
                        key: index++,
                        no: data[i].id,
                        amendno: data[i].amend[j].amendNo,
                        number: data[i].LCNumbers === "" ? "当前未生成" : data[i].LCNumbers,
                        times: data[i].amend[j].amendTimes,
                        status: CONSTANTS.AMEND_STEP[data[i].amend[j].Status],
                        applicant: data[i].applicant,
                        beneficiary: data[i].beneficiary,
                        amount: data[i].amount + " " + data[i].currency,
                    })
                }
            }
        }

        this.setState({
            letters: letters,
        });
    }

    componentDidMount = () => {
        this.getTxsData();
    }

    getTxsData = () => {
        fetch_get("/api/bank/transaction/" + sessionStorage.getItem("bankno"))
            .then((res) => {
                if (res.status >= 200 && res.status < 300) {
                    res.json().then((data) => {
                        this.handleLetters(data);
                    });
                }
            });
    }

    render() {
        return (
            <Layout style={{ padding: '0 1px 1px' }}>
                <Breadcrumb style={{ padding: '12px 16px', height: '42px', background: '#F3F1EF' }}>
                    <Breadcrumb.Item>{CONSTANTS.AMEND_TITLE}</Breadcrumb.Item>
                </Breadcrumb>
                <Content style={{ background: '#fff', padding: 0, margin: 0, minHeight: 280 }}>

                    <div style={{ margin: '12px 16px' }}>
                        <Table
                            className="components-table-demo-nested"
                            columns={columns}
                            dataSource={this.state.letters}
                        />
                    </div>
                </Content>
            </Layout>
        )
    }
}

export default Letters
