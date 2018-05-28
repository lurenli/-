import React, {Component} from 'react';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import Loading from '../../Common/Loading/Loading.jsx';
import ShopCartListItem from '../components/ShopCartListItem.jsx';
import WeUI from 'react-weui';

//import styles
import 'weui';

const {Form, Cells, Cell, CellHeader, CellBody, CellFooter, Toptips,} = WeUI;
let bottomStyle = {
    width: "100%",
    position: "absolute",
    bottom: "0",
    background: "#fff"
};
let discountStyle = {
    background: "red",
    height: "7rem",
    lineHeight: "3rem",
    padding: "2rem",
    color: "white"
};
let redText = {
    color: "red",
    margin: "0 1rem"
};

let tillLoad = true;
let pathHeader='/weixin';
export default class ShoppingCart extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.RightClick = this.RightClick.bind(this);
        this.checkClick = this.checkClick.bind(this);
        this.ChooseAll = this.ChooseAll.bind(this);
        this.DeleteClick = this.DeleteClick.bind(this);
        this.DiscountClick = this.DiscountClick.bind(this);
        this.OnScroll = this.OnScroll.bind(this);
        this.state = {
            goodsList: [],
            selectArr: [],
            totalPrice: 0.00,
            isAll: false,
            delete: false,
            rate: 1,
            pageNo: 1,
            pageSize: 10,
            isLoading: true,
            noneText: "购物车暂无任何商品",
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
        this.loadAll();
        this.loadRate();//获取定金比率
    }

    componentDidMount() {
    }

    checkClick(id, check) {
        let list = this.state.goodsList;
        let selects = this.state.selectArr;
        let totalPrice = this.state.totalPrice;
        for (let a = 0; a < list.length; a++) {
            if (list[a].id === id) {
                list[a].check = !check;
                if (check) {
                    totalPrice -= ((list[a].pdnumber * list[a].price)+0.0001);
                } else {
                    totalPrice += ((list[a].pdnumber * list[a].price)+0.0001);
                }
                break;
            }
        }
        if (check) {
            for (let i = 0; i < selects.length; i++) {
                if (selects[i] === id) {
                    selects.splice(i, 1);
                    break;
                }

            }
        } else {
            selects.push(id);
        }
        let isAll = false;
        if (selects.length === list.length) {//全选了
            isAll = true;
        }
        this.setState({
            goodsList: list,
            selectArr: selects,
            totalPrice: totalPrice,
            isAll: isAll
        });
    }

    LeftClick() {

    }

    RightClick() {
        let deleteState = this.state.delete;
        deleteState = !deleteState;
        this.setState({delete: deleteState});
    }

    DeleteClick() {
        let self = this;
        let fromData = new FormData();
        fromData.append("ids", self.state.selectArr);
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/shopcar/deleteAllShopCar", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                // self.showSuccess();
                self.setState({delete: false, goodsList: [], selectArr: [], totalPrice: 0, isAll: false});
                self.loadAll();
            } else {
                // self.showWarn("信息获取失败");
                console.log(json.message)
            }
        }).catch(e => {
            console.log("网络出现了点问题：" + e);
            // self.showWarn("网络出现了点问题");
        });
    }

    ChooseAll() {
        let isAll = this.state.isAll;
        isAll = !isAll;
        let list = this.state.goodsList;
        let selects = [];
        let totalPrice = 0;
        if (isAll) {//全选了
            for (let a = 0; a < list.length; a++) {
                list[a].check = true;
                totalPrice += parseFloat(((list[a].pdnumber * list[a].price)+0.0001).toFixed(2));
                selects.push(list[a].id);
            }
        } else {
            for (let a = 0; a < list.length; a++) {
                list[a].check = false;
            }
        }
        this.setState({
            goodsList: list,
            selectArr: selects,
            totalPrice: totalPrice,
            isAll: isAll
        });
    }

    DiscountClick() {//结算
        let type = 1;
        let cartIds = this.state.selectArr;//shopcartIds
        if (cartIds.length > 0) {
            localStorage.setItem("type", type);
            localStorage.setItem("cartIds", JSON.stringify(cartIds));
            let url = pathHeader+"/CreateOrder";
            HistoryManager.register(url);
            location.href = url;
        } else {
            this.showWarn("请先勾选您要结算的商品");
        }

    }

    loadAll() {
        this.setState({isLoading:true});
        let self = this;
        let fromData = new FormData();
        fromData.append("pageNo", self.state.pageNo);
        fromData.append("pageSize", self.state.pageSize);
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/shopcar/loadAllShopCar", {
            method: 'POST',
            // mode:'no-cors',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                // self.showSuccess();
                tillLoad = true;
                let list = json.data.pageInfo.list;
                for (let i = 0; i < list.length; i++) {
                    list[i].check = false;
                }
                let num = json.data.pageInfo.total;
                localStorage.setItem("shopCart", num);
                self.setState({
                    goodsList: list.length>0?self.state.goodsList.concat(list):self.state.goodsList,
                    pageNo: self.state.pageNo++,
                    isLoading: false
                });

            } else if (json.result === 2) {//登录失效
                HistoryManager.register(pathHeader+'/Login');
                location.href = pathHeader+'/Login';
            } else {
                this.setState({isLoading:false});
                self.showWarn(json.message);
            }
        }).catch(e => {
            console.log("网络出现了点问题：" + e);
            // self.showWarn("网络出现了点问题");
        });
    }

    loadRate() {//获取定金比率
        let self = this;
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
                    rate: json.data.transactionSettings.remotepurchasingmargin
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

    OnScroll() {
        let screenHeight = window.screen.height;
        let self = this;
        if (document.getElementById("scrollDiv").scrollTop + screenHeight + 200 >= document.getElementById("scrollDiv").scrollHeight && tillLoad) {
            tillLoad = false;
            setTimeout(function () {
                self.loadAll();
            }, 1000)
        }
    }

    render() {
        let show = this.state.goodsList.length > 0 ? {
            display: "block",
            width: "100%",
            height: "100%",
            background: "#f2f2f2"
        } : {display: "block", width: "100%", height: "100%", background: "#ffffff"};
        if (!this.props.show) {
            show = {display: "none"}
        }
        let allChecked = "/assets/images/shopCart/shopcart_unchoose.png";
        let allText = "全选";
        if (this.state.isAll) {
            allChecked = "/assets/images/shopCart/shopcart_choosed.png";
            allText = "全不选";
        }
        let deleteText = "管理";
        let bodyDiv = <div>
            合计<span style={redText}>¥ {this.state.totalPrice.toFixed(2)}</span>
        </div>;
        let changeDiv = <div style={discountStyle} onClick={this.DiscountClick}>结算（{this.state.selectArr.length}）</div>;
        if (this.state.delete) {
            deleteText = "完成";
            bodyDiv = null;
            changeDiv = <div style={discountStyle} onClick={this.DeleteClick}>删除</div>;
        }
        let navHeight = 4.4, bottomHeight = 12;
        let height = document.body.clientHeight * 37.5 / document.body.clientWidth - (bottomHeight + navHeight);
        let heightValue = height + "rem";
        return (
            <div style={show}>
                <NavigationBar Title="购物车" LeftBar="false" LeftTitle="返回"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}
                               RightBar="true" RightTitle={deleteText} RightClick={this.RightClick}/>
                <div id="scrollDiv" style={{width: "100%", height: heightValue, overflow: "scroll"}}
                     onScroll={this.OnScroll}>
                    {
                        this.state.goodsList.map((item, i) =>
                            <ShopCartListItem key={i} id={item.id} data={item} check={item.check}
                                              rate={this.state.rate} callback={this.checkClick}/>
                        )
                    }
                    <Loading show={this.state.isLoading} length={this.state.goodsList.length}
                             text={this.state.noneText}/>
                </div>
                <div style={bottomStyle}>
                    <Cell style={{padding: "0rem", fontSize: "1.4rem"}}>
                        <CellHeader>
                            <div onClick={this.ChooseAll}>
                                <img style={{width: "2rem", height: "2rem", margin: "1.5rem", verticalAlign: "middle"}}
                                     src={allChecked}/>
                                <span>{allText}</span>
                            </div>
                        </CellHeader>
                        <CellBody style={{textAlign: "right"}}>
                            {bodyDiv}
                        </CellBody>
                        <CellFooter>
                            {changeDiv}
                        </CellFooter>
                    </Cell>
                </div>
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
            </div>
        )
    }


}
ShoppingCart.defaultProps = {
    show: true

};