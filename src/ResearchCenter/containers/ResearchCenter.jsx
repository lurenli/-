import React, {Component} from 'react';
import WeUI from 'react-weui';


//import styles
import 'weui';
import {CSS} from '../../../assets/common.css';
import {myCSS} from '../style/center.css';

const {
    Tab, NavBarItem,
    Cells,
    Cell,
    CellHeader,
    CellBody,
    Toptips
} = WeUI;
let pathHeader='/weixin';
let bgWidth=window.screen.width;
export default class ResearchCenter extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.ToBack = this.ToBack.bind(this);
        this.state = {
            showWarn: false,
        };
        this.state.warnTimer && clearTimeout(this.state.warnTimer);
    }

    showWarn(text) {
        this.setState({showWarn: true, tipText: text});
        this.state.warnTimer = setTimeout(() => {
            this.setState({showWarn: false});
        }, 2000);
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    LeftClick() {
        HistoryManager.pageBack();
    }
    ToBack(){
        location.href = '/weixin'
    }

    render() {
        return (
            <div  id="scrollDiv"  style={{width: "100%", height: "100%"}}>
                <div className="ResearchCenter">
                    <img src="/assets/images/ResearchCenter/centerBg.png" width={bgWidth} />
                     <div className="Center">
                         <div className="hotTel">定制热线：13645816931；0571-22673049</div>
                         <div className="Introduce">
                             <div className="Introduce_title">
                                 <i>.</i>
                                 <span >奥展紧固件研发中心的介绍</span>
                             </div>
                             <p>
                                 奥展实业有限公司技术研发中心是公司技术创新的基础平台，定位于提高公司的
                                 核心竞争力和发展后劲，推动产业技术的升级，多年来致力于新产品的开发和非标
                                 产品的订制，仅2017年研发并投入生产的新型产品就有14种，2018年预计开发
                                 新产品20种。同时，技术研发中心积极拓展与高等院校、研究院所、行业协会建立有
                                 效的合作协同关系，是企业进行产学研合作的主要载体。随着运作机制的不断成熟和完善，奥展实业有限公司技术研发中心本着“人才为本，
                                 技术为根，创新为魂”的基本理念，集技术研发，产品生产，设计施工于一体，形成
                                 了既面向市场，又充分调动内外部资源，有利于成果转化以及自主创新的组织体系和运作机制。
                             </p>
                         </div>
                         <div className="Product">
                             <span className="Product_title">明星产品</span>
                             <ul className="product_ul">
                                 <li>
                                     <img  src="/assets/images/ResearchCenter/p_1.png"/>
                                     <div>
                                         <span className="p_name">非标平圆头螺丝</span>
                                         <p>非标定制螺丝，头部变形量6倍，几乎达到了不锈钢材料变形量的极限，采用冷墩技术一次成型，无车削量，将原材料的损耗降至最低。</p>
                                         <span className="p_tips">左图材质：不锈钢</span>
                                     </div>
                                 </li>
                                 <li>
                                     <img src="/assets/images/ResearchCenter/p_2.png"/>
                                     <div>
                                         <span className="p_name">精密冷墩球头螺丝</span>
                                         <p>非标定制螺丝。头部呈圆形或球形，采用六角冲针生产，头部光滑呈镜面效果（球面可见拍摄者的反光），整个螺丝采用冷墩技术一体制成。</p>
                                         <span className="p_tips">可生产的球头螺丝规格：M5-M12</span>
                                     </div>
                                 </li>
                                 <li>
                                     <img src="/assets/images/ResearchCenter/p_3.png"/>
                                     <div>
                                         <span className="p_name">法兰螺丝</span>
                                         <p>我司生产的法兰螺丝，工艺成熟稳定，产品标准规范，承接大批量高标准订单。</p>
                                         <span className="p_tips">可生产的法兰螺丝规格：M5-M20</span>
                                     </div>
                                 </li>
                                 <li>
                                     <img src="/assets/images/ResearchCenter/p_4.png"/>
                                     <div>
                                         <span className="p_name">马车螺丝</span>
                                         <p>马车螺栓是指圆头方颈螺丝,按头部大小分为大半圆头马车螺栓和小半圆头马车螺栓。我司生产的马车螺丝，工艺成熟稳定，产品标准规范，可承接大批量订单。</p>
                                     </div>
                                 </li>
                             </ul>
                             <ul className="Product_imgs">
                                 <li><img src="/assets/images/ResearchCenter/p01.png"/></li>
                                 <li><img src="/assets/images/ResearchCenter/p02.png"/></li>
                                 <li><img src="/assets/images/ResearchCenter/p03.png"/></li>
                                 <li><img src="/assets/images/ResearchCenter/p04.png"/></li>
                                 <li><img src="/assets/images/ResearchCenter/p05.png"/></li>
                                 <li><img src="/assets/images/ResearchCenter/p06.png"/></li>
                                 <li><img src="/assets/images/ResearchCenter/p07.png"/></li>
                                 <li><img src="/assets/images/ResearchCenter/p08.png"/></li>
                             </ul>
                         </div>
                         <div className="People">
                             <img src="/assets/images/ResearchCenter/people.png"/>
                             <span className="People_title">奥展人物</span>
                             <span className="peopel_name">技术研发中心总监：夏继平  </span>
                             <p>1966年出生的夏继平，20出头就进入了车间，成为众多流水线工人中的一名，繁忙的工作，艰苦的条件，并没有阻挡他深入探索的脚步，在日
                                 复一日的工作中，他对这些螺钉产生了浓厚的兴趣，更加用心去钻研生产设计的原理，在工作之余，大量研
                                 读专业书籍，并在空暇时光向富有多年生产经验的老工人请教、交流，汇聚百家之长，在实践的经验积累与理论的学习中飞快成长着。
                             </p>
                             <p>90年代，夏继平看准先机，大胆从国企的“铁饭碗”中走出，率先进入更具活力的民营企业，负责公司生产车间的全线运营。“那个时候，真是‘当爹又当妈’，技术生产一把抓，财
                                 务人事也要管。“他回忆道。在这样的锻炼、磨砺中，夏继平对紧固件的生产运营体系有了更深、更全面的把握，对产品的开发和研制有了更多的思考。
                             </p>
                             <p>正是由于多年来理论与实践结合、互相促进、不断打磨提升的经历，夏继平
                                 介绍说：“不管什么样的，只要给我一个样钉，我都能把它的设计图纸和制造工艺流程做出来，实现批量化生产。”在说这句话时，眼底透出的是深深的自信与笃定。
                             </p>
                             <p>2015年，夏继平来到奥展实业，实现了技术创新与生产实力的强强联合。</p>
                             <p>“一线生产是企业研发的土壤，技术创新是企业发展的灵魂”，在他的推动下，奥展实业成立了自己的技术研发中心，2017年研发新型产品14种，2018年计划开发20种新型产品，丰富了公司的生产品类，提升了市场竞争力，为社会各行业对非标紧固件的定制需求供应提供了坚实的保证和技术支持。
                                 2016年，奥展实业有限公司获得了“‘华网·金螺丝奖‘优秀紧固件企业”和“中国紧固件行业中
                                 紧大技师”的荣誉称号。<a href="http://www.jinshang9.com/weixin/MessageDetail?id=404" style={{color:"#0084ff"}}>全文详情>></a>
                             </p>
                             <div className="p_imgs">
                                 <img src="/assets/images/ResearchCenter/r1.png" />
                                 <img src="/assets/images/ResearchCenter/r2.png" />
                                 <img src="/assets/images/ResearchCenter/r3.png" />
                                 <img  src="/assets/images/ResearchCenter/r4.png"/>
                             </div>
                         </div>
                         <div className="Look">
                             <span className="Product_title">生产一览</span>
                             <img src="/assets/images/ResearchCenter/look_big.png"/>
                             <div className="look_right">
                                 <div className="look_s">
                                     <img src="/assets/images/ResearchCenter/look_s1.png"/>
                                     <img src="/assets/images/ResearchCenter/look_s2.png"/>
                                     <img src="/assets/images/ResearchCenter/look_s3.png"/>
                                     <img src="/assets/images/ResearchCenter/look_s4.png"/>
                                 </div>
                                 <div className="look_m">
                                     <img  src="/assets/images/ResearchCenter/look_m1.png"/>
                                     <img src="/assets/images/ResearchCenter/look_m2.png"/>
                                 </div>
                             </div>
                         </div>
                         <div className="bottom">
                             非标件定制专线：13645816931， 0571-22673049
                         </div>
                     </div>
                </div>
            </div>
        )
    }


}
ResearchCenter.defaultProps = {
    show: true
};