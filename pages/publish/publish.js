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
    phoneNumber: '',
    violation: true
  },

  descViolation: function() {
    wx.cloud.callFunction({
      name: 'ContentCheck',
      data: {
        msg: this.data.desc
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
  titleViolation: function(){
    let _this = this
      wx.cloud.callFunction({
        name: 'ContentCheck',
        data: {
          msg: this.data.title
        },
        success: res => {
          console.log('res of cloud\'s文字：', res.result)
          if (res.result.errCode == 87014) {
              this.setData({
                violation: false
              })
            console.log('标题包含敏感信息！')
            wx.showToast({
              title: '标题包含敏感信息！',
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

  //发布信息
  publish:  function () {
    let _this = this
    //定义一个变量看有没有违规，true表示没有违规
     /* wx.cloud.callFunction({
      name: 'ContentCheck',
      data: {
        msg: this.data.title//"你，妈。死、了",//此段文字也违规
      },
      success(res) {
        console.log('res of cloud\'s 文字: ', res.result)
        if (res.result.errCode == 87014) {
          console.log('文字违规！')
          wx.showToast({
            title: '文字违规',
          })
            _this.setData({
              violation: false
            })
        } else {
          console.log('文字没有违规！')
          wx.showToast({
            title: '文字没有违规！'
          })
        }
      }
    })
      wx.cloud.callFunction({
      name: 'ContentCheck',
      data: {
        img: '/imgs/sanguinary.jpg' //图片地址
      },
      success(res) {
        console.log('res.result of 图片',res.result)
        if(res.result.imageR.errCode == 87014){
          wx.showToast({
            title: '图片违规!!',
          })
          _this.data.violation = false
        } else {
          console.log('图片没有违规！')
          wx.showToast({
            title: '图片没有违规！'
          })
        }
      }
    })*/
      wxRequest.getUserInfo().then(res => {
      this.setData({
        phoneNumber: res.data.data.phoneNumber
      })
    });
    //发布传入data
      setTimeout( ()=> {
        if (this.data.violation){
          wxRequest.publish(this.data.title, this.data.desc, this.data.atlas, this.data.type, this.data.address).then((res) => {
            let infoOfPublish = res.data.data;
            if (res.data.code === 20000) {
              console.log('发布成功！');
              wx.setStorageSync('pop', true);
              wx.redirectTo({
                // url: `/pages/detail/detail?title=${infoOfPublish.title}&desc=${infoOfPublish.desc}&atlas=${infoOfPublish.atlas}&company=${infoOfPublish.company}&createdAt=${infoOfPublish.createdAt}&location=${infoOfPublish.location}&type=${infoOfPublish.type}&creatorNickname=${infoOfPublish.creatorNickname}&_id=${infoOfPublish._id}&creatorAvatar=${infoOfPublish.creatorAvatar}&creatorId=${infoOfPublish.creatorId}`,
                url: `/pages/detail/detail?_id=${infoOfPublish._id}`,
                success: res => {
                }
              });
              console.log('发布后返回的信息数据：',res.data.data);
              // wx.setStorageSync('publish_info', res.data.data);
              wx.setStorageSync('timeSort', 'time');
              wx.setStorageSync('type', this.data.type);
            } else {
              console.log('发布出错！\n')
              console.log('publish-64-error: ', res.data)
            }
          })
        } else {
          console.log('内容包含敏感信息！')
        }

      },1000)

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
          console.log(res);
          console.log(res.name);
          console.log(res.latitude);
          console.log(res.longitude);

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
                  console.log('-0000', res);
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