import React, {Component} from 'react';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import WeUI from 'react-weui';
import 'weui';

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
    Toptips
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
export default class MyReceiptAdd extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.CheckClick=this.CheckClick.bind(this);
        this.SwitchClick = this.SwitchClick.bind(this);
        this.state={
            linkman:"",
            defaultbill:0,
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

    }

    componentDidMount() {
    }

    LeftClick() {
        HistoryManager.pageBack();
    }
    CheckClick(){
        if (!stop) {
            stop = true;//请求中
            let self = this;
            let fromData = new FormData();
            // fromData.append("id", self.state.id);
            fromData.append("invoiceheadup", self.state.invoiceheadup);
            fromData.append("bankofaccounts", self.state.bankofaccounts);
            fromData.append("texno", self.state.texno);
            fromData.append("account", self.state.account);
            fromData.append("address", self.state.address);
            fromData.append("linkman", self.state.linkman);
            fromData.append("phone", self.state.phone);
            fromData.append("defaultbill", self.state.defaultbill);
            fromData.append("webToken", localStorage.getItem('webToken'));
            fetch(getHost() + "/rest/buyer/invoiceInfo/app/add", {
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
    linkmanChange(e) {
        this.setState({linkman: e.target.value})
    }

    TexnoChange(e) {
        this.setState({texno: e.target.value})
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
        if(this.state.defaultbill===1){
            this.setState({defaultbill: 0});
        }else{
            this.setState({defaultbill: 1});
        }
    }

    render() {
        return (
            <div style={bgStyle}>
                <div style={listStyle}>
                    <NavigationBar Title="添加发票信息" LeftBar="true" LeftTitle="返回"
                                   LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
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
                                <Label>联系人</Label>
                            </CellHeader>
                            <CellBody>
                                <Input type="text" placeholder="请输入联系人" value={this.state.linkman}
                                       onChange={this.linkmanChange.bind(this)}/>
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
                </div>
                <div style={bottomStyle}>
                    <ButtonArea>
                        <Button onClick={this.CheckClick} type="warn">确定</Button>
                    </ButtonArea>
                </div>
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
                <Toptips type="primary" show={this.state.showSuccess}>添加成功</Toptips>
            </div>
        )
    }


}