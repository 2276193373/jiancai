export default {
    //设置标题栏内容
    wxSetNavbarTitle(title) {
        wx.setNavigationBarTitle({
          title: title
        })
    },
    //时间戳转为日期
    timestampToDate(timestamp) {
        let date = new Date(timestamp),
            Y = date.getFullYear() + '-',
            M = (date.getMonth()+1<10?'0'+(date.getMonth()+1):date.getMonth()+1) + '-',
            D = date.getDate() + ' ',
            h = date.getHours() + ':',
            m = date.getMinutes() + ':',
            s = date.getSeconds();
        console.log(Y+M+D+h+m+s);
    },
    //拨打电话
    phoneCall(phoneNumber) {
        wx.makePhoneCall({
          phoneNumber: phoneNumber
        });
    }
} 