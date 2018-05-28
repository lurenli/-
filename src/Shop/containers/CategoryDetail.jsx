import React, {Component} from 'react';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import CategoryProduct from '../components/CategoryProduct.jsx';
import WeUI from 'react-weui';
import {CSS} from '../style/shop.css';

const {Toptips} = WeUI;
let pathHeader='/weixin';
export default class CategoryDetail extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.RightClick = this.RightClick.bind(this);
        this.state = {
            level1: this.props.location.query.level1,
            level2:"",
            showWarn: false,
            warnTimer: null,
            tipText: "",
            alllevel2:[],
            selectList: [],
            categories: [],
            selectIndex: 0,

        };
    }


    componentWillMount() {
        this.loadData();
    }

    componentDidMount() {
    }

    showWarn(text) {
        this.setState({showWarn: true, tipText: text});
        this.state.warnTimer = setTimeout(() => {
            this.setState({showWarn: false});
        }, 2000);
    }

    loadData() {
        let self = this;
        let fromData = new FormData();
        fromData.append("pageNo", 1);
        fromData.append("pageSize", 20);
        fromData.append("level1", self.state.level1);
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/front/product/otherProdList", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                // self.showSuccess()
                if(json.data.pageInfo.list){
                    self.setState({selectList:json.data.pageInfo.list});
                }
                let item=json.data.keyValues;
                let group=[
                    { num:0,value:"全部"}
                ];
                for(let i=0;i<item.length;i++){
                    if(item[i].key==="level2"){
                        for(let j=0;j<item[i].value.length;j++){
                            let son={
                                num:0,value:"全部"
                            };
                            son.num=j;
                            son.value=(item[i].value)[j]
                            group.push(son)
                        }
                        break;
                    }
                }
                self.setState({alllevel2: group});
                console.log(self.state)
            } else {
                self.showWarn("信息获取失败");
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
    //点击右侧的搜索
    RightClick(){
        let url = pathHeader+'/SearchOther';
        HistoryManager.register(url);
        location.href = url;
    }
    ChooseClick(value,i) {
        if(value==="全部"){
            this.setState({
                level2:null,
                selectIndex:0,
            })
        }else{
            this.setState({
                level2:value,
                selectIndex:i,
            })
        }
        if(value==="全部"){
            value="";
        }
        let self = this;
        let fromData = new FormData();
        fromData.append("pageNo", 1);
        fromData.append("pageSize", 20);
        fromData.append("level1", self.state.level1);
        fromData.append("level2", value);
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/front/product/otherProdList", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                // self.showSuccess()
                if(json.data.pageInfo.list){
                    self.setState({selectList:json.data.pageInfo.list});
                }
            } else {
                self.showWarn("信息获取失败");
                console.log(json.message)
            }
        }).catch(e => {
            console.log("网络出现了点问题：" + e);
            self.showWarn("网络出现了点问题");
        });
    }

    render() {
        let navHeight = 4.4;
        let height = document.body.clientHeight * 37.5 / document.body.clientWidth - navHeight;
        let heightValue = height + "rem";
        return (
            <div>
                <NavigationBar Title={this.state.level1} LeftBar="true" LeftTitle="返回"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}
                               RightBar="true"  RightTitle="搜索" RightClick={this.RightClick}/>
                <div style={{position: "relative", height: heightValue, width: "100%"}}>
                    <div className="navigation_div">
                        <div className="navigation_left">
                            {this.state.alllevel2.map((item, i) =>
                                <div className={i === this.state.selectIndex ? "left_item_select" : "left_item"}
                                     onClick={this.ChooseClick.bind(this, item.value,i)} key={i}>{item.value}</div>
                            )}
                        </div>
                        <div className="content_right" style={{minHeight: heightValue}}>
                            {this.state.selectList.map((item, i) =>
                                <CategoryProduct key={i}  data={item}/>
                            )}
                        </div>
                    </div>
                </div>
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
            </div>
        )
    }


}
