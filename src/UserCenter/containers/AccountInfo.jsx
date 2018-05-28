import React, {Component} from 'react';
import WeUI from 'react-weui';

import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
//import styles
import 'weui';
import {CSS} from '../../../assets/common.css';
import Loading from '../../Common/Loading/Loading.jsx';
import cnCity from "../../../assets/js/cnCity";
import CompanySenior from "./CompanySenior";


const {
    Tab, NavBarItem,
    Cells,
    Cell,
    CellHeader,
    CellBody,
    CellFooter,
    Toptips,
    Input,
    CityPicker,
    ButtonArea,
    Button,
    ActionSheet
} = WeUI;
let bottomStyle = {
    width: "100%",
    height: "7rem",
};
let tabs = {
    width: "100%",
    display: "flex",
    height: "5rem",
    lineHeight: "5rem",
    textAlign: "center",
    borderBottom: "1px solid #CCCCCC"
};
let chooseTab = {
    flex: 1,
    background: "red",
    color: "white",
    fontSize: "1.5rem"
};
let defaultTab = {
    flex: 1,
    background: "white",
    color: "black",
    fontSize: "1.5rem"
};
let pathHeader = '/weixin';
export default class AccountInfo extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.CompanyBase = this.CompanyBase.bind(this);
        this.CompanySenior = this.CompanySenior.bind(this);
        this.OpenMenu = this.OpenMenu.bind(this);
        this.SaveClick = this.SaveClick.bind(this);
        this.state = {
            showIndex: 1,//tabshow
            city_value: "",
            city_show: false,
            menu_show: false,
            menus: [{
                label: <a>男</a>,
                onClick: () => {
                    this.setState({sex: "male", menu_show: false})
                }
            }, {
                label: '女',
                onClick: () => {
                    this.setState({sex: "female", menu_show: false})
                }
            }],
            actions: [
                {
                    label: '取消',
                    onClick: this.hide.bind(this)
                }
            ],
            showWarn: false,
            showSuccess: false,
            warnTimer: null,
            successTimer: null,
            tipText: "",
            isLoading: true,
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

    showSuccess() {
        this.setState({showSuccess: true});

        this.state.warnTimer = setTimeout(() => {
            this.setState({showSuccess: false});
            // HistoryManager.pageBack();
        }, 2000);

    }

    hide() {
        this.setState({
            menu_show: false,
        });
    }

    componentWillMount() {
        this.loadData();
    }

    componentDidMount() {
    }

    loadData() {
        let self = this;
        // self.setState({isLoading: true});
        let fromData = new FormData();
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/common/db/userInfo", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                // self.showSuccess();
                let val = json.data.province ? json.data.province : "" + " " + json.data.city ? json.data.city : "" + " " + json.data.citysmall ? json.data.citysmall : '';
                self.setState({
                    isLoading: false,
                    favicon: json.data.favicon,
                    username: json.data.username,
                    realname: json.data.realname,
                    sex: json.data.sex,
                    email: json.data.email,
                    mobile: json.data.mobile,
                    faxes: json.data.faxes,
                    telephone: json.data.telephone,
                    address: json.data.address,
                    postcode: json.data.postcode,
                    wxpay: json.data.wxpay,
                    alipay: json.data.alipay,
                    qq: json.data.qq,
                    hobby: json.data.hobby,
                    invitecode: json.data.invitecode,
                    city_value: val
                });
            } else {
                self.showWarn("获取失败");
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

    CompanyBase() {
        let url = pathHeader + "/CompanyBase";
        HistoryManager.register(url);
        location.href = url;
    }

    CompanySenior() {
        let url = pathHeader + "/CompanySenior";
        HistoryManager.register(url);
        location.href = url;
    }

    CheckSex(sex) {
        let sexCh = "男";
        if (sex === "female") {
            sexCh = "女";
        }
        return sexCh;
    }

    OpenMenu() {
        this.setState({menu_show: true})
    }

    SaveClick() {
        let arr = this.state.city_value && this.state.city_value.length > 1 ? this.state.city_value.split(" ") : ["", "", ""];
        let province = arr[0];
        let city = arr[1];
        let citysmall = arr[2];
        let self = this;
        let fromData = new FormData();
        fromData.append("favicon", self.state.favicon);
        fromData.append("realname", self.state.realname);
        fromData.append("sex", self.state.sex);
        fromData.append("email", self.state.email);
        fromData.append("faxes", self.state.faxes);
        fromData.append("telephone", self.state.telephone);
        fromData.append("postcode", self.state.postcode);
        fromData.append("province", province);
        fromData.append("city", city);
        fromData.append("citysmall", citysmall);
        fromData.append("address", self.state.address);
        fromData.append("wxpay", self.state.wxpay);
        fromData.append("alipay", self.state.alipay);
        fromData.append("qq", self.state.qq);
        fromData.append("hobby", self.state.hobby);
        fromData.append("invitecode", self.state.invitecode);
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/updareMemberInfo", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                self.showSuccess();
            } else {
                self.showWarn(json.message);
                console.log(json.message)
            }
        }).catch(e => {
            console.log("网络出现了点问题：" + e);
            self.showWarn("网络出现了点问题");
        });
    }

    RealChange(e) {
        this.setState({realname: e.target.value});
    }

    EmailChange(e) {
        this.setState({email: e.target.value});
    }

    FaxesChange(e) {
        this.setState({faxes: e.target.value});
    }

    PhoneChange(e) {
        this.setState({telephone: e.target.value});
    }

    AddressChange(e) {
        this.setState({address: e.target.value});
    }

    PostCodeChange(e) {
        this.setState({postcode: e.target.value});
    }

    WxChange(e) {
        this.setState({wxpay: e.target.value});
    }

    AlipayChange(e) {
        this.setState({alipay: e.target.value});
    }

    QQChange(e) {
        this.setState({qq: e.target.value});
    }

    HobbyChange(e) {
        this.setState({hobby: e.target.value});
    }

    InviteChange(e) {
        this.setState({invitecode: e.target.value});
    }

    TabClick(index) {
        this.setState({showIndex: index});
    }


    render() {
        let navHeight = 4.4;
        let height = document.body.clientHeight * 37.5 / document.body.clientWidth - navHeight - 5;
        let heightValue = height + "rem";
        return (
            <div>
                <NavigationBar Title="账户信息" LeftBar="true" LeftTitle="返回"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                <div style={tabs}>
                    <div style={this.state.showIndex === 1 ? chooseTab : defaultTab}
                         onClick={this.TabClick.bind(this, 1)}>基本信息
                    </div>
                    <div style={this.state.showIndex === 2 ? chooseTab : defaultTab}
                         onClick={this.TabClick.bind(this, 2)}>公司信息
                    </div>
                </div>
                <div style={this.state.showIndex === 1 ? {display: "block",height:heightValue,overflowX:"scroll"} : {display: "none"}}>
                    <Cells>
                        <Cell>
                            <CellHeader style={{width: "8rem"}}>用户名</CellHeader>
                            <CellBody>
                                <span style={{fontSize:"1.4rem"}}>{this.state.username}</span>
                            </CellBody>
                        </Cell>
                        <Cell>
                            <CellHeader style={{width: "8rem"}}>姓名</CellHeader>
                            <CellBody>
                                <Input value={this.state.realname} onChange={this.RealChange.bind(this)}/>
                            </CellBody>
                        </Cell>
                        <Cell access>
                            <CellHeader style={{width: "8rem"}}>性别</CellHeader>
                            <CellBody onClick={this.OpenMenu}>
                                <span style={{fontSize:"1.4rem"}}>{this.CheckSex(this.state.sex)}</span>
                            </CellBody>
                            <CellFooter/>
                        </Cell>
                        <Cell>
                            <CellHeader style={{width: "8rem"}}>邮箱</CellHeader>
                            <CellBody>
                                <Input value={this.state.email} onChange={this.EmailChange.bind(this)}/>
                            </CellBody>
                        </Cell>
                        <Cell>
                            <CellHeader style={{width: "8rem"}}>手机号</CellHeader>
                            <CellBody>
                                <span style={{fontSize:"1.4rem"}}>{this.state.mobile}</span>
                            </CellBody>
                        </Cell>
                        <Cell>
                            <CellHeader style={{width: "8rem"}}>传真</CellHeader>
                            <CellBody>
                                <Input value={this.state.faxes} onChange={this.FaxesChange.bind(this)}/>
                            </CellBody>
                        </Cell>
                        <Cell>
                            <CellHeader style={{width: "8rem"}}>固定电话</CellHeader>
                            <CellBody>
                                <Input value={this.state.telephone} onChange={this.PhoneChange.bind(this)}/>
                            </CellBody>
                        </Cell>

                        <Cell access>
                            <CellHeader style={{width: "8rem"}}>联系地址</CellHeader>
                            <CellBody>
                                <Input type="text"
                                       value={this.state.city_value}
                                       onClick={e => {
                                           e.preventDefault();
                                           this.setState({city_show: true})
                                       }}
                                       placeholder="请选择"
                                       readOnly={true}/>
                            </CellBody>
                            <CellFooter/>
                        </Cell>
                        <Cell>
                            <CellHeader style={{width: "8rem"}}>详细地址</CellHeader>
                            <CellBody>
                                <Input value={this.state.address} onChange={this.AddressChange.bind(this)}/>
                            </CellBody>
                        </Cell>
                        <Cell>
                            <CellHeader style={{width: "8rem"}}>邮编</CellHeader>
                            <CellBody>
                                <Input value={this.state.postcode} onChange={this.PostCodeChange.bind(this)}/>
                            </CellBody>
                        </Cell>
                        <Cell>
                            <CellHeader style={{width: "8rem"}}>微信</CellHeader>
                            <CellBody>
                                <Input value={this.state.wxpay} onChange={this.WxChange.bind(this)}/>
                            </CellBody>
                        </Cell>
                        <Cell>
                            <CellHeader style={{width: "8rem"}}>支付宝</CellHeader>
                            <CellBody>
                                <Input value={this.state.alipay} onChange={this.AlipayChange.bind(this)}/>
                            </CellBody>
                        </Cell>
                        <Cell>
                            <CellHeader style={{width: "8rem"}}>QQ</CellHeader>
                            <CellBody>
                                <Input value={this.state.qq} onChange={this.QQChange.bind(this)}/>
                            </CellBody>
                        </Cell>
                        <Cell>
                            <CellHeader style={{width: "8rem"}}>爱好</CellHeader>
                            <CellBody>
                                <Input value={this.state.hobby} onChange={this.HobbyChange.bind(this)}/>
                            </CellBody>
                        </Cell>
                        <Cell>
                            <CellHeader style={{width: "8rem"}}>邀请码</CellHeader>
                            <CellBody>
                                <Input value={this.state.invitecode} onChange={this.InviteChange.bind(this)}/>
                            </CellBody>
                        </Cell>

                    </Cells>
                    <div style={bottomStyle}>
                        <ButtonArea>
                            <Button onClick={this.SaveClick} type="warn">保存</Button>
                        </ButtonArea>
                    </div>
                    <ActionSheet
                        menus={this.state.menus}
                        actions={this.state.actions}
                        show={this.state.menu_show}
                        type="ios"
                        onRequestClose={e => this.setState({menu_show: false})}
                    />
                </div>
                <div style={this.state.showIndex === 2 ? {display: "block"} : {display: "none"}}>
                    <Cells>
                        <Cell access onClick={this.CompanyBase}>
                            <CellHeader>单位基本信息</CellHeader>
                            <CellBody>
                            </CellBody>
                            <CellFooter/>
                        </Cell>
                        <Cell access onClick={this.CompanySenior}>
                            <CellHeader>单位高级信息</CellHeader>
                            <CellBody>
                            </CellBody>
                            <CellFooter/>
                        </Cell>
                    </Cells>
                </div>
                <CityPicker
                    data={cnCity}
                    onCancel={e => this.setState({city_show: false})}
                    onChange={text => this.setState({city_value: text, city_show: false})}
                    show={this.state.city_show}
                />
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
                <Toptips type="primary" show={this.state.showSuccess}>修改成功</Toptips>
            </div>
        )
    }


}