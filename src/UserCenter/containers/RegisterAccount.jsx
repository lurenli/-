import React, {Component} from 'react';
import NavigationBar from '../../Common/NavigationBar/NavigationBar.jsx';
import InputWithPic from '../../Common/InputWithPic/InputWithPic.jsx';
//import Using ES6 syntax
import WeUI from 'react-weui';

import Base64 from "../../../assets/js/Base64";

//import styles
import 'weui';
import {CSS} from '../styles/Register.css';

const {Button, ButtonArea, Toptips, Dialog} = WeUI;
let inputs = {
    width: "100%",
    padding: "3rem",
};
export default class RegisterAccount extends Component {
    constructor(props) {
        super(props);
        this.LeftClick = this.LeftClick.bind(this);
        this.NextClick = this.NextClick.bind(this);
        this.LoginClick = this.LoginClick.bind(this);
        this.state = {
            showWarn: false,
            warnTimer: null,
            tipText: "",
            showSuccess: false,
            successTimer: null,
            showDialog: false,
            style: {
                buttons: [
                    {
                        label: '好的',
                        onClick: this.HideDialog.bind(this)
                    }
                ]
            },
        };
        this.state.successTimer && clearTimeout(this.state.successTimer);
        this.state.warnTimer && clearTimeout(this.state.warnTimer);
    }

    componentWillMount() {

    }

    LeftClick() {
        HistoryManager.pageBack();
    }

    showWarn(text) {
        this.setState({showWarn: true, tipText: text});

        this.state.warnTimer = setTimeout(() => {
            this.setState({showWarn: false});
        }, 2000);
    }

    showSuccess() {
        this.setState({showSuccess: true});
        this.state.successTimer = setTimeout(() => {
            this.setState({showSuccess: false});
            HistoryManager.pageBack();
        }, 2000);
    }

    HideDialog() {
        this.setState({showDialog: false});
    }

    RegisterClick(userName, password, repeat, phoneNum, checkCode, invitation) {
        let fromData = new FormData();
        fromData.append("username", userName);
        fromData.append("password", Base64.encode(password));
        fromData.append("againPassword", repeat);
        fromData.append("mobile", phoneNum);
        fromData.append("mobileCode", checkCode);
        fromData.append("invitecode", invitation);
        fromData.append("webToken", localStorage.getItem('webToken'));
        fetch(getHost() + "/rest/buyer/registerMember", {
            method: 'POST',
            credentials: 'include',
            body: fromData
        }).then(response => response.json()).then(json => {
            if (json.result === 1) {//success
                // markDataRequestFlag();
                this.showSuccess();
                return true;
            } else {
                this.showWarn("验证失败，请重新输入");
                return;
            }
        }).catch(e => {
            this.showWarn("网络出现了点问题");
            console.log("网络出现了点问题：" + e);
        });
    }

    NextClick() { //下一步
        let userName = document.getElementById("userName").value;
        let password = document.getElementById("password").value;
        let repeat = document.getElementById("repeat").value;
        let phoneNum = document.getElementById("phoneNum").value;
        let checkCode = document.getElementById("checkCode").value;
        let invitation = document.getElementById("invitation").value;
        if (!userName) {
            this.showWarn("请输入用户名");
        } else if (!password) {
            this.showWarn("请输入密码");
        } else if (password !== repeat) {
            this.showWarn("请确认两次输入的密码");
        } else if (!phoneNum) {
            this.showWarn("请输入手机号码");
            if (!(/^0?(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[89])[0-9]{8}$/.test(phoneNum))) { //手机号验证
                this.showWarn("手机号码有误");
            }
        } else if (!checkCode) {
            this.showWarn("请输入验证码");
        } else {
            this.RegisterClick(userName, password, repeat, phoneNum, checkCode, invitation);
        }
    }

    LoginClick() { //登录
        HistoryManager.pageBack();
    }

    NameCheck(e){
        let value=e.target.value;
        value=value.replace(/[^\a-\z\A-\Z0-9\_\.]/g,'');
        return value;
    }

