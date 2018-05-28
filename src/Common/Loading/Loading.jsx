import React, {Component} from 'react';
import WeUI from 'react-weui';
//import styles
import 'weui';

const {LoadMore} = WeUI;
export default class Loading extends Component {
    constructor(props) {
        super(props);
    }


    componentWillMount() {

    }

    componentDidMount() {
    }


    render() {
        if (this.props.show) {
            return (
                <div>
                    <LoadMore loading>Loading</LoadMore>
                </div>
            )

        } else {
            if (this.props.length > 0) {
                return (
                    <div></div>
                )
            } else {
                return (
                    <div>
                        <LoadMore showLine>{this.props.text}</LoadMore>
                    </div>

                )
            }
        }


    }


}
Loading.defaultProps = {
    text: "暂无信息"
};