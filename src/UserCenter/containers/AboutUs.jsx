import React, {Component} from 'react';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';

export default class AboutUs extends Component {
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
            <div>
                <NavigationBar Title="设置" LeftBar="true" LeftTitle="返回"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                <div style={{padding: "1rem", fontSize: "1.4rem"}}>

                    <div style={{width: "100%", textAlign: "center",}}>
                        <img style={{width: "8rem", height: "6rem"}} src="/assets/images/common/logo.png"/>
                        <div>紧商</div>
                    </div>
                    <div>
                        紧商网客户端是一款专注于紧固件工业品采购、信息查询的手机应用程序。作为全国专业的紧固件供应链电商平台，紧商网线上销售涵盖螺栓、螺母、螺钉、垫圈、挡圈、螺钉、螺柱、辅助材料系列等在内的12个大类，上千款产品，以富有竞争力的价格，供应有品质的产品和服务，降底客户采购成本，为客户提升价值服务，为用户提供一站式优质采购体验。
                    </div>
                    <div>【买卖螺丝，就上紧商网！】</div>
                    <div>[app特色]</div>
                    <div>1. 限时购：热销产品限时特价销售</div>
                    <div>2. 标准查询：提供专业的紧固件产品数据库，选型查价更精准</div>
                    <div>3. 会员制度：凡在紧商网购物便可获得相应积分，积分可用于换购商品</div>
                    <div>[联系我们]</div>
                    <div>官网：www.jinshang9.com</div>
                    <div> 公众号：紧商网</div>
                    <div>客服中心：4001002897</div>
                </div>
            </div>
        )
    }


}