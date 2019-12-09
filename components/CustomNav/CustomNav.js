const app = getApp()

Component({
  options: {
    multipleSlots: true
  },
    properties: {
    text: {
      type: String,
      value: '绑定手机号'
    },
    back: {
      type: Boolean,
      value: false
    },
    home: {
      type: Boolean,
      value: false
    }
  },
  data: {
    // statusBarHeight: app.globalData.statusBarHeight + 'px',
    navigationBarHeight: '64px'
  },

  methods: {
    backHome: function () {
      let pages = getCurrentPages()
      wx.navigateBack({
        delta: pages.length
      })
    },
    back: function () {
      wx.navigateBack({
        delta: 1
      })
    }
  }
})