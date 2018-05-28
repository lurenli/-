import React, {Component} from 'react';
import InputWithPic from '../../Common/InputWithPic/InputWithPic.jsx';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx'
import Base64 from "../../../assets/js/Base64";
import WeUI from 'react-weui';
import 'weui';
import {CSS} from '../styles/Register.css';

const {Button, ButtonArea, Toptips, Dialog} = WeUI;
let inputs = {
    width: "100%",
    padding: "3rem",
};
export default class LoginBind extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.BindClick = this.BindClick.bind(this);
        this.state = {
            showWarn: false,
            warnTimer: null,
             tipText: "",
             showSuccess: false,
             successTimer: null,
             openid:this.props.location.query.openid,
             type:this.props.location.query.type,
            nickname:this.props.location.query.nickname,
            username:"",
            password:"",
        };
        this.state.successTimer && clearTimeout(this.state.successTimer);
        this.state.warnTimer && clearTimeout(this.state.warnTimer);
    }


    componentWillMount() {

    }

    componentDidMount() {
    }

    showWarn(text) {
        this.setState({showWarn: true, tipText: text});

        this.state.warnTimer = setTimeout(() => {
            this.setState({showWarn: false});
        }, 2000);
    }

    showSuccess() {
        this.setState({showSuccess: true});
        this.state.successTimer = setTimeout(() => {
            this.setState({showSuccess: false});
            HistoryManager.removeAll();
            localStorage.setItem("HomeIndex", 0);
            location.href = '/weixin'
        }, 1000);
    }

    LeftClick() {
        HistoryManager.pageBack();
    }
    //确认绑定
    BindClick() {//绑定
        this.state.username= document.getElementById("userName").value;
        this.state.password= document.getElementById("password").value;
        let self = this;
        let pwd = Base64.encode(self.state.password);
        let fromData = new FormData();
        fromData.append("openid", self.state.openid);
        fromData.append("type", self.state.type);
        fromData.append("nickname", self.state.nickname);
        fromData.append("username", self.state.username);
        fromData.append("password", pwd);
        fetch(getHost() + "/rest/thirdpart/login/wap/bind", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                localStorage.setItem("webToken", json.data.token);//1为登录
                localStorage.setItem("openid", self.state.openid);//openid
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


    render() {
        return (
            <div>
                <NavigationBar Title="微信登录" LeftBar="true" LeftTitle="返回"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                <div style={inputs}>
                    <InputWithPic Id="userName" ImgSrc="/assets/images/userCenter/icon_user.png" Max="20"
                                  Placeholder="请输入用户名" />
                    <InputWithPic Id="password" ImgSrc="/assets/images/userCenter/icon_password.png"
                                  Placeholder="请输入密码" showType="password"/>
                </div>
                <div style={{marginTop: "3rem"}}>
                    <ButtonArea>
                        <Button className="loginButton" type="warn"
                                onClick={this.BindClick}>确认绑定</Button>
                    </ButtonArea>
                </div>
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
                <Toptips type="primary" show={this.state.showSuccess}>绑定成功</Toptips>
            </div>

        )
    }


}