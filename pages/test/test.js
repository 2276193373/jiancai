// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min');

// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: '52TBZ-3CXEF-MDMJK-NYPO7-AI3FF-EPF64' // 必填
});
import Util from '../../utils/getImageZoom';
Page({
    getSetting:function(){ //获取用户的当前设置
        const _this = this;
        wx.getSetting({
            success: (res) => {
                // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
                // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
                // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
                if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true)                     {
                    //未授权
                    wx.showModal({
                        title: '请求授权当前位置',
                        content: '需要获取您的地理位置，请确认授权',
                        success: function (res) {
                            if (res.cancel) {
                                //取消授权
                                wx.showToast({
                                    title: '拒绝授权',
                                    icon: 'none',
                                    duration: 1000
                                })
                            } else if (res.confirm) {
                                //确定授权，通过wx.openSetting发起授权请求
                                wx.openSetting({
                                    success: function (res) {
                                        if (res.authSetting["scope.userLocation"] == true) {
                                            wx.showToast({
                                                title: '授权成功',
                                                icon: 'success',
                                                duration: 1000
                                            })
                                            //再次授权，调用wx.getLocation的API
                                            wx.getLocation({
                                              success: res => {

                                              }
                                            })
                                        } else {
                                            wx.showToast({
                                                title: '授权失败',
                                                icon: 'none',
                                                duration: 1000
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    })
                } else if (res.authSetting['scope.userLocation'] == undefined) {
                    //用户首次进入页面,调用wx.getLocation的API
                    // _this.goAddress();
                    wx.getLocation({
                      success: res => {
                          console.log(1111)
                      }
                    })
                }
                else {
                    // console.log('授权成功')
                    //调用wx.getLocation的API
                    // _this.goAddress();
                    wx.getLocation({
                      success: res => {
                          console.log(2222)
                      }
                    })
                }
            }
        })
    },
});