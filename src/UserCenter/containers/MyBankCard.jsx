import React, {Component} from 'react';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import MyBankCardsItem from '../components/MyBankCardsItem.jsx';
import WeUI from "react-weui";
import $ from 'jquery';
import {CSS} from '../styles/Register.css';
import Loading from '../../Common/Loading/Loading.jsx';

let bgStyle = {
    width: "100%",
    minHeight: "100%",
    background: "#F5F5F5",
    fontSize: "1.4rem"
};
const {
    ButtonArea,
    Button,
    Cells,
    Toptips
} = WeUI;
let bottomStyle = {
    position: "absolute",
    width: "100%",
    height: "7rem",
    bottom: "0",
};
let listStyle = {
    width: "100%",
    position: "absolute",
    top: "0",
    bottom: "7rem",
};let pathHeader='/weixin';
export default class MyBankCard extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.AddClick = this.AddClick.bind(this);
        this.DeleteClick = this.DeleteClick.bind(this);
        this.SetDefault = this.SetDefault.bind(this);
        this.state = {
            dataList: [],
            isLoading: true,
            noneText: "暂无银行卡",
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
        fromData.append("pageNo", 1);
        fromData.append("pageSize", 10);
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/BankAccount/listAllBankAccount", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                self.setState({
                    dataList: json.data.pageInfo.list,
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
        let url = pathHeader+"/MyBankCardAdd";
        HistoryManager.register(url);
        location.href = url;
    }

    SetDefault(id) {
        let self = this;
        let fromData = new FormData();
        fromData.append("id", id);
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/BankAccount/setDefault", {
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
        fromData.append("id", id);
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/BankAccount/deleteBankAccount", {
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
                <div style={listStyle}>
                    <NavigationBar Title="我的银行卡" LeftBar="true" LeftTitle="返回"
                                   LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                    <div>
                        {
                            this.state.dataList.map((item, i) =>
                                <MyBankCardsItem key={i} id={item.id} data={item} callback={this.DeleteClick}
                                                 setDefault={this.SetDefault}/>
                            )
                        }
                    </div>
                </div>
                <Loading show={this.state.isLoading} length={this.state.dataList.length}
                         text={this.state.noneText}/>
                <div style={bottomStyle}>
                    <ButtonArea>
                        <Button onClick={this.AddClick} type="warn">添加银行卡</Button>
                    </ButtonArea>
                </div>
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
            </div>
        )
    }


}