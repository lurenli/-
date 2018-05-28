import React, {Component} from 'react';

export default class KeyWord extends Component {
    constructor(props) {
        super(props);
    }


    componentWillMount() {

    }

    componentDidMount() {
    }


    render() {
        return (
            <div>
                <div className="more_title">{this.props.label}</div>
                <ul className="more_list">
                    {
                        this.props.items.map((item, i) =>
                            <li className="more_item" key={i}>{item}</li>
                        )
                    }
                </ul>
            </div>
        )
    }


}