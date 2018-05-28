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
let backStyle = {
    float: "left", width: "1.1rem", height: "1.8rem", marginTop: "1.3rem", paddingLeft: "1.8rem"
};
let navStyle = {
    textAlign: "center",
    width: "100%",
    height: "4.4rem",
    lineHeight: "4.4rem",
    background: "white",
    borderBottom: "1px solid #e2e2e2"
};
let tillLoad = true;
export default class BillDetailMoney extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.OnScroll = this.OnScroll.bind(this);
        this.state = {
            dataList: [],
            chooseShow: false,
            typeArr: [
                {name: "所有", type: -1},
                {name: "消费", type: 0},
                {name: "充值", type: 1},
                {name: "提现", type: 3},
                {name: "退款", type: 2},
            ],
            capitaltype: -1,
            pageNo: 1,
            pageSize: 20,
            isLoading: true,
            noneText: "暂无明细",
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
        fromData.append("webToken", localStorage.getItem('webToken'));
        fromData.append("pageNo", self.state.pageNo);
        fromData.append("pageSize", self.state.pageSize);
        fromData.append("capitaltype", self.state.capitaltype);
        fetch(getHost() + "/rest/buyer/cash/list", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                // self.showSuccess();
                self.setState({
                    isLoading: false,
                    dataList: json.data.pageInfo.list ? self.state.dataList.concat(json.data.pageInfo.list) : self.state.dataList,
                    pageNo: self.state.pageNo++,
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

    LeftClick() {
        HistoryManager.pageBack();
    }

    ChangeShow() {
        let show = !this.state.chooseShow;
        this.setState({chooseShow: show})
    }

    ChooseType(typeId) {
        this.setState({capitaltype: typeId, chooseShow: false, pageNo: 1, dataList: []});
        setTimeout(() => {
            this.loadData();
        }, 500);

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
                {/*<NavigationBar Title="账单明细" LeftBar="true" LeftTitle="返回"*/}
                {/*LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>*/}
                <div style={navStyle}>
                    <img style={backStyle} src="/assets/images/common/nav_back_icon.png"
                         onClick={this.LeftClick}/>
                    <span style={{marginLeft: "-1.8rem", fontSize: "1.6rem"}}
                          onClick={this.ChangeShow.bind(this)}>账单明细</span>
                    <img style={{width: "1.5rem", height: "1rem", marginLeft: "1rem"}}
                         src={this.state.chooseShow ? "/assets/images/userCenter/user_icon_close.png" : "/assets/images/userCenter/user_icon_open.png"}/>
                </div>
                <div style={this.state.chooseShow ? {
                    width: "100%",
                    height: heightValue,
                    position: "absolute",
                    top: "4.4rem",
                    bottom: "0",
                    zIndex: "3",
                    background: "#7a7a7a"
                } : {display: "none"}}>
                    <div style={{background: "white"}}>
                        {
                            this.state.typeArr.map((item, i) =>
                                <Cell onClick={this.ChooseType.bind(this, item.type)}>
                                    <CellHeader>{item.name}</CellHeader>
                                    <CellBody/>
                                    <CellFooter>
                                        {item.type === this.state.capitaltype ?
                                            <img style={{width: "2rem", height: "1.7rem"}}
                                                 src="/assets/images/userCenter/user_icon_check.png"/>
                                            : null}
                                    </CellFooter>
                                </Cell>
                            )
                        }
                    </div>
                </div>
                <div id="scrollDiv"
                     style={{height: heightValue, padding: "0", overflowY: "scroll", background: "white"}}
                     onScroll={this.OnScroll}>
                    <Cells>
                        {this.state.dataList.map((item, i) =>
                            <Cell key={i}>
                                <CellHeader>
                                <span style={{
                                    fontSize: "1.2rem",
                                    marginRight: "2rem"
                                }}>{this.upTime(item.tradetime)}</span>
                                </CellHeader>
                                <CellBody>
                                    <div style={{fontSize: "1.4rem"}}>{this.formatMoney(item.capital)}</div>
                                    <div style={{fontSize: "1.2rem"}}>{item.tradeno}</div>
                                </CellBody>
                                <CellFooter>
                                    <div style={{fontSize: "1.4rem"}}>{this.forUsing(item.capitaltype)}</div>
                                </CellFooter>
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