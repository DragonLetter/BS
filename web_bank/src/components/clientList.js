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

const signCorporationForm = (props) => {
    const { visible, onCancel, onPass, onReject, curCorporation } = props;
    const formItemLayout = {
        labelCol: { span: 7 },
        wrapperCol: { span: 15 },
    };
        return (
            <Modal
                visible = {visible}
//                curCorporation={curCorporation}
                title="企业信息"
                // footer={curCorporation.signState=='0'?
                //     [<Button key="back" onClick={onCancel}>关闭</Button>,
                //     <Button key="pass" onClick={onPass}>通过</Button>,
                //     <Button key="reject" onClick={onReject}>拒绝</Button>,]  :
                //     [<Button key="back" onClick={onCancel}>关闭</Button>]
                // }
                >
                <Layout style={{ padding: '1px 1px' }}>
                    <Content style={{ background: '#fff', padding: 0, margin: '0' }}>
                        <div style={{ margin: '12px 16px', borderTop: '1px solid #e6ebf1' }}>
                            <Row key={0}>
                                <Col style={{ marginTop: '20px', marginBottom: '12px', fontSize: '12px', color: '#32325d' }} span={6}>申请人信息</Col>
                            </Row>
                            <Row key={1}>
                                <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>申请人</Col>
                                <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>1111</Col>
                                <Col span={3}></Col>
                                <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>地址</Col>
                                <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>22222</Col>
                            </Row>
                        </div>
                    </Content>
                </Layout>
            </Modal>
        );
};

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
        message.error(JSON.stringify(this.state.visibleSCForm));
    }

    handleSCCancel = () =>{

    }
    handleSCPass = () => {

    }
    handleSCReject = () => {

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
                <signCorporationForm
                    visible={this.state.visibleSCForm}
                    // onCancel={this.handleSCCancel}
                    // onPass={this.handleSCPass}
                    // onReject={this.handleSCReject}
                    // curCorporation={this.state.curCorporation}
                />
            </Layout>
        )
    }
}

export default ClientList;