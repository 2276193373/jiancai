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
    list: [],
    currentPage: 1,
    _id: ''
  },
  contact: function (e) {
    let index = e.currentTarget.dataset.index
    console.log(this.data.list, 'list.data')
    wx.makePhoneCall({
      phoneNumber: this.data.list[index].userInfo.phoneNumber.toString()
    })
  },
  listSort: function(list) {
    let listSort = []
    list.map(item => {
      // 取得userId的后8位
      item.userId = item.userId.substring(item.userId.length - 8)
      // 当手机号为0时，让该项排在数组的后面，当有手机号时该项排前面
      if (item.userInfo.phoneNumber === 0 || Object.keys(item.userInfo).length === 0) {
        listSort.push(item)
      } else {
        listSort.unshift(item)
      }
    })
    return listSort
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    myUtils.wxSetNavbarTitle('感兴趣的人');
    wxRequest.getBrowseringHistory(options.infoId, 1).then((res) => {
      if (res.data.code === 20000) {
        let list = res.data.data.list
        list = this.listSort(list)
        this.setData({
          list: list,
          _id: options.infoId
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
    this.data.currentPage = this.data.currentPage + 1;
    wxRequest.getBrowseringHistory(this.data._id, this.data.currentPage).then((res) => {
      if (res.data.code === 20000) {
        let list = this.data.list.concat(res.data.data.list)
        // 对列表排序，有头像的在前面
        list = this.listSort(list)
        this.setData({
          list: list
        });
        if (res.data.data.list.length === 0) {
          wx.showLoading({
            title: '没有更多了哦！',
            success: function () {
              setTimeout(function () {
                wx.hideLoading()
              }, 500)
            }
          })
        } else {
          wx.showLoading({
            title: '加载中...',
            success: res => {
              setTimeout(function () {
                wx.hideLoading()
              }, 200)
            }
          })
        }
      } else {
        console.error('interested-onReachBottom-error:',res.data)
      }
    });
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
