import React, {Component} from 'react';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import WeUI from 'react-weui';
import 'weui';
import MyReceiptItem from "../components/MyReceiptItem";
import Loading from '../../Common/Loading/Loading.jsx';
import {CSS} from '../styles/Register.css';

const {
    Cells,
    Cell,
    CellHeader,
    CellBody,
    CellFooter,
    ButtonArea,
    Button,
    Toptips
} = WeUI;

let bgStyle = {
    width: "100%",
    minHeight: "100%",
    background: "#F5F5F5",
    fontSize: "1.4rem"
};
let bottomStyle = {
    position: "absolute",
    width: "100%",
    height: "7rem",
    bottom: "0",
};let pathHeader='/weixin';
export default class MyReceipt extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.AddClick = this.AddClick.bind(this);
        this.SetDefault = this.SetDefault.bind(this);
        this.DeleteClick = this.DeleteClick.bind(this);
        this.state = {
            dataList: [],
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

    loadData() {
        let self = this;
        self.setState({
            isLoading: true
        });
        let fromData = new FormData();
        fromData.append("memberId", '14');
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/invoiceInfo/list", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                self.setState({
                    dataList: json.data,
                    isLoading: false
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

    LeftClick() {
        HistoryManager.pageBack();
    }

    AddClick() {
        let url = pathHeader+"/MyReceiptAdd";
        HistoryManager.register(url);
        location.href = url;
    }

    SetDefault(id) {
        let self = this;
        let fromData = new FormData();
        fromData.append("newInvoiceId", id);
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/invoiceInfo/change/default", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                self.setState({dataList: []});
                self.loadData();
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

    DeleteClick(id) {
        let self = this;
        let fromData = new FormData();
        fromData.append("invoiceId", id);
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/invoiceInfo/delete", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                self.setState({dataList: []});
                self.loadData();
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

    render() {
        return (
            <div style={bgStyle}>
                <NavigationBar Title="发票信息" LeftBar="true" LeftTitle="返回"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                <div id="list_receipt">
                    {
                        this.state.dataList.map((item, i) =>
                            <MyReceiptItem key={i} id={item.id} data={item} callback={this.DeleteClick}
                                           setDefault={this.SetDefault}/>
                        )
                    }
                    <Loading show={this.state.isLoading} length={this.state.dataList.length}
                             text={this.state.noneText}/>
                </div>
                <div style={bottomStyle}>
                    <ButtonArea>
                        <Button onClick={this.AddClick} type="warn">添加新发票</Button>
                    </ButtonArea>
                </div>
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
            </div>
        )
    }


}