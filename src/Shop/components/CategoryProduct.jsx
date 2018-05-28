import React, {Component} from 'react';

let imgStyle={
    width:"12rem",
    height:"12rem",
};
let nameStyle={
    fontSize: "1.4rem",
    height: "4rem",
    textAlign: "left",
    overflow: "hidden",
    text0verflow: "ellipsis",
};
let pathHeader='/weixin';

export default class CategoryProduct extends Component {
    constructor(props) {
        super(props);
        this.DetailClick=this.DetailClick.bind(this);
        this.state = {
            showPic: this.props.data.pdpicture[0],
        };
    }


    componentWillMount() {

    }

    componentDidMount() {
    }

    DetailClick(){
        let url=pathHeader+'/ProductDetail?id='+this.props.data.id;
        HistoryManager.register(url);
        location.href = url;
    }

    render() {
        return (
            <div className="product_item" onClick={this.DetailClick}>
                <img style={imgStyle} src={process.env.IMAGE_PRIFIX + "/" +this.state.showPic}/>
                <div style={ nameStyle}>{this.props.data.productname} {this.props.data.productalias} {this.props.data.subtitle}</div>
                <div style={{
                    color:"#E8000E",
                    textAlign:"right",
                }}>￥{this.props.data.minprice}/{this.props.data.unit}</div>
            </div>
        )
    }


}