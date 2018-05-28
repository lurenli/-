import React, {Component} from 'react';
import {CSS} from '../style/shop.css';

let itemStyle = {
    width: "100%",
    height: "15rem",
    textAlign: "center",
    padding: "1rem",
};
let prodStyle = {
    width: "13rem",
    height: "13rem",
};
let pathHeader='/weixin';
export default class AssortmentItem extends Component {
    constructor(props) {
        super(props);
        this.ClickDetail = this.ClickDetail.bind(this);
    }


    componentWillMount() {

    }

    componentDidMount() {
    }

    ClickDetail() {
        let url;
        if (this.props.data.type === "紧固件") {
            // localStorage.setItem('keyword', this.props.data.catename);
            url = pathHeader+'/SearchProduct?keyword='+this.props.data.catename;
        } else {
            url = pathHeader+'/SearchOther?keyword=' + this.props.data.catename;
        }
        HistoryManager.register(url);
        location.href = url;
    }

    render() {
        return (
            <div style={itemStyle} onClick={this.ClickDetail}>
                <img style={prodStyle}
                     src={process.env.IMAGE_PRIFIX + (this.props.data.img ? this.props.data.img : 'default/imgs/defaultProductImg.jpg')}/>
                {/*<p className="nameStyle">{this.props.name}</p>*/}
                {/*<div>*/}
                {/*<span style={{float: "left"}}>¥{this.props.price}/{this.props.unit}</span>*/}
                {/*<span style={{float: "right"}}>{this.props.number}人付款</span>*/}
                {/*</div>*/}
            </div>
        )
    }


}