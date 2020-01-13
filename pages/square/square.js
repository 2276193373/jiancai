import wxRequest from '../../utils/request'
import myUtils from "../../utils/myUtils";
var app = getApp()

var QQMapWX = require('../../utils/qqmap-wx-jssdk.min');
var qqmapsdk = new QQMapWX({
    key: '52TBZ-3CXEF-MDMJK-NYPO7-AI3FF-EPF64'
});
Page({
    data: {
        imageWidth: 0,
        imageHeight: 0,
        company: '',
        timestamp: 0,
        pop_published: false,
        published_showModal: true,
        published_show_: true,
        //遮罩层高度
        Modal_winHeight: (wx.getSystemInfoSync().screenHeight - 64),
        //分页参数
        currentPage: 1,
        totalPage: 1,
        //排序方式
        sortWay: '按时间排序',
        //产品信息
        productionInfo: [],
        //公司
        comany: '',
        winWidth: wx.getSystemInfoSync().windowWidth + 'rpx',
        winHeight: wx.getSystemInfoSync().windowHeight,
        values: [
            {value: "需求广场"},
            {value: "供应广场"}
        ],
        //被点击的导航菜单的索引
        currentIndex: 0,
        showModal: false,
        sortType: 'sortByTime',
        //api中使用 排序方式
        sortKind: 'time',
        loc: '',
        type: 'demand'
    },
    tip: function () {
        let _this = this
        wx.getSetting({
            success: (res) => {
                if (!res.authSetting['scope.userLocation']) {
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
                                            wx.getLocation({
                                                success: res => {
                                                    wx.setStorageSync('currentLongitude', res.longitude);
                                                    wx.setStorageSync('currentLatitude', res.latitude)
                                                    wxRequest.getInfoList(_this.data.type, _this.data.sortKind, wx.getStorageSync('currentLongitude'), wx.getStorageSync('currentLatitude')).then(res => {
                                                        if (res.data.code === 20000) {
                                                            _this.setData({
                                                                productionInfo: res.data.data.list
                                                            });
                                                        } else {
                                                            console.error('square-76-error:',res.data)
                                                        }
                                                    });
                                                }
                                            })
                                            _this.setData({
                                                loc: true
                                            })
                                            wx.showToast({
                                                title: '授权成功，可以发布信息了',
                                                icon: 'none',
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
                }  else {
                    console.log(222)
                }
            }
        })

    },
    authTip: function() {
        wx.showToast({
          title: '按距离排序需要授权位置信息！',
          icon: 'none'
        })
    },
    gotoDetail(e) {
        //获取当前点击的元素的索引,并缓存
        // wx.setStorageSync('itemIndex', e.currentTarget.dataset.index);
        // console.log('e.item: ',e.currentTarget.dataset.item)
        let productInfo = e.currentTarget.dataset.item
        wx.navigateTo({
            url: `/pages/detail/detail?_id=${productInfo._id}`
        });

    },
//点击首页导航栏按钮
    activeNav(e) {
        let timestamp = Date.parse(new Date());
        if (e) {
            this.setData({
                currentIndex: e.target.dataset.index
            });
        }
        if (this.data.currentIndex == 0) {
            let timestamp = Date.parse(new Date());
            this.setData({
                type: 'demand',
                currentPage: 1,
                timestamp: timestamp
            });
        } else {
            this.setData({
                type: 'supply',
                currentPage: 1,
                timestamp: timestamp
            })
        }
        //获取信息流列表
        wxRequest.getInfoList(this.data.type, this.data.sortKind, wx.getStorageSync('currentLongitude'), wx.getStorageSync('currentLatitude'), 10, this.data.currentPage).then((res) => {
            if (res.data.code === 20000) {
                this.setData({
                    productionInfo: res.data.data.list,
                });
                //获得当前时间戳
            } else {
                console.error('square-138-error:',res.data)
            }
        });
    },
    btn: function () {
        this.setData({
            showModal: true
        });
    },
    hideModal: function () {
        this.setData({
            showModal: false
        })
    },
    sortByTime: function () {
        this.setData({
            sortWay: '按时间排序',
            showModal: false,
            sortType: 'sortByTime',
            sortKind: 'time',
            currentPage: 1
        });
        //重新封装wx.request
        wxRequest.getInfoList(this.data.type, this.data.sortKind, wx.getStorageSync('currentLongitude'), wx.getStorageSync('currentLatitude'), 10, this.data.currentPage).then((res) => {
            if (res.data.code === 20000) {
                this.setData({
                    productionInfo: res.data.data.list
                });
            } else {
                console.error('square-168-error:',res.data)
            }
        });
    },
    //按距离排序
    sortByDistance: function () {
        this.setData({
            sortWay: '按距离排序',
            showModal: false,
            sortType: 'sortByDistance',
            sortKind: 'distance',
            currentPage: 1
        });

        //重新封装wx.request,获取用户信息流列表
        wxRequest.getInfoList(this.data.type, this.data.sortKind, wx.getStorageSync('currentLongitude'), wx.getStorageSync('currentLatitude'), 10, this.data.currentPage).then((res) => {
            if (res.data.code === 20000) {
                this.setData({
                    productionInfo: res.data.data.list
                });
            } else {
                console.error('square-187-error:',res.data)
            }
        });
    },
    gotoPublish: function () {
        if (wx.getStorageSync('loginState')) {
            wx.getSetting({
                success:  (res)=> {
                    if (res.authSetting['scope.userLocation']) {
                        this.setData({
                            loc: true
                        });
                        wx.navigateTo({
                            url: '/pages/publish/publish'
                        })
                    } else {
                        this.setData({
                            loc: false
                        })
                        console.log('auth location failed!');
                        this.tip();
                    }
                }
            })
        } else {
            myUtils.registerTip()
        }

    },
    close: function () {
        this.setData({
            sortWay: '按时间排序 ',
            sortKind: 'time',
            sortType: 'sortByTime',
            type: wx.getStorageSync('type')
        });
        if (this.data.type == 'supply') {
            this.setData({
                currentIndex: 0
            })
        } else if (this.data.type == 'demand') {
            this.setData({
                currentIndex: 1
            })
        } else {
            console.log('设置供求类型出错！');
        }
        this.onPullDownRefresh();

        wx.setStorageSync('pop', false);
        this.setData({
            published_showModal: false,
            published_show_: false,
            pop_published: wx.getStorageSync('pop')
        })
    },
    getLocation() {
        wx.getLocation({
            success: res => {
                const latitude = res.latitude;
                const longitude = res.longitude;
                wx.setStorageSync('currentLatitude', latitude);
                wx.setStorageSync('currentLongitude', longitude);
                this.setData({
                    loc: wx.getStorageSync('currentLatitude')
                });
                wxRequest.getInfoList(this.data.type, this.data.sortKind, wx.getStorageSync('currentLongitude'), wx.getStorageSync('currentLatitude'), 10, 1).then((res) => {
                    if (res.data.code === 20000) {
                        this.setData({
                            productionInfo: res.data.data.list,
                            __show: true
                        });
                    } else {
                        console.error('square-getLocation-error:',res.data)
                    }
                });
            },
            fail: res=> {
                wxRequest.getInfoList(this.data.type, this.data.sortKind, wx.getStorageSync('currentLongitude'), wx.getStorageSync('currentLatitude'), 10, 1).then((res) => {
                    if (res.data.code === 20000) {
                        this.setData({
                            productionInfo: res.data.data.list
                        });
                    } else {
                        console.error('square-290-error:',res.data)
                    }
                });

            }
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (Object.keys(options).length !== 0) {
            // console.error('options: ',options)
            wx.navigateTo({
              url: '/pages/detail/detail?_id=' + options._id,
                success: function () {
                    console.log('success')
                }
            })
        } else {
            // console.log(options)
        }
        let timestamp = Date.parse(new Date());
        this.setData({
            timestamp: timestamp
        });
        this.setData({
            pop_published: wx.getStorageSync('pop')
        });
        let _this = this
        if (!wx.getStorageSync('token')) {
            wx.login({
                success: res => {
                    if (res.code) {
                        wxRequest.login(res.code).then(res => {
                            wx.setStorageSync('token', res.data.data.token);
                            _this.getLocation()
                                wxRequest.getUserInfo().then(res => {
                                    console.log('res of getUesr: ', res.data)
                                    if (res.data.data.realName) {
                                        console.log('realName of square: ', res.data.data.realName)
                                        wx.setStorageSync('loginState', true);
                                    } else {
                                        wx.setStorageSync('loginState', false);
                                    }
                                });
                        })
                    }
                }
            })
        }  else {
                wxRequest.getUserInfo().then(res => {
                    if (res.data.data.realName) {
                        wx.setStorageSync('loginState', true);
                    } else {
                        wx.setStorageSync('loginState', false);
                    }
                });
                this.getLocation()
        }
        //设置标题栏内容
        wx.setNavigationBarTitle({
            title: '建材供应圏'
        });
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        //从详情页跳转来的
        if (wx.getStorageSync('fromDetail')) {
            wxRequest.getInfoList(this.data.type, this.data.sortKind, wx.getStorageSync('currentLongitude'), wx.getStorageSync('currentLatitude'), 10, 1).then(res => {
                if (res.data.code === 20000) {
                    this.setData({
                        productionInfo: res.data.data.list
                    });
                    wx.setStorageSync('fromDetail', false);
                } else {
                    console.error('square-350-error:', res.data)
                }
            })
        }
        if (wx.getStorageSync('somename').afterPublish) {
            wxRequest.getInfoList(wx.getStorageSync('somename').sortType, this.data.sortKind, wx.getStorageSync('currentLongitude'), wx.getStorageSync('currentLatitude'), 10, 1).then(res => {
                if (res.data.code === 20000) {
                    this.setData({
                        productionInfo: res.data.data.list
                    });
                } else {
                    console.error('square-361-error:',res.data)
                }
                console.log('type: ', wx.getStorageSync('somename').sortType)
                if (wx.getStorageSync('somename').sortType == 'supply') {
                    this.setData({
                        currentIndex: 1,
                        type: 'supply',
                    })
                } else {
                    this.setData({
                        currentIndex: 0,
                        type: 'demand'
                    })
                }
                console.log('这是发布后的信息');
                wx.pageScrollTo({
                    scrollTop: 0,
                    duration: 100,
                    success: () => {
                        wx.setStorageSync('somename', {
                            afterPublish: false
                        });
                    }
                })
            });

        }
        let timestamp = Date.parse(new Date());
        this.setData({
            timestamp: timestamp
        });
    },
    onPullDownRefresh: function () {
        // this.getLocation()

        let timestamp = Date.parse(new Date());
        this.setData({
            timestamp: timestamp
        });
        wxRequest.getInfoList(this.data.type, this.data.sortKind, wx.getStorageSync('currentLongitude'), wx.getStorageSync('currentLatitude'), 10, 1).then((res) => {
            if (res.data.code === 20000) {
                this.setData({
                    productionInfo: res.data.data.list
                });
                setTimeout(function () {
                    wx.stopPullDownRefresh();
                }, 500);
            } else {
                console.error('square-420-error:',res.data)
            }
        });
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.data.currentPage = this.data.currentPage + 1;
        wxRequest.getInfoList(this.data.type, this.data.sortKind, wx.getStorageSync('currentLongitude'), wx.getStorageSync('currentLatitude'), 10, this.data.currentPage).then((res) => {
            if (res.data.code === 20000) {
                this.setData({
                    productionInfo: this.data.productionInfo.concat(res.data.data.list)
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
                console.error('square-456-error:',res.data)
            }
        });
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        let _url = `/pages/square/square`
        return {
            title: '',
            path: _url,
            imageUrl: 'https://qn-ceramic.lindingtechnology.com/ceramicShareApp.png'
        }
    }
})
