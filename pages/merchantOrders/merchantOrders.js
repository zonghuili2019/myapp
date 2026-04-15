// pages/merchantOrders/merchantOrders.js - 商家订单页（附近订单）
const app = getApp();
const util = require('../../utils/util');
const mockData = require('../../utils/mockData');

Page({
  data: {
    orderList: [],
    loading: true,
    hasMore: true,
    page: 1,
    pageSize: 10,
    location: {
      latitude: 22.5431,
      longitude: 114.0579
    }
  },

  onLoad() {
    this.loadNearbyOrders();
  },

  onShow() {
    this.setData({ page: 1, hasMore: true, orderList: [] });
    this.loadNearbyOrders();
  },

  async loadNearbyOrders() {
    this.setData({ loading: true });

    try {
      const { page, pageSize, location } = this.data;
      const result = await mockData.mockGetNearbyOrders({
        latitude: location.latitude,
        longitude: location.longitude,
        radius: 3000,
        page,
        pageSize
      });

      const newOrders = result.list || [];
      const currentList = page === 1 ? [] : this.data.orderList;

      this.setData({
        orderList: currentList.concat(newOrders),
        hasMore: newOrders.length >= pageSize,
        page: page + 1
      });
    } catch (err) {
      console.error('加载订单失败', err);
      util.showToastInfo('加载失败，请重试');
    } finally {
      this.setData({ loading: false });
    }
  },

  onPullDownRefresh() {
    this.setData({ page: 1, hasMore: true, orderList: [] });
    this.loadNearbyOrders();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 500);
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadNearbyOrders();
    }
  },

  async getLocation() {
    util.showLoading('获取位置中...');
    try {
      const location = await mockData.getCurrentLocation();
      this.setData({ location, page: 1, hasMore: true, orderList: [] });
      this.loadNearbyOrders();
    } catch (err) {
      util.showToastInfo('获取位置失败');
    } finally {
      util.hideLoading();
    }
  },

  acceptOrder(e) {
    const { id } = e.currentTarget.dataset;
    const currentMerchant = app.globalData.userInfo;

    if (!currentMerchant || !currentMerchant.id) {
      util.showToastInfo('请先登录商家账号');
      return;
    }

    wx.showModal({
      title: '确认接单',
      content: '接单后需要在约定时间内完成服务，确定接单吗？',
      success: async (res) => {
        if (!res.confirm) {
          return;
        }

        try {
          await mockData.mockAcceptOrder(id, currentMerchant.id);
          util.showToast('接单成功');
          this.setData({ page: 1, hasMore: true, orderList: [] });
          this.loadNearbyOrders();
        } catch (err) {
          util.showToastError('接单失败');
        }
      }
    });
  },

  viewOrderDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/orderDetail/orderDetail?id=${id}`
    });
  },

  contactClient(e) {
    const { userId } = e.currentTarget.dataset;
    const merchantId = app.globalData.userInfo && app.globalData.userInfo.id;

    if (!userId || !merchantId) {
      util.showToastInfo('当前暂无可用会话');
      return;
    }

    wx.navigateTo({
      url: `/pages/chat/chat?userId=${userId}&merchantId=${merchantId}`
    });
  },

  goBack() {
    wx.navigateBack();
  }
});
