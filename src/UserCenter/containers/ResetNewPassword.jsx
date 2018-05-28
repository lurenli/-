//Nicccce
import React, {Component} from 'react';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import WeUI from 'react-weui';
import Base64 from "../../../assets/js/Base64";

const {
    Button,
    CellsTitle,
    Cells,
    Cell,
    CellHeader,
    CellBody,
    Label,
    Dialog,
    Input,
} = WeUI;
const info_btn = {
    position: 'absolute',
    borderRadius: '5px',
    background: '#0088EC',
    bottom: '6rem',
    left: '2rem',
    right: '2rem',
};

//校验密码：只能输入6-20个字母、数字、下划线
function isPasswd(s) {
    var patrn = /^(\w){6,20}$/;
    if (!patrn.exec(s)) return false
    return true
}

export default class ResetNewPassword extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.CheckClick = this.CheckClick.bind(this);
        // this.Show = this.Show.bind(this);
        this.Hide = this.Hide.bind(this);
        this.state = ({
            userName:this.props.location.query.userName,
            token: this.props.location.query.token,
            showAuto: false,
            msg: "密码修改成功",
            style: {
                buttons: [
                    {
                        label: '好的',
                        onClick: this.Hide
                    }
                ]
            },
        })
    }

    componentWillMount() {
        // fetch(  "/province").then(response => response.json())
        //     .then(d => {
        //         let provinceData = d.data;
        //         if (provinceData && provinceData.length > 0) {
        //             fetch(  "/incubator/province").then(response => response.json())
        //                 .then(dd => {
        //                     console.log(JSON.stringify(dd));
        //                     this.setState({provinceData: provinceData, incubatorData: dd.data})
        //                 });
        //         } else {
        //             alert("暂无数据！");
        //         }
        //     });
    }

    LeftClick() {
        HistoryManager.pageBack();
    }

    CheckClick() {
        let firstPassword = document.getElementById("firstPassword").value;
        let secondPassword = document.getElementById("secondPassword").value;
        //校验密码：只能输入6-20个字母、数字、下划线
        let msg = "";
        if (firstPassword == "" || secondPassword == "") {
            msg = "密码信息未输入完整";
            this.setState({msg: msg, showAuto: true});
        } else if (!isPasswd(firstPassword) || !isPasswd(secondPassword)) {
            msg = "密码格式错误，只能输入6-20个字母、数字、下划线";
            this.setState({msg: msg, showAuto: true});
            document.getElementById("firstPassword").value = "";
            document.getElementById("secondPassword").value = "";
        } else if (firstPassword != secondPassword) {
            msg = "两次输入的密码不一致";
            this.setState({msg: msg, showAuto: true});
            document.getElementById("firstPassword").value = "";
            document.getElementById("secondPassword").value = "";
        } else {
            //fetch
            let fromData = new FormData();
            fromData.append("username", this.state.userName);
            fromData.append("token", this.state.token);
            fromData.append("password", Base64.encode(firstPassword));
            fetch(getHost() + "/rest/forgetPassword/step2", {
                method: 'POST',
                credentials: 'include',
                body: fromData
            }).then(response => response.json()).then(json => {
                if (json.result===1) {
                    msg = "密码修改成功";
                    this.setState({msg: msg, showAuto: true});
                    console.log(json)
                } else {
                    msg = "密码修改失败,请重试";
                    this.setState({msg: msg, showAuto: true});
                    console.log(json)
                }
            }).catch(e => {
                console.log("网络出现了点问题：" + e);
                msg = "网络出现了点问题,请稍后再试";
                this.setState({msg: msg, showAuto: true});
            });
        }


    }

    // Show(){
    //     this.setState({ showAuto: true});
    // }
    Hide() {
        this.setState({showAuto: false});
        if (this.state.msg == "密码修改成功") {
            HistoryManager.pageBackTwice();
        }
    }


    render() {
        return (
            <div>
                <NavigationBar Title="重置密码" LeftBar="true" LeftTitle="返回"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                {/*<CellsTitle className="title_text">重设密码</CellsTitle>*/}
                <Cells>
                    <Cell>
                        <CellHeader>
                            <Label>新密码</Label>
                        </CellHeader>
                        <CellBody>
                            <Input type="password" id="firstPassword" placeholder="请输入新密码"/>
                        </CellBody>
                    </Cell>
                    <Cell>
                        <CellHeader>
                            <Label>确认密码</Label>
                        </CellHeader>
                        <CellBody>
                            <Input type="password" id="secondPassword" placeholder="请再次输入您的新密码"/>
                        </CellBody>
                    </Cell>
                </Cells>
                <div style={info_btn}>
                    <Button type="warn" onClick={this.CheckClick}>完成</Button>
                </div>
                <Dialog title={this.state.style.title} buttons={this.state.style.buttons} show={this.state.showAuto}>
                    {this.state.msg}
                </Dialog>
            </div>
        )
    }


}
