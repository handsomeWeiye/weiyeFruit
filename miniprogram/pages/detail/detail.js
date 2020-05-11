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

    buyNum: 1,//用户想要购买的商品数量
    phone: '19102688475',//卖家电话号码

    goodsDetail: {}, //商品详情
    goodsReputation: [], //商品评价
    isDetail: true,//是否显示详情
    goodsId: '',//商品ID

    isShow: false,//是否弹出窗口

    html: '',//解析的商品详情介绍网页文本

    propertyid: '',//目前被选中的商品规格大类
    propertychildid: null, //目前被选中的商品规格ID
    price: null, //某规格之下该物品的价格
    cartInfo: {}, //购物车中的信息

    operation: '',//用户选择的操作名
  },
  onShareAppMessage(options){

  },
  //初始化操作
  onLoad: function (options) {
    console.log(options);
    var goodsId = String(options.id);
    console.log(goodsId);

    this.setData({
      goodsId: goodsId,
      price:options.price
    });
    this.getCartInfo();
    this.getGoodsDetail(goodsId);
    this.getGoodsReputation(goodsId);
    this.parseHtml();
  },


  //获取商品详情数据
  getGoodsDetail(goodsId) {
    WXAPI.goodsDetail(goodsId).then(res => {
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
  getGoodsReputation(goodsId) {
    console.log(goodsId);
    var page = '1'
    var pageSize = '10'
    var token = wx.getStorageSync('token')
    var object = {
      'goodsId':goodsId
    }
    WXAPI.goodsReputation(object).then(res => {
      console.log(res);
      if (res.code == 0) {
        console.log('商品评价：', res.data)
        this.setData({
          goodsReputation: res.data
        })
      } else {
        console.log('获取商品评价失败');
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
    var html = String(this.data.goodsDetail.content)
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
  //跳转到购物车页面
  toCar: function () {
    wx.switchTab({
      url: '../cart/cart',
    })
  },
  //点击购物车同时打开弹窗
  tapCar(e) {
    console.log('商品加入购物车');
    this.setData({
      isShow: true,
      operation: '加入购物车'
    });

  },
  //点击订单同时打开弹窗
  tapOrder(e) {
    console.log('商品下单');
    this.setData({
      isShow: true,
      operation: '立即购买'
    });

  },

  //关闭弹窗
  closePopUp() {
    this.setData({
      isShow: false
    })
  },

  //选择规格
  labelItemTap(e) {
    console.log(e.currentTarget.dataset.propertychildid, e.currentTarget.dataset.propertyid);
    this.setData({
      propertyid: e.currentTarget.dataset.propertyid,
      propertychildid: e.currentTarget.dataset.propertychildid
    });
    this.getGoodsPrice();
  },

  //获取不同规格的实时售价
  getGoodsPrice() {
    WXAPI.goodsPrice(this.data.goodsId, this.data.propertychildid).then(res => {
      var price = res.data.price;
      console.log('该规格下的商品价格是', price);
      this.setData({
        price: price
      })
    })
  },


  //选择商品数量
  getBuyNum(e) {
    console.log('用户选择的数量', e.detail)
    this.setData({
      buyNum: e.detail
    })
  },

  //添加到购物车（底部弹出窗口添加购物车）
  addCart: function () {
    var token = wx.getStorageSync('token');
    var number = this.data.buyNum;
    var goodsId = this.data.goodsId;
    var optionId = this.data.propertyid;
    var optionValueId = this.data.propertychildid;
    var   sku = [{
      "optionId": optionId,
      "optionValueId": optionValueId
    }]
    //如果该商品没有特别的规格
    console.log(optionValueId);
    
    if (optionValueId === null) {
      wx.showToast(
        {
          icon: 'sucess',
          title: '请先选择规格哦'
        }
      )
      // WXAPI.shippingCarInfoAddItem(token, goodsId, number).then(res => {
      //   console.log(res);
      //   if (res.code == 0) {
      //     wx.showToast(
      //       {
      //         icon: 'sucess',
      //         title: '添加购物车成功'
      //       }
      //     )
      //   }

      // });
      this.getCartInfo();

    } else {
      WXAPI.shippingCarInfoAddItem(token, goodsId, number, sku).then(res => {
        console.log(res);
        if (res.code == 0) {
          wx.showToast(
            {
              icon: 'sucess',
              title: '添加购物车成功'
            }
          )
        }

      });
      this.getCartInfo();

    }


  },

  //获取购物车信息
  getCartInfo() {
    var token = wx.getStorageSync('token');
    WXAPI.shippingCarInfo(token).then(res => {
      console.log(res);
      this.setData({
        cartInfo: res
      })
    });
  },

  //立即下单（底部弹出窗口下单）
  toBuy: function () {
    if (this.data.propertychildid === null) {
      wx.showToast(
        {
          icon: 'sucess',
          title: '请先选择规格哦'
        }
      )}else{
      this.addCart(),
        wx.showToast({
          title: '立即购买',
          icon: 'success',
          duration: 3000
        });
      wx.navigateTo({
        url: '../order/order',
      })
      }

  },
})