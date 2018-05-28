import React, {Component} from 'react';
import MyCollectionsItem from '../components/MyCollectionsItem.jsx';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import Loading from '../../Common/Loading/Loading.jsx';

let bgStyle = {
    width: "100%",
    minHeight: "100%",
    background: "#F5F5F5",
    fontSize: "1.4rem"
};
let bottomStyle = {
    position: "absolute",
    width: "100%",
    height: "5rem",
    lineHeight: "5rem",
    bottom: "0",
    fontSize: "1.4rem",
    background: "white"
};
let checkAll = {
    width: "2rem",
    height: "2rem",
    margin: "0 1rem",
    verticalAlign: "middle"
};
let deleteBtn = {
    display: "inline-block",
    width: "20%",
    background: "red",
    color: "white",
    textAlign: "center"
};let pathHeader='/weixin';
export default class MyCollection extends Component {
    constructor(props) {
        super(props);
        this.CheckClick = this.CheckClick.bind(this);
        this.LeftClick = this.LeftClick.bind(this);
        this.RightClick = this.RightClick.bind(this);
        this.DeleteClick = this.DeleteClick.bind(this);
        this.ChooseAll = this.ChooseAll.bind(this);
        this.state = {
            chooseArr: [],
            choose: false,
            chooseAll: false,
            changeTitle: "管理",
            // data: [
            //     {id: 0, name: 1000, price: 1000, number: 1000, check: false},
            //     {id: 1, name: 2000, price: 2000, number: 2000, check: false},
            //     {id: 2, name: 3000, price: 3000, number: 3000, check: false},
            //     {id: 3, name: 4000, price: 3000, number: 3000, check: false},
            //     {id: 4, name: 5000, price: 3000, number: 3000, check: false},
            //     {id: 5, name: 6000, price: 3000, number: 3000, check: false},
            //     {id: 6, name: 7000, price: 3000, number: 3000, check: false},
            //     {id: 7, name: 7000, price: 3000, number: 3000, check: false},
            //     {id: 8, name: 7000, price: 3000, number: 3000, check: false},
            //     {id: 9, name: 7000, price: 3000, number: 3000, check: false}
            // ],
            dataList: [],
            isLoading: true,
            noneText: "暂无收藏",
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


    componentWillMount() {
        this.loadData();
    }

    componentDidMount() {
    }

    loadData() {
        let self = this;
        let fromData = new FormData();
        fromData.append("pageNo", 1);
        fromData.append("pageSize", 10);
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/favorite/list", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                let list = json.data.pageInfo.list;
                for (let i = 0; i < list.length; i++) {
                    list[i].check = false;
                }
                self.setState({
                    dataList: list,
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

    CheckClick(state, id, i) {
        let dataList = this.state.dataList;
        dataList[i].check = state;
        let list = this.state.chooseArr;
        if (state) {//checked
            list.push(id);
        } else {
            let index = list.indexOf(id);
            list.splice(index, 1);
        }
        console.log(list);
        if (list.length === this.state.dataList.length) {
            this.setState({dataList: dataList, chooseArr: list, chooseAll: true,});
        } else {
            this.setState({dataList: dataList, chooseArr: list});
        }

    }

    LeftClick() {
        HistoryManager.pageBack();
    }

    RightClick() {
        let change = !this.state.choose;
        let title = "管理";
        let list = this.state.dataList;
        if (change) {
            title = "完成";
            for (let i = 0; i < list.length; i++) {
                list[i].check = false;
            }
        }
        this.setState({
            choose: change,
            changeTitle: title,
            dataList: list,
            chooseArr: [],
        })
    }

    DeleteClick() {
        // let oldList = this.state.dataList;
        // let newList = [];
        // for (let i = 0; i < oldList.length; i++) {
        //     let index = this.state.chooseArr.indexOf(oldList[i].id);
        //     if (index < 0) {//-1
        //         newList.push(oldList[i]);
        //     }
        // }
        // this.setState({dataList: newList,chooseArr:[]});
        let self = this;
        let fromData = new FormData();
        fromData.append("pIds", self.state.chooseArr.join(','));
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/favorite/batch/delete", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                self.setState({dataList: [],chooseArr:[],choose:false});
                self.loadData();
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

    ChooseAll() {//
        let list = this.state.dataList;
        let chooseArr = [];
        let current = this.state.chooseAll;
        let newState = !current;
        if (newState) {
            for (let i = 0; i < list.length; i++) {
                list[i].check = newState;
                chooseArr.push(list[i].id);
            }
        } else {
            for (let i = 0; i < list.length; i++) {
                list[i].check = newState;
            }
        }

        this.setState({chooseAll: newState, chooseArr: chooseArr, dataList: list});

    }

    render() {
        let imgSrc = "/assets/images/userCenter/user_collection_none.png";
        if (this.state.chooseArr.length === this.state.dataList.length) {
            imgSrc = "/assets/images/userCenter/user_collection_all.png";
        }
        let boot = 0;
        let bootDiv = null;
        if (this.state.choose) {
            boot = 5;
            bootDiv = <div style={bottomStyle}>
                <div style={{display: "inline-block", width: "80%"}}>
                    <img style={checkAll} src={imgSrc} onClick={this.ChooseAll}/>
                    <span style={{verticalAlign: "middle"}}>全选</span>
                </div>
                <div style={deleteBtn} onClick={this.DeleteClick}>
                    删除
                </div>
            </div>;
        }
        let height = document.body.clientHeight * 37.5 / document.body.clientWidth - (4.4 + boot);
        let heightVal = height + "rem";
        return (
            <div style={bgStyle}>
                <NavigationBar Title="收藏夹" LeftBar="true" LeftTitle="返回" RightBar="true" RightClick={this.RightClick}
                               RightTitle={this.state.changeTitle}
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                <div style={{width: "100%", height: heightVal, overflow: "auto"}}>
                    {
                        this.state.dataList.map((item, i) =>
                            <MyCollectionsItem key={i} index={i} id={item.id} data={item}
                                               chooseReady={this.state.choose} callback={this.CheckClick}
                                               check={item.check}/>
                        )
                    }
                    <Loading show={this.state.isLoading} length={this.state.dataList.length}
                             text={this.state.noneText}/>
                </div>
                {bootDiv}
            </div>
        )
    }


}