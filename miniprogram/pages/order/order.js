var app = getApp()
const WXAPI = require('apifm-wxapi')
WXAPI.init('weiye')

Page({

  /**
   * 页面的初始数据
   */
  data: {

    cartInfo: null, //购物车中的信息
    startPrice: null, //起送价格

    token: null, //用户token
    userInfo: null, //用户配送信息
    isHasInfo: false, //是否有用户配送信息


    deliveryArray: [], //配送时间选项
    deliveryTime: '立即', //用户选择的配送时间
    isHasTime: false, //是否选择了配送的时间
    deliveryCost: 0, //配送费用

    packageCost: 0, //包装费用


    couponList: [], //优惠券数据
    isCouponShow: false, //是否显示优惠券弹窗
    discount: 0, //优惠券折扣费用
    couponsId: null, //优惠券Id

    price: 0, //目前订单的总价格，小计
    orderInfo: null, //成功下单之后的订单信息

    remark: '', //用户备注的信息

    tableWareNum: [1, 2, 3], //餐具可选择的数量
    tableWareChoice: 1, //目前选择的餐具数量
    isTableWareShow: false, //是否显示餐具数量选择弹窗
  },


  onShareAppMessage(options) {

  },
  //获取购物车中的信息
  getCartInfo() {
    var that = this
    var token = wx.getStorageSync('token');
    WXAPI.shippingCarInfo(token).then(res => {
      console.log(res);
      if (res.code == 0) {
        console.log('获取购物车信息成功', res);
        this.setData({
          cartInfo: res
        });
        that.getPackageCost()
      } else
      if (res.code == 700) {
        console.log('购物车为空', res);
        this.setData({
          cartInfo: res,
          isNull: true
        })
      } else {
        console.log('获取购物车信息失败');
      }
    });
  },

  onLoad: function(options) {
    this.getToken();
    this.getUserInfo();
    this.getCartInfo();
    this.getDeliveryArray();
    this.getMyCoupons();
    this.getStartPrice();
  },
  //获取起送价
  getStartPrice() {
    var that = this;
    WXAPI.queryConfigValue('shopDeliveryPrice').then(function(res) {
        var startPrice = parseInt(res.data)
        console.log(startPrice)
        that.setData({
          startPrice: startPrice
        })
      }

    );
    console.log(this.data.startPrice);
  },
  //获取用户的收货地址
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
        console.log(this.data.userInfo);
      }
    })
  },

  getToken() {
    var token = wx.getStorageSync('token');
    this.setData({
      token: token
    })
  },

  //添加用户配送信息
  updateInfo: function() {
    wx.showModal({
      title: '修改配送信息',
      content: '您确定要修改配送信息吗?',
      confirmText: "确定",
      cancelText: "取消",
      success: function(res) {
        console.log(res);
        if (res.confirm) {
          console.log('用户点击主操作')
          wx.navigateTo({
            url: '../userInfo/userInfo',
          })
        } else {
          console.log('用户点击辅助操作')
        }
      },

    })
  },


  //获取用户可以选择的时间范围
  getDeliveryArray() {
    var today = this.getNowTime();
    var tomorrow = this.getDateStr(today, 1);
    var afterTomorrow = this.getDateStr(today, 2);
    var deliveryArray = [
      [today, tomorrow, afterTomorrow],
      ['9:00-11:00', '14:00-16:00', '18:00-20:00', ]
    ];
    this.setData({
      deliveryArray: deliveryArray
    })
  },

  //用户选择配送时间
  getDeliveryTime: function(e) {
    console.log('用户选择的索引为', e.detail.value)
    var index = e.detail.value
    var deliveryTime = this.data.deliveryArray[0][index[0]] + '-' + this.data.deliveryArray[1][index[1]];
    console.log('用户选择的配送时间为', deliveryTime);
    this.setData({
      isHasTime: true,
      deliveryTime: deliveryTime
    })
  },

  //获取包装费用
  getPackageCost: function(totalNum) {
    var totalNum = this.data.cartInfo.data.number
    var packageCost = null
    if (totalNum > 2) {
      if (totalNum > 5) {
        packageCost = 4
      } else {
        packageCost = 2
      }
    } else {
      packageCost = 1
    }
    this.setData({
      packageCost: 0
    })
    this.getPrice();
  },

  getRemark(e) {
    console.log(e.detail);
    this.setData({
      remark: e.detail
    })
  },

  //选择餐具数量模块（勺子数量）
  tableWareOpen: function() {
    this.setData({
      isTableWareShow: true
    })
  },
  tableWareShowClose: function() {
    this.setData({
      isTableWareShow: false
    })
  },
  tableWareConfirm: function(e) {
    console.log(e.detail.value)
    var num = e.detail.value
    var str = '选择' + parseInt(num) + '套餐具'
    wx.showToast({
      title: str,
    })
    this.setData({
      tableWareChoice: num
    })
  },

  //获取优惠券信息
  getMyCoupons() {
    const loginToken = wx.getStorageSync('token')
    if (!loginToken) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      app.login()
      return
    }
    WXAPI.myCoupons({
      token: loginToken
    }).then(res => {
      console.log(res)
      if (res.code == 0) {
        this.setData({
          couponList: res.data
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        this.setData({
          couponList: null
        })
      }
    })
  },

  //控制优惠券开关
  myCouponsOpen() {
    this.setData({
      isCouponShow: true
    });
  },

  myCouponsClose() {
    this.setData({
      isCouponShow: false
    });
  },

  myCouponsSelect(event) {
    console.log(event);
    var price = this.data.price
    var moneyhreshold = event.target.dataset.moneyhreshold
    console.log(moneyhreshold)
    if (price >= moneyhreshold) {
      this.setData({
        discount: event.target.dataset.money,
        couponsId: event.target.dataset.id,
      })
      this.getPrice();
      wx.showToast({
        title: '选择成功',
        icon: 'success'
      })
    } else {
      wx.showToast({
        title: '未达到可用金额',
        icon: 'none'
      })
    }

    this.myCouponsClose()
  },


  getPrice() {
    var goodsPrice = this.data.cartInfo.data.price;
    var discount = this.data.discount;
    var packageCost = this.data.packageCost;
    var price = goodsPrice + packageCost - discount;
    this.setData({
      price: price
    })
    console.log(this.data.price)
    return price
  },

  createOrder() {
    var that = this
    //准备需要提交的数据
    var postData = {}

    postData.token = wx.getStorageSync('token')
    postData.goodsJsonStr = this.getGoodsJsonStr()
    postData.address = this.data.userInfo.address
    postData.deliveryCost = this.data.deliveryCost
    postData.remark = '地址' + ' ' + this.data.userInfo.address + ' ' + '电话' + ' ' + this.data.userInfo.mobile + ' ' + '联系人' + ' ' + this.data.userInfo.linkMan + '  ' + '配送时间' + ' ' + this.data.deliveryTime + ' ' + '备注' + ' ' + this.data.remark + ' ' + '餐具数量' + ' ' + this.data.tableWareChoice
    postData.linkMan = this.data.userInfo.linkMan
    postData.mobile = this.data.userInfo.mobile
    postData.provinceId = this.data.userInfo.provinceId
    postData.cityId = this.data.userInfo.cityId
    postData.expireMinutes = 0
    postData.code = 610000
    console.log(postData.address)
    if (this.data.couponsId != null) {
      postData.couponId = this.data.couponsId;
    }
    //判断情况（token,startPrice,userInfo,cartInfo,deliveryTime)
    if (this.data.userInfo == null) {
      wx.showModal({
        title: '友情提示',
        content: '请先设置您的收货地址！',
        showCancel: false
      })
      return
    }
    if (this.data.token == null) {
      wx.showModal({
        title: '友情提示',
        content: '网络出了点问题，未登录',
        showCancel: false
      })
      return
    }
    if (this.data.price < this.data.startPrice) {
      wx.showModal({
        title: '友情提示',
        content: '未达到起送价格' + String(this.data.startPrice) + '元',
        showCancel: false
      })
      return
    }
    if (this.data.cartInfo == null) {
      wx.showModal({
        title: '友情提示',
        content: '您的购物车为空，快去买点东西吧',
        showCancel: false
      })
      return
    }
    if (this.data.deliveryTime == null) {
      wx.showModal({
        title: '友情提示',
        content: '选择您的配送时间呦',
        showCancel: false
      })
      return
    }

    //提交数据
    WXAPI.orderCreate(postData).then(res => {
      console.log(res);

      if (res.code == 0) {
        that.setData({
          orderInfo: res.data
        })
        wx.showToast({
          title: '下单成功',
          icon: 'success'
        });
        that.pay();
      } else {
        wx.showModal({
          title: '出了点问题',
          content: res.msg,
          showCancel: false
        })
      }
    })
  },
  //拉取微信在线支付
  pay() {
    var that = this
    var orderId = this.data.orderInfo.id
    WXAPI.wxpay({
      token: wx.getStorageSync('token'),
      money: this.data.price,
      remark: "支付订单 ：" + this.data.orderInfo.id,
      payName: "支付订单 ：" + this.data.orderInfo.id,
      nextAction: {
        type: 0,
        id: this.data.orderInfo.id
      }
    }).then(res => {
      console.log(res);
      if (res.code == 2000) {
        console.log('重新登录');

        app.login();

      }
      if (res.code == 0) {
        // 小程序代码发起支付
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: 'prepay_id=' + res.data.prepayId,
          signType: res.data.signType,
          paySign: res.data.sign,
          fail: function(aaa) {
            wx.showToast({
              title: '支付失败'
            })
            wx.redirectTo({
              url: '../order-list/index'
            })
          },
          success: function() {
            WXAPI.orderPay(wx.getStorageSync('token'), orderId).then(res => {
              console.log(res);
            })
            // 提示支付成功
            wx.showToast({
              title: '支付成功'
            })
            wx.redirectTo({
              url: '../order-list/index'
            })
          }
        })

      } else {
        wx.showModal({
          title: '出错了',
          content: JSON.stringify(res),
          showCancel: false
        })
        wx.redirectTo({
          url: '../order-list/index'
        })
      }
    })
  },

  getGoodsJsonStr() {
    var cartList = this.data.cartInfo.data.items;
    var goodsJsonStr = "[";
    for (let i = 0; i < cartList.length; i++) {
      let carShopBean = cartList[i];
      var goodsJsonStrTmp = '';
      if (i > 0) {
        goodsJsonStrTmp = ",";
      }
      if (carShopBean.sku && carShopBean.sku.length > 0) {
        let propertyChildIds = ''
        carShopBean.sku.forEach(option => {
          propertyChildIds = propertyChildIds + ',' + option.optionId + ':' + option.optionValueId
        })
        carShopBean.propertyChildIds = propertyChildIds
      }
      goodsJsonStrTmp += '{"goodsId":' + carShopBean.goodsId + ',"number":' + carShopBean.number + ',"propertyChildIds":"' + carShopBean.propertyChildIds + '","logisticsType":0}';
      goodsJsonStr += goodsJsonStrTmp;
    }
    goodsJsonStr += "]";
    console.log(goodsJsonStr);
    this.setData({
      goodsJsonStr: goodsJsonStr
    })
    return goodsJsonStr
  },


  //时间模块辅助函数
  getNowTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    if (month < 10) {
      month = '0' + month;
    };
    if (day < 10) {
      day = '0' + day;
    };
    var formatDate = year + '-' + month + '-' + day;
    return formatDate;
  },

  getDateStr: function(today, addDayCount) {
    var dd;
    if (today) {
      dd = new Date(today);
    } else {
      dd = new Date();
    }
    dd.setDate(dd.getDate() + addDayCount); //获取AddDayCount天后的日期 
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1; //获取当前月份的日期 
    var d = dd.getDate();
    if (m < 10) {
      m = '0' + m;
    };
    if (d < 10) {
      d = '0' + d;
    };
    return y + "-" + m + "-" + d;
  },

})