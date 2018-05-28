import React, {Component} from 'react';
//import Using ES6 syntax
import WeUI from 'react-weui';
//import styles
import

    'weui';
import {CSS} from '../../UserCenter/styles/Register.css'

const {Button, ButtonArea, Toptips, Input} = WeUI;
let pathHeader='/weixin';
export default class RegisterLoginItem extends Component {
    constructor(props) {
        super(props);
        this.loginClick = this.loginClick.bind(this);
        this.forgetPasswordClick = this.forgetPasswordClick.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.state = ({
            count: 61,
            clearTime: 0,
            type: 1,
            showWarn: false,
            warnTimer: null,
            tipText: "",
            canClick: true,
        });
        this.state.warnTimer && clearTimeout(this.state.warnTimer);
    }

    showWarn(text) {
        this.setState({showWarn: true, tipText: text});

        this.state.warnTimer = setTimeout(() => {
            this.setState({showWarn: false});
        }, 2000);
    }

    componentWillMount() { //组件即将被插入

    }

    forgetPasswordClick() {
        HistoryManager.register(pathHeader+"/Login");
        let url = pathHeader+"/ResetPassword";
        HistoryManager.register(url);
        window.location.href = url;
    }

    loginClick() { //登录
        let phoneNum = document.getElementById("PhoneNum").value;
        let password = document.getElementById("password").value;
        this.props.callbackParent(phoneNum, password)
    }

    startTimers() {
        if (this.state.count < 1) {
            //关闭定时器,开启按钮
            clearTimeout(this.state.clearTime);
            this.setState({canClick: true});
            document.getElementById("html").innerHTML = "获取验证码";
            this.setState({
                count: 61
            })
        } else {
            //禁止按钮点击
            var time = this.state.count;
            time -= 1;
            this.setState({
                count: time
            });
            this.setState({canClick: false});
            document.getElementById("html").innerHTML = "(" + time + "s)重新获取";
            let temp = setTimeout(
                () => {
                    this.startTimers()
                },
                1000
            );
            this.setState({
                clearTime: temp
            })
        }
    }

    handleClick() { //验证码计时
        // alert("canClick:"+this.state.canClick);
        if (this.state.canClick) {
            let phoneNum = document.getElementById("PhoneNum").value;
            let self = this;
            if (!(/^1(3|4|5|7|8)\d{9}$/.test(phoneNum))) {
                self.showWarn("手机号码有误");
                return false;
            }
            if (this.props.data.isForget == "1") { //忘记密码获取验证码
                // alert("忘记密码获取验证码");
                let fromData = new FormData();
                fromData.append("mobile", phoneNum);
                fetch(getHost() + "/user/resetPassword/identify", {
                    method: 'POST',
                    credentials: 'include',
                    body: fromData
                }).then(response => {
                    // alert("response:" + JSON.stringify(response.json()));
                    return response.json();
                }).then(json => {
                    if (json.result===1) {
                        // alert("success");
                        self.startTimers()
                    } else {
                        self.showWarn(json.error.message);
                    }
                }).catch(e => {
                    // alert("网络不好了，请重试！"+ JSON.stringify(e));
                })
            } else if (this.props.data.isForget == "0") { //注册账号获取验证码
                // alert("注册获取验证码");
                let fromData = new FormData();
                fromData.append("mobile", phoneNum);
                fetch(getHost() + "/user/register/identify", {
                    method: 'POST',
                    credentials: 'include',
                    body: fromData
                }).then(response => response.json()).then(json => {
                    if (json.result===1) {
                        self.startTimers()
                    } else {
                        self.showWarn(json.error.message);
                    }
                })
            }
        }
    }

    isDisplayMessageCode() {
        let tempArea = null;
        if (this.props.data.messagesCodeTitle == "") {
            tempArea = null;
        } else {
            tempArea = <div className="messageCodeDiv" id="html"
                            onClick={this.handleClick}>{this.props.data.messagesCodeTitle}</div>
        }
        return tempArea;
    }

    isForgetPassword() {
        let tempArea = null;
        if (this.props.data.forgetPassword == "") {
            tempArea = null;
        } else {
            tempArea = <div className="forgetPassword">
                <span onClick={this.forgetPasswordClick}>{this.props.data.forgetPassword}</span></div>
        }
        return tempArea;
    }

    IndexClick(){
        localStorage.setItem("HomeIndex", 0);
        window.location.href = pathHeader+"/";
    }
    render() {
        return (
            <div>
                {/*<div className="Title">{this.props.data.title}</div>*/}
                {/*<div className="Describe">{this.props.data.describe}</div>*/}
                <div className="Title"><img className="logoIcon" onClick={this.IndexClick}  src={this.props.data.logo}/></div>
                <div className="inputTitle">
                    {/*<div className="inputNameDiv">{this.props.data.inputName1}</div>*/}
                    <div>
                        <Input type={this.props.data.phoneNumType} maxLength="20" className="loginInput" id="PhoneNum"
                               placeholder="请输入用户名"/>
                        {this.isDisplayMessageCode()}
                    </div>
                </div>
                <div className="input2Title">
                    {/*<div className="inputNameDiv">{this.props.data.inputName2}</div>*/}
                    <div>
                        <Input type={this.props.data.type} maxLength="20" className="loginInput" id="password"
                               placeholder="请输入密码"/>
                    </div>
                </div>
                {this.isForgetPassword()}
                <div style={{marginTop: "5rem"}}>
                    <ButtonArea>
                        <Button className="loginButton" type="warn"
                                onClick={this.loginClick}>{this.props.data.buttonTitle}</Button>
                    </ButtonArea>
                </div>
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
            </div>
        )
    }
}
//属性默认值
RegisterLoginItem.defaultProps = {};

//属性
RegisterLoginItem.propTypes = {
    data: React.PropTypes.object,
};