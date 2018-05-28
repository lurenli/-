import React, {Component} from 'react';
import WeUI from 'react-weui';
//import styles
import 'weui';

const {Cell, CellHeader, CellBody, Popup, Select, Toptips} = WeUI;
let addBtn = {
    float: "right",
    background: "red",
    color: "white",
    padding: "0.2rem 0.8rem",
    borderRadius: "0.5rem"
};
let cancelBtn = {
    width: "2rem",
    height: "2rem"
};
let paddingStyle = {
    padding: "1rem"
};
let selfStyle = {
    width: "3.4rem",
    height: "1.6rem",
    verticalAlign: "middle",
    margin: "0rem 0.2rem"
};
let imgBtn = {
    width: "2rem",
    height: "1rem",
    padding: "1rem 0.5rem",
    verticalAlign: "middle",
    background: "#f2f2f2",
    marginRight: "0.5rem"
};
let imgBtn_add = {
    width: "2rem",
    height: "2rem",
    padding: "0.5rem 0.5rem",
    verticalAlign: "middle",
    background: "#f2f2f2",
    marginLeft: "0.5rem"
};
let inputStyle = {
    width: "10rem",
    height: "3rem",
    background: "#f2f2f2",
    border: "none",
    outline: "none",
    verticalAlign: "bottom"
};
let unitStyle = {
    height: "3rem",
    lineHeight: "3rem",
    fontSize: "1.2rem",
    padding: "0 1rem",
    borderRadius: "0",
    background: "#f2f2f2",
};
let popupAddBtn = {
    display: "inline-block",
    width: "50%",
    height: "6rem",
    lineHeight: "6rem",
    background: "#E86800",
    color: "white",
    fontSize: "1.4rem",
    textAlign: "center"
};
let popupBuyBtn = {
    display: "inline-block",
    width: "50%",
    height: "6rem",
    lineHeight: "6rem",
    background: "#E8000E",
    color: "white",
    fontSize: "1.4rem",
    textAlign: "center"
};

let choosetime = "prodprice";
let pathHeader = '/weixin';
let stop = false;//防止重复提交
export default class SearchListItem extends Component {
    constructor(props) {
        super(props);
        this.AddClick = this.AddClick.bind(this);
        this.SubClick = this.SubClick.bind(this);
        this.AddCart = this.AddCart.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.unitChange = this.unitChange.bind(this);
        this.AddShopCart = this.AddShopCart.bind(this);
        this.BuyNow = this.BuyNow.bind(this);
        this.DetailClick = this.DetailClick.bind(this);
        this.state = {
            bottom_show: false,
            payTime: "立即发货",
            payType: 0,
            timePrice: this.props.data.prices[0].price,//根据时间变化的价格
            singlePrice: this.props.data.marketprice.toFixed(2),//计算出来的单价
            rate: 100,
            num: this.props.data.startnum,
            unit: this.props.data.unit,
            packingList: [{value: "", label: ""}],//单位列表
            showWarn: false,
            showSuccess: false,
            warnTimer: null,
            successTimer: null,
            tipText: "",
        };
        this.state.warnTimer && clearTimeout(this.state.warnTimer);
        this.state.successTimer && clearTimeout(this.state.successTimer);
    }

    showWarn(text) {
        this.setState({showWarn: true, tipText: text});

        this.state.warnTimer = setTimeout(() => {
            this.setState({showWarn: false});
        }, 2000);
    }

    showSuccess(text) {
        this.setState({showSuccess: true});

        this.state.successTimer = setTimeout(() => {
            this.setState({showSuccess: false});
            stop=false;
        }, 2000);
    }

    componentWillMount() {

    }

    componentDidMount() {
    }

    chooseTime(price, name) {
        this.setState({timePrice: price, payTime: name})

    }

    AddCart(e) {//加入购物车
        this.setState({bottom_show: true})
    }

    AddShopCart() {//加入购物车
        let param = {};
        let protype = 0;
        if (stop === false) {
            stop=true;
            param.saleid = this.props.data.memberid;
            param.pdid = this.props.data.id;
            param.pdno = this.props.data.pdno;
            param.pdnumber = this.state.num;
            param.storeid = this.props.data.storeid;
            param.delivertime = this.state.payTime;
            param.unit = this.state.unit;
            if (this.state.payTime === "立即发货") {
                protype = 0;
            } else {
                if (this.state.payType === 0) {
                    protype = 1;
                } else {//==1
                    protype = 2;
                }
            }
            param.protype = protype;

            let self = this;
            let formData = new FormData();
            formData.append("pdid", param.pdid);
            formData.append("pdno", param.pdno);
            formData.append("pdnumber", param.pdnumber);
            formData.append("delivertime", param.delivertime);
            formData.append("unit", param.unit);
            formData.append("protype", param.protype);
            formData.append("storeid", param.storeid);
            formData.append("webToken", localStorage.getItem('webToken'));
            fetch(getHost() + "/rest/buyer/shopcar/insertShopCar", {
                method: 'POST',
                credentials: 'include',
                body: formData
            }).then(response => response.json()).then(json => {
                if (json.result === 1) {
                    console.log(json);
                    self.showSuccess();
                } else {
                    self.showWarn(json.message);
                    console.log(json.message)
                }
            }).catch(e => {
                console.log("网络出现了点问题：" + e);
                self.showWarn("网络出现了点问题");
            });
        }
    }

