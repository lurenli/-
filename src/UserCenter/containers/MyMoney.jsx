import React, {Component} from 'react';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import WeUI from 'react-weui';

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
    Toptips
} = WeUI;
let bgStyle={
    width: "100%",
    minHeight: "100%",
    background: "#F5F5F5",
    fontSize: "1.4rem"
};
let normal = {
    fontSize: "1.4rem"
};

let imgStyle = {
    display: `block`, width: `20px`, marginRight: `5px`
};let pathHeader='/weixin';
export default class MyMoney extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.RightClick = this.RightClick.bind(this);
        this.RightClick = this.RightClick.bind(this);
        this.RechargeClick = this.RechargeClick.bind(this);
        this.CashClick = this.CashClick.bind(this);
        this.state={
            balance:0.00,
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
        let self = this;
        // self.setState({isLoading: true});
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
                self.setState({
                    // isLoading: false,
                    balance: json.data.balance
                });
            } else if (json.result === 2) {//登录失效
                HistoryManager.register(pathHeader+'/Login');
                location.href = pathHeader+'/Login';
            }else {
                self.showWarn("获取失败");
                console.log(json.message)
            }
        }).catch(e => {
            console.log("网络出现了点问题：" + e);
            self.showWarn("网络出现了点问题");
        });
    }

    componentDidMount() {
    }

    LeftClick(){
        HistoryManager.pageBack();
    }

    RightClick(){
        let url = pathHeader+"/BillDetailMoney";
        HistoryManager.register(url);
        location.href = url;
    }

    RechargeClick() {
        let url = pathHeader+"/MyMoneyRecharge";
        HistoryManager.register(url);
        location.href = url;
    }

    CashClick() {
        let url = pathHeader+"/MyMoneyCash";
        HistoryManager.register(url);
        location.href = url;
    }

    render() {
        return (
            <div style={bgStyle}>
                <NavigationBar Title="我的余额" LeftBar="true" LeftTitle="返回" RightBar="true" RightTitle="账单明细" RightClick={this.RightClick}
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                <div className="moneyStyle">
                    <span style={{fontSize: "1.8rem"}}>{this.state.balance}</span>
                    <div style={normal}>可用余额</div>
                </div>
                <Cells>
                    <Cell onClick={this.RechargeClick} access>
                        <CellHeader>
                            <img src="/assets/images/userCenter/user_money_recharge.png" alt=""
                                 style={imgStyle}/>
                        </CellHeader>
                        <CellBody>
                            <span style={normal}>充值</span>
                        </CellBody>
                        <CellFooter>
                        </CellFooter>
                    </Cell>
                    <Cell onClick={this.CashClick} access>
                        <CellHeader>
                            <img src="/assets/images/userCenter/user_money_cash.png" alt=""
                                 style={imgStyle}/>
                        </CellHeader>
                        <CellBody>
                            <span style={normal}>提现</span>
                        </CellBody>
                        <CellFooter>
                        </CellFooter>
                    </Cell>
                </Cells>
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
            </div>
        )
    }


}