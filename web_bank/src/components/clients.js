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

const columns = [{
    title: '客户名称',
    dataIndex: 'name',
    key: 'name',
}, {
    title: '国家',
    dataIndex: 'nation',
    key: 'nation',
}, {
    title: '联系人',
    dataIndex: 'contact',
    key: 'contact',
}, {
    title: '电子邮箱',
    key: 'email',
    dataIndex: 'email',
}, {
    title: '创建时间',
    key: 'creationTime',
    dataIndex: 'creationTime',
}];

const dataSource = [{
    key: '1',
    name: '阿帕奇贝特北京科技有限公司',
    nation: "中国",
    contact: 'admin',
    email: 'admin@apachebet.com',
    creationTime: '2017-12-20'
  }, {
    key: '2',
    name: '北京龙账本网络技术有限公司',
    nation: "中国",
    contact: 'admin',
    email: 'admin@dragonledger.com',
    creationTime: '2017-12-20'
}, {
    key: '3',
    name: '西日本貿易株式会社',
    nation: "日本",
    contact: 'admin',
    email: 'admin@wjtc.co.jp',
    creationTime: '2017-12-22'
}];

class Clients extends React.Component{
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
    }

    componentDidMount = () => {
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
                        dataSource={dataSource}
                        />
                    </div>
                </Content>
            </Layout>
        )
    }
}

export default Clients