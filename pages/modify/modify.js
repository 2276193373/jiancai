// pages/modify/modify.js
import myUtils from "../../utils/myUtils";
import wxRequest from '../../utils/request'

const qiniuUploader = require("../../utils/qiniuUploader");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        winHeight: wx.getSystemInfoSync().screenHeight,
        avatarUrl: '',
        realName: '',
        company: '',
        position: '',
        phoneNumber: '',
        sex: ['男', '女'],
        hideModal: true,
        index: '',
        gender: ''
    },

    /**
     * 滑动picker-view  存放日期到临时变量里 点击确定时在赋值
     */
    bindPickerChange(e) {
        //val表示picker的指向
        const val = e.detail.value;
        console.log('val: ', val);
        this.setData({
            index: val,
            gender: parseInt(val)+1
        });
        wxRequest.modifyGender(this.data.gender);
    },

    //修改头像//
    modifyAvatar: function () {
        var that = this;
        //获取七牛云
        wxRequest.uploadQiniu().then((res) => {
            if (res.data.code === 20000) {
                wx.setStorageSync('uptoken', res.data.data);
            } else {
                console.log('====错误！!====\n错误码：', res.data.code);
                console.log('\n====错误信息：', res.data.msg);
            }
        });
        //选择图片
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                //todo 需要修改
                const tempFilePaths = res.tempFilePaths;
                let imgList = [];
                for (let i = 0; i < tempFilePaths.length; i++) {
                    //七牛云上传图片
                    qiniuUploader.upload(tempFilePaths[i], (res) => {
                            // console.log('-0000', res);
                            imgList.push("http://q0jlhl1wv.bkt.clouddn.com" + res.imageURL);
                            console.log(imgList);
                            that.setData({
                                avatarUrl: imgList[0]
                            });
                            console.log('--00000', this.data.avatarUrl);

                            //上传修改过的头像到服务端
                            wxRequest.modifyAvatarUrl(this.data.avatarUrl);
                        },
                        (error) => {
                            console.log("错误：" + error);
                        },
                        {
                            region: 'SCN',
                            uptoken: wx.getStorageSync('uptoken')

                        }, (progress) => {
                            console.log('上传进度 ：' + progress.progress);
                            console.log('已经上传的数据的长度 ：' + progress.totalBytesSent);
                            console.log('预期需要上传的数据总长度', progress.totalBytesExpectedToSend);
                        })
                    // console.log(tempFilePaths);
                    that.setData({
                        avatarUrl: [...tempFilePaths]
                    })
                    wx.setStorage({
                        key: 'imgUrl',
                        data: {
                            atlas: that.data.atlas
                        }
                    });
                }
            }
        });
    },


    onShow() {
        wxRequest.relogin().then(res => {
            this.setData({
                //性别，temp与后台相关，temp1与前台显示相关
                gender: res.data.data.user.gender,
            });
            wx.request({
                url: "http://118.25.21.169:2000/weapp/users/relogin",
                method: 'POST',
                header: {
                    "content-type": "application/x-www-form-urlencoded",
                    "Authorization": "Bearer " + wx.getStorageSync('token')
                },
                success: res => {
                    this.setData({
                        realName: res.data.data.user.realName,
                        company: res.data.data.user.company,
                        position: res.data.data.user.position,
                        gender: res.data.data.user.gender,
                        avatarUrl: res.data.data.user.avatarUrl,
                        phoneNumber: res.data.data.user.phoneNumber
                    })
                    console.log('手机号：', res.data.data.user.phoneNumber);
                }
            })
        });
    },
    onLoad(options) {
        myUtils.wxSetNavbarTitle('我的')
    },
    onUnload: function () {
        wx.redirectTo({
            url: '/pages/me/me'
        })
    },
    gotoPhone: function () {
        wx.navigateTo({
            url: '/pages/submodify/phone/phone'
        })
    },
    gotoName: function () {
        wx.navigateTo({
            url: '/pages/submodify/name/name'
        })
    },
    gotoGender: function () {
        wx.navigateTo({
            url: '/pages/submodify/gender/gender'
        })
    },
    gotoCompany: function () {
        wx.navigateTo({
            url: '/pages/submodify/company/company'
        })
    },
    gotoPosition: function () {
        wx.navigateTo({
            url: '/pages/submodify/position/position'
        })
    }
})