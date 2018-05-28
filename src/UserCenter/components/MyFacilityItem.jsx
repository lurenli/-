import React, {Component} from 'react';

let itemStyle={
    width:"100%",
    padding:"0.5rem 1rem",
    fontSize:"1.4rem",
    backgroundColor:"white",
    marginBottom:"1rem"
};
let centerText={
    width:"100%",
    textAlign:"center",
    fontSize:"1.6rem"
};
let leftDisplay={
    display:"inline-block",
    width:"50%",
    textAlign:"left",
};
let rightDisplay={
    display:"inline-block",
    width:"50%",
    textAlign:"right",
    color:"orange"
};
let commonBtn={
    padding: "0.5rem 1rem",
    border:"1px solid #e2e2e2",
    borderRadius:"3rem",
    backgroundColor:"white",
    color:"black",
};
let redBtn={
    padding: "0.5rem 1rem",
    border:"1px solid red",
    borderRadius:"3rem",
    backgroundColor:"red",
    color:"white",
};
export default class MyFacilityItem extends Component {
    constructor(props) {
        super(props);
    }


    componentWillMount() {

    }

    componentDidMount() {
    }


    render() {
        return (
            <div style={itemStyle}>
                <div>
                    <div style={leftDisplay}>生成中</div>
                    <div style={rightDisplay}>未缴清</div>
                </div>
                <div style={centerText}>￥80808.00</div>
                <div style={{textAlign:"right"}}>
                    <button style={commonBtn}>提前还款</button>
                </div>
            </div>
        )
    }


}