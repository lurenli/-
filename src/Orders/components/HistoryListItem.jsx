import React, {Component} from 'react';

export default class HistoryListItem extends Component {
    constructor(props) {
        super(props);
    }


    componentWillMount() {

    }

    componentDidMount() {
    }


    render() {
        return (
            <div style={{width: "100%", padding: "2rem",borderBottom:"1.5rem solid #f2f2f2"}}>
                <div>
                    <img style={{width:"4rem",height:"4rem",marginRight:"0.5rem"}}/>
                    <div style={{display:"inline-block",verticalAlign:"top"}}>
                        <div style={{fontSize:"1.4rem"}}>紧商科技有限公司</div>
                        <div>2017-11-11 14:20:20</div>
                    </div>
                </div>
                <div>商家确认收货</div>
            </div>
        )
    }


}