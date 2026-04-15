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
    // 刷新数据
    this.setData({ page: 1, hasMore: true });
    this.loadNearbyOrders();
  },

  // 加载附近订单
  async loadNearbyOrders() {
    this.setData({ loading: true });

    try {
      const { page, pageSize, location } = this.data;
      
      // 获取附近订单
      const result = await mockData.mockGetNearbyOrders({
        latitude: location.latitude,
        longitude: location.longitude,
        radius: 3000,
        page,
        pageSize
      });

      const newOrders = result.list || [];
      const currentList = this.data.page === 1 ? [] : this.data.orderList;
      
      this.setData({
        orderList: [...currentList, ...newOrders],
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

  // 刷新
  onPullDownRefresh() {
    this.setData({ page: 1, hasMore: true });
    this.loadNearbyOrders();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 500);
  },

  // 加载更多
  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadNearbyOrders();
    }
  },

  // 获取位置
  async getLocation() {
    util.showLoading('获取位置中...');
    try {
      const location = await mockData.getCurrentLocation();
      this.setData({
        location
      });
      // 重新加载订单
      this.setData({ page: 1, hasMore: true });
      this.loadNearbyOrders();
    } catch (err) {
      util.showToastInfo('获取位置失败');
    } finally {
      util.hideLoading();
    }
  },

  // 接单
  async acceptOrder(e) {
    const { id } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '确认接单',
      content: '接单后需要在约定时间内完成服务，确定接单吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await mockData.mockAcceptOrder(id, app.globalData.userInfo.id);
            util.showToast('接单成功');
            // 刷新列表
            this.setData({ page: 1, hasMore: true });
            this.loadNearbyOrders();
          } catch (err) {
            util.showToastError('接单失败');
          }
        }
      }
    });
  },

  // 查看订单详情
  viewOrderDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/orderDetail/orderDetail?id=${id}`
    });
  },

  // 联系客户
  contactClient(e) {
    const { userId } = e.currentTarget.dataset;
    if (userId) {
      wx.navigateTo({
        url: `/pages/chat/chat?userId=${userId}`
      });
    }
  },

  // 返回
  goBack() {
    wx.navigateBack();
  }
});
