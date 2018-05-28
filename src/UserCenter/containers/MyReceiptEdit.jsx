import React, {Component} from 'react';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import WeUI from 'react-weui';
import 'weui';
import Loading from '../../Common/Loading/Loading.jsx';

const {
    Label,
    Input,
    Cells,
    Cell,
    CellHeader,
    CellBody,
    CellFooter,
    ButtonArea,
    Button,
    Toptips,
} = WeUI;

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
let listStyle = {
    width: "100%",
    position: "absolute",
    top: "0",
    bottom: "7rem",
};
let switchStyle = {
    width: "3rem",
    height: "3rem",
    float: "right"
};
let stop = false;//防止多次提交
let pathHeader='/weixin';
export default class MyReceiptEdit extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.CheckClick = this.CheckClick.bind(this);
        this.SwitchClick = this.SwitchClick.bind(this);
        this.state = {
            id: this.props.location.query.id,
            invoiceheadup: "",
            falseSwitchIsOn: "on",
            showWarn: false,
            showSuccess: false,
            warnTimer: null,
            successTimer: null,
            tipText: "",
            isLoading: true
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
        fromData.append("invoiceId", self.state.id);
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/invoiceInfo/detail", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                self.setState({
                    invoiceheadup: json.data.invoiceheadup,
                    bankofaccounts: json.data.bankofaccounts,
                    texno: json.data.texno,
                    account: json.data.account,
                    address: json.data.address,
                    linkman: json.data.linkman,
                    phone: json.data.phone,
                    defaultbill: json.data.defaultbill
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

    LeftClick() {
        HistoryManager.pageBack();
    }

    CheckClick() {
        if (!stop) {
            stop = true;//请求中
            let self = this;
            let fromData = new FormData();
            fromData.append("id", self.state.id);
            fromData.append("invoiceheadup", self.state.invoiceheadup);
            fromData.append("bankofaccounts", self.state.bankofaccounts);
            fromData.append("texno", self.state.texno);
            fromData.append("account", self.state.account);
            fromData.append("address", self.state.address);
            fromData.append("linkman", self.state.linkman);
            fromData.append("phone", self.state.phone);
            fromData.append("defaultbill", self.state.defaultbill);
            fromData.append("webToken", localStorage.getItem('webToken'));
            fetch(getHost() + "/rest/buyer/invoiceInfo/app/edit", {
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

    HeadChange(e) {
        this.setState({invoiceheadup: e.target.value})
    }

    BankChange(e) {
        this.setState({bankofaccounts: e.target.value})
    }

    TexnoChange(e) {
        this.setState({textno: e.target.value})
    }

    AccountChange(e) {
        this.setState({account: e.target.value})
    }

    AddressChange(e) {
        this.setState({address: e.target.value})
    }

    PhoneChange(e) {
        this.setState({phone: e.target.value})
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
                <div style={listStyle}>
                    <NavigationBar Title="编辑发票信息" LeftBar="true" LeftTitle="返回"
                                   LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                    {this.state.isLoading ?
                        <Loading show={this.state.isLoading} length={1}/> :
                        <div style={{background: "white"}}>
                            <Cell>
                                <CellHeader>
                                    <Label>发票抬头</Label>
                                </CellHeader>
                                <CellBody>
                                    <Input type="name" placeholder="请输入发票抬头"
                                           value={this.state.invoiceheadup}
                                           onChange={this.HeadChange.bind(this)}/>
                                </CellBody>
                            </Cell>
                            <Cell>
                                <CellHeader>
                                    <Label>开户行</Label>
                                </CellHeader>
                                <CellBody>
                                    <Input type="name" placeholder="请输入开户行"
                                           value={this.state.bankofaccounts}
                                           onChange={this.BankChange.bind(this)}/>
                                </CellBody>
                            </Cell>
                            <Cell>
                                <CellHeader>
                                    <Label>开户账号</Label>
                                </CellHeader>
                                <CellBody>
                                    <Input type="name" placeholder="请输入开户账号" value={this.state.account}
                                           onChange={this.AccountChange.bind(this)}/>
                                </CellBody>
                            </Cell>
                            <Cell>
                                <CellHeader>
                                    <Label>税号</Label>
                                </CellHeader>
                                <CellBody>
                                    <Input type="text" placeholder="请输入税号" value={this.state.texno}
                                           onChange={this.TexnoChange.bind(this)}/>
                                </CellBody>
                            </Cell>
                            <Cell>
                                <CellHeader>
                                    <Label>电话</Label>
                                </CellHeader>
                                <CellBody>
                                    <Input type="tel" placeholder="请输入电话" value={this.state.phone}
                                           onChange={this.PhoneChange.bind(this)}/>
                                </CellBody>
                            </Cell>
                            <Cell>
                                <CellHeader>
                                    <Label>地址</Label>
                                </CellHeader>
                                <CellBody>
                                    <Input type="text" placeholder="请输入地址" value={this.state.address}
                                           onChange={this.AddressChange.bind(this)}/>
                                </CellBody>
                            </Cell>
                            <Cell>
                                <CellHeader>
                                    <Label>设为默认</Label>
                                </CellHeader>
                                <CellBody onClick={this.SwitchClick}>
                                    <img style={switchStyle}
                                         src={this.state.defaultbill === 1 ? "/assets/images/userCenter/user_switch_on.png" : "/assets/images/userCenter/user_switch_off.png"}/>
                                </CellBody>
                            </Cell>
                        </div>
                    }
                </div>
                <div style={bottomStyle}>
                    <ButtonArea>
                        <Button onClick={this.CheckClick} type="warn">确定</Button>
                    </ButtonArea>
                </div>
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
                <Toptips type="primary" show={this.state.showSuccess}>修改成功</Toptips>
            </div>
        )
    }


}