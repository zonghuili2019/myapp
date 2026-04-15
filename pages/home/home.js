// pages/home/home.js - 首页
const app = getApp();
const util = require('../../utils/util');
const mockData = require('../../utils/mockData');

function buildChatUrl(order, fallbackMerchantId) {
  const currentUser = app.globalData.userInfo || {};
  const userId = (order && order.clientId) || currentUser.id || 'user_001';
  const merchantId = (order && order.merchantId) || fallbackMerchantId || 'merchant_001';
  return `/pages/chat/chat?userId=${userId}&merchantId=${merchantId}`;
}

Page({
  data: {
    userInfo: null,
    userType: 'client',
    bannerList: [],
    categoryList: [],
    orderList: [],
    showPostBtn: true,
    loading: true
  },

  onLoad() {
    this.initPage();
  },

  onShow() {
    this.initPage();
  },

  initPage() {
    const userInfo = app.globalData.userInfo;
    const userType = app.globalData.userType || 'client';

    this.setData({
      userInfo,
      userType,
      showPostBtn: userType === 'client'
    });

    this.loadMockData();
    this.refreshData();
  },

  loadMockData() {
    const banners = [
      {
        id: 1,
        image: 'https://picsum.photos/300/200?random=1',
        title: '优质服务，快速响应'
      },
      {
        id: 2,
        image: 'https://picsum.photos/300/200?random=2',
        title: '专业团队，品质保障'
      }
    ];

    const categories = [
      { id: 1, name: '跑腿代送', icon: '📦', color: '#07c160' },
      { id: 2, name: '代驾服务', icon: '🚗', color: '#576b95' },
      { id: 3, name: '家政服务', icon: '🧹', color: '#fa9d3b' },
      { id: 4, name: '维修服务', icon: '🔧', color: '#70a7e9' },
      { id: 5, name: '代办业务', icon: '📋', color: '#e46c6c' },
      { id: 6, name: '其他服务', icon: '✨', color: '#95a5a6' }
    ];

    this.setData({
      bannerList: banners,
      categoryList: categories
    });
  },

  async refreshData() {
    this.setData({ loading: true });

    try {
      const userType = app.globalData.userType || 'client';
      const currentUser = app.globalData.userInfo || {};
      const allOrders = mockData.getMockOrders();
      let orderList = [];

      if (userType === 'client') {
        orderList = allOrders.filter((order) => {
          const isCurrentUserOrder = !currentUser.id || order.clientId === currentUser.id;
          return isCurrentUserOrder && ['pending', 'accepted', 'processing'].includes(order.status);
        });
      } else {
        orderList = allOrders.filter((order) => order.status === 'pending');
      }

      this.setData({
        orderList: orderList.slice(0, 3),
        showPostBtn: userType === 'client'
      });
    } catch (err) {
      console.error('刷新数据失败', err);
    } finally {
      this.setData({ loading: false });
    }
  },

  onCategoryTap(e) {
    const { name } = e.currentTarget.dataset;
    util.showToastInfo(`选择了${name}`);
  },

  onBannerTap() {},

  onOrderTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/orderDetail/orderDetail?id=${id}`
    });
  },

  goToPost() {
    wx.navigateTo({
      url: '/pages/post/post'
    });
  },

  viewAllOrders() {
    wx.switchTab({
      url: '/pages/orderList/orderList'
    });
  },

  goToProfile() {
    wx.switchTab({
      url: '/pages/profile/profile'
    });
  },

  goToChat() {
    const userType = app.globalData.userType || 'client';
    const currentUser = app.globalData.userInfo || {};
    const orders = mockData.getMockOrders();
    let targetOrder;

    if (userType === 'client') {
      targetOrder = orders.find((order) => order.clientId === currentUser.id && order.merchantId) || orders.find((order) => order.merchantId);
    } else {
      targetOrder = orders.find((order) => order.merchantId === currentUser.id) || orders.find((order) => order.merchantId);
    }

    if (!targetOrder) {
      util.showToastInfo('暂无可用会话');
      return;
    }

    wx.navigateTo({
      url: buildChatUrl(targetOrder, currentUser.id)
    });
  },

  onPullDownRefresh() {
    this.refreshData();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 500);
  },

  onReachBottom() {},

  goToMerchant() {
    wx.navigateTo({
      url: '/pages/merchant/merchant'
    });
  }
});
