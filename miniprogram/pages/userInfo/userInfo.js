var app = getApp()
const WXAPI = require('apifm-wxapi')
WXAPI.init('weiye')

// pages/userInfo/userInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: null,
    phone: null,
    room: null,
    floor: null,
    provinceId:510000000000,
    cityId:510100000000,
    isHasInfo: false,
    multiArray: [
      ['成大二期A区', '成大二期B区', '成大二期C区'],
      ['1栋', '2栋', '3栋', '4栋', '5栋', '6栋', '7栋', '8栋', '9栋', '10栋', '11栋', '12栋', '13栋', '14栋', '15栋'],
      ['一单元', '二单元', '三单元', '四单元']
    ],
  },

  bindMultiPickerChange: function(e) {
    console.log('选择的index为', e.detail.value)
    var index = e.detail.value
    var floor = this.data.multiArray[0][index[0]] + this.data.multiArray[1][index[1]] + this.data.multiArray[2][index[2]];
    console.log('目前选择的楼层为', floor);
    this.setData({
      isHasInfo: true,
      multiIndex: e.detail.value,
      floor: floor
    })
  },

  addName: function(e) {
    console.log(e.detail.value);
    this.setData({
      name: e.detail.value
    })
  },
  addPhone: function(e) {
    console.log(e.detail.value);
    this.setData({
      phone: e.detail.value
    })
  },
  addRoom: function(e) {
    console.log(e.detail.value);
    this.setData({
      room: e.detail.value
    })
   
  },
  confirm: function() {
    if (this.data.name != null && this.data.phone != null && this.data.floor != null && this.data.room != null) {
      // 准备需要提交的数据
      var linkMan = this.data.name;
      var mobile = this.data.phone
      var address = this.data.floor + this.data.room 
      var provinceId = this.data.provinceId
      var cityId = this.data.cityId
      var token = wx.getStorageSync('token');

      //进行提交
      WXAPI.addAddress({
        token:token,
        provinceId:provinceId,
        cityId:cityId,
        linkMan:linkMan,
        mobile:mobile,
        address:address,
      }).then(res=>{
        console.log(res);
        if(res.code ==0){
          wx.showToast({
            title:'添加成功',
            icon:'success'
          });
          wx.navigateTo({
            url: '../order/order',
          });
        }else{
          wx.showToast({
            title:res.msg,
            icon:'none'
          })
        }
      })
    }else{
      wx.showToast({
        title: '配送信息不完整呦',
        icon:'none',
        duration: 2000
      })
    }

  },

  onLoad: function(options) {

  },


})