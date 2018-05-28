import React, {Component} from 'react';
import WeUI from 'react-weui';
import 'weui';

let imgStyle = {
    width: "4rem",
    height: "4rem",
};
let itemStyle = {
    flex: "1",
    textAlign: "center",
    padding: "0.5rem 0"
};
const {
    Badge,
} = WeUI;
//底部导航栏子项
export default class TabBarItem extends Component {
    constructor(props) {
        super(props);
        this.tabClick = this.tabClick.bind(this);
    }


    componentWillMount() {

    }

    componentDidMount() {
    }

    tabClick() {
        this.props.tabClick(this.props.index);
    }

    render() {
        let imgSrc = "/assets/images/common/tab_" + this.props.name + ".png";
        if (this.props.checked) {
            imgSrc = "/assets/images/common/tab_click_" + this.props.name + ".png";
        }
        let num = localStorage.getItem("shopCart");
        return (
            <div style={itemStyle} id={this.props.index}
                 onClick={this.tabClick}>
                <div className="tabItem" style={{
                    background: "url('" + imgSrc + "') no-repeat",
                }}>
                    {
                        this.props.index === 2&&num>0 ?
                            <Badge preset="header">{num}</Badge> : null
                    }
                    {/*<img style={imgStyle} src={imgSrc}/>*/}
                </div>
            </div>
        )
    }


}