    BuyNow() {//立即购买
        let goodsInfo = {};
        // if (this.state.type === "紧固件") {
        let protype = 0;
        if (this.state.payTime === "立即发货") {
            protype = 0;
        } else {
            if (this.state.payType === 0) {
                protype = 1;
            } else {//==1
                protype = 2;
            }
        }
        goodsInfo = {
            pdid: this.props.data.id,
            saleid: this.props.data.memberid,
            pdno: this.props.data.pdno,
            protype: protype,
            unit: this.state.unit,
            pdnumber: this.state.num,
            storeid: this.props.data.storeid,
            storename: this.props.data.storename,
            deliverytime: this.state.payTime
        };
        // } else {
        //     let protype = 0;
        //     if (choosetime === "prodprice") {//立即发货
        //         protype = 0;
        //     } else {
        //         protype = 1;
        //     }
        //     goodsInfo = {
        //         pdid: this.state.id,
        //         saleid: this.state.otherData.memberid,
        //         pdno: this.state.pdno,
        //         protype: protype,
        //         unit: this.state.unit,
        //         pdnumber: this.state.num,
        //         storeid: this.state.otherData.storeid,
        //         storename: this.state.otherData.storename,
        //         deliverytime: this.state.payTime
        //     };
        // }
        localStorage.setItem("type", 0);
        localStorage.setItem("goodsInfo", JSON.stringify(goodsInfo));
        let url = pathHeader + "/CreateOrder";
        HistoryManager.register(url);
        location.href = url;

    }

    choosePayType(typeId) {
        this.setState({payType: typeId});
    }

    handleChange(event) {
        let val = event.target.value;
        let intValue = 0.00;
        if (val != null && !isNaN(val)) {
            //检查小数点后是否对于两位
            intValue = val;
            if (val.toString().split(".").length > 1 && val.toString().split(".")[1].length > 3) {
                // alert("小数点后不能多于两位！");
                intValue = parseFloat(val).toFixed(3);
            }
        }
        let unit = this.state.unit;
        let singleP = this.state.singlePrice;
        // this.setState({num: event.target.value});
        console.log(this.checkNumber(intValue), unit, this.props.data.pdstorenum)
        if (this.checkNumber(intValue) < this.props.data.startnum) {
            intValue = this.getNumber(this.props.data.startnum, unit);
            singleP = this.SinglePrice(this.props.data.startnum);
        } else if (this.checkNumber(intValue) > this.props.data.pdstorenum) {
            intValue = this.getNumber(this.props.data.pdstorenum, unit);
            singleP = this.SinglePrice(this.props.data.pdstorenum);
        }
        this.setState({
            unit: unit,
            num: intValue,
            singlePrice: singleP
        });
    }

    unitChange(event) {
        let unit = event.target.value;
        console.log(unit);
        let singleP = "";
        let inputNum = this.state.num;
        if (this.checkNumber(inputNum) < this.props.data.startnum) {
            inputNum = this.getNumber(this.props.data.startnum, unit);
            singleP = this.SinglePrice(this.props.data.startnum);
        } else if (this.checkNumber(inputNum) > this.props.data.pdstorenum) {
            inputNum = this.getNumber(this.props.data.pdstorenum, unit);
            singleP = this.SinglePrice(this.props.data.pdstorenum);
        } else {
            singleP = this.SinglePrice(this.getNumber(inputNum));
        }
        this.setState({
            unit: unit,
            num: inputNum,
            singlePrice: singleP
        });
    }

    AddClick() {//+1
        let oldNum = this.state.num;
        if (this.checkNumber(oldNum) <= (this.props.data.pdstorenum - 1)) {//deal
            let num = oldNum + ".00";
            let fval = num.toString().split(".")[0];
            fval++;
            let sval = num.toString().split(".")[1];
            let numStr = fval + "." + sval;
            let singleP = this.SinglePrice(this.getNumber(numStr));
            this.setState({
                num: numStr,
                singlePrice: singleP
            });
        }
    }

