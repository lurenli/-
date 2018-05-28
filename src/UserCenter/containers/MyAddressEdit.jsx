import React, {Component} from 'react';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import WeUI from 'react-weui';
import 'weui';
import cnCity from '../../../assets/js/cnCity.js'
import Loading from '../../Common/Loading/Loading.jsx';

const {
    Label,
    Input,
    Cells,
    Cell,
    CellHeader,
    CellBody,
    CellFooter,
    ButtonArea,
    Button,
    TextArea,
    CityPicker,
    Toptips,
} = WeUI;

let bgStyle = {
    width: "100%",
    minHeight: "100%",
    background: "#F5F5F5",
    fontSize: "1.4rem"
};
let bottomStyle = {
    position: "absolute",
    width: "100%",
    height: "7rem",
    bottom: "0",
};
let listStyle = {
    width: "100%",
    position: "absolute",
    top: "0",
    bottom: "7rem",
};
let stop = false;
let pathHeader = '/weixin';
export default class MyAddressEdit extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.CheckClick = this.CheckClick.bind(this);
        this.state = {
            addressInfo: {},
            id: this.props.location.query.id,
            city_show: false,
            city_value: '',
            data: [{id: 'name', items: 'sub'}],
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
            HistoryManager.pageBack();
        }, 2000);

    }

    componentWillMount() {

    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        let dataInfo = localStorage.getItem("editAddress") ? JSON.parse(localStorage.getItem("editAddress")) : {};
        let val = dataInfo.province + " " + dataInfo.city + " " + dataInfo.citysmall;
        this.setState({addressInfo: dataInfo, city_value: val, isLoading: false});
    }

    LeftClick() {
        HistoryManager.pageBack();
    }

    CheckClick() {//confirm
        if(this.state.addressInfo.address&&this.state.addressInfo.shipto&&this.state.addressInfo.phone){
            if (!stop) {
                stop = true;//请求中
                let arr = this.state.city_value.split(" ");
                let province = arr[0];
                let city = arr[1];
                let citysmall = arr[2];
                let self = this;
                let fromData = new FormData();
                fromData.append("id", self.state.id);
                fromData.append("shipto", self.state.addressInfo.shipto);
                fromData.append("province", province);
                fromData.append("city", city);
                fromData.append("citysmall", citysmall);
                fromData.append("address", self.state.addressInfo.address);
                fromData.append("phone", self.state.addressInfo.phone);
                fromData.append("isdefault", self.state.addressInfo.isdefault);
                fromData.append("webToken", localStorage.getItem('webToken'));
                fetch(getHost() + "/rest/buyer/ShippingAddress/updateShippingAddress", {
                    method: 'POST',
                    credentials: 'include',
                    body: fromData
                }).then(response => response.json()).then(json => {
                    stop = false;//请求修改完成
                    if (json.result === 1) {
                        console.log(json);
                        self.showSuccess();
                    } else if (json.result === 2) {//登录失效
                        HistoryManager.register(pathHeader + '/Login');
                        location.href = pathHeader + '/Login';
                    } else {
                        self.showWarn(json.message);
                    }
                }).catch(e => {
                    console.log("网络出现了点问题：" + e);
                    self.showWarn("网络出现了点问题");
                });
            }
        }else{
            this.showWarn("信息不全！！");
        }
    }

    ShipChange(e) {
        let info = this.state.addressInfo;
        info.shipto = e.target.value;
        this.setState({addressInfo: info})
    }

    PhoneChange(e) {
        let info = this.state.addressInfo;
        info.phone = e.target.value;
        this.setState({addressInfo: info})
    }

    AddressChange(e) {
        let info = this.state.addressInfo;
        info.address = e.target.value;
        this.setState({addressInfo: info})
    }


    render() {
        return (
            <div style={bgStyle}>
                <div style={listStyle}>
                    <NavigationBar Title="编辑收货地址" LeftBar="true" LeftTitle="返回"
                                   LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                    {this.state.isLoading ?
                        <Loading show={this.state.isLoading} length={1}/> :
                        <div style={{background: "white"}}>
                            <Cell>
                                <CellHeader>
                                    <Label>收货人</Label>
                                </CellHeader>
                                <CellBody>
                                    <Input type="name" placeholder="请输入" onChange={this.ShipChange.bind(this)}
                                           value={this.state.addressInfo.shipto}/>
                                </CellBody>
                            </Cell>
                            <Cell>
                                <CellHeader>
                                    <Label>联系电话</Label>
                                </CellHeader>
                                <CellBody>
                                    <Input type="tel" placeholder="请输入电话" onChange={this.PhoneChange.bind(this)}
                                           value={this.state.addressInfo.phone}/>
                                </CellBody>
                            </Cell>
                            <Cell access>
                                <CellHeader>
                                    <Label>所在地区</Label>
                                </CellHeader>
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
                                <CellBody>
                                <TextArea placeholder="请填写详细地址" rows="3" onChange={this.AddressChange.bind(this)}
                                          maxLength={200} value={this.state.addressInfo.address}></TextArea>
                                </CellBody>
                            </Cell>

                        </div>
                    }
                </div>
                <div style={bottomStyle}>
                    <ButtonArea>
                        <Button onClick={this.CheckClick} type="warn">确定</Button>
                    </ButtonArea>
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