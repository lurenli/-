import React, {Component} from 'react';
import {CSS} from '../../Shop/style/shop.css';

let itemStyle = {
    display: "inline-block",
    width: "50%",
    height: "17rem",
    textAlign: "center",
    padding: "2rem",
    backgroundColor: "white",
    border: "0.1rem solid #f2f2f2",
    position: "relative",
};
let prodStyle = {
    width: "8rem",
    height: "8rem",
};
let chooseImg = {
    width: "2rem",
    height: "2rem",
    position: "absolute",
    top: "0.5rem",
    right: "0.5rem"
};
let pathHeader='/weixin';
export default class MyCollectionsItem extends Component {
    constructor(props) {
        super(props);
        this.ChooseClick = this.ChooseClick.bind(this);
        this.DetailClick=this.DetailClick.bind(this);
        // this.state={
        //     check:this.props.check,
        // };
    }


    componentWillMount() {

    }

    componentDidMount() {

    }

    ChooseClick() {
        let newCheck = !this.props.check;
        // this.setState({
        //     check:newCheck
        // });
        this.props.callback(newCheck, this.props.id, this.props.index);
    }

    DetailClick(){
        let url = pathHeader+"/ProductDetail?id=" + this.props.id+"&type="+this.props.data.producttype;
        HistoryManager.register(url);
        location.href = url;
    }

    render() {
        let imgDiv = null;
        if (this.props.chooseReady) {
            if (this.props.check) {
                imgDiv = <img style={chooseImg} onClick={this.ChooseClick}
                              src="/assets/images/userCenter/user_collection_checked.png"/>
            } else {
                imgDiv = <img style={chooseImg} onClick={this.ChooseClick}
                              src="/assets/images/userCenter/user_collection_uncheck.png"/>;
            }
        }
        let imgSrc = this.props.data.pdpicture ? this.props.data.pdpicture : 'default/imgs/defaultProductImg.jpg';
        return (
            <div style={itemStyle}>
                <img style={prodStyle} src={process.env.IMAGE_PRIFIX  + imgSrc} onClick={this.DetailClick}/>
                {imgDiv}
                {this.props.data.producttype === "紧固件" ?
                    <p className="nameStyle">{this.props.data.productname}{this.props.data.stand}{this.props.data.material}/{this.props.data.cardnum}</p> :
                    <p className="nameStyle">{this.props.data.productname}</p>}
                <div>
                    <span
                        style={{float: "left"}}>{this.props.data.prodprice ? "¥" + this.props.data.prodprice : ""}</span>
                    {/*<span style={{float: "right"}}>{this.props.number}人付款</span>*/}
                </div>
            </div>
        )
    }


}