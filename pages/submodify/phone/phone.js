// pages/submodify/gender.js
import myUtils from "../../../utils/myUtils";
import wxRequest from '../../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  getPhoneNumber: function (e) {
      wx.login({
        success: function (res) {
          if (res.code) {
              wxRequest.bindPhoneNumber(e.detail.iv, e.detail.encryptedData).then((res) => {
              if (res.data.code === 20000) {
                wx.redirectTo({
                  url: '/pages/modify/modify'
                });
              } else {
                console.log('重新绑定手机号出错！');
                console.log('====错误！!====\n错误码：',res.data.code);
                console.log('\n====错误信息：', res.data.msg);
              }
            });
            /*wx.request({
              url: wx.getStorageSync('baseUrl') + 'weapp/users/me/bind/phone',
              method: 'PUT',
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + wx.getStorageSync('token')
              },
              data: {
                iv: e.detail.iv,
                encryptedData: e.detail.encryptedData
              },
              success: function (res) {
                wx.redirectTo({
                  url: '/pages/modify/modify'
                })
              },
              fail: function (res) {
                console.log(res.errMsg);
              }
            });*/
          } else {
            console.log('获取手机号失败！');
          }
        }
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    myUtils.wxSetNavbarTitle('手机号');

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  }
})