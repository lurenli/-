import React, {Component} from 'react';
import WeUI from 'react-weui';


//import styles
import 'weui';
import {CSS} from '../../../assets/common.css';
import {myCSS} from '../style/Active.css';

const {
    Tab, NavBarItem,
    Cells,
    Cell,
    CellHeader,
    CellBody,
    Toptips
} = WeUI;
let pathHeader='/weixin';
let bgWidth=window.screen.width;
export default class wuyiActice extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.ToBack = this.ToBack.bind(this);
        this.state = {
            showWarn: false,
        };
        this.state.warnTimer && clearTimeout(this.state.warnTimer);
    }

    showWarn(text) {
        this.setState({showWarn: true, tipText: text});
        this.state.warnTimer = setTimeout(() => {
            this.setState({showWarn: false});
        }, 2000);
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    LeftClick() {
        HistoryManager.pageBack();
    }
    ToBack(){
        location.href = '/weixin'
    }

    render() {
        return (
            <div  id="scrollDiv"  style={{width: "100%", height: "100%"}}>
                <div className="wuyi">
                    <img src="/assets/images/wuyiActive/wyactivebg.png" width={bgWidth} />
                    <div className="wuyiActive">
                        <div style={{height:"35rem"}}>.</div>
                        <div className="wuyims">
                            <div className="title">. . . <span>秒杀专场</span> . . . </div>
                            <div className="ms_content">
                                <ul>
                                    <li>
                                        <a  target="_blank" href="http://www.jinshang9.com/weixin/ActivityDetail?id=110&type=紧固件"><img src="/assets/images/wuyiActive/ms1.png" /></a>
                                    </li>
                                    <li>
                                        <a target="_blank"  href="http://www.jinshang9.com/weixin/ActivityDetail?id=119&type=紧固件"><img src="/assets/images/wuyiActive/ms2.png" /></a>
                                    </li>
                                    <li>
                                        <a  target="_blank" href="http://www.jinshang9.com/weixin/ActivityDetail?id=111&type=紧固件"><img src="/assets/images/wuyiActive/ms3.png" /></a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="wuyicx">
                            <div className="title ">. . . <span>促销专场</span> . . . </div>
                            <div className="cx_content">
                                <a target="_blank" href="http://www.jinshang9.com/weixin/ActivityDetail?id=113&type=紧固件"><img src="/assets/images/wuyiActive/cx1.png" alt=""/></a>
                                <a target="_blank" href="http://www.jinshang9.com/weixin/ActivityDetail?id=112&type=紧固件"><img src="/assets/images/wuyiActive/cx2.png" alt=""/></a>
                            </div>
                        </div>
                        <div className="wuyitj">
                            <div className="shopsale">
                                <div className="left"><h2>SHOP SALE</h2><p>人气推荐</p></div>
                                <div className="right"><a href="http://www.jinshang9.com/weixin/ActivitiesShop">更多商品 ></a></div>
                            </div>
                            <div className="tj_content">
                                <div>
                                    <a target="_blank"  href="http://www.jinshang9.com/weixin/ActivityDetail?id=121&type=紧固件">
                                        <img src="/assets/images/wuyiActive/tj1.png" alt="" />
                                    </a>
                                    <a target="_blank" href="http://www.jinshang9.com/weixin/ActivityDetail?id=115&type=紧固件">
                                        <img src="/assets/images/wuyiActive/tj2.png" alt="" />
                                    </a>
                                </div>
                                <div>
                                    <a target="_blank"  href="http://www.jinshang9.com/weixin/ActivityDetail?id=116&type=紧固件">
                                        <img src="/assets/images/wuyiActive/tj3.png" alt="" />
                                    </a>
                                    <a target="_blank"  href="http://www.jinshang9.com/weixin/ActivityDetail?id=117&type=紧固件">
                                        <img src="/assets/images/wuyiActive/tj4.png" alt="" />
                                    </a>
                                </div>
                                <div>
                                    <a target="_blank" href="http://www.jinshang9.com/weixin/ActivityDetail?id=118&type=紧固件">
                                        <img src="/assets/images/wuyiActive/tj5.png" alt="" />
                                    </a>
                                    <a target="_blank" href="http://www.jinshang9.com/weixin/ActivityDetail?id=120&type=紧固件">
                                        <img src="/assets/images/wuyiActive/tj6.png" alt="" />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="backBtn" onClick={this.ToBack}>
                        <h2>返回首页</h2>
                        <p>Go Back</p>
                    </div>
                    </div>
                </div>
            </div>
        )
    }


}
wuyiActice.defaultProps = {
    show: true
};