    SubClick() {//-1
        let oldNum = this.state.num;
        if (this.checkNumber(oldNum) > this.props.data.startnum && oldNum > 1) {
            let num = oldNum + ".00";
            let fval = num.toString().split(".")[0];
            fval--;
            let sval = num.toString().split(".")[1];
            let numStr = fval + "." + sval;
            let singleP = this.SinglePrice(this.getNumber(numStr));
            this.setState({
                num: numStr,
                singlePrice: singleP
            });
        }
    }

    getNumber(num, unit) {
        let packageList = this.props.data.packages ? this.props.data.packages : [];
        for (let i = 0; i < packageList.length; i++) {
            if (packageList[i].unit === unit) {
                // console.log("getNumber:" + num);
                return num;
            } else {
                let numRate = packageList[i].num === 0 ? 1 : packageList[i].num;
                num = (num / numRate).toFixed(2);
            }
        }
        return num;
    }

    checkNumber(num) {//判断num
        let unit = this.state.unit;
        let packageList = this.props.data.packages;
        //默认单位为最小单位packageList[0].unit
        for (let i = 0; i < packageList.length; i++) {
            if (packageList[i].unit === unit) {
                return num;
            } else {
                let numRate = packageList[i].num === 0 ? 1 : packageList[i].num;
                num = num * numRate;
            }
        }
        return num;
    }

    SinglePrice(num) {//计算单价
        let rate = 100;
        let range = JSON.parse(this.props.data.intervalprice);
        if (range.length > 0) {
            if (num <= range[0].start) {
                rate = 100;
            } else if (range[0].start < num && num <= range[0].end) {
                rate = range[0].rate;
            } else if (range[1].start < num && num <= range[1].end) {
                rate = range[1].rate;
            } else if (num > range[1].end) {
                rate = range[2].rate;
            }
        }

        let single_price = (this.state.timePrice * rate / 100).toFixed(2);
        // console.log(this.prodprice, rate);
        return single_price;
    }

    totalPrice(price, num, percent) {//单价，数量，优惠
        let rate = 100;
        let range = JSON.parse(this.props.data.intervalprice);
        if (range.length > 0) {
            if (num <= range[0].start) {
                rate = 100;
            } else if (range[0].start < num && num <= range[0].end) {
                rate = range[0].rate;
            } else if (range[1].start < num && num <= range[1].end) {
                rate = range[1].rate;
            } else if (num > range[1].end) {
                rate = range[2].rate;
            }
        }

        let total_price = (price * num * rate).toFixed(2);
        if (percent) {
            total_price = (price * num * rate * percent / 100).toFixed(2);
        }
        return total_price;
    }

    DetailClick(e) {
        let url = pathHeader + "/ProductDetail?id=" + this.props.data.id + "&type=" + this.props.data.producttype;
        HistoryManager.register(url);
        location.href = url;
    }

