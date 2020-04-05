var app = getApp()
var Bmob = require('../../utils/Bmob-2.2.2.min.js');

Page({
  data: {
    userInfo: app.globalData.userInfo,
    hasUserInfo: app.globalData.isHasNickNam,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
 
  },

  //获取用户信息，代表用户没有授权，所以要请求授权，并且将得到的信息赋值给全局标量，再上传到服务器
  getUserInfo:function(){
    wx.getUserInfo(
      ({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
          if(app.globalData.userId != ""){
            //如果登录成功，有userId的情况下，将用户信息上传到服务器
            const queryUser = Bmob.Query('member');
            console.log(app.globalData.userInfo);
            queryUser.get(app.globalData.userId).then(res=>{
              res.set('name', app.globalData.userInfo.nickName);
              res.set('sex', app.globalData.userInfo.gender);
              res.set('province', app.globalData.userInfo.province);
              res.set('city', app.globalData.userInfo.city);
              res.set('avatarUrl', app.globalData.userInfo.avatarUrl);
              res.save();
              console.log('提交成功');
            }).catch(err=>{
              console.log(err);
            })

            ;
          }else{
            console.log('登录出现问题，重新登录');
            app.login(app.globalData.queryUser);
          }
        },
        fail:res =>{
          console.log('获取用户信息失败，可能是用户不同意共享信息，或者是网络出了问题')
        }
      })
    );
  },
  toAddress:function(){
    wx.navigateTo({
      url: '../userInfo/userInfo',
    })
  },
  //事件处理函数
  toOrder: function () {
    wx.navigateTo({
      url: '../order/order'
    })
  },
  onLoad: function () {
    console.log( '是否已经有个人信息'+app.globalData.isHasNickNam)
    this.setData({
      hasUserInfo: app.globalData.isHasNickNam,
    })
  
  },
  onShow:function(){
    this.setData({
      userInfo: app.globalData.userInfo,
    })
  }
})