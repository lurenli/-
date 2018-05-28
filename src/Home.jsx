import React, {Component} from 'react';
// import WeUI from 'react-weui';

//import styles
import {CSS} from '../assets/common.css';
// import 'weui';
// import 'react-weui/build/packages/react-weui.css';

import TabBarItem from './Common/TabBar/TabBarItem.jsx';
import Shop from './Shop/containers/Shop.jsx';
import Messages from '../src/Message/containers/Messages.jsx';//消息首页
import ShoppingCart from '../src/ShoppingCart/containers/ShoppingCart.jsx';//购物车
import UserCenter from '../src/UserCenter/containers/UserCenter.jsx';//我的（用户中心）

let contentStyle = {
    position: "absolute", top: "0", width: "100%", bottom: "5rem", overflow: "scroll"
};
let tabBar = {
    display: "flex",
    position: "absolute",
    bottom: "0",
    width: "100%",
    height: "5rem",
    borderTop: "1px solid #eee"
};
export default class Home extends Component {
    constructor(props) {
        super(props);
        this.MenuClick = this.MenuClick.bind(this);
        this.state = {
            tab: localStorage.getItem('HomeIndex') ? parseInt(localStorage.getItem('HomeIndex')) : 0,
            list: [
                {name: "home"},
                {name: "msg"},
                {name: "shoppingcart"},
                {name: "user"}
            ]
        };
    }

    componentWillMount() {
        let fromData = new FormData();
        fromData.append("pageNo", 1);
        fromData.append("pageSize", 1);
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/shopcar/loadAllShopCar", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                let num = json.data.pageInfo.total;
                localStorage.setItem("shopCart", num);
            } else {
                console.log(json.message)
            }
        }).catch(e => {
            console.log("网络出现了点问题：" + e);
        });
    }

    componentDidMount() {

    }

    MenuClick(index) {
        localStorage.setItem("HomeIndex", index);
        this.setState({tab: index});
    }

    render() {
        let content = null;
        switch (this.state.tab) {
            case 0:
                content = <Shop/>;
                break;
            case 1:
                content = <Messages/>;
                break;
            case 2:
                content = <ShoppingCart/>;
                break;
            case 3:
                content = <UserCenter/>;
                break;
        }
        return (
            <div style={{width: "100%", height: "100%"}}>
                {/*<div style={contentStyle}>*/}
                {/*<Shop show={this.state.tab === 0}/>*/}
                {/*<Messages show={this.state.tab === 1}/>*/}
                {/*<ShoppingCart show={this.state.tab === 2}/>*/}
                {/*<UserCenter show={this.state.tab === 3}/>*/}
                {/*</div>*/}
                <div style={contentStyle}>
                    {content}
                </div>
                <div style={tabBar}>
                    {
                        this.state.list.map((item, i) =>
                            <TabBarItem key={i} index={i}
                                        checked={i === this.state.tab}
                                        name={item.name}
                                        tabClick={this.MenuClick}/>
                        )
                    }

                </div>
            </div>
        )
    }
}
