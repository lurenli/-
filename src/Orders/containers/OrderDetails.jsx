import React, {Component} from 'react';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import GoodsListItem from '../components/GoodsListItem.jsx';
import Loading from '../../Common/Loading/Loading.jsx';
import WeUI from 'react-weui';
import {formatDate} from '../../../assets/js/common.js';
import Base64 from "../../../assets/js/Base64";
//import styles
import 'weui';
import {CSS} from '../style/order.css';

let bottomStyle = {
    width: "100%",
    position: "absolute",
    bottom: "0",
    height: "4rem",
    lineHeight: "1.8rem",
    padding: '0.5rem 1rem',
    textAlign: "right",
    borderTop: "1px solid #eee"
};
let rightStyle = {
    float: "right"
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
let iconStyle = {width: '1.5rem', height: "1.5rem", verticalAlign: "middle", marginRight: "0.5rem"};
const {Input, Cells, Cell, CellHeader, CellBody, CellFooter, Toptips, Dialog, Popup} = WeUI;
let pathHeader = '/weixin';
let stop = false;//防止重复提交
//微信支付需要的变量信息
let appId ="";
let timeStamp ="";
let nonceStr ="";
let packageValue ="";
let signType ="";
let paySign ="";
export default class OrderDetails extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.PayShow = this.PayShow.bind(this);
        this.CancelClick = this.CancelClick.bind(this);
        this.InspectionClick = this.InspectionClick.bind(this);
        this.InputChange = this.InputChange.bind(this);
        this.EvaluateClick = this.EvaluateClick.bind(this);
        this.CheckLogistics = this.CheckLogistics.bind(this);
        this.goServiceDetail = this.goServiceDetail.bind(this);
        this.CancelPay = this.CancelPay.bind(this);
        this.BottomShow = this.BottomShow.bind(this);
        this.state = {
            balance: "",
            nowtime: "",
            getliquidated: "",
            timelimit: "",
            timeInfo: 0,
            orderInfo: {},
            orderProducts: [],
            expressurl: "",
            tickInfo: null,//开票信息
            orderNo: this.props.location.query.orderNo,
            days: "",
            hours: "",
            minutes: "",
            seconds: "",
            isLoading: true,
            showWarn: false,
            showSuccess: false,
            warnTimer: null,
            successTimer: null,
            tipText: "",
            successText: "",
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
                        onClick: this.CancelOrder.bind(this)
                    }
                ]
            },
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
            inspection_buttons: [
                {
                    type: 'default',
                    label: '取消',
                    onClick: this.HideDialog.bind(this)
                },
                {
                    type: 'primary',
                    label: '确认',
                    onClick: this.Inspection.bind(this)
                }
            ],
            payPassword: "",//支付密码
        };
        this.state.warnTimer && clearTimeout(this.state.warnTimer);
        this.state.successTimer && clearTimeout(this.state.successTimer);
    }

    HideDialog() {
        this.setState({
            showDialog: false,
            pay_show: false,
            payPassword: "",
            inspection_show: false
        });
    }

    PayClick() {
        if (this.state.payPassword.length > 0 && !stop) {
            stop = true;
            let self = this;
            let formData = new FormData();
            formData.append("type", 0);//type传0用余额支付，传1用授信支付
            formData.append("payMoney", self.calcmunD(self.state.orderInfo.actualpayment));// {1,2}
            formData.append("paySecret", Base64.encode(self.state.payPassword));
            formData.append("orders", self.state.orderInfo.id);
            formData.append("webToken", localStorage.getItem('webToken'));
            fetch(getHost() + "/rest/buyer/orders/payByBanlance", {
                method: 'POST',
                credentials: 'include',
                body: formData
            }).then(response => response.json()).then(json => {
                if (json.result === 1) {
                    console.log(json);
                    // self.showSuccess();
                    stop = false;
                    self.setState({
                        payPassword: "",
                        pay_show: false,
                    });
                    location.href = pathHeader + '/PaySuccess?orderNo=' + self.state.orderInfo.orderno;
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
            formData.append("orderno", self.state.orderInfo.orderno);//
            formData.append("state", 4);//
            formData.append("webToken", localStorage.getItem('webToken'));
            fetch(getHost() + "/rest/buyer/orders/updateOrderState", {
                method: 'POST',
                credentials: 'include',
                body: formData
            }).then(response => response.json()).then(json => {
                if (json.result === 1) {
                    console.log(json);
                    self.showSuccess("收货成功");
                    stop = false;
                    self.setState({
                        payPassword: "",
                        getGood_show: false,
                    });
                    self.loadData();
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

    Inspection() {//确认验货
        if (this.state.payPassword.length > 0 && !stop) {
            stop = true;
            let self = this;
            let formData = new FormData();
            formData.append("orderno", self.state.orderInfo.orderno);//
            formData.append("state", 5);//
            formData.append("paySecret", Base64.encode(self.state.payPassword));// pwd
            formData.append("webToken", localStorage.getItem('webToken'));
            fetch(getHost() + "/rest/buyer/orders/updateOrderState", {
                method: 'POST',
                credentials: 'include',
                body: formData
            }).then(response => response.json()).then(json => {
                if (json.result === 1) {
                    console.log(json);
                    self.showSuccess("验货成功");
                    stop = false;
                    self.setState({
                        payPassword: "",
                        inspection_show: false,
                    });
                    self.loadData();
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

    componentWillMount() {
        this.getwy();
        this.getBalance();
    }

    componentDidMount() {
    }

    componentWillUnmount() {
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

    LeftClick() {
        HistoryManager.pageBack();
    }

    loadData() {//''
        let self = this;
        self.setState({
            isLoading: true
        });
        let fromData = new FormData();
        fromData.append("orderNo", self.state.orderNo);
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/orders/getOrderDetail", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                self.setState({
                    orderInfo: json.data.orders,
                    expressurl: json.data.expressurl,
                    orderProducts: json.data.orderProducts,
                    starttime: self.upTime(json.data.orders.sellerdeliverytime),
                    isLoading: false
                });
                localStorage.setItem('orderId', json.data.orders.id);
                self.getTickInfo(json.data.orders.id);
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

    //根据订单获取开票信息
    getTickInfo(orderid) {
        let self = this;
        self.setState({
            isLoading: true
        });
        let fromData = new FormData();
        fromData.append("orderid", orderid);
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/orders/getBillingRecordByOrderNo", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                self.setState({
                    tickInfo: json.data.billingRecord,
                    isLoading: false
                });
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

    //计算违约金
    jisuan(money) {
        let value = parseFloat(money * this.state.getliquidated);
        return value.toFixed(2)
    }

    //获取违约金比例
    getwy() {
        let self = this;
        self.setState({
            isLoading: true
        });
        let fromData = new FormData();
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/transaction/loadAllTransactionSetting", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                self.setState({
                    getliquidated: json.data.transactionSettings.getliquidated / 100,
                    timelimit: json.data.transactionSettings.confirmreceipttimeout,
                    isLoading: false
                });
                self.loadData();
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

    getBalance() {
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
                // self.showSuccess();
                self.setState({balance: json.data.balance});
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

    //时间转换
    upTime(value) {
        if (!value) {
            return ''
        } else {
            let date = new Date(value);
            return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
        }
    }


    //计算单个订单列表总价
    calcmunD(item) {
        if (item) {
            return item.toFixed(2)
        } else {
            return ''
        }

    }

    //计算订单列表总价
    calcmun() {
        let payFor = 0;
        for (let i = 0; i < this.state.orderProducts.length; i++) {
            payFor += parseFloat(this.state.orderProducts[i].num * this.state.orderProducts[i].price)
        }
        return payFor.toFixed(2)
    }

    //计算订单列表运费总价
    calcmunYF() {
        let payFor = 0;
        for (let i = 0; i < this.state.orderProducts.length; i++) {
            payFor += parseFloat(this.state.orderProducts[i].freight)
        }
        return payFor.toFixed(2)
    }

    CancelClick() {
        let str = "";
        if (this.state.orderInfo.orderstatus == 1 || this.state.orderInfo.orderstatus == 9 || this.state.orderInfo.orderstatus == 8) {//订单类型0=立即发货1=远期全款2=远期定金3=远期余款
            if (this.state.orderProducts[0].producttype == 1 && this.state.orderInfo.orderstatus != 9 && this.state.orderInfo.orderstatus != 8) {
                str = "若已支付将扣除保证金¥" + this.jisuan(this.state.orderInfo.actualpayment - this.state.orderInfo.freight);
            } else if (this.state.orderProducts[0].producttype == 1 && (this.state.orderInfo.orderstatus == 9 || this.state.orderInfo.orderstatus == 8)) {//只付订金
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

    CancelOrder() {//取消订单
        if (!stop) {
            stop = true;
            let self = this;
            let formData = new FormData();
            formData.append("type", 0);//
            formData.append("id", self.state.orderInfo.id);// orderid
            formData.append("webToken", localStorage.getItem('webToken'));
            fetch(getHost() + "/rest/buyer/orders/cancelOrders", {
                method: 'POST',
                credentials: 'include',
                body: formData
            }).then(response => response.json()).then(json => {
                if (json.result === 1) {
                    console.log(json);
                    self.showSuccess("取消成功");
                    stop = false;
                    self.loadData()
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

    PayShow() {
        this.setState({bottom_show: false, pay_show: true});
    }

    GetShow() {
        this.setState({getGood_show: true});
    }

    InspectionClick() {//确认验货
        this.setState({inspection_show: true});
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
            let formData = new FormData();
            formData.append("orders", self.state.orderInfo.id);
            formData.append("type", 1);
            formData.append("isCompany", false);
            fetch(getHost() + "/rest/bankpay/toPay", {
                method: 'POST',
                credentials: 'include',
                body: fromData
            }).then(response => response.json()).then(json => {
                if (json.result === 1) {
                    console.log(json);
                    self.setState({bottom_show: false});
                    window.location.href = json.data.url;
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

    ReceiptClick() {//申请开票

    }

    EvaluateClick() {//去评价
        let url = pathHeader + "/PublishEvaluation?orderNo=" + this.state.orderNo;
        HistoryManager.register(url);
        location.href = url;
    }

    CheckLogistics() {//查看物流
        let self = this;
        let formData = new FormData();
        formData.append("orderNo", self.state.orderNo);// orderid
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

    //根据退货状态---显示退款申请按钮(只有待验货，才是申请)
    checkBackstate(item) {
        if (item.backstate === 0) {
            if (this.state.orderInfo.orderstatus === 4) {
                return <div className="goods_btn_white" style={{float: "right", marginRight: "1rem",}}
                            onClick={this.goApplyService.bind(this, item.id)}>申请退款</div>;
            }
        } else {
            return <div className="goods_btn_white" style={{float: "right", marginRight: "1rem",}}
                        onClick={this.goServiceDetail.bind(this, item.id)}>退款中</div>;
        }
    }

    //到申请退货退款的页面
    goApplyService(id) {
        let url = pathHeader + "/ApplyService?orderpdid=" + id;
        HistoryManager.register(url);
        location.href = url;
    }

    //到退货退款中的页面
    goServiceDetail(id) {
        let url = pathHeader + "/ServiceDetail?orderpdid=" + id;
        HistoryManager.register(url);
        location.href = url;
    }

    render() {

        //是否已评价
        let isTrue = false;
        for (let i = 0; i < this.state.orderProducts.length; i++) {
            let a = this.state.orderProducts[i].evaluatestate;
            let b = this.state.orderProducts[i].backstate;
            if (a === 0) {
                isTrue = true;
                // console.log('未评价');
                break;
            }
        }

        //根据订单显示状态
        let isShow = 2;
        let orderState = "";
        let state = "";
        let reason = "";
        let btnsDiv = null;
        let bottomHeight = 0;
        switch (this.state.orderInfo.orderstatus) {
            //待付款
            case 0:
                isShow = 0;
                orderState = '待付款';
                state = "等待付款";
                reason = "";
                btnsDiv = <div style={bottomStyle}>
                    <div className="goods_btn_white" onClick={this.CancelClick}>取消订单</div>
                    <div className="goods_btn_red" onClick={this.BottomShow}>立即付款</div>
                </div>;
                bottomHeight = 4;
                break;

            //待发货
            case 1:
                isShow = 1;
                orderState = '待发货';
                state = "您已付款，待商家发货中";
                break;

            //待收货
            case 3:
                isShow = 3;
                orderState = '待收货';
                state = "商家已发货，等待买家确认";
                btnsDiv = <div style={bottomStyle}>
                    <div className="goods_btn_white" onClick={this.CheckLogistics}>查看物流</div>
                    {/*<div className="goods_btn_red" onClick={this.GetShow}>确认收货</div>*/}
                </div>;
                bottomHeight = 4;
                break;

            //待验货
            case 4:
                orderState = '待验货';
                state = "您已经收货";
                btnsDiv = <div style={bottomStyle}>
                    <div className="goods_btn_red" onClick={this.InspectionClick}>确认验货</div>
                </div>;
                bottomHeight = 4;
                break;

            //已完成
            case 5:
                if (isTrue === true) {
                    isShow = 5;
                    state = "交易成功，可评价";
                    btnsDiv = <div style={bottomStyle}>
                        <div className="goods_btn_white" onClick={this.EvaluateClick}>去评价</div>
                    </div>;
                    bottomHeight = 4;
                } else {
                    isShow = 6;
                    state = "交易成功，已评价";
                }
                orderState = '交易完成';


                break;

            //已关闭
            case 7:
                isShow = 7;
                orderState = '交易关闭';
                state = "交易关闭";
                reason = this.state.orderInfo.reason ? ":" + this.state.orderInfo.reason : "";
                break;
            case 8:
                isShow = 96;
                orderState = '备货中';
                state = "备货中";
                break;
            case 9:
                isShow = 86;
                orderState = '预定待发';
                state = '预定待发';
                break;
        }
        let navHeight = 4.4;
        let height = document.body.clientHeight * 37.5 / document.body.clientWidth - (bottomHeight + navHeight);
        let heightValue = height + "rem";
        return (
            <div>
                <NavigationBar Title="订单详情" LeftBar="true" LeftTitle="返回"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                <div style={{
                    height: heightValue,
                    paddingBottom: "0",
                    overflow: "scroll",
                    background: "#f2f2f2",
                    fontSize: "1.2rem"
                }}>
                    <div className="detail_state">
                        <div>{state}{reason}</div>
                    </div>
                    {/*<div className="detail_logistics">*/}
                    {/*<Cell access style={{padding: "0rem"}}>*/}
                    {/*<CellBody>*/}
                    {/*<div>*/}
                    {/*<img style={iconStyle} src="/assets/images/order/order_icon_logistics.png"/>*/}
                    {/*{this.state.orderInfo.logisticscompany}速运*/}
                    {/*</div>*/}
                    {/*<div>{this.state.orderInfo.sellerdeliverytime}</div>*/}
                    {/*</CellBody>*/}
                    {/*<CellFooter/>*/}
                    {/*</Cell>*/}
                    {/*</div>*/}
                    <div className="detail_address">
                        <div><img style={iconStyle}
                                  src="/assets/images/order/order_icon_address.png"/>{this.state.orderInfo.shipto}
                            <span style={rightStyle}>{this.state.orderInfo.phone}</span></div>
                        <div>地址:{this.state.orderInfo.province}{this.state.orderInfo.city}{this.state.orderInfo.area}{this.state.orderInfo.receivingaddress}</div>
                    </div>
                    <div className="detail_goods">
                        <div style={{width: "100%", padding: "1rem"}}>
                            <sapn>订单编号：{this.state.orderInfo.orderno}</sapn>
                            <span style={rightStyle}><span style={{marginRight: "0.5rem"}}>联系客服</span>
                                <img style={iconStyle} src="/assets/images/order/order_icon_call.png"/></span>
                        </div>
                        <div>
                            {
                                this.state.orderProducts.map((item, i) =>
                                    <div key={i}
                                         style={{overflow: "hidden", background: "#FAFAFA", paddingBottom: "1rem"}}>
                                        <GoodsListItem key={i} data={item}/>
                                        {this.checkBackstate(item)}
                                    </div>
                                )
                            }
                        </div>
                        <div style={{width: "100%", padding: "1rem"}}>
                            <div>订单编号：{this.state.orderInfo.orderno}</div>
                            <div>交易号：{this.state.orderInfo.code}</div>
                            {this.state.orderInfo.createtime ?
                                <div>创建时间：{this.upTime(this.state.orderInfo.createtime)}</div> : null

                            }
                            {this.state.orderInfo.paymenttime ?
                                <div>付款时间：{this.upTime(this.state.orderInfo.paymenttime)}</div> : null

                            }
                            {this.state.orderInfo.sellerdeliverytime ?
                                <div>发货时间：{this.upTime(this.state.orderInfo.sellerdeliverytime)}</div> : null

                            }
                            {this.state.orderInfo.buyerinspectiontime ?
                                <div>成交时间：{this.upTime(this.state.orderInfo.buyerinspectiontime)}</div> : null

                            }
                        </div>
                    </div>
                    {
                        this.state.tickInfo ? <div className="detail_invoice">
                            <div>发票类型：纸质发票</div>
                            <div>发票抬头：{this.state.tickInfo.invoiceheadup}</div>
                            <div>税号：{this.state.tickInfo.texno}</div>
                            <div>开户行：{this.state.tickInfo.bankofaccounts}</div>
                            <div>帐号：{this.state.tickInfo.account}</div>
                            <div>电话：{this.state.tickInfo.phone}</div>
                            <div>地址：{this.state.tickInfo.address}</div>
                        </div> : <div className="detail_invoice">
                            <div>未开票</div>
                        </div>
                    }

                    <div className="detail_price" style={{padding: "1rem"}}>
                        <div>商品总额：<span style={rightStyle}>¥{this.calcmun()}</span>
                        </div>
                        <div>运费：<span style={rightStyle}>¥{this.calcmunYF()}</span></div>
                        <div style={{textAlign: "right"}}>
                            实付款：<span style={{color: "red"}}>
                            ¥{this.calcmunD(this.state.orderInfo.actualpayment)}</span>
                        </div>
                    </div>
                </div>
                {btnsDiv}
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
                <Toptips type="primary" show={this.state.showSuccess}>{this.state.successText}</Toptips>
                <Dialog type="ios" title={this.state.dialog.title} buttons={this.state.dialog.buttons}
                        show={this.state.showDialog}>
                    {this.state.dialogText}
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
                                }}>余额({this.state.balance})
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
                    {/*<div style={dialogBtn} onClick={this.PayShow}>立即付款</div>*/}
                </Popup>
                <Dialog type="ios" title="请输入支付密码" buttons={this.state.pay_buttons}
                        show={this.state.pay_show}>
                    <Input style={inputStyle} type="password" value={this.state.payPassword}
                           onChange={this.InputChange}/>
                </Dialog>
                <Dialog type="ios" title="您确认收货么？" buttons={this.state.get_buttons}
                        show={this.state.getGood_show}>
                </Dialog>
                <Dialog type="ios" title="您确认验货么？" buttons={this.state.inspection_buttons}
                        show={this.state.inspection_show}>
                    <div>支付密码:
                        <Input style={inputStyle} type="password" value={this.state.payPassword}
                               onChange={this.InputChange}/>
                    </div>
                </Dialog>
            </div>
        )
    }


}