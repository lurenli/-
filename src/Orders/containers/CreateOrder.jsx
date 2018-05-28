import React, {Component} from 'react';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import GoodsListItem from '../components/GoodsListItem.jsx';
import WeUI from 'react-weui';
import Base64 from '../../../assets/js/Base64.js';
import Loading from '../../Common/Loading/Loading.jsx';
//import styles
import 'weui';
import {CSS} from '../style/order.css';

const {Form, Cells, Cell, CellHeader, CellBody, CellFooter, Toptips, Popup, Dialog, Input, ActionSheet} = WeUI;
let bottomStyle = {
    position: "absolute",
    width: "100%",
    height: "6rem",
    lineHeight: "6rem",
    bottom: "0",
    fontSize: "1.6rem",
    textAlign: "center"
};
let contentStyle = {
    width: "100%",
    position: "absolute",
    top: "4.4rem",
    bottom: "6rem",
    overflowY: "scroll",
    background: "#f2f2f2"
};
let buyBtn = {
    display: "inline-block",
    width: "10rem",
    height: "6rem",
    background: "#E8000E",
    color: "white",
};
let redText = {
    color: "red"
};
let rightStyle = {
    float: "right"
};
let iconStyle = {
    width: '1.5rem',
    height: "1.5rem",
    verticalAlign: "middle",
    marginRight: "0.5rem"
};
let countStyle = {
    display: "inline-block",
    width: "27.5rem",
    height: "6rem",
    textAlign: "right",
    paddingRight: "1rem"
};
let dialogTitle = {
    height: "5rem",
    lineHeight: "5rem",
    textAlign: "center",
    borderBottom: "1px solid #f2f2f2"
};
let dialogBtn = {
    width: "100%",
    height: "5rem",
    lineHeight: "5rem",
    background: "red",
    color: "white",
    textAlign: "center",
    fontSize: "1.4rem"
};
let inputStyle = {
    border: "1px solid #eeeeee",
    width: "20rem",
    height: "3rem",
    lineHeight: "3rem",
    fontSize: "1.4rem",
    padding: "0 1rem"
};
let stop = false;//防止重复提交
let pathHeader = '/weixin';
//微信支付需要的变量信息
let appId ="";
let timeStamp ="";
let nonceStr ="";
let packageValue ="";
let signType ="";
let paySign ="";
export default class CreateOrder extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.OrderClick = this.OrderClick.bind(this);
        this.AddressClick = this.AddressClick.bind(this);
        this.ReceiptClick = this.ReceiptClick.bind(this);
        this.PayShow = this.PayShow.bind(this);
        this.PayHide = this.PayHide.bind(this);
        this.PayClick = this.PayClick.bind(this);
        this.CancelPay = this.CancelPay.bind(this);
        this.InputChange = this.InputChange.bind(this);
        this.CheckTransport = this.CheckTransport.bind(this);
        this.deliverybill_Menu = this.deliverybill_Menu.bind(this);//打开是否需要发货单的弹框
        this.state = {
            payOrderId: "",
            addressId: this.props.location.query.addressId,//更新的地址id
            invoiceId: this.props.location.query.invoiceId,//更新的发票id
            tickInfo: {},
            goodsList: [],
            transport: [],
            addressList: [],
            defaultAddress: {
                shipto: '',
                phone: '',
                address: '',
                isdefault: 0,
            },
            addressInfo: {
                shipto: '',
                phone: '',
                address: '',
                isdefault: 0,
            },
            totalCost: 0,
            totalPrice: 0,
            bottom_show: false,
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
            payPassword: "",//支付密码
            showWarn: false,
            warnTimer: null,
            tipText: "",
            //    是否需要发货单
            deliverybill: 1,//1-需要，0-不需要
            deliverybill_show: false,
            deliverybill_menus: [{
                label: "需要",
                onClick: () => {
                    this.setState({deliverybill: 1, deliverybill_show: false})
                }
            }, {
                label: "不需要",
                onClick: () => {
                    this.setState({deliverybill: 0, deliverybill_show: false})
                }
            }],
            deliverybill_actions: [
                {
                    label: '取消',
                    onClick: this.deliverybill_hide.bind(this)
                }
            ],
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
                    alert(fromData);
                    fetch(getHost() + "/rest/wxpay/toPay4Js", {
                        method: 'POST',
                        credentials: 'include',
                        body: fromData
                    }).then(response => response.json()).then(json => {
                        if (json.result === 1) {
                             alert(json);
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
                            // self.setState({bottom_show: false});
                            // let url = pathHeader + '/PaySuccess?orderNo=' + localStorage.getItem('orderNo');
                            // location.href = url;
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
        if (this.state.addressId) {
            this.getChooseAddress(parseInt(this.state.addressId));
        } else {
            this.getDefaultAddress();
        }
        if (this.state.invoiceId) {
            this.getChooseTicket();
        } else {
            this.getDefaultTick();
        }
        this.getBalance();
    }

    componentDidMount() {
    }

    LeftClick() {
        HistoryManager.pageBack();
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
                alert("支付成功");
                let url = pathHeader + '/PaySuccess?orderNo=' + localStorage.getItem('orderNo');
                location.href = url;
            }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
        }
    );
    }
    //发货单弹出框的隐藏
    deliverybill_hide() {
        this.setState({
            deliverybill_show: false,
        });
    }

    //打开发货单的弹框
    deliverybill_Menu() {
        this.setState({deliverybill_show: true})
    }

    //发货单的转换
    Checkdeliverybill(deliverybill) {
        let deliverybillCh = "需要";
        if (deliverybill === 0) {
            deliverybillCh = "不需要";
        }
        return deliverybillCh;
    }

    //获取订单确认页面商品列表
    getGoodsList() {
        let type = parseInt(localStorage.getItem("type"));
        let self = this;
        let formData = new FormData();
        formData.append("webToken", localStorage.getItem('webToken'));
        formData.append("type", type);
        formData.append("uProvince", this.state.defaultAddress ? this.state.defaultAddress.province : "");
        formData.append("uCity", this.state.defaultAddress ? this.state.defaultAddress.city : "");
        if (type === 0) {
            let goodsInfo = JSON.parse(localStorage.getItem("goodsInfo"));
            formData.append("pdids", goodsInfo.pdid);
            formData.append("pdnum", goodsInfo.pdnumber);
            formData.append("pdno", goodsInfo.pdno);
            formData.append("pdunit", goodsInfo.unit);
            formData.append("pddilivery", goodsInfo.deliverytime);
            formData.append("pdstoreid", goodsInfo.storeid ? goodsInfo.storeid : "");
            formData.append("protype", goodsInfo.protype);
            formData.append("isonline", goodsInfo.isonline ? goodsInfo.isonline : "");//限时购
            formData.append("limitid", goodsInfo.limitid ? goodsInfo.limitid : "");//限时购
        } else if (type === 1) {
            let ids = JSON.parse(localStorage.getItem("cartIds"));
            console.log(ids);
            formData.append("shopcarids", ids);
        }
        fetch(getHost() + "/rest/buyer/shopcar/loadSelectProduct", {
            method: 'POST',
            credentials: 'include',
            body: formData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                // self.showSuccess();
                let goodsList = json.data.list.length > 0 ? json.data.list : [];
                let arr = [];
                for (let i = 0; i < goodsList.length; i++) {
                    arr.push(0);
                }
                self.setState({
                    transport: arr,
                    goodsList: goodsList,
                    totalCost: self.calYunfei(goodsList),
                    totalPrice: self.calcmun(goodsList),
                })
            } else if (json.result === 2) {//登录失效
                HistoryManager.register(pathHeader + '/Login');
                location.href = pathHeader + '/Login';
            } else {
                self.showWarn(json.message);
                console.log(json.message)
            }
        }).catch(e => {
            console.log("网络出现了点问题：" + e);
            // self.showWarn("网络出现了点问题");
        });
    }

    //获取默认地址 联系人 电话
    getDefaultAddress() {
        let self = this;
        let formData = new FormData();
        formData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/ShippingAddress/listShippingAddress", {
            method: 'POST',
            credentials: 'include',
            body: formData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                // self.showSuccess();
                let addressList = json.data.pageInfo.list;
                let defaultAddress = "";
                if (addressList.length === 0) {
                    defaultAddress = null;
                } else {
                    defaultAddress = json.data.pageInfo.list.find(o => o.isdefault === 1);
                }
                self.setState({
                    addressList: addressList,
                    defaultAddress: defaultAddress
                });
                self.getGoodsList();
            } else if (json.result === 2) {//登录失效
                HistoryManager.register(pathHeader + '/Login');
                location.href = pathHeader + '/Login';
            } else {
                self.showWarn(json.message);
                console.log(json.message)
            }
        }).catch(e => {
            console.log("网络出现了点问题：" + e);
            // self.showWarn("网络出现了点问题");
        });
    }

    //获取选中地址 联系人 电话
    getChooseAddress(chooseId) {
        let self = this;
        let formData = new FormData();
        formData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/ShippingAddress/listShippingAddress", {
            method: 'POST',
            credentials: 'include',
            body: formData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                // self.showSuccess();
                let addressList = json.data.pageInfo.list;
                let defaultAddress = "";
                if (addressList.length === 0) {
                    defaultAddress = null;
                } else {
                    defaultAddress = json.data.pageInfo.list.find(o => o.id === chooseId);
                }
                self.setState({
                    addressList: addressList,
                    defaultAddress: defaultAddress
                });
                self.getGoodsList();
            } else if (json.result === 2) {//登录失效
                HistoryManager.register(pathHeader + '/Login');
                location.href = pathHeader + '/Login';
            } else {
                self.showWarn(json.message);
                console.log(json.message)
            }
        }).catch(e => {
            console.log("网络出现了点问题：" + e);
            // self.showWarn("网络出现了点问题");
        });
    }

    //获取默认开票信息
    getDefaultTick() {
        let self = this;
        let formData = new FormData();
        formData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/invoiceInfo/default/detail", {
            method: 'POST',
            credentials: 'include',
            body: formData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                // self.showSuccess();
                if (!json.data) {
                    console.log('未设置开票信息');
                } else {
                    self.setState({
                        tickInfo: json.data,
                    });
                }
            } else if (json.result === 2) {//登录失效
                HistoryManager.register(pathHeader + '/Login');
                location.href = pathHeader + '/Login';
            } else {
                self.showWarn(json.message);
                console.log(json.message)
            }
        }).catch(e => {
            console.log("网络出现了点问题：" + e);
            // self.showWarn("网络出现了点问题");
        });
    }

    //获取开票信息
    getChooseTicket() {
        let self = this;
        let formData = new FormData();
        formData.append('invoiceId', this.state.invoiceId);
        formData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/invoiceInfo/detail", {
            method: 'POST',
            credentials: 'include',
            body: formData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                // self.showSuccess();
                if (json.data.length === 0) {
                    console.log('未设置开票信息');
                }
                self.setState({
                    tickInfo: json.data,
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
            // self.showWarn("网络出现了点问题");
        });
    }

    //计算订单运费总价
    calYunfei(list) {
        let payFor = 0;
        for (let i = 0; i < list.length; i++) {
            if (list[i].totalCost) {
                payFor += (parseFloat(list[i].totalCost) + 0.0001);
            }
        }
        return payFor.toFixed(2)
    }

    //计算订单列表总价
    calcmun(list) {
        let payFor = 0;
        for (let i = 0; i < list.length; i++) {
            let item_price;
            let totalCost = list[i].totalCost;
            totalCost += 0.000001;
            if (list[i].partpay) {
//            console.log('定金')
                item_price = list[i].partpay;
                item_price += 0.000001;
                payFor += parseFloat(item_price.toFixed(2));
            } else if (list[i].allpay) {
//            console.log('远期全款')
                item_price = list[i].allpay;
                item_price += 0.000001;
                payFor += parseFloat(item_price.toFixed(2)) + parseFloat(totalCost.toFixed(2));
            } else {
                item_price = list[i].pdnumber * list[i].price;
                item_price += 0.000001;
                payFor += parseFloat(item_price.toFixed(2)) + parseFloat(totalCost.toFixed(2))
//            console.log('立即发货')
            }
        }
        return payFor.toFixed(2);
    }

    AddressClick() {
        //如果存在地址。则跳选择地址，否则添加地址
        if (this.state.defaultAddress) {
            let url = pathHeader + "/ChooseAddress";
            // HistoryManager.register(url);
            location.href = url;
        } else {
            let url = pathHeader + "/MyAddress";
            HistoryManager.register(url);
            location.href = url;
        }

    }

    ReceiptClick() {//选择发票抬头
        if (this.state.tickInfo.id) {
            let url = pathHeader + "/ChooseReceipt";
            // HistoryManager.register(url);
            location.href = url;
        } else {
            let url = pathHeader + "/MyReceiptAdd";
            HistoryManager.register(url);
            location.href = url;
        }
    }


    OrderClick() {//提交订单
        if (this.state.defaultAddress) {
            this.setState({bottom_show: true, isLoading: true});
            let self = this;
            let type = parseInt(localStorage.getItem("type"));
            let formData = new FormData();
            formData.append("webToken", localStorage.getItem('webToken'));
            if (type === 1 && stop === false) {
                stop = true;//开启限制
                let arr = self.state.transport;
                let goods = self.state.goodsList;
                let newArr = [];
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i] > 0) {
                        newArr.push(goods[i].pdid);
                    }
                }
                let ids = JSON.parse(localStorage.getItem("cartIds"));
                formData.append("province", self.state.defaultAddress.province);
                formData.append("city", self.state.defaultAddress.city);
                formData.append("area", self.state.defaultAddress.citysmall);
                formData.append("receivingaddress", self.state.defaultAddress.address);
                formData.append("shipto", self.state.defaultAddress.shipto);
                formData.append("phone", self.state.defaultAddress.phone);
                formData.append("ids", ids);
                formData.append("invoiceid", self.state.tickInfo.id ? self.state.tickInfo.id : "");
                formData.append("billingtype", 0);//发票类型0=纸质1=电子
                formData.append("deliverybill", self.state.deliverybill);//发货单0=不需要1=需要
                formData.append("isbilling", self.state.tickInfo.length > 0 ? 1 : 0);//是否开票0=不开票1=开票
                formData.append("mailornotPidArray", newArr);//trans
                fetch(getHost() + "/rest/buyer/orders/submitOrders", {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                }).then(response => response.json()).then(json => {
                    if (json.result === 1) {
                        console.log(json);
                        // self.showSuccess();
                        localStorage.setItem('payMoney', self.state.totalPrice);
                        let Arr = [];
                        let List = json.data.ordersList;
                        for (let i = 0; i < List.length; i++) {
                            if (List[i].id) {
                                let aaa = List[i].id;
                                Arr.push(aaa);
                            }
                        }
                        let orderno = List[0].orderno;
                        let orderId = Arr.join(',');
                        localStorage.setItem('orderId', orderId);
                        localStorage.setItem('orderNo', orderno);
                        stop = false;//关闭限制
                        self.setState({
                            orderNo: orderno,
                            payOrderId: orderId,
                            isLoading: false,
                        })
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
            } else if (type === 0 && stop === false) {
                stop = true;//开启限制
                let goodsInfo = JSON.parse(localStorage.getItem("goodsInfo"));
                formData.append("pdid", goodsInfo.pdid);
                formData.append("num", goodsInfo.pdnumber);
                formData.append("unit", goodsInfo.unit);
                formData.append("sellerid", goodsInfo.saleid ? goodsInfo.saleid : "");
                formData.append("pdno", goodsInfo.pdno);
                formData.append("storeid", goodsInfo.storeid ? goodsInfo.storeid : "");
                formData.append("storename", goodsInfo.storename ? goodsInfo.storename : "");
                formData.append("deliverytime", goodsInfo.deliverytime);
                formData.append("ismailornot", 0);
                formData.append("protype", goodsInfo.protype);
                formData.append("isonline", goodsInfo.isonline ? goodsInfo.isonline : 0);//限时购
                formData.append("limitid", goodsInfo.limitid ? goodsInfo.limitid : "");//限时购
                formData.append("province", self.state.defaultAddress.province);
                formData.append("city", self.state.defaultAddress.city);
                formData.append("area", self.state.defaultAddress.citysmall);
                formData.append("receivingaddress", self.state.defaultAddress.address);
                formData.append("shipto", self.state.defaultAddress.shipto);
                formData.append("phone", self.state.defaultAddress.phone);
                formData.append("invoiceid", self.state.tickInfo.id ? self.state.tickInfo.id : "");
                formData.append("billingtype", 0);//发票类型0=纸质1=电子
                formData.append("deliverybill", self.state.deliverybill);//发货单0=不需要1=需要
                formData.append("isbilling", self.state.tickInfo.length > 0 ? 1 : 0);//是否开票0=不开票1=开票
                formData.append("ismailornot", self.state.transport[0]);//是否自提0=快递1=自提
                fetch(getHost() + "/rest/buyer/orders/submitProductToOrder", {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                }).then(response => response.json()).then(json => {
                    if (json.result === 1) {
                        console.log(json);
                        // self.showSuccess();
                        stop = false;
                        localStorage.setItem('payMoney', self.state.totalPrice);
                        localStorage.setItem('orderId', json.data.ordersList[0].id);
                        localStorage.setItem("orderNo", json.data.ordersList[0].orderno);
                        self.setState({
                            orderNo: json.data.ordersList[0].orderno,
                            payOrderId: json.data.ordersList[0].id,
                            isLoading: false,
                        })
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
        } else {
            this.showWarn("收货地址不能为空！");
        }
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

    PayClick() {
        if (this.state.payPassword.length > 0) {
            let self = this;
            let formData = new FormData();
            formData.append("type", 0);//type传0用余额支付，传1用授信支付
            formData.append("payMoney", localStorage.getItem('payMoney'));// {1,2}
            formData.append("paySecret", Base64.encode(self.state.payPassword));
            formData.append("orders", self.state.payOrderId);
            formData.append("webToken", localStorage.getItem('webToken'));
            fetch(getHost() + "/rest/buyer/orders/payByBanlance", {
                method: 'POST',
                credentials: 'include',
                body: formData
            }).then(response => response.json()).then(json => {
                if (json.result === 1) {
                    console.log(json);
                    // self.showSuccess();
                    let url = pathHeader + '/PaySuccess?orderNo=' + localStorage.getItem('orderNo');
                    // HistoryManager.register(url);
                    location.href = url;
                    self.setState({
                        payPassword: "",
                        pay_show: false,
                        bottom_show: false,
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
        } else {
            this.showWarn("请输入支付密码")
        }
    }

    PayShow() {
        this.setState({pay_show: true, bottom_show: false});
    }
    //取消输入框
    PayHide() {
        this.setState({pay_show: false});
        HistoryManager.pageBack();
    }

    CancelPay() {
        this.setState({bottom_show: false});
        HistoryManager.pageBack();
    }

    InputChange(e) {
        let val = e.target.value;
        this.setState({payPassword: val})
    }

    CheckTransport(index, transType) {//回调：商品p配送方式
        let trans = this.state.transport;
        trans[index] = transType;
        this.setState({transport: trans});
    }

    ChoosePayment(typeId) {//选择付款方式：银行卡／微信
        if(typeId===1){
                let url="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx6eb2a1213254a1df&redirect_uri=http%3a%2f%2fwww.jinshang9.com%2fweixin%2fCreateOrder&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect";
                window.open(url);
        }else if (typeId === 3) {//card
            let self = this;
            let formData = new FormData();
            formData.append("orders", self.state.payOrderId);
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

    render() {
        return (
			<div style={{fontSize: "1.2rem"}}>
				<NavigationBar Title="确认订单" LeftBar="true" LeftTitle="返回"
							   LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
				<div style={contentStyle}>
					<div className="detail_logistics">
						<Cell access style={{padding: "0rem"}} onClick={this.AddressClick}>
							<CellBody>
								<div>
                                    {
                                        this.state.defaultAddress ?
											<div><img style={iconStyle}
													  src="/assets/images/order/order_icon_address.png"/>{this.state.defaultAddress ? this.state.defaultAddress.shipto : ""}
												<span style={rightStyle}>{this.state.defaultAddress.phone}</span>
												<div>地址:{this.state.defaultAddress.province}{this.state.defaultAddress.city}{this.state.defaultAddress.citysmall}{this.state.defaultAddress.address}</div>
											</div>
                                            :
											<div style={{textAlign: "center", fontSize: "1.4rem"}}>
												<img style={iconStyle}
													 src="/assets/images/order/order_icon_address.png"/>
												请添加收货地址
											</div>
                                    }
								</div>

							</CellBody>
							<CellFooter/>
						</Cell>
					</div>
					<div style={{borderTop: "1rem solid #f2f2f2"}}>
                        {
                            (this.state.goodsList).map((item, i) =>
								<GoodsListItem key={i} index={i} data={item} withAddress={true}
											   transport={this.state.transport} transCallback={this.CheckTransport}/>
                            )
                        }
					</div>
					<div className="detail_logistics"
						 style={{borderBottom: "1rem solid #f2f2f2", borderTop: "0.5rem solid #f2f2f2"}}>
						<Cell access style={{padding: "0rem"}} onClick={this.ReceiptClick}>
							<CellHeader>发票</CellHeader>
							<CellBody>
                                {
                                    this.state.tickInfo.id ?
										<div style={{textAlign: "right"}}>抬头:{this.state.tickInfo.invoiceheadup}</div> :
										<div style={{textAlign: "right"}}>暂无发票信息</div>
                                }

							</CellBody>
							<CellFooter/>
						</Cell>
					</div>
					<div className="detail_logistics"
						 style={{borderBottom: "1rem solid #f2f2f2", borderTop: "0.5rem solid #f2f2f2"}}>
						<Cell access style={{padding: "0rem"}}>
							<CellHeader>发货单</CellHeader>
							<CellBody onClick={this.deliverybill_Menu}>
								<div
									style={{textAlign: "right"}}>{this.Checkdeliverybill(this.state.deliverybill)}</div>
							</CellBody>
							<CellFooter/>
						</Cell>
					</div>
				</div>
				<div style={bottomStyle}>
					<div style={countStyle}>
						合计金额：<span
						style={redText}>¥{this.state.totalPrice}</span>
					</div>
					<div style={buyBtn} onClick={this.OrderClick}>提交订单
					</div>
				</div>
				<Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
				<Popup
					show={this.state.bottom_show}
					onRequestClose={e => this.setState({bottom_show: false})}
				>
                    {!this.state.payOrderId ?
						<Loading show={this.state.isLoading} length={1}
								 text=""/> :
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
                    }
                    {/*<div style={dialogBtn} onClick={this.PayShow}>立即付款</div>*/}
				</Popup>
				<Dialog type="ios" title="请输入支付密码" buttons={this.state.buttons}
						show={this.state.pay_show}>
					<Input style={inputStyle} type="password" value={this.state.payPassword}
						   onChange={this.InputChange}/>
				</Dialog>
				<ActionSheet
					menus={this.state.deliverybill_menus}
					actions={this.state.deliverybill_actions}
					show={this.state.deliverybill_show}
					type="android"
					onRequestClose={e => this.setState({deliverybill_show: false})}
				/>
			</div>
        )
    }


}