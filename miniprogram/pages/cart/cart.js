var app = getApp()
var Bmob = require('../../utils/Bmob-2.2.2.min.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAllSelect: true,
    totalMoney: 0,
    totalNum:0,
    carts: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  //删除购物车中的某商品
  removeCarts:function(parm){
    app.removeCarts(parm);
    this.reload();
  },

  countTotal: function() {
    app.countTotal();
    this.reload();
  },

  reload:function(){
    this.setData({
      totalMoney:app.globalData.totalMoney,
      totalNum:app.globalData.totalNum,
      carts:app.globalData.carts,
    });
  },


  switchSelect: function(e) {
    var index = parseInt(e.target.dataset.id);
    app.globalData.carts[index].isSeleted = !app.globalData.carts[index].isSeleted;
    this.getAllSeleted();
    this.countTotal();
  },


  getAllSeleted:function(e){
    var list = []
    app.globalData.carts.forEach(item=>{
      list.push(item.isSeleted);
    });
    var sets = new Set(list);
    if (sets.has(false)){
      this.setData({
        isAllSelect:false,
      })
    }else{
      this.setData({
        isAllSelect: true,
      })
    }
  },

  //全选
  allSelect: function(e) {
    if (this.data.isAllSelect) {
      this.data.isAllSelect = false;
      app.globalData.carts.forEach(item => {
        item.isSeleted = false;
      });
      this.setData({
        isAllSelect: false
      })
      this.countTotal();
    } else {
      //处理全选逻辑
      app.globalData.carts.forEach(item => {
        item.isSeleted = true;
      });

      this.setData({
        isAllSelect: true
      })
      this.countTotal();
    }


  },



  // 去结算
  toBuy() {
    wx.navigateTo({
      url: '../order/order',
    })
  },


  /* 点击减号 */
  bindMinus: function(e) {
    console.log(e);
    var id = e.target.dataset.id;
    var index = parseInt(e.target.dataset.id);
    var num = app.globalData.carts[index].num;
    console.log(num);
    // 如果大于1时，才可以减
    if (num > 1) {
      num--;
    }
    app.globalData.carts[index].num = num;
    this.setData({
      carts: app.globalData.carts
    })
    this.countTotal();
  },
  /* 点击加号 */
  bindPlus: function(e) {
    console.info(e)
    let index = parseInt(e.target.dataset.index);
    app.globalData.carts[index].num = app.globalData.carts[index].num + 1;

    this.setData({
      carts: app.globalData.carts
    });
    this.countTotal();
  },
  /* 输入框事件 */
  bindManual: function(e) {
    let index = parseInt(e.target.dataset.index);
    var num = parseInt(e.detail.value);
    app.globalData.carts[index].num = num;
    // 将数值与状态写回
    this.setData({
      carts: app.globalData.carts
    });
    this.countTotal();
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
    this.getAllSeleted();
    this.setData({
      carts: app.globalData.carts
    });
    this.countTotal();
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