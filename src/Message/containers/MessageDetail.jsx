import React, {Component} from 'react';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import WeUI from 'react-weui';
import {messageCSS} from '../style/message.css';
const {
    Tab, NavBarItem,
    Cells,
    Cell,
    CellHeader,
    CellBody,
    Toptips
} = WeUI;
let timeStyle = {
    width: "100%",
    height: "3rem",
    lineHeight: "3rem",
    textAlign: "right",
    fontSize: "1.2rem",
    padding: "0 1rem"
};
let titleStyle = {
    width: "100%",
    fontSize: "1.6rem",
    textAlign: "center",
    padding: "0.5rem"
};
export default class MessageDetail extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.state = {
            articleId: this.props.location.query.id,
            doctitle: "",
            doccontent: "",
            creattime: "",
            showWarn: false,
            warnTimer: null,
            tipText: "",
        };
        this.state.warnTimer && clearTimeout(this.state.warnTimer);
    }

    showWarn(text) {
        this.setState({showWarn: true, tipText: text});

        this.state.warnTimer = setTimeout(() => {
            this.setState({showWarn: false});
        }, 2000);
    }

    FormatTime(dateStr) {
        let date = new Date(dateStr);//如果date为13位不需要乘1000
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
        let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return Y + M + D + h + m + s;
    }

    componentWillMount() {
        this.loadData();
    }

    componentDidMount() {
    }

    loadData() {
        let self = this;
        let fromData = new FormData();
        fromData.append("articleId", self.state.articleId);
        fetch(getHost() + "/rest/front/ArticeFront/article/detail", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                // self.showSuccess();
                self.setState({
                    doctitle: json.data.doctitle,
                    doccontent: json.data.doccontent,
                    creattime: json.data.creattime,
                    docpic: json.data.pic,
                });
            } else {
                self.showWarn("信息获取失败");
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

    render() {
        return (
            <div style={{height: "100%", overflow: "scroll"}}>
                <NavigationBar Title={this.state.doctitle} LeftBar="true" LeftTitle="返回"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                <div style={titleStyle}>{this.state.doctitle}</div>
                <div style={timeStyle}>{this.FormatTime(this.state.creattime)}</div>
                <div>
                    <img  style={{width:"100%",height:"20rem"}} src={process.env.IMAGE_PRIFIX + this.state.docpic}/>
                </div>
                <div id="danger" dangerouslySetInnerHTML={{__html: this.state.doccontent}}></div>
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
            </div>
        )
    }


}