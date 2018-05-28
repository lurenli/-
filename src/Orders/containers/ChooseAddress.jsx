import React, {Component} from 'react';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import WeUI from 'react-weui';
//import styles
import 'weui';

const {Cells, Cell, CellHeader, CellBody, CellFooter, Toptips} = WeUI;
let pathHeader='/weixin';
export default class ChooseAddress extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.RightClick = this.RightClick.bind(this);
        this.state = {
            addressList: []
        };
    }


    componentWillMount() {
        let self = this;
        let formData = new FormData();
        formData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/ShippingAddress/listShippingAddress", {
            method: 'POST',
            credentials: 'include',
            body: formData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                // self.showSuccess();
                let addressList = json.data.pageInfo.list;
                let defaultAddress = json.data.pageInfo.list.find(o => o.isdefault === 1);
                if (addressList.length === 0) {
                    console.log('未设置地址');
                    // vue.defaultaddress1 = false;
                    // vue.isShowAdd = true;
                    // vue.DefaultAddress = vue.addAddressInfo;
                }
                self.setState({
                    addressList: addressList,
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

    componentDidMount() {
    }

    LeftClick() {
        location.href = pathHeader+'/CreateOrder';
    }
    ChooseClick(id){
        location.href = pathHeader+'/CreateOrder?addressId=' + id;
    }
    RightClick() {
        location.href = pathHeader+'/MyAddress';
    }
    render() {
        return (
            <div>
                <NavigationBar Title="选择地址" LeftBar="true" LeftTitle="返回" RightBar="true"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick} RightTitle="管理" RightClick={this.RightClick}/>
                <Cells style={{fontSize:"1.2rem"}}>
                    {
                        this.state.addressList.map((item, i) =>
                            <Cell onClick={this.ChooseClick.bind(this,item.id)} key={i}>
                                <CellBody>
                                    <div>{item.shipto}<span style={{marginLeft:"1rem"}}>{item.phone}</span></div>
                                    <div>{item.province}{item.city}{item.citysmall}{item.address}</div>
                                </CellBody>
                            </Cell>)
                    }
                </Cells>
            </div>
        )
    }


}