// pages/merchant/merchant.js - 商家中心页
const app = getApp();
const util = require('../../utils/util');
const mockData = require('../../utils/mockData');

Page({
  data: {
    merchantInfo: null,
    loading: true,
    stats: {
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      totalRevenue: 0
    }
  },

  onLoad() {
    this.loadMerchantInfo();
  },

  onShow() {
    this.loadMerchantInfo();
  },

  // 加载商家信息
  async loadMerchantInfo() {
    this.setData({ loading: true });

    try {
      // 获取商家信息
      const merchants = mockData.getMockMerchants();
      const merchant = merchants[0];
      
      // 获取订单统计
      const orders = mockData.getMockOrders();
      const totalOrders = orders.filter(o => o.merchantId).length;
      const pendingOrders = orders.filter(o => o.merchantId && o.status === 'accepted').length;
      const completedOrders = orders.filter(o => o.merchantId && o.status === 'completed').length;
      const totalRevenue = completedOrders * 2500;

      this.setData({
        merchantInfo: merchant,
        stats: {
          totalOrders,
          pendingOrders,
          completedOrders,
          totalRevenue
        }
      });
    } catch (err) {
      console.error('加载商家信息失败', err);
    } finally {
      this.setData({ loading: false });
    }
  },

  // 编辑商家信息
  editMerchantInfo() {
    wx.navigateTo({
      url: '/pages/register/register?type=merchant'
    });
  },

  // 查看附近订单
  viewNearbyOrders() {
    wx.navigateTo({
      url: '/pages/merchantOrders/merchantOrders'
    });
  },

  // 查看全部订单
  viewAllOrders() {
    wx.switchTab({
      url: '/pages/orderList/orderList'
    });
  },

  // 联系客服
  contactService() {
    wx.showModal({
      title: '联系我们',
      content: '客服微信：local_service_admin\n客服电话：400-xxx-xxxx',
      showCancel: false
    });
  },

  // 拨打手机号
  makePhoneCall() {
    if (this.data.merchantInfo && this.data.merchantInfo.phone) {
      util.makePhoneCall(this.data.merchantInfo.phone);
    }
  },

  // 打开位置
  openLocation() {
    if (this.data.merchantInfo && this.data.merchantInfo.location) {
      util.openLocation(
        this.data.merchantInfo.location.latitude,
        this.data.merchantInfo.location.longitude,
        this.data.merchantInfo.name
      );
    }
  },

  // 返回
  goBack() {
    wx.navigateBack();
  }
});
