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

  async loadMerchantInfo() {
    this.setData({ loading: true });

    try {
      const currentMerchant = app.globalData.userInfo;
      const merchants = mockData.getMockMerchants();
      const merchant = merchants.find((item) => currentMerchant && item.id === currentMerchant.id) || currentMerchant || merchants[0];
      const orders = mockData.getMockOrders().filter((order) => !merchant || !merchant.id || order.merchantId === merchant.id);
      const totalOrders = orders.length;
      const pendingOrders = orders.filter((order) => ['accepted', 'processing'].includes(order.status)).length;
      const completedOrders = orders.filter((order) => order.status === 'completed').length;
      const totalRevenue = orders
        .filter((order) => order.status === 'completed')
        .reduce((sum, order) => sum + order.price, 0);

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

  editMerchantInfo() {
    wx.navigateTo({
      url: '/pages/register/register?type=merchant'
    });
  },

  viewNearbyOrders() {
    wx.navigateTo({
      url: '/pages/merchantOrders/merchantOrders'
    });
  },

  viewAllOrders() {
    wx.switchTab({
      url: '/pages/orderList/orderList'
    });
  },

  goToChat() {
    const merchantInfo = this.data.merchantInfo || app.globalData.userInfo;
    const order = mockData.getMockOrders().find((item) => merchantInfo && item.merchantId === merchantInfo.id) || mockData.getMockOrders().find((item) => item.clientId);

    if (!order) {
      util.showToastInfo('暂无可联系的客户');
      return;
    }

    const merchantId = (merchantInfo && merchantInfo.id) || order.merchantId || 'merchant_001';
    wx.navigateTo({
      url: `/pages/chat/chat?userId=${order.clientId}&merchantId=${merchantId}`
    });
  },

  contactService() {
    wx.showModal({
      title: '联系我们',
      content: '客服微信：local_service_admin\n客服电话：400-xxx-xxxx',
      showCancel: false
    });
  },

  makePhoneCall() {
    if (this.data.merchantInfo && this.data.merchantInfo.phone) {
      util.makePhoneCall(this.data.merchantInfo.phone);
    }
  },

  openLocation() {
    if (this.data.merchantInfo && this.data.merchantInfo.location) {
      util.openLocation(
        this.data.merchantInfo.location.latitude,
        this.data.merchantInfo.location.longitude,
        this.data.merchantInfo.name
      );
    }
  },

  goBack() {
    wx.navigateBack();
  }
});
