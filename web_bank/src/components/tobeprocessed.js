import React from 'react'
import { Link, hashHistory } from 'react-router';
import { Timeline, Tag, Tabs, Row, Card, Layout, Breadcrumb, Collapse, InputNumber, Table, Icon, Steps, Form, Input, Select, Checkbox, DatePicker, Col, Radio, Button, Modal, Badge, Menu, Dropdown, message } from 'antd'

import { fetch_get, fetch_post } from '../common'
import * as CONSTANTS from '../constants'
import '../main.css'
import '../bank.css'
import { isMoment } from 'moment';

const { Header, Content, Sider } = Layout;
const Step = Steps.Step;
const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;
const { MonthPicker, RangePicker } = DatePicker;

const columns = [
    { title: CONSTANTS.LETTER_NUMBER, dataIndex: 'number', key: 'number' },
    { title: CONSTANTS.LETTER_STATUS, key: 'status', width: '10%', render: (text, record) => <Tag color="green">{record.status}</Tag> },
    { title: CONSTANTS.LETTER_APPLICANT, dataIndex: 'applicant', key: 'applicant' },
    { title: CONSTANTS.LETTER_BENEFICIARY, dataIndex: 'beneficiary', key: 'beneficiary' },
    { title: CONSTANTS.LETTER_AMOUNT, dataIndex: 'amount', key: 'amount' },
    // { title: CONSTANTS.LETTER_APPLICANT_DATE, dataIndex: 'createdAt', key: 'createdAt', render: (text, record) => <span>{record.createdAt.substr(0, record.createdAt.indexOf('+')).replace('T', ' ')}</span> },
    { title: CONSTANTS.LETTER_APPLICANT_DATE, dataIndex: 'createdAt', key: 'createdAt', render: (text, record) => <span>{record.createdAt.substr(0, record.createdAt.indexOf('T'))}</span> },
    { title: CONSTANTS.COMM_OPERATION, key: 'operation', render: (text, record, index) => renderAction(record) },
];

var renderAction = function (params) {
    switch (params.status) {
        case "填写信用证草稿":
            return (<a href={'/#/lcpayment/draft/' + params.key}>{CONSTANTS.COMM_DETAILIS}</a>);
        case "银行确认":
            return (<a href={'/#/lcpayment/draft/' + params.key}>{CONSTANTS.COMM_DETAILIS}</a>);
        case "银行发证":
            return (<a href={'/#/lcpayment/original/' + params.key}>{CONSTANTS.COMM_DETAILIS}</a>);
        case "通知行收到信用证通知":
            return (<a href={'/#/lcpayment/advising/' + params.key}>{CONSTANTS.COMM_DETAILIS}</a>);
        case "发证行承兑或拒付":
            return (<a href={'/#/lcpayment/acceptance/' + params.key}>{CONSTANTS.COMM_DETAILIS}</a>);
        case "通知行审核交单信息":
            return (<a href={'/#/lcpayment/acceptancebyadvisingbank/' + params.key}>{CONSTANTS.COMM_DETAILIS}</a>);
        case "申请人付款":
            return (<a href={'/#/lcpayment/billtransact/' + params.key}>{CONSTANTS.COMM_DETAILIS}</a>);
        case "开证行审核付款":
            return (<a href={'/#/lcpayment/redemption/' + params.key}>{CONSTANTS.COMM_DETAILIS}</a>);
        case "闭卷":
            return (<a href={'/#/lcpayment/closing/' + params.key}>{CONSTANTS.COMM_DETAILIS}</a>);
        case "发起修改":
            return (<a href={'/#/amendpayment/detail/' + params.no + "/" + params.amendno}>{CONSTANTS.COMM_DETAILIS}</a>);
    }
}

const CheckableTag = Tag.CheckableTag;
const tagsFromServer = [
    "企业申请",
    "草稿审核",
    "正本开立",
    "正本修改",
    "会签",
    "交单",
    "承兑",
    "付款",
    "拒付",
    "闭卷"
];
var status_value = "";
class HotTags extends React.Component {
    state = {
        selectedTags: [],
    };

    handleChange(tag, checked) {
        //   const { selectedTags } = this.state;
        //   const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
        //   this.setState({ selectedTags: nextSelectedTags });          
        //   this.props.handleSelectedTags(nextSelectedTags);
        const { selectedTags } = this.state;
        if (status_value == tag) {
            status_value = "";
            checked = false;
        }
        else {
            status_value = tag;
            checked = true;
        }

        this.setState({ selectedTags: status_value });
        this.props.handleSelectedTags(status_value);
    }

    render() {
        const { selectedTags } = this.state;
        return (
            <div>
                <strong style={{ marginRight: 18 }}>{CONSTANTS.COMM_SELECT_TYPE}</strong>
                {tagsFromServer.map(tag => (
                    <CheckableTag
                        key={tag}
                        checked={selectedTags.indexOf(tag) > -1}
                        onChange={checked => this.handleChange(tag, checked)}
                    >
                        {tag}
                    </CheckableTag>
                ))}
            </div>
        );
    }
}

