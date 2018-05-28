import React, {Component} from 'react';
import HistoryListItem from '../components/HistoryListItem.jsx';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';

export default class TalkingHistory extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.state = {
            dataList: [1, 2, 3]
        }
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
            <div>
                <NavigationBar Title="协商历史" LeftBar="true" LeftTitle="返回"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                <div>
                    {
                        this.state.dataList.map((item, i) =>
                            <HistoryListItem key={i}/>
                        )
                    }
                </div>
            </div>
        )
    }


}