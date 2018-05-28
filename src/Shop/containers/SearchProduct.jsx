import React, {Component} from 'react';
import SearchListItem from '../components/SearchListItem.jsx';
import Loading from '../../Common/Loading/Loading.jsx';
import WeUI from 'react-weui';
//import styles
import 'weui';
import {CSS} from '../style/shop.css';

const {Cells, Toptips, InfiniteLoader} = WeUI;
let iconStyle = {
    width: "1rem",
    height: "1rem",
    marginLeft: "1rem"
};
let spanStyle = {
    margin: "0 1rem"
};
let searchInput = {
    width: "27rem",
    // height: "1.4rem",
    fontSize: "1.4rem",
    marginTop: "0.5rem",
    padding: "0 1rem",
    background: "transparent",
    border: "none",
    outline: "none"
};
let tillLoad = true;//加载更多的判断，只加载一次
let oldlist=[];//存储分离后的一级，二级。。。等属性
let otherattr=[];//一级分类，二级分类，。三级分类，品牌，品名的集合
let searchJson=[];///其他属性组合起来的集合字段
    let sortType=0;// 0=按规格升序，1=按规格降序
    let selfSupport=0;//0=全部，1=自营
    let haveStore=0;//0=全部，1=有库存
    let forwardTime=0;//0=全部，1=有远期
