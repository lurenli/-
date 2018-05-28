import React, {Component} from 'react';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import WeUI from 'react-weui';

//import styles
import 'weui';
import {orderCSS} from '../style/order.css';
import {detailCSS} from '../style/backDetail.css';

const {Form, FormCell, Cells, CellsTips, CellsTitle,Cell, CellHeader, CellBody, CellFooter, TextArea, Input, Label, Select,ButtonArea,Button} = WeUI;
let itemImg = {
    display: "block",
    width: "5rem",
    height: "5rem",
    padding:"1rem"
};
let bgStyle = {
    width: "100%",
    minHeight: "100%",
    background: "#F5F5F5",
    padding: "1rem 0.5rem",
    fontSize: "1.4rem"
};
let tillLoad = true;
let numDiv=null;
let stop=false;//防止重复提交
let pathHeader='/weixin';
export default class ApplyService extends Component {
    constructor(props) {
        super(props);
        this.backtypechange = this.backtypechange.bind(this);
        this.receivechange = this.receivechange.bind(this);
        this.reasonchange = this.reasonchange.bind(this);
        this.explainChange = this.explainChange.bind(this);
        this.saveApply = this.saveApply.bind(this);
        this.numchange=this.numchange.bind(this);
        this.state = {
            gooddetail:{},
            orderpdid: this.props.location.query.orderpdid,
            backtype:0,
            isreceivegoods:0,
            returnbackreason:"多拍/拍错/不想要",
            pic:"",
            backexplain:"",
            pdbackNum:0,
            backmoney:0,
            singMoney:0,
        }

    }


    componentWillMount() {
        this.loadData();
    }

    componentDidMount() {
    }

    LeftClick() {
        HistoryManager.pageBack();
    }

