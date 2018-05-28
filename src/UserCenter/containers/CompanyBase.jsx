import React, {Component} from 'react';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import WeUI from 'react-weui';
import 'weui';
import cnCity from "../../../assets/js/cnCity";

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
    Button
} = WeUI;
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
export default class CompanyBase extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.SaveClick = this.SaveClick.bind(this);
        this.state = {
            baseInfo: {
                username: "",

            },
            city_value: "",
            city_show: false,
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
        this.loadData();
    }

    componentDidMount() {

    }

    loadData() {
        let self = this;
        let fromData=new FormData();
        // fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/buyerCompanyInfo", {
            method: 'POST',
            credentials: 'include',
            body:fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                // self.showSuccess();
                let val = json.data.province + " " + json.data.city + " " + json.data.citysmall;
                self.setState({
                    // isLoading: false,
                    baseInfo: json.data,
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

    SaveClick() {
        let arr = this.state.city_value.split(" ");
        let province = arr[0];
        let city = arr[1];
        let citysmall = arr[2];
        let self = this;
        let fromData = new FormData();
        fromData.append("shortname", self.state.baseInfo.shortname);
        fromData.append("companyname", self.state.baseInfo.companyname);
        fromData.append("province", province);
        fromData.append("city", city);
        fromData.append("citysmall", citysmall);
        fromData.append("address", self.state.baseInfo.address);
        fromData.append("worktelephone", self.state.baseInfo.worktelephone);
        fetch(getHost() + "/rest/buyer/company/updateBasisInfo", {
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

    ShortChange(e) {
        let info = this.state.baseInfo;
        info.shortname = e.target.value;
        this.setState({baseInfo: info});
    }
    NameChange(e) {
        let info = this.state.baseInfo;
        info.companyname = e.target.value;
        this.setState({baseInfo: info});
    }
    AddressChange(e) {
        let info = this.state.baseInfo;
        info.address = e.target.value;
        this.setState({baseInfo: info});
    }
    PhoneChange(e) {
        let info = this.state.baseInfo;
        info.worktelephone = e.target.value;
        this.setState({baseInfo: info});
    }

    render() {
        return (
            <div>
                <div style={listStyle}>
                    <NavigationBar Title="基本信息" LeftBar="true" LeftTitle="返回"
                                   LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                    <Cells>
                        <Cell>
                            <CellHeader style={{width: "8rem"}}>单位简称</CellHeader>
                            <CellBody>
                                <Input value={this.state.baseInfo.shortname} onChange={this.ShortChange.bind(this)}/>
                            </CellBody>
                        </Cell>
                        <Cell>
                            <CellHeader style={{width: "8rem"}}>单位全称</CellHeader>
                            <CellBody>
                                <Input value={this.state.baseInfo.companyname} onChange={this.NameChange.bind(this)}/>
                            </CellBody>
                        </Cell>
                        <Cell access>
                            <CellHeader style={{width: "8rem"}}>单位地址</CellHeader>
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
                                <Input value={this.state.baseInfo.address} onChange={this.AddressChange.bind(this)}/>
                            </CellBody>
                        </Cell>
                        <Cell>
                            <CellHeader style={{width: "8rem"}}>单位电话</CellHeader>
                            <CellBody>
                                <Input value={this.state.baseInfo.worktelephone} onChange={this.PhoneChange.bind(this)}/>
                            </CellBody>
                        </Cell>
                    </Cells>
                </div>
                <div style={bottomStyle}>
                    <ButtonArea>
                        <Button onClick={this.SaveClick} type="warn">保存</Button>
                    </ButtonArea>
                </div>
                <CityPicker
                    data={cnCity}
                    onCancel={e => this.setState({city_show: false})}
                    onChange={text => this.setState({city_value: text, city_show: false})}
                    show={this.state.city_show}
                />
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
                <Toptips type="primary" show={this.state.showSuccess}>保存成功</Toptips>
            </div>
        )
    }


}