//app.js
App({
  onLaunch: function () {
      wx.getSystemInfo({
          success:res=>{
              // console.log('我是全局变量：',res.model)
              this.globalData.isIpx = res.model.search('iPhone X') !== -1
          }
      })
  },
    globalData: {

    }
})