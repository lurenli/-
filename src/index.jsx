import React,{Component} from 'react';
import 'weui';
import 'react-weui/build/packages/react-weui.css';
// import {render} from 'react-dom';
// import {Router, browserHistory, Link, useRouterHistory} from 'react-router';
// import routes from '../config/routes';
// import createHistory from 'history/lib/createBrowserHistory'
// import useScroll from 'scroll-behavior/lib/useStandardScroll' //跳转之后调整scroll position到顶部.

/*在这个页面可以加载一些页面需要的东西*/
export default class index extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
    }

    componentWillMount() {
    }


    LeftClick() {
    }

    RightClick() {
    }


    render() {
        return (
            <div  style={{height:'100%', width:'100%'}}>
                {this.props.children}
            </div>
        )
    }
}
