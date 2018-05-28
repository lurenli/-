import React, {Component} from 'react';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import Slider from 'react-slick';
import WeUI from 'react-weui';

import {CSS} from '../style/shop.css';

const {Popup, Toptips, Select} = WeUI;
let slideDiv = {
    width: "100%",
    height: "25rem",
    overflow: "hidden",
    // marginBottom: "1rem"
};
let slideImg = {
    width: "100%",
    height: "25rem"
};
let contentStyle = {
    width: "100%",
    position: "absolute",
    top: "4.4rem",
    bottom: "6rem",
    overflowY: "scroll"
};
let bottomStyle = {
    position: "absolute",
    width: "100%",
    height: "6rem",
    lineHeight: "6rem",
    bottom: "0",
    fontSize: "1.6rem",
    textAlign: "center"
};
let addBtn = {
    display: "inline-block",
    width: "10rem",
    height: "6rem",
    background: "#E86800",
    color: "white"
};
let buyBtn = {
    display: "inline-block",
    width: "10rem",
    height: "6rem",
    background: "#E8000E",
    color: "white"
};
let popupAddBtn = {
    background: "#E86800",
    display: "inline-block",
    width: "50%",
    height: "6rem",
    lineHeight: "6rem",
    color: "white",
    fontSize: "1.4rem",
    textAlign: "center"
};
let popupBuyBtn = {
    background: "#E8000E",
    display: "inline-block",
    width: "50%",
    height: "6rem",
    lineHeight: "6rem",
    color: "white",
    fontSize: "1.4rem",
    textAlign: "center"
};
let leftStyle = {
    width: "35%",
    display: "inline-block",
    verticalAlign: "top"
};
let centerStyle = {
    width: "40%",
    display: "inline-block",
    verticalAlign: "top"
};
let packageStyle = {
    width: "65%",
    display: "inline-block",
    verticalAlign: "top"
};
let rightStyle = {
    width: "25%",
    display: "inline-block",
    verticalAlign: "top"
};
let paddingStyle = {
    padding: "1rem"
};
let selfStyle = {
    width: "3.4rem",
    height: "1.6rem",
    verticalAlign: "middle",
};
let iconStyle = {
    display: "inline-block",
    width: "3.5rem",
    fontSize: "1.4rem",
    textAlign: "center"
};
let imgBtn = {
    width: "2rem",
    height: "1rem",
    padding: "1rem 0.5rem",
    verticalAlign: "middle",
    background: "#f2f2f2",
    marginRight: "0.5rem"
};
let imgBtn_add = {
    width: "2rem",
    height: "2rem",
    padding: "0.5rem 0.5rem",
    verticalAlign: "middle",
    background: "#f2f2f2",
    marginLeft: "0.5rem"
};
let inputStyle = {
    width: "10rem",
    height: "3rem",
    background: "#f2f2f2",
    border: "none",
    outline: "none",
    verticalAlign: "bottom"
};
let cancelBtn = {
    width: "2rem",
    height: "2rem"
};
let unitStyle = {
    height: "3rem",
    lineHeight: "3rem",
    fontSize: "1.2rem",
    padding: "0 1rem",
    borderRadius: "0",
    background: "#f2f2f2",
};
let choosetime = "prodprice";
let pathHeader = '/weixin';
let stop = false;//防止重复提交
export default class ProductDetail extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.RightClick = this.RightClick.bind(this);
        this.LeftClick = this.LeftClick.bind(this);
        this.AddClick = this.AddClick.bind(this);
        this.SubClick = this.SubClick.bind(this);
        this.AddOtherClick = this.AddOtherClick.bind(this);
        this.SubOtherClick = this.SubOtherClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.numChange = this.numChange.bind(this);
        this.unitChange = this.unitChange.bind(this);
        this.AddShopCart = this.AddShopCart.bind(this);
        this.BuyNow = this.BuyNow.bind(this);
        this.showAll = this.showAll.bind(this);
        this.dealOtherData = this.dealOtherData.bind(this);//处理得到非紧固件的显示属性
        // this.clickattr = this.clickattr.bind(this);//点击具体的非紧固件属性
        this.chooseOtherTime = this.chooseOtherTime.bind(this);//非紧固件的时间
        this.state = {
            id: this.props.location.query.id,
            type: this.props.location.query.type,//商品类型
            detailData: {
                productStore: {},
                prices: [],
            },
            pddes: "",//详情
            evalutes: [],//评价
            maxtotal: 0,
            payTime: "立即发货",
            timePrice: "",//根据时间变化的价格
            singlePrice: "",//计算出来的单价
            totalPrice: "",
            num: 0,//购买数量
            unit: "",
            packingList: [{value: "", label: ""}],//单位列表
            sliderData: [],//滑动图列表
            rate: 1,//定金比率
            payType: 0,
            bottom_show: false,
            showWarn: false,
            showSuccess: false,
            warnTimer: null,
            successTimer: null,
            tipText: "",
            //    非紧固件弹出框
            otherData: {},//基础的展示数据
            prodStoreList: [],//有库存的所有商品信息
            publishAttrs: [],//获取的可选的所有的属性
            showAttrs: [],//操作的展示的商品属性
            chooosShop: "",//被选中的商品的信息
            haveShop: false,//属性是否匹配成功商品
            startnum: "",//起订量（最外层的起订量）
            attrstartnum: "",//起订量（不同属性商品的起订量）
            startShowword: "",
            showWord: "",//选择一栏的文字显示
            showstroenum: 1,
            minprice: 1,
            maxprice: 1,
            oldattr: [],
            //              处理远期价格的显示
            timegroup: [
                {name: "立即发货", value: "prodprice", price: 1},
                {name: "30天后发货", value: "thirtyprice", price: null},
                {name: "60天后发货", value: "sixtyprice", price: null},
                {name: "90天后发货", value: "ninetyprice", price: null},
            ],
            Popupmoney: null,
            Popupstore: null,
            Popuppic: null,
            choosetime: "立即发货",
            otherRate: 100,
        };
        this.state.warnTimer && clearTimeout(this.state.warnTimer);
        this.state.successTimer && clearTimeout(this.state.successTimer);
    }


    componentWillMount() {
        console.log(this.state.type);
        if (this.state.type === "紧固件") {
            this.loadJingujian();
            this.loadRate();
        } else {
            this.loadOthers();
            this.loadRate();
        }
        this.loadEvaluteTotal();
    }

    componentDidMount() {

    }

    loadJingujian() {//紧固件
        let self = this;
        let fromData = new FormData();
        fromData.append("id", self.state.id);
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/front/product/getProductInfo", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                let detail = json.data.productInfo;
                let packs = [];
                for (let i = 0; i < detail.packingList.length; i++) {
                    let item = {
                        value: detail.packingList[i].unit,
                        label: detail.packingList[i].unit,
                    };
                    packs.push(item);
                }
                let rate = 100;
                let num = detail.productStore.startnum;
                let range = JSON.parse(detail.productStore.intervalprice);
                if (range.length > 0) {
                    if (num <= range[0].start) {
                        rate = 100;
                    } else if (range[0].start < num && num <= range[0].end) {
                        rate = range[0].rate;
                    } else if (range[1].start < num && num <= range[1].end) {
                        rate = range[1].rate;
                    } else if (num > range[1].end) {
                        rate = range[2].rate;
                    }
                }
                let single_price = (detail.prices[0].price * rate / 100).toFixed(2);
                self.setState({
                    detailData: detail,
                    timePrice: detail.prices[0].price,
                    num: detail.productStore.startnum,
                    singlePrice: single_price,
                    unit: detail.unit,
                    sliderData: detail.pdpicture,
                    packingList: packs,
                    pdno: detail.pdno,
                    pddes: detail.pddes,
                });
            } else {
                self.showWarn("网络错误");
                console.log(json.message)
            }
        }).catch(e => {
            console.log("网络出现了点问题：" + e);
            self.showWarn("网络出现了点问题");
        });
    }

    loadOthers() {//快消品
        let self = this;
        let fromData = new FormData();
        fromData.append("id", self.state.id);
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/front/product/othereProduct/detail", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log("返回参数数据");
                console.log(json);
                self.setState({
                    otherData: json.data.viewDto,
                    num: json.data.viewDto.startnum,
                    startnum: json.data.viewDto.startnum,
                    attrstartnum: json.data.viewDto.startnum,
                    pddes: json.data.viewDto.pddes,
                    sliderData: json.data.viewDto.pdpicture,
                    Popuppic: json.data.viewDto.pdpicture[0],
                    prodStoreList: json.data.prodStoreList,
                    publishAttrs: json.data.publishAttrs,
                    qujian: json.data.intervalprice,
                });
                self.dealOtherData();
            } else {
                self.showWarn("网络错误");
                console.log(json.message)
            }
        }).catch(e => {
            console.log("网络出现了点问题：" + e);
            self.showWarn("网络出现了点问题");
        });
    }

    //处理快消品的--颜色尺寸等选择的数据     获得最大库存，最大最小价格
    dealOtherData() {
        //1 处理展示的属性数据，用来点击事件的判断++++属性选择的文字
        let group = [];
        let attrWord = "";
        for (let i = 0; i < this.state.publishAttrs.length; i++) {
            let groupitem = {name: "", value: null, son: []};
            groupitem.name = this.state.publishAttrs[i].name;
            attrWord = attrWord + groupitem.name + ",";
            for (let j = 0; j < this.state.publishAttrs[i].value.length; j++) {
                let groupsonitem = {paramvalue: "", show: 0};
                groupsonitem.paramvalue = (this.state.publishAttrs[i].value)[j];
                groupitem.son.push(groupsonitem);
            }
            group.push(groupitem);
        }
        //处理一下 末尾的  ,
        attrWord = (attrWord.substring(attrWord.length - 1) == ',') ? attrWord.substring(0, attrWord.length - 1) : attrWord;
        //2 获得最大库存，最大最小价格
        let item = this.state.prodStoreList;
        let allnum = [];
        let allprice = [];
        for (let a = 0; a < item.length; a++) {
            allnum.push(item[a].pdstorenum);
            allprice.push(item[a].prodprice)
        }
        this.setState({
            showAttrs: group,
            showWord: attrWord,
            startShowword: attrWord,
            showstroenum: Math.max.apply(null, allnum),
            minprice: Math.min.apply(null, allprice),
            maxprice: Math.max.apply(null, allprice),
        });
        this.defaultShop();
    }

    //      页面加载进来---就默认显示一种商品的属性
    defaultShop() {
        let defaultAttr = this.state.prodStoreList[0];
        let allattr = this.state.showAttrs;
        for (var x = 0; x < defaultAttr.productAttrList.length; x++) {
            let attrvalue = "", index = "", i = "";
            for (var attr1 = 0; attr1 < allattr.length; attr1++) {
                if (defaultAttr.productAttrList[x].attribute === allattr[attr1].name) {
                    index = attr1;
                    for (var attr2 = 0; attr2 < allattr[attr1].son.length; attr2++) {
                        if (defaultAttr.productAttrList[x].value === allattr[attr1].son[attr2].paramvalue) {
                            attrvalue = defaultAttr.productAttrList[x].value;
                            i = attr2;
                            this.clickattr(attrvalue, index, i)
                        }
                    }
                }
            }
        }
    }

    //点击非紧固件属性的
    clickattr(attrvalue, index, i) {
        let item = [];
        item = this.state.showAttrs;
        //0 初始状态   1选中状态  2 不可点击状态
        //1:将点击的属性状态设置好
        if ((item[index].son)[i].show !== 2) {
            //     //样式的改变+加放入值
            if ((item[index].son)[i].show === 1) {
                item[index].value = null;
                (item[index].son)[i].show = 0;
            } else {
                item[index].value = attrvalue;
                for (let gg = 0; gg < item[index].son.length; gg++) {
                    if ((item[index].son)[gg].paramvalue === attrvalue) {
                        (item[index].son)[gg].show = 1;
                    } else {
                        (item[index].son)[gg].show = 0;
                    }
                }
            }
            //2 ----以下是不满足属性全部选择完毕的条件-------遍历每一个属性，找出商品列表中含有该属性组成一个数组（sonGroup）
            for (let a = 0; a < item.length; a++) {
                let matchattr = "";
                for (let b = 0; b < item[a].son.length; b++) {
                    if ((item[a].son)[b].show != 1) {
                        //取出了值，然后进行遍历
                        let matchGroup = [];//完成的商品列表数组
                        let sonGroup = [];//含有具体属性的数组
                        matchGroup = this.state.prodStoreList;
                        matchattr = item[a].name + ":" + (item[a].son)[b].paramvalue + ";";
                        //得到含有该属性的商品集合
                        for (let k = 0; k < matchGroup.length; k++) {
                            if (matchGroup[k].attrStr.indexOf(matchattr) != -1) {
                                sonGroup.push(matchGroup[k])
                            }
                        }
                        //遍历是否该商品集合中，含有点击事件的集合，有则该属性可选；
                        let judgeShow = "", start = 0;//judgeShow  通过该值来控制属性的状态；  start；是否等于item的长度来判断是都遍历完成
                        judgeShow = sonGroup;
                        for (let c = 0; c < item.length; c++) {
                            let sonmatch = "";
                            if (item[c].value == null) {
                                sonmatch = item[c].name + ":";
                            } else {
                                sonmatch = item[c].name + ":" + item[c].value + ";";
                            }
                            judgeShow = this.checkStr(judgeShow, sonmatch, item[c].name, item[a].name);//判断字符串是否可选的递归方法
                            if (judgeShow == false) {
                                (item[a].son)[b].show = 2;
                                break;
                            } else {
                                start++;
                            }
                        }
                        //遍历完成，则该属性可选
                        if (start == item.length) {
                            (item[a].son)[b].show = 0;
                        }
                    }
                }

            }
            //---------------------------
            //放置点击的属性以后。判断一下是否三个属性全部选择完成
            let clicknum = 0;
            for (let h = 0; h < item.length; h++) {
                if (item[h].value != null) {
                    clicknum++;
                }
            }
            //-------属性全部选择完毕-----------
            if (clicknum == item.length) {
                let togetherattr = "";
                let showWord = "";
                for (let bb = 0; bb < item.length; bb++) {
                    togetherattr = togetherattr + item[bb].name + ":" + item[bb].value + ";";
                }
                let chooseitem = null;//选中商品的信息
                let prodStoreList = this.state.prodStoreList;
                //直接形成一个完整的字符串去匹配   together  颜色:军绿色;尺寸:XL;毛料纯度:90％纯度;
                for (let c = 0; c < prodStoreList.length; c++) {
                    if (togetherattr === prodStoreList[c].attrStr) {
                        this.setState({
                            chooosShop: prodStoreList[c]
                        });
                        chooseitem = prodStoreList[c];
                        for (let dd = 0; dd < item.length; dd++) {
                            showWord = showWord + item[dd].value + ",";
                        }
                    }
                }
                //处理一下 末尾的  ,
                showWord = (showWord.substring(showWord.length - 1) === ',') ? showWord.substring(0, showWord.length - 1) : showWord;
                //     //-1:初始状态；0正常可点击状态：1：选中状态；2：不可选状态
                if (chooseitem !== null) {
                    this.setState({
                        showAttrs: item,
                        showWord: showWord,
                        timegroup: [
                            {name: "立即发货", value: "prodprice", price: chooseitem.prodprice!==0?chooseitem.prodprice:null},
                            {name: "30天后发货", value: "thirtyprice", price: chooseitem.thirtyprice!==0?chooseitem.thirtyprice:null},
                            {name: "60天后发货", value: "sixtyprice", price: chooseitem.thirtyprice!==0?chooseitem.thirtyprice:null},
                            {name: "90天后发货", value: "ninetyprice", price: chooseitem.ninetyprice!==0?chooseitem.ninetyprice:null},
                        ],
                        Popupmoney: chooseitem.prodprice,
                        Popupstore: chooseitem.pdstorenum,
                        haveShop: true,
                        num: chooseitem.startnum,
                        attrstartnum: chooseitem.startnum,
                    })
                }
            } else {
                this.setState({
                    showAttrs: item,
                    haveShop: false,
                    showWord: this.state.startShowword,
                    timegroup: [
                        {name: "立即发货", value: "prodprice", price:1}
                    ],
                    num: this.state.startnum,
                    Popupmoney: null,
                    Popupstore: null,
                });
            }
        }
    }

    //查看该属性是否匹配成功
    //  用于循环属性是否成功
    checkStr(sonGroup, sonmatch, matchname, getname) {
        if (matchname == getname) {
            return sonGroup;//如果遍历的属性，和所遍历对象同一个父属性：例如颜色；则默认递归返回
        } else {
            //遍历是否该商品集合中，含有点击事件的集合，有则该属性可选；
            let myGroup = [], haveGroup = [];
            myGroup = sonGroup;
            let num = 0;
            for (let w = 0; w < myGroup.length; w++) {
                if (myGroup[w].attrStr.indexOf(sonmatch) != -1) {
                    haveGroup.push(myGroup[w]);
                } else {
                    num++;
                }
            }
            if (num == myGroup.length) {
                return false;
            } else {
                return haveGroup;
            }
        }
    }

    //
    //非紧固件的发货时间
    chooseOtherTime(item) {
        this.setState({
            choosetime: item,
        })
    }

    loadEvaluteTotal() {//获取评价数量
        let self = this;
        let formData = new FormData();
        formData.append('pdid', this.state.id);
        formData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/producteva/getSingleProductEvaNum", {
            method: 'POST',
            credentials: 'include',
            body: formData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                if (json.data.num > 0) {
                    self.loadEvalute(json.data.num);
                } else {
                    self.setState({
                        maxtotal: json.data.num,
                    });
                }
            } else {
                self.showWarn("网络错误");
                console.log(json.message)
            }
        }).catch(e => {
            console.log("网络出现了点问题：" + e);
            self.showWarn("网络出现了点问题");
        });
    }

    loadEvalute(num) {//获取评价详情
        let self = this;
        let formData = new FormData();
        formData.append('pageNo', 1);
        formData.append('pageSize', 5);
        formData.append('pdid', this.state.id);
        formData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/producteva/getSingleProductEvaList", {
            method: 'POST',
            credentials: 'include',
            body: formData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                self.setState({
                    evalutes: json.data.pageInfo.list,
                    maxtotal: num,
                });
            } else {
                self.showWarn("网络错误");
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
                self.showWarn("网络错误");
                console.log(json.message)
            }
        }).catch(e => {
            console.log("网络出现了点问题：" + e);
            self.showWarn("网络出现了点问题");
        });
    }

    showWarn(text) {
        this.setState({showWarn: true, tipText: text});
        this.state.warnTimer = setTimeout(() => {
            this.setState({showWarn: false});
        }, 2000);
    }

    showSuccess(text) {
        this.setState({showSuccess: true});
        this.state.successTimer = setTimeout(() => {
            this.setState({showSuccess: false});
            stop=false;
        }, 2000);
    }

    //紧固件的发货时间
    chooseTime(price, name) {
        this.setState({timePrice: price, payTime: name})

    }

    handleChange(event) {
        let val = event.target.value;
        let intValue = 0.00;
        if (val != null && !isNaN(val)) {
            //检查小数点后是否对于两位
            intValue = val;
            if (val.toString().split(".").length > 1 && val.toString().split(".")[1].length > 3) {
                // alert("小数点后不能多于两位！");
                intValue = parseFloat(val).toFixed(3);
            }
        }
        let unit = this.state.unit;
        let singleP = this.state.singlePrice;
        // this.setState({num: event.target.value});
        console.log(this.checkNumber(intValue), unit, this.state.detailData.productStore.pdstorenum)
        if (this.checkNumber(intValue) < this.state.detailData.productStore.startnum) {
            intValue = this.getNumber(this.state.detailData.productStore.startnum, unit);
            singleP = this.SinglePrice(this.state.detailData.productStore.startnum);
        } else if (this.checkNumber(intValue) > this.state.detailData.productStore.pdstorenum) {
            intValue = this.getNumber(this.state.detailData.productStore.pdstorenum, unit);
            singleP = this.SinglePrice(this.state.detailData.productStore.pdstorenum);
        }
        this.setState({
            unit: unit,
            num: intValue,
            singlePrice: singleP
        });
    }

    unitChange(event) {
        let unit = event.target.value;
        let singleP = "";
        let inputNum = this.state.num;
        if (this.checkNumber(inputNum) < this.state.detailData.productStore.startnum) {
            inputNum = this.getNumber(this.state.detailData.productStore.startnum, unit);
            singleP = this.SinglePrice(this.state.detailData.productStore.startnum);
        } else if (this.checkNumber(inputNum) > this.state.detailData.productStore.pdstorenum) {
            inputNum = this.getNumber(this.state.detailData.productStore.pdstorenum, unit);
            singleP = this.SinglePrice(this.state.detailData.productStore.pdstorenum);
        } else {
            singleP = this.SinglePrice(this.getNumber(inputNum));
        }
        this.setState({
            unit: unit,
            num: inputNum,
            singlePrice: singleP
        });
    }

    AddClick() {//+1
        let oldNum = this.state.num;
        if (this.checkNumber(oldNum) <= (this.state.detailData.productStore.pdstorenum - 1)) {//deal
            let num = oldNum + ".00";
            let fval = num.toString().split(".")[0];
            fval++;
            let sval = num.toString().split(".")[1];
            let numStr = fval + "." + sval;
            let singleP = this.SinglePrice(this.getNumber(numStr));
            this.setState({
                num: numStr,
                singlePrice: singleP
            });
        }
    }

    SubClick() {//-1
        let oldNum = this.state.num;
        if (this.checkNumber(oldNum) > this.state.detailData.productStore.startnum && oldNum > 1) {
            let num = oldNum + ".00";
            let fval = num.toString().split(".")[0];
            fval--;
            let sval = num.toString().split(".")[1];
            let numStr = fval + "." + sval;
            let singleP = this.SinglePrice(this.getNumber(numStr));
            this.setState({
                num: numStr,
                singlePrice: singleP
            });
        }
    }

    AddOtherClick() {//+1
        let oldNum = this.state.num;
        if (oldNum <= this.state.showstroenum - 1) {
            oldNum++;
            let range = this.state.qujian;
            let rate = 100;
            if (range.length > 0) {
                if (oldNum <= range[0].start) {
                    rate = 100;
                } else if (range[0].start < oldNum && oldNum <= range[0].end) {
                    rate = range[0].rate;
                } else if (range[1].start < oldNum && oldNum <= range[1].end) {
                    rate = range[1].rate;
                } else if (oldNum > range[1].end) {
                    rate = range[2].rate;
                }
            }
            this.setState({
                num: oldNum,
                otherRate: rate
            });

        }
    }

    numChange(event) {
        let value = event.target.value;
        if (value >= this.state.otherData.startnum && value <= this.state.showstroenum) {
            let range = this.state.qujian;
            let rate = 100;
            if (range.length > 0) {
                if (value <= range[0].start) {
                    rate = 100;
                } else if (range[0].start < value && value <= range[0].end) {
                    rate = range[0].rate;
                } else if (range[1].start < value && value <= range[1].end) {
                    rate = range[1].rate;
                } else if (value > range[1].end) {
                    rate = range[2].rate;
                }
            }
            this.setState({
                num: value,
                otherRate: rate
            });
        }
    }

    SubOtherClick() {//-1
        let oldNum = this.state.num;
        if (oldNum > this.state.otherData.startnum && oldNum > 1) {
            oldNum--;
            let range = this.state.qujian;
            let rate = 100;
            if (range.length > 0) {
                if (oldNum <= range[0].start) {
                    rate = 100;
                } else if (range[0].start < oldNum && oldNum <= range[0].end) {
                    rate = range[0].rate;
                } else if (range[1].start < oldNum && oldNum <= range[1].end) {
                    rate = range[1].rate;
                } else if (oldNum > range[1].end) {
                    rate = range[2].rate;
                }
            }
            this.setState({
                num: oldNum,
                otherRate: rate
            });
        }
    }

    getNumber(num, unit) {
        let packageList = this.state.detailData.packingList ? this.state.detailData.packingList : [];
        for (let i = 0; i < packageList.length; i++) {
            if (packageList[i].unit === unit) {
                // console.log("getNumber:" + num);
                return num;
            } else {
                let numRate = packageList[i].num === 0 ? 1 : packageList[i].num;
                num = (num / numRate).toFixed(2);
            }
        }
        return num;
    }

    checkNumber(num) {//判断num
        let unit = this.state.unit;
        let packageList = this.state.detailData.packingList;
        //默认单位为最小单位packageList[0].unit
        for (let i = 0; i < packageList.length; i++) {
            if (packageList[i].unit === unit) {
                return num;
            } else {
                let numRate = packageList[i].num === 0 ? 1 : packageList[i].num;
                num = num * numRate;
            }
        }
        return num;
    }

    SinglePrice(num) {//计算单价
        let rate = 100;
        let range = JSON.parse(this.state.detailData.productStore.intervalprice);
        if (range.length > 0) {
            if (num <= range[0].start) {
                rate = 100;
            } else if (range[0].start < num && num <= range[0].end) {
                rate = range[0].rate;
            } else if (range[1].start < num && num <= range[1].end) {
                rate = range[1].rate;
            } else if (num > range[1].end) {
                rate = range[2].rate;
            }
        }

        let single_price = (this.state.timePrice * rate / 100).toFixed(2);
        return single_price;
    }

    totalPrice(price, num, percent) {//单价，数量，优惠
        let rate = 100;
        let range = JSON.parse(this.state.detailData.productStore.intervalprice);
        if (range.length > 0) {
            if (num <= range[0].start) {
                rate = 100;
            } else if (range[0].start < num && num <= range[0].end) {
                rate = range[0].rate;
            } else if (range[1].start < num && num <= range[1].end) {
                rate = range[1].rate;
            } else if (num > range[1].end) {
                rate = range[2].rate;
            }
        }

        let total_price = (price * num * rate).toFixed(2);
        if (percent) {
            total_price = (price * num * rate * percent / 100).toFixed(2);
        }
        return total_price;
    }

    choosePayType(typeId) {
        this.setState({payType: typeId});
    }

    AddShopCart() {//加入购物车
        //最外层添加如果是非紧固件---属性为未选择进行提示
        if (this.state.type !== "紧固件" && this.state.haveShop === false) {
            this.showWarn("商品属性未选择！");
        } else {
            let param = {};
            let protype = 0;
            if (this.state.type === "紧固件") {
                param.saleid = this.state.detailData.memberid;
                param.pdid = this.state.detailData.productStore.pdid;
                param.pdno = this.state.detailData.productStore.pdno;
                param.pdnumber = this.state.num;
                param.storeid = this.state.detailData.productStore.storeid;
                param.delivertime = this.state.payTime;
                param.unit = this.state.unit;
                if (this.state.payTime === "立即发货") {
                    protype = 0;
                } else {
                    if (this.state.payType === 0) {
                        protype = 1;
                    } else {//==1
                        protype = 2;
                    }
                }
                param.protype = protype;
            } else {
                if (this.state.choosetime === "立即发货") {//立即发货
                    protype = 0;
                } else {
                    protype = 1;
                }
                param = {
                    pdid: this.state.chooosShop.pdid,
                    saleid: this.state.otherData.memberid,
                    pdno: this.state.chooosShop.pdno,
                    protype: protype,
                    unit: this.state.otherData.unit,
                    pdnumber: this.state.num,
                    storeid: this.state.chooosShop.storeid,
                    storename: this.state.chooosShop.storename,
                    deliverytime: this.state.choosetime
                }
            }
            if (stop === false) {
                stop = true;
                let self = this;
                let formData = new FormData();
                formData.append("pdid", param.pdid);
                formData.append("pdno", param.pdno);
                formData.append("pdnumber", param.pdnumber);
                formData.append("delivertime", param.delivertime);
                formData.append("unit", param.unit);
                formData.append("protype", param.protype);
                formData.append("storeid", param.storeid);
                formData.append("webToken", localStorage.getItem('webToken'));
                fetch(getHost() + "/rest/buyer/shopcar/insertShopCar", {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                }).then(response => response.json()).then(json => {
                    if (json.result === 1) {
                        console.log(json);
                        self.setState({
                            bottom_show: false
                        });
                        self.showSuccess();
                    } else if (json.result === 2) {//登录失效
                        HistoryManager.register(pathHeader + '/Login');
                        location.href = pathHeader + '/Login';
                    } else {
                        self.showWarn(json.message);
                        console.log(json.message)
                    }
                }).catch(e => {
                    console.log("网络出现了点问题：" + e);
                    self.showWarn("网络出现了点问题");
                });
            }
        }
    }

    BuyNow() {//立即购买
        if (this.state.type !== "紧固件" && this.state.haveShop === false) {
            this.showWarn("商品属性未选择！");
        } else {
            let goodsInfo = {};
            if (this.state.type === "紧固件") {
                let protype = 0;
                if (this.state.payTime === "立即发货") {
                    protype = 0;
                } else {
                    if (this.state.payType === 0) {
                        protype = 1;
                    } else {//==1
                        protype = 2;
                    }
                }
                goodsInfo = {
                    pdid: this.state.detailData.id,
                    saleid: this.state.detailData.memberid,
                    pdno: this.state.detailData.productStore.pdno,
                    protype: protype,
                    unit: this.state.unit,
                    pdnumber: this.state.num,
                    storeid: this.state.detailData.productStore.storeid,
                    storename: this.state.detailData.productStore.storename,
                    deliverytime: this.state.payTime
                };
            } else {
                let protype = 0;
                if (this.state.choosetime === "立即发货") {//立即发货
                    protype = 0;
                } else {
                    protype = 1;
                }
                goodsInfo = {
                    pdid: this.state.chooosShop.pdid,
                    saleid: this.state.otherData.memberid,
                    pdno: this.state.chooosShop.pdno,
                    protype: protype,
                    unit: this.state.otherData.unit,
                    pdnumber: this.state.num,
                    storeid: this.state.chooosShop.storeid,
                    storename: this.state.chooosShop.storename,
                    deliverytime: this.state.choosetime
                };
            }
            localStorage.setItem("type", 0);
            localStorage.setItem("goodsInfo", JSON.stringify(goodsInfo));
            console.log(JSON.stringify(goodsInfo));
            let url = pathHeader + "/CreateOrder";
            HistoryManager.register(url);
            location.href = url;
        }
    }

    showAll() {//查看所有评价
        let url = pathHeader + "/EvaluationList?id=" + this.state.id;
        HistoryManager.register(url);
        location.href = url;
    }

    LeftClick() {
        HistoryManager.pageBack();
    }

    RightClick() {
        localStorage.setItem('HomeIndex', 2);
        HistoryManager.removeAll();
        location.href = pathHeader + '/'
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
        return (
            <div>
                <NavigationBar Title="" LeftBar="true" LeftTitle="返回" RightBar="true" RightTitle="购物车"
                               RightClick={this.RightClick}
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                <div style={contentStyle}>
                    <div style={slideDiv}>
                        <Slider {...settings}>
                            {
                                (this.state.sliderData || []).map((item, i) =>
                                    <img style={slideImg} className="apply_icon" key={i}
                                         src={process.env.IMAGE_PRIFIX + item}/>
                                )
                            }
                        </Slider>
                    </div>
                    {this.state.type !== "紧固件" ?
                        <div>
                            <div style={{background: "#F5F5F5", padding: "1rem", fontSize: "1.2rem"}}>
                                <div className="titleName">
                                    {this.state.otherData.productname} {this.state.otherData.productalias} {this.state.otherData.subtitle}
                                </div>
                                <div>
                                    <span style={{
                                        color: "red",
                                        fontSize: "1.6rem",
                                        marginRight: "1.2rem"
                                    }}>¥{this.state.minprice}-{this.state.maxprice}</span>
                                </div>
                                <div style={leftStyle}> 品牌：{this.state.otherData.brand}</div>
                                <div style={centerStyle}>库存：{this.state.showstroenum}{this.state.otherData.unit}</div>
                                <div style={rightStyle}>起订量：{this.state.attrstartnum}{this.state.otherData.unit}</div>
                            </div>
                            <div className="shopLine" onClick={e => this.setState({bottom_show: true})}>
                                <div style={{display: "inline-block", width: "10rem", fontSize: "1.4rem"}}>选择</div>
                                <div style={{
                                    display: "inline-block",
                                    width: "22rem",
                                    fontSize: "1.4rem"
                                }}>{this.state.showWord}</div>
                                <div style={iconStyle}>
                                    <img style={{width: "1rem", height: "1.2rem", verticalAlign: "middle"}}
                                         src="/assets/images/shop/shop_arrow_right.png"/>
                                </div>
                            </div>
                            <div className="shopLine">
                                <div style={{display: "inline-block", width: "10rem", fontSize: "1.4rem"}}>发货时间</div>
                                <ul className="myUl">
                                    {(this.state.timegroup || []).map((item, i) =>
                                        <li key={i} onClick={this.chooseOtherTime.bind(this, item.name)}
                                            className={this.state.choosetime === item.name ? "checkedLi" : ""}
                                            style={item.price === null ? {display: "none"} : {}}>{item.name}</li>
                                    )}
                                </ul>
                            </div>
                            <div className="shopLine" style={this.state.choosetime === "立即发货" ? {display: "none"} : {}}>
                                <div style={{display: "inline-block", width: "10rem", fontSize: "1.4rem"}}>支付方式</div>
                                <ul className="myUl">
                                    <li className={this.state.payType === 0 ? "checkedLi" : ""}
                                        onClick={this.choosePayType.bind(this, 0)}>全款(9.9折)
                                    </li>
                                    <li className={this.state.payType === 1 ? "checkedLi" : ""}
                                        style={this.state.choosetime === "立即发货" ? {display: "none"} : {}}
                                        onClick={this.choosePayType.bind(this, 1)}>定金{this.state.rate}%
                                    </li>
                                </ul>
                            </div>
                            <div className="shopLine">
                                <div style={{display: "inline-block", width: "10rem", fontSize: "1.4rem"}}>购物数量</div>
                                <div style={{display: "inline-block", width: "22rem", fontSize: "1.4rem"}}>
                                    <img style={imgBtn}
                                         src="/assets/images/shop/shop_prod_sub.png" onClick={this.SubOtherClick}/>
                                    <input type="number" style={inputStyle} value={this.state.num}
                                           onChange={event => this.setState({num: event.target.value})}
                                           onBlur={this.numChange}/>
                                    <img style={imgBtn_add}
                                         src="/assets/images/shop/shop_prod_add.png" onClick={this.AddOtherClick}/>
                                </div>

                            </div>
                        </div> : <div>
                            <div style={{background: "#F5F5F5", padding: "1rem", fontSize: "1.2rem"}}>
                                <div className="titleName">
                                    {
                                        this.state.detailData.selfsupport ?
                                            <img style={selfStyle} src="/assets/images/common/icon_self.png"/> : null
                                    }
                                    {this.state.detailData.productname}
                                    <span>/{this.state.detailData.level3}</span>
                                    <span>/{this.state.detailData.stand}</span>
                                    <span>/{this.state.detailData.material}</span>
                                    <span>/{this.state.detailData.cardnum}</span>
                                </div>
                                <div>
                            <span style={{
                                color: "red",
                                marginRight: "1rem"
                            }}>¥{this.state.singlePrice}/{this.state.detailData.unit}</span>
                                    <s>¥{this.state.detailData.productStore.marketprice}/{this.state.detailData.unit}</s>
                                </div>
                                <div style={leftStyle}>快递：免运费</div>
                                <div style={centerStyle}>品牌：{this.state.detailData.brand}</div>
                                <div
                                    style={rightStyle}>库存：{this.state.detailData.productStore.pdstorenum}{this.state.detailData.unit}</div>
                                <div style={leftStyle}>表面处理：{this.state.detailData.surfacetreatment}</div>
                                <div style={packageStyle}>包装方式：{this.state.detailData.packagetype}</div>
                            </div>
                            <div className="shopLine">
                                <div>发货仓库</div>
                                <ul className="myUl">
                                    <li className="checkedLi">{this.state.detailData.productStore.storename}</li>
                                </ul>
                            </div>
                            <div className="shopLine">
                                <div style={{display: "inline-block", width: "10rem", fontSize: "1.4rem"}}>发货时间</div>
                                <ul className="myUl">
                                    {(this.state.detailData.prices || []).map((item, i) =>
                                        <li key={i} onClick={this.chooseTime.bind(this, item.price, item.name)}
                                            className={this.state.payTime === item.name ? "checkedLi" : ""}>{item.name}</li>
                                    )}
                                </ul>
                            </div>
                            {this.state.payTime === "立即发货" ? null :
                                <div className="shopLine">
                                    <div style={{display: "inline-block", width: "10rem", fontSize: "1.4rem"}}>支付方式
                                    </div>
                                    <ul className="myUl">
                                        <li className={this.state.payType === 0 ? "checkedLi" : ""}
                                            onClick={this.choosePayType.bind(this, 0)}>全款(9.9折)
                                        </li>
                                        <li className={this.state.payType === 1 ? "checkedLi" : ""}
                                            onClick={this.choosePayType.bind(this, 1)}>定金{this.state.rate}%
                                        </li>
                                    </ul>
                                </div>
                            }
                            <div className="shopLine">
                                <div style={{display: "inline-block", width: "10rem", fontSize: "1.4rem"}}>购物数量</div>
                                <div style={{display: "inline-block", width: "17rem", fontSize: "1.4rem"}}>
                                    <img style={imgBtn} src="/assets/images/shop/shop_prod_sub.png"
                                         onClick={this.SubClick}/>
                                    <input type="text" style={inputStyle} value={this.state.num}
                                           onChange={event => this.setState({num: event.target.value})}
                                           onBlur={this.handleChange}/>
                                    <img style={imgBtn_add} src="/assets/images/shop/shop_prod_add.png"
                                         onClick={this.AddClick}/>
                                </div>
                                <div style={{
                                    display: "inline-block",
                                    marginLeft: "1rem"
                                }}>
                                    <Select style={unitStyle} data={this.state.packingList} onChange={this.unitChange}/>
                                </div>
                            </div>
                            {/*<div className="shopLine">*/}
                            {/*<div style={{display: "inline-block", width: "10rem", fontSize: "1.4rem"}}>总价</div>*/}
                            {/*<div style={{*/}
                            {/*display: "inline-block",*/}
                            {/*width: "22rem",*/}
                            {/*fontSize: "1.4rem"*/}
                            {/*}}>{this.state.totalPrice}</div>*/}
                            {/*</div>*/}
                        </div>}
                    <div style={{borderTop: "0.5rem solid #F5F5F5", fontSize: "1.4rem"}}>
                        <div style={{padding: "0 1rem"}}>宝贝评价(<span>{this.state.maxtotal}</span>)</div>
                        {(this.state.evalutes || []).map((item, i) =>
                            <div className="appraise">
                                <div>会员名称:{item.isanonymous === 2 ? "匿名" : item.membername}</div>
                                <div>{item.buyersexperience}</div>
                            </div>
                        )}
                        <div style={{width: "100%", margin: "2rem 0", textAlign: "center"}}>
                            <div className="appraiseBtn" onClick={this.showAll}>
                                全部评价
                            </div>
                        </div>
                    </div>
                    <div style={{borderTop: "0.5rem solid #F5F5F5", marginBottom: "1rem", fontSize: "1.4rem"}}>
                        <div style={{padding: "0 1rem"}}>宝贝详情</div>
                        <div className="dangerous_des" dangerouslySetInnerHTML={{__html: this.state.pddes}}></div>
                    </div>
                </div>
                <div style={bottomStyle}>
                    <div style={popupAddBtn} onClick={this.AddShopCart}>
                        加入购物车
                    </div>
                    <div style={popupBuyBtn} onClick={this.BuyNow}>
                        立即购买
                    </div>
                    {/*<div style={{display: "inline-block", width: "17.5rem", height: "6rem",fontSize:"1.2rem"}}>客服 0571-56238589</div>*/}
                    {/*<div style={ addBtn} onClick={this.state.type!="紧固件"&&this.state.haveShop===true?null:this.AddShopCart}>加入购物车</div>*/}
                    {/*<div style={buyBtn} onClick={this.BuyNow}>立即购买</div>*/}
                </div>
                <Popup
                    show={this.state.bottom_show}
                    onRequestClose={e => this.setState({bottom_show: false})}>
                    <div style={{background: "white"}}>
                        <div style={{position: "absolute", top: "1rem", right: "1rem"}}
                             onClick={e => this.setState({bottom_show: false})}><img style={cancelBtn}
                                                                                     src="/assets/images/shop/shop_popup_cancel.png"/>
                        </div>
                        <div style={paddingStyle}>
                            <img src={process.env.IMAGE_PRIFIX + "/" + this.state.Popuppic}
                                 style={{width: "8rem", height: "8rem"}}/>
                            <div style={{
                                display: "inline-block", marginLeft: "1rem",
                                verticalAlign: "top",
                                width: "26.5rem",
                                height: "8rem",
                            }}>
                                <div style={{
                                    color: "red",
                                    marginRight: "1rem",
                                    fontSize: "1.6rem",
                                    hight: "2rem",
                                    lineHeight: "2rem"
                                }}>
                                    <span>¥ <span
                                        style={this.state.Popupmoney === null ? {} : {display: "none"}}>{this.state.minprice}-{this.state.maxprice}</span>{this.state.Popupmoney}</span>
                                </div>
                                <div className="nameStyle">
                                    {this.state.otherData.productname} {this.state.otherData.productalias} {this.state.otherData.subtitle}
                                </div>
                                <div>库存：<span
                                    style={this.state.Popupstore === null ? {} : {display: "none"}}>{this.state.showstroenum}</span>{this.state.Popupstore}{this.state.otherData.unit}
                                </div>
                            </div>
                        </div>
                        {this.state.showAttrs.map((item, index) =>
                            <div className="shopLine" key={index}>
                                <div style={paddingStyle}>{item.name}</div>
                                <ul className="myUl">
                                    {item.son.map((itemson, i) =>
                                        <li key={i} onClick={this.clickattr.bind(this, itemson.paramvalue, index, i)}
                                            className={itemson.show === 1 ? "checkedLi" : itemson.show === 2 ? "disableLi" : ""}
                                        >{itemson.paramvalue}</li>
                                    )}
                                </ul>
                            </div>
                        )}
                        <div>
                            <div style={popupAddBtn} onClick={this.AddShopCart}>
                                加入购物车
                            </div>
                            <div style={popupBuyBtn} onClick={this.BuyNow}>
                                立即购买
                            </div>
                        </div>
                    </div>
                </Popup>
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
                <Toptips type="primary" show={this.state.showSuccess}> 添加成功 </Toptips>
            </div>
        )
    }


}