import React, {Component} from 'react';

import {render} from 'react-dom';
import {Router, browserHistory} from 'react-router';
import "babel-polyfill";
import routers from '../config/routes.jsx';

window.getHost = function getHost() {
    // if(window.location.hostname.indexOf("localhost") >= 0) {
        return process.env.HOST_URL;
    // }
    // return "http://" + window.location.hostname;
};
let pathHeader='/weixin';
export default class App extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    render() {
        return (
            <div style={{height:'100%', width:'100%'}}>
                {this.props.children}
            </div>
        )
    }
}

let runApp = function () {

    // var clickBeginTime = 0 ; //用户点击页面的时间
    // var lastGoBackTime = 0 ; //最后一次返回用户点击返回按钮的时间
    // var dataRequest = false; //是否是用户请求数据后页面的跳转---这个要依赖于网络，所有要请求数据然后跳转页面设置的参数。
    // window.addEventListener("touchend", function(e){
    //     console.log("on touch end event");
    //     clickBeginTime = new Date().getTime();
    // });
    //
    // window.markDataRequestFlag = function() {
    //     dataRequest = true;
    // };
    // window.onhrefchange = function(e) {
    //     var hrefChangeCostTime = new Date().getTime() - clickBeginTime;
    //     console.log("href change time:" + hrefChangeCostTime);
    //     if(hrefChangeCostTime < 100 || dataRequest) {
    //         console.log("这个是页面跳转。");
    //         dataRequest = false;
    //     } else {
    //         //多次跳转的时间，如果是由于页面多次出发href change 的话，那么这个时间是很短的
    //         //如果用户自己点击Back 按钮的话，那么这个time 应该会超出 0.3秒。
    //         var goBackTimes = (new Date().getTime() - lastGoBackTime);
    //         console.log("这个显然是：后退。自动跳转时间：" + goBackTimes);
    //         if(goBackTimes > 100) { //这个必然用户手动点击返回
    //             window.goBack();
    //             lastGoBackTime = new Date().getTime();
    //             dataRequest = false;
    //         } else { //调用返回按钮出发的 hrefChange, 导致二次跳转问题。
    //             console.log("这个显然是：二次跳转。自动跳转时间：" + goBackTimes);
    //         }
    //
    //     }
    //     return;
    // };
    //
    // window.goBack = function(){};

    render(
        <Router history={browserHistory}>
            {routers}
        </Router>,
        document.getElementById('content')
    );

}


window.FastClick && FastClick.attach(document.body);

window.onload = function (e) {
    setTimeout(function () {
        // !wx && runApp();
        runApp();
    }, 1000);
}

