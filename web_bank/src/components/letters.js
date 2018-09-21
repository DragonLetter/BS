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
    { title: CONSTANTS.LETTER_APPLICANT_DATE, dataIndex: 'createdAt', key: 'createdAt'}
  ];

var renderAction = function(params) {
    switch(params.status){
        case "填写信用证草稿":
            return (<a href={'/#/lcpayment/draft/' + params.key}>{CONSTANTS.COMM_DETAILIS}</a>);
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
        case "申请人付款":
            return (<a href={'/#/lcpayment/billtransact/' + params.key}>{CONSTANTS.COMM_DETAILIS}</a>);
        case "开证行审核付款":
            return (<a href={'/#/lcpayment/redemption/' + params.key}>{CONSTANTS.COMM_DETAILIS}</a>);
        case "闭卷":
            return (<a href={'/#/lcpayment/closing/' + params.key}>{CONSTANTS.COMM_DETAILIS}</a>);
    }
}

const CheckableTag = Tag.CheckableTag;
const tagsFromServer = [
    "企业申请",
    "草稿审核",
    "正本开立",
    "正本生效",
    "付款",
    "闭卷",
//    "正本修定",
    "到单"
];
var status_value="";
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
    if (status_value == tag)
    {
        status_value = "";
        checked = false;
    }
    else
    {
        status_value = tag;
        checked = true;
    }
 
    this.setState({ selectedTags:status_value });       
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
            selectedTags: [],
            letters: []
        }
    }

    handleLetters = (data) => {
        const letters = [];
        for(let i = 0; i < data.length; i++){
            var flag = false;
            if( this.state.tags=="到单" ){
                if( data[i].billState > 0 )
                    flag = true;
            } 
            else if( this.state.tags=="正本修定" ){
                if( data[i].amend.length>0 )
                    flag = true;
            }else
                flag = true;
            if( flag == false )
                continue;
            var issDate = data[i].issuseDate.substr(0, 19).replace('T', ' ');
            letters.push({
                key: data[i].id,
                number: data[i].LCNumbers === "" ? "当前未生成" : data[i].LCNumbers,
                applicant: data[i].applicant,
                beneficiary: data[i].beneficiary,
                issuingbank: data[i].issuingBank,
                advisingbank: data[i].advisingBank,
                amount: data[i].amount + " " + data[i].currency,
                status: data[i].status,
                createdAt: issDate                              
            })
        }
        message.error(JSON.stringify(letters));
        this.setState({
            letters: letters,
        });
    }

    componentDidMount = () => {
        this.getTxsData();       
    }

    handleSelectedTags = (selectedTags) => {
        this.state.tags = selectedTags;//selectedTags.join(';');
        this.getTxsData();

    }

    handleSelectedDate = (date, dateString) =>  {
        this.state.dateRanges = dateString.join(';');
        this.getTxsData();
    }

    refreshPage = () => {
        // document.head.innerHTML += '<meta http-equiv="refresh" content="20">'
        //location.reload();
       // return;
        this.state.tags = "";
        this.state.dateRanges = null;
        document.getElementById("lcno").value ="";
        document.getElementById("letter_applicant").value ="";
        document.getElementById("letter_beneficiary").value ="";
  
        // document.getElementById("datepicker").value = "";
        //  document.getElementsByName("datepickers").value=";
        
        // alert("date： "+document.getElementsByName("datepickers").value);        
         this.getTxsData();
       
    }

    handleselect = () => {        
        this.getTxsData();        
    }

    getTxsData = () => {
        var startData = '1990-01-01';
        var endData = '9999-01-01';        
        if (this.state.dateRanges != null)
        {
            var arr = this.state.dateRanges.toString().split(";");
            startData = arr[0];
            endData = arr[1];
        }
        var tags = this.state.tags;
        if( this.state.tags=="正本修定" || this.state.tags=="到单" ){
            tags = "";
        }
        // alert(sessionStorage.getItem("bankno") 
        // + "?status=" + this.state.tags
        // + "&lcNo=" +document.getElementById("lcno").value 
        // + "&applicant=" +document.getElementById("letter_applicant").value 
        // + "&beneficiary=" +document.getElementById("letter_beneficiary").value 
        // + "&startDate=" + startData + "&endDate=" + endData);
        fetch_get("/api/bank/transaction/" + sessionStorage.getItem("bankno") 
         + "?status=" + tags
         + "&lcNo=" +document.getElementById("lcno").value 
         + "&applicant=" +document.getElementById("letter_applicant").value 
         + "&beneficiary=" +document.getElementById("letter_beneficiary").value 
         + "&startDate=" + startData + "&endDate=" + endData)
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
                <Row>
                            <Col style={{ marginTop: '15px', fontWeight:800, fontSize:'14px', color:'#004a7c' }} span={16}>
                                <HotTags handleSelectedTags = { selectedTags => this.handleSelectedTags(selectedTags)}></HotTags>
                            </Col>
                      
                        </Row>
                        <Row>         
                            <Col style={{ marginTop: '15px',  fontWeight:800, fontSize:'14px', color:'#004a7c' }} span={24}>
                                <strong style={{marginRight: '15px'}}>{CONSTANTS.LETTER_NUMBER}</strong>
                                <Input id = "lcno" onKeyPress={(event) => {if (event.key === "Enter") {this.handleselect()}}} style={{width: 200, marginRight: '15px'}} placeholder="信用证编号" />
                                <strong style={{marginRight: '15px'}}>{CONSTANTS.COMM_SELECT_DATE}</strong>
                                <RangePicker id='datapicker' name = "datepickers" onChange={ this.handleSelectedDate }/>                                  
                            </Col>      
                        </Row>
                        <Row>         
                            <Col style={{ marginTop: '15px', marginBottom: '15px', fontWeight:800, fontSize:'14px', color:'#004a7c' }} span={24}>
                                <strong style={{marginRight: '15px'}}>{CONSTANTS.LETTER_APPLICANT}</strong>
                                <Input id = "letter_applicant" onKeyPress={(event) => {if (event.key === "Enter") {this.handleselect()}}} style={{width: 200, marginLeft:'28px', marginRight: '15px'}} placeholder="申请人" />
                                <strong style={{marginRight: '15px'}}>{CONSTANTS.LETTER_BENEFICIARY}</strong>
                                <Input id = "letter_beneficiary" onKeyPress={(event) => {if (event.key === "Enter") {this.handleselect()}}} style={{width: 200, marginLeft:'15px',marginRight: '15px'}} placeholder="受益人" />
                                <Button  type="primary" style={{marginLeft: '15px'}} onClick={() => this.refreshPage()}>重置</Button>                          
                            </Col>      
                        </Row>

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
