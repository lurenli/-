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
} = WeUI;
let pathHeader='/weixin';
export default class ResetLoginPassword extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.FinishClick = this.FinishClick.bind(this);
        this.state = ({
            showWarn: false,
            showSuccess: false,
            warnTimer: null,
            successTimer: null,
            tipText: "",
        });
        this.state.warnTimer && clearTimeout(this.state.warnTimer);
        this.state.successTimer && clearTimeout(this.state.successTimer);
    }

    componentWillMount() {
        let self = this;
        let fromData = new FormData();
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/common/db/userInfo", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                self.setState({
                    username: json.data.username,
                });
            } else if (json.result === 2) {//登录失效
                HistoryManager.register(pathHeader+'/Login');
                location.href = pathHeader+'/Login';
            }else {
                self.showWarn(json.message);
                console.log(json.message)
            }
        }).catch(e => {
            console.log("网络出现了点问题：" + e);
            self.showWarn("网络出现了点问题");
        });
    }

    showSuccess() {
        this.setState({showSuccess: true});
        this.state.successTimer = setTimeout(() => {
            this.setState({showSuccess: false});
            HistoryManager.pageBack();
        }, 2000);
    }

    showWarn(text) {
        this.setState({showWarn: true, tipText: text});

        this.state.warnTimer = setTimeout(() => {
            this.setState({showWarn: false});
        }, 2000);
    }

    componentDidMount() {
    }

    LeftClick() {
        HistoryManager.pageBack();
    }

    FinishClick() {
        let oldLoginPwd = document.getElementById("oldLoginPwd").value;
        let newLoginPwd = document.getElementById("newLoginPwd").value;
        let secLoginPwd = document.getElementById("secLoginPwd").value;
        if (secLoginPwd !== newLoginPwd) {
            this.showWarn("请确认您两次输入的新密码");
        } else {
            let fromData = new FormData();
            fromData.append("oldpassword", Base64.encode(oldLoginPwd));
            fromData.append("password", Base64.encode(newLoginPwd));
            fromData.append("webToken", localStorage.getItem('webToken'));
            fetch(getHost() + "/rest/buyer/updatePassword", {
                method: 'POST',
                credentials: 'include',
                body: fromData
            }).then(response => response.json()).then(json => {
                console.log(json)
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

    render() {
        return (
            <div><NavigationBar Title="修改登录密码" LeftBar="true" LeftTitle="返回"
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
                    <Cell>
                        <CellHeader>
                            <Label>旧密码</Label>
                        </CellHeader>
                        <CellBody>
                            <Input type="password" id="oldLoginPwd" placeholder="请填写旧密码"/>
                        </CellBody>
                    </Cell>
                    <Cell>
                        <CellHeader>
                            <Label>新密码</Label>
                        </CellHeader>
                        <CellBody>
                            <Input type="password" id="newLoginPwd" placeholder="请填写新密码"/>
                        </CellBody>
                    </Cell>
                    <Cell>
                        <CellHeader>
                            <Label>确认密码</Label>
                        </CellHeader>
                        <CellBody>
                            <Input type="password" id="secLoginPwd" placeholder="请重新填写密码"/>
                        </CellBody>
                    </Cell>
                </Cells>
                <ButtonArea>
                    <Button type="warn" onClick={this.FinishClick}>完成</Button>
                </ButtonArea>
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
                <Toptips type="primary" show={this.state.showSuccess}>修改成功</Toptips>
            </div>
        )
    }


}