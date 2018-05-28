import React, {Component} from 'react';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import WeUI from 'react-weui';
//import styles
import 'weui';

const {Cells, Toptips} = WeUI;

let itemStyle = {
    background: "white",
    borderRadius: "1rem",
    padding: "1rem",
    fontSize: "1.2rem",
    marginBottom: "1rem"
};
let pathHeader='/weixin';
export default class ChooseReceipt extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        // this.ChooseClick=this.ChooseClick.bind(this);
        this.state = {
            dataList: [],
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
        let fromData = new FormData();
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

    LeftClick() {
        location.href = pathHeader+'/CreateOrder';
    }

    ChooseClick(id) {
        location.href = pathHeader+'/CreateOrder?invoiceId=' + id;
    }

    render() {
        let navHeight = 4.4;
        let height = document.body.clientHeight * 37.5 / document.body.clientWidth - (navHeight);
        let heightValue = height + "rem";

        return (
            <div>
                <NavigationBar Title="选择发票" LeftBar="true" LeftTitle="返回"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>

                <div style={{background: "#f2f2f2", height: heightValue, padding: "1rem", overflow: "scroll"}}>
                    {
                        this.state.dataList.map((item, i) =>
                            <div style={itemStyle} key={i} onClick={this.ChooseClick.bind(this, item.id)}>
                                <div>发票抬头:{item.invoiceheadup}</div>
                                <div>开户行:{item.bankofaccounts}</div>
                                <div>电话:{item.phone}</div>
                                <div>账号:{item.account}</div>
                                <div>税号:{item.texno}</div>
                                <div>地址:{item.address}</div>
                            </div>
                        )}
                </div>
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
            </div>
        )
    }


}