     loadData(){
         let self = this;
         let fromData = new FormData();
         fromData.append("id",self.state.orderpdid);
         fromData.append("webToken", localStorage.getItem('webToken'));
         fetch(getHost() + "/rest/buyer/orders/getOrderProductById", {
             method: 'POST',
             credentials: 'include',
             body: fromData
         }).then(response => response.json()).then(json => {
             if (json.result === 1) {
                 // self.showSuccess();
                 tillLoad = true;
                 let backmoney=json.data.orderProduct.actualpayment-json.data.orderProduct.freight;
                 self.setState({
                     gooddetail:json.data.orderProduct,
                     pdbackNum:json.data.orderProduct.num,
                     backmoney:backmoney,
                     singleMoney:json.data.orderProduct.price
                 });
                 numDiv=<span>{self.state.pdbackNum}</span>
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
    // 退货类型的改变
    backtypechange(event){
        let Nowbacktype = event.target.value;
        this.setState({
            backtype: Nowbacktype,
        });
    }
    //  部分退货数量的改变
    numchange(event){
        if(event.target.value){
            let money=1;
            money=this.state.singleMoney*parseFloat(event.target.value);
            money=money.toFixed(2);
            this.setState({
                pdbackNum:event.target.value,
                backmoney:money,
            });
        }else{
            this.setState({
                pdbackNum:"",
                backmoney:"0.00",
            });
        }

    }
    //是否收到货物
    receivechange(event){
        let Nowreceive = event.target.value;
        this.setState({
            isreceivegoods:Nowreceive,
        });
    }
    //退货原因的改变
    reasonchange(event){
        let Nowreason = event.target.value;
        this.setState({
            returnbackreason:Nowreason,
        });
    }
    //退款说明的改变
    explainChange(e) {
        this.setState({backexplain: e.target.value});
    }
    //确认
    saveApply(){
        if (stop===false) {
            stop = true;//开启限制
            let self = this;
            let fromData = new FormData();
            fromData.append("orderpdid",self.state.orderpdid);
            fromData.append("backtype",self.state.backtype);
            fromData.append("isreceivegoods",self.state.isreceivegoods);
            fromData.append("returnbackreason",self.state.returnbackreason);
            fromData.append("backexplain",self.state.backexplain);
            fromData.append("pdbackNum",self.state.pdbackNum);
            fromData.append("webToken", localStorage.getItem('webToken'));
            fetch(getHost() + "/rest/buyer/orders/saveOrderProductBack", {
                method: 'POST',
                credentials: 'include',
                body: fromData
            }).then(response => response.json()).then(json => {
                if (json.result === 1) {
                    // self.showSuccess();
                    stop=false;//关闭限制
                    let url =pathHeader+ "/ServiceDetail?id=" + json.data.orderProductBack.id;
                    // HistoryManager.register(url);
                    location.href = url;
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
    }
    render() {
        if(this.state.backtype!=2){
            numDiv=<span>{this.state.pdbackNum}</span>
        }else{
            numDiv=
                <Input placeholder="请输入退货件数" value={this.state.pdbackNum}  onChange={this.numchange}/>
        }
        return (
            <div style={bgStyle}>
                <NavigationBar Title="退货申请" LeftBar="true" LeftTitle="返回"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                <div>
                    <div className="goods_msg" >
                        <div style={{padding:"0.5rem",fontSize:"1rem"}}>{this.state.gooddetail.storename}-{this.state.gooddetail.deliverytime}</div>
                        <div style={{width: "100%"}}>
                            <div className="good_img">
                                <img src={process.env.IMAGE_PRIFIX  + this.state.gooddetail.pdpic} alt="" style={itemImg}/>
                            </div>
                            <div className="good_detail">
                                <div style={{fontSize:"1.4rem", overflow: "hidden",textOverflow: "ellipsis",whiteSpace: "nowrap"}}>
                                    {this.state.gooddetail.pdname}/{this.state.gooddetail.standard}/{this.state.gooddetail.material}/{this.state.gooddetail.gradeno}
                                </div>
                                <div>{this.state.gooddetail.attrjson}</div>
                                <div>
                                    <div style={{color:"#E8000E"}}>单价：￥{this.state.gooddetail.price}<span>/{this.state.gooddetail.unit}</span></div>
                                    <div style={{color:"#E8000E"}}>总价：￥{this.state.gooddetail.actualpayment}(运费：￥{this.state.gooddetail.freight})
                                        <span className="gooddetail_num">x{this.state.gooddetail.num}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Form>
                        <FormCell select selectPos="after">
                            <CellHeader>
                                <Label>服务类型</Label>
                            </CellHeader>
                            <CellBody>
                                <Select data={[
                                    {
                                        value: 0,
                                        label: '仅退款'
                                    },
                                    {
                                        value: 1,
                                        label: '退货退款'
                                    },
                                    {
                                        value: 2,
                                        label: '部分退货'
                                    }
                                ]} onChange={this.backtypechange}/>
                            </CellBody>
                            <CellFooter/>
                        </FormCell>
                        <FormCell select selectPos="after">
                            <CellHeader>
                                <Label>是否收到货</Label>
                            </CellHeader>
                            <CellBody>
                                <Select data={[
                                    {
                                        value: 0,
                                        label: '收到'
                                    },
                                    {
                                        value: 1,
                                        label: '未收到'
                                    }
                                ]} onChange={this.receivechange}/>
                            </CellBody>
                            <CellFooter/>
                        </FormCell>
                        <FormCell select selectPos="after">
                            <CellHeader>
                                <Label>退款原因</Label>
                            </CellHeader>
                            <CellBody>
                                <Select data={[
                                    {
                                        value: "多拍/拍错/不想要",
                                        label: '多拍/拍错/不想要'
                                    },
                                    {
                                        value:"未按约定时间发货",
                                        label: "未按约定时间发货"
                                    },
                                    {
                                        value:"少货",
                                        label: "少货"
                                    },
                                    {
                                        value:"快递一直没收到",
                                        label: "快递一直没收到"
                                    },
                                    {
                                        value:"其他",
                                        label: "其他"
                                    },
                                ]} onChange={this.reasonchange}/>
                            </CellBody>
                            <CellFooter/>
                        </FormCell>
                        <FormCell>
                            <CellHeader>
                                <Label>退货数量</Label>
                            </CellHeader>
                            <CellBody>
                                {numDiv}
                            </CellBody>
                        </FormCell>
                        <FormCell>
                            <CellHeader>
                                <Label>退款金额</Label>
                            </CellHeader>
                            <CellBody>
                                <span style={{color: "red"}}>￥{this.state.backmoney}</span>
                            </CellBody>
                        </FormCell>
                    </Form>
                    <CellsTitle>退货说明</CellsTitle>
                    <Form style={{marginTop:"0"}}>
                        <FormCell>
                            {/*<CellHeader>*/}
                            {/*<Label>退货说明</Label>*/}
                            {/*</CellHeader>*/}
                            <CellBody>
                                <div>
                                <TextArea placeholder=" 请描述您的问题" rows="3" maxLength={200}
                                          onChange={this.explainChange.bind(this)} value={this.state.backexplain}>
                                </TextArea>
                                </div>
                            </CellBody>
                        </FormCell>
                    </Form>
                    <ButtonArea>
                        <Button type="warn" onClick={this.saveApply}>提交</Button>
                    </ButtonArea>
                </div>
                </div>
        )
    }


}