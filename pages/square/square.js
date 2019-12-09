import wxRequest from '../../utils/request'

var QQMapWX = require('../../utils/qqmap-wx-jssdk.min');
var qqmapsdk = new QQMapWX({
    key: '52TBZ-3CXEF-MDMJK-NYPO7-AI3FF-EPF64'
});
Page({
    /**
     * 页面的初始数据
     */
    data: {
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
        winHeight: wx.getSystemInfoSync().screenHeight,
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

    tip: function () {
        let that = this;
        wx.showToast({
            title: '发布信息需要获取您当前的地理位置！',
            icon: 'none',
            duration: 1500,
            success: function (res) {
                wx.showModal({
                    title: '提示！',
                    confirmText: '去设置',
                    content: '需要您授权地理位置！',
                    showCancel: false,
                    success: function(res) {
                        if (res.confirm) {
                            console.log(res.confirm)
                            wx.navigateTo({
                                url: '/pages/setting/setting'
                            })
                            wx.getLocation({
                                success: res => {
                                    const latitude = res.latitude;
                                    const longitude = res.longitude;
                                    wx.setStorageSync('currentLatitude', latitude);
                                    wx.setStorageSync('currentLongitude', longitude);
                                    that.setData({
                                        loc: wx.getStorageSync('currentLatitude')
                                    });

                                }
                            });
                        }
                    }
                })
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
                console.log('prodInfo:', prodInfo);
                wx.navigateTo({
                    url: "/pages/detail/detail?_id=" + prodInfo._id + '&creatorId=' + prodInfo.creatorId +
                        '&creatorAvatar=' + prodInfo.creatorAvatar + '&creatorNickname=' + prodInfo.creatorNickname +
                        '&title=' + prodInfo.title + '&desc=' + prodInfo.desc + '&distance=' + prodInfo.distance +
                        '&location=' + prodInfo.location + '&atlas=' + prodInfo.atlas + '&createdAt=' + prodInfo.createdAt+
                        '&loc='+this.data.loc+'&type='+this.data.type+'&company='+prodInfo.company
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
        //重新封装wx.request
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
    sortByTime: function () {
        console.log('按时间排序');
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
        console.log('按距离排序！');
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
        wx.navigateTo({
            url: '/pages/publish/publish'
        })
    },
    close: function () {
        this.setData({
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
        wx.login({
            success:res=>{
                if (res.code) {
                    wxRequest.login(res.code).then(res => {
                        console.log('++++++',res)
                        if (!res.data.data) {
                            wx.redirectTo({
                                url: '/pages/login/unit'
                            });
                        } else {
                            if (!res.data.data.user.phoneNumber) {
                                wx.redirectTo({
                                    url: '/pages/login/unit'
                                });
                            }
                            if (!res.data.data.user.realName) {
                                wx.redirectTo({
                                    url: '/pages/login/unit'
                                })
                            }
                            wx.setStorageSync('token', res.data.data.token);
                            wxRequest.getInfoList(this.data.type, this.data.sortKind, wx.getStorageSync('currentLongitude'), wx.getStorageSync('currentLatitude'), 10, 1).then((res) => {
                                if (res.data.code === 20000) {
                                    this.setData({
                                        productionInfo: res.data.data.list
                                    });
                                    console.log('productionInfo: ',this.data.productionInfo);
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
                    /*wx.request({
                        url:"http://118.25.21.169:2000/weapp/users/login",
                        method: 'POST',
                        data: {
                            code: res.code
                        },
                        success:res=>{
                            console.log('--====---', res.data.data.user)
                            if (!res.data.data.user.nickName) {
                                wx.redirectTo({
                                    url: '/pages/login/unit'
                                })
                            }
                        }
                    })*/
                }
            }
        })


       /* //有token,微信授权过，手机号没授权
        if (wx.getStorageSync('token')) {
            wxRequest.relogin().then(res => {
                let user = res.data.data.user;
                console.log('user-----',user);
                if (!user.avatarUrl) {
                    console.log('用户未注册，跳转到注册页面');
                    wx.redirectTo({
                        url: '/pages/login/unit'
                    });
                    return
                } else if (!user.phoneNumber) {
                    console.log('手机号尚未授权，跳转到手机号授权页面！');
                    wx.redirectTo({
                        url: '/pages/login/unit'
                    });
                    return;
                } else if (!user.realName) {
                    console.log('个人信息尚未填写，跳转到个人信息填写页面！');
                    wx.redirectTo({
                        url: '/pages/login/unit'
                    });
                }
                wxRequest.getInfoList(this.data.type, this.data.sortKind, wx.getStorageSync('currentLongitude'), wx.getStorageSync('currentLatitude'), 10, 1).then((res) => {
                    if (res.data.code === 20000) {
                        this.setData({
                            productionInfo: res.data.data.list
                        });
                        console.log('productionInfo: ',this.data.productionInfo);
                    } else {
                        console.log('===================');
                        console.log("出错！\n");
                        console.log(`错误码：${res.data.code}`);
                        console.log(`错误信息：${res.data.data}`);
                        console.log('===================');
                    }
                });



                let timestamp = Date.parse(new Date());
                this.setData({
                    timestamp: timestamp
                });
            });
        }
        //无token，判断是新用户，还是老用户
        else {
            console.log('---我是新用户！');
            wx.login({
                success: res => {

                    wx.redirectTo({
                        url: '/pages/login/unit'
                    })
                    /!* if (res.code) {
                         wx.request({
                             url:"http://118.25.21.169:2000/weapp/users/login",
                             method: 'POST',
                             data: {code: res.code},
                             success:res=>{
                                 // wx.setStorageSync('token', res.data.data.token);
                                 let user = res.data.data.user;
                                 console.log('user: ',user);
                                 //用户不存在，跳转到注册页面
                                 if (!user.avatarUrl) {
                                     wx.redirectTo({
                                       url: '/pages/login/unit'
                                     })
                                 } else if (!user.phoneNumber) {
                                     wx.redirectTo({
                                         url: '/pages/login/unit'
                                     })
                                 } else if (!user.realName) {
                                     wx.redirectTo({
                                         url: '/pages/login/unit'
                                     })
                                 }
                                 wxRequest.getInfoList(this.data.type, this.data.sortKind, wx.getStorageSync('currentLongitude'), wx.getStorageSync('currentLatitude'), 10, 1).then((res) => {
                                     if (res.data.code === 20000) {
                                         this.setData({
                                             productionInfo: res.data.data.list
                                         });
                                         console.log('productionInfo: ',this.data.productionInfo);
                                     } else {
                                         console.log('===================');
                                         console.log("出错！\n");
                                         console.log(`错误码：${res.data.code}`);
                                         console.log(`错误信息：${res.data.data}`);
                                         console.log('===================');
                                     }
                                 });
                             }
                         })
                     }*!/
                }
            })
        }*/


        //设置标题栏内容
        wx.setNavigationBarTitle({
          title: '建材供应圏'
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
        wx.getLocation({
            success: res => {
                const latitude = res.latitude;
                const longitude = res.longitude;
                wx.setStorageSync('currentLatitude', latitude);
                wx.setStorageSync('currentLongitude', longitude);
                this.setData({
                    loc: wx.getStorageSync('currentLatitude')
                });
            }
        });
        let timestamp = Date.parse(new Date());
        this.setData({
            timestamp: timestamp
        });
        if (wx.getStorageSync('pop') == true) {
            console.log('发布成功！');
            //发布成功滑到顶部
            wx.pageScrollTo({
                scrollTop: 0,
                duration: 100
            })
        }
        this.setData({
            pop_published: wx.getStorageSync('pop')
        });
        //重新封装wx.request
        wxRequest.relogin().then((res) => {
            if (res.data.code === 20000) {
                this.setData({
                    // company: this.data.data.user.company
                });

                console.log('重新登录成功！');
            } else {
                console.log("重新登录出错！\n");
                console.log(`错误码：${res.data.code}`);
                console.log(res.data.data);
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
                console.log('广场productionInfo: ',this.data.productionInfo);
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
                if (res.data.data.list.length===0) {
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
                console.log('res.data.data.list: 列表',res.data.data.list);
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
        return {
            title: '我发布了一则信息，快来围观~~',
            path: `/pages/detail/detail?
            title=${wx.getStorageSync('publish_info').title}
            &desc=${wx.getStorageSync('publish_info').desc}
            &avatar=${wx.getStorageSync('publish_info').creatorAvatar}
            &atlas=${wx.getStorageSync('publish_info').atlas}
            &name=${wx.getStorageSync('publish_info').creatorNickname}
            &location=${wx.getStorageSync('publish_info').location}
            &createdAt=${wx.getStorageSync('publish_info').createdAt}`
        }
    }
})
