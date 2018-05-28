import React, {Component} from 'react';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';

let imgStyle = {
    width: "20rem",
    height: "20rem"
};
export default class ToJudge extends Component {
    constructor(props) {
        super(props);
        this.LeftClick=this.LeftClick.bind(this);
    }


    componentWillMount() {

    }

    componentDidMount() {
    }

    LeftClick() {
        HistoryManager.pageBack();
    }

    render() {
        return (
            <div>
                <NavigationBar Title="平台推广" LeftBar="true" LeftTitle="返回"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                <div style={{width: "100%", textAlign: "center", marginTop: "5rem",fontSize:"1.4rem"}}>
                    <img src={process.env.HOST_URL  +"/rest/common/erm?url=http://www.jinshang9.com"} style={imgStyle}/>
                    <div>邀请注册链接：http://www.jinshang9.com</div>
                </div>
            </div>
        )
    }


}