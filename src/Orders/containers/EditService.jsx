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
let stop=false;//防止重复提交
let numDiv=null;let pathHeader='/weixin';
export default class ApplyService extends Component {
    constructor(props) {
        super(props);
        this.explainChange = this.explainChange.bind(this);
        this.saveApply = this.saveApply.bind(this);
        this.state = {
            gooddetail:{},
            backdetail:{},
            id: this.props.location.query.id,
            backtype:0,
            pic:"",
            backexplain:"",
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
         this.setState({
             id: this.props.location.query.id,
         });
         let self = this;
         let fromData = new FormData();
         fromData.append("id",self.state.id);
         fromData.append("webToken", localStorage.getItem('webToken'));
         fetch(getHost() + "/rest/buyer/orders/getOrderProductBackById", {
             method: 'POST',
             credentials: 'include',
             body: fromData
         }).then(response => response.json()).then(json => {
             if (json.result === 1) {
                 // self.showSuccess();
                 tillLoad = true;
                 console.log(json)
                 self.setState({
                     gooddetail:json.data.orderProduct,
                     backdetail:json.data.orderProductBack,
                     backexplain:json.data.orderProductBack.backexplain,
                     backtype:json.data.orderProductBack.backtype,
                 });
                 // numDiv=<span>{this.state.pdbackNum}</span>
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
    //退款说明的改变
    explainChange(e) {
        this.setState({backexplain: e.target.value});
    }
    checkBacktype(backtype){
        switch (backtype){
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
    //是否收到货物
    checkIsreceive(isreceive){
        switch (isreceive){
            case 0:
                return "收到";
                break;
            case 1:
                return "未收到";
                break;
        }
    }
    //确认
    saveApply(){
        if (stop===false) {
            stop = true;//开启限制
            let self = this;
            let fromData = new FormData();
            fromData.append("id",self.state.id);
            fromData.append("state",0);
            fromData.append("backtype",self.state.backtype);
            fromData.append("backexplain",self.state.backexplain);
            fromData.append("webToken", localStorage.getItem('webToken'));
            fetch(getHost() + "/rest/buyer/orders/updateOrderProductBack", {
                method: 'POST',
                credentials: 'include',
                body: fromData
            }).then(response => response.json()).then(json => {
                if (json.result === 1) {
                    // self.showSuccess();
                    stop=false;//关闭限制
                    let url = pathHeader+"/ServiceDetail?id=" + self.state.id;
                    HistoryManager.register(url);
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
        return (
            <div style={bgStyle}>
                <NavigationBar Title="修改退款申请" LeftBar="true" LeftTitle="返回"
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
                        <FormCell>
                            <CellHeader>
                                <Label>服务类型</Label>
                            </CellHeader>
                            <CellBody>
                                {this.checkBacktype(this.state.backdetail.backtype)}
                            </CellBody>
                            <CellFooter/>
                        </FormCell>
                        <FormCell>
                            <CellHeader>
                                <Label>是否收到货</Label>
                            </CellHeader>
                            <CellBody>
                                {this.checkIsreceive(this.state.backdetail.isreceivegoods)}
                            </CellBody>
                            <CellFooter/>
                        </FormCell>
                        <FormCell>
                            <CellHeader>
                                <Label>退款原因</Label>
                            </CellHeader>
                            <CellBody>
                                {this.state.backdetail.returnbackreason}
                            </CellBody>
                            <CellFooter/>
                        </FormCell>
                        <FormCell>
                            <CellHeader>
                                <Label>退货数量</Label>
                            </CellHeader>
                            <CellBody>
                                {this.state.backdetail.pdnum}
                            </CellBody>
                        </FormCell>
                        <FormCell>
                            <CellHeader>
                                <Label>退款金额</Label>
                            </CellHeader>
                            <CellBody>
                                <span style={{color: "red"}}>￥{this.state.backdetail.backmoney}</span>
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