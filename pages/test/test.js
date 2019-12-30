import request from "../../utils/request";

Page({
    data: {
        imageWidth: 0,
        imageHeight: 0,
        imgPath: ''
    },

    onLoad: function (opt) {
        request.getUserInfo().then(res => {
            // console.log('res.data: ', res.data)
        });
      /*  let baseUrl = 'https://ceramic.lindingtechnology.com/';
        let url = 'weapp/users/login'
        // request.getUserInfo()
        wx.login({
            success: res => {
                if (res.code) {
                    wx.request({
                        url: baseUrl + url,
                        method: 'POST',
                        header: {
                            'content-type': 'application/x-www-form-urlencoded',
                            // 'Authorization': 'Bearer ' + wx.getStorageSync('token')
                        },
                        data: {
                            code: res.code,
                            iv: '',
                            encryptedData: ''
                        },
                        success: resp => {
                            wx.setStorageSync('token', resp.data.data.token);
                            console.log('resp:', resp)
                        }
                    })
                }
            }
        })*/
    }
})
