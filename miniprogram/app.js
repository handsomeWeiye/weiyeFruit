//app.js
App({


  onLaunch: function() {

    var that = this


    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    //bmob初始化模块
    var Bmob = require('utils/Bmob-2.2.2.min.js');
    Bmob.initialize('7b9a591c3684f7ac', '410423');
    const queryUser = Bmob.Query('member');
    that.queryUser = queryUser;

    that.login(queryUser);

  },

  //全局变量监听，动态刷新
  // 这里这么写，是要在其他界面监听，而不是在app.js中监听，而且这个监听方法，需要一个回调方法。
  // watch: function (method) {
  //   var obj = this.globalData;
  //   Object.defineProperty(obj, "carts", {
  //     configurable: true,
  //     enumerable: true,
  //     set: function (value) {
  //       method(value);
  //     },
  //     get: function () {
  //       // 可以在这里打印一些东西，然后在其他界面调用getApp().globalData.name的时候，这里就会执行。
  //       console.log(this.carts);
  //       return this.carts;
  //     }
  //   })
  // },


  //用户登录模块
  login: function(queryUser) {

    var that = this;


    // 登录
    wx.login({
      success: res => {
        console.info(res.code);
        wx.cloud.callFunction({
          name: 'getUserId',
          data: {
            code: res.code
          }
        }).then(
          res => {
            console.info(res);
            var openId = res.result['event']['userInfo']['openId'];
            console.info(openId);
            queryUser.equalTo('openId', "==", openId);
            queryUser.find().then(
              (res) => {
                if (res.length == 0) {
                  //如果此前没有记录，那么就创建用户，并且将userId赋值
                  queryUser.set('openId', openId);
                  queryUser.save().then(
                    res => {
                      console.log(res)
                      that.globalData.userId = res['objectId'];
                      console.log(that.globalData.userId)
                    }
                  ).catch(err => {
                    console.log(err);
                  })
                } else {
                  //如果此前有记录的，那么直接取第一个，因为openid只有一个，并且将userId赋值
                  //并且尝试获取address，phone和nickNam信息,如果phone有信息，代表用户授权过电话号，如果nickname有信息，代表用户授权过个人信息
                  var userId = res[0]['objectId'];
                  that.globalData.userId = userId;
                  queryUser.get(userId).then(
                    res => {
                      console.log(res);
                      if (res.name != "") {
                        //代表用户已经授权果个人信息的获取，否则服务器中不可能会有该信息
                        //拥有该授权的情况下，获取个人信息,并将其赋给全局变量
                        that.globalData.isHasNickNam = true;
                        wx.getUserInfo({
                          success: res => {
                            that.globalData.userInfo = res.userInfo;
                          }

                        })
                      }
                      if (res.phone != "") {
                        that.globalData.isHasPhone = true;

                      }
                      if (res.address != "") {
                        that.globalData.isHasAddresss = true;

                      }
                      console.log(that.globalData.isHasNickNam);
                      console.log(that.globalData.isHasPhone);
                      console.log(that.globalData.isHasAddresss);
                    }
                  )

                  console.log(that.globalData.userId);
                }
              }
            )
          }
        )
      }
    })

  },

  onHide: function() {
    this.saveCarts();
  },

  //获取carts持久化数据模块
  getCarts: function() {
    var that = this;
    wx.getStorage({
      key: "carts",
      success: (res) => {
        console.log(res);
        that.globalData.carts = res.data;
      },
      fail: (res) => {
        console.log(res);
        that.globalData.carts = [];
      }
    });
    console.log(that.globalData.carts);
  },

  //保存carts持久化数据模块
  saveCarts: function() {
    wx.setStorageSync("carts", Array.from(this.globalData.carts));
  },

  //add模块，添加商品到购物车
  addCarts: function(parm) {
    console.log('购物车添加');
    if (this.globalData.carts.length == 0) {
      //如果carts是空的，那么就直接添加
      //首先要制作一个数据模型
      var cartItem = {
        "name": parm.target.dataset.item.name,
        "image": parm.target.dataset.item.image,
        "num": 1,
        "originPrice": parm.target.dataset.item.originPrice,
        "price": parm.target.dataset.item.price,
        "objectId": parm.target.dataset.item.objectId,
        'isLimit': parm.target.dataset.item.isLimit,
        'isSeleted': true
      }
      //添加到carts并且计算总价
      this.globalData.carts.push(cartItem);
      console.log('首个商品添加已成功');
      console.log(this.globalData.carts);
      this.countTotal();
      wx.showToast({
        title: '添加成功',
      })
    } else {
      //如果不是空的，那么就要进行判断，如果其中没有，那么也去添加，如果有的话，就要就要将数量增加一
      for (let i = 0; i < this.globalData.carts.length; i++) {
        //遍历循环，如果新添加的商品的ID同cart中存在着ID相等，说明这个东西已经被添加过了，只是要增加一个数量
        if (this.globalData.carts[i]['objectId'] == parm.target.dataset.item.objectId) {
          this.globalData.carts[i].num = this.globalData.carts[i].num + 1;
          this.countTotal();
          console.log('该商品被再次添加');
          console.log('目前的该商品的数量为' + this.globalData.carts[i].num);
          console.log(this.globalData.carts);
          wx.showToast({
            title: '添加成功',
          })
          return null;
        }
      }
      //carts列表中不能存在相同的东西，那么就添加
      var cartItem = {
        "name": parm.target.dataset.item.name,
        "image": parm.target.dataset.item.image,
        "num": 1,
        "originPrice": parm.target.dataset.item.originPrice,
        "price": parm.target.dataset.item.price,
        "objectId": parm.target.dataset.item.objectId,
        'isLimit': parm.target.dataset.item.isLimit,
        'isSeleted': true
      }
      this.globalData.carts.push(cartItem);
      console.log(this.globalData.carts);
      this.countTotal();
      wx.showToast({
        title: '添加成功',
      })
    }
  },

  //remove模块，从购物车中删除商品
  removeCarts:function(parm){
    for (let i = 0; i < this.globalData.carts.length; i++) {
      //遍历循环，如果找到ID相同的商品，那么就删除，提示删除成功，重新计算总价，并且退出循环
      if (this.globalData.carts[i]['objectId'] == parm.target.dataset.item.objectId) {
        //找到相同项，开始删除
        this.globalData.carts.splice(i,1);
        console.log(this.globalData.carts);
        //提示成功
        wx.showToast({
          title: '删除成功',
        });
        //重新计算总价
        this.countTotal();
        return null;        
      }}
  },


  //count模块，用户计算carts中被选中的商品的总价格，总原价，总数量，并且赋值到全局变量
  countTotal: function() {
    //清空原有的数据
    this.globalData.totalMoney = 0;
    this.globalData.totalOriginMoney = 0;
    this.globalData.totalNum = 0;
    //开始循环计算
    for (var i = 0; i < this.globalData.carts.length; i++) {
      var isSeleted = this.globalData.carts[i].isSeleted;
      if (isSeleted) {
        this.globalData.totalMoney = this.globalData.totalMoney + (this.globalData.carts[i].num * this.globalData.carts[i].price);
        this.globalData.totalOriginMoney = this.globalData.totalOriginMoney + (this.globalData.carts[i].num * this.globalData.carts[i].originPrice);
        this.globalData.totalNum = this.globalData.totalNum + this.globalData.carts[i].num;
      }
    }
    //开始保留后两位小数点
    this.globalData.totalMoney = parseFloat(this.globalData.totalMoney).toFixed(2);
    this.globalData.totalOriginMoney = parseFloat(this.globalData.totalOriginMoney).toFixed(2);
    //计算结束打印到桌面
    console.log(this.globalData.totalMoney);
    console.log(this.globalData.totalOriginMoney);
    console.log(this.globalData.totalNum);
  },



  // watch:function(method){
  //   var obj = this.globalData;
  //   Object.defineProperty(obj,"name",{
  //     configurable:true,
  //     enumerable:true,
  //     set:function(value){
  //       //给这个属性设置值的时候触发的函数
  //       //把新设置的值赋给了私有变量_name(也许是个存放器)
  //       this._name = value;
  //       console.log('是否会被执行')
  //       //执行一个回调方法（函数中再调用函数）当这个属性被赋新值的时候就会执行这个函数
  //       method(value);
  //     },

  //     get: function () {
  //       //可以在这里打印一些东西，然后在其他界面调用getApp().globalData.name的时候，这里就会执行。
  //       //当获取值的时候触发的函数
  //       //取值的时候返回的是这个私有变量
  //       console.log(this._name);
  //       return this._name
  //     }

  //   })
  // },

  globalData: {
    totalMoney: null,
    totalOriginMoney: null,
    totalNum: null,
    userId: null,
    userInfo: null,
    queryUser: null,
    isHasAddresss: false,
    isHasPhone: false,
    isHasNickNam: false,
    carts: [],
  },

})