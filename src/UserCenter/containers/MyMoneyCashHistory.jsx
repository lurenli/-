import React, {Component} from 'react';
import WeUI from 'react-weui';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import Loading from '../../Common/Loading/Loading.jsx';
//import styles
import 'weui';
import {CSS} from '../styles/Register.css';
import {formatDate} from '../../../assets/js/common.js'

const {
    ButtonArea,
    Button,
    CellsTitle,
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
let tillLoad = true;
export default class MyMoneyCashHistory extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.OnScroll = this.OnScroll.bind(this);
        this.state = {
            dataList: [],
            pageNo: 1,
            pageSize: 20,
            isLoading: true,
            noneText: "暂无记录",
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
        this.loadData();
    }

    componentDidMount() {
    }

    loadData() {
        let self = this;
        self.setState({isLoading: true});
        let fromData = new FormData();
        fromData.append("pageNo", self.state.pageNo);
        fromData.append("pageSize", self.state.pageSize);
        fromData.append("capitaltype", 3);
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/cash/list", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                // self.showSuccess();
                let val = json.data.province + " " + json.data.city + " " + json.data.citysmall;
                self.setState({
                    isLoading: false,
                    dataList: json.data.pageInfo.list ? self.state.dataList.concat(json.data.pageInfo.list) : self.state.dataList,
                    pageNo: self.state.pageNo++,
                    city_value: val
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

    //时间转换
    upTime(value) {
        if (!value) {
            return ''
        } else {
            let date = new Date(value);
            return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
        }
    }

    formatMoney(value) {
        return "￥" + parseFloat(value).toFixed(2);
    }

    forUsing(capitaltype) {
        return capitaltype == 0 ? '消费' : capitaltype == 1 ? '充值' : capitaltype == 2 ? '退款' : capitaltype == 3 ? '提现' : capitaltype == 4 ? '授信'
            : capitaltype == 5 ? '授信还款' : capitaltype == 6 ? '违约金' : capitaltype == 7 ? '远期定金' : capitaltype == 8 ? '远期余款' : capitaltype == 9 ? '远期全款' : capitaltype == 10 ? '卖家违约金' : ''
    }

    getState(rechargestate) {
        let stateDiv=null;
        switch (rechargestate){
            case 0:
                stateDiv=<span style={{float: "right",color:"orange"}}>提现中</span>;
                break;
            case 1:
                stateDiv=<span style={{float: "right",color:"#359a2b"}}>已到账</span>;
                break;
            case 2:
                stateDiv=<span style={{float: "right",color:"#e8000e"}}>提现失败</span>;
                break;
            case 3:
                stateDiv=<span style={{float: "right",color:"orange"}}>提现中</span>;
                break;
            case 4:
                stateDiv=<span style={{float: "right",color:"orange"}}>提现中</span>;
                break;
            case 5:
                stateDiv=<span style={{float: "right",color:"#e8000e"}}>提现失败</span>;
                break;
        }
        return stateDiv;
    }
    getPayWay(withdrawtype){
        return withdrawtype == 1 ? '微信账号:' : withdrawtype == 2 ? '支付宝账号:' :withdrawtype == 3 ? '银行卡号:' :''
    }

    LeftClick() {
        HistoryManager.pageBack();
    }

    OnScroll() {
        let screenHeight = window.screen.height;
        let self = this;
        console.log(document.getElementById("scrollDiv").scrollTop, screenHeight, document.getElementById("scrollDiv").scrollHeight);
        if (document.getElementById("scrollDiv").scrollTop + screenHeight + 200 >= document.getElementById("scrollDiv").scrollHeight && tillLoad) {
            tillLoad = false;
            setTimeout(function () {
                self.loadData();
            }, 1000)
        }
    }


    render() {
        let navHeight = 4.4;
        let height = document.body.clientHeight * 37.5 / document.body.clientWidth - navHeight;
        let heightValue = height + "rem";
        return (
            <div style={bgStyle}>
                <NavigationBar Title="提现记录" LeftBar="true" LeftTitle="返回"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                <div id="scrollDiv"
                     style={{height: heightValue, padding: "0", overflowY: "scroll", background: "white"}}
                     onScroll={this.OnScroll}>
                    <Cells>
                        {this.state.dataList.map((item, i) =>
                            <Cell key={i} style={{fontSize:"1.4rem"}}>
                                <CellBody>
                                    <div><span>提现金额:{this.formatMoney(item.capital)}</span>{this.getState(item.rechargestate)}</div>
                                    <div>{this.getPayWay(item.withdrawtype)}{item.account}</div>
                                    <div><span>订单号:{item.presentationnumber}</span><span style={{float: "right",color:"#454545",fontSize:"1.2rem",marginTop:"0.2rem"}}>{this.upTime(item.tradetime)}</span></div>
                                </CellBody>
                            </Cell>
                        )}
                    </Cells>
                    <Loading show={this.state.isLoading} length={this.state.dataList.length}
                             text={this.state.noneText}/>
                    <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
                </div>
            </div>
        )
    }


}