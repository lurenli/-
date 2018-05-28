import React, {Component} from 'react';
import WeUI from 'react-weui';


//import styles
import 'weui';
import {CSS} from '../../../assets/common.css';
import {myCSS} from '../style/Active.css';
const {
    Tab, NavBarItem,
    Cells,
    Cell,
    CellHeader,
    CellBody,
    Toptips
} = WeUI;
let stop = false;//防止重复提交
let pathHeader='/weixin';
let bgWidth=window.screen.width;
export default class AppActive extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.ToBack = this.ToBack.bind(this);
        this.toJoin = this.toJoin.bind(this);
        this.PhoneChange = this.PhoneChange.bind(this);
        this.state = {
            showWarn: false,
            tipText:"",
        };
        this.state.warnTimer && clearTimeout(this.state.warnTimer);
    }

    showWarn(text) {
        this.setState({showWarn: true, tipText: text});
        this.state.warnTimer = setTimeout(() => {
            this.setState({showWarn: false});
        },2000);
    }

    InputshowWarn(text) {
        this.setState({showWarn: true, tipText: text});
        this.state.warnTimer = setTimeout(() => {
            this.setState({showWarn: false});
        },10);
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    LeftClick() {
        HistoryManager.pageBack();
    }
    ToBack(){
        location.href = '/weixin'
    }

    //手机号码的改变
    PhoneChange(e) {
        if (!(/^0?(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[89])[0-9]{8}$/.test(e.target.value))) {
            this.showWarn("手机号码有误");
            e.target.value="";
        }
    }
    //参加
    toJoin(){
        let myPhone= document.getElementById("inputPhone").value;
        if (!(/^0?(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[89])[0-9]{8}$/.test(myPhone))) {
            this.showWarn("手机号码有误");
            document.getElementById("inputPhone").value="";
        }else{
            let fromData = new FormData();
            fromData.append("mobile",myPhone);
            fromData.append("webToken", localStorage.getItem('webToken'));
            fetch(getHost() + "/rest/memberactivity/joinActivity", {
                method: 'POST',
                credentials: 'include',
                body: fromData
            }).then(response => response.json()).then(json => {
                if (json.result === 1) {//success
                    console.log(json.message);
                    let url = pathHeader+"/AppSuccess";
                    HistoryManager.register(url);
                    location.href = url;
                } else {
                    console.log(json.message);
                    if(json.message==="该号码已参与过此活动，不能重复参与"){
                        this.showWarn("该号码已参与过此活动，不能重复参与");
                    }else{
                        let url = pathHeader+"/AppRegister?mobile="+myPhone;
                        HistoryManager.register(url);
                        location.href = url;
                    }
                }
            }).catch(e => {
                this.showWarn("网络出现了点问题");
                console.log("网络出现了点问题：" + e);
            });
        }
    }

    render() {
        return (
            <div  id="scrollDiv"  style={{width: "100%", height: "100%"}}>
                <div className="AppActive" style={{backgroundColor:'#dd4f5a'}}>
                    <img src="/assets/images/AppActive/active_bg.png" width={bgWidth} />
                    <div className="Active_content">
                        <div style={{height:"28rem"}}>.</div>
                        <div className="phone">
                            <input type="text" id="inputPhone" className="phone_input"  onBlur={this.PhoneChange} placeholder="请输入手机号码"/>
                        </div>
                        <div className="join">
                            <img src="/assets/images/AppActive/active_join.png" onClick={this.toJoin} />
                        </div>
                        <div className="rules">
                            <img src="/assets/images/AppActive/active_rules.png"/>
                        </div>
                    </div>
                </div>
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
            </div>
        )
    }


}
AppActive.defaultProps = {
    show: true
};