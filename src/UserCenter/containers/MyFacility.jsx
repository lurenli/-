import React, {Component} from 'react';
import WeUI from 'react-weui';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import MyFacilityItem from '../components/MyFacilityItem.jsx';
import $ from 'jquery';
//import styles
import 'weui';
import {CSS} from '../styles/Register.css';

const {
    ButtonArea,
    Button,
    CellsTitle,
    Cells,
    Cell,
    CellHeader,
    CellBody,
    CellFooter,
    Label,
    Input,
    TextArea,
    Toptips
} = WeUI;
let bgStyle = {
    width: "100%",
    minHeight: "100%",
    background: "#F5F5F5",
    fontSize: "1.4rem"
};
let redText = {
    color: "red"
};
let leftDisplay = {
    display: "inline-block",
    width: "50%",
    textAlign: "left",
};
let rightDisplay = {
    display: "inline-block",
    width: "50%",
    textAlign: "right",
};
let pathHeader='/weixin';
export default class MyFacility extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.RightClick = this.RightClick.bind(this);
    }


    componentWillMount() {

    }

    componentDidMount() {
    }

    LeftClick() {
        HistoryManager.pageBack();
    }

    RightClick() {
        let url = pathHeader+"/BillDetailFacility";
        HistoryManager.register(url);
        location.href = url;
    }

    render() {
        return (
            <div style={bgStyle}>
                <NavigationBar Title="账单明细" LeftBar="true" LeftTitle="返回" RightBar="true" RightTitle="账单明细"
                               RightClick={this.RightClick}
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                <div style={{fontSize: "1.4rem", margin: "1rem 0", padding: "0.5rem 1rem", background: "white"}}>
                    <div>
                        总额度：<span style={redText}>20000.00</span>
                    </div>
                    <div>
                        已用额度：<span style={redText}>10000.00</span>
                    </div>
                    <div>
                        <div style={leftDisplay}>每日账单日：<span>15</span>号</div>
                        <div style={rightDisplay}>每日还款日：<span>25</span>号</div>
                    </div>
                </div>
                <MyFacilityItem/>
            </div>
        )
    }


}