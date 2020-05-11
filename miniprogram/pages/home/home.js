var app = getApp()
const WXAPI = require('apifm-wxapi')
WXAPI.init('weiye')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    //公告栏设置
    noticeList: [],//公告列表
    noticeLastOne: {},//最新公告


    // 图片轮播设置
    indicatorDots: true, //设置是否显示面板指示点
    autoplay: true, //设置是否自动切换
    interval: 3000, //设置自动切换时间间隔,3s
    duration: 1000, //  设置滑动动画时长1s

    // 轮播图片数据
    banners: [],

    //推荐分割栏图片
    recommendTitlePicStr: '',

    //商品与推荐商品列表
    goods: [],
    recommendGoods: [],


  },

  //加载中
  onLoad: function (options) {
    this.getNotice();
    this.getBanner();
    this.getRecommendTitlePicStr();
    this.getGoods();
    this.getRecommondGoods();
  },

  //获取公告数据
  getNotice() {
    // 读取最新的一条公告
    WXAPI.noticeLastOne().then(res => {
      console.log('最新的一条公告：', res.data);
      this.setData({
        noticeLastOne: res.data,
      })
    })

    // 读取公告列表
    WXAPI.noticeList().then(res => {
      console.log('公告列表数据：', res.data.dataList)
      this.setData({
        noticeList: res.data.dataList,
      })
    })

  },

  //获取banner数据
  getBanner() {
    //读取banner图片
    WXAPI.banners().then(res => {
      if (res.code == 0) {
        console.log('banner数据：', res.data)
        this.setData({
          banners: res.data
        })
      }
    })
  },

  //获取商品推荐分割图片
  getRecommendTitlePicStr() {
    WXAPI.queryConfigValue('finderRecommendTtile').then(res => {
      if (res.code == 0) {
        console.log('商品推荐图片：', res.data)
        this.setData({
          recommendTitlePicStr: res.data
        })
      }
    })
  },

  //获取商品列表数据
  getGoods() {
    WXAPI.goods().then(res => {
      if (res.code == 0) {
        console.log('商品列表：', res.data)
        this.setData({
          goods: res.data
        })
      }
    })
  },

  //获取推荐商品列表
  getRecommondGoods() {
    WXAPI.goods().then(res => {
      if (res.code == 0) {

        let goods = res.data;
        var recommendGoods = []
        goods.forEach(element => {
          if (element.recommendStatus == 1) {
            recommendGoods.push(element)
          }
        });
        this.setData({
          recommendGoods: recommendGoods
        })
        console.log('商品推荐列表', recommendGoods)
      }
    })
  },
  onShareAppMessage(options){

  },
  //跳转到详情页面
  toDetail(e) {
    console.log(e)
    wx.navigateTo({
      url: "/pages/detail/detail?id=" + e.currentTarget.dataset.id +'&'+ "price=" + e.currentTarget.dataset.minprice 
    })
  },
  //跳转到公告页面
  toNotice(e) {
    console.log(e)
    wx.navigateTo({
      url: "/pages/notice/show?id=" + e.currentTarget.dataset.id
    })
  },
})