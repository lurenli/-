import React, {Component} from 'react';
// import HistoryListItem from '../components/HistoryListItem.jsx';
import WeUI from 'react-weui';


//import styles
import 'weui';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import Loading from '../../Common/Loading/Loading.jsx';
const {
    Cell,
    CellHeader,
    CellBody,
} = WeUI;
let tillLoad = true;
let itemStyle = {
    width: "100%",
    fontSize: "1.4rem",
    margin: "1rem 0",
    background: "white"
};
let itemImg = {
    display: "block",
    width: "5rem",
    height: "5rem",
    border: "1px solid #eee"
};
let checkDetailBtn={
    float:"right",
    padding: "0.2rem 0.8rem",
   borderRadius: "0.5rem",
    background: "#E8000E",
    color: "white",
    fontSize: "1.4rem",
};
let pathHeader='/weixin';
export default class ServiceList extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.OnScroll = this.OnScroll.bind(this);
        this.DetailClick = this.DetailClick.bind(this);
        this.state = {
            dataList: [],
            pageNo: 1,
            pageSize:10,
            isLoading: true,
            noneText: "暂无信息",
        }
    }


    componentWillMount() {
        this.loadAll(1);
    }

    componentDidMount() {
    }

    LeftClick() {
        HistoryManager.pageBack();
    }

    loadAll(pageNo) {
        let self = this;
        let fromData = new FormData();
        fromData.append("state",-1);
        fromData.append("pageNo", pageNo);
        fromData.append("pageSize", self.state.pageSize);
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/orders/getOrderProductBack", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                // self.showSuccess();
                tillLoad = true;
                self.setState({
                    dataList: json.data.pageInfo.list ? self.state.dataList.concat(json.data.pageInfo.list) : self.state.dataList,
                    pageNo: self.state.pageNo+1,
                    isLoading: false
                });
            } else if (json.result === 2) {//登录失效
                HistoryManager.register(pathHeader+'/Login');
                location.href =pathHeader+ '/Login';
            } else {
                // self.showWarn("信息获取失败");
                console.log(json.message)
            }
        }).catch(e => {
            console.log("网络出现了点问题：" + e);
            // self.showWarn("网络出现了点问题");
        });
    }

    OnScroll() {
        let screenHeight = window.screen.height;
        let self = this;
        if (document.getElementById("scrollDiv").scrollTop + screenHeight + 200 >= document.getElementById("scrollDiv").scrollHeight && tillLoad) {
            tillLoad = false;
            setTimeout(function () {
                self.loadAll(self.state.pageNo);
            }, 1000)
        }
    }


    Switch(key){
        console.log(key)
        switch (key){
            case 0:
                return <span style={{color:"#ffc103"}}>等待卖家处理</span>;
                break;
            case 1:
                return <span style={{color:"#ffc103"}}>等待填写物流信息</span>;
                   break;
                   case 7:
                return<span style={{color:"#ffc103"}}>等待填写物流信息</span>;
                   break;
                   case 8:
                return<span style={{color:"#ffc103"}}>等待填写物流信息</span>;
                   break;
            case 4:
                return <span style={{color:"#e8000e"}}>卖家不同意退货</span>
                   break;
            case 6:
                return <span style={{color:"#ffc103"}}>等待平台处理</span>
                break;
            case 9:
                return <span style={{color:"#e8000e"}}>平台不同意</span>
                break;
            case 10:
                return <span style={{color:"#359a2b"}}>退货成功</span>
                break;
            case 11:
                return <span style={{color:"#666666"}}>已取消</span>
                break;
            case 12:
                return <span style={{color:"#ffc103"}}>等待卖家确认收货</span>
                   break;
        }
        }
    DetailClick(item) {
        let url = pathHeader+"/ServiceDetail?id=" + item.id;
        HistoryManager.register(url);
        location.href = url;
    }
    render() {
        let show = {
            display: "block",
            width: "100%",
            height: "100%",
            background: "#FAFAFA"
        };
        let navHeight = 4.4;
        let height = document.body.clientHeight * 37.5 / document.body.clientWidth - navHeight;
        let heightValue = height + "rem";
        return (
            <div style={show}>
                <NavigationBar Title="退款/售后" LeftBar="true" LeftTitle="返回"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                <div id="scrollDiv" style={{height: heightValue, paddingBottom: "0", overflowY: "scroll"}}
                     onScroll={this.OnScroll}>
                    <div>
                        {
                            this.state.dataList.map((item, i) =>
                            <div style={itemStyle} key={i}>
                                <div style={{width: "100%", height: "3rem", lineHeight: '3rem',fontSize:"1.2rem"}}>
                                    <div style={{
                                        float: "left",
                                        marginLeft: "1rem"
                                    }}>{item.orderno}
                                    </div>
                                    <div style={{
                                        float: "right",
                                        marginRight:"1rem",
                                        fontSize:"1.2rem"
                                    }}>{this.Switch(item.state)}
                                    </div>
                                </div>
                                <Cell style={{width: "100%"}} key={i}>
                                    <CellHeader>
                                        <img src={process.env.IMAGE_PRIFIX  + item.pdPic} alt="" style={itemImg}/>
                                    </CellHeader>
                                    <CellBody style={{marginLeft:"1rem",}}>
                                        <div style={{fontSize:"1.6rem"}}>{item.pdname}/{item.level3}</div>
                                        <div>
                                            <div>退货数量：{item.pdnum}</div>
                                            <div>退货金额：￥{item.backmoney} <span style={checkDetailBtn} onClick={this.DetailClick.bind(this,item)}>查看详情</span></div>
                                        </div>
                                    </CellBody>
                                </Cell>
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