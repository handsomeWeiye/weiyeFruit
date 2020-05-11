const app = getApp()
const WXAPI = require('apifm-wxapi')


Page({
	data: {
		statusType: ["待付款", "待发货", "待收货", "待评价", "已完成"],
		hasRefund: false,
		currentType: 0,
		tabClass: ["", "", "", "", ""]
	},
	onShareAppMessage(options){

	},
	copyOrderNumber(e){
		wx.setClipboardData({
			data:e.currentTarget.dataset.num,
			success() {
				wx.showToast({
					title:"复制成功",
					icon:"success"
				})
			}
		})
	},
	statusTap: function(e) {
		const curType = e.currentTarget.dataset.index;
		this.data.currentType = curType
		this.setData({
			currentType: curType
		});
		this.doneShow();
	},
	cancelOrderTap: function(e) {
		const that = this;
		const orderId = e.currentTarget.dataset.id;
		wx.showModal({
			title: '确定要取消该订单吗？',
			content: '',
			success: function(res) {
				if (res.confirm) {
					WXAPI.orderClose(wx.getStorageSync('token'), orderId).then(function(res) {
						if (res.code == 0) {
							that.doneShow();
						}
					})
				}
			}
		})
	},
	onShow(){
		this.doneShow();
	},
	onLoad: function(options) {
		if (options && options.type) {
			if (options.type == 99) {
				this.setData({
					hasRefund: true,
					currentType: options.type
				});
			} else {
				this.setData({
					hasRefund: false,
					currentType: options.type
				});
			}
		}
	},
	getOrderStatistics: function() {
		var that = this;
		WXAPI.orderStatistics(wx.getStorageSync('token')).then(function(res) {
			console.log(res);
			
			if (res.code == 0) {
				var tabClass = that.data.tabClass;
				if (res.data.count_id_no_pay > 0) {
					tabClass[0] = "red-dot"
				} else {
					tabClass[0] = ""
				}
				if (res.data.count_id_no_transfer > 0) {
					tabClass[1] = "red-dot"
				} else {
					tabClass[1] = ""
				}
				if (res.data.count_id_no_confirm > 0) {
					tabClass[2] = "red-dot"
				} else {
					tabClass[2] = ""
				}
				if (res.data.count_id_no_reputation > 0) {
					tabClass[3] = "red-dot"
				} else {
					tabClass[3] = ""
				}
				if (res.data.count_id_success > 0) {
					//tabClass[4] = "red-dot"
				} else {
					//tabClass[4] = ""
				}

				that.setData({
					tabClass: tabClass,
				});
			}
		})
	},
	doneShow: function() {
		// 获取订单列表
		console.log('done')
		let that = this;
		let postData = {
			token: wx.getStorageSync('token')
		};
		postData.status = that.data.currentType;
		this.getOrderStatistics();
		WXAPI.orderList(postData).then(function(res) {
			if (res.code == 0) {
				that.setData({
					orderList: res.data.orderList,
					logisticsMap: res.data.logisticsMap,
					goodsMap: res.data.goodsMap
				});
			} else {
				that.setData({
					orderList: null,
					logisticsMap: {},
					goodsMap: {}
				});
			}
		})
	},
	  //拉取微信在线支付
	  toPayTap(e){
		var that = this
		console.log( e);
		console.log( e.currentTarget.dataset.id);
		var orderId = e.currentTarget.dataset.id
		WXAPI.wxpay({
		  token: wx.getStorageSync('token'),
		  money: e.currentTarget.dataset.money,
		  remark: "支付订单 ：" + e.currentTarget.dataset.id,
		  payName: "支付订单 ：" + e.currentTarget.dataset.id,
		  nextAction: {
			type: 0,
			id: e.currentTarget.dataset.id
		  }
		}).then( res=> {
		  console.log(res);
		  if (res.code == 0) {
			// 小程序代码发起支付
			wx.requestPayment({
			  timeStamp: res.data.timeStamp,
			  nonceStr: res.data.nonceStr,
			  package: 'prepay_id=' + res.data.prepayId,
			  signType:  res.data.signType,
			  paySign: res.data.sign,
			  fail: function (aaa) {
				wx.showToast({
				  title: '支付失败' 
				})
			  },
			  success: function () {
				// 提示支付成功
				wx.showToast({
				  title: '支付成功'
				})
				WXAPI.orderPay(wx.getStorageSync('token'), orderId).then(res=>{
					console.log(res);
				  })
				that.doneShow()
			  }
			})
		  }else {
			wx.showModal({
			  title: '出错了',
			  content: JSON.stringify(res),
			  showCancel: false
			})
			wx.redirectTo({
			  url:'../order-list/index'
			})
		  }
		})
	  },

})
