import React, {Component} from 'react';
import WeUI from 'react-weui';
import $ from 'jquery';
//import styles
import 'weui';
import {CSS} from '../styles/Register.css';

const {
    Cells,
    Cell,
    CellHeader,
    CellBody,
    CellFooter,
    Badge,
    Toptips,
} = WeUI;
let menu = {
    display: "inline-block", position: "relative",
    // padding: "0.5rem"
};
let numImg = {
    background: "red",
    width: "1.5rem",
    height: "1.5rem",
    borderRadius: "50%",
    color: "white",
    fontSize: "1.2rem",
    position: "absolute",
    right: "0",
    top: "0"
};
let cellImg = {
    display: `block`,
    width: `2rem`,
    marginRight: `1rem`,

};
let userCard = {
    position: "absolute",
    top: "10rem",
    width: "35.5rem",
    margin: "1rem",
    background: "white",
    borderRadius: "5px",
    fontSize: "1.4rem",
    zIndex: "5"
};
let userIcon = {
    width: "6rem",
    height: "6rem",
    borderRadius: "50%",
    margin: "1rem",
    verticalAlign: "middle"
};
let setting = {
    width: "100%",
    padding: "0 1rem",
    textAlign: "right"
};
let pathHeader='/weixin';
export default class UserCenter extends Component {
    constructor(props) {
        super(props);
        this.ChangeFavicon = this.ChangeFavicon.bind(this);
        this.InfoClick = this.InfoClick.bind(this);
        this.SettingClick = this.SettingClick.bind(this);
        this.ServiceClick = this.ServiceClick.bind(this);
        this.MoneyClick = this.MoneyClick.bind(this);
        this.FacilityClick = this.FacilityClick.bind(this);
        this.BankCardClick = this.BankCardClick.bind(this);
        this.AddressClick = this.AddressClick.bind(this);
        this.ReceiptClick = this.ReceiptClick.bind(this);
        this.CollectionClick = this.CollectionClick.bind(this);
        this.PromotionClick = this.PromotionClick.bind(this);
        this.state = {
            userInfo: {},
            orderNum1: null,//
            orderNum2: null,
            orderNum3: null,
            // orderNum1:data.data.buyerCenterModel.num2,
            showWarn: false,
            warnTimer: null,
            tipText: "",
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
        // if (localStorage.getItem('login') === "1") {
            this.loadData();
            this.getOrdersNum();
        // } else {
        //     HistoryManager.removeAll();
        //     location.href = '/Login';
        // }
    }

    componentDidMount() {
    }

    loadData() {
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
                    // isLoading: false,
                    userInfo: json.data
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

    getOrdersNum() {
        let self = this;
        // self.setState({isLoading: true});
        let fromData = new FormData();
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/orders/getBuyerOrdersStateNum", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                // self.showSuccess();
                self.setState({
                    // isLoading: false,
                    orderNum1: json.data.buyerCenterModel.num2,//
                    orderNum2: json.data.buyerCenterModel.num3,
                    orderNum3: json.data.buyerCenterModel.num4,
                    orderNum4: json.data.buyerCenterModel.num5,
                    orderNum5: json.data.buyerCenterModel.num7,
                });
            } else {
                self.showWarn("获取失败");
                console.log(json.message)
            }
        }).catch(e => {
            console.log("网络出现了点问题：" + e);
            self.showWarn("网络出现了点问题");
        });
    }

    ChangeFavicon() {//更换头像

    }

    InfoClick() {//账户信息
        let url = pathHeader+"/AccountInfo";
        HistoryManager.register(url);
        location.href = url;
    }

    SettingClick() {
        let url = pathHeader+"/Settings";
        HistoryManager.register(url);
        location.href = url;
    }

    OrderClick(index) {
        let url = pathHeader+"/MyOrders?index=" + index;
        HistoryManager.register(url);
        location.href = url;
    }

    ServiceClick(){
        let url = pathHeader+"/ServiceList";
        HistoryManager.register(url);
        location.href = url;
    }

    MoneyClick() {
        // let url = "/MyMoney?num=" + this.formatMoney(this.state.userInfo.balance);
        let url = pathHeader+"/MyMoney";
        HistoryManager.register(url);
        location.href = url;
    }

    FacilityClick() {
        let url = pathHeader+"/MyFacility";
        HistoryManager.register(url);
        location.href = url;
    }

    BankCardClick() {
        let url = pathHeader+"/MyBankCard";
        HistoryManager.register(url);
        location.href = url;
    }

    AddressClick() {
        let url = pathHeader+"/MyAddress";
        HistoryManager.register(url);
        location.href = url;
    }

    ReceiptClick() {
        let url = pathHeader+"/MyReceipt";
        HistoryManager.register(url);
        location.href = url;
    }

    CollectionClick() {
        let url = pathHeader+"/MyCollection";
        HistoryManager.register(url);
        location.href = url;
    }

    PromotionClick() {
        let url = pathHeader+"/ToJudge";
        HistoryManager.register(url);
        location.href = url;
    }

    formatMoney(value) {
        if (!value) {
            return "";
        } else {
            return "￥" + parseFloat(value).toFixed(2);
        }
    }

    render() {
        let show = {display: "block", backgroundColor: "#eee", minHeight: "100%", paddingBottom: "5rem"};
        if (!this.props.show) {
            show = {display: "none"}
        }
        let companyImg = "/assets/images/userCenter/user_unbind_company.png";

        if (this.state.userInfo.company) {
            companyImg = "/assets/images/userCenter/user_bind_company.png"
        }
        let phoneImg = "/assets/images/userCenter/user_unbind_phone.png";
        if (this.state.userInfo.mobile) {
            phoneImg = "/assets/images/userCenter/user_bind_phone.png";
        }
        let payImg = "/assets/images/userCenter/user_unbind_facility.png";
        if (this.state.userInfo.balance > 0) {
            payImg = "/assets/images/userCenter/user_bind_facility.png";
        }
        return (
            <div style={show}>
                <div className="userBg">
                    <img className="userBg" src={this.state.userInfo.favicon?"process.env.IMAGE_PRIFIX " + this.state.userInfo.favicon:"/assets/images/userCenter/default_favicon.png"}/>
                </div>
                <div className="userCard"></div>
                <div style={{width: "100%", height: "4rem"}}></div>
                <div style={userCard}>

                    <div>
                        <img style={userIcon} src={this.state.userInfo.favicon?"process.env.IMAGE_PRIFIX " + this.state.userInfo.favicon:"/assets/images/userCenter/default_favicon.png"}
                             onClick={this.ChangeFavicon}/>
                        <div style={{display: "inline-block", width: "27.5rem", verticalAlign: "middle"}}>
                            <div style={setting} onClick={this.SettingClick}>设置</div>
                            <div style={{marginTop: "-0.5rem",whiteSpace:'pre'}} onClick={this.InfoClick}>{this.state.userInfo.realname?this.state.userInfo.realname:"  "}</div>
                            <div onClick={this.InfoClick}>
                                <span style={{marginRight: "7rem"}}>{this.state.userInfo.mobile}</span>
                                <img className="userIcon"
                                     src={phoneImg}/>
                                <img className="userIcon"
                                     src={companyImg}/>
                                <img className="userIcon"
                                     src={payImg}/>
                            </div>
                        </div>
                    </div>
                </div>
                <Cells>
                    <Cell access onClick={this.OrderClick.bind(this, 0)}>
                        <CellBody>
                            <span style={{fontSize: "1.4rem"}}>我的订单</span>
                        </CellBody>
                        <CellFooter>
                            <span style={{fontSize: "1.2rem"}}>更多订单</span>
                        </CellFooter>
                    </Cell>
                    <Cell>
                        <CellBody>
                            <div style={{display: "flex", width: "100%"}}>
                                <div className="orderMenu">
                                    <div style={menu}>
                                        <div className="menuBg" onClick={this.OrderClick.bind(this, 1)}
                                             style={{
                                                 background: "url('/assets/images/userCenter/user_unpay.png') no-repeat",
                                                 backgroundSize: "cover"
                                             }}>
                                            {
                                                this.state.orderNum1 > 0 ?
                                                    <Badge preset="header">{this.state.orderNum1}</Badge> : null
                                            }
                                        </div>
                                    </div>
                                    <div>待付款</div>
                                </div>
                                <div className="orderMenu">
                                    <div style={menu}>
                                        <div className="menuBg" onClick={this.OrderClick.bind(this, 2)}
                                             style={{
                                                 background: "url('/assets/images/userCenter/user_wait.png') no-repeat",
                                                 backgroundSize: "cover"
                                             }}>
                                            {
                                                this.state.orderNum2 > 0 ?
                                                    <Badge preset="header">{this.state.orderNum2}</Badge> : null
                                            }
                                        </div>
                                    </div>
                                    <div>待发货</div>
                                </div>
                                <div className="orderMenu">
                                    <div style={menu}>
                                        <div className="menuBg" onClick={this.OrderClick.bind(this, 3)}
                                             style={{
                                                 background: "url('/assets/images/userCenter/user_check.png') no-repeat",
                                                 backgroundSize: "cover"
                                             }}>
                                            {
                                                this.state.orderNum3 > 0 ?
                                                    <Badge preset="header">{this.state.orderNum3}</Badge> : null
                                            }
                                        </div>
                                    </div>
                                    <div>待收货</div>
                                </div>
                                <div className="orderMenu">
                                    <div style={menu}>
                                        <div className="menuBg" onClick={this.OrderClick.bind(this, 4)}
                                             style={{
                                                 background: "url('/assets/images/userCenter/user_judge.png') no-repeat",
                                                 backgroundSize: "cover"
                                             }}>
                                            {
                                                this.state.orderNum4 > 0 ?
                                                    <Badge preset="header">{this.state.orderNum4}</Badge> : null
                                            }
                                        </div>
                                    </div>
                                    <div>待验货</div>
                                </div>
                                <div className="orderMenu">
                                    <div style={menu}>
                                        <div className="menuBg" onClick={this.ServiceClick}
                                             style={{
                                                 background: "url('/assets/images/userCenter/user_service.png') no-repeat",
                                                 backgroundSize: "cover"
                                             }}>
                                            {
                                                this.state.orderNum5 > 0 ?
                                                    <Badge preset="header">{this.state.orderNum5}</Badge> : null
                                            }
                                        </div>
                                    </div>
                                    <div>退款／售后</div>
                                </div>
                            </div>
                        </CellBody>
                    </Cell>
                </Cells>
                <Cells>
                    <Cell onClick={this.MoneyClick} access>
                        <CellHeader>
                            <img src="/assets/images/userCenter/user_money.png" alt=""
                                 style={cellImg}/>
                        </CellHeader>
                        <CellBody>
                            <span style={{fontSize: "1.4rem"}}>我的余额</span>
                        </CellBody>
                        <CellFooter>
                            {/*{this.formatMoney(this.state.userInfo.balance)}*/}
                        </CellFooter>
                    </Cell>
                    {/*<Cell onClick={this.FacilityClick} access>*/}
                    {/*<CellHeader>*/}
                    {/*<img src="/assets/images/userCenter/user_facility.png" alt=""*/}
                    {/*style={cellImg}/>*/}
                    {/*</CellHeader>*/}
                    {/*<CellBody>*/}
                    {/*<span style={{fontSize: "1.4rem"}}>我的授信</span>*/}
                    {/*</CellBody>*/}
                    {/*<CellFooter>*/}
                    {/*{this.formatMoney(this.state.userInfo.availablelimit)}*/}
                    {/*</CellFooter>*/}
                    {/*</Cell>*/}
                    <Cell onClick={this.BankCardClick} access>
                        <CellHeader>
                            <img src="/assets/images/userCenter/user_bankcard.png" alt=""
                                 style={cellImg}/>
                        </CellHeader>
                        <CellBody>
                            <span style={{fontSize: "1.4rem"}}>我的银行卡</span>
                        </CellBody>
                        <CellFooter>
                        </CellFooter>
                    </Cell>
                {/*</Cells>*/}
                {/*<Cells>*/}
                    <Cell onClick={this.AddressClick} access>
                        <CellHeader>
                            <img src="/assets/images/userCenter/user_address.png" alt=""
                                 style={cellImg}/>
                        </CellHeader>
                        <CellBody>
                            <span style={{fontSize: "1.4rem"}}>我的收货地址</span>
                        </CellBody>
                        <CellFooter>
                        </CellFooter>
                    </Cell>
                    <Cell onClick={this.ReceiptClick} access>
                        <CellHeader>
                            <img src="/assets/images/userCenter/user_receipt.png" alt=""
                                 style={cellImg}/>
                        </CellHeader>
                        <CellBody>
                            <span style={{fontSize: "1.4rem"}}>我的开票信息</span>
                        </CellBody>
                        <CellFooter>
                        </CellFooter>
                    </Cell>
                </Cells>
                {/*<Cells>*/}
                    {/*<Cell onClick={this.CollectionClick} access>*/}
                        {/*<CellHeader>*/}
                            {/*<img src="/assets/images/userCenter/user_collection.png" alt=""*/}
                                 {/*style={cellImg}/>*/}
                        {/*</CellHeader>*/}
                        {/*<CellBody>*/}
                            {/*<span style={{fontSize: "1.4rem"}}>商品收藏</span>*/}
                        {/*</CellBody>*/}
                        {/*<CellFooter>*/}
                        {/*</CellFooter>*/}
                    {/*</Cell>*/}
                    {/*<Cell onClick={this.PromotionClick} access>*/}
                        {/*<CellHeader>*/}
                            {/*<img src="/assets/images/userCenter/user_promotion.png" alt=""*/}
                                 {/*style={cellImg}/>*/}
                        {/*</CellHeader>*/}
                        {/*<CellBody>*/}
                            {/*<span style={{fontSize: "1.4rem"}}>平台推广</span>*/}
                        {/*</CellBody>*/}
                        {/*<CellFooter>*/}
                        {/*</CellFooter>*/}
                    {/*</Cell>*/}
                {/*</Cells>*/}
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
            </div>
        )
    }


}
UserCenter.defaultProps = {
    show: true

};