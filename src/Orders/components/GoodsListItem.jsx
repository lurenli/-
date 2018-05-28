import React, {Component} from 'react';
import WeUI from 'react-weui';

//import styles
import 'weui';
import {CSS} from '../style/order.css';

const {Form, Cells, Cell, CellHeader, CellBody, CellFooter, Toptips,ActionSheet} = WeUI;
let imgStyle = {
    width: "5rem",
    height: "5rem"
};
let rightStyle = {
    float: "right",
    color: "red"
};
let wayStyle = {
    padding: "1rem 0",
    borderTop: "1px solid #f2f2f2",
    borderBottom: "1px solid #f2f2f2",
};
let selfStyle = {
    width: "3.4rem",
    height: "1.6rem",
    verticalAlign: "middle",
    margin:"0rem 0.2rem"
};
export default class GoodsListItem extends Component {
    constructor(props) {
        super(props);
        this.HideTransport = this.HideTransport.bind(this);
        this.ShowTransport=this.ShowTransport.bind(this);
        this.state={
            //自提还是快递物流（单个商品：0快递物流。1：自提） （购物车多个商品结算：）需要自提的商品id json数组字符串，如[1,2]
            transport_show: false,
            transport_menus: [{
                label: "快递物流",
                onClick: this.ChangeTransport.bind(this,0)
            // }, {
            //     label: "自提"+(this.props.data.storeAddress),
            //     onClick: this.ChangeTransport.bind(this,1)
            }],
            transport_actions: [
                {
                    label: '取消',
                    onClick: this.HideTransport
                }
            ],
        }
    }


    componentWillMount() {

    }

    componentDidMount() {
    }
    //配送方式弹出框的隐藏
    HideTransport() {
        this.setState({
            transport_show: false,
        });
    }
    //打开配送方式的弹框
    ShowTransport() {
        this.setState({transport_show: true})
    }

    ChangeTransport(type){
        this.props.transCallback(this.props.index,type);
        this.setState({transport_show: false});
    }
    //配送方式
    CheckTransport(transport) {
        let transportCh = "快递物流";
        // if (transport === 1) {
        //     transportCh = "自提"+(this.props.data.storeAddress);
        // }
        return transportCh;
    }
    //计算单个订单列表总价
    calcmunD(item) {
        if (item) {
            return parseFloat(item + 0.000001).toFixed(2)

        } else {
            return '0.00'
        }

    }


    render() {
        let imgSrc = this.props.data.pdpic ? this.props.data.pdpic : 'default/imgs/defaultProductImg.jpg';
        let bgColor = {};
        let wayDiv = null;
        let priceDiv = null;
        let transP=this.props.transport.length>0?this.props.transport[this.props.index]:0;
        let transportCh = this.CheckTransport(transP);
        if (this.props.withAddress) {
            imgSrc = this.props.data.pdpicture.length>0 ? this.props.data.pdpicture[0] : 'default/imgs/defaultProductImg.jpg';
            bgColor = {background: "white"};
            wayDiv = <div style={wayStyle}>
                <Cell access style={{padding: "0rem"}}>
                    <CellHeader>配送方式 </CellHeader>
                    <CellBody onClick={this.props.data.selfsupport?this.ShowTransport:null}>
                        <div style={{textAlign: "right"}}>{transportCh}</div>
                    </CellBody>
                    {this.props.data.selfsupport?<CellFooter/>:null}
                </Cell>
                <ActionSheet
                    menus={this.state.transport_menus}
                    actions={this.state.transport_actions}
                    show={this.state.transport_show}
                    type="android"
                    onRequestClose={e => this.setState({transport_show: false})}
                />
            </div>;
            let price = 0.00;
            if (this.props.data.partpay === 0 && this.props.data.allpay === 0) {
                price = this.calcmunD((this.props.data.pdnumber * this.props.data.price) + parseFloat(this.props.data.totalCost))
            } else {
                if (this.props.data.protype === 2) {
                    price = this.calcmunD(this.props.data.partpay);
                } else {
                    price = this.calcmunD(this.props.data.allpay);
                }
            }
            priceDiv = <div className="detail_price">
                {
                    this.props.data.partpay ?
                        <div>定金：<span style={rightStyle}>¥ {this.calcmunD(this.props.data.partpay)}</span></div> :
                        <div>商品总额：<span
                            style={rightStyle}>¥ {this.calcmunD(this.props.data.pdnumber * this.props.data.price)}</span>
                        </div>
                }
                <div>+运费：<span style={rightStyle}>¥ {this.calcmunD(this.props.data.totalCost)}</span></div>
                <div style={{textAlign: "right"}}>
                    需支付：<span style={rightStyle}>¥ {price}</span>
                </div>
            </div>
        }
        if (this.props.data.producttype === "紧固件" || this.props.data.producttype === 1) {
            return (
                <div className="goods" style={bgColor}>
                    <div className="goods_img">
                        <img style={imgStyle} src={process.env.IMAGE_PRIFIX + imgSrc}/>
                    </div>
                    <div className="goods_detail">
                        <div
                            className="goods_name">
                            {
                                this.props.data.selfsupport ?
                                    <img style={selfStyle} src="/assets/images/common/icon_self.png"/> : null
                            }
                            {this.props.data.productname || this.props.data.pdname}/{this.props.data.level3?this.props.data.level3:this.props.data.classify}</div>
                        <div>规格：{this.props.data.attrjson}</div>
                        <div>单价：{this.props.data.price}<span>/{this.props.data.unit}</span>
                            <span className="goods_num">x{this.props.data.pdnumber || this.props.data.num}</span>
                        </div>
                    </div>
                    {wayDiv}
                    {priceDiv}
                </div>
            )
        } else {
            return (
                <div className="goods" style={bgColor}>
                    <div className="goods_img">
                        <img style={imgStyle} src={process.env.IMAGE_PRIFIX + imgSrc}/>
                    </div>
                    <div className="goods_detail">
                        <div className="goods_name">{this.props.data.productname || this.props.data.pdname}/{this.props.data.level3?this.props.data.level3:this.props.data.classify}</div>
                        <div>规格：{this.props.data.attrjson}</div>
                        <div>单价：{this.props.data.price}<span>/{this.props.data.unit}</span>
                            <span className="goods_num">x{this.props.data.pdnumber || this.props.data.num}</span>
                        </div>
                    </div>
                    {wayDiv}
                    {priceDiv}
                </div>
            )
        }

    }


}
GoodsListItem.defaultProps = {
    withAddress: false,
    transport:[],
    index:0,
};