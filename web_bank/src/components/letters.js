import React from 'react'
import { Link, hashHistory, browserHistory} from 'react-router';
import {Timeline, Tag, Tabs, Row, Card, Layout, Breadcrumb, Collapse, InputNumber, Table, Icon, Steps, Form, Input, Select, Checkbox, DatePicker, Col, Radio, Button, Modal, Badge, Menu, Dropdown, message} from 'antd'

import {fetch_get, fetch_post} from '../common'
import * as CONSTANTS from '../constants'
import '../main.css'
import '../bank.css'

const { Header, Content, Sider } = Layout;
const Step = Steps.Step;
const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;
const { MonthPicker, RangePicker } = DatePicker;

const columns = [
    { title: CONSTANTS.COMM_OPERATION, key: 'operation', render: (text, record, index) => renderAction(record)},
    { title: CONSTANTS.LETTER_NUMBER, dataIndex: 'number', key: 'number' },
    { title: CONSTANTS.LETTER_STATUS, key: 'status', dataIndex: 'status', render: (text, record) => <Tag>{ record.status }</Tag>},
    { title: CONSTANTS.LETTER_APPLICANT, dataIndex: 'applicant', key: 'applicant' },
    { title: CONSTANTS.LETTER_BENEFICIARY, dataIndex: 'beneficiary', key: 'beneficiary' },
    { title: CONSTANTS.LETTER_AMOUNT, dataIndex: 'amount', key: 'amount' },
    { title: CONSTANTS.LETTER_APPLICANT_DATE, dataIndex: 'createdAt', key: 'createdAt', render: (text, record) => <span>{record.createdAt.substr(0, record.createdAt.indexOf('T'))}</span> }
  ];

var renderAction = function(params) {
    switch(params.status){
        case "银行确认":
            return (<a href={'/#/lcpayment/draft/' + params.key}>{ CONSTANTS.COMM_DETAILIS }</a>);
        case "银行发证":
            return (<a href={'/#/lcpayment/original/' + params.key}>{ CONSTANTS.COMM_DETAILIS }</a>);
        case "通知行收到信用证通知":
            return (<a href={'/#/lcpayment/advising/' + params.key}>{ CONSTANTS.COMM_DETAILIS }</a>);  
        case "发证行承兑或拒付":
            return (<a href={'/#/lcpayment/acceptance/' + params.key}>{ CONSTANTS.COMM_DETAILIS }</a>);
        case "通知行审核交单信息":
            return (<a href={'/#/lcpayment/acceptancebyadvisingbank/' + params.key}>{ CONSTANTS.COMM_DETAILIS }</a>);
        case "受益人接收信用证":
            return (<a href={'/#/lcpayment/original/' + params.key}>{ CONSTANTS.COMM_DETAILIS }</a>);
        case "申请人赎单":
            return (<a href={'/#/lcpayment/original/' + params.key}>{ CONSTANTS.COMM_DETAILIS }</a>);     
        case "开证行审核赎单":
            return (<a href={'/#/lcpayment/closing' + params.key}>{ CONSTANTS.COMM_DETAILIS }</a>);
    }
}

class Letters extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            bordered : false,
            pagination: true,
            showHeader: true,
            display: false,
            creaeDraftFromVisible: false,
            letters: []
        }
    }

    handleLetters = (data) => {
        const letters = [];
        for(let i = 0; i < data.length; i++){
            letters.push({
                key: data[i].id,
                number: data[i].LCNumbers === "" ? "当前未生成" : data[i].LCNumbers,
                applicant: data[i].applicant,
                beneficiary: data[i].beneficiary,
                issuingbank: data[i].issuingBank,
                advisingbank: data[i].advisingBank,
                amount: data[i].amount + " " + data[i].currency,
                status: data[i].status,
                createdAt: data[i].issuseDate                              
            })
        }

        this.setState({
            letters: letters,
        });
    }

    componentDidMount = () => {
        fetch_get("/api/bank/transaction/" + sessionStorage.getItem("bankno"))
        .then((res) => {
            if(res.status >= 200 && res.status < 300){
                res.json().then((data) => {
                    this.handleLetters(data);
                });
            }
            else
            {
                this.setState({
                    letters:[],
                });
            }
        });
    }

    render(){
        return (
            <Layout style={{ padding: '0 1px 1px' }}>
                <Breadcrumb style={{ padding: '12px 16px', height:'42px', background:'#F3F1EF' }}>
                    <Breadcrumb.Item>{CONSTANTS.DOMESTIC_LC}</Breadcrumb.Item>
                </Breadcrumb>
                <Content style={{ background: '#fff', padding: 0, margin: 0, minHeight: 280 }}>
                    <div style={{margin: '12px 16px'}}>
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
