import React, {Component} from 'react';
import WeUI from 'react-weui';
import 'weui';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import Base64 from '../../../assets/js/Base64.js';

const {
    Popup,
    PopupHeader,
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
    CellsTips,
    Label,
    Input,
    TextArea,
    Toptips,
    Dialog
} = WeUI;
let bgStyle = {
    width: "100%",
    minHeight: "100%",
    background: "#F5F5F5",
    fontSize: "1.4rem"
};
let inputStyle = {
    border: "1px solid #eeeeee",
    height: "3rem",
    lineHeight: "3rem",
    fontSize: "1.4rem",
    padding: "0 1rem"
};let pathHeader='/weixin';
export default class MyMoneyCash extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.getwx = this.getwx.bind(this);
        this.formatMoney = this.formatMoney.bind(this);
        this.moneyChange = this.moneyChange.bind(this);
        this.changeBank = this.changeBank.bind(this);
        this.InputChange = this.InputChange.bind(this);
        this.ToInfo = this.ToInfo.bind(this);
        this.PayShow = this.PayShow.bind(this);
        this.PayHide = this.PayHide.bind(this);
        this.PayClick = this.PayClick.bind(this);
        this.state = {
            showWarn: false,
            showSuccess: false,
            tipText:"",
            bottom_show: false,
            bankList:[],
            balance:0,
            chooseType:3,
            money:1,
            withdrawtype:1,
            account:"",//银行账号
            wxaccount:null,//微信账号
            payPassword:"",
            pay_show: false,
            buttons: [
                {
                    type: 'default',
                    label: '取消',
                    onClick: this.PayHide
                },
                {
                    type: 'primary',
                    label: '支付',
                    onClick: this.PayClick
                }
            ],
            bankname:"",
            banknamealias:"",
            bankaccountname:"",
        };
    }


    componentWillMount() {
       this.allbankData();
       // this.getBalance();
       this.getwx();
    }

    componentDidMount() {
    }

    LeftClick() {
        HistoryManager.pageBack();
    }

    RightClick(){
        let url = pathHeader+"/MyMoneyCashHistory";
        HistoryManager.register(url);
        location.href = url;
    }

    hide() {
        this.setState({
            bottom_show: false,
        });
    }
    //提示信息
    showSuccess(text) {
        this.setState({showSuccess: true});
        this.state.successTimer = setTimeout(() => {
            this.setState({showSuccess: false});
        }, 2000);
    }
    showWarn(text) {
        this.setState({showWarn: true, tipText: text});
        this.state.warnTimer = setTimeout(() => {
            this.setState({showWarn: false});
        }, 2000);
    }
    //获取登录用户的微信账号和获取可提现的余额
    getwx(){
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
                self.setState({wxaccount: json.data.wxpay?json.data.wxpay:"",balance: self.formatMoney(json.data.balance)})
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
    //获取所有的银行卡
    allbankData(){
        let self = this;
        let fromData = new FormData();
        fromData.append("pageNo", 1);
        fromData.append("pageSize", 10);
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/BankAccount/listAllBankAccount", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                self.setState({
                    bankList: json.data.pageInfo.list,
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

    formatMoney(value) {
        if (!value) {
            return "";
        } else {
            return "￥" + parseFloat(value).toFixed(2);
        }
    }
    //输入金额
    moneyChange(e){
        let val = e.target.value;
        this.setState({money: val})
    }
    //截取银行卡后四位的方法
    fourString(str){
        return  str.substr(str.length-4)
    }
    //点击调整到添加银行卡
    AddClick() {
        let url = pathHeader+"/MyBankCardAdd";
        HistoryManager.register(url);
        location.href = url;
    }
    //点击不同的银行卡
    changeBank(item){
        this.setState({
            chooseType: 3,
            bottom_show: false,
            account:item.bankaccountnumber,
            bankname:item.bankname,
            banknamealias:item.bankaccountname,
            bankaccountname:item.bankusername,
        })
    }
    //点击下一步---支付弹框
    PayShow() {
        if(this.state.chooseType===1&&this.state.wxaccount===null){
            this.ToInfo();
        }else{
            this.setState({pay_show: true,bottom_show:false});
        }
    }
    PayHide() {
        this.setState({pay_show: false});
    }
    InputChange(e) {
        let val = e.target.value;
        this.setState({payPassword: val})
    }

    ToInfo() {//微信一栏的点击----如果有账号和没有账号
        if(this.state.wxaccount){
            this.setState({
                chooseType: 1,bottom_show: false
            })
        }else{
            let url = pathHeader+"/AccountInfo";
            HistoryManager.register(url);
            location.href = url;
        }
    }
    //确认提现
    PayClick() {
        if (this.state.payPassword.length > 0) {
            if(this.state.chooseType===1){
                let self = this;
                let formData = new FormData();
                formData.append("withdrawtype", 1);
                formData.append("money",self.state.money);// {1,2}
                formData.append("payPassword", Base64.encode(self.state.payPassword));
                formData.append("account", self.state.wxaccount);
                formData.append("webToken", localStorage.getItem('webToken'));
                fetch(getHost() + "/rest/buyer/buyerWithdrawCas", {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                }).then(response => response.json()).then(json => {
                    if (json.result === 1) {
                        console.log(json);
                        self.showSuccess();
                        let url = pathHeader+"/MyMoney?num=" + self.formatMoney(self.state.balance);
                        HistoryManager.register(url);
                        location.href = url;
                    } else if (json.result === 2) {//登录失效
                        HistoryManager.register(pathHeader+'/Login');
                        location.href = pathHeader+'/Login';
                    } else {
                        self.showWarn("提交失败");
                        console.log(json.message)
                    }
                }).catch(e => {
                    console.log("网络出现了点问题：" + e);
                    self.showWarn("网络出现了点问题");
                });
            }else{
                let self = this;
                let formData = new FormData();
                formData.append("withdrawtype", 3);
                formData.append("money",self.state.money);// {1,2}
                formData.append("payPassword", Base64.encode(self.state.payPassword));
                formData.append("account", self.state.account);
                formData.append("bankname", self.state.bankname);
                formData.append("banknamealias", self.state.banknamealias);
                formData.append("bankaccountname", self.state.bankaccountname);
                formData.append("webToken", localStorage.getItem('webToken'));
                fetch(getHost() + "/rest/buyer/buyerWithdrawCas", {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                }).then(response => response.json()).then(json => {
                    if (json.result === 1) {
                        console.log(json);
                        self.showSuccess();
                        let url = pathHeader+"/MyMoney?num=" + self.formatMoney(self.state.balance);
                        HistoryManager.register(url);
                        location.href = url;
                    } else if (json.result === 2) {//登录失效
                        HistoryManager.register(pathHeader+'/Login');
                        location.href = pathHeader+'/Login';
                    } else {
                        self.showWarn("提交失败");
                        console.log(json.message)
                    }
                }).catch(e => {
                    console.log("网络出现了点问题：" + e);
                    self.showWarn("网络出现了点问题");
                });
            }
        } else {
            this.showWarn("请输入支付密码")
        }
    }

    render() {
        console.log(this.state.balance)
        let noneDiv = null;
        let typeDiv=null;
        if(this.state.chooseType===1){
            typeDiv=<Cell onClick={e => this.setState({bottom_show: true})} access>
                <CellHeader>
                    <img style={{width: "5rem", height: "5rem", marginRight: "1rem", verticalAlign: "middle"}}
                         src="/assets/images/userCenter/user_payment_wx.png"/>
                </CellHeader>
                <CellBody>
                    微信
                    {
                        this.state.wxaccount?<div style={{fontSize:"1.2rem",marginTop:"1rem"}}>账号&nbsp;&nbsp;{this.state.wxaccount}</div>:null
                    }
                </CellBody>
                <CellFooter/>
            </Cell>;
        }else{
            typeDiv=<Cell onClick={e => this.setState({bottom_show: true})} access>
                <CellHeader>
                    <img style={{width: "5rem", height: "5rem", marginRight: "1rem", verticalAlign: "middle"}}
                         src="/assets/images/userCenter/user_bankcard.png"/>
                </CellHeader>
                <CellBody>
                    {this.state.banknamealias}
                    <div style={{fontSize:"1.2rem",marginTop:"1rem"}}>账号&nbsp;&nbsp;{this.state.account}</div>
                </CellBody>
                <CellFooter/>
            </Cell>;
        }
        return (
            <div style={bgStyle}>
                <NavigationBar Title="提现" LeftBar="true" LeftTitle="返回"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}
                RightBar="true" RightTitle="明细" RightClick={this.RightClick}/>
                <Form>
                    {typeDiv}
                </Form>
                <CellsTitle>提现金额</CellsTitle>
                <Cell style={{backgroundColor: "white"}}>
                    <CellHeader>
                        <Label>¥</Label>
                    </CellHeader>
                    <CellBody>
                        <Input placeholder="输入提现金额" onChange={this.moneyChange}/>
                    </CellBody>
                    <CellFooter/>
                </Cell>
                <CellsTips>可提现余额 {this.state.balance}元</CellsTips>
                <ButtonArea>
                    <Button type="warn" onClick={this.PayShow}>
                        下一步
                    </Button>
                </ButtonArea>
                <Dialog type="ios" title="请输入支付密码" buttons={this.state.buttons}
                        show={this.state.pay_show}>
                    <Input style={inputStyle} type="password" value={this.state.payPassword}
                           onChange={this.InputChange}/>
                </Dialog>
                <Popup
                    show={this.state.bottom_show}
                    onRequestClose={e => this.setState({bottom_show: false})}>
                    <PopupHeader
                        left="取消"
                        // right="Ok"
                        leftOnClick={e => this.setState({bottom_show: false})}
                        rightOnClick={e => this.setState({bottom_show: false})}
                    />
                    {
                        this.state.bankList.map((item, i) =>
                        <Cell style={{backgroundColor: "white"}} key={i} onClick={ e=> this.changeBank(item)}>
                            <CellHeader>
                                <img style={{width: "2.5rem", height: "2rem", marginRight: "1rem", verticalAlign: "middle"}}
                                     src="/assets/images/userCenter/user_bankcard.png"/>
                            </CellHeader>
                            <CellBody>
                                <div style={{fontSize: "1.4rem", height: "3rem", lineHeight: "3rem"}}>{item.bankaccountname}({this.fourString(item.bankaccountnumber)})</div>
                            </CellBody>
                            <CellFooter/>
                        </Cell>
                        )
                    }
                    <Cell style={{backgroundColor: "white"}} access onClick={this.AddClick}>
                        <CellHeader>
                            <img style={{width: "2.5rem", height: "2rem", marginRight: "1rem", verticalAlign: "middle"}}
                                 src="/assets/images/userCenter/user_bankcard.png"/>
                        </CellHeader>
                        <CellBody>
                            <div style={{fontSize: "1.4rem", height: "3rem", lineHeight: "3rem"}}>添加其他银行卡</div>
                        </CellBody>
                        <CellFooter/>
                    </Cell>
                    {/*<Cell style={{backgroundColor: "white"}} onClick={this.ToInfo}>*/}
                        {/*<CellHeader>*/}
                            {/*<img style={{width: "2.5rem", height: "2rem", marginRight: "1rem", verticalAlign: "middle"}}*/}
                                 {/*src="/assets/images/userCenter/user_payment_wx.png"/>*/}
                        {/*</CellHeader>*/}
                        {/*<CellBody>*/}
                            {/*<div style={{fontSize: "1.4rem", height: "3rem", lineHeight: "3rem"}}>微信*/}
                                {/*{*/}
                                    {/*this.state.wxaccount?<span>({this.state.wxaccount})</span>*/}
                                    {/*:<span  style={{color:"#ffa04b"}}>请先完成微信账号信息</span>*/}
                                {/*}*/}
                            {/*</div>*/}
                        {/*</CellBody>*/}
                        {/*<CellFooter/>*/}
                    {/*</Cell>*/}
                </Popup>
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
                <Toptips type="primary" show={this.state.showSuccess}>提交成功，请等待审核！</Toptips>
            </div>
        )
    }


}