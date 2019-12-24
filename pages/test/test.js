import request from "../../utils/request";

Page({
    data: {
        imageWidth: 0,
        imageHeight: 0

    },
    onLoad: function (opt) {
        //文字违规
        wx.cloud.callFunction({
            name: 'ContentCheck',
            data: {
                msg: "你，妈。死、了",//此段文字也违规
            },
            success(res) {
                console.log('res of cloud\'s 文字: ', res.result)
                if (res.result.errCode == 87014) {
                    console.log('文字违规！')
                    wx.showToast({
                        title: '文字违规',
                    })
                } else {
                    console.log('文字没有违规！')
                    wx.showToast({
                        title: '文字没有违规！'
                    })
                }
            }
        })
        //图片违规
        wx.cloud.callFunction({
            name: 'ContentCheck',
            data: {
                img: '/imgs/sanguinary.jpg'
            },
            success(res) {
                console.log('res.result of 图片',res.result)
                if(res.result.imageR.errCode == 87014){
                    wx.showToast({
                        title: '图片违规!!',
                    })
                } else {
                    console.log('图片没有违规！')
                    wx.showToast({
                        title: '图片没有违规！'
                    })
                }
            }
        })
    }
})