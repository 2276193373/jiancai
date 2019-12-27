import request from "../../utils/request";

Page({
    data: {
        imageWidth: 0,
        imageHeight: 0,
        imgPath: ''
    },
    uploadImage: function(){
        wx.chooseImage({
            count: 2,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: res =>{
                //tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths
                console.log('图片路径：', tempFilePaths)
                this.setData({
                    imgPath: tempFilePaths[0]
                })
            }
        });
    },
    click: function() {
        wx.cloud.callFunction({
            name: 'ContentCheck',
            data: {
                img: "/imgs/test/test.jpeg"
            },
            success(res) {
                console.log(res.result)
                if(res.result.imageR.errCode == 87014){
                    wx.showToast({
                        title: '图片违规',
                    })
                }else{
                    wx.showToast({
                        title:"图片安全"
                    })
                }
            }
        })
    },
    testWord: function(){
        wx.cloud.callFunction({
            name: 'ContentCheck',
            data: {
                msg: '傻逼'
            },
            success: res => {
                console.log('res of 标题内容：', res.result)
                if (res.result.errCode === 87014) {
                    this.setData({
                        violation: false
                    })
                    console.log('描述包含敏感信息！')
                    wx.showToast({
                        title: '描述包含敏感信息！',
                        icon: 'none'
                    })
                } else {
                    this.setData({
                        violation: true
                    })
                }
            }
        })
    },
    onLoad: function (opt) {
        //文字违规

        //图片违规

    }
})
