// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min');

// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: '52TBZ-3CXEF-MDMJK-NYPO7-AI3FF-EPF64' // 必填
});
Page({
    onLoad() {
        wx.login({
            success: res => {
                if (res.code) {
                    wx.request({
                        url: 'http://118.25.21.169:2000/weapp/users/login',
                        method: 'POST',
                        data: {
                            code: res.code
                        },
                        success: r => {
                            console.log(r.data);
                        }
                    })
                }
            }
        })
    }
 })
