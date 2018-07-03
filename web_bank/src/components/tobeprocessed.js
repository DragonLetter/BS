import React from 'react'
import { Link, hashHistory} from 'react-router';
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
    { title: CONSTANTS.LETTER_NUMBER, dataIndex: 'number', key: 'number' },
    { title: CONSTANTS.LETTER_STATUS, key: 'status', width:'10%', render: (text, record) => <Tag color="green">{ record.status }</Tag> },        
    { title: CONSTANTS.LETTER_APPLICANT, dataIndex: 'applicant', key: 'applicant' },
    { title: CONSTANTS.LETTER_BENEFICIARY, dataIndex: 'beneficiary', key: 'beneficiary' }, 
    { title: CONSTANTS.LETTER_AMOUNT, dataIndex: 'amount', key: 'amount' },
    { title: CONSTANTS.LETTER_APPLICANT_DATE, dataIndex: 'createdAt', key: 'createdAt', render: (text, record) => <span>{record.createdAt.substr(0, record.createdAt.indexOf('+')).replace('T', ' ')}</span> },
    { title: CONSTANTS.COMM_OPERATION, key: 'operation', render: (text, record, index) => renderAction(record)},
  ];

var renderAction = function(params) {
    switch(params.status){
        case "填写信用证草稿":
        return (<a href={'/#/lcpayment/draft/' + params.key}>{ CONSTANTS.COMM_DETAILIS }</a>);
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
        case "开证行审核赎单":
            return (<a href={'/#/lcpayment/redemption/' + params.key}>{ CONSTANTS.COMM_DETAILIS }</a>);      
        case "闭卷":
            return (<a href={'/#/lcpayment/closing/' + params.key}>{ CONSTANTS.COMM_DETAILIS }</a>);
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
    "赎单",
    "拒付",
    "闭卷"
];
class HotTags extends React.Component {
    state = {
      selectedTags: [],
    };
  
    handleChange(tag, checked) {
      const { selectedTags } = this.state;
      const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
      this.setState({ selectedTags: nextSelectedTags });
      this.props.handleSelectedTags(nextSelectedTags);
    }
  
    render() {
      const { selectedTags } = this.state;
      return (
        <div>
          <strong style={{ marginRight: 8 }}>{CONSTANTS.COMM_SELECT_TYPE}</strong>
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

class TobeProcessed extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            bordered : false,
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
        fetch_get("/api/bank/transaction/processflow/" + record.key)
        .then((res) => {
            if(res.status >= 200 && res.status < 300){
                res.json().then((data) => {
                    let progressflow = data.TransProgressFlow;
                    this.state.items = progressflow.map(progressflow => 
                        <Timeline.Item color="red">
                            <p><span style={{fontWeight:800}}>{progressflow.Status}</span>&nbsp;&nbsp;&nbsp;&nbsp;</p> 
                            <p style={{marginTop: 6}}>Description：<span>{progressflow.Description}</span> </p>
                            <p style={{marginTop: 6}}>From: {progressflow.Name} &nbsp;&nbsp;&nbsp;&nbsp;{progressflow.time.substr(0, progressflow.time.indexOf('.')).replace('T', ' ')}</p>
                        </Timeline.Item>
                    );
                });
            }
        });
    
        return (
            <Timeline>{this.state.items }</Timeline>
        );
    };

    handleSelectedTags = (selectedTags) => {
        this.state.tags = selectedTags.join(';');
        this.getTxsData();

    }

    handleSelectedDate = (date, dateString) =>  {
        this.state.dateRanges = dateString.join(';');
        this.getTxsData();
    }

    componentDidMount = () => {
        this.getTxsData();
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

    getTxsData = () => {
        fetch_get("/api/bank/transaction/processing/" + sessionStorage.getItem("bankno") + "?status=" + this.state.tags + "&date=" + this.state.dateRanges)
        .then((res) => {
            if(res.status >= 200 && res.status < 300){
                res.json().then((data) => { 
                    this.handleLetters(data);
                 });
            }
        });
    }

    render(){
        return (
            <Layout style={{ padding: '0 1px 1px' }}>
                <Breadcrumb style={{ padding: '12px 16px', height:'42px', background:'#F3F1EF' }}>
                    <Breadcrumb.Item>{CONSTANTS.COMM_TB_PROCESSED}</Breadcrumb.Item>
                </Breadcrumb>
                <Content style={{ background: '#fff', padding: 0, margin: 0, minHeight: 280 }}>
                    <div style={{margin: '12px 16px', display:'none'}}>
                        <Row>
                            <Col style={{ marginTop: '15px', fontWeight:800, fontSize:'14px', color:'#004a7c' }} span={16}>
                                <HotTags handleSelectedTags = { selectedTags => this.handleSelectedTags(selectedTags)}></HotTags>
                            </Col>
                      
                        </Row>
                        <Row>
                        <Col style={{ marginTop: '15px', marginBottom: '15px', fontWeight:800, fontSize:'14px', color:'#004a7c' }} span={24}>
                                <strong style={{marginRight: '15px'}}>{CONSTANTS.COMM_SELECT_DATE}</strong>
                                <RangePicker onChange={ this.handleSelectedDate }/>                            
                            </Col>      
                        </Row>
                    </div>
                    <div style={{margin: '12px 16px'}}>
                        <Table
                        className="components-table-demo-nested"
                        columns={columns}
                        expandedRowRender={ this.expandedRowRender }
                        dataSource={this.state.letters}
                        />
                    </div>
                </Content>
            </Layout>
        )
    }
}

export default TobeProcessed