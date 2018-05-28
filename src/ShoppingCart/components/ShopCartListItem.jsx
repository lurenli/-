import React, {Component} from 'react';
import WeUI from 'react-weui';

//import styles
import 'weui';

const {Cell, CellHeader, CellBody, Select, Input} = WeUI;
let itemStyle = {
    width: "100%",
    fontSize: "1.4rem",
    marginBottom: '0.5rem',
    background: "white"
};
let chooseUnit = {
    display: "inline-block",
    marginLeft: "1rem"
};
let unitStyle = {
    height: "3rem",
    lineHeight: "3rem",
    fontSize: "1.2rem",
    padding: "0 1rem",
    borderRadius: "0",
    background: "#f2f2f2",
};
let selfStyle = {
    width: "3.4rem",
    height: "1.6rem",
    verticalAlign: "middle",
    margin:"0rem 0.2rem"
};
export default class ShopCartListItem extends Component {
    constructor(props) {
        super(props);
        this.unitChange = this.unitChange.bind(this);
        this.checkClick = this.checkClick.bind(this);
    }


    componentWillMount() {

    }

    componentDidMount() {
    }

    unitChange(e) {
        console.log(e.target.options[e.target.selectedIndex].text);
        console.log(e.target.value);
    }

    checkClick() {
        this.props.callback(this.props.id, this.props.check)
    }

    render() {
        let checkImg = "/assets/images/shopCart/shopcart_unchoose.png";
        if (this.props.check) {
            checkImg = "/assets/images/shopCart/shopcart_choosed.png";
        }
        if (this.props.data.producttype === 1) {
            return (
                <div style={itemStyle} onClick={this.checkClick}>
                    <div style={{width: "100%", height: "3rem", lineHeight: '3rem'}}>
                        <div style={{
                            float: "left",
                            marginLeft: "3rem"
                        }}>{this.props.data.storename}-{this.props.data.delivertime}</div>
                        <div style={this.props.data.protype === 0 ? {display: "none"} : {
                            float: "right",
                            marginRight: "1rem"
                        }}>
                            {this.props.data.protype === 1 ? "全款(9.9折扣)" : "定金" + this.props.rate + "%"}
                        </div>
                    </div>
                    <Cell style={{width: "100%"}}>
                        <CellHeader>
                            <img style={{width: "2rem", height: "2rem", margin: "1.5rem"}}
                                 src={checkImg}/>
                            <img style={{width: "5rem", height: "5rem"}}
                                 src={this.props.data.pdpicture?process.env.IMAGE_PRIFIX + this.props.data.pdpicture[0]:process.env.IMAGE_PRIFIX + 'default/imgs/defaultProductImg.jpg'}/>
                        </CellHeader>
                        <CellBody style={{marginLeft: "1rem"}}>
                            <div>
                                {
                                    this.props.data.selfsupport ?
                                        <img style={selfStyle} src="/assets/images/common/icon_self.png"/> : null
                                }
                                {this.props.data.productname}/{this.props.data.level3}</div>
                            <div>{this.props.data.stand}</div>
                            <div style={{fontSize: "1.4rem"}}>
                                <sapn style={{color: "red"}}>单价:¥ {this.props.data.price} </sapn>
                            </div>
                            <div>
                                <span style={{
                                    color: "red",
                                    fontSize: "1.4rem"
                                }}>总价:¥ {(parseFloat(this.props.data.price * this.props.data.pdnumber) + 0.0001).toFixed(2)}</span>
                                <span style={{float: "right"}}>
                                    x {this.props.data.pdnumber} {this.props.data.unit}({this.props.data.packageStr})</span>
                            </div>
                        </CellBody>
                    </Cell>
                </div>
            )
        } else {
            return (
                <div style={itemStyle}>
                    <Cell style={{width: "100%"}} onClick={this.checkClick}>
                        <CellHeader>
                            <img style={{width: "2rem", height: "2rem", margin: "1.5rem"}}
                                 src={checkImg}/>
                            <img style={{width: "5rem", height: "5rem"}}
                                 src={this.props.data.pdpicture?process.env.IMAGE_PRIFIX + this.props.data.pdpicture[0]:process.env.IMAGE_PRIFIX + 'default/imgs/defaultProductImg.jpg'}/>
                        </CellHeader>
                        <CellBody style={{marginLeft: "1rem"}}>
                            <div>{this.props.data.productname}/{this.props.data.level3}</div>
                            <div>{this.props.data.attrjson}</div>
                            <div>
                                <sapn style={{color: "red"}}>¥ {this.props.data.price} </sapn>
                                <span
                                    style={{float: "right"}}>x {this.props.data.pdnumber} {this.props.data.unit}</span>
                            </div>
                        </CellBody>
                    </Cell>
                </div>
            )
        }
    }


}
ShopCartListItem.defaultProps = {
    id: null,
    data: {},
    check: false,
    // producttype: 1,
    // pic:[],
    // storeName: "杭州仓",
    // deliverTime: "立即发货",
    // name: "我是衣服",
    // material: "红色，xxl",
    // price: "200",
    // num: "1",
    // unit: "千",
    packingList: [{label: "千", value: 0.25}, {label: "盒", value: 6}, {label: "箱", value: 0}]
};