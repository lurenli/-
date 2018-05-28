import React from 'react';
import {Route, IndexRoute, Redirect} from 'react-router';
import index from '../src/index.jsx';

//path
import Home from '../src/Home.jsx';//home
import Login from '../src/UserCenter/containers/Login.jsx';//登录
import LoginBind from '../src/UserCenter/containers/LoginBind.jsx';//登录绑定
import Register from '../src/UserCenter/containers/RegisterAccount.jsx';//注册
import ResetPassword from '../src/UserCenter/containers/ResetPassword.jsx';//找回密码
import ResetNewPassword from '../src/UserCenter/containers/ResetNewPassword.jsx';//重置密码
import Pay from '../src/Shop/containers/Pay.jsx';//支付
//商城模块
import Shop from '../src/Shop/containers/Shop.jsx';//商城首页
import SearchProduct from '../src/Shop/containers/SearchProduct.jsx';//搜索页
import SearchOther from '../src/Shop/containers/SearchOther.jsx';//非紧固件的搜索页
import AllCategories from '../src/Shop/containers/AllCategories.jsx';//分类
import CategoryDetail from '../src/Shop/containers/CategoryDetail.jsx';//分类详情
import EvaluationList from '../src/Shop/containers/EvaluationList.jsx';//全部评价
import ProductDetail from '../src/Shop/containers/ProductDetail.jsx';//商品详情
import ActivitiesShop from '../src/Shop/containers/ActivitiesShop.jsx';//活动展区
import ActivityDetail from '../src/Shop/containers/ActivityDetail.jsx';//活动详情
//消息模块
import Messages from '../src/Message/containers/Messages.jsx';//消息首页
import MessageDetail from '../src/Message/containers/MessageDetail.jsx';//消息详情
//购物车模块
import ShoppingCart from '../src/ShoppingCart/containers/ShoppingCart.jsx';//购物车
//订单模块
import MyOrders from '../src/Orders/containers/MyOrders.jsx';//订单首页
import OrderDetails from '../src/Orders/containers/OrderDetails.jsx';//订单详情
import PublishEvaluation from '../src/Orders/containers/PublishEvaluation.jsx';//发布评价
import ApplyService from '../src/Orders/containers/ApplyService.jsx';//申请售后
import EditService from '../src/Orders/containers/EditService.jsx';//修改售后申请
import CustomerService from '../src/Orders/containers/CustomerService.jsx';//退货退款
import TalkingHistory from '../src/Orders/containers/TalkingHistory.jsx';//协商历史
import CreateOrder from '../src/Orders/containers/CreateOrder.jsx';//创建订单
import ChooseReceipt from '../src/Orders/containers/ChooseReceipt.jsx';//选择发票
import ChooseAddress from '../src/Orders/containers/ChooseAddress.jsx';//选择地址
import PaySuccess from '../src/Orders/containers/PaySuccess.jsx';//支付成功
import ServiceList from '../src/Orders/containers/ServiceList.jsx';//退货退款列表
import ServiceDetail from '../src/Orders/containers/ServiceDetail.jsx';//退货退款流程详情
//我的模块
import UserCenter from '../src/UserCenter/containers/UserCenter.jsx';//我的（用户中心）
import AccountInfo from '../src/UserCenter/containers/AccountInfo.jsx';//账户信息
import CompanyBase from '../src/UserCenter/containers/CompanyBase.jsx';//公司基本信息
import CompanySenior from '../src/UserCenter/containers/CompanySenior.jsx';//公司高级信息
import MyMoney from '../src/UserCenter/containers/MyMoney.jsx';//我的余额
import BillDetailMoney from '../src/UserCenter/containers/BillDetailMoney.jsx';//余额明细
import MyMoneyRecharge from '../src/UserCenter/containers/MyMoneyRecharge.jsx';//充值
import MyMoneyCash from '../src/UserCenter/containers/MyMoneyCash.jsx';//提现
import MyMoneyCashHistory from '../src/UserCenter/containers/MyMoneyCashHistory.jsx';//提现明细
import MyFacility from '../src/UserCenter/containers/MyFacility.jsx';//我的授信
import BillDetailFacility from '../src/UserCenter/containers/BillDetailFacility.jsx';//授信明细
import MyBankCard from '../src/UserCenter/containers/MyBankCard.jsx';//我的银行卡
import MyBankCardAdd from '../src/UserCenter/containers/MyBankCardAdd.jsx';//新增银行卡
import MyBankCardEdit from '../src/UserCenter/containers/MyBankCardEdit.jsx';//编辑银行卡
import MyReceipt from '../src/UserCenter/containers/MyReceipt.jsx';//我的开票
import MyReceiptAdd from '../src/UserCenter/containers/MyReceiptAdd.jsx';//添加开票、
import MyReceiptEdit from '../src/UserCenter/containers/MyReceiptEdit.jsx';//编辑发票信息
import MyAddress from '../src/UserCenter/containers/MyAddress.jsx';//我的地址
import MyAddressEdit from '../src/UserCenter/containers/MyAddressEdit.jsx';//编辑地址
import MyAddressAdd from '../src/UserCenter/containers/MyAddressAdd.jsx';//添加地址
import MyCollection from '../src/UserCenter/containers/MyCollection.jsx';//我的收藏
import ToJudge from '../src/UserCenter/containers/ToJudge.jsx';//推广
import Settings from '../src/UserCenter/containers/Settings.jsx';//设置
import AboutUs from '../src/UserCenter/containers/AboutUs.jsx';//关于
import FeedbackList from '../src/UserCenter/containers/FeedbackList.jsx';//反馈列表
import Feedback from '../src/UserCenter/containers/Feedback.jsx';//反馈
import ResetPhone from '../src/UserCenter/containers/ResetPhone.jsx';//修改手机
import ResetNewPhone from '../src/UserCenter/containers/ResetNewPhone.jsx';//新手机
import ResetLoginPassword from '../src/UserCenter/containers/ResetLoginPassword.jsx';//修改支付密码
import ResetPayPassword from '../src/UserCenter/containers/ResetPayPassword.jsx';//修改支付密码
import wuyiActive from '../src/ActivePage/containers/wuyiActice';//轮播图活动页面----五一促销
import ResearchCenter from '../src/ResearchCenter/containers/ResearchCenter';//紧固件研发中心介绍
import AppActive from '../src/ActivePage/containers/AppActive';//app--检查注册领取红包页面
import AppSuccess from '../src/ActivePage/containers/AppSuccess';//app--检查注册----成功领取页面
import AppRegister from '../src/ActivePage/containers/AppRegister';//app--未注册的注册页面
let baseName = '/weixin';
export default (
    <Route path={baseName} component={index}>
        <IndexRoute component={Home}/>
        <Route path={baseName + "/Home"} component={Home}/>
        <Route path={baseName + "/Login"} component={Login}/>
        <Route path={baseName + "/LoginBind"} component={LoginBind}/>
        <Route path={baseName + "/Register"} component={Register}/>
        <Route path={baseName + "/ResetPassword"} component={ResetPassword}/>
        <Route path={baseName + "/ResetNewPassword"} component={ResetNewPassword}/>
        <Route path={baseName + "/Shop"} component={Shop}/>
        <Route path={baseName + "/SearchProduct"} component={SearchProduct}/>
        <Route path={baseName + "/SearchOther"} component={SearchOther}/>
        <Route path={baseName + "/AllCategories"} component={AllCategories}/>
        <Route path={baseName + "/CategoryDetail"} component={CategoryDetail}/>
        <Route path={baseName + "/EvaluationList"} component={EvaluationList}/>
        <Route path={baseName + "/ProductDetail"} component={ProductDetail}/>
        <Route path={baseName + "/ActivitiesShop"} component={ActivitiesShop}/>
        <Route path={baseName + "/ActivityDetail"} component={ActivityDetail}/>

        <Route path={baseName + "/Messages"} component={Messages}/>
        <Route path={baseName + "/MessageDetail"} component={MessageDetail}/>
        <Route path={baseName + "/ShoppingCart"} component={ShoppingCart}/>

        <Route path={baseName + "/MyOrders"} component={MyOrders}/>
        <Route path={baseName + "/OrderDetails"} component={OrderDetails}/>
        <Route path={baseName + "/PublishEvaluation"} component={PublishEvaluation}/>
        <Route path={baseName + "/ApplyService"} component={ApplyService}/>
        <Route path={baseName + "/EditService"} component={EditService}/>
        <Route path={baseName + "/CustomerService"} component={CustomerService}/>
        <Route path={baseName + "/TalkingHistory"} component={TalkingHistory}/>
        <Route path={baseName + "/CreateOrder"} component={CreateOrder}/>
        <Route path={baseName + "/ChooseReceipt"} component={ChooseReceipt}/>
        <Route path={baseName + "/ChooseAddress"} component={ChooseAddress}/>
        <Route path={baseName + "/Pay"} component={Pay}/>
        <Route path={baseName + "/PaySuccess"} component={PaySuccess}/>
        <Route path={baseName + "/ServiceList"} component={ServiceList}/>
        <Route path={baseName + "/ServiceDetail"} component={ServiceDetail}/>

        <Route path={baseName + "/UserCenter"} component={UserCenter}/>
        <Route path={baseName + "/AccountInfo"} component={AccountInfo}/>
        <Route path={baseName + "/CompanyBase"} component={CompanyBase}/>
        <Route path={baseName + "/CompanySenior"} component={CompanySenior}/>
        <Route path={baseName + "/MyMoney"} component={MyMoney}/>
        <Route path={baseName + "/BillDetailMoney"} component={BillDetailMoney}/>
        <Route path={baseName + "/MyMoneyRecharge"} component={MyMoneyRecharge}/>
        <Route path={baseName + "/MyMoneyCash"} component={MyMoneyCash}/>
        <Route path={baseName + "/MyMoneyCashHistory"} component={MyMoneyCashHistory}/>
        <Route path={baseName + "/MyFacility"} component={MyFacility}/>
        <Route path={baseName + "/BillDetailFacility"} component={BillDetailFacility}/>
        <Route path={baseName + "/MyBankCard"} component={MyBankCard}/>
        <Route path={baseName + "/MyBankCardAdd"} component={MyBankCardAdd}/>
        <Route path={baseName + "/MyBankCardEdit"} component={MyBankCardEdit}/>
        <Route path={baseName + "/MyReceipt"} component={MyReceipt}/>
        <Route path={baseName + "/MyReceiptAdd"} component={MyReceiptAdd}/>
        <Route path={baseName + "/MyReceiptEdit"} component={MyReceiptEdit}/>
        <Route path={baseName + "/MyAddress"} component={MyAddress}/>
        <Route path={baseName + "/MyAddressEdit"} component={MyAddressEdit}/>
        <Route path={baseName + "/MyAddressAdd"} component={MyAddressAdd}/>
        <Route path={baseName + "/MyCollection"} component={MyCollection}/>
        <Route path={baseName + "/ToJudge"} component={ToJudge}/>
        <Route path={baseName + "/Settings"} component={Settings}/>
        <Route path={baseName + "/AboutUs"} component={AboutUs}/>
        <Route path={baseName + "/FeedbackList"} component={FeedbackList}/>
        <Route path={baseName + "/Feedback"} component={Feedback}/>
        <Route path={baseName + "/ResetPhone"} component={ResetPhone}/>
        <Route path={baseName + "/ResetNewPhone"} component={ResetNewPhone}/>
        <Route path={baseName + "/ResetPayPassword"} component={ResetPayPassword}/>
        <Route path={baseName + "/ResetLoginPassword"} component={ResetLoginPassword}/>

        <Route path={baseName + "/wuyiActive"} component={wuyiActive}/>
        <Route path={baseName + "/AppActive"} component={AppActive}/>
        <Route path={baseName + "/AppRegister"} component={AppRegister}/>
        <Route path={baseName + "/AppSuccess"} component={AppSuccess}/>
        <Route path={baseName + "/ResearchCenter"} component={ResearchCenter}/>
    </Route>
);