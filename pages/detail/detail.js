// pages/detail/detail.js
import wxRequest from '../../utils/request'
import myUtils from "../../utils/myUtils";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //获取屏幕高高
    getHeight: wx.getSystemInfoSync().windowHeight,
    loc: '',
    creatorId: '',
    avatar: "",
    //传过来的用户创建时的时间戳
    createdAt: 0,
    //当前时间戳
    timestamp: 0,
    company: '',
    type: '',
    name: '',
    title: '',
    atlas: [],
    desc: '',
    location: '',
    distance: '',
    //感兴趣的人数
    interestedCount: '',
    _id: '',
    infoId: '',
    phoneNumber: ''
  },

  authLocation: function () {
    wx.getSetting({
      success: (res) => {
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          //未授权
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                //取消授权
                wx.showToast({
                  title: '发布信息需要授权地理位置！',
                  icon: 'none',
                  duration: 1500
                })
              } else if (res.confirm) {
                //确定授权，通过wx.openSetting发起授权请求
                wx.openSetting({
                  success: function (res) {
                    if (res.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功，可以发布信息了',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                    } else {
                      wx.showToast({
                        title: '发布信息需要授权地理位置！',
                        icon: 'none',
                        duration: 1500
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
            wx.getLocation({
              success: res => {
                console.log('地理位置信息：', res)
              }
            })
          console.log(111)
        } else {
          console.log(222)
          // wx.navigateTo({
          //     url: '/pages/publish/publish'
          // })

        }
      }
    })
  },

  previewImage: function (e) {
    wx.previewImage({
      current: this.data.atlas[e.target.dataset.index],//当前显示的图片
      urls: this.data.atlas
    })
  },
  gotoInterested: function () {
    console.log('infoId: ')
    console.log(this.data.infoId)
    wx.navigateTo({
      url: '/pages/interested/interested?infoId=' + this.data.infoId
    })
  },
  todo: function () {
      wx.showToast({
        title: '没有人感兴趣哦！'
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    let _this = this;
    wx.login({
      success: res => {
        if (res.code) {
          wxRequest.login(res.code).then(res => {
            //如果该用户还没有登录
            if (!res.data.data) {
              //看有没有授权地理位置
              _this.authLocation()
            }
          });
        }
      }
    })
    console.log('options: ',options);
    this.setData({
      title: options.title,
      desc: options.desc,
      avatar: options.avatar,
      location: options.location,
      createdAt: options.createdAt,
      name: options.name,
      loc: options.loc,
      type: options.type,
      company: options.company,
      phoneNumber: options.phoneNumber
    })

    let timestamp = Date.parse(new Date());
    this.setData({
      timestamp: timestamp
    });
    wx.setNavigationBarTitle({
      title: '供求详情'
    });
    await wxRequest.getInfoList('', '', wx.getStorageSync('currentLongitude'), wx.getStorageSync('currentLatitude')).then((res) => {
      if (res.data.code === 20000) {
        let strAtlas = options.atlas.toString();
        //options传过来的是字符串，要转为数组
        let atlas = strAtlas.split(',');
        this.setData({
          avatar: options.creatorAvatar,
          name: options.creatorNickname,
          title: options.title,
          desc: options.desc,
          location: options.location,
          atlas: atlas,
          distance: (parseFloat(options.distance) / 1000).toFixed(2),
          creatorId: options.creatorId,
          _id: options._id,
          createdAt: options.createdAt
        });
      } else {
        console.log('====错误！!====\n错误码：',res.data.code);
        console.log(res.errMsg);
      }
    });
    await wxRequest.browseringHistory(options._id, options.creatorId).then((res) => {
      if (res.data.code === 20000) {
        console.log("感兴趣!");
        console.log(res);
      } else {
        console.log('====错误！!====\n错误码：',res.data.code);
        console.log(res.errMsg);
      }
    });
      //options._id是提交请求数据data中的infoId
    await wxRequest.getBrowseringHistory(options._id).then((res) => {
      if (res.data.code === 20000) {
        console.log("请求感兴趣成功！");
        console.log('有n个人感兴趣，看list长度')
        console.log(res.data.data.list)
        let list = res.data.data.list;
        //遍历感兴趣列表
        for (let i = 0; i < list.length; i++) {
          //如果当前列表中的用户id与当前信息创建者id一致，则将手机号设置为此人的手机号
          if (this.data.creatorId === list[i].userId) {
            this.setData({
              phoneNumber: list[i].phoneNumber
            })
          }
        }
        this.setData({
          list: list,
          interestedCount: list.length,
          infoId: list[0].infoId
        });
      } else {
        console.log('====错误！!====\n错误码：',res.data.code);
        console.log(res.errMsg);
        console.log('请求感兴趣失败！');
      }
    });
  },

  //todo 12/10
  contact: function () {
    wxRequest.relogin().then(res => {
      console.log('user', res.data.data.user)
      let phoneNumber = this.data.phoneNumber
      myUtils.phoneCall(phoneNumber);
    });
  },
})