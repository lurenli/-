import React, { Component } from 'react'
import NavigationBarItem from './NavigationBarItem.jsx'


let BarStyle = {
    color: "black",
    // backgroundColor: "#60b4e9",
    backgroundColor:"white",
    borderBottom:"1px solid #e2e2e2",
    fontSize:"1.8rem",
    textAlign:"center",
    width:"100%",
    height:"4.4rem",
    lineHeight:"4.4rem",
    position:"fixed",
    top:"0rem",
    zIndex:"999"
};
export default class  NavigationBar extends Component {
    constructor(props) {
        super(props);
    }
    
    componentWillMount() {
        if(this.props.Title) {  //iOS 页面将暂时无法修改页面的title， https://mp.weixin.qq.com/advanced/wiki?t=t=resource/res_main&id=mp1483682025_enmey  ---将在3月份完成修改
            document.title = this.props.Title;
            // if (/ip(hone|od|ad)/i.test(navigator.userAgent)) {
            //     var i = document.createElement('iframe');
            //     i.src = '/favicon.ico';
            //     i.style.display = 'none';
            //     i.onload = function() {
            //         setTimeout(function(){
            //             i.remove();
            //         }, 9)
            //     }
            //     document.body.appendChild(i);
            // }
        } else {
            document.title = "商城";
        }

        //这个注册时间是发生在onhashchange时间之后，那么如果当前页面有对应的LeftClick方法，那么等待其执行完成后，在去注册
        setTimeout(function(){
            if (this.props.LeftClick) {
                window.goBack = this.props.LeftClick;
                return;
            } else {
                window.goBack = () => {};
                return;
            }
        }.bind(this), 200);

    }


    getLeftBar() {
        if(this.props.LeftBar == "false")
            return "";
        else {
            // if(wx) {
            //     wx.showOptionMenu();
            // }
            return <NavigationBarItem Title={this.props.LeftTitle} Position="left" Click={this.props.LeftClick} IconSrc={this.props.LeftIconSrc}/>;
        }
    }

    getRightBar() {
        if(this.props.RightBar == "false") {
            // if(wx) {
            //     wx.hideOptionMenu();
            // }
            return "";
        } else {
            return <NavigationBarItem Title={this.props.RightTitle} Position="right" Click={this.props.RightClick} IconSrc={this.props.RightIconSrc} IconStyle={this.props.RightIconStyle}/>;
        }
    }

    render() {
        if (process.env.NODE_ENV == "production" || process.env.NODE_ENV == "qa") { //在手机端运行
            return(<div></div>);
        } else {
            let leftbar = this.getLeftBar();
            let rightbar = this.getRightBar();
            let style = Object.assign(
                {},
                BarStyle,
                this.props.freeStyle == "true" && {color: this.props.color, backgroundColor: this.props.backgroundColor}
            );

            return (
                <div style={{width:"100%",height:"4.4rem"}}>
                    <div style={style}>
                        {leftbar}
                        {rightbar}
                        <div
                            style={{width:"60%",marginLeft:"20%",marginRight:"20%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{this.props.Title}</div>
                    </div>
                </div>
            )
        }
    }
}

NavigationBar.defaultProps = {
    Title: "导航栏",
    //左
    LeftBar: "false",
    LeftTitle: "",
    LeftIconSrc: "",
    LeftTarget : "",
    //右
    RightBar: "false",
    RightTitle: "",
    RightIconSrc: "",

    freeStyle:"false",
    color: "white",
    backgroundColor: "#60b4e9"

};

NavigationBar.propTypes = {
    Title: React.PropTypes.string,
    //左
    LeftBar:React.PropTypes.string,
    LeftTitle: React.PropTypes.string,
    LeftTarget: React.PropTypes.string,
    LeftIconSrc: React.PropTypes.string,
    LeftClick:React.PropTypes.func,
    //右
    RightBar: React.PropTypes.string,
    RightTitle: React.PropTypes.string,
    RightIconSrc: React.PropTypes.string,
    RightClick:React.PropTypes.func,
    RightIconStyle:React.PropTypes.object,

    //自定义参数
    freeStyle:React.PropTypes.string,
    color: React.PropTypes.string,
    backgroundColor: React.PropTypes.string

};