import React, {Component} from 'react';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import WeUI from 'react-weui';
import Base64 from "../../../assets/js/Base64";

const {
    ButtonArea,
    Button,
    CellsTitle,
    Cells,
    Cell,
    CellHeader,
    CellBody,
    CellFooter,
    Label,
    Input,
    Toptips
} = WeUI;let pathHeader='/weixin';
export default class ResetPayPassword extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.FinishClick = this.FinishClick.bind(this);
        this.state = ({
            username: "",
            oldpay: "",
            showWarn: false,
            warnTimer: null,
            tipText: "",
            showSuccess: false,
            successTimer: null,
        });
        this.state.warnTimer && clearTimeout(this.state.warnTimer);
        this.state.successTimer && clearTimeout(this.state.successTimer);
    }

    componentWillMount() {
        let self = this;
        let fromData = new FormData();
        fetch(getHost() + "/rest/common/db/userInfo", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                self.setState({
                    username: json.data.username,
                    oldpay: json.data.paypassword,
                });
            } else if (json.result === 2) {//登录失效
                HistoryManager.register(pathHeader+'/Login');
                location.href = pathHeader+'/Login';
            } else {
                self.showWarn(json.message);
                console.log(json.message)
            }
        }).catch(e => {
            console.log("网络出现了点问题：" + e);
            self.showWarn("网络出现了点问题");
        });
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
            HistoryManager.pageBack();
        }, 2000);
    }

    componentDidMount() {
    }

    LeftClick() {
        HistoryManager.pageBack();
    }

    FinishClick() {
        if (!this.state.oldpay) {//设置
            let newPay = document.getElementById("newPay").value;
            let secPay = document.getElementById("secPay").value;
            if (newPay && newPay !== secPay) {
                this.showWarn("请确认您两次输入的密码");
            } else {
                let fromData = new FormData();
                fromData.append("paypassword", Base64.encode(newPay));
                fetch(getHost() + "/rest/buyer/setMemberPaypassword", {
                    method: 'POST',
                    credentials: 'include',
                    body: fromData
                }).then(response => response.json()).then(json => {
                    if (json.result === 1) {
                        // markDataRequestFlag();
                        this.showSuccess();
                        return true;
                    } else {
                        this.showWarn(json.message);
                        return;
                    }
                }).catch(e => {
                    this.showWarn("网络出现了点问题");
                    console.log("网络出现了点问题：" + e);
                });
            }
        } else {//修改
            let oldPay = document.getElementById("oldPay").value;
            let newPay = document.getElementById("newPay").value;
            let secPay = document.getElementById("secPay").value;
            if (!oldPay) {
                this.showWarn("请输入旧密码");
            } else if (newPay && newPay !== secPay) {
                this.showWarn("请确认您两次输入的密码");
            } else {
                let fromData = new FormData();
                fromData.append("oldpaypassword", Base64.encode(oldPay));
                fromData.append("paypassword", Base64.encode(newPay));
                fetch(getHost() + "/rest/buyer/updateMemberPaypassword", {
                    method: 'POST',
                    credentials: 'include',
                    body: fromData
                }).then(response => response.json()).then(json => {
                    if (json.result === 1) {
                        // markDataRequestFlag();
                        this.showSuccess();
                        return true;
                    } else {
                        this.showWarn(json.message);
                        return;
                    }
                }).catch(e => {
                    this.showWarn("网络出现了点问题");
                    console.log("网络出现了点问题：" + e);
                });
            }
        }
    }

    render() {
        return (
            <div>
                <NavigationBar Title={this.state.oldpay ? "修改支付密码" : "设置支付密码"} LeftBar="true" LeftTitle="返回"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                <Cells>
                    <Cell>
                        <CellHeader>
                            <Label>用户账号</Label>
                        </CellHeader>
                        <CellBody>
                            <Label>{this.state.username}</Label>
                        </CellBody>
                    </Cell>
                    {this.state.oldpay ?
                        <Cell>
                            <CellHeader>
                                <Label>旧密码</Label>
                            </CellHeader>
                            <CellBody>
                                <Input type="password" id="oldPay" placeholder="输入旧密码"/>
                            </CellBody>
                        </Cell> : null
                    }
                    <Cell>
                        <CellHeader>
                            <Label>设置密码</Label>
                        </CellHeader>
                        <CellBody>
                            <Input type="password" id="newPay" placeholder="设置支付密码"/>
                        </CellBody>
                    </Cell>
                    <Cell>
                        <CellHeader>
                            <Label>确认密码</Label>
                        </CellHeader>
                        <CellBody>
                            <Input type="password" id="secPay" placeholder="请重新填写密码"/>
                        </CellBody>
                    </Cell>
                </Cells>
                <ButtonArea>
                    <Button type="warn" onClick={this.FinishClick}>完成</Button>
                </ButtonArea>
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
                <Toptips type="primary" show={this.state.showSuccess}>设置成功</Toptips>
            </div>
        )
    }

}