    render() {
        let imgSrc = this.props.data.pdpicture ? this.props.data.pdpicture[0] : 'default/imgs/defaultProductImg.jpg';
        let packages = [];
        for (let i = 0; i < this.props.data.packages.length; i++) {
            let item = {
                value: this.props.data.packages[i].unit,
                label: this.props.data.packages[i].unit,
            };
            packages.push(item);
        }
        return (
            <Cell style={{borderTop: "0.5rem solid #f2f2f2"}}>
                <CellHeader onClick={this.DetailClick}>
                    <img style={{width: "9rem", height: "9rem", marginRight: '1rem'}}
                         src={process.env.IMAGE_PRIFIX + imgSrc}/>
                </CellHeader>
                <CellBody style={{fontSize: "1.2rem"}}>
                    <div style={{fontSize: "1.4rem", wordWrap: "break-word", wordBreak: "break-all"}}
                         onClick={this.DetailClick}>
                        {
                            this.props.data.selfsupport ?
                                <img style={selfStyle} src="/assets/images/common/icon_self.png"/> : null
                        }
                        {this.props.data.productname}
                        <span>/{this.props.data.level3}</span>
                        <span>/{this.props.data.stand}</span>
                        <span>/{this.props.data.material}</span>
                        <span>/{this.props.data.cardnum}</span>
                    </div>
                    <div onClick={this.DetailClick}>品牌：<span
                        style={{marginRight: "3rem"}}>{this.props.data.brand}</span>表面处理：{this.props.data.surfacetreatment}
                    </div>
                    <div onClick={this.DetailClick}>包装方式：<span
                        style={{marginRight: "3rem"}}>{this.props.data.packagetype}</span>单位：{this.props.data.unit}
                    </div>
                    <div onClick={this.DetailClick}>仓库：<span
                        style={{marginRight: "3rem"}}>{this.props.data.storename}</span>库存：{(this.props.data.pdstorenum).toFixed(4)}
                    </div>
                    <div><span style={{color: "red"}}>¥ {this.props.data.marketprice}</span>
                        <span style={addBtn} onClick={this.AddCart}>加入购物车</span>
                    </div>
                </CellBody>
                <Popup
                    show={this.state.bottom_show}
                    onRequestClose={e => this.setState({bottom_show: false})}
                >
                    <div style={{background: "white"}}>
                        <div style={{position: "absolute", top: "1rem", right: "1rem"}}
                             onClick={e => this.setState({bottom_show: false})}>
                            <img style={cancelBtn} src="/assets/images/shop/shop_popup_cancel.png"/>
                        </div>
                        <div style={paddingStyle}>
                            <img src={process.env.IMAGE_PRIFIX + imgSrc} style={{width: "8rem", height: "8rem"}}/>
                            <div style={{
                                display: "inline-block",
                                marginLeft: "1rem",
                                width: "26rem",
                                verticalAlign: "text-bottom"
                            }}>
                                <div>¥{this.state.singlePrice}/{this.props.data.unit}</div>
                                <div>{this.props.data.productname}
                                    <span>{this.props.data.stand}</span>
                                    <span>{this.props.data.material}/{this.props.data.cardnum}</span>
                                </div>
                                <div>品牌：<span
                                    style={{marginRight: "8rem"}}>{this.props.data.brand}</span>表面处理：{this.props.data.surfacetreatment}
                                </div>
                                <div>包装方式：<span
                                    style={{marginRight: "2rem"}}>{this.props.data.packagetype}</span>库存：{this.props.data.pdstorenum.toFixed(3)}{this.props.data.unit}
                                </div>
                                {/*<div>选择分类</div>*/}
                            </div>
                        </div>
                        <div className="shopLine">
                            <div style={{display: "inline-block", width: "10rem", fontSize: "1.4rem"}}>发货仓库</div>
                            <ul className="myUl">
                                <li className="checkedLi">{this.props.data.storename}</li>
                            </ul>
                        </div>
                        <div className="shopLine">
                            <div style={{display: "inline-block", width: "10rem", fontSize: "1.4rem"}}>发货时间</div>
                            <ul className="myUl">
                                {(this.props.data.prices || []).map((item, i) =>
                                    <li key={i} onClick={this.chooseTime.bind(this, item.price, item.name)}
                                        className={this.state.payTime === item.name ? "checkedLi" : ""}>{item.name}</li>
                                )}
                            </ul>
                        </div>
                        {
                            this.state.payTime === "立即发货" ? null :
                                <div className="shopLine">
                                    <div style={{display: "inline-block", width: "10rem", fontSize: "1.4rem"}}>支付方式
                                    </div>
                                    <ul className="myUl">
                                        <li className={this.state.payType === 0 ? "checkedLi" : ""}
                                            onClick={this.choosePayType.bind(this, 0)}>全款(9.9折)
                                        </li>
                                        <li className={this.state.payType === 1 ? "checkedLi" : ""}
                                            onClick={this.choosePayType.bind(this, 1)}>定金{this.props.rate}%
                                        </li>
                                    </ul>
                                </div>
                        }
                        <div style={paddingStyle}>购买数量：
                            <div style={{display: "inline-block", width: "22rem", fontSize: "1.4rem"}}>
                                <img style={imgBtn} src="/assets/images/shop/shop_prod_sub.png"
                                     onClick={this.SubClick}/>
                                <input type="text" style={inputStyle} value={this.state.num}
                                       onChange={this.handleChange}/>
                                <img style={imgBtn_add} src="/assets/images/shop/shop_prod_add.png"
                                     onClick={this.AddClick}/>
                            </div>
                            <div style={{
                                display: "inline-block",
                                marginLeft: "1rem"
                            }}>
                                <Select style={unitStyle} data={packages}
                                        onChange={this.unitChange}/>
                            </div>
                        </div>
                        {/*<div style={paddingStyle}>总价：<span style={{color: "red"}}>¥ 200</span></div>*/}
                        <div>
                            <div style={popupAddBtn} onClick={this.AddShopCart}>
                                加入购物车
                            </div>
                            <div style={popupBuyBtn} onClick={this.BuyNow}>
                                立即购买
                            </div>
                        </div>
                    </div>
                    <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
                    <Toptips type="primary" show={this.state.showSuccess}> 添加成功 </Toptips>
                </Popup>
            </Cell>
        )
    }


}