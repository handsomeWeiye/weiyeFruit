var app = getApp();
const WXAPI = require('apifm-wxapi')
WXAPI.init('weiye')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id);

    WXAPI.noticeDetail(options.id).then(res => {
      console.log(res.data);
      this.setData({
        notice: res.data
      });
      
    }
    )


  },

})