window.HistoryManager = (function () {

    var historyArr = JSON.parse(sessionStorage.getItem('historyArr'))||[];

    function register(accessUrl) {
        if (accessUrl) {
            historyArr.push(accessUrl);
            sessionStorage.setItem('historyArr',JSON.stringify(historyArr))
        } else {
            console.log("user gotopage using bad access url");
        }
        return;
    }

    function back() {
        if (historyArr && historyArr.length > 0) {
            var accessUrl = historyArr.pop();
            if (accessUrl) {
                window.location.href = accessUrl;
            } else {
                console.log(" the history url is empty , go to homepage ");
                window.location.href = pathHeader+"/";
            }
        } else {
            window.location.href = pathHeader+"/";
        }
    }

    //页面返回
    function pageBack() {
        console.log(JSON.stringify(historyArr));
        if (historyArr && historyArr.length > 0) {
            //debugger;
            historyArr.pop();
            sessionStorage.setItem('historyArr',JSON.stringify(historyArr))
            //弹出后
            if (historyArr && historyArr.length > 0) {
                var index = historyArr.length - 1;

                var accessUrl = historyArr[index];
                if (accessUrl != undefined) {
                    window.location.href = accessUrl;
                } else {
                    window.location.href = pathHeader+"/";
                }
            } else {
                window.location.href = pathHeader+"/";
            }
        } else {
            window.location.href = pathHeader+"/";
        }

    }

    //订单详情页面返回
    function pageBackTwice() {
        if (historyArr && historyArr.length > 1) {
            //debugger;
            historyArr.pop();
            //弹出后
            historyArr.pop();
            sessionStorage.setItem('historyArr',JSON.stringify(historyArr))
            let index = historyArr.length - 1;
            let accessUrl = historyArr[index];
            if (accessUrl != undefined) {
                // accessUrl=accessUrl.replace(accessUrl.charAt(accessUrl.length-1)+"",id);
                window.location.href = accessUrl;
            } else {
                window.location.href = pathHeader+"/MyOrders";
            }
        } else {
            window.location.href = pathHeader+"/";
        }

    }

    //返回特定的URL
    function pageBackToUrl(accessUrl) {
        if (accessUrl) {
            if (historyArr && historyArr.length > 0) {
                //找出第一个匹配的页面
                var findIndex = historyArr.findIndex(function (findUrl) {
                    return findUrl == accessUrl
                });
                if (findIndex != -1) {
                    //找到了!
                    while (historyArr.length - 1 > findIndex) {
                        historyArr.pop();
                    }
                    window.location.href = accessUrl;

                } else {
                    window.location.href = pathHeader+"/";
                }
                //if (historyArr&&historyArr.length > 0){
                //
                //    let index = historyArr.length - 1;
                //
                //    let accessUrl = historyArr[index];
                //    if(accessUrl) {
                //        window.location.href = accessUrl;
                //        return;
                //    }
                //}
            }
        } else {
            window.location.href = pathHeader+"/";
        }
    }

    //获取当前页面的前置页
    function getReferrer() {
        if (historyArr && historyArr.length > 1) {
            //表示有前置页
            var index = historyArr.length - 2;
            return historyArr[index];
        }
        return pathHeader+"/";
    }

    function removeAll() {
        historyArr = [];
        sessionStorage.setItem('historyArr',JSON.stringify(historyArr));
        return true;
    }

    return {
        register: register,
        back: back,
        pageBack: pageBack,
        pageBackTwice: pageBackTwice,
        pageBackToUrl: pageBackToUrl,
        getReferrer: getReferrer,
        removeAll: removeAll
    }
})();

// let configJSSDK = function(){
//     const configAccessUrl = getHost() + "/config";
//     fetch(configAccessUrl, {
//         credentials: 'include'
//     }).then((response) => {return response.json()}).then((jsonData) =>{
//         wx.config({
//             // appId : jsonData.appId,
//             appId : jsonData.data.appId,
//             timestamp:jsonData.data.timestamp,
//             nonceStr:jsonData.data.nonceStr,
//             signature:jsonData.data.signature,
//             jsApiList: ['onMenuShareTimeline',
//                 'onMenuShareAppMessage',
//                 'onMenuShareQQ',
//                 'onMenuShareWeibo',
//                 'onMenuShareQZone',
//                 'startRecord',
//                 'stopRecord',
//                 'onVoiceRecordEnd',
//                 'playVoice',
//                 'pauseVoice',
//                 'stopVoice',
//                 'onVoicePlayEnd',
//                 'uploadVoice',
//                 'downloadVoice',
//                 'chooseImage',
//                 'previewImage',
//                 'uploadImage',
//                 'downloadImage',
//                 'translateVoice',
//                 'getNetworkType',
//                 'openLocation',
//                 'getLocation',
//                 'hideOptionMenu',
//                 'showOptionMenu',
//                 'hideMenuItems',
//                 'showMenuItems',
//                 'hideAllNonBaseMenuItem',
//                 'showAllNonBaseMenuItem',
//                 'closeWindow',
//                 'scanQRCode',
//                 'chooseWXPay',
//                 'openProductSpecificView',
//                 'addCard',
//                 'chooseCard',
//                 'openCard']
//         });
//     }).catch("网络好像不太给力，请稍后重试！")
// }

// if(wx) {
    // configJSSDK();

//通过ready接口处理成功验证
//     wx.ready(function () {
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，
        // 则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        // wx.chooseImage({
        //     count: 1, // 默认9
        //     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        //     sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
        //     success: function (res) {
        //         var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        //         alert("localIds");
        //     }
        // });

    // });

//通过error接口处理失败验证
//     wx.error(function (res) {
        //configJSSDK();
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
    // });
// }

