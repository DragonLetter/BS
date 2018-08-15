
class BclcApi {
  constructor(Host, port) {
    this.Host = Host;
    this.Port = port;
  }

  // 保存交易数据
  UnionChainSaveData() {

    // 构造请求数据
    var UnionChainReq = {
    "trancode":"IB03",
    "trandata":{
        "TxData":{
        "OWNREF":"1233",
        "ISSUE_DT":"20170203",
        "ISS_BK_SC":"7211111111",
        "LC_TX_CODE":"BCL0101",
        "ADV_BK_SC":"CITICBNK",
        "LC_REF_ID":"7211111100000000",
        "LC_TYPE":"test",
        "LC_EXPIRY_DT":"20170202"
        },
        "ReceiveMember":"CIBKCNBJ",
        "rootId":"1",
        "CurStep":1,
        "LC_TX_CODE":"BCL0102",
        "NotifyMemberList":[]
      }
    };

    // 将请求转化为JSON串，发送给BCLC服务器端
    var JsonReq = JSON.stringify(UnionChainReq);
    BclcSockSendData(this.Host, this.port, JsonReq);

    // 获取服务器端响应结果
    var JsonResp = BclcSockRecvData();
    var JsonRespObj = JSON.parse(JsonResp);
  }

  // 读取交易数据
  UnionChainReadData() {
  }

  // 同步StepNo
  UnionChainRadStepNo() {
  }

  // 读取根交易列表
  UnionChainRadRootIds() {
  }

  // 获取未处理交易
  UnionChainReadPendingTx() {
  }

  // 删除待处理交易记录
  UnionChainDelPendingTx() {
  }

  // 模拟交易
  UnionChainSync() {
  }

  // 查询交易状态
  QueryTransactionState() {
  }

  // 数据迁移上链部分
  MigrateUnionChainData() {
  }

  // 读取信用证下TxID列表
  UnionChainRadTxIDs() {
  }
}