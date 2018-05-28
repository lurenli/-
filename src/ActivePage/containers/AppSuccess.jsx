import React, {Component} from 'react';
import WeUI from 'react-weui';


//import styles
import 'weui';
import {CSS} from '../../../assets/common.css';
import {myCSS} from '../style/Active.css';
const {
    Tab, NavBarItem,
    Cells,
    Cell,
    CellHeader,
    CellBody,
    Toptips
} = WeUI;
let pathHeader='/weixin';
let bgWidth=window.screen.width;
export default class AppSuccess extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.ToBack = this.ToBack.bind(this);
        this.state = {
            showWarn: false,
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

    }

    componentDidMount() {

    }

    LeftClick() {
        HistoryManager.pageBack();
    }

    ToBack(){
        location.href = '/weixin/AppActive'
    }
    render() {
        return (
            <div  id="scrollDiv"  style={{width: "100%", height: "100%"}}>
                <div className="AppActive" style={{backgroundColor:'#fecc00'}}>
                    <img src="/assets/images/AppActive/success_bg.jpg" width={bgWidth} />
                    <div className="Active_content">
                        <div className="reward">
                            <img src="/assets/images/AppActive/success_reward.png"/>
                        </div>
                        <div className="success_back">
                            <span className="back_span" onClick={this.ToBack}>返回</span>
                        </div>
                        <div className="success_bottom">
                            活动解释权最终归紧商网所有
                        </div>
                    </div>
                </div>
            </div>
        )
    }


}
AppSuccess.defaultProps = {
    show: true
};