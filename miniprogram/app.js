//app.js
const WXAPI = require('apifm-wxapi')
WXAPI.init('weiye')

App({


  onLaunch: function () {
    this.login();
  },

  //用户登录
  login: function () {
    var that  = this
    // 尝试登录
    wx.login({
      success: function(res) {
        //首先获取code码
        const code = res.code;
        console.log(code);
        
        WXAPI.login_wx(code).then(function(res){
          if(res.code == 10000){
            //该用户没有注册，那么进行注册
            that.register();
          }else if(res.code == 0){
            //登录成功，保存token
            console.log(res)
            var token = res.data.token
            wx.setStorageSync('token', token)
            console.log('用户token以保存',token);
            
          }else{
            //否则用户登录失败
            console.log('用户登录失败');
            
          }
        })
      }
    })

  },

  //用户注册
  register(){
    wx.login({
      success:function(res){
        const code = res.code;
        WXAPI.register_simple({code:code}).then(res=>{
          console.log(res);
          if(res.code == 0){
            console.log('用户注册成功');
          }else{
            console.log('用户注册失败')
          };
          
        })
      }
    })
  },

  onHide: function () {
    this.saveCarts();
  },

  //获取carts持久化数据模块
  getCarts: function () {
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
  saveCarts: function () {
    wx.setStorageSync("carts", Array.from(this.globalData.carts));
  },

  //add模块，添加商品到购物车
  addCarts: function (parm) {
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
  removeCarts: function (parm) {
    for (let i = 0; i < this.globalData.carts.length; i++) {
      //遍历循环，如果找到ID相同的商品，那么就删除，提示删除成功，重新计算总价，并且退出循环
      if (this.globalData.carts[i]['objectId'] == parm.target.dataset.item.objectId) {
        //找到相同项，开始删除
        this.globalData.carts.splice(i, 1);
        console.log(this.globalData.carts);
        //提示成功
        wx.showToast({
          title: '删除成功',
        });
        //重新计算总价
        this.countTotal();
        return null;
      }
    }
  },


  //count模块，用户计算carts中被选中的商品的总价格，总原价，总数量，并且赋值到全局变量
  countTotal: function () {
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

    //主题控制
    globalBGColor: '#00afb4',
    bgRed: 0,
    bgGreen: 175,
    bgBlue: 180,

  },

})