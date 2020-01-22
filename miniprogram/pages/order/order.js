var app = getApp()
var Bmob = require('../../utils/Bmob-2.2.2.min.js');
var util = require('../../utils/util.js');
// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    isHasInfo: false,
    carts: app.globalData.carts,
    totalMoney: app.globalData.totalMoney,
    totalNum: app.globalData.totalNum,
    totalOriginMoney: app.globalData.totalOriginMoney,
    discount: null,
    multiArray: [
    ],
    packageCost:null,
    multiIndex:null,
    deliveryTime:null,
    isHasTime:false,

    show: false,
    actions:[],

    tableWareNum:[1,2,3],
  },


  addUserInfo: function() {
    wx.navigateTo({
      url: '../userInfo/userInfo',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var nowDay = this.getNowTime();
    var tomorrow = this.getDateStr(nowDay,1);
    var afterTomorrow  =this.getDateStr(nowDay,2);
    this.setData({
      carts: app.globalData.carts,
      totalMoney: app.globalData.totalMoney,
      totalNum: app.globalData.totalNum,
      totalOriginMoney: app.globalData.totalOriginMoney,
      packageCost: this.getPackageCost(app.globalData.totalNum),
      multiArray: [[nowDay, tomorrow, afterTomorrow],['9:00-11:00', '14:00-16:00', '18:00-20:00',]]
    });

    this.getDiscount();
    var query = Bmob.Query('member');
    var userId = app.globalData.userId;
    console.log(userId);
    query.equalTo('objectId', "==", userId);
    query.find().then(res => {
      console.log(res);
      if (res.length == 0) {
        wx.showToast({
          title: '没有该用户',
        })
      } else {
        if (res[0].address == '' ? false : true && res[0].name == '' ? false : true && res[0].phone == '' ? false : true) {
          this.setData({
            isHasInfo: true,
            userInfo: res[0],
          })
        } else {
          console.log(app.globalData.isHasAddresss);
          console.log(app.globalData.isHasPhone);
          console.log(app.globalData.isHasNickNam);
          wx.showToast({
            title: '请完善配送信息',
          });
          this.setData({
            isHasInfo: false,
          })
        }
      }
    });
  },

  getNowTime:function (){
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    if(month < 10) {
      month = '0' + month;
    };
    if(day < 10) {
      day = '0' + day;
    };
    //  如果需要时分秒，就放开
    // var h = now.getHours();
    // var m = now.getMinutes();
    // var s = now.getSeconds();
    var formatDate = year + '-' + month + '-' + day;
    return formatDate;
  } ,

   getDateStr:function(today, addDayCount) {
    var dd;
    if(today) {
      dd = new Date(today);
    }else{
      dd = new Date();
    }
  dd.setDate(dd.getDate() + addDayCount);//获取AddDayCount天后的日期 
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期 
    var d = dd.getDate();
    if(m < 10) {
      m = '0' + m;
    };
    if(d < 10) {
      d = '0' + d;
    };
    return y + "-" + m + "-" + d;
  },

  getPackageCost:function(totalNum){
    if(totalNum>2){
      if(totalNum>5){
        return 4
      }else{
        return 2
      }
    }else{
      return 1;
    }
  },

  // getdiscount:function(){
  //   var discount = 
  // },

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

  bindMultiPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var index = e.detail.value
    var floor = this.data.multiArray[0][index[0]] + '-' + this.data.multiArray[1][index[1]] ;
    console.log('picker发送选择改变，携带值为', floor);
    this.setData({
      isHasTime: true,
      multiIndex: e.detail.value,
      deliveryTime: floor
    })
  },



  getDiscount: function() {
    var actions = [];
    var query  = Bmob.Query('discount');
    query.equalTo('memberId', "==",app.globalData.userId);
    query.find().then(res=>{
      console.log(res);
      res.forEach(item=>{
        var actionItem = {
          'name':item.name,
          'subname':item.money,
        }
        actions.push(actionItem);
      })
      this.setData({
        actions:actions,
      })
    })

  },

  onOpen(){
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },

  onSelect(event) {
    console.log(event.detail);
    this.setData({
      discount:event.detail.subname
    })
    wx.showToast({
      title: '选择成功',
    })
    this.onClose()
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