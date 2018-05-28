import React, {Component} from 'react';
import WeUI from 'react-weui';
//import styles
import 'weui';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import {CSS} from '../style/backDetail.css';

const {
    Dialog,
    Button,
    Input,
    Label,
    Select,
   Toptips,
} = WeUI;
let itemImg = {
    display: "block",
    width: "5rem",
    height: "5rem",
    padding: "1rem"
};
let tillLoad = true;let pathHeader='/weixin';
let stop=false;//防止重复提交
export default class ServiceList extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.GoeditService = this.GoeditService.bind(this);
        this.Componeychange = this.Componeychange.bind(this);
        this.Ordernochange = this.Ordernochange.bind(this);
        this.addressUpdate = this.addressUpdate.bind(this);//填写物流和单号的更新
        this.state = {
            showWarn: false,
            gooddetail: {},
            backMsg: {},
            id:this.props.location.query.id,
            orderpdid:this.props.location.query.orderpdid,
            status: 0,
            backtype: 0,
            CompanyData: [],
            defaultCompany: "",
            logisticscompany: "",
            logisticsno: "",
            DialogTitle: "操作",
            cancelapply: false,
            Toobjection: false,
            Dialogstyle: {
                buttons: [
                    {
                        type: 'default',
                        label: '取消',
                        onClick: this.hideDialog.bind(this)
                    },
                    {
                        type: 'primary',
                        label: '确定',
                        onClick: this.updataState.bind(this)
                    }
                ]
            }
        }
    }


    componentWillMount() {
        this.loadAll();
        this.courierCompany();
    }

    componentDidMount() {
    }

    LeftClick() {
        HistoryManager.pageBack();
    }

    loadAll() {
        if(this.props.location.query.id){
            let self = this;
            let fromData = new FormData();
            fromData.append("id", self.state.id);
            fromData.append("webToken", localStorage.getItem('webToken'));
            fetch(getHost() + "/rest/buyer/orders/getOrderProductBackById", {
                method: 'POST',
                credentials: 'include',
                body: fromData
            }).then(response => response.json()).then(json => {
                if (json.result === 1) {
                    // self.showSuccess();
                    tillLoad = true;
                    self.setState({
                        backMsg: json.data.orderProductBack,
                        gooddetail: json.data.orderProduct,
                        backtype: json.data.orderProductBack.backtype,
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
        }else{
            let self = this;
            let fromData = new FormData();
            fromData.append("id", self.state.orderpdid);
            fromData.append("webToken", localStorage.getItem('webToken'));
            fetch(getHost() + "/rest/buyer/orders/getOrderProductBackByOrderProductId", {
                method: 'POST',
                credentials: 'include',
                body: fromData
            }).then(response => response.json()).then(json => {
                if (json.result === 1) {
                    // self.showSuccess();
                    tillLoad = true;
                    self.setState({
                        backMsg: json.data.orderProductBack,
                        gooddetail: json.data.orderProduct,
                        backtype: json.data.orderProductBack.backtype,
                        id:json.data.id,
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

    }

    //获取快递公司
    courierCompany() {
        let self = this;
        let fromData = new FormData();
        fromData.append("name", "物流公司");
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/common/getcommonDataValue", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                // self.showSuccess();
                tillLoad = true;
                let group = [];
                for (let i = 0; i < json.data.expressModels.length; i++) {
                    let item = {
                        label: "",
                        value: "",
                    };
                    item.label = (json.data.expressModels)[i].name;
                    item.value = (json.data.expressModels)[i].value;
                    group.push(item)
                }
                self.setState({
                    CompanyData: group,
                    defaultCompany: group[0].value
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

    hideDialog() {
        this.setState({
            cancelapply: false,
            Toobjection: false,
        });
    }

    //判断是点击了撤销申请/平台介入
    updataState() {
        if (this.state.cancelapply === true) {
            this.setState({
                status: 11,
            }, function () {
                this.updateRequest()
            });
        } else {
            this.setState({
                status: 6,
            }, function () {
                this.updateRequest()
            });
        }
    }

    //撤销申请或者申请介入
    updateRequest() {
        if (stop===false) {
            stop = true;//开启限制
            let self = this;
            let fromData = new FormData();
            fromData.append("id", self.state.id);
            fromData.append("state", self.state.status);
            fromData.append("backtype", self.state.backtype);
            fromData.append("webToken", localStorage.getItem('webToken'));
            fetch(getHost() + "/rest/buyer/orders/updateOrderProductBack", {
                method: 'POST',
                credentials: 'include',
                body: fromData
            }).then(response => response.json()).then(json => {
                if (json.result === 1) {
                    // self.showSuccess();
                    tillLoad = true;
                    stop=true;//开启限制
                    self.setState({
                        cancelapply: false,
                        Toobjection: false,
                    });
                    self.loadAll();
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
    }

    checkBacktype(backtype) {
        switch (backtype) {
            case 0:
                return "仅退款";
                break;
            case 1:
                return "退货退款";
                break;
            case 2:
                return "部分退货";
                break;
        }
    }
    showWarn(text) {
        this.setState({showWarn: true, tipText: text});
        this.state.warnTimer = setTimeout(() => {
            this.setState({showWarn: false});
        }, 2000);
    }

    checkIsreceive(isreceive) {
        switch (isreceive) {
            case 0:
                return "收到货物";
                break;
            case 1:
                return "未收到货物";
                break;
        }
    }

    //跳转到修改申请
    GoeditService(id) {
        let url = pathHeader+"/EditService?id=" + id;
        HistoryManager.register(url);
        location.href = url;
    }

    //物流公司的改变
    Componeychange(event) {
        this.setState({
            logisticscompany: event.target.value,
        });
    }

    //单号的填写和添加
    Ordernochange(event) {
        this.setState({
            logisticsno: event.target.value,
        });
    }

    //填写物流信息的提交
    addressUpdate() {
        if(!this.state.logisticsno){
            this.showWarn("物流单号未填写");
        }else{
            if (stop===false) {
                stop = true;//开启限制
                let self = this;
                let fromData = new FormData();
                fromData.append("id", self.state.id);
                fromData.append("state", 12);
                fromData.append("backtype", self.state.backtype);
                fromData.append("logisticsno", self.state.logisticsno);
                fromData.append("logisticscompany", self.state.logisticscompany);
                fromData.append("webToken", localStorage.getItem('webToken'));
                fetch(getHost() + "/rest/buyer/orders/updateOrderProductBack", {
                    method: 'POST',
                    credentials: 'include',
                    body: fromData
                }).then(response => response.json()).then(json => {
                    if (json.result === 1) {
                        // self.showSuccess();
                        stop=true;//开启限制
                        self.loadAll();
                        self.courierCompany();
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
        }
    }


    render() {
        let show = {
            display: "block",
            width: "100%",
            height: "100%",
            background: "#FAFAFA",
            fontSize: "1.2rem"
        };
        let text = "等待商家同意... ";
        let statusDiv = null;
        if (this.state.backMsg.state === 0) {
            text = "等待商家同意...";
            statusDiv = <div>
                <div className="mid_title">您已成功发起退货退款申请，请耐心等待商家处理。</div>
                <div className="mid_msg">
                    <span>*商家同意或者超时未处理，系统将退款给您。</span>
                    <br/>
                    <span>*如果商家拒绝，您可以修改申请后再次发起，商家会重新处理。</span>
                </div>
                <div className="mid_operate">
                    <span className="mid_Btn" style={{border: "1px solid #E8000E", color: "#E8000E"}}
                          onClick={e => this.GoeditService(this.state.id)}>修改申请</span>
                    <span className="mid_Btn"
                          onClick={e => this.setState({Toobjection: true, DialogTitle: "平台介入"})}>平台介入</span>
                    <span className="mid_Btn"
                          onClick={e => this.setState({cancelapply: true, DialogTitle: "撤销申请"})}>撤销申请</span>
                    <Dialog type="ios" title={this.state.DialogTitle} buttons={this.state.Dialogstyle.buttons}
                            show={this.state.cancelapply}>
                        即将撤销申请，确定继续？
                    </Dialog>
                    <Dialog type="ios" title={this.state.DialogTitle} buttons={this.state.Dialogstyle.buttons}
                            show={this.state.Toobjection}>
                        正在申请平台介入，确定继续？
                    </Dialog>
                </div>
            </div>;
        } else if (this.state.backMsg.state === 1) {
            text = "商家已同意退货退款";
            statusDiv = <div>
                <div className="mid_title">商家已同意申请!</div>
                <span>请将商品寄往以下地址:</span><br/>
                <div className="mid_msg">
                    <span>联系电话：{this.state.backMsg.contactphone}</span><br/>
                    <span>联系人：{this.state.backMsg.contact}</span><br/>
                    <span>退货地址：{this.state.backMsg.province}{this.state.backMsg.city}{this.state.backMsg.area}{this.state.backMsg.backaddress}</span><br/>
                    <span>物流公司：</span> <Select defaultValue={this.state.defaultCompany} data={this.state.CompanyData}
                                               onChange={this.Componeychange}/><br/>
                    <span>物流单号：</span><Input placeholder="请输入单号" onChange={this.Ordernochange}
                                             style={{display: "inlineBlock"}}/>
                </div>
                <div className="mid_operate">
                    <span className="mid_Btn" style={{border: "1px solid #E8000E", color: "#E8000E"}}
                          onClick={this.addressUpdate}>提交</span>
                </div>
            </div>;
        } else if (this.state.backMsg.state === 3) {
            text = "卖家验货成功，交易关闭。";
            statusDiv = <div>
                <div className="mid_title"> 卖家验货成功，交易关闭。</div>
                <span>货款已经原路返回，请注意查收。</span>
            </div>;
        } else if (this.state.backMsg.state === 4) {
            text = "商家不同意您的申请，您可申请平台介入。";
            statusDiv = <div>
                <div className="mid_title"> 商家不同意您的申请，您可申请平台介入。</div>
                <div className="mid_operate">
                    <span className="mid_Btn"
                          onClick={e => this.setState({Toobjection: true, DialogTitle: "平台介入"})}>平台介入</span>
                    <span className="mid_Btn"
                          onClick={e => this.setState({cancelapply: true, DialogTitle: "撤销申请"})}>撤销申请</span>
                    <Dialog type="ios" title={this.state.DialogTitle} buttons={this.state.Dialogstyle.buttons}
                            show={this.state.cancelapply}>
                        即将撤销申请，确定继续？
                    </Dialog>
                    <Dialog type="ios" title={this.state.DialogTitle} buttons={this.state.Dialogstyle.buttons}
                            show={this.state.Toobjection}>
                        正在申请平台介入，确定继续？
                    </Dialog>
                </div>
            </div>;
        } else if (this.state.backMsg.state === 6) {
            text = "您的申请平台正在处理中...";
            statusDiv = <div>
                <div className="mid_title"> 平台正在处理中，请耐心等待！</div>
                <div className="mid_operate">
                    <span className="mid_Btn"
                          onClick={e => this.setState({cancelapply: true, DialogTitle: "撤销申请"})}>撤销申请</span>
                    <Dialog type="ios" title={this.state.DialogTitle} buttons={this.state.Dialogstyle.buttons}
                            show={this.state.cancelapply}>
                        即将撤销申请，确定继续？
                    </Dialog>
                </div>
            </div>;
        } else if (this.state.backMsg.state === 7) {
            text = "平台处理完毕！！";
            statusDiv = <div>
                <div className="mid_title">卖方货物问题，平台同意退货！！</div>
                <span>请将商品寄往以下地址:</span>
                <div className="mid_msg">
                    <span>联系电话：{this.state.backMsg.contactphone}</span><br/>
                    <span>联系人：{this.state.backMsg.contact}</span><br/>
                    <span>退货地址：{this.state.backMsg.province}{this.state.backMsg.city}{this.state.backMsg.area}{this.state.backMsg.backaddress}</span><br/>
                    <span>物流公司：</span> <Select defaultValue={this.state.defaultCompany} data={this.state.CompanyData}
                                               onChange={this.Componeychange}/><br/>
                    <span>物流单号：</span><Input placeholder="请输入单号" onChange={this.Ordernochange}/>
                </div>
                <div className="mid_operate">
                    <span className="mid_Btn" style={{border: "1px solid #E8000E", color: "#E8000E"}}
                          onClick={this.addressUpdate}>提交</span>
                </div>
            </div>;
        } else if (this.state.backMsg.state === 8) {
            text = "平台处理完毕！！";
            statusDiv = <div>
                <div className="mid_title"> 货物没问题退款，扣除买家违约金！</div>
                <span>请将商品寄往以下地址:</span><br/>
                <div className="mid_msg">
                    <span>联系电话：{this.state.backMsg.contactphone}</span><br/>
                    <span>联系人：{this.state.backMsg.contact}</span><br/>
                    <span>退货地址：{this.state.backMsg.province}{this.state.backMsg.city}{this.state.backMsg.area}{this.state.backMsg.backaddress}</span><br/>
                    <span>物流公司： </span>
                    <Select defaultValue={this.state.defaultCompany} data={this.state.CompanyData}
                            onChange={this.Componeychange}/>
                    <br/>
                    <span>物流单号：<Input placeholder="请输入单号" onChange={this.Ordernochange}/></span>
                </div>
                <div className="mid_operate">
                    <span className="mid_Btn" style={{border: "1px solid #E8000E", color: "#E8000E"}}
                          onClick={this.addressUpdate}>提交</span>
                </div>
            </div>;
        } else if (this.state.backMsg.state === 9 && this.state.backMsg.backtype === 0) {
            text = "平台处理结果：不同意您的退款申请。";
            statusDiv = <div>
                <div className="mid_title"> 订单自动转待验收状态！！！</div>
            </div>;
        } else if (this.state.backMsg.state === 9 && this.state.backMsg.backtype !== 0) {
            text = "平台处理结果：不同意您的退款申请。";
            statusDiv = <div>
                <div className="mid_title"> 平台不同意退货，在验货列表中查看！！</div>
            </div>;
        } else if (this.state.backMsg.state === 10 || this.state.backMsg.state === 2) {
            text = "退款成功，交易关闭。";
            statusDiv = <div>
                <div className="mid_title"> 货款已经按原路返回您的账户，请注意查收！</div>
            </div>;
        } else if (this.state.backMsg.state === 11) {
            text = "您已撤销本次退款申请！";
            statusDiv = <div>

            </div>;
        } else if (this.state.backMsg.state === 12) {
            text = "商家确认验货中，请耐心等待...";
            statusDiv = <div>
                <div className="mid_title">商家验货中，请耐心等待。</div>
                <div className="mid_msg">
                    <span>联系电话：{this.state.backMsg.contactphone}</span><br/>
                    <span>联系人：{this.state.backMsg.contact}</span><br/>
                    <span>退货地址：{this.state.backMsg.province}{this.state.backMsg.city}{this.state.backMsg.area}{this.state.backMsg.backaddress}</span><br/>
                    <span>物流公司：{this.state.backMsg.logisticscompany}</span><br/>
                    <span>物流单号：{this.state.backMsg.logisticsno}</span>
                </div>
            </div>;
        }
        let navHeight = 4.4;
        let height = document.body.clientHeight * 37.5 / document.body.clientWidth - navHeight;
        let heightValue = height + "rem";
        return (
            <div style={{show}}>
                <NavigationBar Title="退款详情" LeftBar="true" LeftTitle="返回"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                <div style={{height: heightValue, paddingBottom: "0", overflowY: "scroll"}}>
                    <div className="back_header">
                        {text}
                    </div>
                    <div className="back_mid">
                        <span>{statusDiv}</span>
                    </div>
                    <div className="goods_information">
                        <span className="goods_header">退款商品信息</span>
                        <div className="goods_msg">
                            <div style={{
                                padding: "0.5rem",
                                fontSize: "1rem"
                            }}>{this.state.gooddetail.storename}-{this.state.gooddetail.deliverytime}</div>
                            <div style={{width: "100%"}}>
                                <div className="good_img">
                                    <img src={process.env.IMAGE_PRIFIX + this.state.gooddetail.pdpic} alt=""
                                         style={itemImg}/>
                                </div>
                                <div className="good_detail">
                                    <div style={{
                                        fontSize: "1.4rem",
                                        textOverflow: "ellipsis",
                                    }}>
                                        {this.state.gooddetail.pdname}  {this.state.gooddetail.standard}  {this.state.gooddetail.material}  {this.state.gooddetail.gradeno}
                                    </div>
                                    <div>{this.state.gooddetail.attrjson}</div>
                                    <div>
                                        <div
                                            style={{color: "#E8000E"}}>单价：￥{this.state.gooddetail.price}<span>/{this.state.gooddetail.unit}</span>
                                        </div>
                                        <div style={{color: "#E8000E"}}>总价：￥{this.state.gooddetail.actualpayment}
                                            <span className="gooddetail_num">x{this.state.gooddetail.num}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ul>
                            <li>退款编号：{this.state.backMsg.backno}</li>
                            <li>退货类型：{this.checkBacktype(this.state.backMsg.backtype)}</li>
                            <li>退货件数：{this.state.backMsg.pdnum}</li>
                            <li>退款金额：{this.state.backMsg.backmoney}</li>
                            <li>退款原因：{this.state.backMsg.returnbackreason}</li>
                            <li>货物状态：{this.checkIsreceive(this.state.backMsg.isreceivegoods)}</li>
                            <li>退货说明：{this.state.backMsg.backexplain}</li>
                        </ul>
                    </div>
                </div>
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
            </div>
        )
    }


}