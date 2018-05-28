import React, {Component} from 'react';
import WeUI from 'react-weui';
import 'weui';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';

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
let switchStyle = {
    width: "3rem",
    height: "3rem",
    float: "right"
};
let stop = false;let pathHeader='/weixin';
export default class MyBankCardAdd extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.AddCardClick = this.AddCardClick.bind(this);
        this.SwitchClick = this.SwitchClick.bind(this);
        this.state = {
            isdefault: 0,
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

    AddCardClick() {//finish
        if (!stop) {
            stop = true;//请求中
            let self = this;
            if (!self.state.bankaccountname || !self.state.bankaccountnumber || !self.state.bankname || !self.state.bankusername || !self.state.idCard) {
                self.showWarn("信息填写不完整");
                return false;
            } else {
                let fromData = new FormData();
                fromData.append("bankaccountname", self.state.bankaccountname);
                fromData.append("bankaccountnumber", self.state.bankaccountnumber);
                fromData.append("bankname", self.state.bankname);
                fromData.append("bankusername", self.state.bankusername);
                fromData.append("idCard", self.state.idCard);
                fromData.append("isdefault", self.state.isdefault);
                fromData.append("webToken", localStorage.getItem('webToken'));
                fetch(getHost() + "/rest/buyer/BankAccount/addBankAccount", {
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
        if (this.state.isdefault === 1) {
            this.setState({isdefault: 0});
        } else {
            this.setState({isdefault: 1});
        }
    }

    render() {
        return (
            <div style={bgStyle}>
                <NavigationBar Title="新增银行卡" LeftBar="true" LeftTitle="返回"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
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
                <div style={bottomStyle}>
                    <ButtonArea>
                        <Button type="warn" onClick={this.AddCardClick}>新增</Button>
                    </ButtonArea>
                </div>
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
                <Toptips type="primary" show={this.state.showSuccess}>添加成功</Toptips>
            </div>
        )
    }


}