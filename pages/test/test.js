import Util from '../../utils/getImageZoom';

Page({
    data: {
        imageWidth: 0,
        imageHeight: 0
    },
    imageLoad: function (e) {
        //获取图片的原始宽度和高度  
        let originalWidth = e.detail.width;
        let originalHeight = e.detail.height;
        console.log('宽高长度: ',originalWidth, originalHeight);
        //let imageSize = Util.imageZoomHeightUtil(originalWidth,originalHeight);  
        //let imageSize = Util.imageZoomHeightUtil(originalWidth,originalHeight,375);
        if (originalHeight > originalWidth) {
            var imageSize = Util.imageZoomWidthUtil(originalWidth, originalHeight, 170);
        } else {
            var imageSize = Util.imageZoomHeightUtil(originalWidth, originalHeight, 170);
            console.log('长图');
        }
        this.setData({
            imageWidth: imageSize.imageWidth,
            imageHeight: imageSize.imageHeight
        });
    }
})  