// pages/login/unit/unit.js
import wxRequest from '../../utils/request'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    winHeight: wx.getSystemInfoSync().windowHeight,
    name1: '',
    name2: '',
    position: '',
    avatarUrl: '',
    gender: '',
    phoneNumber: '',
    realName: '',
    nickName: ''
  },

  //微信授权部分
  login: function() {
    let _this = this;
    wx.login({
      success(login_res) {
        if (login_res.code) {
            wx.setStorageSync('login_code', login_res.code);
        } else {
          console.log('登录失败！ 错误码：' + res.errMsg.code);
        }
      }
    })
  },
  onGotUserInfo: function (e) {
    if (e.detail.errMsg === 'getUserInfo:ok') {
      wx.getUserInfo({
        success: (getUser_res) => {
          //登录、 code, iv, encryptedData
          console.log('--------------------')
          wxRequest.login(wx.getStorageSync('login_code'), getUser_res.iv, getUser_res.encryptedData).then((res) => {
            if (res.data.code === 20000) {
              wx.setStorageSync('token', res.data.data.token);
              console.log('微信号授权成功！');
              // wxRequest.relogin();
              //获取用户头像地址，说明微信已授权
              wxRequest.getUserInfo().then(res => {
                console.log('res.data: ----', res.data)
                this.setData({
                  avatarUrl:res.data.data.avatarUrl
                });
              });
            } else {
              console.log('微信授权失败！错误码：', res.data.code);
              console.log('\n====错误信息：', res.data.data);
            }
          });
          console.log("getUserInfo成功");
        },
        fail: function (getUser_res) {
          console.log("getUserInfo失败: ", getUser_res.errMsg);
        }
      });
      wx.setStorage({
        key: 'userInformation',
        data: e.detail.userInfo
      });
    } else {
      console.log('请授权后使用！');
    }
  },

  //手机号授权部分
  getPhoneNumber: function(e) {
    let _this = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          wxRequest.bindPhoneNumber(e.detail.iv, e.detail.encryptedData).then((res) => {
            if (res.data.code === 20000) {
              wxRequest.relogin().then(res => {
                _this.setData({
                  phoneNumber: res.data.data.user.phoneNumber
                })
              });
              console.log('手机号授权成功！!');
            } else {
              console.log('手机授权失败！错误码：', res.data.code);
              console.log('\n====错误信息：', res.data.data);
            }
          });

        } else {
          console.log('res.code错误！!');
        }
      }
    })
  },
  //完善信息部分
  inputedit1: function(e) {
    let that = this;
    //dataset为{name: 'peopleNumber'}
    let dataset = e.currentTarget.dataset;
    let value = e.detail.value;
    //name为peopleNumber
    let name1 = dataset.name1;
    that.data[name1] = value;
    that.setData({
      name1: that.data[name1]
    });
  },
  inputedit2: function(e) {
    let that = this;
    //dataset为{name: 'peopleNumber'}
    let dataset = e.currentTarget.dataset;
    let value = e.detail.value;
    //name为peopleNumber
    let name2 = dataset.name2;
    that.data[name2] = value;
    that.setData({
      name2: that.data[name2]
    });
  },
  inputedit3: function(e) {
    let that = this;
    //dataset为{name: 'peopleNumber'}
    let dataset = e.currentTarget.dataset;
    let value = e.detail.value;
    //name为peopleNumber
    let position = dataset.position;
    that.data[position] = value;
    that.setData({
      position: that.data[position]
    });
  },
  //提交信息
  submit: function(){
    let that = this;
    wxRequest.improvement(
        this.data.name1,
        this.data.name2,
        this.data.position,
        wx.getStorageSync('userInformation').avatarUrl,
        wx.getStorageSync('userInformation').gender
    ).then((res) => {
      if (res.data.code === 20000) {
        wx.setStorageSync('personalInfo', {
          realName: this.data.name1,
          company: this.data.name2,
          position: this.data.position,
          avatarUrl: wx.getStorageSync('userInformation').avatarUrl,
          gender: wx.getStorageSync('userInformation').gender
        });
        wxRequest.relogin().then((res) => {
          if (res.data.code === 20000) {
            console.log('1234:', res.data.data.token)
              wx.setStorageSync('token', res.data.data.token);
          } else {
            console.log('重新登录失败!(input_info.js)');
          }
        });
      } else {
        console.log('填写信息上传失败！错误码：', res.errMsg.code);
        console.log('====错误！!====\n错误码：',res.data.code);
        console.log('\n====错误信息：', res.data.msg);
      }

    });



    wx.showToast({
      title: '注册成功！',
      icon: 'success',
      duration: 1000,
      mask: true
    });
    //跳转到广场
    wx.switchTab({
      url: '/pages/square/square'
    })
  },
  todoFun: function() {
    wx.showToast({
      title: '请填写完整！',
      icon: 'loading'
    });
    console.log('请将信息填写完整!!');
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   /* wxRequest.relogin().then(res => {
      try {
        this.setData({
          avatarUrl: res.data.data.user.avatarUrl,
          phoneNumber: res.data.data.user.phoneNumber==0?'':res.data.data.user.phoneNumber,
          realName: res.data.data.user.phoneNumber
        });
      } catch (e) {
        console.log('这是预料中的异常，不必理会！\n异常信息：【',e+'】');
      }
      console.log('avatarUrl: ', this.data.avatarUrl);
      console.log('phone: ', this.data.phoneNumber);
      console.log('realName: ', this.data.realName);
      console.log('res.data1: ',res.data.data.user);
    });*/
    wx.setNavigationBarTitle({
      title: '我的'
    });
    //获取位置信息
    wx.getLocation({
      success: res => {
        const latitude = res.latitude;
        const longitude = res.longitude;
        wx.setStorageSync('currentLatitude', latitude);
        wx.setStorageSync('currentLongitude', longitude);
      }
    });
    // ？？？？
   /* this.setData({
      token: wx.getStorageSync('token'),
      phoneNumber: wx.getStorageSync('phoneNumber'),
    });*/
  },
  onShow: function () {
    wx.login({
      success: res => {
        if (res.code) {
          wxRequest.login(res.code).then(r => {
            console.log('r.data: ', r.data)
            this.setData({
              nickName: r.data.data.user.nickName,
              phoneNumber: r.data.data.user.phoneNumber,
              realName: r.data.data.user.realName
            })
          });
        }
      }
    });

  }
})