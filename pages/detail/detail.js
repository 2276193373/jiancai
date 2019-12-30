// pages/detail/detail.js
import wxRequest from '../../utils/request'
import myUtils from "../../utils/myUtils";
const phone = ''

Page({

    /**
     * 页面的初始数据
     */
    data: {
        pop_published: false,
        owner: false,
        //获取屏幕高高
        getHeight: wx.getSystemInfoSync().windowHeight,
        winHeight: wx.getSystemInfoSync().windowHeight,
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
        isIpx: getApp().globalData.isIpx,
        creatorPhoneNumber: ''
    },
    close: function () {
        wx.setStorageSync('pop', false);
        this.setData({
            published_showModal: false,
            published_show_: false,
            pop_published: wx.getStorageSync('pop')
        })
    },
    share: function () {
        wx.setStorageSync('pop', false);
        this.setData({
            pop_published: wx.getStorageSync('pop')
        })
    },
    //授权地理位置
    authLocation: function () {
        wx.getSetting({
            success: (res) => {
                //当拒绝地理位置授权
                if (!res.authSetting['scope.userLocation']) {
                    //未授权
                    wx.showModal({
                        title: '请求授权当前位置',
                        content: '需要获取您的地理位置，请确认授权',
                        success: function (res) {
                            if (res.cancel) {
                                //取消授权
                                wx.showToast({
                                    title: '拒绝授权地理位置！',
                                    icon: 'none',
                                    duration: 1500
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
                                        } else {
                                            wx.showToast({
                                                title: '授权地理位置！',
                                                icon: 'none',
                                                duration: 1500
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    })

                }else {//已授权
                    console.log('地理位置已授权!');
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
            title: '还没有人感兴趣！',
            icon: 'none'
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        let timestamp = Date.parse(new Date());
        this.setData({
            timestamp: timestamp
        });
        console.log('options._id: ',options._id, options.creatorPhoneNumber)
        this.setData({
            creatorPhoneNumber: options.creatorPhoneNumber
        })
        //获取详细信息接口
        wxRequest.getDetail(options._id, wx.getStorageSync('currentLongitude')||0, wx.getStorageSync('currentLatitude')||0).then(res => {
            let userInfo = res.data.data
            console.log('userInfo: ', res.data.data)
            this.setData({
                avatar: userInfo.creatorAvatar,
                name: userInfo.creatorRealNane,
                title: userInfo.title,
                desc: userInfo.desc,
                location: userInfo.location,
                atlas: userInfo.atlas,
                distance: (parseFloat(userInfo.distance) / 1000).toFixed(2),
                creatorId: userInfo.creatorId,
                _id: userInfo._id,
                createdAt: userInfo.createdAt,
                company: userInfo.company,
                type: userInfo.type
            })
            wxRequest.getUserInfo().then(res => {
                console.log('res.data of getUser', res.data.data)
                if (userInfo.creatorPhoneNumber === res.data.data.phoneNumber) {
                    console.log('onwer: ',true)
                    this.setData({
                        owner: true
                    })
                } else {
                    console.log('onwer: ',false)
                    this.setData({
                        owner: false
                    })
                }
            });
        });
        //设置遮罩层状态
        this.setData({
            pop_published: wx.getStorageSync('pop')
        })
        wx.getSetting({
            success: (res) => {
                //查看地理位置授权
                if (res.authSetting['scope.userLocation']) {
                    this.setData({
                        loc: true
                    });
                } else {
                    wx.getLocation({
                      success: res => {
                          console.log('授权地理位置！');
                      }
                    })
                }
            }
        });
        wx.login({
            success: res => {
                if (res.code) {
                    wxRequest.login(res.code).then(res => {
                        //如果该用户还没有登录
                        if (!res.data.data) {
                            //看有没有授权地理位置
                            this.authLocation()
                        }
                    });
                }
            }
        })
        /*let timestamp = Date.parse(new Date());
        this.setData({
            timestamp: timestamp
        });*/
        wx.setNavigationBarTitle({
            title: '供求详情'
        });
        await wxRequest.browseringHistory(options._id, options.creatorId).then((res) => {
            if (res.data.code === 20000) {
                console.log("感兴趣!");
                console.log(res);
            } else {
                console.log('====错误！!====\n错误码：', res.data.code);
                console.log(res.errMsg);
            }
        });
        //options._id是提交请求数据data中的infoId
        await wxRequest.getBrowseringHistory(options._id).then((res) => {
            if (res.data.code === 20000) {
                console.log("请求感兴趣成功！");
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
                try {
                    this.setData({
                        list: list,
                        interestedCount: list.length,
                        infoId: list[0].infoId
                    });
                } catch (e) {
                    console.log('捕抓到的异常:', e)
                }
            } else {
                console.log('====错误！!====\n错误码：', res.data.code);
                console.log(res.errMsg);
                console.log('请求感兴趣失败！');
            }
        });
    },
    onShow: function(){
        let timestamp = Date.parse(new Date());
        this.setData({
            timestamp: timestamp
        });
    },

    //todo 12/10
    contact: function () {
        wx.login({
            success: res => {
                if (res.code) {
                    wxRequest.login(res.code).then(res => {
                        if (!res.data.data) {
                            myUtils.registerTip('注册后即可联系')
                        } else {
                            if (!res.data.data.user.phoneNumber) {
                                myUtils.registerTip('注册后即可联系')
                            }
                            else if (!res.data.data.user.realName) {
                                myUtils.registerTip('注册后即可联系')
                            } else {
                                wxRequest.relogin().then(res => {
                                    console.log('this.data: ', this.data)
                                    let phoneNumber = this.data.phoneNumber
                                    wx.makePhoneCall({
                                        //电话号码为字符串，并非数字
                                        phoneNumber: this.data.creatorPhoneNumber
                                    })
                                });
                            }
                        }
                    });
                }
            }
        })

    },
})
