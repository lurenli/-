import React, {Component} from 'react';
import WeUI from 'react-weui';
import 'weui';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';

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
    Toptips
} = WeUI;
let bgStyle = {
    width: "100%",
    minHeight: "100%",
    background: "#F5F5F5",
    fontSize: "1.4rem"
};
export default class MyMoneyRecharge extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.NextClick = this.NextClick.bind(this);
        this.state = {
            showWarn: false,
            showSuccess: false,
            tipText:"",
            bottom_show: false,
            warnTimer: null,
            chooseType:3,
            rechargeMoney:undefined,

        };
        this.state.warnTimer && clearTimeout(this.state.warnTimer);
    }

    showWarn(text) {
        this.setState({showWarn: true, tipText: text});

        this.state.warnTimer = setTimeout(() => {
            this.setState({showWarn: false});
        }, 2000);
    }


    componentWillMount() {

    }

    componentDidMount() {
    }

    LeftClick() {
        HistoryManager.pageBack();
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
    InputChange(e) {
        this.setState({rechargeMoney: e.target.value})
    }

    NextClick() {//提交充值的信息获取单号
        if (this.state.rechargeMoney) {
            let self = this;
            let fromData = new FormData();
            fromData.append("rechargeperform",-1);
            fromData.append("capital", self.state.rechargeMoney);
            fromData.append("webToken", localStorage.getItem('webToken'));
            fetch(getHost() + "/rest/buyer/chargeMoney/buyerCharge", {
                method: 'POST',
                credentials: 'include',
                body: fromData
            }).then(response => response.json()).then(json => {
                if (json.result === 1) {
                    console.log(json);
                    self.chargeBack(json.data.chargeNo);
                    // self.showSuccess();
                } else {
                    self.showWarn("获取失败");
                    console.log(json.message)
                }
            }).catch(e => {
                console.log("网络出现了点问题：" + e);
                self.showWarn("网络出现了点问题");
            });
        }
    }
   chargeBack(chargeNo){
       if(this.state.chooseType===1){
           // 去往微信支付

       }
       else if(this.state.chooseType===2) {
           //去往支付宝
       }
       else if(this.state.chooseType===3){
           //银行卡（默认不对公）
           let self = this;
           let fromData = new FormData();
           fromData.append("orders",chargeNo);
           fromData.append("type", 2);
           fromData.append("isCompany", false);
           fromData.append("webToken", localStorage.getItem('webToken'));
           fetch(getHost() + "/rest/bankpay/toPay", {
               method: 'POST',
               credentials: 'include',
               body: fromData
           }).then(response => response.json()).then(json => {
               if (json.result === 1) {
                   console.log(json);
                   location.href=json.data.url;
                   // self.showSuccess();
               } else {
                   self.showWarn("获取失败");
                   console.log(json.message)
               }
           }).catch(e => {
               console.log("网络出现了点问题：" + e);
               self.showWarn("网络出现了点问题");
           });
       }
   }
    render() {
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
                </CellBody>
                <CellFooter/>
            </Cell>;
        }else if(this.state.chooseType===2){
            typeDiv=<Cell onClick={e => this.setState({bottom_show: true})} access>
                <CellHeader>
                    <img style={{width: "5rem", height: "5rem", marginRight: "1rem", verticalAlign: "middle"}}
                         src="/assets/images/userCenter/user_payment_zfb.png"/>
                </CellHeader>
                <CellBody>
                    支付宝
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
                    银行卡
                </CellBody>
                <CellFooter/>
            </Cell>;
        }
        return (
            <div style={bgStyle}>
                <NavigationBar Title="账户充值" LeftBar="true" LeftTitle="返回"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                <Form>
                    {typeDiv}
                </Form>
                <CellsTips>
                    {/*该卡每次最多可充值10,000.00*/}
                </CellsTips>
                <Cell style={{backgroundColor: "white"}}>
                    <CellHeader>
                        <Label>金额</Label>
                    </CellHeader>
                    <CellBody>
                        <Input placeholder="输入充值金额" value={this.state.rechargeMoney}
                               onChange={this.InputChange.bind(this)}/>
                    </CellBody>
                    <CellFooter/>
                </Cell>
                <ButtonArea>
                    <Button type="warn" onClick={this.NextClick}>
                        下一步
                    </Button>
                </ButtonArea>
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
                <Popup
                    show={this.state.bottom_show}
                    onRequestClose={e => this.setState({bottom_show: false})}>
                    <PopupHeader
                        left="取消"
                        // right="Ok"
                        leftOnClick={e => this.setState({bottom_show: false})}
                        rightOnClick={e => this.setState({bottom_show: false})}
                    />
                    {/*<Cell style={{backgroundColor: "white"}} onClick={ e=> this.setState({chooseType: 1,bottom_show: false})}>*/}
                        {/*<CellHeader>*/}
                            {/*<img style={{width: "2.5rem", height: "2.5rem", marginRight: "1rem", verticalAlign: "middle"}}*/}
                                 {/*src="/assets/images/userCenter/user_payment_wx.png"/>*/}
                        {/*</CellHeader>*/}
                        {/*<CellBody>*/}
                            {/*<div style={{fontSize: "1.4rem", height: "3rem", lineHeight: "3rem"}}>微信</div>*/}
                        {/*</CellBody>*/}
                        {/*<CellFooter/>*/}
                    {/*</Cell>*/}
                    {/*<Cell style={{backgroundColor: "white"}} onClick={ e=> this.setState({chooseType: 2,bottom_show: false})}>*/}
                        {/*<CellHeader>*/}
                            {/*<img style={{width: "2.5rem", height: "2.5rem", marginRight: "1rem", verticalAlign: "middle"}}*/}
                                 {/*src="/assets/images/userCenter/user_payment_zfb.png"/>*/}
                        {/*</CellHeader>*/}
                        {/*<CellBody>*/}
                            {/*<div style={{fontSize: "1.4rem", height: "3rem", lineHeight: "3rem"}}>支付宝</div>*/}
                        {/*</CellBody>*/}
                        {/*<CellFooter/>*/}
                    {/*</Cell>*/}
                    <Cell style={{backgroundColor: "white"}} onClick={ e=> this.setState({chooseType: 3,bottom_show: false})}>
                        <CellHeader>
                            <img style={{width: "2.5rem", height: "2.5rem", marginRight: "1rem", verticalAlign: "middle"}}
                                 src="/assets/images/userCenter/user_bankcard.png"/>
                        </CellHeader>
                        <CellBody>
                            <div style={{fontSize: "1.4rem", height: "3rem", lineHeight: "3rem"}}>银行卡支付</div>
                        </CellBody>
                        <CellFooter/>
                    </Cell>
                </Popup>
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
                <Toptips type="primary" show={this.state.showSuccess}>充值中</Toptips>
            </div>
        )
    }


}