import React, {Component} from 'react';
import WeUI from 'react-weui';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import 'weui';
const {
    ButtonArea,
    Button,
    CellsTitle,
    Cells,
    Cell,
    CellHeader,
    CellBody,
    CellFooter,
    Label,
    Input,
    TextArea,
    Toptips
} = WeUI;

let bgStyle = {
    width: "100%",
    minHeight: "100%",
    background: "#F5F5F5",
    fontSize: "1.2rem",
};
let titleStyle={
    background:"white",
    padding:"1rem 1.5rem"
};
let dateRange={
    fontSize:"1.2rem"
};
let leftDisplay={
    display:"inline-block",
    width:"20%",
    textAlign:"left",
};
let rightDisplay={
    display:"inline-block",
    width:"80%",
    textAlign:"right",
    fontSize:"1.4rem"
};
export default class BillDetailFacility extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
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
            <div style={bgStyle}>
                <NavigationBar Title="账单明细" LeftBar="true" LeftTitle="返回"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                <div style={titleStyle}>
                    <div style={dateRange}>2017/10/19-2017/11/18</div>
                    <div>
                        <div style={leftDisplay}>账单金额</div>
                        <div style={rightDisplay}>￥80000.00</div>
                    </div>
                </div>
                <Cells>
                    <Cell>
                        <CellHeader>
                            <span style={{fontSize: "1.2rem",marginRight:"2rem"}}>2017/10/19</span>
                        </CellHeader>
                        <CellBody>
                            <div style={{fontSize: "1.4rem"}}>￥100.00</div>
                            <div style={{fontSize: "1.2rem"}}>sadasdasdasdas</div>
                        </CellBody>
                        <CellFooter>
                            <div style={{fontSize: "1.4rem"}}>消费</div>
                        </CellFooter>
                    </Cell>
                    <Cell>
                        <CellHeader>
                            <span style={{fontSize: "1.2rem",marginRight:"2rem"}}>2017/10/19</span>
                        </CellHeader>
                        <CellBody>
                            <div style={{fontSize: "1.4rem"}}>￥100.00</div>
                            <div style={{fontSize: "1.2rem"}}>sadasdasdasdas</div>
                        </CellBody>
                        <CellFooter>
                            <div style={{fontSize: "1.4rem"}}>充值</div>
                        </CellFooter>
                    </Cell>
                </Cells>
            </div>
        )
    }


}