    render() {
        let height = document.body.clientHeight * 37.5 / document.body.clientWidth - 20;
        let heightValue = height + "rem";
        return (
            <div>
                <NavigationBar Title="注册" LeftBar="true" LeftTitle="返回"
                               LeftIconSrc="/assets/images/common/nav_back_icon.png" LeftClick={this.LeftClick}/>
                <div style={inputs}>
                    <InputWithPic Id="userName" ImgSrc="/assets/images/userCenter/icon_user.png"  Min="3" Max="20"
                                  Placeholder="请输入用户名（3-12位英文，数字）" />
                    <InputWithPic Id="password" ImgSrc="/assets/images/userCenter/icon_password.png"
                                  Placeholder="请输入密码（6-20位）" showType="password"/>
                    <InputWithPic Id="repeat" ImgSrc="/assets/images/userCenter/icon_password.png"
                                  Placeholder="请输入确认密码（6-20位）" showType="password"/>
                    <InputWithPic Id="phoneNum" ImgSrc="/assets/images/userCenter/icon_phone.png" Placeholder="请输入手机号"/>
                    <InputWithPic Id="checkCode" ImgSrc="/assets/images/userCenter/icon_checkcode.png" Type="check"
                                  Placeholder="请输入验证码"/>
                    <InputWithPic Id="invitation" ImgSrc="/assets/images/userCenter/icon_invite.png"
                                  Placeholder="请输入邀请码（选填）"/>
                    <div style={{fontSize: "1.4rem"}}>注册即视为同意<span style={{color: "blue", textDecoration: "underline"}}
                                                                   onClick={e => this.setState({showDialog: true})}>《紧商注册协议》</span>
                    </div>
                </div>
                <div style={{marginTop: "3rem"}}>
                    <ButtonArea>
                        <Button className="loginButton" type="warn"
                                onClick={this.NextClick}>注册</Button>
                    </ButtonArea>
                </div>
                {/*<div className="RegisterAccountDiv" onClick={this.LoginClick}>已有账号?<span style={{color:"#0088EC"}}>登录</span></div>*/}
                <Toptips type="warn" show={this.state.showWarn}>{this.state.tipText}</Toptips>
                <Toptips type="primary" show={this.state.showSuccess}>注册成功</Toptips>
                <Dialog type="ios" title={this.state.style.title} buttons={this.state.style.buttons}
                        show={this.state.showDialog}>
                    <div style={{
                        height: heightValue,
                        overflowY: "scroll",
                        fontSize: "1.4rem",
                        textAlign: "left",
                    }}>
                        <div style={{width: "100%", textAlign: "center", fontSize: "1.6rem"}}>紧商网用户注册协议</div>
                        <div>本协议是您与紧商科技股份有限公司（简称紧商网）所有者之间就紧商网服务等相关事宜所订立的契约，请您仔细阅读本注册协议，您勾选协议后，本协议即构成对双方有约束力的法律文件。</div>
                        <div>第1条 本站服务条款的确认和接纳</div>
                        <div>1.1本站的各项电子服务的所有权和运作权归紧商网所有。用户同意所有注册协议条款并完成注册程序，才能成为本站的正式用户。用户确认：本协议条款是处理双方权利义务的契约，始终有效，法律另有强制性规定或双方另有特别约定的，依其它规定。</div>
                        <div>1.2用户点击同意本协议的，即视为用户确认自己具有享受本站服务、下单购物等相应的权利能力和行为能力，能够独立承担法律责任。</div>
                        <div>1.3紧商网保留在中华人民共和国法律允许的范围内独自决定拒绝服务、关闭用户账户、清除或编辑内容或取消订单的权利。</div>
                        <div>第2条 本站服务</div>
                        <div>2.1紧商网通过互联网依法为用户提供互联网信息等服务，用户在完全同意本协议及本站规定的情况下，方有权使用本站的相关服务。</div>
                        <div>2.2用户必须自行准备如下设备和承担如下开支：（1）上网设备，包括并不限于电脑或者其他上网终端、调制解调器及其他必备的上网装置；（2）上网开支，包括并不限于网络接入费、上网设备租用费、手机流量费等。</div>
                        <div>第3条 用户信息</div>
                        <div>3.1用户应自行诚信向本站提供注册资料，用户同意其提供的注册资料真实、准确、完整、合法有效，用户注册资料如有变动的，应及时更新其注册资料。如果用户提供的注册资料不合法、不真实、不准确、不详尽的，用户需承担因此引起的相应责任及后果，并且紧商网保留终止用户使用各项服务的权利。</div>
                        <div>3.2用户在本站进行浏览、下单购物等活动时，涉及用户真实姓名/名称、通信地址、联系电话、电子邮箱等隐私信息的，本公司将予以严格保密，除非得到用户的授权或法律另有规定，本站不会向外界披露用户隐私信息。</div>
                        <div>3.3用户注册成功后，将产生用户名和密码等账户信息，您可以根据本站规定改变您的密码。用户应谨慎合理的保存、使用其用户名和密码。用户若发现任何非法使用用户账号或存在安全漏洞的情况，请立即通知本站，情节严重者可立即向公安机关报案。</div>
                        <div>3.4用户同意，紧商网拥有通过邮件、短信电话等形式，向在本站注册、购物用户、收货人发送订单信息、促销活动等告知信息的权利。</div>
                        <div>3.5用户不得将在本站注册获得的账户借给他人使用，否则用户应承担由此产生的全部责任，并与实际使用人承担连带责任。</div>
                        <div>3.6用户同意，紧商网有权使用用户的注册信息、用户名、密码等信息，登陆进入用户的注册账户，进行证据保全等。</div>
                        <div>第4条 用户依法言行义务</div>
                        <div>本协议依据国家相关法律法规规章制定，用户同意严格遵守以下义务</div>
                        <div>4.1不得传输或发表：煽动抗拒、破坏宪法和法律、行政法规实施的言论，煽动颠覆国家政权，推翻社会主义制度的言论，煽动分裂国家、破坏国家统一的的言论，煽动民族仇恨、民族歧视、破坏民族团结的言论；</div>
                        <div>4.2不得利用本站从事洗钱、窃取商业秘密、窃取个人信息等违法犯罪活动；</div>
                        <div>4.3不得干扰本站的正常运转，不得侵入本站及国家计算机信息系统；</div>
                        <div>4.4不得传输或发表任何违法犯罪的、骚扰性的、中伤他人的、辱骂性的、恐吓性的、伤害性的、庸俗的，淫秽的、不文明的等信息资料；</div>
                        <div>4.5不得传输或发表损害国家社会公共利益和涉及国家安全的信息资料或言论；</div>
                        <div>4.6不得利用在本站注册的账户进行牟利性经营活动；</div>
                        <div>用户应不时关注并遵守本站不时公布或修改的各类合法规则规定。</div>
                        <div>本站保有删除站内各类不符合法律政策或不真实的信息内容而无须通知用户的权利。</div>
                        <div>若用户未遵守以上规定的，本站有权作出独立判断并采取暂停或关闭用户帐号等措施。用户须对自己在网上的言论和行为承担法律责任。</div>
                        <div>第5条 商品信息</div>
                        <div>本站上的商品价格、数量、是否有货等商品信息随时都有可能发生变动，本站不作特别通知。由于网站上商品信息的数量极其庞大，虽然本站会尽最大努力保证您所浏览商品信息的准确性，但由于众所周知的互联网技术因素和公司内部管理等客观原因存在，本站网页显示的信息可能会有一定的滞后性或差错，对此情形您知悉并理解；</div>
                        <div>第6条 产品标准、单价的说明：</div>
                        <div>6.1紧商网承诺严格依照双方约定的材质生产供货，绝不弄虚作假！</div>
                        <div>6.2若客户购买的是标准品，则检验标准以各相关国家标准为准。</div>
                        <div>6.3若为特殊品，则以双方提供的书面图纸或以客户提供经紧商网确认过的图纸为标准来生产验收。</div>
                        <div>6.4若客户提供的是样品，紧商网亦会根据样品绘制图纸后请客户确认，并以此为标准来生产验收。</div>
                        <div>6.5有特殊质量要求的产品请务必在订单中详细说明，以减少双方不必要的损失。</div>
                        <div>6.6标准规格的产品价格在紧商网的商城中都已列明。届时只须按显示的价格计算即可。若是特殊规格之产品第一次购买时则以紧商网的书面报价为准。报价在报价有效期内有效。没有特别注明有效期的则报价有效期默认为从报价之日起10天内有效。价格经客户同意后，紧商网会在商城中给该产品赋予一个合理的售价，第二次购买时则商城会根据当时的市场行情自动计算销售价格，客户可以像正常品一样的下单采购。</div>
                        <div>第7条 付款方式的约定：</div>
                        <div>7.1经双方友好协商双方的结款方式会在正式的长期销售协议中签定。届时双方必须严格按签订的销售协议来执行，在没有跟紧商网签订正式销售协议之前，所有的货款都必须在先支付的前提下才能出货。同时若有签订正式的销售协议而客户没有按约定的时间付款，则客户在商城中下的订单紧商网有权拒绝接受和发货。</div>
                        <div>7.2付款可采用线上和线下两种方式，线下付款紧商网只接受电汇，转帐支票，银行本票等即时到帐的方式付款，而不接受远期银行承兑汇票。若客户一定要支付紧商网承兑汇票的，需经得紧商网同意，同时用户需支付由此产生的利息费用（利息的计算方式由紧商网参照各大银行公布的当期利率计算而得）。</div>
                        <div>第8条 交货及验收方式：</div>
                        <div>8.1通常情况下，紧商网所答应的交期是指发货的日期。常用的标准规格紧商网大部分都已备有现货。没有现货的标准品和非标产品的交期依双方协商的为准，商城中提供的交货日期为参考日期，不做正式约束。另需特别说明的是因物流条件所限，浙江、江苏、上海地区的客户当日下单就须出货的定单请务必于下午二点前下好订单，二点后所下的定单都将留到第二天再做处理。除上述两省一市的客户以外，其余省市的客户当天的订单都将到第二天发出。</div>
                        <div>8.2货物到达客户手中后，客户有义务对收到货物的质量、数量及时验收。</div>
                        <div>8.3紧商网接受货物在第一买受方时提出的质量与数量客诉。原则上不接受货物经由第一买受方转手到达第二方以后后再提出的客诉。</div>
                        <div>8.4若是产品数量上的问题，请客户在货物到达7日内提出，以便紧商网及时调查并修改相对应的送货单据，以减少月底对帐时的困扰。若产品有质量问题，客户应在收到货物之日起10日内向紧商网书面提出，以便紧商网能及时解决，紧商网原则上不接受超过此日期的质量投诉。</div>
                        <div>第9条 包装及运输方式的约定：</div>
                        <div>9.1为节约货运成本，紧商网通常采用零担托运的方式发货，届时由客户自行到托运站提货。若有特殊情况需要快递或则按双方协商的其它方式发货的，由此造成的费用支出由客户自行承担。另因运费成本高，若调货不满800元的紧商网不承担运费。</div>
                        <div>9.2紧商网最少出货单位为紧商网的最小包装单位，不接受拆合（袋）出货。若是定制产品，交货数量按双方协商为准。没有特别说明的紧商网默认的交货公差为-10%到+10%之间。</div>
                        <div>第10条 不可抗力情况说明：</div>
                        <div>10.1不可抗力包括因战争、动乱或其他非当事双方责任造成的爆炸、火灾、台风、雨雪、洪水、地震等自然灾害以及政府关于产品的强制性政策规定等；</div>
                        <div>10.2任何一方由于不可抗力原因不能履行合同时，应在不可抗力事件发生后及时向对方通报，以减轻可能给对方造成的损失，在取得有关机构的不可抗力证明后，允许延期履行或修订合同，并根据情况可部分或全部免予承担违约责任；</div>
                        <div>第11条 违约与争议：</div>
                        <div>11.1紧商网无故不按协议约定向客户供货的，客户有权要求紧商网按未供货部分金额的 10 %支付违约金。</div>
                        <div>11.2客户不按协议约定及时支付货款的，紧商网有权要求客户按拖欠货款金额0.5%/天支付违约金；</div>
                        <div>11.3客户拖欠货款超过 5 天的，紧商网除有权要求客户按上述约定支付违约金外，还有权立即停止供货；客户拖欠货款超过 30 天的，紧商网除有权要求客户按上述约定支付违约金外，还有权解除合同，同时可向合同履行地的人民法院起诉。</div>
                        <div>11.4当事双方若发生争议应友好协商解决，协商不成的，可向合同履行地的人民法院起诉。</div>
                        <div>11.5本协议仅规定当事双方合作之准则，具体交易内容以双方确认的定单内容为准。除非针对单个合同内容有另行约定之外，均适用本协议。</div>
                        <div>第12条 所有权及知识产权条款</div>
                        <div>12.1用户一旦接受本协议，即表明该用户主动将其在任何时间段在本站发表的任何形式的信息内容（包括但不限于客户评价、客户咨询、各类话题文章等信息内容）的财产性权利等任何可转让的权利，全部独家且不可撤销地转让给紧商网所有，用户同意紧商网有权就任何主体侵权而单独提起诉讼。</div>
                        <div>12.2紧商网是本站的制作者,拥有此网站内容及资源的著作权等合法权利,受国家法律保护,有权不时地对本协议及本站的内容进行修改，并在本站张贴，无须另行通知用户。在法律允许的最大限度范围内，紧商网对本协议及本站内容拥有解释权。</div>
                        <div>12.3除法律另有强制性规定外，未经紧商网明确的特别书面许可,任何单位或个人不得以任何方式非法地全部或部分复制、转载、引用、链接、抓取或以其他方式使用本站的信息内容，否则，紧商网有权追究其法律责任。</div>
                        <div>12.4本站所刊登的资料信息（诸如文字、图表、标识、按钮图标、图像、声音文件片段、数字下载、数据编辑和软件），均是紧商网或其内容提供者的财产，受中国和国际版权法的保护。本站上所有内容的汇编是紧商网的排他财产，受中国和国际版权法的保护。本站上所有软件都是紧商网或其关联公司或其软件供应商的财产，受中国和国际版权法的保护。</div>
                        <div>第13条 责任限制及不承诺担保</div>
                        <div>除非另有明确的书面说明,本站及其所包含的或以其它方式通过本站提供给您的全部信息、内容、材料、产品（包括软件）和服务，均是在"按现状"和"按现有"的基础上提供的。</div>
                        <div>除非另有明确的书面说明,紧商网不对本站的运营及其包含在本网站上的信息、内容、材料、产品（包括软件）或服务作任何形式的、明示或默示的声明或担保（根据中华人民共和国法律另有规定的以外）。</div>
                        <div>紧商网不担保本站所包含的或以其它方式通过本站提供给您的全部信息、内容、材料、产品（包括软件）和服务、其服务器或从本站发出的电子信件、信息没有病毒或其他有害成分。</div>
                        <div>如因不可抗力或其它本站无法控制的原因使本站销售系统崩溃或无法正常使用导致网上交易无法完成或丢失有关的信息、记录等，紧商网会合理地尽力协助处理善后事宜。</div>
                        <div>第14条 协议更新及用户关注义务</div>
                        <div>根据国家法律法规变化及网站运营需要，紧商网有权对本协议条款不时地进行修改，修改后的协议一旦被张贴在本站上即生效，并代替原来的协议。用户可随时登陆查阅最新协议；用户有义务不时关注并阅读最新版的协议及网站公告。如用户不同意更新后的协议，可以且应立即停止接受紧商网网站依据本协议提供的服务；如用户继续使用本网站提供的服务的，即视为同意更新后的协议。紧商网建议您在使用本站之前阅读本协议及本站的公告。 如果本协议中任何一条被视为废止、无效或因任何理由不可执行，该条应视为可分的且并不影响任何其余条款的有效性和可执行性。</div>
                        <div>第15条 法律管辖和适用</div>
                        <div>本协议的订立、执行和解释及争议的解决均应适用在中华人民共和国大陆地区适用之有效法律（但不包括其冲突法规则）。 如发生本协议与适用之法律相抵触时，则这些条款将完全按法律规定重新解释，而其它有效条款继续有效。 如缔约方就本协议内容或其执行发生任何争议，双方应尽力友好协商解决；协商不成时，任何一方均可向有管辖权的中华人民共和国大陆地区法院提起诉讼。</div>
                        <div>第16条 其他</div>
                        <div>16.1紧商网网站所有者是指在政府部门依法许可或备案的紧商网网站经营主体。</div>
                        <div>16.2紧商网尊重用户和消费者的合法权利，本协议及本网站上发布的各类规则、声明等其他内容，均是为了更好的、更加便利的为用户和消费者提供服务。本站欢迎用户和社会各界提出意见和建议，紧商网将虚心接受并适时修改本协议及本站上的各类规则。</div>
                        <div>16.3本协议内容中以黑体、加粗、下划线、斜体等方式显著标识的条款，请用户着重阅读。</div>
                        <div>16.4您点击本协议下方的"同意并继续"按钮即视为您完全接受本协议，在点击之前请您再次确认已知悉并完全理解本协议的全部内容。</div>
                    </div>
                </Dialog>
            </div>
        )
    }
}
//属性默认值
RegisterAccount.defaultProps = {};

//属性
RegisterAccount.propTypes = {};