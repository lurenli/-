import React, {Component} from 'react';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';

let centerStyle = {
    width: "100%",
    lineHeight: "8rem",
    fontSize: "1.8rem",
    color: "red",
    textAlign: "center",
};
let areaStyle = {
    margin: "1rem",
    borderBottom: "1px solid #e2e2e2",
    display: "flex",
    paddingBottom: "1rem"
};
let btnStyle = {flex: "1", textAlign: "center", fontSize: "1.4rem"};
let pathHeader='/weixin';
export default class PaySuccess extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.OrderClick = this.OrderClick.bind(this);
        this.HomeClick = this.HomeClick.bind(this);
        this.state = {
            orderNo:this.props.location.query.orderNo,
            pay: localStorage.getItem('payMoney'),
        }
    }


    componentWillMount() {

    }

    componentDidMount() {
    }

    LeftClick() {
        HistoryManager.pageBackTwice();
    }

    OrderClick() {
        let url = pathHeader+"/OrderDetails?orderNo=" + this.state.orderNo;
        // HistoryManager.register(url);
        location.href = url;
    }

    HomeClick() {
        let url = pathHeader+"/";
        HistoryManager.removeAll();
        location.href = url;
    }

    render() {
        return (
            <div>
                <NavigationBar Title="支付成功" LeftBar="true" LeftTitle="返回"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                <div style={centerStyle}>
                    ¥{this.state.pay}
                </div>
                <div style={areaStyle}>
                    <div style={btnStyle} onClick={this.OrderClick}>查看订单<span style={{float: "right"}}>|</span></div>
                    <div style={btnStyle} onClick={this.HomeClick}>返回首页</div>
                </div>

            </div>
        )
    }


}