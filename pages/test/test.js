// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min');

// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: '52TBZ-3CXEF-MDMJK-NYPO7-AI3FF-EPF64' // 必填
});
import Util from '../../utils/getImageZoom';
Page({
    data:{
        imageWidth:0,
        imageHeight:0
    },
    imageLoad: function (e) {
        //获取图片的原始宽度和高度
        let originalWidth = e.detail.width;
        let originalHeight = e.detail.height;
        //let imageSize = Util.imageZoomHeightUtil(originalWidth,originalHeight);
        //let imageSize = Util.imageZoomHeightUtil(originalWidth,originalHeight,375);
        let imageSize = Util.imageZoomWidthUtil(originalWidth,originalHeight,170);
        this.setData({imageWidth:imageSize.imageWidth,imageHeight:imageSize.imageHeight});
    }
});