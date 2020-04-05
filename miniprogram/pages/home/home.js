var app = getApp()
var Bmob = require('../../utils/Bmob-2.2.2.min.js');
// pages/home/home.js
Page({


  /**
   * 页面的初始数据
   */
  data: {
    // banner
    indicatorDots: true, //设置是否显示面板指示点
    autoplay: true, //设置是否自动切换
    interval: 3000, //设置自动切换时间间隔,3s
    duration: 1000, //  设置滑动动画时长1s

    totalMoney: 0,
    totalNum: 0,

    imgUrls: [
    ],

    goodsWelfareItems: []
  },


  // countTotal: function() {
  //   app.globalData.totalMoney = 0;
  //   app.globalData.totalOriginMoney = 0;
  //   for (var i = 0; i < app.globalData.carts.length; i++) {
  //     var isSeleted = app.globalData.carts[i].isSeleted;
  //     if (isSeleted) {
  //       app.globalData.totalMoney = app.globalData.totalMoney + app.globalData.carts[i].num * app.globalData.carts[i].price;
  //       app.globalData.totalOriginMoney = app.globalData.totalOriginMoney + app.globalData.carts[i].num * app.globalData.carts[i].originPrice;
  //       console.log(app.globalData.totalOriginMoney);
  //     }
  //   }

  //   this.setData({
  //     totalMoney: parseFloat(app.globalData.totalMoney).toFixed(2)
  //   })
  // },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let query = Bmob.Query('product');
    let query1 = Bmob.Query('swiper');
    query.limit(100);
    query.find().then(res => {
      this.setData({
        goodsWelfareItems: res
      });
      console.log(res);
    }).catch(err => {
      console.log(res);
    });
    query1.find().then(res => {
      this.setData({
        imgUrls: res
      });
      console.log(res);
    }).catch(err => {
      console.log(res);
    });
    console.log(this.data.imgUrls);


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  toDetail:function(e){
    var objectId = e.target.dataset.object
    console.log(e.target.dataset.object);
    wx.navigateTo({
      url: '../detail/detail?objectId='+objectId
    })
  },
  toCar: function() {
    wx.switchTab({
      url: '../cart/cart',
    })
  },

  addCarts:function(parm){
    app.addCarts(parm);
  },

  toMember:function(){
    wx.switchTab({
      url: '../member/member',
    })
  },

  // //添加到购物车
  // addCarts: function(parm) {
  //   console.log('购物车添加');
  //   console.log(parm);
  //   // let that = this;
  //   // console.log(parm);
  //   //获取goodsList里的index
  //   let index = parm.currentTarget.dataset.index;
  //   let objectId = this.data.goodsWelfareItems[index].objectId;
  //   // console.log(index);
  //   // console.log(objectId);
  //   // console.log(app.globalData.carts);
  //   // console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')
  //   // console.log(that.data.list);
  //   if (app.globalData.carts.length == 0) {
  //     //如果carts是空的，那么就直接添加
  //     //首先要制作一个数据模型
  //     var cartItem = {
  //       "name": this.data.goodsWelfareItems[index].name,
  //       "image": this.data.goodsWelfareItems[index].image,
  //       "num": 1,
  //       "originPrice": this.data.goodsWelfareItems[index].originPrice,
  //       "price": this.data.goodsWelfareItems[index].price,
  //       "objectId": this.data.goodsWelfareItems[index].objectId,
  //       'isLimit': this.data.goodsWelfareItems[index].isLimit,
  //       'isSeleted': true
  //     }
  //     console.log('首个商品添加已成功');
  //     app.globalData.carts.push(cartItem);
  //     console.log(app.globalData.carts);
  //   } else {
  //     //如果不是空的，那么就要进行判断，如果其中没有，那么也去添加，如果有的话，就要就要将数量增加一
  //     for (let i = 0; i < app.globalData.carts.length; i++) {
  //       // console.log(i);
  //       // let objectId = this.data.goodsWelfareItems[index].objectId;
  //       // console.log(objectId);
  //       // console.log(app.globalData.carts[i]['objectId'] );
  //       //遍历循环，如果新添加的商品的ID同cart中存在着ID相等，说明这个东西已经被添加过了，只是要增加一个数量
  //       if (app.globalData.carts[i]['objectId'] == objectId) {
  //         app.globalData.carts[i].num = app.globalData.carts[i].num + 1;
  //         console.log('该商品被再次添加');
  //         console.log('目前的该商品的数量为' + app.globalData.carts[i].num);
  //         console.log(app.globalData.carts);
  //         return null;
  //       }
  //     }
  //     //carts列表中不能存在相同的东西，那么就添加
  //     var cartItem = {
  //       "name": this.data.goodsWelfareItems[index].name,
  //       "image": this.data.goodsWelfareItems[index].image,
  //       "num": 1,
  //       "originPrice": this.data.goodsWelfareItems[index].originPrice,
  //       "price": this.data.goodsWelfareItems[index].price,
  //       "objectId": this.data.goodsWelfareItems[index].objectId,
  //       'isLimit': this.data.goodsWelfareItems[index].isLimit,
  //       'isSeleted': true
  //     }
  //     app.globalData.carts.push(cartItem);
  //     console.log(app.globalData.carts);
  //   }
  //   app.countTotal();

  // },
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
    console.log('加载更多');
    setTimeout(() => {
      this.setData({

      })
    }, 500)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },


  // 去结算
  toBuy() {
    wx.navigateTo({
      url: '../order/order',
    })
  },
})