import React, {Component} from 'react';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import StarEvaluation from '../components/StarEvaluation.jsx';
import WeUI from 'react-weui';

//import styles
import 'weui';
import {CSS} from '../style/order.css';

const {Toptips, Cells, Cell, CellHeader, CellBody, CellFooter, TextArea} = WeUI;
let pathHeader='/weixin';
let shopStyle = {
    width: '2rem',
    height: '2rem',
    verticalAlign: "middle",
    marginRight: "1rem"
};
let checkStyle={
    padding: "0 1rem",
    marginBottom: "0.5rem",
    height: "3rem",
    lineHeight: "3rem",
    fontSize: "1.2rem"
};
export default class PublishEvaluation extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.RightClick = this.RightClick.bind(this);
        this.DescribeClick = this.DescribeClick.bind(this);
        this.LogisticsClick = this.LogisticsClick.bind(this);
        this.ServiceClick = this.ServiceClick.bind(this);
        this.TextChange = this.TextChange.bind(this);
        this.state = {
            orderNo: this.props.location.query.orderNo,
            evaProductList: [],
            // product: 0,
            logistics: 5,
            service: 5,
            evaText: "",
            isanonymous: 1,
            showWarn: false,
            showSuccess: false,
            warnTimer: null,
            successTimer: null,
            tipText: "",
            successText: "",
        };
        this.state.warnTimer && clearTimeout(this.state.warnTimer);
        this.state.successTimer && clearTimeout(this.state.successTimer);
    }

    showWarn(text) {
        this.setState({showWarn: true, tipText: text});

        this.state.warnTimer = setTimeout(() => {
            this.setState({showWarn: false});
        }, 2000);
    }

    showSuccess(text) {
        this.setState({showSuccess: true, successText: text});
        this.state.successTimer = setTimeout(() => {
            this.setState({showSuccess: false});
            HistoryManager.pageBack();
        }, 2000);
    }

    componentWillMount() {
        this.loadData();
    }

    componentDidMount() {
    }

    loadData() {
        let self = this;
        self.setState({
            isLoading: true
        });
        let fromData = new FormData();
        fromData.append("webToken", localStorage.getItem('webToken'));
        fromData.append("orderNo", self.state.orderNo);
        fetch(getHost() + "/rest/buyer/orders/getOrderDetail", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                let evaProductList = [];
                let orderProducts = json.data.orderProducts;
                let item = {};
                for (let i = 0; i < orderProducts.length; i++) {
                    let imgSrc = orderProducts[i].pdpic ? orderProducts[i].pdpic : 'default/imgs/defaultProductImg.jpg';
                    item = {id: orderProducts[i].id, eva1: 5, isanonymous: 2, eva: "", img: imgSrc};
                    evaProductList.push(item)
                }
                self.setState({
                    evaProductList: evaProductList,
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

    RightClick() {//发布评价
        let self = this;
        let formData = new FormData();
        formData.append("webToken", localStorage.getItem('webToken'));
        formData.append("evaProductList", JSON.stringify(self.state.evaProductList));//
        formData.append("eva2", self.state.logistics);
        formData.append("eva3", self.state.service);
        fetch(getHost() + "/rest/buyer/orders/evaProduct/more", {
            method: 'POST',
            credentials: 'include',
            body: formData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                self.showSuccess("发布成功");
            } else if (json.result === 2) {//登录失效
                HistoryManager.register(pathHeader+'/Login');
                location.href = pathHeader+'/Login';
            } else {
                self.showWarn("取消订单失败");
                console.log(json.message)
            }
        }).catch(e => {
            console.log("网络出现了点问题：" + e);
            self.showWarn("网络出现了点问题");
        });
    }

    DescribeClick(index, i) {//描述
        let list = this.state.evaProductList;
        list[i].eva1 = index;
        this.setState({evaProductList: list})
    }

    ChangeAnonymous(i, isanonymous) {
        let list = this.state.evaProductList;
        let check = 1;
        if (isanonymous === 1) {
            check = 2;
        }
        list[i].isanonymous = check;
        this.setState({evaProductList: list})
    }

    LogisticsClick(index) {//物流
        this.setState({logistics: index})
    }

    ServiceClick(index) {//服务
        this.setState({service: index})
    }

    TextChange(i, e) {

        let list = this.state.evaProductList;
        list[i].eva = e.target.value;
        this.setState({evaProductList: list})
    }

    render() {
        return (
            <div style={{background: "#f2f2f2"}}>
                <NavigationBar Title="评价" LeftBar="true" LeftTitle="返回"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}
                               RightBar="true" RightTitle="发布" RightClick={this.RightClick}/>
                {
                    this.state.evaProductList.map((item, i) =>
                        <div key={i} style={{marginBottom: "1.5rem", background: "white"}}>
                            <div style={{borderBottom: "1px solid #f2f2f2"}}>
                                <img className="evaluation_product" src={process.env.IMAGE_PRIFIX  + item.img}/>
                                <StarEvaluation id={i} titleName="描述相符" index={item.eva1}
                                                callback={this.DescribeClick}/>
                            </div>
                            <div style={{padding: "1rem", fontSize: "1.4rem"}}>
                        <TextArea key={i} placeholder="请描述下您的问题" rows={3} maxLength={200} value={item.eva}
                                  onChange={this.TextChange.bind(this, i)}/>
                            </div>
                            <div style={checkStyle}>
                                <img style={{width: "3rem", height: "3rem", verticalAlign: "middle"}}
                                     onClick={this.ChangeAnonymous.bind(this, i, item.isanonymous)}
                                     src={item.isanonymous === 1 ? "/assets/images/userCenter/user_switch_off.png" : "/assets/images/userCenter/user_switch_on.png"}/> 匿名
                            </div>
                        </div>
                    )
                }

                <div style={{padding: "1rem", fontSize: "1.4rem", background: "white"}}>
                    <div><img style={shopStyle} src="/assets/images/order/evaluation_icon_shop.png"/>店铺评分</div>
                    <StarEvaluation titleName="物流服务" index={this.state.logistics} callback={this.LogisticsClick}/>
                    <StarEvaluation titleName="服务态度" index={this.state.service} callback={this.ServiceClick}/>
                </div>
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
                <Toptips type="primary" show={this.state.showSuccess}>{this.state.successText}</Toptips>
            </div>
        )
    }


}