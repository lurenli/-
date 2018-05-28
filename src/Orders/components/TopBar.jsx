import React, {Component} from 'react';

let groupStyle = {
    width: "100%",
    display: "flex",
    height:"4rem"
};
let itemStyle = {
    flex: "1",
    display: "inline-block",
    borderBottom: "2px solid transparent",
    fontSize:"1.4rem",
    textAlign:"center",
    padding:"1rem 0",
};
let itemIndex={
    flex: "1",
    display: "inline-block",
    borderBottom: "2px solid red",
    fontSize:"1.4rem",
    textAlign:"center",
    padding:"1rem 0",
};
export default class TopBar extends Component {
    constructor(props) {
        super(props);
    }


    componentWillMount() {

    }

    componentDidMount() {
    }

    Choose(index){
        this.props.callback(index);
    }

    render() {
        return (
            <div style={groupStyle}>
                {
                    this.props.Arr.map((item, i) =>
                        <div key={i} style={this.props.Index==i?itemIndex:itemStyle} onClick={this.Choose.bind(this,i)}>{item}</div>
                    )
                }
            </div>
        )
    }


}