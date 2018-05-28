import React, {Component} from 'react';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import WeUI from 'react-weui';
import 'weui';
import cnCity from '../../../assets/js/cnCity.js'

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
    Toptips
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
let switchStyle = {
    width: "3rem",
    height: "3rem",
    float: "right"
};let pathHeader='/weixin';
let stop = false;//防止多次提交
export default class MyAddressAdd extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.CheckClick = this.CheckClick.bind(this);
        this.SwitchClick = this.SwitchClick.bind(this);
        this.state = {
            shipto:"",
            phone:"",
            address:"",
            isdefault:0,
            city_show: false,
            city_value: '',
            data: [{id: 'name', items: 'sub'}],
            showWarn: false,
            showSuccess: false,
            warnTimer: null,
            successTimer: null,
            tipText: "",
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
    }

    LeftClick() {
        HistoryManager.pageBack();
    }

    CheckClick() {//Add
      if(this.state.address&&this.state.city_value&&this.state.phone&&this.state.shipto){
          if (!stop) {
              stop = true;//请求中
              let arr = this.state.city_value.split(" ");
              let province = arr[0];
              let city = arr[1];
              let citysmall = arr[2];
              let self = this;
              let fromData = new FormData();
              fromData.append("shipto", self.state.shipto);
              fromData.append("province", province);
              fromData.append("city", city);
              fromData.append("citysmall", citysmall);
              fromData.append("address", self.state.address);
              fromData.append("phone", self.state.phone);
              fromData.append("isdefault", self.state.isdefault);
              fromData.append("webToken", localStorage.getItem('webToken'));
              fetch(getHost() + "/rest/buyer/ShippingAddress/addShippingAddress", {
                  method: 'POST',
                  credentials: 'include',
                  body: fromData
              }).then(response => response.json()).then(json => {
                  stop = false;//请求修改完成
                  if (json.result === 1) {
                      console.log(json);
                      self.showSuccess();
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
      }else{
          this.showWarn("信息不全");
      }

    }

    ShipChange(e) {
        this.setState({shipto: e.target.value})
    }

    PhoneChange(e) {
        this.setState({phone: e.target.value})
    }

    AddressChange(e) {
        this.setState({address: e.target.value})
    }

    SwitchClick() {
        if(this.state.isdefault===1){
            this.setState({isdefault: 0});
        }else{
            this.setState({isdefault: 1});
        }
    }

    render() {
        return (
            <div style={bgStyle}>
                <div style={listStyle}>
                    <NavigationBar Title="添加收货地址" LeftBar="true" LeftTitle="返回"
                                   LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                    <div style={{background: "white"}}>
                        <Cell>
                            <CellHeader>
                                <Label>收货人</Label>
                            </CellHeader>
                            <CellBody>
                                <Input type="name" placeholder="请输入" onChange={this.ShipChange.bind(this)}
                                       value={this.state.shipto}/>
                            </CellBody>
                        </Cell>
                        <Cell>
                            <CellHeader>
                                <Label>联系电话</Label>
                            </CellHeader>
                            <CellBody>
                                <Input type="tel" placeholder="请输入电话" onChange={this.PhoneChange.bind(this)}
                                       value={this.state.phone}/>
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
                                <TextArea placeholder="请填写详细地址" rows="3" maxLength={200}
                                          onChange={this.AddressChange.bind(this)}
                                          value={this.state.address}></TextArea>
                            </CellBody>
                        </Cell>
                        <Cell>
                            <CellHeader>
                                <Label>设为默认</Label>
                            </CellHeader>
                            <CellBody onClick={this.SwitchClick}>
                                <img style={switchStyle}
                                     src={this.state.isdefault === 1 ? "/assets/images/userCenter/user_switch_on.png" : "/assets/images/userCenter/user_switch_off.png"}/>
                            </CellBody>
                        </Cell>
                    </div>
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
                <Toptips type="primary" show={this.state.showSuccess}>添加成功</Toptips>
            </div>
        )
    }


}