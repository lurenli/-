import React, {Component} from 'react';
import WeUI from "react-weui";
//import styles
import 'weui';

let itemStyle = {
    width: "100%",
    height: "4rem",
    padding: "0.5rem",
    border: "1px solid #DDDDDD",
    marginBottom: "1.5rem",
    background: "#f9b600",
    borderRadius:"4rem",
    overflow:"hidden"
};
let inputStyle = {
    width: "100%",
    padding: "1.3rem 1rem",
    height: "0.4rem",
    // lineHeight: "4rem",
    fontSize: "1.4rem",
    outline: "none",
    border: "none",
    background: "none",
};
let inputCheck = {
    width: "15rem",
    padding: "1.3rem 1.3rem",
    height: "0.4rem",
    fontSize: "1.4rem",
    outline: "none",
    border: "none",
    background: "none",
    float:"left"
};
let codeStyle = {
    display: "inline-block",
    fontSize: "1.4rem",
    color: "#fff",
    backgroundColor:"#fdd83a",
    borderRadius:"2rem",
    padding:"0.6rem",
    height:"3rem",
    lineHeight:"2rem",
    float:"right"
};
const {Toptips} = WeUI;
export default class ActiveInput extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.keyChange=this.keyChange.bind(this);
        this.state = ({
            count: 61,
            clearTime: 0,
            type: 1,
            showWarn: false,
            warnTimer: null,
            tipText: "",
            canClick: true,
        });
        this.state.warnTimer && clearTimeout(this.state.warnTimer);
    }


    componentWillMount() {

    }

    componentDidMount() {
    }

    showWarn(text) {
        this.setState({showWarn: true, tipText: text});

        this.state.warnTimer = setTimeout(() => {
            this.setState({showWarn: false});
        }, 2000);
    }

    startTimers() {
        if (this.state.count < 1) {
            //关闭定时器,开启按钮
            clearTimeout(this.state.clearTime);
            this.setState({canClick: true});
            document.getElementById("check").innerHTML = "获取验证码";
            this.setState({
                count: 61
            })
        } else {
            //禁止按钮点击
            var time = this.state.count;
            time -= 1;
            this.setState({
                count: time
            });
            this.setState({canClick: false});
            document.getElementById("check").innerHTML = "(" + time + "s)重新获取";
            let temp = setTimeout(
                () => {
                    this.startTimers()
                },
                1000
            );
            this.setState({
                clearTime: temp
            })
        }
    }

    handleClick() { //验证码计时
        if (this.state.canClick) {
            let phoneNum = document.getElementById("phoneNum").value;
            let self = this;
            if (!(/^0?(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[89])[0-9]{8}$/.test(phoneNum))) {
                self.showWarn("手机号码有误");
                return false;
            }
            //先检测
            let fromData = new FormData();
            fromData.append("mobile", phoneNum);
            fetch(getHost() + "/rest/common/exisMobile", {
                method: 'POST',
                credentials: 'include',
                body: fromData
            }).then(response => response.json()).then(json => {
                if (json.result === 1) {
                    //注册账号获取验证码
                    // alert("注册获取验证码");
                    self.startTimers();
                    let fromData = new FormData();
                    fromData.append("mobile", phoneNum);
                    fromData.append("type", "register");
                    fetch(getHost() + "/rest/front/mobile/genMobileCode", {
                        method: 'POST',
                        credentials: 'include',
                        body: fromData
                    }).then(response => response.json()).then(json => {
                        if (json.result === 1) {
                            self.startTimers()
                        } else {
                            self.showWarn(json.message);
                        }
                    })
                } else {
                    self.showWarn(json.message);
                }
            })


        }

    }

    keyChange(e){
        let yhm=/^[a-zA-Z0-9_.-]{4,16}$/;
        if(e.target.value.toString().match(yhm)==null){
            console.log(e.target.value)
        }
    }

    render() {
        if (this.props.Type === "check") {
            return (
                <div style={itemStyle}>
                    <input style={inputCheck} id={this.props.Id} placeholder={this.props.Placeholder}
                           min={this.props.Min} maxLength={this.props.Max}/>
                    <div style={codeStyle} id="check" onClick={this.handleClick}>获取验证码</div>
                    <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
                </div>

            )
        } else {
            return (
                <div style={itemStyle}>
                    <input style={inputStyle} id={this.props.Id} placeholder={this.props.Placeholder} onBlur={this.keyChange.bind(this)}
                           minLength={this.props.Min} maxLength={this.props.Max} type={this.props.showType}/>
                </div>
            )
        }
    }


}
ActiveInput.defaultProps = {
    Id: "",
    Type: "",
    Placeholder: "",
    Min: "",
    Max: "",
    showType:"",//不为空则是密文显示
};