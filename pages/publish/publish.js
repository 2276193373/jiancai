import wxRequest from '../../utils/request';
import myUtils from "../../utils/myUtils";
import config from "../../config/config";
var type = 'demand';
const app = new getApp();
const qiniuUploader = require("../../utils/qiniuUploader");
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: '52TBZ-3CXEF-MDMJK-NYPO7-AI3FF-EPF64' // 必填
});
Page({
  data: {
    isDisable: false,
    isIpx: getApp().globalData.isIpx,
    leftCount: 0,
    hideAddIcon: true,
    typeArr: ['demand','supply'],
    index: '',
    imgList: [],
    winHeight: (wx.getSystemInfoSync().windowHeight),
    showModal: false,
    show_: false,
     //todo 以下有关位置信息做测试用
      _location: '',
      title: '',
      desc: '',
      atlas: [],
      type: 'demand',
      address: {
        location: '',
        longitude: 0, //值为数字
        latitude: 0, //值为数字
      },
    phoneNumber: ''
  },


  //发布信息
  publish:  function () {
    let _this = this
      wxRequest.getUserInfo().then(res => {
      this.setData({
        phoneNumber: res.data.data.phoneNumber
      })
    });

      wxRequest.publish(this.data.title, this.data.desc, this.data.atlas, this.data.type, this.data.address).then((res) => {
        wx.setStorageSync('somename', {
          afterPublish: true,
          sortType: this.data.type
        })
        let infoOfPublish = res.data.data;
        if (res.data.code === 20000) {
          wx.setStorageSync('pop', true);
          wx.redirectTo({
            // url: `/pages/detail/detail?title=${infoOfPublish.title}&desc=${infoOfPublish.desc}&atlas=${infoOfPublish.atlas}&company=${infoOfPublish.company}&createdAt=${infoOfPublish.createdAt}&location=${infoOfPublish.location}&type=${infoOfPublish.type}&creatorNickname=${infoOfPublish.creatorNickname}&_id=${infoOfPublish._id}&creatorAvatar=${infoOfPublish.creatorAvatar}&creatorId=${infoOfPublish.creatorId}`,
            url: `/pages/detail/detail?_id=${infoOfPublish._id}`,
            success: res => {
            }
          });
          // wx.setStorageSync('publish_info', res.data.data);
          wx.setStorageSync('timeSort', 'time');
          wx.setStorageSync('type', this.data.type);
        } else {
          console.log('发布出错！\n')
          console.log('publish-68-error: ', res.data)
          wx.showToast({
            title: '发布的信息包含违规内容！',
            icon: 'none'
          })
        }
      })
  },
  //信息待完整
  todo: function () {
    wx.showToast({
      title: '请填写完整！',
      icon: 'loading'
    });
    console.log('请将信息填写完整!!');
  },
  //标题信息输入框
  inputTitle: function(e) {
    let that = this;
    //dataset为{title: ''}
    let dataset = e.currentTarget.dataset;
    let value = e.detail.value;
    let title = dataset.title;
    that.data[title] = value;
    // console.log('value: ',value)
    that.setData({
      title: that.data[title].slice(0, 19),
      leftCount: that.data[title].length,
    });
    console.log(this.data.title)
  },
  //描述信息输入框
  inputDesc: function(e) {
    let that = this;
    //dataset为{title: ''}
    let dataset = e.currentTarget.dataset;
    let value = e.detail.value;
    let desc = dataset.desc;
    that.data[desc] = value;
    that.setData({
      desc: that.data[desc]
    });
  },
  published: function () {
    console.log("published");
    this.setData({
      show_: true
    })
  },
    //设置位置信息
  setPosition: function () {
    wx.chooseLocation({
        success: (res) => {
          //设置经纬度缓存
          wx.setStorageSync("latitude", res.latitude);
          wx.setStorageSync("longitude", res.longitude);

          let location = 'address.location',
              latitude = 'address.latitude',
              longitude = 'address.longitude';
          this.setData({
            [location]: res.name,
            [longitude]: res.longitude,
            [latitude]: res.latitude
          });
          console.log("输出选中的地址信息: ");
          console.log(this.data.address);

        }
      })
  },
    //关闭弹出窗口
  close: function() {
    console.log('关闭弹出窗口!');
    this.setData({
      show_: false
    })
  },
   //上传图片
  uploadImage: function () {
      var that = this;
     wxRequest.uploadQiniu().then((res) => {
      if (res.data.code === 20000) {
        wx.setStorageSync('uptoken', res.data.data);
      } else {
        console.log('====错误！!====\n错误码：',res.data.code)
        console.log(res.errMsg);
      }
    });
    if (this.data.atlas.length < 9) {

      this.setData({
        hideAddIcon: true
      })
      wx.chooseImage({
        //如果count为0
        count: 9-that.data.atlas.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          console.log('图片长度1：', that.data.atlas.length);
          //todo 需要修改
          const tempFilePaths = res.tempFilePaths;
          // let imgList = [];
          for (let i = 0; i < tempFilePaths.length; i++) {
            //七牛云上传图片
            qiniuUploader.upload(tempFilePaths[i], (res) => {
                  that.data.atlas.push(config.prefixQiniuImageURL + res.imageURL);
                  console.log('上传了几张图片：',that.data.atlas);
                  that.setData({
                    atlas: that.data.atlas
                  });
                  console.log('--00000', that.data.atlas);
                  console.log('图片长度2：', that.data.atlas.length);
                },
                (error) => {
                  console.log("错误：" + error);
                },
                {
                  region: 'SCN',
                  uptoken: wx.getStorageSync('uptoken')

                })
            wx.setStorage({
              key: 'imgUrl',
              data: {
                atlas: that.data.atlas
              }
            });
          }
        }
      });
    } else {
      this.setData({
        hideAddIcon: false
      })
      console.log('图片选择已达上限');
    }
    },

  previewImg: function (e) {
    let index = e.currentTarget.dataset.index;
    wx.previewImage({
      urls: this.data.atlas,
      current: this.data.atlas[index]
    })
  },

  deleteImg: function (e) {
    let index = e.currentTarget.dataset.index;
    console.log('index: ',index);
    this.data.atlas.splice(index, 1);
    this.setData({
      atlas: this.data.atlas
    });
  },
  bindPickerChange: function (e) {
    const val = e.detail.value;
    this.setData({
      index: val,
      type: this.data.typeArr[val]
    })
  },
  onLoad: function (options) {
      myUtils.wxSetNavbarTitle('发布');
      wx.getLocation({
        success: res => {
          let latitude = 'address.latitude',
              longitude = 'address.longitude';
          console.log('经度：',res.latitude);
          console.log('纬度：', res.longitude);
          this.setData({
              [latitude]: res.latitude,
              [longitude]: res.longitude
          })
        }
      });
      //调用腾讯地图api，获取当前经纬度,从而获取当前所在城市
      qqmapsdk.reverseGeocoder({
        success: (res) => {
          let city = res.result.address_component.province + res.result.address_component.city;
          let location = 'address.location';
          this.setData({
            _location: city,
            [location]: city
          });
          console.log(res.result.address_component.province);
          console.log(res.result.address_component.city);
        }
      })

    }
})