export default class SearchProduct extends Component {
    constructor(props) {
        super(props);
        this.SearchClick = this.SearchClick.bind(this);
        this.OnScroll = this.OnScroll.bind(this);
        this.MoreClick = this.MoreClick.bind(this);
        this.HideMore = this.HideMore.bind(this);
        this.LeftClick = this.LeftClick.bind(this);
        this.KeywordChange = this.KeywordChange.bind(this);
        this.ClearKeys = this.ClearKeys.bind(this);
        this.SaveKeys = this.SaveKeys.bind(this);
        this.SortClick = this.SortClick.bind(this);
        this.SupportClick = this.SupportClick.bind(this);
        this.StoreClick = this.StoreClick.bind(this);
        this.LongTermClick = this.LongTermClick.bind(this);
        this.state = {
            keyword: this.props.location.query.keyword,
            rate: null,
            showMore: false,
            selectIndex: 0,
            selectArr: [
                {
                    name: "规格",
                    flex: false,
                    select: -1,
                    list: ["升序", "降序"]
                }],
            selectKeys: [],//点击选择的集合
            keyValues: [],//页面显示的属性集合
            dataList: [],
            pageNo: 1,
            pageSize: 10,
            isLoading: false,
            noneText: "暂无信息",
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
        this.loadRate();
        if(this.state.keyword){
            this.loadData(1);
        }else if(this.state.keyword==="default"){
            this.loadData(1);
        }

    }

    componentDidMount() {

    }


    OnScroll() {
        let screenHeight = window.screen.height;
        let self = this;
        if (document.getElementById("scrollDiv").scrollTop + screenHeight + 200 >= document.getElementById("scrollDiv").scrollHeight && tillLoad) {
            tillLoad = false;
            let pageNo=self.state.pageNo+1;
            // self.setState({pageNo:pageNo});
            setTimeout(function () {
                self.loadData(pageNo);
            }, 1000)
        }
    }

    loadData(pageNo) {
        let self = this;
        self.setState({isLoading: true});
        let fromData = new FormData();
        fromData.append("pageNo", pageNo);
        fromData.append("pageSize", self.state.pageSize);
        fromData.append("searchKey", self.state.keyword ? self.state.keyword : "");
        fromData.append("level1", otherattr.level1? otherattr.level1 : "");
        fromData.append("level2", otherattr.level2? otherattr.level2: "");
        fromData.append("level3", otherattr.level3? otherattr.level3: "");
        fromData.append("productname", otherattr.productname?  otherattr.productname: "");
        fromData.append("brand", otherattr.brand? otherattr.brand: "");
        fromData.append("surfacetreatment", otherattr.surfacetreatment? otherattr.surfacetreatment: "");
        fromData.append("storename", otherattr.storename? otherattr.storename: "");
        fromData.append("cardnum", otherattr.cardnum? otherattr.cardnum: "");
        fromData.append("material", otherattr.material? otherattr.material: "");
        fromData.append("searchJson", JSON.stringify(searchJson));
        fromData.append("sorttype",sortType);
        fromData.append("selfsupport",selfSupport);
        fromData.append("havestore",haveStore);
        fromData.append("forwardtime",forwardTime);
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/front/product/list", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                tillLoad = true;
                //吧之前分离的属性。，放回去，才能正确显示样式
                let before=[];
                before=self.state.selectKeys.concat(oldlist);
                self.setState({
                    keyValues: json.data.keyValues.length>0 ? json.data.keyValues : self.state.keyValues,
                    dataList: json.data.pageInfo.list&&json.data.pageInfo.list.length>0 ? self.state.dataList.concat(json.data.pageInfo.list) : self.state.dataList,
                    pageNo: pageNo,
                    isLoading: false,
                    selectKeys:before
                });
            } else {
                self.showWarn(json.message);
                console.log(json.message)
            }
        }).catch(e => {
            console.log("网络出现了点问题：" + e);
            self.showWarn("网络出现了点问题");
        });
    }

    loadRate() {//获取定金比率
        let self = this;
        let fromData = new FormData();
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/transaction/loadAllTransactionSetting", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                self.setState({
                    rate: json.data.transactionSettings.remotepurchasingmargin
                });
            } else {
                self.showWarn(json.message);
                console.log(json.message)
            }
        }).catch(e => {
            console.log("网络出现了点问题：" + e);
            self.showWarn("网络出现了点问题");
        });
    }

    SelectClick(index) {
        // let list = this.state.selectArr;
        // for (let i = 0; i < list.length; i++) {
        //     if (index === i) {
        //         list[i].flex = !list[i].flex;
        //     } else {
        //         list[i].flex = false;
        //     }
        //
        // }
        // this.setState({
        //     selectIndex: index,
        //     selectArr: list
        // })
    }

    SortClick() {//排序
        if (sortType === 0) {
            sortType = 1
        } else {
            sortType = 0
        }
        this.setState({dataList: [], isLoading: true});
        this.loadData(1);
    }

    SupportClick() {//自营
        if (selfSupport === 0) {
            selfSupport=1;
        } else {
            selfSupport=0;
        }
        this.setState({dataList: [], isLoading: true});
        this.loadData(1);
    }

    StoreClick() {//库存
        if (haveStore === 0) {
            haveStore =1;
        } else {
            haveStore =0;
        }
        this.setState({dataList: [], isLoading: true});
        this.loadData(1);
    }

    LongTermClick() {//远期
        if (forwardTime === 0) {
            forwardTime= 1;
        } else {
            forwardTime= 0;
        }
        this.setState({dataList: [], isLoading: true});
        this.loadData(1);
    }

    CloseClick() {
        let list = this.state.selectArr;
        list[this.state.selectIndex].flex = false;
        this.setState({
            selectArr: list
        });
    }

    ItemClick(i) {
        let list = this.state.selectArr;
        list[this.state.selectIndex].select = i;
        this.setState({
            selectArr: list
        });
    }

    MoreClick() {//更多
        this.setState({showMore: true});
    }

    HideMore() {
        this.setState({showMore: false});
    }

    LeftClick() {
        HistoryManager.pageBack();
    }

    KeywordChange(e) {
        this.setState({keyword: e.target.value});
    }

    SearchClick() {
        // localStorage.setItem('keyword', this.state.keyword);
        this.setState({pageNo: 1, dataList: []});
        this.loadData(1);
    }
    //属性是否点击的判断
    CheckKey(key, val) {//判断关键字[key,value]
        let list = this.state.selectKeys;
        let have = false;
        for (let i = 0; i < list.length; i++) {
            if (list[i].attr === key && list[i].value === val) {
                have = true;
                break;
            }
        }
        return have;
    }
    //点击属性
    KeyClick(key, val) {
        let list = this.state.selectKeys;
        let item = {"attr": key, "value": val};
        if (this.CheckKey(key, val)) {//已经选择了
            for (let i = 0; i < list.length; i++) {
                if (list[i].attr === key && list[i].value === val) {
                    list.splice(i, 1);
                    break;
                }
            }
        } else {
            //重复的选项点击---替换掉
            let num=0;
            for (let i = 0; i < list.length; i++) {
                if (list[i].attr === key) {
                    list.splice(i, 1);
                    list.push(item);
                    break;
                }else{
                    num++;
                }
            }
            if(num===list.length){
                list.push(item);
            }
        }
        console.log(list);
        this.setState({selectKeys: list,});
    }

    ClearKeys() {//清空筛选条件
        otherattr=[];
        this.setState({selectKeys: [],
        });
    }

    SaveKeys() {//保存筛选条件
        oldlist=[];
        this.HideMore();
        this.setState({pageNo: 1, dataList: []});
        //一级分类，二级分类，三级分类，品牌等是拼接在一起的属性；在这个位置进行分离，再调用接口
        let matchattr=[
            {key:"level1",name:"大类",value:""},
            {key:"level2",name:"分类",value:""},
            {key:"level3",name:"标准",value:""},
            {key:"productname",name:"品名",value:""},
            {key:"brand",name:"品牌",value:""},
            {key:"surfacetreatment",name:"表面处理",value:""},
            {key:"storename",name:"仓库",value:""},
            {key:"cardnum",name:"牌号",value:""},
            {key:"material",name:"材质",value:""},
        ];
        let group=[];
        otherattr=[];
        let baseList=[];//等同于selectkey的；用来做分离
        baseList=this.state.selectKeys;
        for(let x=0;x<matchattr.length;x++){
            for(let i=0;i<baseList.length;i++) {
                if(baseList[i].attr===matchattr[x].key){
                    matchattr[x].value=baseList[i].value;
                    group[matchattr[x].key]=matchattr[x].value;
                    oldlist.push(baseList[i]);//存起来，接口掉完数据之后放回页面中
                    baseList.splice(i,1);//去除掉以后要单独给后台的属性的剩余
                }
            }
        }
        otherattr=group;
        searchJson=baseList;
        this.loadData(1);
    }

    render() {
        let navHeight = 8;
        let height = document.body.clientHeight * 37.5 / document.body.clientWidth - navHeight;
        let heightValue = height + "rem";
        return (
            <div>
                <div>
                    <img style={{width: "1rem", height: "1.8rem", marginLeft: "1rem", verticalAlign: "middle"}}
                         src="/assets/images/common/nav_back_icon.png" onClick={this.LeftClick}/>
                    <div style={{display: "inline-block", verticalAlign: "middle"}}>
                        <div className="searchBar">
                            {/*<img className="searchIcon" src="/assets/images/shop/shop_icon_search.png"/>*/}
                            <input type="text" style={searchInput}
                                   value={this.state.keyword}
                                   onChange={this.KeywordChange}/>
                        </div>
                    </div>
                    <img style={{width: "2rem", height: "2rem", verticalAlign: "middle"}}
                         src="/assets/images/shop/shop_icon_search.png" onClick={this.SearchClick}/>
                </div>
                <div style={{borderBottom: "1px solid #f2f2f2", padding: "0.5rem 0",}}>
                        <span style={spanStyle} onClick={this.SortClick}>规格
                            <img style={iconStyle}
                                 src={sortType ? "/assets/images/common/select_arrow_up.png" : "/assets/images/common/select_arrow_down.png"}/>
                            </span>
                    <span className={selfSupport === 1 ? "search_item_select" : "search_item"}
                          onClick={this.SupportClick}>自营店</span>
                    <span className={haveStore === 1 ? "search_item_select" : "search_item"}
                          onClick={this.StoreClick}>有库存</span>
                    <span className={forwardTime === 1 ? "search_item_select" : "search_item"}
                          onClick={this.LongTermClick}>可预订</span>
                    <span style={{margin: "0 1rem", float: "right"}} onClick={this.MoreClick}>更多
                            <img style={{width: "0.5rem", height: "0.8rem", marginLeft: "0.5rem"}}
                                 src="/assets/images/common/select_arrow_right.png"/></span>
                </div>
                <div id="scrollDiv"
                     style={{fontSize: "1.2rem", height: heightValue, overflow: "scroll", background: "white"}}
                     onScroll={this.OnScroll}>
                    <Loading show={this.state.isLoading} length={this.state.dataList.length}
                             text={this.state.noneText}/>
                    <div style={this.state.dataList.length > 0 ? {borderBottom: "0.5rem solid #f2f2f2"} : {}}>
                        {
                            this.state.dataList.map((item, i) =>
                                <SearchListItem key={i} id={item.id} data={item} rate={this.state.rate}/>
                            )
                        }
                    </div>
                </div>
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>

                <div style={this.state.showMore ? {display: "block"} : {display: "none"}}>
                    {/*<div className="more_bg">*/}
                    <div className="more_null" onClick={this.HideMore}></div>
                    <div className="more_content">
                        <div className="more_padding">
                            {this.state.keyValues.map((item, i) =>
                                <div key={i}>
                                    <div className="more_title">{item.name}</div>
                                    <ul className="more_list">
                                        {
                                            item.value.map((val, index) =>
                                                <li className={this.CheckKey(item.key, val) ? "more_item_select" : "more_item"}
                                                    key={index}
                                                    onClick={this.KeyClick.bind(this, item.key, val)}>{val}</li>
                                            )
                                        }
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div className="more_bottom">
                            <div className="yellowBtn" onClick={this.ClearKeys}>重置</div>
                            <div className="redBtn" onClick={this.SaveKeys}>确定</div>
                        </div>
                    </div>
                </div>
                {/*</div>*/}
            </div>
        )
    }


}