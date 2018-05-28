import React, {Component} from 'react';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx'
import RegisterItem from '../../Common/RegisterLoginItem/RegisterLoginItem.jsx';
//import Using ES6 syntax
import WeUI from 'react-weui';
import Base64 from '../../../assets/js/Base64.js';
import $ from 'jquery';
//import styles
import 'weui';
import {CSS} from '../styles/Register.css';

const {Toptips} = WeUI;
let pathHeader='/weixin';
export default class Login extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.LoginClick = this.LoginClick.bind(this);
        this.RegisterClick = this.RegisterClick.bind(this);
        this.wxClick = this.wxClick.bind(this);
        this.state = {
            data: {
                title: "登录",
                describe: "欢迎您",
                logo: "/assets/images/common/logo.png",
                inputName1: "",
                inputName2: "",
                messagesCodeTitle: "",
                forgetPassword: "忘记密码",
                buttonTitle: "登录",
                type: "password",
                phoneNumType: "text",
            },
            showWarn: false,
            showSuccess: false,
            warnTimer: null,
            successTimer: null,
            tipText: "",
        };
        this.state.warnTimer && clearTimeout(this.state.warnTimer);
        this.state.successTimer && clearTimeout(this.state.successTimer);
    }

    componentWillMount() { //组件即将被插入
        if(this.props.location.query.code){
            let openid=this.props.location.query.openid;
            let type=this.props.location.query.type;
            let nickname=this.props.location.query.nickname;
            let self = this;
            let fromData = new FormData();
            fromData.append("code", self.props.location.query.code);
            fromData.append("type", 'wap');
            fetch(getHost() + "/rest/thirdpart/login/wxLogin", {
                method: 'POST',
                credentials: 'include',
                body: fromData
            }).then(response => response.json()).then(json => {
                if (json.result === 1) {
                    let webToken = json.data.webToken;
                    if (json.data.message === "没有绑定账号") {
                        HistoryManager.register(pathHeader+"/Login");
                        let url = pathHeader+"/LoginBind?openid=" + openid + "&type=" + type + "&nickname=" + nickname;
                        HistoryManager.register(url);
                        window.location.href = url;
                    } else {
                        let self = this;
                        let fromData = new FormData();
                        fromData.append("webToken", webToken);
                        fetch(getHost() + "/rest/common/db/userInfo", {
                            method: 'POST',
                            credentials: 'include',
                            body: fromData
                        }).then(response => response.json()).then(json => {
                            if (json.result === 1) {
                                self.setState({
                                    userInfo: json.data
                                });
                                localStorage.setItem("webToken", webToken);//1为登录
                                self.showSuccess();
                            } else if (json.result === 2) {//登录失效
                                location.href = pathHeader+'/Login';
                            } else {
                                self.showWarn(json.message);
                            }
                        }).catch(e => {
                            self.showWarn("网络出现了点问题");
                        });
                    }
                } else {
                    self.showWarn(json.message);
                    console.log(json.message)
                }
            }).catch(e => {
                console.log("网络出现了点问题：" + e);
                self.showWarn("网络出现了点问题");
            });
        }
    }

    LeftClick() {
        localStorage.setItem("HomeIndex", 0);
        HistoryManager.pageBack();
    }

    showWarn(text) {
        this.setState({showWarn: true, tipText: text});
        this.state.warnTimer = setTimeout(() => {
            this.setState({showWarn: false});
        }, 2000);
    }

    //绑定成功，跳到首页
    showSuccess() {
        this.setState({showSuccess: true});
        this.state.successTimer = setTimeout(() => {
            this.setState({showSuccess: false});
            HistoryManager.pageBack();
        }, 1000);
    }

    login(phoneNum, password) {
        let self = this;
        let pwd = Base64.encode(password);
        let fromData = new FormData();
        fromData.append("username", phoneNum);
        fromData.append("password", pwd);
        fetch(getHost() + "/rest/buyer/wap/login", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                localStorage.setItem("webToken", json.webToken);//1为登录
                self.showSuccess();
            } else {
                self.showWarn(json.message);
                console.log(json.message)
            }
        }).catch(e => {
            console.log("网络出现了点问题：" + e);
            self.showWarn("网络出现了点问题");
        });
    }

    LoginClick(phoneNum, password) {
        if (password.length < 1 || password.length < 1) {
            this.showWarn("密码或手机不能为空");
            return false;
        } else {
            this.login(phoneNum, password);
        }
    }

    RegisterClick() {
        HistoryManager.register(pathHeader+"/Login");
        let url = pathHeader+"/Register";
        HistoryManager.register(url);
        window.location.href = url;
    }

    //点击微信登录，让微信发起授权
    wxClick() {
       let url="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx6eb2a1213254a1df&redirect_uri=http%3a%2f%2fwww.jinshang9.com%2fweixin%2fLogin&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect";
       window.open(url);
    }

    render() {
        return (
            <div>
                <NavigationBar Title="登录" LeftBar="true" LeftTitle="返回"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                <RegisterItem data={this.state.data} callbackParent={this.LoginClick}/>
                <div className="RegisterAccountDiv" onClick={this.RegisterClick}>还没注册?
                    <span style={{color: "red"}}>去注册</span>
                </div>
                {/*<div className="otherLogin">*/}
                    {/*<div className="otherItem" onClick={this.wxClick}>*/}
                    {/*<img className="otherImg" src="/assets/images/userCenter/login_wx.png"/>*/}
                     {/*<div>微信登录</div>*/}
                    {/*</div>*/}
                {/*</div>*/}
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
                <Toptips type="primary" show={this.state.showSuccess}> 登录成功 </Toptips>
            </div>
        )
    }
}
//属性默认值
Login.defaultProps = {};

//属性
Login.propTypes = {};