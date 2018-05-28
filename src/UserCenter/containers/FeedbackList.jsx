import React, {Component} from 'react';
import WeUI from 'react-weui';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import Loading from '../../Common/Loading/Loading.jsx';
//import styles
import 'weui';

const {
    Cells,
    Cell,
    CellHeader,
    CellBody,
    Toptips
} = WeUI;

export default class FeedbackList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            isLoading: true,
            noneText: "暂无反馈信息",
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

    componentWillMount() {
        this.loadData();
    }

    componentDidMount() {
    }

    loadData() {
        let self = this;
        self.setState({isLoading: true});
        let fromData = new FormData();
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/feedback/list", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                // self.showSuccess();
                self.setState({
                    isLoading: false,
                    dataList: json.data
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

    render() {
        return (
            <div>
                <NavigationBar Title="咨询反馈" LeftBar="true" LeftTitle="返回"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                <div>
                    {
                        this.state.dataList.map((item, i) =>
                            <div key={i}>{i}</div>
                        )
                    }
                    <Loading show={this.state.isLoading} length={this.state.dataList.length}
                             text={this.state.noneText}/>
                </div>
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
            </div>
        )
    }


}