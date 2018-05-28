import React, {Component} from 'react';
import AssortmentItem from './AssortmentItem.jsx';

let itemStyle = {
    width: "50%",
    display: "inline-block",
    backgroundColor: "white",
    // border: "0.25rem solid #eee",
    borderBottom: "0.25rem solid #eee",
};
let itemStyle2 = {
    width: "50%",
    display: "inline-block",
    backgroundColor: "white",
    borderTop: "0.5rem solid #eee",
    borderLeft: "0.24rem solid #eee",
};
let titleStyle = {
    width: "100%",
    height: "3rem",
    lineHeight: "3rem",
    fontSize: "1.4rem"
};
let redIcon = {
    display: "inline-block",
    background: "red",
    height: "1.6rem",
    width: "0.3rem",
    verticalAlign: "middle",
    marginLeft: "1.5rem",
    marginRight: "0.5rem"
};
let rightArrow = {
    width: "1rem",
    height: "1.5rem",
    verticalAlign: "middle",
    margin: "0 1.5rem 0 0.5rem",
    paddingBottom: "0.2rem",

};
export default class Assortment extends Component {
    constructor(props) {
        super(props);

    }


    componentWillMount() {

    }

    componentDidMount() {
    }



    render() {
        return (
            <div>
                <div style={titleStyle}>
                    <div style={redIcon}></div>
                    {this.props.titleName}
                    {/*<div style={{float: "right"}}>*/}
                        {/*<span style={{fontSize: "1.2rem"}}>更多</span>*/}
                        {/*<img style={rightArrow} src="/assets/images/shop/shop_arrow_right.png"/>*/}
                    {/*</div>*/}
                </div>
                <div style={{clear: "both"}}></div>
                <div style={{border: "0.25rem solid #eee"}}>
                    {
                        (this.props.data || []).map((item, i) =>
                            <div style={itemStyle} className="assort" key={i}>
                                <AssortmentItem id={item.cateid} data={item}/>
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }


}
//属性默认值
Assortment.defaultProps = {
    id: "",
    titleName: "",
    data: []
};