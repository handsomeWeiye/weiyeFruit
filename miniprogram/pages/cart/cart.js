var app = getApp()
const WXAPI = require('apifm-wxapi')
WXAPI.init('weiye')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartInfo: {},
    isNull: false,
  },

  //初始化
  onLoad: function (options) {
    this.getCartInfo();
  },

  onShow:function(){
    this.getCartInfo();
  },

  //获取购物车中的信息
  getCartInfo() {
    var token = wx.getStorageSync('token');
    WXAPI.shippingCarInfo(token).then(res => {
      console.log(res);
      if (res.code == 0) {
        console.log('获取购物车信息成功', res.data);
        this.setData({
          cartInfo: res
        })
      } else
        if (res.code == 700) {
          console.log('购物车为空', res.data);
          this.setData({
            cartInfo: res,
            isNull: true
          })
        } else {
          console.log('获取购物车信息失败');
        }
    });
  },

  //改变购物车商品的数量
  changeGoodsNum(e) {
    var that = this;
    console.log(e);
    var token = wx.getStorageSync('token');
    var key = e.currentTarget.dataset.key
    var number = e.detail
    WXAPI.shippingCarInfoModifyNumber(token, key, number).then(res => {
      if (res.code == 0) {
        console.log('修改购物车数量成功');
        
      } else {
        console.log('修改购物车数量失败');
      }
    });
    that.getCartInfo();
  },

  //删除购物车中的某商品
  removeCarts: function (e) {
    var that = this
    console.log(e);
    var token = wx.getStorageSync('token');
    var key = e.currentTarget.dataset.key
    WXAPI.shippingCarInfoRemoveItem(token, key).then(res => {
      if (res.code == 0) {
        console.log('删除购物车成功');
        
      } else {
        console.log('删除购物车失败');
      }
    });
    that.getCartInfo();
  },

  //到主页
  toHome(){
    wx.switchTab({
      url: "/pages/home/home"
    })
  },


  // 去结算
  toOrder() {
    wx.navigateTo({
      url: '../order/order',
    })
  },

})