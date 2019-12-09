// pages/submodify/gender.js
import myUtils from "../../../utils/myUtils";
import wxRequest from '../../../utils/request'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        position: '',
        name: ''
    },
    //双向数据绑定
    inputedit: function (e) {
        //dataset是自定义的【data-】json对象
        // let dataset = e.currentTarget.dataset
        let value = e.detail.value;
        // this.data[dataset.name] = value
        this.setData({
            // name: this.data[dataset.name]
            position: value
        })
        // console.log(this.data.name)
    },
    //保存修改
    save: function () {
        if (this.data.position !== '') {
            wxRequest.modifyPosition(this.data.position);
            wx.navigateBack({
                url: '/pages/modify/modify'
            });
            wx.showToast({
                title: '信息修改成功！',
                icon: 'success'
            });
        } else {
            wx.showToast({
                title: '输入的职位不能为空！',
                icon: 'none',
                duration: 1000
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        myUtils.wxSetNavbarTitle('职位');
        wxRequest.relogin().then((res) => {
            this.setData({
                position: res.data.data.user.position
            })
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

    },

})