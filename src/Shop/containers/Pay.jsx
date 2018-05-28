import React, {Component} from 'react';

export default class Pay extends Component {
    constructor(props) {
        super(props);
        this.state={
            url: this.props.location.query.url,//商品类型
        }
    }


    componentWillMount() {


    }

    componentDidMount() {
    }


    render() {
        return (
            <div>
                <iframe src={this.state.url}></iframe>
            </div>
        )
    }


}