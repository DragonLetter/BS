import React from 'react'
import 'whatwg-fetch'
import { Link, hashHistory} from 'react-router';
import '../../main.css'
import {fetch_get, fetch_post} from '../../common'
import * as CONSTANTS from '../../constants'

import {Upload, Alert, Timeline, Tag, Tabs, Row, Card, Layout, Breadcrumb, Collapse, InputNumber, Table, Icon, Steps, Form, Input, Select, Checkbox, DatePicker, Col, Radio, Button, Modal, Badge, Menu, Dropdown, message} from 'antd'
const Step = Steps.Step;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Header, Content, Sider } = Layout;

let lcAttachment = {"no": "", "name": "", "uri":"", "hash": "", "signature":"", "uploader": ""};
let isFileUploaded = false;

const ApproveDialog = Form.create()(
    (props) => {
        const options = [{ label: '', value: '' },];
        const { visible, onCancel, onOk, data, form } = props;
        const { getFieldDecorator } = form;
        const formItemLayout = { labelCol: { span: 3 }, wrapperCol: { span: 19 }, };

        return (
            <Modal
                visible={visible}
                title="信用证闭卷"
                okText="提交"
                cancelText="取消"
                onCancel={onCancel}
                onOk={onOk}
                width='800'
                >
                <Form>
                    <FormItem {...formItemLayout} label="闭卷说明">
                    { 
                        getFieldDecorator('description', {rules: [{ required: true, message: '说明内容必须填写。' }],})
                        (
                            <TextArea rows={4} placeholder="说明内容必须填写。"/>
                        )
                    }
                </FormItem>
                </Form>
            </Modal>
        );
    }
);

// 货运单据部分组件
const bolcolumns = [
    { title: '名称', dataIndex: 'name', key: 'name', width:'20%', render: text => <a href="www.baidu.com">{text}</a>},
    { title: '编号', dataIndex: 'hash', key: 'hash' },
    { title: '签名', dataIndex: 'signature', key: 'signature'},
    { title: '上传时间', dataIndex: 'datetime', key: 'datetime' },
  ];

  const boldata = [
    { key: 1, name: '海运单据', hash: '1FVKW4rp5rN23dqFVk2tYGY4niAXMB8eZC ', signature: '3JjPf13Rd8g6WAyvg8yiPnrsdjJt1NP4FC', datetime: '2017/09/01 17:01'},
    { key: 2, name: '海关通关质检单', hash: '1FVKW4rp5rN23dqFVk2tYGY4niAXMB8eZC ', signature: '3JjPf13Rd8g6WAyvg8yiPnrsdjJt1NP4FC', datetime: '2017/09/01 17:01'},
  ];

// 信用证正本部分组件
const lccolumns = [
    { title: '名称', dataIndex: 'name', key: 'name', width:'20%', render: text => <a href="www.baidu.com">{text}</a>},
    { title: '编号', dataIndex: 'hash', key: 'hash' },
    { title: '签名', dataIndex: 'signature', key: 'signature'},
    { title: '上传时间', dataIndex: 'datetime', key: 'datetime' },
  ];

  const lcdata = [
    { key: 1, name: '信用证正本电子件', hash: '1FVKW4rp5rN23dqFVk2tYGY4niAXMB8eZC ', signature: '3JjPf13Rd8g6WAyvg8yiPnrsdjJt1NP4FC', datetime: '2017/09/01 17:01'},
  ];

// 合同及附件证明材料部分组件
const columns = [
    { title: '名称', dataIndex: 'name', key: 'name', width:'20%', render: text => <a href="www.baidu.com">{text}</a>},
    { title: '编号', dataIndex: 'hash', key: 'hash' },
    { title: '签名', dataIndex: 'signature', key: 'signature' },
    { title: '上传时间', dataIndex: 'datetime', key: 'datetime' },  
];

