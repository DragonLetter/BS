import React from 'react'
import { Timeline, Upload, Popconfirm, Tag, Tabs, Row, Card, Layout, Breadcrumb, Collapse, InputNumber, Table, Icon, Steps, Form, Input, Select, Checkbox, DatePicker, Col, Radio, Button, Modal, Badge, Menu, Dropdown, message } from 'antd'
import { fetch_get, fetch_post, request, getFileUploadOptions } from '../utils/common';
import moment from 'moment';

const EditableCell = ({ editable, value, onChange }) => (
    <div>
        {editable
            ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
            : value
        }
    </div>
);

class HandoverBillsModal extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '货运单号',
            dataIndex: 'bolNo',
            width: '15%',
            render: (text, record) => this.renderColumns(text, record, 'bolNo'),
        },
        {
            title: '货物编号',
            dataIndex: 'goodsNo',
            width: '15%',
            render: (text, record) => this.renderColumns(text, record, 'goodsNo'),
        },
        {
            title: '货物信息',
            dataIndex: 'goodsInfo',
            width: '30%',
            render: (text, record) => this.renderColumns(text, record, 'goodsInfo'),
        },
        {
            title: '发货时间',
            dataIndex: 'shippingTime',
            width: '20%',
            render: (text, record) => this.renderColumns(text, record, 'shippingTime'),
        },
        {
            title: '操作',
            dataIndex: 'operation',
            width: '10%',
            render: (text, record) => {
                const { editable } = record;
                return (
                    <div className="editable-row-operations">
                        {
                            editable ?
                                <span>
                                    <a onClick={() => this.save(record.key)}>保存</a>
                                </span>
                                :
                                <span><a onClick={() => this.edit(record.key)}>编缉</a>
                                    <Popconfirm title="确定删除该项吗?" onConfirm={() => this.delete(record.key)}>
                                        <a>  删除</a>
                                    </Popconfirm></span>
                        }
                    </div>
                );
            },
        }];

        this.state = {
            dataSource: [{
                key: '0',
                bolNo: '',
                goodsNo: '',
                goodsInfo: '',
                shippingTime: '',
            }],
            fileList: [],
            count: 1,
        };
    }

    renderColumns(text, record, column) {
        if ('shippingTime' == column) {
            return (
                <DatePicker
                    placeholder="发货日期"
                    format="YYYY-MM-DD"
                    disabled={record.editable ? false : true}
                    onChange={value => this.handleDateChange(value, record.key, column)}
                />
            );
        } else {
            return (
                <EditableCell
                    editable={record.editable}
                    value={text}
                    onChange={value => this.handleChange(value, record.key, column)}
                />
            );
        }
    }

    handleAdd = () => {
        const { count, dataSource } = this.state;
        const newData = {
            key: count,
            bolNo: '',
            goodsNo: '',
            goodsInfo: '',
            shippingTime: '',
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
    }

    handleDateChange(value, key, column) {
        const newData = [...this.state.dataSource];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target[column] = value.format('YYYY-MM-DD').toString();
            this.setState({ dataSource: newData });
        }
    }

    handleChange(value, key, column) {
        const newData = [...this.state.dataSource];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target[column] = value;
            this.setState({ dataSource: newData });
        }
    }

    edit(key) {
        const newData = [...this.state.dataSource];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target.editable = true;
            this.setState({ dataSource: newData });
        }
    }

    save(key) {
        const newData = [...this.state.dataSource];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            delete target.editable;
            this.setState({ dataSource: newData });
            this.cacheData = newData.map(item => ({ ...item }));
        }
        this.props.onBillChange(newData);
    }

    delete(key) {
        const dataSource = [...this.state.dataSource];
        this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
        this.props.onBillChange(dataSource);
    }

    render() {
        const { dataSource, fileList } = this.state;
        const columns = this.columns;
        const { visible, onCancel, onSubmit, data, form, onFileChange } = this.props;
        const record = data ? data.detail.Record : [],
            // applicationForm = record.ApplicationForm ? record.ApplicationForm : [],
            // deposit = record.LCTransDeposit ? record.LCTransDeposit : [],
            // amount = applicationForm.amount - deposit.depositAmount,
            title = "交单——" + record.lcNo;
        function onDocumentChange(info) {
            let attachment = {};
            // attachment.FileName = info.file.name;
            attachment.FileName = info.file.response.fileName;
            attachment.FileHash = info.file.response.fileHash;
            attachment.FileSignature = info.file.response.signature;
            attachment.Uploader = info.file.response.uploader;
            attachment.FileUri = info.file.response.dirName;
            fileList.push(attachment);
            onFileChange(fileList);
        }
        const documentFileUploadOptions = getFileUploadOptions('handover', onDocumentChange);
        // const documentFileUploadOptions = {
        //     name: 'file',
        //     action: 'http://localhost:8080/api/Document/Upload/default',

        //     onChange(info) {
        //         if (info.file.status !== 'uploading') {
        //             console.log(info.file, info.fileList);
        //         }
        //         if (info.file.status === 'done') {
        //             let attachment = {};
        //             attachment.FileName = info.file.name;
        //             attachment.FileHash = info.file.response.fileHash;
        //             attachment.FileSignature = info.file.response.signature;
        //             fileList.push(attachment);
        //             onFileChange(fileList);
        //             message.success(`${info.file.name} 上传成功`);
        //         } else if (info.file.status === 'error') {
        //             message.error(`${info.file.name} 上传失败`);
        //         }
        //     },
        //     onRemove(file) {
        //         console.log(file);
        //     }
        // };
        return (
            <Modal
                visible={visible}
                title={title}
                okText="确认"
                cancelText="取消"
                onCancel={onCancel}
                onOk={onSubmit}
                width="80%"
            >
                <div>
                    <Row>
                        <Col style={{ marginTop: '20px', marginBottom: '12px', fontSize: '12px', color: '#32325d' }} span={6}>交单金额：<InputNumber
                            id="handoverAmount"
                            min={1}
                            // formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            placeholder="交单金额"
                        />
                        </Col>
                    </Row>
                    <Table bordered dataSource={dataSource} columns={columns} />
                    <Button className="editable-add-btn" onClick={this.handleAdd} style={{ marginBottom: 8 }} span={20}>添加</Button>
                </div>
                {/* <Row>
                    <Col style={{ marginBottom: '12px', fontSize: '15px', color: '#32325d' }} span={6}>附件</Col>
                </Row>
                <Row gutter={40} style={{ marginBottom: 10 }}>
                    <Col span={12} key={0}>
                        <Upload style={{ marginLeft: 30 }} {...documentFileUploadOptions}>
                            <Button>
                                <Icon type="upload" /> 点击上传
                                    </Button>
                        </Upload>
                    </Col>
                </Row> */}
            </Modal>
        );
    }
}

export default HandoverBillsModal;