import React, {Component} from 'react';
import WeUI from 'react-weui';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import ActivityItem from "../components/ActivityItem.jsx";
import Loading from '../../Common/Loading/Loading.jsx';
//import styles
import 'weui';
import {CSS} from '../style/shop.css';

const {
    Toptips,
    ActionSheet
} = WeUI;
let tillLoad = true;
let defaultItem = {
    display: "inline-block",
    borderBottom: "2px solid white",
    width: "5rem",
    textAlign: "center",
    height: "2.5rem",
    lineHeight: "2.5rem"
};
let selectItem = {
    display: "inline-block",
    borderBottom: "2px solid red",
    width: "5rem",
    textAlign: "center",
    height: "2.5rem",
    lineHeight: "2.5rem"
};
let pathHeader='/weixin';
export default class ActivitiesShop extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.RightClick = this.RightClick.bind(this);
        this.OnScroll = this.OnScroll.bind(this);
        this.state = {
            pageNo: 1,
            pageSize: 8,
            categoryList: [{id: 0, name: "全部"}],
            activitycateid: 0,
            dataList: [],
            rightText: "全部",
            rightState: 0,
            menu_show: false,
            menus: [{
                label: '全部',
                onClick: () => {
                    this.setState({rightState: 0, rightText: "全部", menu_show: false,dataList:[]});
                    this.loadData(1,0);
                }
            }, {
                label: '进行中',
                onClick: () => {
                    this.setState({rightState: 4, rightText: "进行中", menu_show: false,dataList:[]});
                    this.loadData(1,4);
                }
            }, {
                label: '预热中',
                onClick: () => {
                    this.setState({rightState: 9, rightText: "预热中", menu_show: false,dataList:[]});
                    this.loadData(1,9);
                }
            }],
            actions: [
                {
                    label: '取消',
                    onClick: this.hide.bind(this)
                }
            ],
            isLoading: true,
            noneText: "暂无活动",
            showWarn: false,
            warnTimer: null,
            tipText: "",
        };
        this.state.warnTimer && clearTimeout(this.state.warnTimer);
    }

    showWarn(text) {
        this.setState({showWarn: true, tipText: text});

        this.state.warnTimer = setTimeout(() => {
            this.setState({showWarn: false});
        }, 2000);
    }

    hide() {
        this.setState({
            menu_show: false,
        });
    }

    componentWillMount() {
        this.loadCategory();
        this.loadData(1,0);
    }

    componentDidMount() {
    }

    loadCategory() {
        let self = this;
        self.setState({
            isLoading: true
        });
        let fromData = new FormData();
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/front/activity/limittime/listCategory", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                let list = self.state.categoryList;
                for (let i = 0; i < json.data.length; i++) {
                    list.push(json.data[i]);
                }
                self.setState({
                    categoryList: list,
                    isLoading: false
                });
            } else if (json.result === 2) {//登录失效
                HistoryManager.register(pathHeader+'/Login');
                location.href = pathHeader+'/Login';
            } else {
                self.showWarn(json.message);
                console.log(json.message)
            }
        }).catch(e => {
            console.log("网络出现了点问题：" + e);
            self.showWarn("网络出现了点问题");
        });
    }

    loadData(pageNo,rightState) {
        let self = this;
        self.setState({
            isLoading: true
        });
        let fromData = new FormData();
        fromData.append("pageNo", pageNo);
        fromData.append("pageSize", self.state.pageSize);
        fromData.append("activitycateid", self.state.activitycateid);
        fromData.append("state", rightState);
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/front/activity/limittime/list", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                tillLoad = true;
                self.setState({
                    dataList: json.data.pageInfo.list ? self.state.dataList.concat(json.data.pageInfo.list) : self.state.dataList,
                    pageNo: pageNo,
                    isLoading: false
                });
            } else if (json.result === 2) {//登录失效
                HistoryManager.register(pathHeader+'/Login');
                location.href = pathHeader+'/Login';
            } else {
                self.showWarn(json.message);
                console.log(json.message)
            }
        }).catch(e => {
            console.log("网络出现了点问题：" + e);
            self.showWarn("网络出现了点问题");
        });
    }

    LeftClick() {
        HistoryManager.pageBack();
    }

    RightClick() {
        this.setState({menu_show: true})
    }

    SelectClick(id) {
        this.setState({activitycateid: id,dataList:[]});
        let self = this;
        setTimeout(function () {
            self.loadData(1,self.state.rightState);
        }, 100)

    }

    OnScroll() {
        let screenHeight = window.screen.height;
        let self = this;
        console.log(document.getElementById("scrollDiv").scrollTop, screenHeight, document.getElementById("scrollDiv").scrollHeight);
        if (document.getElementById("scrollDiv").scrollTop + screenHeight + 200 >= document.getElementById("scrollDiv").scrollHeight && tillLoad) {
            tillLoad = false;
            let pageNo=self.state.pageNo+1;
            // this.setState({pageNo:pageNo});
            setTimeout(function () {
                self.loadData(pageNo,self.state.rightState);
            }, 1000)
        }
    }

    render() {
        let navHeight = 4.4, topHeight = 2.5;
        let height = document.body.clientHeight * 37.5 / document.body.clientWidth - (topHeight + navHeight);
        let heightValue = height + "rem";
        return (
            <div>
                <NavigationBar Title="活动专区" LeftBar="true" LeftTitle="返回" RightBar="true"
                               RightTitle={this.state.rightText}
                               RightClick={this.RightClick}
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}
                />
                <div style={{width: "100%", background: "white"}}>
                    {this.state.categoryList.map((item, i) =>
                        <div key={i} style={this.state.activitycateid === item.id ? selectItem : defaultItem}
                             onClick={this.SelectClick.bind(this, item.id)}>{item.name}</div>
                    )}
                </div>
                <div id="scrollDiv" onScroll={this.OnScroll}
                     style={{width: "100%", height: heightValue, paddingTop: "1rem", overflowY: "scroll"}}>
                    <Loading show={this.state.isLoading} length={this.state.dataList.length}
                             text={this.state.noneText}/>
                    {this.state.dataList.map((item, i) =>
                        <ActivityItem key={i} data={item}/>
                    )}
                </div>
                <ActionSheet
                    menus={this.state.menus}
                    actions={this.state.actions}
                    show={this.state.menu_show}
                    type="ios"
                    onRequestClose={e => this.setState({menu_show: false})}/>
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
            </div>
        )
    }
}