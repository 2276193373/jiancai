import wxRequest from '../../utils/request'
import Util from "../../utils/getImageZoom";

var QQMapWX = require('../../utils/qqmap-wx-jssdk.min');
var qqmapsdk = new QQMapWX({
    key: '52TBZ-3CXEF-MDMJK-NYPO7-AI3FF-EPF64'
});
Page({
    /**
     * 页面的初始数据
     */
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
        sortWay: '按距离排序',
        //产品信息
        productionInfo: [],
        //公司
        comany: '',
        winWidth: wx.getSystemInfoSync().windowWidth + 'rpx',
        winHeight: wx.getSystemInfoSync().windowHeight,
        values: [
            {value: "只看供应"},
            {value: "只看需求"}
        ],
        //被点击的导航菜单的索引
        currentIndex: 0,
        showModal: false,
        sortType: 'sortByDistance',
        //api中使用 排序方式
        sortKind: 'distance',
        loc: '',
        type: 'supply'
    },
    imageLoad: function (e) {
        //获取图片的原始宽度和高度
        let originalWidth = e.detail.width;
        let originalHeight = e.detail.height;
        console.log('宽高长度: ',originalWidth, originalHeight);
        //let imageSize = Util.imageZoomHeightUtil(originalWidth,originalHeight);
        //let imageSize = Util.imageZoomHeightUtil(originalWidth,originalHeight,375);
        if (originalHeight > originalWidth) {
            var imageSize = Util.imageZoomWidthUtil(originalWidth, originalHeight, 170);
            console.log('竖图', imageSize);
        } else {
            var imageSize = Util.imageZoomHeightUtil(originalWidth, originalHeight, 170);
            console.log('长图', imageSize);
        }
         this.setData({
             imageWidth: imageSize.imageWidth,
             imageHeight: imageSize.imageHeight
         });
        console.log(this.data.imageWidth);
        console.log(this.data.imageHeight)
    },
    tip: function () {
        wx.getSetting({
            success: (res) => {
                // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
                // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
                // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
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
                    // wx.navigateTo({
                    //     url: '/pages/publish/publish'
                    // })

                }
            }
        })

    },
    gotoDetail(e) {
        //获取当前点击的元素的索引,并缓存
        wx.setStorageSync('itemIndex', e.currentTarget.dataset.index);

        //重新封装wx.request()
        //获取信息列表
        wxRequest.getInfoList(this.data.type, this.data.sortKind, wx.getStorageSync('currentLongitude'), wx.getStorageSync('currentLatitude')).then((res) => {
            if (res.data.code === 20000) {
                let prodInfo = res.data.data.list[e.currentTarget.dataset.index];
                wx.navigateTo({
                    url: "/pages/detail/detail?_id=" + prodInfo._id + '&creatorId=' + prodInfo.creatorId +
                        '&creatorAvatar=' + prodInfo.creatorAvatar + '&creatorNickname=' + prodInfo.creatorNickname +
                        '&title=' + prodInfo.title + '&desc=' + prodInfo.desc + '&distance=' + prodInfo.distance +
                        '&location=' + prodInfo.location + '&atlas=' + prodInfo.atlas + '&createdAt=' + prodInfo.createdAt +
                        '&loc=' + this.data.loc + '&type=' + this.data.type + '&company=' + prodInfo.company

                });
            } else {
                console.log('====错误！!====\n错误码：', res.data.code);
                console.log(res.errMsg);
            }
        });

    },
