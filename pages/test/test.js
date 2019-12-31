import request from "../../utils/request";

Page({
    data: {
        imageWidth: 0,
        imageHeight: 0,
        imgPath: ''
    },
    test() {
    },
    onLoad: function (opt) {
        request.getUserInfo().then(res => {
            // console.log('res.data: ', res.data)
        });
    },
    onShareAppMessage: function () {
        let _url = `/pages/detail/detail`
        return {
            title: '我发布了一则信息，快来看看吧！',
            path: _url
        }
    }
})
