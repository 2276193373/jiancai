//app.js
App({
  onLaunch: function () {
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