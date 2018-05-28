import React, {Component} from 'react';
import WeUI from 'react-weui';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
//import styles
import 'weui';
import {CSS} from '../styles/Register.css';

const {
    ButtonArea,
    Button,
    CellsTitle,
    Cells,
    Cell,
    CellHeader,
    CellBody,
    CellFooter,
    Label,
    Input,
    TextArea,
    Toptips,
    Form,
    Gallery,
    GalleryDelete,
    Uploader,
    ActionSheet
} = WeUI;
let bgStyle = {
    width: "100%",
    minHeight: "100%",
    background: "#F5F5F5",
    padding: "1rem 0.5rem",
    fontSize: "1.4rem"
};let pathHeader='/weixin';
export default class Feedback extends Component {
    constructor(props) {
        super(props);
        this.PhotoClick = this.PhotoClick.bind(this);
        this.LeftClick = this.LeftClick.bind(this);
        this.RightClick = this.RightClick.bind(this);
        this.HandonClick=this.HandonClick.bind(this);
        this.state = {
            type: "",
            dataList: [],
            questionText: "",
            phone: "",
            gallery: false,
            demoFiles: [
                // {
                //     url: thumbSrc,
                // },
                // {
                //     url: photoSrc
                // },
                // {
                //     url: thumbSrc
                // },
                // {
                //     url: photoSrc,
                //     error: true
                // },
                // {
                //     url: thumbSrc,
                //     status: '50%'
                // }
            ],
            menu_show: false,
            menus: [{
                label: <a href="tel:0571-57173777">拨打电话：0571-57173777</a>,
                onClick: () => {
                    this.setState({menu_show: false})
                }
            }],
            actions: [
                {
                    label: '取消',
                    onClick: this.hide.bind(this)
                }
            ],
            call_show: false,
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

    hide() {
        this.setState({
            menu_show: false,
        });
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

    componentWillMount() {
        this.loadData();
    }

    componentDidMount() {
    }

    loadData() {//获取反馈类型
        let self = this;
        let formData = new FormData();
        formData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/feedback/feedBackType/list", {
            method: 'POST',
            credentials: 'include',
            body: formData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                self.setState({dataList: json.data, type: json.data[0].id});
            } else if (json.result === 2) {//登录失效
                HistoryManager.register(pathHeader+'/Login');
                location.href = pathHeader+'/Login';
            } else {
                self.showWarn("取消订单失败");
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

    RightClick() {
        this.setState({menu_show: true});
    }

    PhotoClick() {
        document.getElementById('feedbackPhoto').click();
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

    QuestionChange(e) {
        this.setState({questionText: e.target.value});
    }

    PhoneChange(e) {
        this.setState({phone: e.target.value});
    }

    SelectClick(typeId) {
        this.setState({type: typeId});
    }

    HandonClick() {//提交
        if (!this.state.type) {
            this.showWarn("请选择问题类型");
        } else if (!this.state.questionText) {
            this.showWarn("请输入问题描述");
        } else {
            let self = this;
            let formData = new FormData();
            formData.append("feedbackTypeId", self.state.type);//
            formData.append("feedbackContent", self.state.questionText);//
            formData.append("phone", self.state.phone);//
            fetch(getHost() + "/rest/buyer/feedback/add", {
                method: 'POST',
                credentials: 'include',
                body: formData
            }).then(response => response.json()).then(json => {
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
    }

    render() {
        return (
            <div style={bgStyle}>
                <NavigationBar Title="咨询&反馈" LeftBar="true" LeftTitle="返回"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}
                               RightBar="true" RightIconSrc="/assets/images/userCenter/feedback_icon_call.png"
                               RightClick={this.RightClick}/>
                <div className="call" style={this.state.call_show ? {display: "flex"} : {display: "none"}}>

                </div>
                <div style={{width: "100%", background: "white"}}>
                    <div id="questionType">
                        选择问题类型＊
                        <ul className="questionType">
                            {
                                this.state.dataList.map((item, i) =>
                                    <li name={item.id} key={i} onClick={this.SelectClick.bind(this, item.id)}
                                        style={this.state.type === item.id ? {
                                            color: "red",
                                            borderColor: "red"
                                        } : {color: "#000", borderColor: "#eee"}}>{item.typeName}</li>
                                )
                            }
                        </ul>
                    </div>
                    <div style={{padding: "0.5rem 2rem"}}>
                        <TextArea placeholder=" 请描述您的问题" rows="3" maxLength={200}
                                  onChange={this.QuestionChange.bind(this)} value={this.state.questionText}>
                        </TextArea>
                    </div>
                    {/*<div style={{padding: "1rem 2rem"}}>*/}
                    {/*<img style={{width: "4rem", height: "4rem"}} alt="显示您上传的图片"*/}
                    {/*src="/assets/images/userCenter/user_feedback_takephoto.png" onClick={this.PhotoClick}/>*/}
                    {/*</div>*/}
                    {/*<input type="file" accept="image/*" capture="camera" id="feedbackPhoto"*/}
                    {/*onChange={this.uploadFunction}/>*/}
                </div>
                <div style={{width: "100%", background: "white", marginTop: "1rem", padding: "0.5rem 1rem"}}>
                    <Input type="text" placeholder="留下您的联系方式" onChange={this.PhoneChange.bind(this)}
                           value={this.state.phone}/>

                </div>
                <div style={{fontSize: "1.2rem", color: "#707070", padding: "0.5rem 1rem"}}>如需咨询，请点击右上角联系电话客服</div>
                <ButtonArea>
                    <Button type="warn" onClick={this.HandonClick}>提交</Button>
                </ButtonArea>
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
                <Toptips type="primary" show={this.state.showSuccess}>提交成功</Toptips>
                <ActionSheet
                    menus={this.state.menus}
                    actions={this.state.actions}
                    show={this.state.menu_show}
                    type="android"
                    onRequestClose={e => this.setState({menu_show: false})}
                />
            </div>

        )
    }


}