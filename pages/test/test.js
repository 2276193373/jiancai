import request from "../../utils/request";
Page({
    data: {
        imageWidth: 0,
        imageHeight: 0
    },
    onLoad: function (opt) {
        request.getUserInfo().then(res => {
            console.log('res of user', res.data)
        });
        /*let encryptData = 'dJY/e5fFxjegBW76MU3bHcZZ5ZXiRn4TT0D70u+2L2V7rH0mCQZImTi334cfMWE8/siKkvEv32NiGWrdIWMhI9cxABfGTjLaBJlDLjnP8i8wbPycV/YTKUHLYS13S21xcyQbicuWdHa1nWcA1Ler/y5EZhTWTHTT2eBXdPwWoutnPUvgqClsNaGhTyYxCDQbGmp5No1qiXk3wWDLHN1wD8hxncg5XrSlP64gaifItKMyz6GVevPL30ZpdBHcYS5tzi38cZInMaC+Sxnx9tKGgQkkhSt2lwnu81Ziu/Mq8qr09HV9uoWPJgnsbSN0Q9yGch1BVxPW7GOQG9JbnH+usGv4EmlN8FgFlf60t5Hni5mfAIzB/Vo0wc/cicQCRxQFQKrphp8A4OjZv87Dg3fqfQrurj/YEME1fGHCICmTDUaEHtNKqX+NQMf6naadxqNeznj6N4eJAuQxneLQHEyGbdJnb8SvB1kxwnwK5hLNDww='
        let iv = 'trVdcvJPP2a7SHqu5wnBGg=='
        wx.login({
            success: function (res) {
                if (res.code) {
                    request.login(res.code).then(res => {
                        console.log('res.data of login ->', res.data)
                    });
                }
            }
        })*/
        wx.reLaunch({
            url: '/pages/square/square'
        })
    }
})