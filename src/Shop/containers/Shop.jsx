import React, {Component} from 'react';
import Slider from 'react-slick';
import WeUI from 'react-weui';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import Assortment from "../components/Assortment.jsx";
import CategoryItem from "../components/CategoryItem.jsx";

//import styles
import 'weui';
import {CSS} from '../style/shop.css';

const {SearchBar, Input} = WeUI;
let slideImg = {
    width: "100%",
    height: "15rem"
};
let menuStyle = {
    width: "100%",
    // display: "flex",
};
let menuItem = {
    width: "25%",
    display: "inline-block",
    textAlign: "center",
    padding: "0.5rem 0"
};
let menuImg = {
    width: "4.4rem",
    height: "4.4rem",
};
let advertStyle = {
    width: "100%",
    borderBottom: "1rem solid #eee",
    borderTop: "1rem solid #eee"
};
let advertImg = {
    width: "100%",
    height: "7rem",
};
let titleStyle = {
    width: "100%",
    height: "3rem",
    lineHeight: "4rem",
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
let pathHeader='/weixin';
export default class Shop extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.AllCategories = this.AllCategories.bind(this);
        this.ActivityShop = this.ActivityShop.bind(this);
        this.state = {
            searchText: '',
            results: [],
            sliderData: [1, 2, 3],//滑动图列表
            topImg: "",
            topShow: false,
            middleImg: "",
            middleShow: false,
            floorData: [],
            allCategories: [],//总的
            categories: [{name: "螺栓", img: "/assets/images/shop/shop_bolt.png"},
                {name: "螺钉", img: "/assets/images/shop/shop_screw.png"},
                {name: "螺母", img: "/assets/images/shop/shop_nut.png"},
                {name: "垫圈、挡圈", img: "/assets/images/shop/shop_dianquan.png"},
                {name: "螺柱、牙条", img: "/assets/images/shop/shop_luozhu.png"},
                {name: "线材", img: "/assets/images/shop/shop_wire.png"},
                {name: "辅助材料", img: "/assets/images/shop/shop_support.png"},
            ],//首页展示的
            activities: [
                // {name: "ss", imgSrc: "", price: "100", oldPrice: "200"},
                // {name: "ss", imgSrc: "", price: "100", oldPrice: "200"},
                // {name: "ss", imgSrc: "", price: "100", oldPrice: "200"},
                // {name: "ss", imgSrc: "", price: "100", oldPrice: "200"}
            ],//活动
        };
    }


    componentWillMount() {
        this.loadFloors();
        this.loadAdvertisment("微信端轮播图广告位", 6);
        // this.loadAdvertisment("顶部广告位", 1);
        // this.loadAdvertisment("中部广告位", 1);
        this.getProductCategories();
        // this.loadActivities();
    }

    componentDidMount() {
        // document.getElementById("shop").style.height=document.getElementById("others").scrollHeight+"px";
        // console.log(document.getElementById("shop").style.height)
    }

    handleChange(text, e) {
        let keywords = [text];
        let results = [];

        if (results.length > 3) results = results.slice(0, 3);
        this.setState({
            results,
            searchText: text,
        });
    }

    loadFloors() {
        let self = this;
        let fromData = new FormData();
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/front/index/listFloor", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                // self.showSuccess();
                self.setState({floorData: json.data.floorList});
            } else {
                // self.showWarn("信息获取失败");
                console.log(json.message)
            }
        }).catch(e => {
            console.log("网络出现了点问题：" + e);
            // self.showWarn("网络出现了点问题");
        });
    }

    loadAdvertisment(position, count) {
        let self = this;
        let fromData = new FormData();
        fromData.append("position", position);
        fromData.append("count", count);
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/front/adt", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                // self.showSuccess();
                if (position === "微信端轮播图广告位") {
                    console.log( "微信端轮播图广告位");
                    console.log(json.data);
                    self.setState({sliderData: json.data});
                } else if (position === "顶部广告位") {
                    self.setState({topImg: json.data[0].imgs ? json.data[0].imgs : "", topShow: json.show});
                } else if (position === "中部广告位") {
                    self.setState({middleImg: json.data[0].imgs ? json.data[0].imgs : "", middleShow: json.show});
                }

            } else {
                // self.showWarn("信息获取失败");
                console.log(json.message)
            }
        }).catch(e => {
            console.log("网络出现了点问题：" + e);
            // self.showWarn("网络出现了点问题");
        });
    }

    loadActivities() {
        let self = this;
        let fromData = new FormData();
        fromData.append("pageNo", 1);
        fromData.append("pageSize", 5);
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/front/activity/limittime/list", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                // self.showSuccess();
                self.setState({activities: json.data.pageInfo.list});

            } else {
                // self.showWarn("信息获取失败");
                console.log(json.message)
            }
        }).catch(e => {
            console.log("网络出现了点问题：" + e);
            // self.showWarn("网络出现了点问题");
        });

    }

    getProductCategories() {
        let self = this;
        let fromData = new FormData();
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/common/getProductCategories", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                // self.showSuccess();
                let list = json.data;
                self.setState({allCategories: list});

            } else {
                // self.showWarn("信息获取失败");
                console.log(json.message)
            }
        }).catch(e => {
            console.log("网络出现了点问题：" + e);
            // self.showWarn("网络出现了点问题");
        });
    }

    CategoryDetail(name) {
        let url = pathHeader+'/CategoryDetail?level1=' + name;
        if(name==="螺栓"||name==="螺母"||name==="螺钉"||name==="垫圈、挡圈"||name==="螺柱、牙条"){
            url = pathHeader+'/SearchProduct?keyword='+name;
        }else if(name==="default"){
            url = pathHeader+'/SearchProduct?keyword='+'default';
        }
        HistoryManager.register(url);
        location.href = url;
    }

    SearchClick() {
        let url = pathHeader+'/SearchProduct';
        HistoryManager.register(url);
        location.href = url;
    }

    AllCategories() {
        let url = pathHeader+'/AllCategories';
        HistoryManager.register(url);
        location.href = url;
    }

    ActivityShop() {
        let url = pathHeader+'/ActivitiesShop';
        HistoryManager.register(url);
        location.href = url;
    }

    BannerClick(url){
        url = url.substr(0,7).toLowerCase() == "http://" ? url : "http://" + url;
        location.href=url;
    }

    render() {
        let settings = {
            dots: true,
            infinite: true,
            autoplay: true,
            speed: 1000,
            slidesToShow: 1,
            slidesToScroll: 1
        };

        let show = {display: "block", width: "100%", height: "100%"};
        if (!this.props.show) {
            show = {display: "none"}
        }
        let top = null, middle = null;
        if (this.state.topShow) {
            top = <div style={advertStyle}>
                <img style={advertImg} src={process.env.IMAGE_PRIFIX + this.state.topImg}/>
            </div>;
        }
        if (this.state.middleShow) {
            middle = <div style={advertStyle}>
                <img style={advertImg} src={process.env.IMAGE_PRIFIX + this.state.middleImg}/>
            </div>;
        }
        return (
            <div id="shop" style={show}>
                {/*<SearchBar*/}
                {/*onChange={this.handleChange}*/}
                {/*defaultValue={this.state.searchText}*/}
                {/*placeholder="Female Name Search"*/}
                {/*lang={{*/}
                {/*cancel: 'Cancel'*/}
                {/*}}*/}
                {/*/>*/}
                <div className="searchBar" onClick={this.SearchClick}>
                    <img className="searchIcon" src="/assets/images/shop/shop_icon_search.png"/>
                    {/*<input type="button" className="searchInput" />*/}
                </div>
                <div style={{width: "100%", height: "15rem", overflow: "hidden", marginBottom: "1rem"}}>
                    <Slider {...settings}>
                        {
                            (this.state.sliderData || []).map((item, i) =>
                                <img style={slideImg} className="apply_icon" key={i} onClick={this.BannerClick.bind(this,item.url)}
                                     src={process.env.IMAGE_PRIFIX + item.imgs}/>
                            )
                        }
                    </Slider>
                </div>
                <div style={menuStyle}>
                    {/*<div style={menuItem} onClick={this.CategoryDetail.bind(this, 'default')}><img style={menuImg}*/}
                                                                          {/*src="/assets/images/shop/shop_fastener.png"/>*/}
                        {/*<p>紧固件</p></div>*/}
                    {
                        this.state.categories.map((item, i) =>
                            <div key={i} style={menuItem} onClick={this.CategoryDetail.bind(this, item.name)}>
                                <img style={menuImg} src={item.img}/><p>{item.name}</p>
                            </div>
                        )
                    }
                    <div style={menuItem} onClick={this.AllCategories}><img style={menuImg}
                                                                            src="/assets/images/shop/shop_all.png"/>
                        <p>全部</p></div>
                </div>
                {top}
                <div className="activities" onClick={this.ActivityShop}>
                    <div style={titleStyle}>
                        <div style={redIcon}></div>
                        活动专区
                    </div>
                    <div style={{marginTop: "1rem"}}>
                        <img style={{width: "100%"}} src="/assets/images/shop/shop_activity.png"/>
                    </div>
                </div>
                {middle}
                <div id="others">
                    {
                        this.state.floorData.map((item, i) =>
                            <Assortment key={i} id={item.id} titleName={item.floorsubname}
                                        data={item.floorProds}/>
                        )
                    }
                </div>
            </div>
        )
    }


}
Shop.defaultProps = {
    show: true
};