//点击首页导航栏按钮
    activeNav(e) {
        if (e) {
            this.setData({
                currentIndex: e.target.dataset.index
            });
        }
        if (this.data.currentIndex == 0) {
            this.setData({
                type: 'supply',
                currentPage: 1
            });
        } else {
            this.setData({
                type: 'demand',
                currentPage: 1
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
                console.log('====错误！!====\n错误码：', res.data.code);
                console.log(res.errMsg);
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
                console.log('====错误！!====\n错误码：', res.data.code);
                console.log(res.errMsg);
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
                console.log('====错误！!====\n错误码：', res.data.code);
                console.log(res.errMsg);
            }
        });
    },
    gotoPublish: function () {
        let _this = this;
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
                    _this.tip();
                }
            }
        })
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //设置标题栏内容
        wx.setNavigationBarTitle({
            title: '建材供应圏'
        });
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
                            productionInfo: res.data.data.list
                        });
                        console.log('productionInfo: ', this.data.productionInfo);
                    } else {
                        console.log('===================');
                        console.log("出错！\n");
                        console.log(`错误码：${res.data.code}`);
                        console.log(`错误信息：${res.data.data}`);
                        console.log('===================');
                    }
                });
            },
            fail: res=> {
                wxRequest.getInfoList(this.data.type, this.data.sortKind, wx.getStorageSync('currentLongitude'), wx.getStorageSync('currentLatitude'), 10, 1).then((res) => {
                    if (res.data.code === 20000) {
                        this.setData({
                            productionInfo: res.data.data.list
                        });
                        console.log('productionInfo: ', this.data.productionInfo);
                    } else {
                        console.log('===================');
                        console.log("出错！\n");
                        console.log(`错误码：${res.data.code}`);
                        console.log(`错误信息：${res.data.data}`);
                        console.log('===================');
                    }
                });

            }
        });
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        wx.login({
            success: res => {
                if (res.code) {
                    wxRequest.login(res.code).then(res => {
                        if (!res.data.data) {
                            wx.showToast({
                              title: '您当前尚未登录，即将跳转到登录页面！',
                              icon: 'none',
                              duration: 2000
                            });
                            setTimeout(function () {
                                wx.redirectTo({
                                    url: '/pages/login/unit'
                                });
                            }, 2000)
                        } else {
                            wx.setStorageSync('token', res.data.data.token);
                            if (!res.data.data.user.phoneNumber) {
                                wx.showToast({
                                    title: '您当前尚未授权手机号，即将跳转到授权手机号页面！',
                                    icon: 'none',
                                    duration: 2000
                                });
                                setTimeout(function () {
                                    wx.redirectTo({
                                        url: '/pages/login/unit'
                                    });
                                }, 2000)
                            }
                            if (!res.data.data.user.realName) {
                                wx.showToast({
                                    title: '您当前尚未填写完整信息，即将跳转到授权手机号页面！',
                                    icon: 'none',
                                    duration: 2000
                                });
                                wx.redirectTo({
                                    url: '/pages/login/unit'
                                })
                            }
                        }
                    });
                }
            }
        })
        this.getLocation();
        console.log('onShow');
        let timestamp = Date.parse(new Date());
        this.setData({
            timestamp: timestamp
        });
        if (wx.getStorageSync('pop') == true) {
            //发布成功滑到顶部
            wx.pageScrollTo({
                scrollTop: 0,
                duration: 100
            })
        }
        this.setData({
            pop_published: wx.getStorageSync('pop')
        });
    },
    onPullDownRefresh: function () {
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
                console.log('广场productionInfo: ', this.data.productionInfo);
            } else {
                console.log('===================');
                console.log("出错！\n");
                console.log(`错误码：${res.data.code}`);
                console.log(`错误信息：${res.data.data}`);
                console.log('===================');
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
                console.log("出错！\n");
                console.log(`错误码：${res.data.code}`);
                console.log(`错误信息：${res.data.msg}`)
            }
        });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        let _url = `/pages/detail/detail?desc=${wx.getStorageSync('publish_info').desc}
            &title=${wx.getStorageSync('publish_info').title}&creatorAvatar=${wx.getStorageSync('publish_info').creatorAvatar}&atlas=${wx.getStorageSync('publish_info').atlas}
            &creatorNickname=${wx.getStorageSync('publish_info').creatorNickname}
            &location=${wx.getStorageSync('publish_info').location}
            &createdAt=${wx.getStorageSync('publish_info').createdAt}
            &company=${wx.getStorageSync('publish_info').company}`
        return {
            title: '我发布了一则信息，快来围观~~',
            path: _url
        }
    }
})
