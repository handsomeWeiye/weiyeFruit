var app = getApp()
const WXAPI = require('apifm-wxapi')
WXAPI.init('weiye')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔,3s
    duration: 1000, //  滑动动画时长1s

    buyNum:1,//用户想要购买的商品数量
    phone: '19102688475',//卖家电话号码

    goodsDetail: {}, //商品详情
    goodsReputation: [], //商品评价
    isDetail: true,//是否显示详情

    isShow: true,//是否弹出窗口

    html: '',//解析的网页文本
  },
  onLoad: function (options) {
    this.getGoodsDetail();
    this.getGoodsReputation();
    this.parseHtml();
  },

  //获取用户选择情况
  getIsDetail(e) {
    console.log('传来的值为', e.detail.val);
    this.setData({
      isDetail: e.detail.val
    })
  },

  //获取商品详情数据
  getGoodsDetail() {
    WXAPI.goodsDetail(368261).then(res => {
      if (res.code == 0) {
        console.log('商品详情：', res.data)
        this.setData({
          goodsDetail: res.data
        });
        this.parseHtml();
      }
    })
  },
  //获取商品评价数据
  getGoodsReputation() {
    WXAPI.goodsReputation(368311).then(res => {
      if (res.code == 0) {
        console.log('商品评价：', res.data)
        this.setData({
          goodsReputation: res.data
        })
      } else {
        console.log('获取商品评价');
      }
    })
  },

  //选择商品评价或者是详情
  selectDetail() {
    this.setData({
      isDetail: true
    });
  },
  selectComment() {
    this.setData({
      isDetail: false
    });
  },

  //显示商品详情
  parseHtml() {
    console.log(this.data.goodsDetail.content);
    var html = this.data.goodsDetail.content
    html = html.replace(/\<img/gi, '<img style="max-width:100%;height:auto" mode="widthFix"')
    this.setData({
      html: html
    })
  },

  //联系卖家
  phoneCall: function () {

    wx.makePhoneCall({

      phoneNumber: this.data.phone

    })

  },


  //立即下单（底部弹出窗口下单）
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

  //添加到购物车（底部弹出窗口添加购物车）
  addCarts: function () {
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
  //点击购物车
  tapCar(e) {
    console.log('商品加入购物车');
    this.setData({
      isShow: true,
      operation: '加入购物车'
    });

  },
  //点击订单
  tapOrder(e) {
    console.log('商品下单');
    this.setData({
      isShow: true,
      operation: '立即购买'
    });

  },
  //打开弹窗
  openPopUp(e) {
    var data = e.currentTarget.dataset.name
    this.setData({
      isShow: true,
      choiceName: data
    })
  },
  //关闭弹窗
  closePopUp() {
    this.setData({
      isShow: false
    })
  },
  getBuyNum(e) {
    console.log('用户选择的数量', e.detail)
    this.setData({
      buyNum : e.detail
    })
  },

  //跳转到购物车页面
  toCar: function () {
    wx.switchTab({
      url: '../cart/cart',
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})