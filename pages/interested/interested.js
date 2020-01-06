// pages/interested/interested.js
import myUtils from "../../utils/myUtils";
import wxRequest from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar: '',
    name: '',
    company: '',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  contact: function (e) {
    let index = e.currentTarget.dataset.index
    wx.makePhoneCall({
      phoneNumber: this.data.list[index].phoneNumber.toString()
    })
  },
  onLoad: function (options) {
    myUtils.wxSetNavbarTitle('感兴趣的人');
    wxRequest.getBrowseringHistory(options.infoId).then((res) => {
      if (res.data.code === 20000) {
        let list = res.data.data.list;
        for (let i = 0; i < list.length; i++) {
          list[i].userId = list[i].userId.substring(list[i].userId.length - 8)
        }
        this.setData({
          list: list
        });
      } else {
        console.log('====错误！!====\n错误码：',res.data.code);
        console.log('\n====错误信息：', res.data.msg);
      }
    });
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

  }
  ,
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  }
})
