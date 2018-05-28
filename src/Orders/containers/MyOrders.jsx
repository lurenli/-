import React, {Component} from 'react';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import TopBar from '../components/TopBar.jsx';
import Loading from '../../Common/Loading/Loading.jsx';
import WeUI from 'react-weui';

//import styles
import 'weui';
import {CSS} from '../style/order.css';
import OrderListItem from "../components/OrderListItem";

const {Form, Cells, Cell, CellHeader, CellBody, CellFooter, Toptips} = WeUI;
let tillLoad = true;
let orderState = "", evaState = "";
let pathHeader = '/weixin';
let stop = false;//防止重复提交
export default class MyOrders extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.RightClick = this.RightClick.bind(this);
        this.ChooseClick = this.ChooseClick.bind(this);
        this.OnScroll = this.OnScroll.bind(this);
        this.CancelOrder = this.CancelOrder.bind(this);
        this.Reload = this.Reload.bind(this);
        this.state = {
            arr: ["全部", "待付款", "待发货", "待收货", "待验货", "待评价"],
            stateIndex: this.props.location.query.index,
            pageNo: 1,
            pageSize: 10,
            orderState: '',
            evaState: '',
            backstate: '',
            dataList: [],
            balance: "",
            isLoading: true,
            noneText: "暂无订单",
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


    componentWillMount() {
        this.getwy();
        this.getBalance();
        this.ChooseClick(this.state.stateIndex);
    }

    componentDidMount() {
    }

    OnScroll() {
        let screenHeight = window.screen.height;
        let self = this;
        console.log(document.getElementById("scrollDiv").scrollTop, screenHeight, document.getElementById("scrollDiv").scrollHeight);
        if (document.getElementById("scrollDiv").scrollTop + screenHeight + 200 >= document.getElementById("scrollDiv").scrollHeight && tillLoad) {
            tillLoad = false;
            let pageNo = self.state.pageNo + 1;
            setTimeout(function () {
                self.loadData(pageNo);
            }, 1000)
        }
    }

    LeftClick() {
        HistoryManager.pageBack();
    }

    RightClick() {

    }

    loadData(pageNo) {
        let self = this;
        self.setState({
            isLoading: true
        });
        let fromData = new FormData();
        fromData.append("pageNo", pageNo);
        fromData.append("pageSize", self.state.pageSize);
        fromData.append("orderState", orderState);
        fromData.append("evastate", evaState);
        fromData.append("backstate", 0);//退货状态0=正常
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/orders/getMemberOrderList", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                tillLoad = true;
                self.setState({
                    dataList: json.data.pageInfo.list ? self.state.dataList.concat(json.data.pageInfo.list) : self.state.dataList,
                    pageNo: pageNo,
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

    ChooseClick(index) {
        this.setState({stateIndex: index, dataList: []});
        let newEvaState = "";
        let newStatus = "";
        switch (parseInt(index)) {
            case 0:
                newStatus = "";
                break;
            case 1:
                newStatus = 0;
                break;
            case 2:
                newStatus = 1;
                break;
            case 3:
                newStatus = 3;
                break;
            case 4:
                newStatus = 4;
                break;
            case 5:
                newStatus = 5;
                newEvaState = 0;
                break;
            default:
                break;
        }
        orderState = newStatus;
        evaState = newEvaState;
        this.loadData(1)
    }

    CancelOrder(id) {
        if (!stop) {
            stop = true;
            let self = this;
            let formData = new FormData();
            formData.append("type", 0);//
            formData.append("id", id);// orderid
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
                    self.setState({dataList: []});
                    self.loadData(1)
                } else if (json.result === 2) {//登录失效
                    HistoryManager.register(pathHeader + '/Login');
                    location.href = pathHeader + '/Login';
                } else {
                    self.showWarn("取消订单失败");
                    console.log(json.message)
                }
            }).catch(e => {
                console.log("网络出现了点问题：" + e);
                self.showWarn("网络出现了点问题");
            });
        }
    }

    Reload() {
        this.setState({dataList: []});
        this.loadData(1)
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

    render() {
        let navHeight = 4.4, topHeight = 4;
        let height = document.body.clientHeight * 37.5 / document.body.clientWidth - (topHeight + navHeight);
        let heightValue = height + "rem";
        return (
            <div>
                <NavigationBar Title="我的订单" LeftBar="true" LeftTitle="返回"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}
                               RightBar="true" RightTitle="" RightClick={this.RightClick}/>
                <TopBar Arr={this.state.arr} Index={this.state.stateIndex} callback={this.ChooseClick}/>
                <div id="scrollDiv"
                     style={{height: heightValue, paddingBottom: "0", overflowY: "scroll", background: "white"}}
                     onScroll={this.OnScroll}>
                    {
                        this.state.dataList.map((item, i) =>
                            <OrderListItem key={i} id={item.orderid} orderno={item.orderno} orderState={item.orderstate}
                                           backState={item.backstate} goodsList={item.orderProducts}
                                           orderType={item.ordertype} balance={this.state.balance}
                                           totalPrice={item.actualpayment} actualpayment={item.actualpayment}
                                           getliquidated={this.state.getliquidated}
                                           yunfei={item.freight} cancelCallback={this.CancelOrder}
                                           reload={this.Reload}/>
                        )
                    }
                    <Loading show={this.state.isLoading} length={this.state.dataList.length}
                             text={this.state.noneText}/>
                </div>
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
                <Toptips type="primary" show={this.state.showSuccess}>{this.state.successText}</Toptips>
            </div>
        )
    }


}