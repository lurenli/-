import React, {Component} from 'react';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import Loading from '../../Common/Loading/Loading.jsx';
import {formatDate} from '../../../assets/js/common.js';

let imgStyle = {
    width: "5rem",
    height: "5rem",
    margin: "1rem",
    verticalAlign: "top"
};
let leftStyle = {
    width: "7rem",
    display: "inline-block",

};
let rightStyle = {
    width: "30.5rem",
    display: "inline-block",
};
let textStyle = {
    height: "5rem",
    margin: "1rem"
};
let dateStyle = {
    paddingRight: "1rem",
    textAlign: "right"
};
let nameStyle = {
    textAlign: "center",
    marginBottom: "0.5rem"
};let pathHeader='/weixin';
export default class EvaluationList extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.OnScroll = this.OnScroll.bind(this);
        this.state = {
            id: this.props.location.query.id,
            dataList: [],
            pageNo: 1,
            pageSize: 10,
            isLoading: true,
            noneText: "暂无信息",
        }
    }


    componentWillMount() {
        this.loadData();
    }

    componentDidMount() {
    }

    loadData() {
        let self = this;
        self.setState({isLoading: true});
        let fromData = new FormData();
        fromData.append("pdid", self.state.id);
        fromData.append("pageNo", self.state.pageNo);
        fromData.append("pageSize", self.state.pageSize);
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/orders/getSingleProductEvaList", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                self.setState({
                    dataList: json.data.pageInfo.list ? self.state.dataList.concat(json.data.pageInfo.list) : self.state.dataList,
                    pageNo: self.state.pageNo++,
                    isLoading: false
                });
            } else if (json.result === 2) {//登录失效
                HistoryManager.register(pathHeader+'/Login');
                location.href = pathHeader+'/Login';
            } else {
                // self.showWarn("信息获取失败");
                console.log(json.message)
            }
        }).catch(e => {
            console.log("网络出现了点问题：" + e);
            // self.showWarn("网络出现了点问题");
        });
    }

    //时间转换
    upTime(value) {
        if (!value) {
            return ''
        } else {
            let date = new Date(value);
            return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
        }
    }

    LeftClick() {
        HistoryManager.pageBack();
    }

    OnScroll() {
        let screenHeight = window.screen.height;
        let self = this;
        if (document.getElementById("scrollDiv").scrollTop + screenHeight + 200 >= document.getElementById("scrollDiv").scrollHeight) {
            setTimeout(function () {
                self.loadData();
            }, 1000)
        }
    }

    render() {
        let navHeight = 4.4;
        let height = document.body.clientHeight * 37.5 / document.body.clientWidth - navHeight;
        let heightValue = height + "rem";
        return (
            <div>
                <NavigationBar Title="全部评价" LeftBar="true" LeftTitle="返回"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                <div id="scrollDiv" style={{height: heightValue, paddingBottom: "0", overflowY: "scroll"}}
                     onScroll={this.OnScroll}>
                    <div>
                        {
                            this.state.dataList.map((item, i) =>
                                <div key={i} style={{borderBottom: "1px solid #eee"}}>
                                    <div style={leftStyle}>
                                        {item.isanonymous === 2 ?
                                            <div>
                                                <img style={imgStyle}
                                                     src="/assets/images/common/icon_user_default.png"/>
                                                <div style={nameStyle}>匿名评价</div>
                                            </div> : <div>
                                                <img style={imgStyle}
                                                     src={item.favicon ? process.env.IMAGE_PRIFIX  + item.favicon : "/assets/images/common/icon_user_default.png"}/>
                                                <div style={nameStyle}>{item.username}</div>
                                            </div>
                                        }
                                    </div>
                                    <div style={rightStyle}>
                                        <div>
                                            <div style={textStyle}>{item.buyersexperience}</div>
                                            <div style={dateStyle}>{this.upTime(item.evatime)}</div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }


                    </div>
                    <Loading show={this.state.isLoading} length={this.state.dataList.length}
                             text={this.state.noneText}/>
                </div>
            </div>
        )
    }


}