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