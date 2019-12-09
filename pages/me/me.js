// pages/me/me.js
import wxRequest from '../../utils/request'
Page({

/**
   * 页面的初始数据
   */
  data: {
      avatar: '',
      name: '',
      personalInfo: [
        {
          imgUrl: '/imgs/company.png',
          info: ''
        },
        {
          imgUrl: '/imgs/phone-me.png',
          info: ''
        },
        {
          imgUrl: '/imgs/workbench.png',
          info: ''
        }
      ],
      values: [
        {value: "我的供应"},
        {value: "我的需求"}
      ],
      currentIndex: 0,
      productionInfo: [],
      supplyCollection: [],
      demandCollection: [],
      type: 'supply'
  },
  gotoDetail:function(e) {
    console.log('e.currentTarget的值：')
    console.log(e.currentTarget.dataset.index);
    wx.setStorageSync('itemIndex', e.currentTarget.dataset.index);

    //获取用户信息列表
    wxRequest.getUserInfoList(this.data.type, 'time', wx.getStorageSync('currentLongitude'), wx.getStorageSync('currentLatitude')).then((res) => {
      if (res.data.code === 20000) {
        let prodInfo = res.data.data.list[e.currentTarget.dataset.index];
        console.log('距离：', prodInfo.distance, prodInfo);
        console.log('createdAt: ' + prodInfo.createdAt);
        wx.navigateTo({
          url: "/pages/detail/detail?_id=" + prodInfo._id + '&creatorId=' + prodInfo.creatorId +
              '&creatorAvatar=' + prodInfo.creatorAvatar + '&creatorNickname=' + prodInfo.creatorNickname +
              '&title=' + prodInfo.title + '&desc=' + prodInfo.desc + '&distance=' + prodInfo.distance +
              '&location=' + prodInfo.location + '&atlas=' + prodInfo.atlas + '&createdAt=' + prodInfo.createdAt
        });
      } else {
        console.log('====错误！!====\n错误码：', res.data.code);
        console.log(res.errMsg);
      }
    });
  },
  //在点击和onLoad时调用此函数
  //按供应排序
  reSortBySupply: function(e) {
      //加if语句是因为在onLoad()调用该函数时不需要e参数
    if (e) {
      this.setData({
        currentIndex: e.target.dataset.index
      });
    }
    wxRequest.getUserInfoList('supply').then((res) => {
      if (res.data.code === 20000) {
        this.setData({
          //设置供应类型
          type: 'supply',
          //供应列表
          supplyCollection: res.data.data.list,
          //分栏第一列的最后一个项的索引，以此来判断第一、二列的分界线
          minuend: Math.ceil(res.data.data.list.length / 2) - 1
        });
        //对数组进行排序，如1，2，3 ，4，5，6...，排序后变成1，3，5，2，4，6
        let oldSupplyCollection = this.data.supplyCollection;
        let newSupplyCollection = [].concat(...(Array.from(oldSupplyCollection.reduce((total, cur, index) => {
          total[index % 2].push(cur)
          return total
        }, {0: [], 1: [], length: 2}))));
        this.setData({
          supplyCollection: newSupplyCollection
        });
      } else {
        console.log('====错误！!====\n错误码：', res.data.code);
        console.log(res.errMsg);
      }
    });

  },
  //按需求排序
  reSortByDemand: function(e) {
    if (e) {
      this.setData({
        currentIndex: e.target.dataset.index
      });
    }
    wxRequest.getUserInfoList('demand').then((res) => {
      if (res.data.code === 20000) {
        // console.log('获取需求列表！');
        console.log(res.data.data.list);
        this.setData({
          type: 'demand',
          demandCollection: res.data.data.list,
          minuend: Math.ceil(res.data.data.list.length / 2) - 1
        })
        //对数组进行排序，如1，2，3 ，4，5，6...，排序后变成1，3，5，2，4，6
        let oldDemandCollection = this.data.demandCollection;
        let newDemandCollection= [].concat(...(Array.from(oldDemandCollection.reduce((total, cur, index) => {
          total[index % 2].push(cur)
          return total
        }, {0: [], 1: [], length: 2}))));
        this.setData({
          demandCollection:newDemandCollection
        })
      } else {
        console.log('====错误！!====\n错误码：', res.data.code);
        console.log(res.errMsg);
      }
    });


  },
  modify: function () {
    wx.navigateTo({
      url: '/pages/modify/modify'
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的'
    });
    this.reSortBySupply();
    let that = this;
    wxRequest.relogin().then((res) => {
      if (res.data.code === 20000) {
        let info = res.data.data.user;
        this.setData({
          avatar: info.avatarUrl,
          name: info.realName,
          personalInfo: [
            {
              imgUrl: '/imgs/company.png',
              info: info.company
            },
            {
              imgUrl: '/imgs/phone-me.png',
              info: info.phoneNumber
            },
            {
              imgUrl: '/imgs/workbench.png',
              info: info.position
            }
          ]
        });
        this.reSortBySupply();

      } else {
        console.log('====错误！!====\n错误码：', res.data);
        console.log(res.errMsg);
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
    console.log('index: ',this.data.currentIndex)
    if (this.data.currentIndex == 0) {
      this.reSortBySupply()
    }
    if (this.data.currentIndex == 1) {
      this.reSortByDemand()
    }
    wxRequest.relogin().then((res) => {
      if (res.data.code === 20000) {
        let info = res.data.data.user;
        this.setData({
          avatar: info.avatarUrl,
          name: info.realName,
          personalInfo: [
            {
              imgUrl: '/imgs/company.png',
              info: info.company
            },
            {
              imgUrl: '/imgs/phone-me.png',
              info: '18759770340'
            },
            {
              imgUrl: '/imgs/workbench.png',
              info: info.position
            }
          ]
        })
      } else {
        console.log('====错误！!====\n错误码：', res.data.code);
        console.log(res.errMsg);
      }
    });

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
    wxRequest.relogin().then((res) => {
      if (res.data.code === 20000) {
        let info = res.data.data.user;
        this.setData({
          avatar: info.avatarUrl,
          name: info.realName,
          personalInfo: [
            {
              imgUrl: '/imgs/company.png',
              info: info.company
            },
            {
              imgUrl: '/imgs/phone-me.png',
              info: '18759770340'
            },
            {
              imgUrl: '/imgs/workbench.png',
              info: info.position
            }
          ]
        });
        setTimeout(function () {
          wx.stopPullDownRefresh();
        }, 500);
      } else {
        console.log('====错误！!====\n错误码：', res.data.code);
        console.log(res.errMsg);
      }
    });
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
})