const data = [
    { key: 1, name: '海洋化纤公司贸易合同', hash: '1FVKW4rp5rN23dqFVk2tYGY4niAXMB8eZC ', signature: '3JjPf13Rd8g6WAyvg8yiPnrsdjJt1NP4FC', datetime: '2017/09/01 17:01'},
    { key: 2, name: '企业营业执照扫描件', hash: '1FVKW4rp5rN23dqFVk2tYGY4niAXMB8eZC ', signature: '3JjPf13Rd8g6WAyvg8yiPnrsdjJt1NP4FC', datetime: '2017/09/01 17:01'},
    { key: 3, name: '资金证明文件扫描件', hash: '1FVKW4rp5rN23dqFVk2tYGY4niAXMB8eZC ', signature: '3JjPf13Rd8g6WAyvg8yiPnrsdjJt1NP4FC', datetime: '2017/09/01 17:01'},
];

class LetterCLosing extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            bordered : false,
            approveDialogVisible: false,
            rejectDialogVisible: false,
            deposit: {},
            depositDoc: {},
            letters: {}
        }
    }

    componentDidMount = () => {
        this.getLCDraftDetail();
        this.getLCProcessFlows();
        this.getDepositData();        
    }

    getLCDraftDetail = () => {
        fetch_get("/api/bank/transaction/draft/" + this.props.params.id)
        .then((res) => {
            if(res.status >= 200 && res.status < 300){
                res.json().then((data) => {
                    this.handleDraftData(data);
                });
            }
        });
    }

    handleDraftData = (data) => {
        this.setState({
            letters: data,
        });
    }

    getDepositData = () => {
        fetch_get("/api/bank/transaction/deposit/" + this.props.params.id)
        .then((res) => {
            if(res.status >= 200 && res.status < 300){
                res.json().then((data) => {
                    this.handleDepositDate(data);
                });
            }
        });
    }

    handleDepositDate = (data) => {
        var deposit = {
            commitAmount: data.commitAmount,
            depositAmount: data.depositAmount,
            isDocUploaded: data.DepositDoc.FileHash == "" ? "无" : "有"
        };
        this.setState({
            deposit: deposit,
        });
        this.setState({
            depositDoc: data.DepositDoc,
        });
    }

    getLCProcessFlows = () => {
        fetch_get("/api/bank/transaction/processflow/" + this.props.params.id)
        .then((res) => {
            if(res.status >= 200 && res.status < 300){
                res.json().then((data) => {
                    let progressflow = data.TransProgressFlow;
                    let items = progressflow.map(progressflow => 
                        <Timeline.Item color="red">
                            <p><span style={{fontWeight:800}}>{progressflow.Status}</span>&nbsp;&nbsp;&nbsp;&nbsp;</p> 
                            <p style={{marginTop: 6}}>Description：<span>{progressflow.Description}</span> </p>
                            <p style={{marginTop: 6}}>From: {progressflow.Name} &nbsp;&nbsp;&nbsp;&nbsp;{progressflow.time.substr(0, progressflow.time.indexOf('.')).replace('T', ' ')}</p>
                        </Timeline.Item>
                    );
                    this.setState({ flowItems: items });
                });
            }
        });
    }

    closeApproveDialog = () => {
        this.setState({
            approveDialogVisible: false,
        });
    }

    showApproveDialog = () => {
        this.setState({
            approveDialogVisible: true,
        });
    }

    saveApproveRef = (form) => {
        this.approveForm = form;
    }

    handleApprove = (value) => {
        const form = this.approveForm;
        form.validateFields((err, values) => {
            if(err){ return; }
            var result = {
                no:  this.props.params.id,
                transactionId: this.props.params.id,
                description: values.description
            };
            this.HandleRequest(result);
        });     
    }

    HandleRequest = (result) => {
        fetch_post("/api/bank/letterofcredit/closing", result).then((res) => {
            if(res.status >= 200 && res.status < 300) {
                res.json().then((data) => {
                    this.closeApproveDialog();
                    message.success("审核完成, 等待企业确认.");                    
                });
            } else {
                message.error("交易执行失败，请检查审核信息.");                    
            }
        });
    }

    tabsCallback = (key) => {
        this.getLCDraftDetail();
        this.getLCProcessFlows();
        this.getDepositData();    
    }

    render(){
        return (
            <Layout style={{ padding: '1px 1px'}}>
                <Breadcrumb style={{ padding: '12px 16px', fontSize:13, fontWeight:800, background:'#F3F1EF' }}>
                    <Breadcrumb.Item>{CONSTANTS.DOMESTIC_LC}</Breadcrumb.Item>
                    <Breadcrumb.Item>{CONSTANTS.COMM_TRANSING}</Breadcrumb.Item>
                </Breadcrumb>
                <Content style={{ background: '#fff', padding: 0, margin: '0'}}>  

               <Tabs defaultActiveKey="1" onChange={this.tabsCallback} style={{marginTop:'20px'}}>
                   <TabPane tab="闭卷" key="1">
                    <div style={{backgroundColor: '#d4cfcf47', marginLeft:'14px', marginRight:'14px', padding:'15px', borderTopLeftRadius:'8px', borderTopRightRadius:'8px', borderBottomLeftRadius:'8px', borderBottomRightRadius:'8px'}}>
                        <div>
                            <Row>
                                <Col style={{ marginBottom:'12px', fontSize:'12px', color:'#32325d', fontWeight:'bold'}} span={3}>信用证摘要</Col>
                            </Row>
                            <Row>
                                <Col style={{ marginTop: '5px', marginBottom:'12px', fontSize:'12px', color:'#6b7c93'}} span={3}>编号</Col>
                                <Col style={{ marginTop: '5px', marginBottom:'12px', fontSize:'12px', color:'#32325d'}} span={6}>{this.state.letters.LCNo}</Col>  
                            </Row>
                            <Row>
                                <Col style={{ marginTop: '5px', marginBottom:'12px', fontSize:'12px', color:'#6b7c93'}} span={3}>是否可闭卷</Col>
                                <Col style={{ marginTop: '5px', marginBottom:'12px', fontSize:'12px', color:'#32325d'}} span={6}>是</Col>                                       
                            </Row>
                        </div>
                    </div>
                    <div style={{marginTop:'20px', marginLeft: '16px', marginRight: '16px', marginBottom:'5px'}}>
                        <Row>
                            <Col style={{ fontSize:'13px'}} span={24} offset={0}>
                                <Button type='primary' style={{marginLeft: '5px'}} onClick={this.showApproveDialog.bind(this)}><Icon type="check-circle" />闭卷</Button>
                            </Col>
                        </Row>
                    </div>    
                    </TabPane>

                    <TabPane tab="信用证正本" key="2">
                        <div style={{ margin: '15px 5px', marginLeft: '20px'}}>
                            <div>
                                <Row>
                                    <Col style={{ marginTop: '5px', marginBottom:'12px', fontSize:'12px', color:'#32325d', fontWeight:'bold'}} span={6}>申请人信息</Col>
                                </Row>
                                <Row>
                                    <Col style={{ margin: '5px 0px', fontSize:'12px', color:'#6b7c93'}} span={3}>申请人</Col>
                                    <Col style={{ margin: '5px 0px', fontSize:'12px', color:'#32325d' }} span={6}>江苏海洋化纤有限公司</Col>
                                    <Col span={3}></Col>
                                    <Col style={{ margin: '5px 0px', fontSize:'12px', color:'#6b7c93' }} span={3}>账号</Col>
                                    <Col style={{ margin: '5px 0px', fontSize:'12px', color:'#32325d' }} span={6}>157700000012444</Col>
                                </Row>
                                <Row>
                                    <Col style={{ margin: '5px 0px', fontSize:'12px', color:'#6b7c93'}} span={3}>地址</Col>
                                    <Col style={{ margin: '5px 0px', fontSize:'12px', color:'#32325d' }} span={6}>江苏泰州市海洋路89号，邮编：225000</Col>
                                    <Col span={3}></Col>                            
                                    <Col style={{ margin: '5px 0px', fontSize:'12px', color:'#6b7c93' }} span={3}></Col>
                                    <Col style={{ margin: '5px 0px', fontSize:'12px', color:'#32325d' }} span={6}></Col>
                                </Row>
                            </div>
                            <div>
                                <Row>
                                    <Col style={{ marginTop: '20px', marginBottom:'12px', fontSize:'12px', color:'#32325d', fontWeight:'bold'}} span={6}>受益人信息</Col>
                                </Row>
                                <Row>
                                    <Col style={{ margin: '5px 0px', fontSize:'12px', color:'#6b7c93'}} span={3}>受益人</Col>
                                    <Col style={{ margin: '5px 0px', fontSize:'12px', color:'#32325d' }} span={6}>河北旭日化工有限公司</Col>
                                    <Col span={3}></Col>
                                    <Col style={{ margin: '5px 0px', fontSize:'12px', color:'#6b7c93' }} span={3}>地址</Col>
                                    <Col style={{ margin: '5px 0px', fontSize:'12px', color:'#32325d' }} span={6}>河北省沧州市渤海新区69号</Col>
                                </Row>
                                <Row>
                                    <Col style={{ margin: '5px 0px', fontSize:'12px', color:'#6b7c93'}} span={3}>开户行</Col>
                                    <Col style={{ margin: '5px 0px', fontSize:'12px', color:'#32325d' }} span={6}>中国银行沧州分行</Col>
                                    <Col span={3}></Col>                            
                                    <Col style={{ margin: '5px 0px', fontSize:'12px', color:'#6b7c93' }} span={3}>账号</Col>
                                    <Col style={{ margin: '5px 0px', fontSize:'12px', color:'#32325d' }} span={6}>157700000012444</Col>
                                </Row>
                            </div>
                            <div>
                                <Row>
                                    <Col style={{ marginTop: '25px', marginBottom:'12px', fontSize:'12px', color:'#32325d', fontWeight:'bold'}} span={6}>开证行信息</Col>
                                </Row>
                                <Row>
                                    <Col style={{ margin: '5px 0px', fontSize:'12px', color:'#6b7c93'}} span={3}>开证行</Col>
                                    <Col style={{ margin: '5px 0px', fontSize:'12px', color:'#32325d' }} span={6}>中国银行沧州分行</Col>
                                    <Col span={3}></Col>
                                    <Col style={{ margin: '5px 0px', fontSize:'12px', color:'#6b7c93' }} span={3}>地址</Col>
                                    <Col style={{ margin: '5px 0px', fontSize:'12px', color:'#32325d' }} span={6}>河北省沧州市中山路81号 邮编21005</Col>
                                </Row>
                            </div>
                            <div>
                                <Row>
                                    <Col style={{ marginTop: '25px', marginBottom:'12px', fontSize:'12px', color:'#32325d', fontWeight:'bold'}} span={6}>通知行信息</Col>
                                </Row>
                                <Row>
                                    <Col style={{ margin: '5px 0px', fontSize:'12px', color:'#6b7c93'}} span={3}>通知行</Col>
                                    <Col style={{ margin: '5px 0px', fontSize:'12px', color:'#32325d' }} span={6}>中国银行沧州分行</Col>
                                    <Col span={3}></Col>
                                    <Col style={{ margin: '5px 0px', fontSize:'12px', color:'#6b7c93' }} span={3}>地址</Col>
                                    <Col style={{ margin: '5px 0px', fontSize:'12px', color:'#32325d' }} span={6}>河北省沧州市中山路81号 邮编21005</Col>
                                </Row>
                            </div>
                            <div>

                            </div>
                                <Row>
                                    <Col style={{ marginTop: '30px', marginBottom:'6px', fontSize:'12px', color:'#32325d', fontWeight:'bold'}} span={6}></Col>
                                </Row>
                                <Table
                                    columns={lccolumns}
                                    dataSource={lcdata}
                                    pagination={false}
                                    showHeader={false}                                                
                                />
                                <Table
                                    columns={columns}
                                    dataSource={data}
                                    pagination={false}
                                    showHeader={false}                                                
                                />
                            <div>
                        </div>
                        </div>
                    </TabPane>

                   <TabPane tab="交易进度" key="3">
                         <div style={{ margin: '10px 25px'}}>                         
                            <Row>
                                <Timeline>
                                    {
                                        this.state.flowItems
                                    }
                                </Timeline>
                            </Row>
                    </div> 
                    </TabPane>
                    </Tabs>

                </Content>
                    <ApproveDialog
                        ref={this.saveApproveRef}
                        visible={this.state.approveDialogVisible}
                        onCancel={this.closeApproveDialog}
                        onOk={this.handleApprove}
                    />
            </Layout>
        )
    }
}

export default LetterCLosing
