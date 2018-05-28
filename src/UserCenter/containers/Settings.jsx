import React, {Component} from 'react';
import WeUI from 'react-weui';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import 'weui';

const {
    Cells,
    Cell,
    CellHeader,
    CellBody,
    CellFooter,
    ButtonArea,
    Button,
    Dialog
} = WeUI;
let pathHeader='/weixin';
export default class Settings extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.ResetLoginPwd = this.ResetLoginPwd.bind(this);
        this.ResetPayPwd = this.ResetPayPwd.bind(this);
        this.ResetPhone = this.ResetPhone.bind(this);
        this.AboutUs = this.AboutUs.bind(this);
        this.Feedback = this.Feedback.bind(this);
        this.ShowDialog = this.ShowDialog.bind(this);
        this.state = {
            showDialog: false,
            dialogStyle: {
                title: '退出登录',
                buttons: [
                    {
                        type: 'default',
                        label: '取消',
                        onClick: this.HideDialog.bind(this)
                    },
                    {
                        type: 'primary',
                        label: '确认退出',
                        onClick: this.Logout.bind(this)
                    }
                ]
            }
        };
    }


    componentWillMount() {

    }

    componentDidMount() {
    }

    LeftClick() {
        HistoryManager.pageBack();
    }

    ResetLoginPwd() {
        let url = pathHeader+"/ResetLoginPassword";
        HistoryManager.register(url);
        location.href = url;
    }

    ResetPayPwd() {
        let url = pathHeader+"/ResetPayPassword";
        HistoryManager.register(url);
        location.href = url;
    }

    ResetPhone() {
        let url = pathHeader+"/ResetPhone";
        HistoryManager.register(url);
        location.href = url;
    }

    AboutUs() {
        let url = pathHeader+"/AboutUs";
        HistoryManager.register(url);
        location.href = url;
    }

    Feedback() {
        let url = pathHeader+"/Feedback";
        HistoryManager.register(url);
        location.href = url;
    }

    HideDialog() {
        this.setState({showDialog: false});
    }

    ShowDialog() {
        this.setState({showDialog: true})
    }

    Logout() {
        let fromData = new FormData();
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/wap/logout", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                localStorage.clear();
                HistoryManager.removeAll();
                // localStorage.setItem("login","0");//未登录
                location.href = pathHeader+'/Login'
            } else {
                console.log(json.message)
            }
        }).catch(e => {
            console.log("网络出现了点问题：" + e);
        });
    }

    render() {
        return (
            <div style={{background: "#eee", height: "100%"}}>
                <NavigationBar Title="设置" LeftBar="true" LeftTitle="返回"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                <Cells>
                    <Cell access onClick={this.ResetLoginPwd}>
                        <CellBody>
                            修改登录密码
                        </CellBody>
                        <CellFooter>
                        </CellFooter>
                    </Cell>
                    <Cell access onClick={this.ResetPayPwd}>
                        <CellBody>
                            修改支付密码
                        </CellBody>
                        <CellFooter>
                        </CellFooter>
                    </Cell>
                    <Cell access onClick={this.ResetPhone}>
                        <CellBody>
                            修改验证手机
                        </CellBody>
                        <CellFooter>
                        </CellFooter>
                    </Cell>
                </Cells>
                <Cells>
                    <Cell access onClick={this.AboutUs}>
                        <CellBody>
                            关于我们
                        </CellBody>
                        <CellFooter>
                        </CellFooter>
                    </Cell>
                    <Cell access onClick={this.Feedback}>
                        <CellBody>
                            咨询反馈
                        </CellBody>
                        <CellFooter>
                        </CellFooter>
                    </Cell>
                </Cells>
                {/*<Cells>*/}
                {/*<Cell access onClick={this.Clear}>*/}
                {/*<CellBody>*/}
                {/*清除缓存*/}
                {/*</CellBody>*/}
                {/*<CellFooter>*/}
                {/*</CellFooter>*/}
                {/*</Cell>*/}
                {/*</Cells>*/}
                <ButtonArea direction="horizontal">
                    <Button type="warn" onClick={this.ShowDialog}>退出登录</Button>
                </ButtonArea>
                <Dialog type="ios" title={this.state.dialogStyle.title} buttons={this.state.dialogStyle.buttons}
                        show={this.state.showDialog}>
                    您确认要退出登录吗？
                </Dialog>
            </div>
        )
    }


}