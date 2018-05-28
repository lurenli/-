import React, {Component} from 'react';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import Loading from '../../Common/Loading/Loading.jsx';
import WeUI from 'react-weui';

const {Toptips} = WeUI;

let menuStyle = {
    width: "100%",
    // display: "flex",
};
let menuItem = {
    width: "25%",
    display: "inline-block",
    textAlign: "center",
    padding: "0.5rem 0"
};
let menuImg = {
    width: "3rem",
    height: "3rem",
};
let pathHeader='/weixin';
export default class AllCategories extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.state = {
            categories: [],
            isLoading: true,
            showWarn: false,
            warnTimer: null,
            tipText: "",
        }
    }


    componentWillMount() {
        this.getProductCategories();
    }

    componentDidMount() {
    }

    showWarn(text) {
        this.setState({showWarn: true, tipText: text});

        this.state.warnTimer = setTimeout(() => {
            this.setState({showWarn: false});
        }, 2000);
    }

    getProductCategories() {
        let self = this;
        let fromData = new FormData();
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/common/getProductCategories", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {
                console.log(json);
                // self.showSuccess();
                let list = json.data;
                self.setState({categories: list,isLoading: false});
            } else {
                self.showWarn(json.message);
                console.log(json.message)
            }
        }).catch(e => {
            console.log("网络出现了点问题：" + e);
            self.showWarn("网络出现了点问题");
        });
    }
    //catetype   紧固件--直接到紧固件搜索列表，其他类（非紧固件的产品页）
    CategoryDetail(name,catetype) {
        if(catetype==="紧固件"){
           let  url = pathHeader+'/SearchProduct?keyword='+name;
            HistoryManager.register(url);
            location.href = url;
        }else{
            let url = pathHeader+"/CategoryDetail?level1=" + name;
            HistoryManager.register(url);
            location.href = url;
        }
    }

    LeftClick() {
        HistoryManager.pageBack();
    }

    render() {
        return (
            <div>
                <NavigationBar Title="全部分类" LeftBar="true" LeftTitle="返回"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                <div style={menuStyle}>
                    {
                        this.state.categories.map((item, i) =>
                            <div key={i} style={menuItem} onClick={this.CategoryDetail.bind(this,item.name,item.catetype)}>
                                <img
                                    style={menuImg} src={process.env.IMAGE_PRIFIX  + item.img}/><p>{item.name}</p>
                            </div>
                        )
                    }
                    <Loading show={this.state.isLoading} length={this.state.categories.length}
                             text={this.state.noneText}/>
                </div>

                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
            </div>
        )
    }


}