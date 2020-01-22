var app = getApp()
var Bmob = require('../../utils/Bmob-2.2.2.min.js');

// pages/userInfo/userInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: null,
    phone: null,
    room: null,
    floor: null,
    isHasInfo: false,
    multiArray: [
      ['成大二期A区', '成大二期B区', '成大二期C区'],
      ['1栋', '2栋', '3栋', '4栋', '5栋', '6栋', '7栋', '8栋', '9栋', '10栋', '11栋', '12栋', '13栋', '14栋', '15栋'],
      ['一单元', '二单元', '三单元', '四单元']
    ],
  },

  bindMultiPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var index = e.detail.value
    var floor = this.data.multiArray[0][index[0]] + this.data.multiArray[1][index[1]] + this.data.multiArray[2][index[2]];
    console.log('picker发送选择改变，携带值为', floor);
    this.setData({
      isHasInfo: true,
      multiIndex: e.detail.value,
      floor: floor
    })
  },

  addName: function(e) {
    console.log(e.detail.value);
    this.setData({
      name: e.detail.value
    })
  },
  addPhone: function(e) {
    console.log(e);
   
    this.setData({
      phone: e.detail.value
    })
  },
  addRoom: function(e) {
    console.log(e);
    this.setData({
      room: e.detail.value
    })
   
  },
  confirm: function() {
    if (this.data.name != null && this.data.phone != null && this.data.floor != null && this.data.room != null) {
      var query = Bmob.Query('member');
      query.get(app.globalData.userId).then(
        res => {
          // console.log(res);
          res.set('name', this.data.name);
          res.set('phone', this.data.phone);
          res.set('address', this.data.floor + this.data.room);
          res.save().then(res => {
            if(res.updataeAt != ''){
              wx.showToast({
                title: '信息添加成功',
              })
              wx.navigateTo({
                url: '../order/order',
              })
            }
          }).catch(err => {
            console.log(err);
            wx.showToast({
              title: '信息添加失败，请重试',
            })
          });
        }
      ).catch(err => {
        console.log(err)
      })
    }else{
      wx.showToast({
        title: '配送信息不完整呦',
        icon:'none',
        duration: 2000
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})