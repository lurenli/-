import React, {Component} from 'react';
import WeUI from 'react-weui';
import 'weui';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import Loading from '../../Common/Loading/Loading.jsx';

const {
    ButtonArea,
    Button,
    CellsTitle,
    FormCell,
    Form,
    Cells,
    Cell,
    CellHeader,
    CellBody,
    CellFooter,
    Label,
    Input,
    TextArea,
    Toptips,
}
    = WeUI;
let bgStyle = {
    width: "100%",
    minHeight: "100%",
    background: "#F5F5F5",
    fontSize: "1.4rem"
};
let bottomStyle = {
    position: "absolute",
    width: "100%",
    height: "7rem",
    bottom: "0",
};
let switchStyle = {
    width: "3rem",
    height: "3rem",
    float: "right"
};
let stop = false;let pathHeader='/weixin';
export default class MyBankCardEdit extends Component {
    constructor(props) {
        super(props);
        this.SaveClick = this.SaveClick.bind(this);
        this.LeftClick = this.LeftClick.bind(this);
        this.SwitchClick = this.SwitchClick.bind(this);
        this.state = {
            id: this.props.location.query.id,
            isLoading: true,
            showWarn: false,
            showSuccess: false,
            warnTimer: null,
            successTimer: null,
            tipText: "",

        };
        this.state.warnTimer && clearTimeout(this.state.warnTimer);
        this.state.successTimer && clearTimeout(this.state.successTimer);
    }

    showWarn(text) {
        this.setState({showWarn: true, tipText: text});

        this.state.warnTimer = setTimeout(() => {
            this.setState({showWarn: false});
        }, 2000);
    }

    showSuccess() {
        this.setState({showSuccess: true});

        this.state.warnTimer = setTimeout(() => {
            this.setState({showSuccess: false});
            HistoryManager.pageBack();
        }, 2000);

    }


    componentWillMount() {
        this.loadData();
    }

    componentDidMount() {
    }

    loadData() {
        let self = this;
        let fromData = new FormData();
        fromData.append("id", self.state.id);
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/BankAccount/get", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                self.setState({
                    bankaccountname: json.data.bankAccount.bankaccountname,
                    bankname: json.data.bankAccount.bankname,
                    bankusername: json.data.bankAccount.bankusername,
                    bankaccountnumber: json.data.bankAccount.bankaccountnumber,
                    idCard: json.data.bankAccount.idCard,
                    isdefault: json.data.bankAccount.isdefault,
                    isLoading: false
                });
            } else if (json.result === 2) {//登录失效
                HistoryManager.register(pathHeader+'/Login');
                location.href =pathHeader+'/Login';
            } else {
                self.showWarn(json.message);
                console.log(json.message)
            }
        }).catch(e => {
            console.log("网络出现了点问题：" + e);
            self.showWarn("网络出现了点问题");
        });
    }

    LeftClick() {
        HistoryManager.pageBack();
    }

    SaveClick() {
        if (!stop) {
            stop = true;//请求中
            let self = this;
            let fromData = new FormData();
            fromData.append("id", self.state.id);
            fromData.append("bankaccountname", self.state.bankaccountname);
            fromData.append("bankaccountnumber", self.state.bankaccountnumber);
            fromData.append("bankname", self.state.bankname);
            fromData.append("bankusername", self.state.bankusername);
            fromData.append("idCard", self.state.idCard);
            fromData.append("isdefault", self.state.isdefault);
            fromData.append("webToken", localStorage.getItem('webToken'));
            fetch(getHost() + "/rest/buyer/BankAccount/updateBankAccount", {
                method: 'POST',
                credentials: 'include',
                body: fromData
            }).then(response => response.json()).then(json => {
                stop = false;//请求修改完成
                if (json.result === 1) {
                    console.log(json);
                    self.showSuccess();
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
    }

    BankAccountChange(e) {
        this.setState({bankaccountname: e.target.value});
    }

    BankChange(e) {
        this.setState({bankname: e.target.value});
    }

    BankUserChange(e) {
        this.setState({bankusername: e.target.value});
    }

    BankNumberChange(e) {
        this.setState({bankaccountnumber: e.target.value});
    }

    IdCardChange(e) {
        this.setState({idCard: e.target.value});
    }

    SwitchClick() {
        if (this.state.defaultbill === 1) {
            this.setState({defaultbill: 0});
        } else {
            this.setState({defaultbill: 1});
        }
    }

    render() {
        return (
            <div style={bgStyle}>
                <NavigationBar Title="编辑银行卡" LeftBar="true" LeftTitle="返回"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                {this.state.isLoading ?
                    <Loading show={this.state.isLoading} length={1}
                             text={this.state.noneText}/> :
                    <Form>
                        <FormCell>
                            <CellHeader>
                                <Label>开户银行:</Label>
                            </CellHeader>
                            <CellBody>
                                <Input type="text" placeholder="请输入开户银行" value={this.state.bankaccountname}
                                       onChange={this.BankAccountChange.bind(this)}/>
                            </CellBody>
                        </FormCell>
                        <FormCell>
                            <CellHeader>
                                <Label>开户行:</Label>
                            </CellHeader>
                            <CellBody>
                                <Input type="text" placeholder="请输入开户行" value={this.state.bankname}
                                       onChange={this.BankChange.bind(this)}/>
                            </CellBody>
                        </FormCell>
                        <FormCell>
                            <CellHeader>
                                <Label>开户名:</Label>
                            </CellHeader>
                            <CellBody>
                                <Input type="text" placeholder="请输入开户名" value={this.state.bankusername}
                                       onChange={this.BankUserChange.bind(this)}/>
                            </CellBody>
                        </FormCell>
                        <FormCell>
                            <CellHeader>
                                <Label>开户账号:</Label>
                            </CellHeader>
                            <CellBody>
                                <Input type="text" placeholder="请输入开户账号" value={this.state.bankaccountnumber}
                                       onChange={this.BankNumberChange.bind(this)}/>
                            </CellBody>
                        </FormCell>
                        <FormCell>
                            <CellHeader>
                                <Label>身份证:</Label>
                            </CellHeader>
                            <CellBody>
                                <Input type="text" placeholder="请输入身份证号码" value={this.state.idCard}
                                       onChange={this.IdCardChange.bind(this)}/>
                            </CellBody>
                        </FormCell>
                        <FormCell>
                            <CellHeader>
                                <Label>设为默认</Label>
                            </CellHeader>
                            <CellBody onClick={this.SwitchClick}>
                                <img style={switchStyle}
                                     src={this.state.isdefault === 1 ? "/assets/images/userCenter/user_switch_on.png" : "/assets/images/userCenter/user_switch_off.png"}/>
                            </CellBody>
                        </FormCell>
                    </Form>
                }
                <div style={bottomStyle}>
                    <ButtonArea>
                        <Button type="warn" onClick={this.SaveClick}>保存</Button>
                    </ButtonArea>
                </div>
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
                <Toptips type="primary" show={this.state.showSuccess}>修改成功</Toptips>
            </div>
        )
    }


}