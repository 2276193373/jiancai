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
            wxRequest.modifyPosition(this.data.position);
            wx.navigateBack({
                url: '/pages/modify/modify'
            });
            // wx.showToast({
            //     title: '输入的职位不能为空！',
            //     icon: 'none',
            //     duration: 1000
            // })
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
    }
})