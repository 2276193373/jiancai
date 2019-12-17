// pages/submodify/gender.js
import wxRequest from '../../../utils/request'
import myUtils from "../../../utils/myUtils";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        realName: '',
        company: '',
        position: ''
    },
    inputedit: function (e) {
        // let dataset = e.currentTarget.dataset
        let value = e.detail.value;
        // this.data[dataset.name] = value;
        this.setData({
            // realName: this.data[dataset.name]
            realName: value
        })
    },
    save: function () {
        if (this.data.realName !== '') {
            wxRequest.modifyRealName(this.data.realName);
            wx.navigateBack({
                url: '/pages/modify/modify'
            });
            wx.showToast({
                title: '信息修改成功！',
                icon: 'success'
            })
            wxRequest.relogin().then(res => {
                console.log('res.data222:',res.data);
            });
        } else {
            console.log('输入的名字不能为空！请重新输入！')
            wx.showToast({
              title: '输入的姓名不能为空！',
              icon: 'none',
              duration: 1000
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        myUtils.wxSetNavbarTitle('昵称');
        wxRequest.relogin().then((res) => {
            this.setData({
                realName: res.data.data.user.realName
            })
        });
    }
})