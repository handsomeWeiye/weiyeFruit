var app = getApp()
var Bmob = require('../../utils/Bmob-2.2.2.min.js');
// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    objectId: '',
    product: '',
    imgUrls:[],
    comments:[],
    image:'',
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔,3s
    duration: 1000, //  滑动动画时长1s
  },

  toBuy() {
    wx.showToast({
      title: '立即购买',
      icon: 'success',
      duration: 3000
    });
    wx.navigateTo({
      url: '../order/order',
    })
    this.setData({
      showDialog: !this.data.showDialog
    });
  },
  //添加到购物车
  addCarts: function() {
    console.log('购物车添加');
    // console.log(app.globalData.carts);
    // let that = this;
    // console.log(parm);
    //获取goodsList里的index
    // let index = parm.currentTarget.dataset.index;
    var objectId = this.data.objectId;
    console.log(objectId);
    // let product = this.data.product;
    // console.log(index);
    // console.log(objectId);
    // console.log(app.globalData.carts);
    // console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')
    // console.log(that.data.list);
    if (app.globalData.carts.length == 0) {
      //如果carts是空的，那么就直接添加
      //首先要制作一个数据模型
      var cartItem = {
        "name": this.data.product.name,
        "image": this.data.product.image,
        "num": 1,
        "originPrice": this.data.product.originPrice,
        "price": this.data.product.price,
        "objectId": this.data.product.objectId,
        'isLimit': this.data.product.isLimit,
        'isSeleted': true
      }
      console.log('首个商品添加已成功');
      app.globalData.carts.push(cartItem);
      console.log(app.globalData.carts);
    } else {
      //如果不是空的，那么就要进行判断，如果其中没有，那么也去添加，如果有的话，就要就要将数量增加一
      for (let i = 0; i < app.globalData.carts.length; i++) {
        console.log(objectId);
        // let objectId = this.data.goodsWelfareItems[index].objectId;
        // console.log(objectId);
        // console.log(app.globalData.carts[i]['objectId'] );
        //遍历循环，如果新添加的商品的ID同cart中存在着ID相等，说明这个东西已经被添加过了，只是要增加一个数量
        if (app.globalData.carts[i]['objectId'] == this.data.objectId) {
          app.globalData.carts[i].num = app.globalData.carts[i].num + 1;
          console.log('该商品被再次添加');
          console.log('目前的该商品的数量为' + app.globalData.carts[i].num);
          console.log(app.globalData.carts);
          return null;
        }
      }
      //carts列表中不能存在相同的东西，那么就添加
      var cartItem = {
        "name": this.data.product.name,
        "image": this.data.product.image,
        "num": 1,
        "originPrice": this.data.product.originPrice,
        "price": this.data.product.price,
        "objectId": this.data.product.objectId,
        'isLimit': this.data.product.isLimit,
        'isSeleted': true
      }
      app.globalData.carts.push(cartItem);
      console.log(app.globalData.carts);
    }

  },

  toCar: function () {
    wx.switchTab({
      url: '../cart/cart',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var objectId = options.objectId;
    console.log(objectId);
    var query = Bmob.Query('product');
    var query1 = Bmob.Query('commet');
    query.get(objectId).then(res => {
      console.log(res);
      var image = res.image;
      var list = [image];
      console.log(list);
      this.setData({
        imgUrls: list,
        product : res,
        image: res.image,
        objectId:objectId
      })
      // console.log(this.image);
      
    });

    console.log(this.imgUrls);
    console.log(this.product);
    console.log(this.image);

    query1.find().then(res => {
      console.log(res);
      this.setData({
        comments:res
      })
    }).catch(err => {
      console.log(res);
    });
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