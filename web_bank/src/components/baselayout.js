import React from 'react'
import ReactDom from 'react-dom'
import {fetch_get, fetch_post} from '../common'
import {Router, Route, Link, hashHistory, IndexRoute, Redirect, IndexLink} from 'react-router'
import {Layout, Menu,Breadcrumb, Icon, Switch, Input, Popover} from 'antd'

const { Header, Content, Sider, Footer } = Layout;
const SubMenu = Menu.SubMenu
const Search = Input.Search

export const loginAddr = "http://localhost:8000/#/";

class BaseLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: '',
            username: '',
            notice:'',
            documents:''
        };
    }

    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    }

    componentDidMount = () =>{
        fetch_get("/api/user/current")
        .then((res) => {
            if (res.status >= 200 && res.status < 300) {
                res.json().then((data) => {
                    sessionStorage.setItem("username", data.username);
                    sessionStorage.setItem("domain", data.domain);
                    sessionStorage.setItem("userType", data.userType);
                    sessionStorage.setItem("bankname", data.bank.name);
                    sessionStorage.setItem("bankno", data.bank.no);
                    sessionStorage.setItem("bankaddr", data.bank.address);
                    sessionStorage.setItem("bankemail", data.bank.email);
            });
        }
        if(res.status === 401){
            window.location.href = loginAddr;
        }
    });
    }

    render = () => {
        const helpCenter = (
            <div>
              <p style={{borderBottom: "1px solid #ececec", width: 130, padding: 5, textAlign: 'center'}}><a target="_blank" rel="noopener noreferrer" href="https://stripe.com/docs">帮助文档</a></p>
              <p style={{borderBottom: "1px solid #ececec", width: 130, padding: 5, textAlign: 'center'}}><a target="_blank" rel="noopener noreferrer" href="https://support.stripe.com/">技术支持</a></p>              
            </div>
          );
        
        const userCenter = (
          <div>
            <p style={{borderBottom: "1px solid #ececec", width: 130, padding: 5, textAlign: 'center'}}><a target="_blank" rel="noopener noreferrer" href="#">个人账户</a></p>
            <p style={{borderBottom: "1px solid #ececec", width: 130, padding: 5, textAlign: 'center'}}><a target="_blank" rel="noopener noreferrer" href="#">退出系统</a></p>
          </div>
        );

        const notifications = (
          <div>
            <p style={{width: 180, padding: 5, textAlign: 'center'}}><Icon type="exclamation-circle-o" style={{fontSize:13, marginRight: 5}}/>您还没有任何通知。</p>
          </div>
        );

        return (
            <Layout>
                <Header className="header">
                    <div className="logo" />
                    <div style={{fontSize: 15, color: 'white', height: 38, width: 300, display: 'inline', position: 'absolute', top: 0, left: 20}}>
                        <Link to="/lcpayment/index" style={{color: 'white'}}>数字信用证银行系统</Link>
                    </div>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['2']}
                        style={{ lineHeight: '64px', marginLeft: 200, float: 'right'}}
                    >
                        {/* <Search
                            placeholder="搜索"
                            style={{ width: 300, marginLeft: 20, marginRight:20, float: 'left'}}
                            onSearch={value => console.log(value)}
                        />
                        <SubMenu title={<Popover placement="bottom" content={helpCenter} trigger="click"><Icon type="question-circle-o" style={{fontSize:15}}/></Popover>}>
                        </SubMenu>
                        <SubMenu title={<Popover placement="bottom" title={"通知中心"} content={notifications} trigger="click"><Icon type="message" style={{fontSize:15}}/></Popover>}>
                        </SubMenu> */}
                        <SubMenu title={<Popover placement="bottom" content={userCenter} trigger="click"><Icon type="user" style={{fontSize:15}}/></Popover>}>
                        </SubMenu>
                    </Menu>
                </Header>
                <Layout>
                    <Sider width={210} style={{ background: '#fff', borderRight: '1px solid #e6ebf1' }}>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['0']}                        
                            defaultOpenKeys={['0']}
                            style={{ height: '100%', borderRight: 0}}
                            >
                            <Menu.Item key="1" style={{marginTop:'20px'}}>
                                <Link to="/lcpayment/tobeprocessed">
                                    <Icon type="user" />待处理的任务
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Link to="/lcpayment/letters">
                                    <Icon type="home" />国内信用证
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="3">
                                <Link to="/lcpayment/clients">
                                    <Icon type="user" />客户管理
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="4">
                                <Link to="/lcpayment/settings">
                                    <Icon type="home" />业务设置
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="5" display={sessionStorage.getItem('domain')==10?true:false}>
                                <Link to="/lcpayment/users">
                                    <Icon type="user" />用户管理
                                </Link>
                            </Menu.Item>
                    </Menu>
                    </Sider>
                    <Layout style={{minHeight:500, marginTop:'20px'}}>
                        {this.props.children}
                    </Layout>
                </Layout>
                <Footer style={{marginTop:'20px', borderTop: '1px solid #e6ebf1' }}>© 2017 龙账本区块链·DRAGONLEDGER 版权所有</Footer>                    
                
            </Layout>
        )
    }
}

export default BaseLayout;
