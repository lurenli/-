import React, {Component} from 'react';
import WeUI from 'react-weui';
import 'weui';

let itemStyle = {
    width: "100%",
    backgroundColor: "white",
    fontSize: "1.4rem",
};
let checkAll = {
    width: "1.5rem",
    height: "1.5rem",
    margin: "0 1rem",
    verticalAlign: "middle"
};
let deleteBtn = {
    display: "inline-block",
    width: "20%",
    textAlign: "center"
};
let rightIcon = {
    width: "1rem",
    height: "1.5rem",
    verticalAlign: "middle"
};
let borderStyle = {
    borderBottom: "1px solid #f2f2f2",
    padding: "0.8rem 0"
};
const {
    Dialog,
} = WeUI;let pathHeader='/weixin';
export default class MyAddressItem extends Component {
    constructor(props) {
        super(props);
        this.EditClick = this.EditClick.bind(this);
        this.SetDefault = this.SetDefault.bind(this);
        this.state = {
            showDialog: false,
            style: {
                title: '',
                buttons: [
                    {
                        type: 'default',
                        label: '取消',
                        onClick: this.hideDialog.bind(this)
                    },
                    {
                        type: 'primary',
                        label: '删除',
                        onClick: this.DeleteClick.bind(this)
                    }
                ]
            }
        }
    }


    componentWillMount() {

    }

    componentDidMount() {
    }

    SetDefault() {

    }

    hideDialog() {
        this.setState({
            showDialog: false,
        });
    }

    EditClick() {
        let url = pathHeader+"/MyAddressEdit?id=" + this.props.id;
        localStorage.setItem("editAddress",JSON.stringify(this.props.data));
        HistoryManager.register(url);
        location.href = url;
    }

    DeleteClick() {
        this.props.callback(this.props.id);
        this.setState({
            showDialog: false,
        });
    }

    SetDefault(){
        this.props.setDefault(this.props.id);
    }

    render() {
        let imgSrc = "/assets/images/userCenter/user_collection_none.png";
        if (this.props.data.isdefault === 1) {
            imgSrc = "/assets/images/userCenter/user_collection_checked.png";
        }
        return (
            <div className="receiptItem" style={itemStyle}>
                <div style={borderStyle} onClick={this.EditClick}>
                    <div style={{display: "inline-block", width: "90%", verticalAlign: "middle"}}>
                        <div style={{padding: "1rem"}}>
                            <div style={{width: "50%", display: "inline-block", textAlign: "left"}}>
                                {this.props.data.shipto}
                            </div>
                            <div style={{width: "50%", display: "inline-block", textAlign: "right"}}>
                                {this.props.data.phone}
                            </div>
                            <div>{this.props.data.province}{this.props.data.city}{this.props.data.citysmall}{this.props.data.address}</div>
                        </div>
                    </div>
                    <div style={{display: "inline-block", width: "10%", textAlign: "center"}}>
                        <img style={rightIcon}
                             src="/assets/images/shop/shop_arrow_right.png"/>
                    </div>
                </div>
                <div style={{width: "100%", lineHeight: "2.8rem", height: "3rem", verticalAlign: "middle"}}>
                    <div style={{display: "inline-block", width: "80%"}}>
                        <img style={checkAll} src={imgSrc} onClick={this.SetDefault}/>
                        <span style={{color: "red", verticalAlign: "middle"}}>设为默认</span>
                    </div>
                    <div style={deleteBtn} onClick={e => this.setState({showDialog: true})}>
                        <img style={checkAll} src="/assets/images/userCenter/user_address_delete.png"/>
                        <span style={{verticalAlign: "middle"}}>删除</span>
                    </div>
                </div>
                <Dialog type="ios" buttons={this.state.style.buttons} show={this.state.showDialog}>
                    是否删除
                </Dialog>
            </div>
        )
    }


}