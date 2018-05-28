import React, {Component} from 'react';
import {CSS} from '../style/shop.css';
import ActivityDetail from "../containers/ActivityDetail";

let itemStyle = {
    display: "inline-block",
    position: "relative",
    width: "50%",
    height: "26rem",
    textAlign: "center",
    border: "1px solid #eee"
};
let prodStyle = {
    width: "16rem",
    height: "16rem",
};
let pathHeader = '/weixin';
export default class ActivityItem extends Component {
    constructor(props) {
        super(props);
        this.DetailClick = this.DetailClick.bind(this)
    }


    componentWillMount() {

    }

    componentDidMount() {
    }
    //状态为4---距离结束
    endTime() {
        let time = this.props.data.endtime - new Date().getTime();
        if (this.props.data.state === 4) {//yure
            time = this.props.data.endtime - new Date().getTime();
        }
        // 计算出相差天数
        let days = Math.floor(time / (24 * 3600 * 1000));
//计算出小时数
        let leave1 = time % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
        let hours = Math.floor(leave1 / (3600 * 1000));
//计算相差分钟数
        let leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
        let minutes = Math.floor(leave2 / (60 * 1000));
//计算相差秒数
        let leave3 = leave2 % (60 * 1000);    //计算分钟数后剩余的毫秒数
        let seconds = Math.round(leave3 / 1000);

            hours= hours < 10 ? "0" + hours : hours;
            minutes= minutes < 10 ? "0" + minutes : minutes;
            seconds= seconds < 10 ? "0" + seconds : seconds;
        if(days > 0){return days + "天" + hours + "小时";}
        if(days <= 0 && hours > 0 ){return hours + "小时" + minutes + "分";}
        if(days <= 0 && hours <= 0){return minutes + "分" + seconds + "秒";}
    }
    //状态为1   ---距离还有多久开始
    beginTime() {
        let time = this.props.data.begintime - new Date().getTime();
        if (this.props.data.state === 1) {//yure
            time = this.props.data.begintime - new Date().getTime();
        }
        // 计算出相差天数
        let days = Math.floor(time/ (24 * 3600 * 1000));
//计算出小时数
        let leave1 = time % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
        let hours = Math.floor(leave1 / (3600 * 1000));
//计算相差分钟数
        let leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
        let minutes = Math.floor(leave2 / (60 * 1000));
//计算相差秒数
        let leave3 = leave2 % (60 * 1000);    //计算分钟数后剩余的毫秒数
        let seconds = Math.round(leave3 / 1000);

        hours= hours < 10 ? "0" + hours : hours;
        minutes= minutes < 10 ? "0" + minutes : minutes;
        seconds= seconds < 10 ? "0" + seconds : seconds;
        if(days > 0){return days + "天" + hours + "小时";}
        if(days <= 0 && hours > 0 ){return hours + "小时" + minutes + "分";}
        if(days <= 0 && hours <= 0){return minutes + "分" + seconds + "秒";}
    }

    DetailClick() {
        let url = pathHeader + "/ActivityDetail?id=" + this.props.data.id + "&type=" + this.props.data.producttype;
        HistoryManager.register(url);
        location.href = url;
    }

    render() {
        return (
            <div style={itemStyle} onClick={this.DetailClick}>
                {
                    this.props.data.state === 1 ?
                        <div className="activity_time_wait">
                            距开始{this.beginTime()}
                        </div> :
                    this.props.data.state === 4 ?
                       <div className="activity_time">
                            距结束{this.endTime()}
                        </div>:""
                }
                <img style={prodStyle}
                     src={!this.props.data.pdpicture?process.env.IMAGE_PRIFIX + 'default/imgs/defaultProductImg.jpg' : process.env.IMAGE_PRIFIX + this.props.data.pdpicture[0] }/>
                <div style={{padding: "0 1rem",}}>
                    <div className="nameStyle">{this.props.data.productname}/{this.props.data.level3}</div>
                    <div style={{textAlign: "left"}}>
                        <span style={{color: "red", fontSize: "1.6rem"}}>¥{this.props.data.minprice}</span>
                        <span style={{
                            color: "grey",
                            textDecoration: "line-through",
                            fontSize: "1.2rem"
                        }}>¥{this.props.data.normalprice}</span>

                    </div>
                    <div style={{
                        float: "right",
                        color: "grey",
                        fontSize: "1.6rem"
                    }}>限购{this.props.data.buylimit}{this.props.data.unit}</div>
                </div>
            </div>
        )
    }


}
ActivityItem.defaultProps = {
};