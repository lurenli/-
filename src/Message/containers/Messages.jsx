import React, {Component} from 'react';
import WeUI from 'react-weui';


//import styles
import 'weui';
import {CSS} from '../../../assets/common.css';
import Loading from '../../Common/Loading/Loading.jsx';

const {
    Tab, NavBarItem,
    Cells,
    Cell,
    CellHeader,
    CellBody,
    Toptips
} = WeUI;
let itemImg = {
    display: `block`,
    width: `10rem`,
    height: '10rem',
    marginRight: `5px`,
    border: "1px solid #eee"
};
let tillLoad = true;
let docid = 112;
let pathHeader='/weixin';
export default class Messages extends Component {
    constructor(props) {
        super(props);
        // this.DetailClick = this.DetailClick.bind(this);
        this.state = {
            fastDataList: [],
            dataList: [],
            fastPageNo: 1,
            pageNo: 1,
            pageSize: 10,
            isLoading: true,
            noneText: "暂无信息",
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

    FormatTime(dateStr) {
        let date = new Date(dateStr);//如果date为13位不需要乘1000
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
        let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return Y + M + D + h + m + s;
    }

    loadData() {//
        if (docid === 112) {
            let self = this;
            self.setState({isLoading: true});
            let fromData = new FormData();
            fromData.append("docName", "快讯");
            fromData.append("pageNo", self.state.fastPageNo);
            fromData.append("pageSize", self.state.pageSize);
            fetch(getHost() + "/rest/front/ArticeFront/app/list", {
                method: 'POST',
                credentials: 'include',
                body: fromData
            }).then(response => response.json()).then(json => {
                if (json.result === 1) {
                    console.log(json);
                    // self.showSuccess();
                    tillLoad = true;
                    self.setState({
                        fastPageNo: self.state.pageNo++,
                        isLoading: false,
                        fastDataList: json.data.list ? self.state.fastDataList.concat(json.data.list) : self.state.fastDataList
                    });
                } else {
                    self.showWarn("信息获取失败");
                    console.log(json.message)
                }
            }).catch(e => {
                console.log("网络出现了点问题：" + e);
                self.showWarn("网络出现了点问题");
            });
        } else {
            let self = this;
            self.setState({isLoading: true});
            let fromData = new FormData();
            fromData.append("docName", "行业资讯");
            fromData.append("pageNo", self.state.pageNo);
            fromData.append("pageSize", self.state.pageSize);
            fetch(getHost() + "/rest/front/ArticeFront/app/list", {
                method: 'POST',
                credentials: 'include',
                body: fromData
            }).then(response => response.json()).then(json => {
                if (json.result === 1) {
                    console.log(json);
                    // self.showSuccess();
                    tillLoad = true;
                    self.setState({
                        pageNo: self.state.pageNo++,
                        isLoading: false,
                        dataList: json.data.list ? self.state.dataList.concat(json.data.list) : self.state.dataList
                    });

                } else {
                    self.showWarn("信息获取失败");
                    console.log(json.message)
                }
            }).catch(e => {
                console.log("网络出现了点问题：" + e);
                self.showWarn("网络出现了点问题");
            });
        }
    }

    ChooseChange(index) {
        console.log(index);
        if (index === 0) {
            let self = this;
            let fromData = new FormData();
            fromData.append("docName", "快讯");
            fromData.append("pageNo", 1);
            fromData.append("pageSize", self.state.pageSize);
            fetch(getHost() + "/rest/front/ArticeFront/app/list", {
                method: 'POST',
                credentials: 'include',
                body: fromData
            }).then(response => response.json()).then(json => {
                if (json.result === 1) {
                    console.log(json);
                    // self.showSuccess();
                    tillLoad = true;
                    self.setState({
                        fastPageNo: 2,
                        isLoading: false,
                        fastDataList: json.data.list
                    });
                } else {
                    self.showWarn("信息获取失败");
                    console.log(json.message)
                }
            }).catch(e => {
                console.log("网络出现了点问题：" + e);
                self.showWarn("网络出现了点问题");
            });
        } else {
            let self = this;
            let fromData = new FormData();
            fromData.append("docName", "行业资讯");
            fromData.append("pageNo", 1);
            fromData.append("pageSize", self.state.pageSize);
            fetch(getHost() + "/rest/front/ArticeFront/app/list", {
                method: 'POST',
                credentials: 'include',
                body: fromData
            }).then(response => response.json()).then(json => {
                if (json.result === 1) {
                    console.log(json);
                    // self.showSuccess();
                    tillLoad = true;
                    self.setState({
                        pageNo: 2,
                        isLoading: false,
                        dataList: json.data.list
                    });

                } else {
                    self.showWarn("信息获取失败");
                    console.log(json.message)
                }
            }).catch(e => {
                console.log("网络出现了点问题：" + e);
                self.showWarn("网络出现了点问题");
            });
        }
    }

    DetailClick(id) {
        let url = pathHeader+"/MessageDetail?id=" + id;
        HistoryManager.register(url);
        location.href = url;
    }

    OnScroll() {
        let screenHeight = window.screen.height;
        let self = this;
        if (document.getElementById("scrollDiv").scrollTop + screenHeight + 200 >= document.getElementById("scrollDiv").scrollHeight && tillLoad) {
            tillLoad = false;
            setTimeout(function () {
                self.loadData();
            }, 1000)
        }
    }

    render() {
        let show = {display: "block"};
        if (!this.props.show) {
            show = {display: "none"}
        }
        return (
            <div style={show} id="scrollDiv" onScroll={this.OnScroll}>
                <Tab type="navbar" onChange={this.ChooseChange.bind(this)}>
                    <NavBarItem label="快讯">
                        <Cells>
                            {
                                this.state.fastDataList.map((item, i) =>
                                    <Cell onClick={this.DetailClick.bind(this, item.id)} key={i}>
                                        <CellHeader>
                                            <img src={process.env.IMAGE_PRIFIX + item.pic} alt=""
                                                 style={itemImg}/>
                                        </CellHeader>
                                        <CellBody>
                                            <div>{item.doctitle}</div>
                                            {/*<div>{item.sketch.substring(0,16)+"..."}</div>*/}
                                            <div
                                                style={{float: "right"}}>{item.creattime ? this.FormatTime(item.creattime) : ""}</div>
                                        </CellBody>
                                    </Cell>
                                )
                            }
                        </Cells>
                        <Loading show={this.state.isLoading} length={this.state.fastDataList.length}
                                 text={this.state.noneText}/>
                    </NavBarItem>
                    <NavBarItem label="行业资讯">
                        <Cells>
                            {
                                this.state.dataList.map((item, i) =>
                                    <Cell onClick={this.DetailClick.bind(this, item.id)} key={i}>
                                        <CellHeader>
                                            <img src={process.env.IMAGE_PRIFIX + item.pic} alt=""
                                                 style={itemImg}/>
                                        </CellHeader>
                                        <CellBody>
                                            <div>{item.doctitle}</div>
                                            {/*<div>{item.sketch.substring(0,16)+"..."}</div>*/}
                                            <div
                                                style={{float: "right"}}>{item.creattime ? this.FormatTime(item.creattime) : ""}</div>
                                        </CellBody>
                                    </Cell>
                                )
                            }
                        </Cells>
                        <Loading show={this.state.isLoading} length={this.state.dataList.length}
                                 text={this.state.noneText}/>
                    </NavBarItem>
                </Tab>
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
            </div>
        )
    }


}
Messages.defaultProps = {
    show: true

};