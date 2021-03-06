// pages/submodify/gender.js
import wxRequest from '../../../utils/request'
import myUtils from "../../../utils/myUtils";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        company: ''
    },

    //双向绑定
    inputedit: function (e) {
        let value = e.detail.value;
        this.setData({
            company: value
        })
        console.log(this.data.company)
    },
    //保存修改
    save: function () {
        //修改公司信息
        if (this.data.company !== '') {
            wxRequest.modifycompany(this.data.company);
           /* wx.navigateBack({
                url: '/pages/modify/modify'
            });*/
            wx.showToast({
                title: '信息修改成功！',
                icon: 'success'
            });
        } else {
            wx.showToast({
                title: '输入的公司不能为空！',
                icon: 'none',
                duration: 1000
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        myUtils.wxSetNavbarTitle('公司')
        wxRequest.relogin().then((res) => {
            this.setData({
                company: res.data.data.user.company
            })
        });
    },
})