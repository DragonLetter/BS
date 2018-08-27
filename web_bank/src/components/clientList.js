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

class ClientList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            visibleSCForm: false,
            curCorporation: Object,
            pagination: true,
            showHeader: true,
            display: false,
            signCorporations: []
        }
    }
    handleCorporationSigned = (data) => {
        const signCorporation = [];
        for (let i = 0; i < data.length; i++) {
            signCorporation.push({
                key: data[i].id,
                name: data[i].name,
                domain: data[i].domain,
                nation: data[i].nation,
                contact: data[i].contact,
                email: data[i].email,
                account: data[i].account,
                depositBank: data[i].depositBank,
                address: data[i].address,
                creationTime: data[i].creationTime,
                signState:data[i].signState,
            });
        }
        this.setState({
            signCorporations: signCorporation,
            loading: false,
        });
    }
    componentDidMount = () => {
        fetch_get("/api/SignedBank/getCorps/"+sessionStorage.getItem("bankid"))
        .then((res) => {
            if(res.status >= 200 && res.status < 300){
                res.json().then((data) => {
                    this.handleCorporationSigned(data);
                });
            }
        });
    }
    corporationDetail = (idx) => {
        const curCors = this.state.signCorporations;
        const curCor = curCors[idx];// curCorporations.find(item=>item.id==key);
        this.setState({
            curCorporation: curCor,
            visibleSCForm: true,
        });
    }
    handleSCCancel = () =>{
        this.setState({
            visibleSCForm: false,
        })
    }
    handleSCPass = () => {
        let vals = {};
        vals.aid = this.state.curCorporation.key.toString();
        vals.suggestion = "pass";
        vals.isAudit = "true";
        message.error(JSON.stringify(vals));
        fetch_post("/api/SignedBank/signAudit",vals)
        .then((res) => {
            if (res.status >= 200 && res.status < 300) {
                message.success("审核完成, 通过企业签约。");
                this.setState({
                    visibleSCForm: false,
                });
            } else {
                message.error(CONSTANTS.ERROR_SIGNED_FORM_AUDIT);
            }
        });
    }
    handleSCReject = () => {
        let vals = {};
        vals.aid = this.state.curCorporation.key.toString();
        vals.suggestion = "reject";
        vals.isAudit = "false";
        fetch_post("/api/SignedBank/signAudit",vals)
        .then((res) => {
            if (res.status >= 200 && res.status < 300) {
                message.error("审核完成, 拒绝企业签约。");
                this.setState({
                    visibleSCForm: false,
                });
            } else {
                message.error(CONSTANTS.ERROR_SIGNED_FORM_AUDIT);
            }
        });
    }
    render(){
        const columns = [
            {title: '企业名称', dataIndex: 'name', key: 'name',}, 
            {title: '国家', dataIndex: 'nation', key: 'nation',},
            {title: '联系人', dataIndex: 'contact', key: 'contact',},
            {title: '账户', dataIndex: 'account', key: 'account',},
            {title: '企业地址', key: 'address', dataIndex: 'address',},
            {title: '创建时间', key: 'creationTime', dataIndex: 'creationTime',},
            {title: '签约状态',key: 'signState',render:(text,record,index) => <div>{record.signState=='1'?'通过':(record.signState=='0'?'待审':'拒绝')}</div>},
            {title: '操作', key: 'operation', render:(text, record, index) => <span><a onClick={() => this.corporationDetail(index)}>详情</a></span>,}
        ];
        let curCor = this.state.curCorporation;
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
                        dataSource={this.state.signCorporations}
                        />
                    </div>
                </Content>
                <Modal
                  width = "768px"
                  title="签约申请"
                  onCancel = {this.handleSCCancel}
                  visible={this.state.visibleSCForm}
                  footer={this.state.curCorporation.signState=='0'?
                    [<Button key="back" onClick={this.handleSCCancel}>关闭</Button>,
                    <Button key="pass" onClick={this.handleSCPass}>通过</Button>,
                    <Button key="reject" onClick={this.handleSCReject}>拒绝</Button>,]  :
                    [<Button key="back" onClick={this.handleSCCancel}>关闭</Button>]
                  }
                >
                    <Layout style={{ padding: '1px 1px' }}>
                        <div>
                            <Row key={0}>
                                <Col style={{ marginTop: '1px', marginBottom: '12px', fontSize: '12px', color: '#32325d' }} span={6}>企业信息</Col>
                            </Row>
                            <Row>
                                <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>企业名称</Col>
                                <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{curCor.name}</Col>
                                <Col span={3}></Col>
                                <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>联系人</Col>
                                <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{curCor.contact}</Col>
                            </Row>
                            <Row>
                                <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>企业账户</Col>
                                <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{curCor.account}</Col>
                                <Col span={3}></Col>
                                <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>国家</Col>
                                <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{curCor.nation}</Col>
                            </Row>
                            <Row>
                                <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>企业邮箱</Col>
                                <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{curCor.email}</Col>
                                <Col span={3}></Col>
                                <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>企业地址</Col>
                                <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{curCor.address}</Col>
                            </Row>
                        </div>
                    </Layout>
                </Modal> 
            </Layout>
        )
    }
}

export default ClientList;