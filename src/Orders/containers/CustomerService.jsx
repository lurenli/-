import React, {Component} from 'react';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import WeUI from 'react-weui';

//import styles
import 'weui';
import {CSS} from '../style/order.css';
let pathHeader='/weixin';
const {Form, FormCell, Cells, CellsTips, Cell, CellHeader, CellBody, CellFooter, TextArea, Input, Label, Select} = WeUI;
export default class CustomerService extends Component {
    constructor(props) {
        super(props);
        this.HistoryClick=this.HistoryClick.bind(this);
        this.LeftClick=this.LeftClick.bind(this);
        this.state={
            time:"",
            expireTime:1517971558000,
        };
    }


    componentWillMount() {

    }

    componentDidMount() {
        let self=this;
        //初始加载之后设置每一秒钟更新倒计时
        window.setInterval(function () {
            let time = "";
            let now = new Date();
            let expireTime = new Date(self.state.expireTime);
            let leftTime = expireTime.getTime() - now.getTime();
            if (leftTime < 0) {
                time = "已过期";
            } else {
                let leftsecond = parseInt(leftTime / 1000);
                let day1 = Math.floor(leftsecond / (60 * 60 * 24));
                let hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
                hour = hour < 10 ? '0' + hour : hour;
                let minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
                minute = minute < 10 ? '0' + minute : minute;
                let second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);
                second = second < 10 ? '0' + second : second;
                time = "还剩"+day1+"天" + hour + "小时" + minute + "分" + second + "秒";
            }
            self.setState({
                time: time
            });

        }, 1000)
    }

    LeftClick() {
        HistoryManager.pageBack();
    }
    //协商历史
    HistoryClick(){
        let url = pathHeader+"/TalkingHistory";
        HistoryManager.register(url);
        location.href = url;
    }

    render() {
        return (
            <div style={{background: "#f2f2f2"}}>
                <NavigationBar Title="退款详情" LeftBar="true" LeftTitle="返回"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                <div style={{background: "#fff", fontSize: "1.4rem"}}>
                    <div style={{background: "red", height: "6rem",color:"white",textAlign:"center"}}>
                        <div>等待卖家同意</div>
                        <div>{this.state.time}</div>
                    </div>
                    <div style={{padding: "1rem 1.5rem", borderBottom: "1px solid #f2f2f2"}}>
                        您已成功发起退款申请，请耐心等待商家处理
                    </div>
                    <div style={{padding: "1rem 1.5rem", fontSize: "1.3rem"}}>
                        <div>
                            *商家同意或者超时未处理，系统将退款给您。
                        </div>
                        <div>*如果商家拒绝，您可以修改申请后再次发起，商家会重新处理。</div>
                    </div>
                    <div style={{textAlign: "right", padding: "1rem"}}>
                        <div className="goods_btn_white">撤销申请</div>
                        <div className="goods_btn_red">修改申请</div>
                    </div>
                </div>
                <Cells>
                    <Cell access>
                        <CellBody onClick={this.HistoryClick}>
                            协商历史
                        </CellBody>
                        <CellFooter/>
                    </Cell>
                </Cells>
                <Cells>
                    <Cell style={{position: "static"}}>
                        <CellBody>
                            退款信息
                        </CellBody>
                    </Cell>
                    <Cell style={{position: "static", background: "#f2f2f2"}}>
                        <CellHeader>
                            <img className="goods_img"/>
                        </CellHeader>
                        <CellBody>
                            外六角全牙螺栓
                        </CellBody>
                    </Cell>
                    <div style={{padding: "1rem 1.5rem", fontSize: "1.3rem"}}>
                        <div>退货件数：2</div>
                        <div>退款金额：108.00</div>
                        <div>退款原因：货物有瑕疵</div>
                        <div>货物状态：已收到货</div>
                        <div>说明：其他</div>
                        <div>退款编号：12414124124114124</div>
                    </div>
                </Cells>

            </div>
        )
    }


}