class TobeProcessed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            bordered: false,
            pagination: true,
            showHeader: true,
            display: false,
            creaeDraftFromVisible: false,
            letters: [],
            tags: null,
            dateRanges: null,
            items: []
        }
    }

    expandedRowRender = (record) => {
        if (record.flag == "0") {
            alert("正本")
            fetch_get("/api/bank/transaction/processflow/" + record.key)
                .then((res) => {
                    if (res.status >= 200 && res.status < 300) {
                        res.json().then((data) => {
                            let progressflow = data.TransProgressFlow;
                            this.state.items = progressflow.map(progressflow =>
                                <Timeline.Item color="red">
                                    <p><span style={{ fontWeight: 800 }}>{progressflow.Status}</span>&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                    <p style={{ marginTop: 6 }}>Description：<span>{progressflow.Description}</span> </p>
                                    <p style={{ marginTop: 6 }}>From: {progressflow.Name} &nbsp;&nbsp;&nbsp;&nbsp;{progressflow.time.substr(0, progressflow.time.indexOf('.')).replace('T', ' ')}</p>
                                </Timeline.Item>
                            );

                        });
                    }

                });
        }
        else if (record.flag == "1") {
            alert("修改")
            fetch_get("/api/bank/Application/" + record.no)
                .then((res) => {
                    if (res.status >= 200 && res.status < 300) {
                        res.json().then((data) => {
                            if (data.AmendFormFlow != null) {
                                for (var i = 0; i < data.AmendFormFlow.length; i++) {
                                    if (record.amendno == data.AmendFormFlow[i].amendNo) {                                     
                                        //信用证修改进度
                                        let progressflow = data.AmendFormFlow[i].AmendFormProgressFlow;
                                        this.state.items = progressflow.map(progressflow =>
                                            <Timeline.Item color="red">
                                                <p><span style={{ fontWeight: 800 }}>{CONSTANTS.AMEND_PROCESS_FLOW_STEP[progressflow.Status]}</span>&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                                <p style={{ marginTop: 6 }}>Description：<span>{progressflow.Description}</span> </p>
                                                <p style={{ marginTop: 6 }}>From: {progressflow.Name} &nbsp;&nbsp;&nbsp;&nbsp;{progressflow.time.substr(0, progressflow.time.indexOf('.')).replace('T', ' ')}</p>
                                            </Timeline.Item>
                                        );

                                        break;
                                    }
                                }
                            }
                        });
                    }
                });
        }
        return (
            <Timeline>{this.state.items}</Timeline>
        );
    };

    handleSelectedTags = (selectedTags) => {
        this.state.tags = selectedTags;//selectedTags.join(';');
        this.getTxsData();

    }

    handleSelectedDate = (date, dateString) => {
        this.state.dateRanges = dateString.join(';');
        this.getTxsData();
    }

    componentDidMount = () => {
        this.getTxsData();
    }

    refreshPage = () => {
        // document.head.innerHTML += '<meta http-equiv="refresh" content="20">'
        //location.reload();
        // return;
        this.state.tags = "";
        this.state.dateRanges = null;
        document.getElementById("lcno").value = "";
        document.getElementById("letter_applicant").value = "";
        document.getElementById("letter_beneficiary").value = "";

        // document.getElementById("datepicker").value = "";
        //  document.getElementsByName("datepickers").value=";

        // alert("date： "+document.getElementsByName("datepickers").value);        
        this.getTxsData();

    }

    handleselect = () => {
        this.getTxsData();
    }

    handleLetters = (data) => {
        const letters = [];
        var index = 0;
        for (let i = 0; i < data.length; i++) {
            letters.push({
                key: data[i].id,
                number: data[i].LCNumbers === "" ? "当前未生成" : data[i].LCNumbers,
                applicant: data[i].applicant,
                beneficiary: data[i].beneficiary,
                issuingbank: data[i].issuingBank,
                advisingbank: data[i].advisingBank,
                amount: data[i].amount + " " + data[i].currency,
                status: data[i].status,
                createdAt: data[i].issuseDate,
                flag: "0" //正本
            })

            //信用证修改
            if (data[i].amend != null) {
                for (var j = 0; j < data[i].amend.length; j++) {
                    // alert("data: "+ JSON.stringify(data[i].amend[j]));                     
                    if ((sessionStorage.getItem("bankno") == data[i].issuingBankNo)
                        && (data[i].amend[j].Status == "AmendIssuingBankAcceptStep")) {
                        letters.push({
                            key: index++,
                            no: data[i].id,
                            amendno: data[i].amend[j].amendNo,
                            number: data[i].LCNumbers === "" ? "当前未生成" : data[i].LCNumbers,
                            times: data[i].amend[j].amendTimes,
                            status: "发起修改",
                            applicant: data[i].applicant,
                            beneficiary: data[i].beneficiary,
                            amount: data[i].amount + " " + data[i].currency,
                            createdAt: data[i].amend[j].amendDate,
                            flag: "1" //发起修改
                        })
                    } else if ((sessionStorage.getItem("bankno") == data[i].advisingBankNo)
                        && (data[i].amend[j].Status == "AmendAdvisingBankAcceptStep")) {
                        letters.push({
                            key: index++,
                            no: data[i].id,
                            amendno: data[i].amend[j].amendNo,
                            number: data[i].LCNumbers === "" ? "当前未生成" : data[i].LCNumbers,
                            times: data[i].amend[j].amendTimes,
                            status: "发起修改",
                            applicant: data[i].applicant,
                            beneficiary: data[i].beneficiary,
                            amount: data[i].amount + " " + data[i].currency,
                            createdAt: data[i].amend[j].amendDate,
                            flag: "1" //发起修改
                        })
                    }
                }

            }
        }

        this.setState({
            letters: letters,
        });
    }

    getTxsData = () => {
        var startData = '1990-01-01';
        var endData = '9999-01-01';
        if (this.state.dateRanges != null) {
            var arr = this.state.dateRanges.toString().split(";");
            startData = arr[0];
            endData = arr[1];
        }
        // alert(sessionStorage.getItem("bankno") 
        // + "?status=" + this.state.tags
        // + "&lcNo=" +document.getElementById("lcno").value 
        // + "&applicant=" +document.getElementById("letter_applicant").value 
        // + "&beneficiary=" +document.getElementById("letter_beneficiary").value 
        // + "&startDate=" + startData + "&endDate=" + endData);
        fetch_get("/api/bank/transaction/processing/" + sessionStorage.getItem("bankno")
            + "?status=" + this.state.tags
            + "&lcNo=" + document.getElementById("lcno").value
            + "&applicant=" + document.getElementById("letter_applicant").value
            + "&beneficiary=" + document.getElementById("letter_beneficiary").value
            + "&startDate=" + startData + "&endDate=" + endData)
            .then((res) => {
                if (res.status >= 200 && res.status < 300) {
                    res.json().then((data) => {
                        this.handleLetters(data);
                    });
                } else {
                    this.setState({
                        letters: [],
                    });
                }
            });
    }

    // keypress(e) {     
    //     if (e.which === 13) 
    //     {
    //          this.handleselect();             
    //     }
    //   }

    render() {
        return (
            <Layout style={{ padding: '0 1px 1px' }}>
                <Breadcrumb style={{ padding: '12px 16px', height: '42px', background: '#F3F1EF' }}>
                    <Breadcrumb.Item>{CONSTANTS.COMM_TB_PROCESSED}</Breadcrumb.Item>
                </Breadcrumb>
                <Content style={{ background: '#fff', padding: 0, margin: 0, minHeight: 280 }}>
                    <div style={{ margin: '12px 16px', display: 'block' }}>
                        <Row>
                            <Col style={{ marginTop: '15px', fontWeight: 800, fontSize: '14px', color: '#004a7c' }} span={16}>
                                <HotTags handleSelectedTags={selectedTags => this.handleSelectedTags(selectedTags)}></HotTags>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{ marginTop: '15px', fontWeight: 800, fontSize: '14px', color: '#004a7c' }} span={24}>
                                <strong style={{ marginRight: '15px' }}>{CONSTANTS.LETTER_NUMBER}</strong>
                                <Input id="lcno" onKeyPress={(event) => { if (event.key === "Enter") { this.handleselect() } }} style={{ width: 200, marginRight: '15px' }} placeholder="信用证编号" />
                                <strong style={{ marginRight: '15px' }}>{CONSTANTS.COMM_SELECT_DATE}</strong>
                                <RangePicker name="datepickers" onChange={this.handleSelectedDate} />
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{ marginTop: '15px', marginBottom: '15px', fontWeight: 800, fontSize: '14px', color: '#004a7c' }} span={24}>
                                <strong style={{ marginRight: '15px' }}>{CONSTANTS.LETTER_APPLICANT}</strong>
                                <Input id="letter_applicant" onKeyPress={(event) => { if (event.key === "Enter") { this.handleselect() } }} style={{ width: 200, marginLeft: '28px', marginRight: '15px' }} placeholder="申请人" />
                                <strong style={{ marginRight: '15px' }}>{CONSTANTS.LETTER_BENEFICIARY}</strong>
                                <Input id="letter_beneficiary" onKeyPress={(event) => { if (event.key === "Enter") { this.handleselect() } }} style={{ width: 200, marginLeft: '15px', marginRight: '15px' }} placeholder="受益人" />
                                <Button type="primary" style={{ marginLeft: '15px' }} onClick={() => this.refreshPage()}>重置</Button>
                            </Col>
                        </Row>
                    </div>
                    <div style={{ margin: '12px 16px' }}>
                        <Table
                            className="components-table-demo-nested"
                            columns={columns}
                            // expandedRowRender={this.expandedRowRender}
                            dataSource={this.state.letters}
                        />
                    </div>
                </Content>
            </Layout>
        )
    }
}

export default TobeProcessed