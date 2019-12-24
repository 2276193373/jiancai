//app.js
import wxRequest from './utils/request'
App({
  onLaunch: function () {
      wx.cloud.init({
          env: "chm666-8ln0u",
          traceUser: true
      })
      wx.getSystemInfo({
          success:res=>{
              // this.globalData.isIpx = res.model.search('iPhone12') !== -1
              // this.globalData.isIpx = res.model.search(/iPhone1./) !== -1
              //匹配iPhone10,iPhone11,iPhone12
              this.globalData.isIpx = /iPhone1./.test(res.model.toString())
          }
      })


  },
    globalData: {

    }
})