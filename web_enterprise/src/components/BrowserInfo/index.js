import React from 'react';
import { Row, Col, Card, Icon } from 'antd';
import CountUp from 'react-countup';
import { fetch_get, fetch_post } from '../../utils/common'

class BrowserInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      basicInfo: {},
    }
  }

  componentDidMount() {
    fetch_get("/api/blockchainstatus/channel")
      .then((res) => {
        console.log(res);
        if (res.status !== 200) {
          alert("error");
        }
        res.json().then((data) => {
          //console.log(data);
          //alert(data);
          this.setState({
            basicInfo: data,
          })
        })
      })
      .catch((error) => { alert("error") })
  }

  render() {
    const { figurecard } = this.props;

    console.log(this.state);

    return (
      <div>
        <Row gutter={16}>
          <Col span={6} key={0} style={{ padding: 0 }}>
            <div>
              <img src={require('../../assets/images/mokuai_1.png')} />
              <div style={{ position: 'absolute', right: 40, top: 30, }}>
                <p style={{ fontSize: 24, }}>节点数</p>
                <CountUp
                  start={0}
                  end={this.state.basicInfo.peerCount}
                  duration={2.75}
                  useEasing
                  useGrouping
                  separator=","
                  style={{ fontSize: 42, color: "#333333" }}
                />
              </div>
            </div>
          </Col>
          <Col span={6} key={1} style={{ padding: 0 }}>
            <div>
              <img src={require('../../assets/images/mokuai_2.png')} />
              <div style={{ position: 'absolute', right: 40, top: 30, }}>
                <p style={{ fontSize: 24, }}>区块数</p>
                <CountUp
                  start={0}
                  end={this.state.basicInfo.blockCount}
                  duration={2.75}
                  useEasing
                  useGrouping
                  separator=","
                  style={{ fontSize: 42, color: "#333333" }}
                />
              </div>
            </div>
          </Col>
          <Col span={6} key={2} style={{ padding: 0 }}>
            <div>
              <img src={require('../../assets/images/mokuai_3.png')} />
              <div style={{ position: 'absolute', right: 40, top: 30, }}>
                <p style={{ fontSize: 24, }}>交易数</p>
                <CountUp
                  start={0}
                  end={this.state.basicInfo.txCount}
                  duration={2.75}
                  useEasing
                  useGrouping
                  separator=","
                  style={{ fontSize: 42, color: "#333333" }}
                />
              </div>
            </div>
          </Col>
          <Col span={6} key={3} style={{ padding: 0 }}>
            <div>
              <img src={require('../../assets/images/mokuai_4.png')} />
              <div style={{ position: 'absolute', right: 40, top: 30, }}>
                <p style={{ fontSize: 24, }}>通道数</p>
                <CountUp
                  start={0}
                  end={this.state.basicInfo.channelCount}
                  duration={2.75}
                  useEasing
                  useGrouping
                  separator=","
                  style={{ fontSize: 42, color: "#333333" }}
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default BrowserInfo;
