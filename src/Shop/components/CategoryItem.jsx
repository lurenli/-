import React, {Component} from 'react';
import {CSS} from '../style/shop.css';

let itemStyle = {
    display: "inline-block",
    width: "14rem",
    height: "17rem",
    textAlign: "center",
    padding: "2rem",
    border: "1px solid #eee"
};
let prodStyle = {
    width: "8rem",
    height: "8rem",
};

export default class CategoryItem extends Component {
    constructor(props) {
        super(props);
    }


    componentWillMount() {

    }

    componentDidMount() {
    }


    render() {
        return (
            <div style={itemStyle}>
                <img style={prodStyle} src={this.props.imgSrc}/>
                <p className="nameStyle">{this.props.name}</p>
                <div>
                    <span style={{float: "left", color: "red"}}>¥{this.props.price}</span>
                    <span style={{float: "right", textDecoration: "line-through"}}>¥{this.props.oldPrice}</span>
                </div>
            </div>
        )
    }


}