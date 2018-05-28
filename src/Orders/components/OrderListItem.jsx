import React, {Component} from 'react';
import GoodsListItem from './GoodsListItem.jsx';
import WeUI from 'react-weui';
import 'weui';
import Base64 from "../../../assets/js/Base64";

const {Toptips, Dialog, Input, Popup, Cell, CellHeader, CellBody, CellFooter} = WeUI;
let itemStyle = {
    background: "white",
    width: "100%",
    fontSize: "1.4rem",
    borderBottom: "0.5rem solid #f2f2f2"
};
let stateStyle = {
    color: "red",
    float: "right",
};
let textRight = {
    width: "100%",
    textAlign: "right",
    padding: "0 1rem",
    marginBottom: "1rem"
};
let inputStyle = {
    border: "1px solid #eeeeee",
    width: "20rem",
    height: "3rem",
    lineHeight: "3rem",
    fontSize: "1.4rem",
    padding: "0 1rem"
};
let dialogTitle = {
    height: "5rem",
    lineHeight: "5rem",
    textAlign: "center",
    borderBottom: "1px solid #f2f2f2"
};
let pathHeader = '/weixin';
let stop = false;//防止重复提交
//微信支付需要的变量信息
let appId ="";
let timeStamp ="";
let nonceStr ="";
let packageValue ="";
let signType ="";
let paySign ="";
export default class OrderListItem extends Component {
    constructor(props) {
        super(props);
        this.DetailClick = this.DetailClick.bind(this);
        this.PayShow = this.PayShow.bind(this);
        this.CancelOrder = this.CancelOrder.bind(this);
        this.CheckLogistics = this.CheckLogistics.bind(this);
        this.GetShow = this.GetShow.bind(this);
        this.InspectionShow = this.InspectionShow.bind(this);
        this.BottomShow = this.BottomShow.bind(this);
        this.CancelPay = this.CancelPay.bind(this);
        this.EvaluateClick = this.EvaluateClick.bind(this);
        this.InputChange = this.InputChange.bind(this);
        this.state = {
            showDialog: false,
            dialogText: "若取消远期订单将扣除全部定金，若已支付将扣除保证金。",
            dialog: {
                title: '您确认取消订单吗?',
                buttons: [
                    {
                        type: 'default',
                        label: '取消',
                        onClick: this.HideDialog.bind(this)
                    },
                    {
                        type: 'primary',
                        label: '确定',
                        onClick: this.cancelCallback.bind(this)
                    }
                ]
            },
            getGood_show: false,
            get_buttons: [
                {
                    type: 'default',
                    label: '取消',
                    onClick: this.HideDialog.bind(this)
                },
                {
                    type: 'primary',
                    label: '确认',
                    onClick: this.GetGood.bind(this)
                }
            ],
            inspection_show: false,
            inspection_title: "您确认验货么？",
            inspection_buttons: [
                {
                    type: 'default',
                    label: '取消',
                    onClick: this.HideDialog.bind(this)
                },
                {
                    type: 'primary',
                    label: '确认',
                    onClick: this.InspectionClick.bind(this)
                }
            ],
            bottom_show: false,
            pay_show: false,
            pay_buttons: [
                {
                    type: 'default',
                    label: '取消',
                    onClick: this.HideDialog.bind(this)
                },
                {
                    type: 'primary',
                    label: '支付',
                    onClick: this.PayClick.bind(this)
                }
            ],
            payPassword: "",//支付密码
            showWarn: false,
            showSuccess: false,
            warnTimer: null,
            successTimer: null,
            tipText: "",
            successText: ""
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

    showSuccess(text) {
        this.setState({showSuccess: true, successText: text});

        this.state.successTimer = setTimeout(() => {
            this.setState({showSuccess: false});
        }, 2000);
    }

    componentWillUnmount() {
        localStorage.setItem('orderId',this.props.id);
        if(this.props.location.query.code){
            let self = this;
            let fromData = new FormData();
            fromData.append("code", self.props.location.query.code);
            fromData.append("type", 'wap');
            fetch(getHost() + "/rest/thirdpart/login/getWxAccessToken", {
                method: 'POST',
                credentials: 'include',
                body: fromData
            }).then(response => response.json()).then(json => {
                if (json.result === 1) {
                    let self = this;
                    let fromData = new FormData();
                    fromData.append("webToken", localStorage.getItem('webToken'));
                    //在这里获取微信的code---得到openid
                    fromData.append("orders",localStorage.getItem('orderId'));
                    fromData.append("openid",json.data.wxAccessToken.openid);
                    fromData.append("type", 1);
                    fetch(getHost() + "/rest/wxpay/toPay4Js", {
                        method: 'POST',
                        credentials: 'include',
                        body: fromData
                    }).then(response => response.json()).then(json => {
                        if (json.result === 1) {
                            appId =json.data.result.appId;
                            timeStamp =json.data.result.timeStamp;
                            nonceStr =json.data.result.nonceStr;
                            packageValue =json.data.result.packageValue;
                            signType =json.data.result.signType;
                            paySign =json.data.result.paySign;
                            if (typeof WeixinJSBridge === "undefined"){
                                if( document.addEventListener ){
                                    document.addEventListener("WeixinJSBridgeReady", self.onBridgeReady, false);
                                }else if (document.attachEvent){
                                    document.attachEvent("WeixinJSBridgeReady", self.onBridgeReady);
                                    document.attachEvent("onWeixinJSBridgeReady", self.onBridgeReady);
                                }
                            }else{
                                self.onBridgeReady();
                            }
                        } else {
                            self.showWarn(json.message);
                            console.log(json.message)
                        }
                    }).catch(e => {
                        console.log("网络出现了点问题：" + e);
                        self.showWarn("网络出现了点问题");
                    });
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

    //写一个微信支付调取的方法
    onBridgeReady(){
        WeixinJSBridge.invoke(
            "getBrandWCPayRequest", {
                "appId" : appId,     //公众号名称，由商户传入
                "timeStamp": timeStamp,         //时间戳，自1970年以来的秒数
                "nonceStr" : nonceStr, //随机串
                "package" : packageValue,
                "signType" : signType,         //微信签名方式:
                "paySign" : paySign    //微信签名
            },
            function(res){
                if(res.err_msg === "get_brand_wcpay_request:ok" ) {
                    let url = pathHeader + '/PaySuccess?orderNo=' + localStorage.getItem('orderNo');
                    location.href = url;
                }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
            }
        );
    }

    HideDialog() {
        this.setState({
            showDialog: false,
            payPassword: "",
            pay_show: false,
            inspection_show: false,
            getGood_show: false
        });
    }

    InputChange(e) {
        let val = e.target.value;
        this.setState({payPassword: val})
    }

    ChoosePayment(typeId) {//选择付款方式：银行卡／微信
        if(typeId===1){
            // if(localStorage.getItem('openid')){
            //     let self = this;
            //     let fromData = new FormData();
            //     fromData.append("webToken", localStorage.getItem('webToken'));
            //     //在这里获取微信的code---得到openid
            //     fromData.append("orders",localStorage.getItem('orderId'));
            //     fromData.append("openid",localStorage.getItem('openid'));
            //     fromData.append("type", 1);
            //     alert(fromData);
            //     fetch(getHost() + "/rest/wxpay/toPay4Js", {
            //         method: 'POST',
            //         credentials: 'include',
            //         body: fromData
            //     }).then(response => response.json()).then(json => {
            //         if (json.result === 1) {
            //             self.setState({bottom_show: false});
            //             let url = pathHeader + '/PaySuccess?orderNo=' + localStorage.getItem('orderNo');
            //             location.href = url;
            //         } else {
            //             self.showWarn(json.message);
            //             console.log(json.message)
            //         }
            //     }).catch(e => {
            //         console.log("网络出现了点问题：" + e);
            //         self.showWarn("网络出现了点问题");
            //     });
            // }else{
                let url="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx6eb2a1213254a1df&redirect_uri=http%3a%2f%2fwww.jinshang9.com%2fweixin%2fOrderDetail&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect";
                window.open(url);
            // }
        } else if (typeId === 3) {//card
            let self = this;
            let fromData = new FormData();
            fromData.append("orders", self.props.id);
            fromData.append("type", 1);
            fromData.append("isCompany", false);
            fetch(getHost() + "/rest/bankpay/toPay", {
                method: 'POST',
                credentials: 'include',
                body: fromData
            }).then(response => response.json()).then(json => {
                if (json.result === 1) {
                    console.log(json);
                    self.setState({bottom_show: false});
                    location.href = json.data.url;
                    // self.showSuccess();
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

    BottomShow() {//选择付款方式弹筐
        this.setState({bottom_show: true});
    }

    CancelPay() {
        this.setState({bottom_show: false});
    }

    PayClick() {
        if (this.state.payPassword.length > 0 && !stop) {
            stop = true;
            let self = this;
            let formData = new FormData();
            formData.append("type", 0);//type传0用余额支付，传1用授信支付
            formData.append("payMoney", self.props.totalPrice.toFixed(2));// {1,2}
            formData.append("paySecret", Base64.encode(self.state.payPassword));
            formData.append("orders", self.props.id);
            fetch(getHost() + "/rest/buyer/orders/payByBanlance", {
                method: 'POST',
                credentials: 'include',
                body: formData
            }).then(response => response.json()).then(json => {
                if (json.result === 1) {
                    console.log(json);
                    // self.showSuccess();
                    stop = false;
                    location.href = pathHeader + '/PaySuccess';
                    self.setState({
                        payPassword: "",
                        pay_show: false,
                    });
                    self.props.reload();
                } else if (json.result === 2) {//登录失效
                    HistoryManager.register(pathHeader + '/Login');
                    location.href = pathHeader + '/Login';
                } else {
                    self.showWarn(json.message);
                    console.log(json.message)
                }
            }).catch(e => {
                console.log("网络出现了点问题：" + e);
                self.showWarn("网络出现了点问题");
            });
        } else {
            this.showWarn("请输入支付密码")
        }
    }

    GetGood() {//确认收货
        if (!stop) {
            stop = true;
            let self = this;
            let formData = new FormData();
            formData.append("orderno", self.props.orderno);//
            formData.append("state", 4);//
            fetch(getHost() + "/rest/buyer/orders/updateOrderState", {
                method: 'POST',
                credentials: 'include',
                body: formData
            }).then(response => response.json()).then(json => {
                if (json.result === 1) {
                    console.log(json);
                    self.showSuccess("收货成功");
                    self.setState({
                        getGood_show: false,
                    });
                    self.props.reload();
                } else if (json.result === 2) {//登录失效
                    HistoryManager.register(pathHeader + '/Login');
                    location.href = pathHeader + '/Login';
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

    InspectionClick() {//确认验货
        if (this.state.payPassword.length > 0&&!stop) {
            stop=true;
            let self = this;
            let formData = new FormData();
            formData.append("orderno", self.props.orderno);//
            formData.append("state", 5);//
            formData.append("paySecret", Base64.encode(self.state.payPassword));// pwd
            fetch(getHost() + "/rest/buyer/orders/updateOrderState", {
                method: 'POST',
                credentials: 'include',
                body: formData
            }).then(response => response.json()).then(json => {
                if (json.result === 1) {
                    console.log(json);
                    self.showSuccess("验货成功");
                    self.setState({
                        payPassword: "",
                        inspection_show: false,
                    });
                    self.props.reload();
                } else if (json.result === 2) {//登录失效
                    HistoryManager.register(pathHeader + '/Login');
                    location.href = pathHeader + '/Login';
                } else {
                    self.showWarn(json.message);
                    console.log(json.message)
                }
            }).catch(e => {
                console.log("网络出现了点问题：" + e);
                self.showWarn("网络出现了点问题");
            });
        } else {
            this.showWarn("请输入支付密码")
        }
    }

    CancelOrder() {
        let str = "";
        if (this.props.orderState == 1 || this.props.orderState == 9 || this.props.orderState == 8) {//订单类型0=立即发货1=远期全款2=远期定金3=远期余款
            if (this.props.goodsList[0].producttype == 1 && this.props.orderState != 9 && this.props.orderState != 8) {
                str = "若已支付将扣除保证金¥" + this.jisuan(this.props.actualpayment - this.props.yunfei);
            } else if (this.props.goodsList[0].producttype == 1 && (this.props.orderState == 9 || this.props.orderState == 8)) {//只付订金
                str = "取消远期订单将扣除全部定金";
            } else {
                str = "是否确认取消订单";
            }
        } else {
            str = "是否确认取消订单";
        }
        this.setState({
            showDialog: true,
            dialogText: str
        })
    }

    //计算违约金
    jisuan(money) {
        let value = parseFloat(money * this.props.getliquidated);
        return value.toFixed(2)
    }

    cancelCallback() {
        this.setState({
            showDialog: false,
        });
        this.props.cancelCallback(this.props.id);
    }

    componentWillMount() {

    }

    componentDidMount() {
    }

    DetailClick() {
        let url = pathHeader + "/OrderDetails?orderNo=" + this.props.orderno;
        HistoryManager.register(url);
        location.href = url;
    }

    //获取违约金比例
    getwy() {
        let self = this;

    }

    CheckLogistics() {
        let self = this;
        let formData = new FormData();
        formData.append("orderNo", self.props.orderno);// orderid
        formData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/orders/app/logisticsInfo", {
            method: 'POST',
            credentials: 'include',
            body: formData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                if (json.data.hasLogisticsInfo === "true") {
                    location.href = "https://m.kuaidi100.com/index_all.html?type=" + json.data.logisticsCompany + "&postid=" + json.data.logisticsNum;
                } else {
                    self.showWarn("暂无物流信息");
                }
            } else if (json.result === 2) {//登录失效
                HistoryManager.register(pathHeader + '/Login');
                location.href = pathHeader + '/Login';
            } else {
                if (json.message) {
                    self.showWarn(json.message);
                } else {
                    self.showWarn("暂无信息");
                }
                console.log(json.message)
            }
        }).catch(e => {
            console.log("网络出现了点问题：" + e);
            self.showWarn("网络出现了点问题");
        });
    }

    PayShow() {
        this.setState({bottom_show: false, pay_show: true});
    }

    GetShow() {
        this.setState({getGood_show: true});
    }

    InspectionShow() {
        this.setState({inspection_show: true});
    }

    EvaluateClick() {
        let url = pathHeader + "/PublishEvaluation?orderNo=" + this.props.orderno;
        HistoryManager.register(url);
        location.href = url;
    }

    render() {
        let stateDiv = null;
        let status = "";
        // if (this.props.backState === 0) {
        switch (this.props.orderState) {
            case 0:
                status = "待付款";
                stateDiv = <div style={{width: "100%", height: "5rem",}}>
                    <div style={textRight}>
                        <div className="goods_btn_white" onClick={this.CancelOrder}>取消订单</div>
                        <div className="goods_btn_red" onClick={this.BottomShow}>立即付款</div>
                    </div>
                </div>;
                break;
            case 1:
                status = "待发货";
                stateDiv = <div style={{width: "100%", height: "5rem",}}>
                    <div style={textRight}>
                        <div className="goods_btn_white" onClick={this.CancelOrder}>取消订单</div>
                    </div>
                </div>;
                break;
            case 3:
                status = "待收货";
                stateDiv = <div style={{width: "100%", height: "5rem",}}>
                    <div style={textRight}>
                        <div className="goods_btn_white" onClick={this.CheckLogistics}>查看物流</div>
                        <div className="goods_btn_red" onClick={this.GetShow}>确认收货</div>
                    </div>
                </div>;
                break;
            case 4:
                status = "待验货";
                stateDiv = <div style={{width: "100%", height: "5rem",}}>
                    <div style={textRight}>
                        <div className="goods_btn_red" onClick={this.InspectionShow}>确认验货</div>
                    </div>
                </div>;
                break;
            case 5:
                status = "已完成";
                let eva = false;
                for (let i = 0; i < this.props.goodsList.length; i++) {
                    if (this.props.goodsList[i].evaluatestate === 1) {
                        eva = true;
                        break;
                    }
                }
                if (eva) {
                    stateDiv = <div style={{width: "100%", height: "5rem"}}>
                        <div style={textRight}>
                            <div className="goods_btn_white">已评价</div>
                        </div>
                    </div>;
                } else {
                    stateDiv = <div style={{width: "100%", height: "5rem"}}>
                        <div style={textRight}>
                            <div className="goods_btn_white" onClick={this.EvaluateClick}>去评价</div>
                        </div>
                    </div>;
                }
                break;
            case 6:
                status = "已完成";

                break;
            case 7:
                status = "已关闭";
                stateDiv = <div style={{width: "100%", height: "5rem"}}>
                    <div style={textRight}>
                        {/*<div className="goods_btn_white">删除订单</div>*/}
                    </div>
                </div>;
                break;
            case 8:
                status = "备货中";
                break;
            case 9:
                status = "预定待发";
                break;
        }
        // } else if (this.props.backState === 1) {
        //     status = "退货中";
        // } else if (this.props.backState === 2) {
        //     status = "退货验收";
        // } else if (this.props.backState === 3) {
        //     status = "退货完成";
        // } else if (this.props.backState === 4) {
        //     status = "异议中";
        // }

        return (
            <div style={itemStyle}>
                <div style={{width: "100%", padding: "1rem"}}>
                    <sapn>订单编号：{this.props.orderno}</sapn>
                    <span style={stateStyle}>{status}</span>
                </div>
                <div onClick={this.DetailClick}>
                    {
                        this.props.goodsList.map((item, i) =>
                            <GoodsListItem key={i} data={item}/>
                        )
                    }
                </div>
                <div style={textRight}>
                    <span>共{this.props.goodsList.length}件商品，合计：￥{this.props.totalPrice.toFixed(2)}（运费：￥{this.props.yunfei.toFixed(2)}）</span>
                </div>
                {stateDiv}
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
                <Toptips type="primary" show={this.state.showSuccess}>{this.state.successText}</Toptips>
                <Dialog type="ios" title={this.state.dialog.title} buttons={this.state.dialog.buttons}
                        show={this.state.showDialog}>
                    {this.state.dialogText}
                </Dialog>
                <Dialog type="ios" title="您确认收货么？" buttons={this.state.get_buttons}
                        show={this.state.getGood_show}>
                </Dialog>
                <Dialog type="ios" title={this.state.inspection_title} buttons={this.state.inspection_buttons}
                        show={this.state.inspection_show}>
                    <div>支付密码:
                        <Input style={inputStyle} type="password" value={this.state.payPassword}
                               onChange={this.InputChange}/>
                    </div>
                </Dialog>
                <Dialog type="ios" title="请输入支付密码" buttons={this.state.pay_buttons}
                        show={this.state.pay_show}>
                    <Input style={inputStyle} type="password" value={this.state.payPassword}
                           onChange={this.InputChange}/>
                </Dialog>
                <Popup
                    show={this.state.bottom_show}
                    onRequestClose={e => this.setState({bottom_show: false})}
                >
                    <div style={{background: "white", fontSize: "1.6rem"}}>
                        <div style={dialogTitle}>
                            选择付款方式
                        </div>
                        <div style={{
                            width: "5rem",
                            height: "5rem",
                            padding: "1.5rem",
                            margin: "-5rem 0 0 0",
                            float: "left"
                        }} onClick={this.CancelPay}>
                            <img style={{width: "1.5rem", height: "1.5rem"}}
                                 src="/assets/images/common/dialog_cancel.png"/>
                        </div>
                        <Cell style={{backgroundColor: "white"}} onClick={this.PayShow}>
                            <CellHeader>
                                <img style={{
                                    width: "2.5rem",
                                    height: "2.5rem",
                                    marginRight: "2rem",
                                    verticalAlign: "middle"
                                }}
                                     src="/assets/images/userCenter/user_money.png"/>
                            </CellHeader>
                            <CellBody>
                                <div style={{
                                    fontSize: "1.4rem",
                                    height: "3rem",
                                    lineHeight: "3rem"
                                }}>余额({this.props.balance})
                                </div>
                            </CellBody>
                            <CellFooter/>
                        </Cell>
                        <Cell style={{backgroundColor: "white"}} onClick={this.ChoosePayment.bind(this, 1)}>
                        <CellHeader>
                        <img style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        marginRight: "2rem",
                        verticalAlign: "middle"
                        }}
                        src="/assets/images/userCenter/user_payment_wx.png"/>
                        </CellHeader>
                        <CellBody>
                        <div style={{fontSize: "1.4rem", height: "3rem", lineHeight: "3rem"}}>微信</div>
                        </CellBody>
                        <CellFooter/>
                        </Cell>
                        <Cell style={{backgroundColor: "white"}} onClick={this.ChoosePayment.bind(this, 3)}>
                            <CellHeader>
                                <img style={{
                                    width: "2.5rem",
                                    height: "2.5rem",
                                    marginRight: "2rem",
                                    verticalAlign: "middle"
                                }}
                                     src="/assets/images/userCenter/user_bankcard.png"/>
                            </CellHeader>
                            <CellBody>
                                <div style={{fontSize: "1.4rem", height: "3rem", lineHeight: "3rem"}}>银行卡支付
                                </div>
                            </CellBody>
                            <CellFooter/>
                        </Cell>
                    </div>
                </Popup>
            </div>
        )
    }


}
OrderListItem.defaultProps = {
    id: "",
    backState: -1,
    goodsList: [],
    totalPrice: "0.00",
    yunfei: "0.00",
};