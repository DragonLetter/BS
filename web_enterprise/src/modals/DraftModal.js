import React from 'react'
import { Timeline, Tag, Tabs, Row, Card, Layout, Breadcrumb, Collapse, InputNumber, Table, Icon, Steps, Form, Input, Select, Checkbox, DatePicker, Col, Radio, Button, Modal, Badge, Menu, Dropdown, message } from 'antd'
const Step = Steps.Step;

const { Header, Content, Sider } = Layout;

const DraftModal = (props) => {
    const { visible, onCancel, onSubmit, data, form } = props;
    const formItemLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 19 },
    }, attachmentColumns = [
        { title: '名称', dataIndex: 'FileName', key: 'FileName' },
        { title: '上传人', dataIndex: 'Uploader', key: 'Uploader' },
        { title: '文件哈希值', dataIndex: 'FileHash', key: 'FileHash' },
    ],
        record = data ? (data.Record ? data.Record : data.detail.Record) : [],
        applicationForm = record.ApplicationForm ? record.ApplicationForm : [],
        applicant = applicationForm.Applicant ? applicationForm.Applicant : [],
        beneficiary = applicationForm.Beneficiary ? applicationForm.Beneficiary : [],
        issuingBank = applicationForm.IssuingBank ? applicationForm.IssuingBank : [],
        advisingBank = applicationForm.AdvisingBank ? applicationForm.AdvisingBank : [],
        goodsInfo = applicationForm.GoodsInfo ? applicationForm.GoodsInfo : [],
        contract = applicationForm.Contract ? applicationForm.Contract : {},
        attachments = applicationForm.Attachments ? applicationForm.Attachments : [],
        depositInfo = record.LCTransDeposit ? record.LCTransDeposit : [],
        title = "国内信用证详情——" + (record.lcNo || '等待银行审核'),
        transport = (goodsInfo.allowPartialShipment === "1" ? "允许分批/分次 " : '') + (goodsInfo.allowTransShipment === "1" ? "允许转运/分期" : ''),
        isAtSight = applicationForm.isAtSight === "true" ? "即期" : ("发运/服务交付" + applicationForm.afterSight + "日后"),
        tradeType = goodsInfo.tradeNature === "1" ? "货物贸易" : "服务贸易",
        chargeInIssueBank = "在开证行产生的费用，由" + (applicationForm.chargeInIssueBank === "1" ? "申请人" : "受益人") + "提供。",
        chargeOutIssueBank = "在开证行外产生的费用，由" + (applicationForm.chargeOutIssueBank === "1" ? "申请人" : "受益人") + "提供。",
        docDelay = "单据必须自运输单据签发日" + applicationForm.docDelay + "日内提交，且不能低于信用证有效期。",
        Negotiate = applicationForm.Negotiate==="1"?"以下银行可议付":(applicationForm.Negotiate==="2"?"任意银行可议付":"不可议付"),
        Transfer = applicationForm.Transfer==="1"?"可转让":"不可转让",
        Confirmed = applicationForm.Confirmed==="1"?"可保兑":"不可保兑",
        OverLow = "短装:"+applicationForm.Lowfill+"    溢装:"+applicationForm.Overfill,
        transProgressFlow = record.TransProgressFlow ? record.TransProgressFlow : [],
        timeItem = transProgressFlow.reverse().map((flow, index) => <Timeline.Item key={index} dot={<Icon type="clock-circle-o" style={{ fontSize: '16px' }} />} color="red">
            <p style={{ fontWeight: 800 }}>{flow.Status}</p>
            <p style={{ marginTop: 6 }}>{flow.time.split("T")[0] + " " + flow.Name + " " + flow.Status}</p>
            <p style={{ marginTop: 6 }}>{flow.Description}</p>
        </Timeline.Item>);
        let depositDisplay = {display: "none"}, handoverDisplay = {display: "none"};
    switch(record.CurrentStep){
        case "银行发证":
        case "通知行收到信用证通知":
        case "受益人接收信用证":
        case "申请人修改信用证":
        case "多方会签":
        case "受益人交单":
            depositDisplay = {display: ""};
            break;
        case "通知行审核交单":
        case "发证行承兑或拒付":
        case "开证行审核赎单":
        case "申请人赎单":
        case "闭卷":
        case "结束":
            depositDisplay = {display: ""};
            handoverDisplay = {display: ""};
            break;
    }
    return (
        <Modal
            visible={visible}
            title={title}
            okText="确认"
            cancelText="取消"
            onCancel={onCancel}
            onOk={onSubmit}
            width="80%"
            style={{ top: 20 }}
        >
            <Layout style={{ padding: '1px 1px' }}>
                <Content style={{ background: '#fff', padding: 0, margin: '0' }}>
                    <div style={{ margin: '12px 16px', borderTop: '1px solid #e6ebf1' }}>
                        <Row key={0}>
                            <Col style={{ marginTop: '20px', marginBottom: '12px', fontSize: '12px', color: '#32325d' }} span={6}>申请人信息</Col>
                        </Row>
                        <Row key={1}>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>申请人</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{applicant.Name}</Col>
                            <Col span={3}></Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>地址</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{applicant.Address}</Col>
                        </Row>
                        <Row key={2}>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>开户行</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{applicant.DepositBank}</Col>
                            <Col span={3}></Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>账号</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{applicant.Account}</Col>
                        </Row>
                        <Row key={3}>
                            <Col style={{ marginTop: '20px', marginBottom: '12px', fontSize: '12px', color: '#32325d' }} span={6}>受益人信息</Col>
                        </Row>
                        <Row key={4}>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>受益人</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{beneficiary.Name}</Col>
                            <Col span={3}></Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>地址</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{beneficiary.Address}</Col>
                        </Row>
                        <Row key={5}>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>开户行</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{beneficiary.DepositBank}</Col>
                            <Col span={3}></Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>账号</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{beneficiary.Account}</Col>
                        </Row>
                        <Row key={5}>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>是否可议付</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{Negotiate}</Col>
                            <Col span={3}></Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>是否可转让</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{Transfer}</Col>
                        </Row>
                        <Row key={5}>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>是否可保兑</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{Confirmed}</Col>
                            <Col span={3}></Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}></Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{}</Col>
                        </Row>

                        <Row key={6}>
                            <Col style={{ marginTop: '20px', marginBottom: '12px', fontSize: '12px', color: '#32325d' }} span={6}>详细信息</Col>
                        </Row>
                        <Row key={7}>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>结算货币</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{applicationForm.Currency}</Col>
                            <Col span={3}></Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>金额</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>信用证:{applicationForm.amount}  保证金:{applicationForm.EnsureAmount}</Col>
                        </Row>
                        <Row key={8}>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>到期日</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{applicationForm.expiryDate}</Col>
                            <Col span={3}></Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>到期地点</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{applicationForm.ExpiryPlace}</Col>
                        </Row>
                        <Row key={9}>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>远期付款期限</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{isAtSight}</Col>
                            <Col span={3}></Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>货物运输</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{transport}</Col>
                        </Row>
                        <Row key={10}>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>最迟装运日期</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{goodsInfo.latestShipmentDate}</Col>
                            <Col span={3}></Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>运输方式</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{goodsInfo.ShippingWay}</Col>
                        </Row>

                        <Row key={11}>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>装运地点</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{goodsInfo.ShippingPlace}</Col>
                            <Col span={3}></Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>目的地</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{goodsInfo.ShippingDestination}</Col>
                        </Row>

                        <Row key={12}>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>贸易性质</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{tradeType}</Col>
                            <Col span={3}></Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>溢短装</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{OverLow}</Col>
                        </Row>

                        <Row key={13}>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>货物描述</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={21}>{goodsInfo.GoodsDescription}</Col>
                        </Row>

                        <Row style={{ height: 70 }} key={14}>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>其他条款</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d', height: '40px' }} span={21}><div>{chargeInIssueBank}<br />{chargeOutIssueBank}<br />{docDelay}<br />发起日期不能早于开证日期。</div></Col>
                        </Row>
                    </div>
                    <div style={{ margin: '12px 16px', borderTop: '1px solid #e6ebf1', minHeight: 20 }}></div>

                    {/**
                    * 合同附件部分
                */}
                    <div style={{ margin: '12px 16px' }}>
                        <Row key={15}>
                            <Col style={{ marginTop: '5px', fontWeight: 800, fontSize: '13px', color: '#32325d' }} span={12}>合同附件</Col>
                            <Col style={{ marginTop: '5px', fontSize: '13px', textAlign: 'right' }} span={12} offset={0}>
                            </Col>
                        </Row>
                    </div>
                    <div style={{ margin: '16px 16px', borderTop: '1px solid #e6ebf1' }}>
                        <Table
                            columns={attachmentColumns}
                            dataSource={attachments}
                            pagination={false}
                            showHeader={false}
                        />
                    </div>

                    <div style={depositDisplay}>
                        <div style={{ marginTop: '30px', marginLeft: '16px', marginRight: '16px', marginBottom: '15px' }}>
                            <Row key={16}>
                                <Col style={{ marginTop: '25px', fontWeight: 800, fontSize: '13px', color: '#32325d' }} span={9}>保证金信息</Col>
                                <Col style={{ marginTop: '20px', fontSize: '13px', textAlign: 'right' }} span={15} offset={0}>
                                </Col>
                            </Row>
                        </div>
                        <div style={{ margin: '12px 16px', borderTop: '1px solid #e6ebf1' }}>
                            <Row key={17}>
                                <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>应缴金额</Col>
                                <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{depositInfo.depositAmount}</Col>
                                <Col span={3}></Col>
                                <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>已缴金额</Col>
                                <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{depositInfo.commitAmount}</Col>
                            </Row>
                            <Row key={18}>
                                <Col style={{ marginTop: '20px', marginBottom: '12px', fontSize: '12px', color: '#32325d' }} span={6}>单据信息</Col>
                            </Row>
                            <div style={{ margin: '16px 16px', borderTop: '1px solid #e6ebf1' }}>
                                <Table
                                    columns={attachmentColumns}
                                    dataSource={contract.DepositDoc}
                                    pagination={false}
                                    showHeader={false}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={handoverDisplay}>
                        <div style={{ marginTop: '30px', marginLeft: '16px', marginRight: '16px', marginBottom: '15px' }}>
                            <Row key={19}>
                                <Col style={{ marginTop: '25px', fontWeight: 800, fontSize: '13px', color: '#32325d' }} span={9}>交单信息</Col>
                                <Col style={{ marginTop: '20px', fontSize: '13px', textAlign: 'right' }} span={15} offset={0}>
                                </Col>
                            </Row>
                        </div>
                        <div style={{ margin: '12px 16px', borderTop: '1px solid #e6ebf1' }}>
                            <Row key={20}>
                                <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>应缴金额</Col>
                                <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{depositInfo.depositAmount}</Col>
                                <Col span={3}></Col>
                                <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>已缴金额</Col>
                                <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{depositInfo.commitAmount}</Col>
                            </Row>
                            <Row key={21}>
                                <Col style={{ marginTop: '20px', marginBottom: '12px', fontSize: '12px', color: '#32325d' }} span={6}>单据信息</Col>
                            </Row>
                            <div style={{ margin: '16px 16px', borderTop: '1px solid #e6ebf1' }}>
                                <Table
                                    columns={attachmentColumns}
                                    dataSource={contract.DepositDoc}
                                    pagination={false}
                                    showHeader={false}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '30px', marginLeft: '16px', marginRight: '16px', marginBottom: '15px' }}>
                        <Row key={22}>
                            <Col style={{ marginTop: '25px', fontWeight: 800, fontSize: '13px', color: '#32325d' }} span={9}>交易进度</Col>
                            <Col style={{ marginTop: '20px', fontSize: '13px', textAlign: 'right' }} span={15} offset={0}>
                            </Col>
                        </Row>
                    </div>
                    <div style={{ margin: '12px 16px', borderTop: '1px solid #e6ebf1' }}>
                        <Row key={23}>
                            <Col style={{ marginTop: '25px', fontWeight: 800, fontSize: '13px', color: '#32325d' }} span={24}>
                                <Timeline>
                                    {timeItem}
                                </Timeline>
                            </Col>
                        </Row>
                    </div>
                </Content>
            </Layout>
        </Modal>
    );
};


export default DraftModal;
