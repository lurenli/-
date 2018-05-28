import React, { Component } from 'react'

//左边样式
let LeftStyle = {
    position:"absolute",
    left:"1.8rem",
    height:"4.4rem",
    width: "2.625rem",
    textAlign: "left"
};

//右边样式
let RightStyle = {
    position:"absolute",
    right:"1.6rem",
    height:"4.4rem",
    lineHeight:"4.4rem",
    fontSize:"1.2rem",
    textAlign:"right"
};

export default class  NavigationBarItem extends Component{
    constructor(props){
        super(props);
        this._clicked = this.clicked.bind(this);
    }


    componentWillMount(){

    }

    //item的点击事件
    clicked(){
        this.props.Click && this.props.Click();
    }

    render(){

        if (this.props.Position == "left"){
            if (this.props.IconSrc.length > 0){
                //有图标 左
                return  <div style={LeftStyle} onClick={this._clicked}>
                            <img style={{width:"1.1rem",height:"1.8rem",marginBottom:"12px",marginTop:"1.4rem"}} src={this.props.IconSrc}/>
                        </div>
            }else {
                return  <div style={LeftStyle} onClick={this._clicked}>
                            {this.props.Title}
                        </div>
            }
        }else if (this.props.Position == "right"){
            if (this.props.IconSrc.length > 0){
                //有图标 右
                return  <div style={RightStyle} onClick={this._clicked}>
                            {this.props.Title}<img style={this.props.IconStyle} src={this.props.IconSrc}/>
                        </div>
            }else {
                return  <div style={RightStyle} onClick={this._clicked}>
                            {this.props.Title}
                        </div>
            }
        }else {
            return <div></div>
        }
    }
}

//属性默认值
NavigationBarItem.defaultProps = {
    Title: "",
    Position: "left",
    IconSrc: "",
    IconStyle:{width:"2rem",height:"2rem",marginTop:"1.2rem"}
};

//属性
NavigationBarItem.propTypes = {
    //Item展示标题 默认为空
    Title: React.PropTypes.string,
    //Item位置,left & right, 默认为left
    Position: React.PropTypes.string,
    //Item的click事件
    Click: React.PropTypes.func,
    //Item的图标,默认为空
    IconSrc: React.PropTypes.string,
    IconStyle:React.PropTypes.object
};