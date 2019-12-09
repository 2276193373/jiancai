// components/Popup/Popup.js
Component({
  /**
   * 组件的属性列表
   * 
   */
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    title: {            // 属性名
      type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '标题'     // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    // 弹窗内容
    content: {
      type: String,
      value: '内容'
    },
    // 弹窗取消按钮文字
    btn_no: {
      type: String,
      value: '取消'
    },
    // 弹窗确认按钮文字
    btn_ok: {
      type: String,
      value: '确定'
    } 
  },

  /**
   * 组件的初始数据
   */
  data: {
    flag: true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hidePopup: function () {
      this.setData({
        flag: !this.data.flag
      })
  },
    showPopup() {
      this.setData({
        flag: !this.data.flag
      })
    },
    _error() {
      //触发取消回调
      this.triggerEvent("error")
    },
    _success() {
      //触发成功回调
      this.triggerEvent("success");
    }
  }
})
