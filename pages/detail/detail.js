// pages/detail/detail.js
import wxRequest from '../../utils/request'
import myUtils from "../../utils/myUtils";
const phone = ''

Page({

    /**
     * 页面的初始数据
     */
    data: {
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//         state: 0,
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
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
    solved: function () {
        wxRequest.modifyState(this.data._id, 1).then(res => {
            // console.log('res of solved: ', res.data.data)
            this.setData({
                state: res.data.data.state
            })
        });
    },
    unsolved: function () {
        wxRequest.modifyState(this.data._id, 0).then(res => {
            this.setData({
                state: res.data.data.state
            })
        });
    },
    cancelInfo: function () {
        wx.showModal({
            title: '提示',
            content: '是否删除该条发布信息',
            success:  (res)=> {
                if (res.confirm) {
                    wxRequest.deleteInfo(this.data._id).then(r => {
                        // console.log('res of deleteInfo: ', r.data)
                    });
                    wx.setStorageSync('fromDetail', true);
                    wx.switchTab({
                        url: '/pages/square/square'
                    })
                } else {
                    console.log('你点击了取消')
                }
            }
        })

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
        console.log('detail: ', options)
        let timestamp = Date.parse(new Date());
        this.setData({
            timestamp: timestamp,
            _id: options._id
        });
        // console.log('options._id: ',options._id)
       /* this.setData({
            creatorPhoneNumber: options.creatorPhoneNumber
        })*/
        await wxRequest.browseringHistory(options._id, options.creatorId).then((res) => {
            if (res.data.code === 20000) {
                // console.log("感兴趣!");
                // console.log(res);
            } else {
                console.log('====错误！!====\n错误码：', res.data.code);
                console.log(res.errMsg);
            }
        });
        //获取详细信息接口
        wxRequest.getDetail(options._id, wx.getStorageSync('currentLongitude')||0, wx.getStorageSync('currentLatitude')||0).then(res => {
            let userInfo = res.data.data
            // console.log('userInfo: ', res.data.data)
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
                type: userInfo.type,
                creatorPhoneNumber: userInfo.creatorPhoneNumber,
                state: userInfo.state,
                viewCount: userInfo.viewCount
            })
            wxRequest.getUserInfo().then(res => {
                if (userInfo.creatorPhoneNumber === res.data.data.phoneNumber) {
                    // console.log('onwer: ',true)
                    this.setData({
                        owner: true
                    })
                } else {
                    // console.log('onwer: ',false)
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

        //如果该用户还没有登录
        if (!wx.getStorageSync('loginState')) {
            //看有没有授权地理位置
            this.authLocation()
        }
        wx.setNavigationBarTitle({
            title: '供求详情'
        });

        //options._id是提交请求数据data中的infoId
        await wxRequest.getBrowseringHistory(options._id).then((res) => {
            if (res.data.code === 20000) {
                // console.log("请求感兴趣成功！");
                let list = res.data.data.list;
                let avatarUrls = []
                list.map(item => {
                    // 取得userId的后8位
                    item.userId = item.userId.substring(item.userId.length - 8)
                    // 当手机号为0时，让该项排在数组的后面，当有手机号时该项排前面
                    if (item.userInfo.phoneNumber === 0 || Object.keys(item.userInfo).length == 0) {
                        avatarUrls.push(item.userInfo.avatarUrl);
                    } else {
                        avatarUrls.unshift(item.userInfo.avatarUrl)
                    }
                })
                // 最多显示5个头像，并且把没有头像的去除
                avatarUrls = avatarUrls.slice(0, 5).filter(item => item !== undefined)
                try {
                    this.setData({
                        list: list,
                        interestedCount: res.data.data.pagination.total,
                        infoId: list[0].infoId,
                        avatarUrls: avatarUrls
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
        wx.setStorageSync('fromDetail', true);
    },
    onShow: function(){
        let timestamp = Date.parse(new Date());
        this.setData({
            timestamp: timestamp
        });
    },
    //todo 12/10
    contact: function () {
        if (wx.getStorageSync('loginState')) {
            wx.makePhoneCall({
                phoneNumber: this.data.creatorPhoneNumber
            })
        } else {
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
                                    console.log('detail页面: 出错！')
                                }
                            }
                        });
                    }
                }
            });
        }


    },

    onShareAppMessage: function () {
        return {
            path: '/pages/square/square?_id=' + this.data._id,
            title: '我发布了一则信息，快来围观吧！'
        }
    }
})
