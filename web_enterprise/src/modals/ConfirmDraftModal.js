import React from 'react'
import { Timeline, Tag, Tabs, Row, Card, Layout, Breadcrumb, Collapse, InputNumber, Table, Icon, Steps, Form, Input, Select, Checkbox, DatePicker, Col, Radio, Button, Modal, Badge, Menu, Dropdown, message } from 'antd'
const Step = Steps.Step;

const CONSTANTS = require("../routes/constant");
const { Header, Content, Sider } = Layout;

const ConfirmDraftModal = (props) => {
    const { visible, onCancel, onSubmit, data, form } = props;
    const formItemLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 19 },
    };
    const attachmentColumns = [
        { title: '名称', dataIndex: 'FileName', key: 'FileName' },
        { title: '上传人', dataIndex: 'Uploader', key: 'Uploader' },
        { title: '文件哈希值', dataIndex: 'FileHash', key: 'FileHash' },
        { title: '操作', key: 'operation', render: (text, record, index) => <span><a target="_blank" href={CONSTANTS.URL_FILE_SERVER+record.FileUri+"/"+record.FileName}>{CONSTANTS.COMM_OP_FILE}</a></span>, }
    ];

    const record = data ? data.detail.Record : [],
        applicationForm = record.ApplicationForm ? record.ApplicationForm : [],
        applicant = applicationForm.Applicant ? applicationForm.Applicant : [],
        beneficiary = applicationForm.Beneficiary ? applicationForm.Beneficiary : [],
        issuingBank = applicationForm.IssuingBank ? applicationForm.IssuingBank : [],
        advisingBank = applicationForm.AdvisingBank ? applicationForm.AdvisingBank : [],
        goodsInfo = applicationForm.GoodsInfo ? applicationForm.GoodsInfo : [],
        contract = applicationForm.Contract ? applicationForm.Contract : {},
        attachments = applicationForm.Attachments ? applicationForm.Attachments : [],
        transport = (goodsInfo.allowPartialShipment === "1" ? "允许分批 " : '') + (goodsInfo.allowTransShipment === "1" ? "允许转运" : ''),
        isAtSight = applicationForm.isAtSight === "true" ? "即期" : ("发运/服务交付" + applicationForm.afterSight + "日后"),
        tradeType = goodsInfo.tradeNature === "1" ? "货物贸易" : "服务贸易",
        chargeInIssueBank = "在开证行产生的费用，由" + (applicationForm.chargeInIssueBank === "1" ? "申请人" : "受益人") + "提供。",
        chargeOutIssueBank = "在开证行外产生的费用，由" + (applicationForm.chargeOutIssueBank === "1" ? "申请人" : "受益人") + "提供。",
        docDelay = "单据必须自运输单据签发日" + applicationForm.docDelay + "日内提交，且不能低于信用证有效期。",
        Negotiate = applicationForm.Negotiate==="1"?"以下银行可议付":(applicationForm.Negotiate==="2"?"任意银行可议付":"不可议付"),
        Transfer = applicationForm.Transfer==="1"?"可转让":"不可转让",
        Confirmed = applicationForm.Confirmed==="1"?"可保兑":"不可保兑",
        OverLow = "短装:"+applicationForm.Lowfill+"    溢装:"+applicationForm.Overfill ;
    return (
        <Modal
            visible={visible}
            title="信用证草稿确认"
            okText="确认"
            cancelText="取消"
            onCancel={onCancel}
            onOk={onSubmit}
            width="80%"
            style={{ top: 20}}
        >
            <Layout style={{ padding: '1px 1px' }}>
                <Content style={{ background: '#fff', padding: 0, margin: '0' }}>
                    <div style={{ margin: '12px 16px' }}>
                        <Row>
                            <Col style={{ marginBottom: '12px', fontSize: '12px', color: '#32325d' }} span={6}>申请人信息</Col>
                        </Row>
                        <Row>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>申请人</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{applicant.Name}</Col>
                            <Col span={3}></Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>地址</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{applicant.Address}</Col>
                        </Row>
                        <Row>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>开户行</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{applicant.DepositBank}</Col>
                            <Col span={3}></Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>账号</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{applicant.Account}</Col>
                        </Row>
                        <Row>
                            <Col style={{ marginTop: '20px', marginBottom: '12px', fontSize: '12px', color: '#32325d' }} span={6}>受益人信息</Col>
                        </Row>
                        <Row>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>受益人</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{beneficiary.Name}</Col>
                            <Col span={3}></Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>地址</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{beneficiary.Address}</Col>
                        </Row>
                        <Row>
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

                        <Row>
                            <Col style={{ marginTop: '20px', marginBottom: '12px', fontSize: '12px', color: '#32325d' }} span={6}>详细信息</Col>
                        </Row>
                        <Row>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>结算货币</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{applicationForm.Currency}</Col>
                            <Col span={3}></Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>金额</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>信用证:{applicationForm.amount}  保证金:{applicationForm.EnsureAmount}</Col>
                        </Row>
                        <Row>
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
                        <Row>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>最迟装运日期</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{goodsInfo.latestShipmentDate}</Col>
                            <Col span={3}></Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#6b7c93' }} span={3}>运输方式</Col>
                            <Col style={{ margin: '5px 0px', fontSize: '12px', color: '#32325d' }} span={6}>{goodsInfo.ShippingWay}</Col>
                        </Row>

                        <Row>
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
                        <Row>
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
                </Content>
            </Layout>
        </Modal>
    );
};


export default ConfirmDraftModal;
