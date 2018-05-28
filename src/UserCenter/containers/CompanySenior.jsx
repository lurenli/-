import React, {Component} from 'react';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import WeUI from 'react-weui';
import 'weui';
import $ from 'jquery';
import {formatDate} from "../../../assets/js/common";

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
    Uploader,
    Gallery,
    GalleryDelete
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
let uploadImg = {
    padding: "0.5rem",
    border: "1px solid red",
    color: "red",
    margin: "1rem",
    fontSize: "1.2rem"
};
const BackButtonStyle = {
    display: 'inline-block',
    width: 'auto',
    color: 'white',
    border: 'none',
    position: 'absolute',
    // top: '5px',
    left: '15px',
    bottom: '0'
};
export default class CompanySenior extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.SaveClick = this.SaveClick.bind(this);
        this.PhotoClick = this.PhotoClick.bind(this);
        this.WatchClick = this.WatchClick.bind(this);
        this.state = {
            baseInfo: {
                username: "",

            },
            gallery: false,
            imgSrc: "/assets/images/userCenter/user_feedback_takephoto.png",
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
        let fromData = new FormData();
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/buyerCompanyInfo", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                // self.showSuccess();
                let val = json.data.province + " " + json.data.city + " " + json.data.citysmall;
                self.setState({
                    // isLoading: false,
                    baseInfo: json.data,
                    imgSrc: json.data.businesslicencenumberphoto ?
                        process.env.IMAGE_PRIFIX + json.data.businesslicencenumberphoto
                        : "/assets/images/userCenter/user_feedback_takephoto.png"
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

    BankChange(e) {
        let info = this.state.baseInfo;
        info.bankname = e.target.value;
        this.setState({baseInfo: info});
    }

    AccountChange(e) {
        let info = this.state.baseInfo;
        info.bankaccount = e.target.value;
        this.setState({baseInfo: info});
    }

    PersonChange(e) {
        let info = this.state.baseInfo;
        info.legalperson = e.target.value;
        this.setState({baseInfo: info});
    }

    MobileChange(e) {
        let info = this.state.baseInfo;
        info.mobile = e.target.value;
        this.setState({baseInfo: info});
    }

    NumberChange(e) {
        let info = this.state.baseInfo;
        info.taxregistrationcertificate = e.target.value;
        this.setState({baseInfo: info});
    }

    SaveClick() {
        let self = this;
        let fromData = new FormData();
        fromData.append("bankname", self.state.baseInfo.bankname);
        fromData.append("bankaccount", self.state.baseInfo.bankaccount);
        fromData.append("legalperson", self.state.baseInfo.legalperson);
        fromData.append("mobile", self.state.baseInfo.mobile);
        fromData.append("taxregistrationcertificate", self.state.baseInfo.taxregistrationcertificate);
        fetch(getHost() + "/rest/buyer/company/updateVipInfo", {
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

    PhotoClick() {
        document.getElementById('feedbackPhoto').click();
    }

    WatchClick() {
        this.setState({
            gallery: true
        })
    }

    uploadFunction(e) {

        let value = e.target.files[0];
        console.log(value.name);
        // let reader = new FileReader();
        // reader.onload = function (e) {
        //     $('#feedbackPhoto').attr('src', e.target.result);
        // };
        // reader.readAsDataURL(value);
    }

    renderGallery() {
        if (!this.state.gallery) return false;

        let srcs = this.state.demoFiles.map(file => file.url)

        return (
            <Gallery
                src={srcs}
                show
                defaultIndex={this.state.gallery.id}
                onClick={e => {
                    //avoid click background item
                    e.preventDefault()
                    e.stopPropagation();
                    this.setState({gallery: false})
                }}
            >

                <GalleryDelete onClick={(e, id) => {
                    this.setState({
                        demoFiles: this.state.demoFiles.filter((e, i) => i != id),
                        gallery: this.state.demoFiles.length <= 1 ? true : false
                    })
                }}/>

            </Gallery>
        )
    }

    render() {
        return (
            <div>
                <div style={listStyle}>
                    <NavigationBar Title="高级信息" LeftBar="true" LeftTitle="返回"
                                   LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                    <Cells>
                        <Cell>
                            <CellHeader style={{width: "8rem"}}>开户银行</CellHeader>
                            <CellBody>
                                <Input value={this.state.baseInfo.bankname} onChange={this.BankChange.bind(this)}/>
                            </CellBody>
                        </Cell>
                        <Cell>
                            <CellHeader style={{width: "8rem"}}>银行帐号</CellHeader>
                            <CellBody>
                                <Input value={this.state.baseInfo.bankaccount}
                                       onChange={this.AccountChange.bind(this)}/>
                            </CellBody>
                        </Cell>
                        <Cell>
                            <CellHeader style={{width: "8rem"}}>法人代表</CellHeader>
                            <CellBody>
                                <Input value={this.state.baseInfo.legalperson} onChange={this.PersonChange.bind(this)}/>
                            </CellBody>
                        </Cell>
                        <Cell>
                            <CellHeader style={{width: "8rem"}}>联系手机</CellHeader>
                            <CellBody>
                                <Input value={this.state.baseInfo.mobile} onChange={this.MobileChange.bind(this)}/>
                            </CellBody>
                        </Cell>
                        <Cell>
                            <CellHeader style={{width: "8rem"}}>单位税号</CellHeader>
                            <CellBody>
                                <Input value={this.state.baseInfo.taxregistrationcertificate}
                                       onChange={this.NumberChange.bind(this)}/>
                            </CellBody>
                        </Cell>
                        <Cell>
                            <CellBody>
                                <div>单位营业执照
                                    <div
                                        style={{display: "inline-block", padding: "0 2rem", verticalAlign: "text-top"}}>
                                        <img style={{width: "10rem", height: "10rem"}} alt="显示您上传的图片"
                                             src={this.state.imgSrc}
                                             onClick={this.WatchClick}/>
                                        {/*<span style={uploadImg}*/}
                                        {/*onClick={this.PhotoClick}>更换图片</span>*/}
                                    </div>
                                    {/*<input type="file" accept="image/*" capture="camera" id="feedbackPhoto"*/}
                                    {/*onChange={this.uploadFunction}/>*/}
                                </div>
                                {/*<img  style={{width:"15rem",height:"8rem"}} src={process.env.IMAGE_PRIFIX  + this.state.baseInfo.businesslicencenumberphoto}/>*/}
                            </CellBody>
                        </Cell>
                    </Cells>
                </div>
                <div style={bottomStyle}>
                    <ButtonArea>
                        <Button onClick={this.SaveClick} type="warn">保存</Button>
                    </ButtonArea>
                </div>
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
                <Toptips type="primary" show={this.state.showSuccess}>保存成功</Toptips>
                <Gallery src={this.state.imgSrc} show={this.state.gallery}>
                    <Button
                        style={BackButtonStyle}
                        onClick={e => this.setState({gallery: false})}
                        plain
                    >
                        Back
                    </Button>
                    {/*<GalleryDelete*/}
                    {/*onClick={(e, i) => alert('click deleted id:' + i)}*/}
                    {/*/>*/}
                </Gallery>
            </div>
        )
    }


}