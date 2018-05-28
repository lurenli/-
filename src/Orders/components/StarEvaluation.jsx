import React, {Component} from 'react';

let starStyle = {
    display: "inline-block",
    verticalAlign: "middle",
};
export default class StarEvaluation extends Component {
    constructor(props) {
        super(props);
        this.StarClick = this.StarClick.bind(this);
    }


    componentWillMount() {

    }

    componentDidMount() {
    }

    StarClick(index) {
        this.props.callback(index, this.props.id);
    }

    render() {
        let arr = [1, 2, 3, 4, 5];
        let text = "";
        switch (this.props.index) {
            case 1 :
                text = "非常差";
                break;
            case 2 :
                text = "差";
                break;
            case 3 :
                text = "一般";
                break;
            case 4 :
                text = "好";
                break;
            case 5 :
                text = "非常好";
                break;
        }
        return (
            <div className="evaluation">
                <span>{this.props.titleName}</span>
                <div style={starStyle}>
                    {arr.map((item, i) =>
                        <img key={i} className="star" onClick={this.StarClick.bind(this, item)}
                             src={(item <= this.props.index) ? "/assets/images/order/evaluation_star_checked.png" : "/assets/images/order/evaluation_star_uncheck.png"}/>
                    )}
                </div>
                <span style={{marginLeft: "2rem"}}>{text}</span>
            </div>
        )
    }


}