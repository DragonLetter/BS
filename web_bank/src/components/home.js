import React from 'react'
import 'whatwg-fetch'
import { Link, hashHistory} from 'react-router';
import '../main.css'
import 'jquery'
import {fetch_get, fetch_post} from '../common'

import {Timeline, Tag, Tabs, Row, Card, Layout, Breadcrumb, Collapse, InputNumber, Table, Icon, Steps, Form, Input, Select, Checkbox, DatePicker, Col, Radio, Button, Modal, Badge, Menu, Dropdown, message} from 'antd'
const Step = Steps.Step;
const { Header, Content, Sider } = Layout;
const { MonthPicker, RangePicker } = DatePicker;

class Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            bordered : false,
            customers: 0,
            LCNumbers: 0,
            LCAmount: 0.00,
            AverageAmount: 0.00,
            currency: "RMB"

        }
    }

    handleData = (data) => {
        var lcAmount = data.LCAmount/10000.0;
        var avgAmount = data.AverageAmount/10000.0;
        var lcamount = lcAmount.toString();
        lcamount = lcamount.substr(0, lcamount.indexOf('.')+3);
        var avgamount = avgAmount.toString();
        avgamount = avgamount.substr(0, avgamount.indexOf('.')+3);
        this.setState({
            customers : data.Customers,
            LCNumbers : data.LCNumbers,
            LCAmount : lcamount,
            AverageAmount : avgamount,
            currency : data.currency
        });
    }

    componentDidMount = () => {
        fetch_get("/api/bank/metrics/" + sessionStorage.getItem("bankno"))
        .then((res) => {
            if (res.status >= 200 && res.status < 300) {
                res.json().then((data) => {
                    this.handleData(data);
                });
            }
        });
    }

    getCurrentDate() {
        var date = new Date();
        var month = date.getMonth()+1;
        return date.getFullYear() + "-" + (month < 10 ? "0" + month : month) + "-"
          + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
    }

    datepickerOnChange(date, dateString) {
        console.log(date, dateString);
    }

    render(){
        return (
            <Layout style={{ padding: '0 1px 1px'}}>
                <Breadcrumb style={{ padding: '12px 16px', fontSize:13, fontWeight:800, background:'#F3F1EF' }}>
                    <Breadcrumb.Item>实时数据</Breadcrumb.Item>
                    <Breadcrumb.Item>北京时间：{this.getCurrentDate()}</Breadcrumb.Item>
                </Breadcrumb>
                <Content style={{ background: '#fff', padding: 0, margin: '0'}}>
                    <div style={{marginLeft: '16px', marginRight: '16px'}}>
                        <Row>
                            <Col style={{ marginTop: '30px', fontWeight:800, fontSize:'14px', color:'#004a7c' }} span={18}>关键指标</Col>
                        </Row>
                    </div>
                    <div style={{ margin: '12px 16px', borderTop: '1px solid #e6ebf1' }}>
                        <Row>
                            <Col style={{ marginTop: '20px', marginBottom:10, textAlign:'center'}} span={6}>
                                <span style={{ fontSize:'14px', color:'#004a7c'}}>开证量（笔）</span>
                                <div style={{margin:'25px'}}>
                                    <a style={{ outline: '0', cursor:'pointer', color:'#10ADE4'}}>
                                    <span style={{fontSize: 30 }}><span id="market-price">{this.state.LCNumbers}</span></span>
                                    </a>
                                </div>
                                <div><span style={{ fontSize:'12px', color:'black'}}>2017年度信用证业务总笔数</span></div>
                            </Col>
                            <Col style={{ marginTop: '20px', marginBottom:10, fontSize:'14px', color:'#004a7c', textAlign:'center'}} span={6}>
                                <span style={{ fontSize:'14px', color:'#004a7c'}}>开证金额（万人民币）</span>
                                <div style={{margin:'25px'}}>
                                    <a style={{ outline: '0', cursor:'pointer', color:'#10ADE4'}}>
                                        <span style={{fontSize: 30 }}><span id="market-price">{this.state.LCAmount} {this.state.currency}</span></span>
                                    </a>
                                </div>
                                <div><span style={{ fontSize:'12px', color:'black'}}>2017年度信用证业务总金额</span></div>                                
                            </Col>
                            <Col style={{ marginTop: '20px', marginBottom:10, fontSize:'14px', color:'#004a7c', textAlign:'center'}} span={6}>
                                <span style={{ fontSize:'14px', color:'#004a7c'}}>客户数量（个）</span>
                                <div style={{margin:'25px'}}>
                                    <a style={{ outline: '0', cursor:'pointer', color:'#10ADE4'}}>
                                    <span style={{fontSize: 30 }}><span id="market-price">{this.state.customers}</span></span>
                                    </a>
                                </div>
                                <div><span style={{ fontSize:'12px', color:'black'}}>2017年度新增客户总数量</span></div>                                
                            </Col>
                            <Col style={{ marginTop: '20px', marginBottom:10, fontSize:'14px', color:'#004a7c', textAlign:'center'}} span={6}>
                                <span style={{ fontSize:'14px', color:'#004a7c'}}>平均每笔金额（万人民币）</span>
                                <div style={{margin:'25px'}}>
                                    <a style={{ outline: '0', cursor:'pointer', color:'#10ADE4'}}>
                                    <span style={{fontSize: 30 }}><span id="market-price">{this.state.AverageAmount} {this.state.currency}</span></span>
                                    </a>
                                </div>
                                <div><span style={{ fontSize:'12px', color:'black'}}>通过开证总量和总金额计算出来的平均值</span></div>                                
                            </Col>
                        </Row>
                    </div>    
                </Content>
            </Layout>
        )
    }
}

export default Home
