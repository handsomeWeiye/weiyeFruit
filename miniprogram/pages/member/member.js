var app = getApp()
const WXAPI = require('apifm-wxapi')
WXAPI.init('weiye')

Page({
  data: {
    userInfo: null,
    isHasInfo: false,
    token: null,
  },

  //初始化操作
  onLoad: function () {
    this.getToken()
    this.getUserInfo()
  },
  onShow: function () {
  },
  onShareAppMessage(options){

  },

  //获取用户信息
  getUserInfo() {
    var that = this
    var token = wx.getStorageSync('token');
    WXAPI.queryAddress(token).then(res => {
      console.log(res);
      if (res.code == 700) {
        console.log('该用户没有收货地址记录');
        that.setData({
          isHasInfo: false,
        })
      } else if (res.code == 0) {
        that.setData({
          userInfo: res.data[0],
          isHasInfo: true
        })
      }
    })
  },

  //获取用户token
  getToken() {
    var token = wx.getStorageSync('token');
    this.setData({
      token: token
    })
  },
  //联系卖家
  phoneCall: function () {

    wx.makePhoneCall({

      phoneNumber: 19102688475

    })

  },

  //导航到优惠券页面
  toDisount: function () {
    wx.navigateTo({
      url: '../discount/discount',
    })
  },
  //导航到订单详情页面
  toOrderList: function () {
    console.log('aaa');
    
    wx.navigateTo({
      url: '../order-list/index'
    })
  },

})