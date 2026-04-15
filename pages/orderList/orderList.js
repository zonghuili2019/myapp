// pages/orderList/orderList.js - 订单列表页
const app = getApp();
const util = require('../../utils/util');
const mockData = require('../../utils/mockData');

Page({
  data: {
    userType: 'client',
    status: '', // 筛选状态
    orderList: [],
    loading: true,
    hasMore: true,
    page: 1,
    pageSize: 10,
    total: 0
  },

  onLoad() {
    this.setData({
      userType: app.globalData.userType || 'client'
    });
    this.loadOrderList();
  },

  onShow() {
    this.setData({ page: 1, hasMore: true });
    this.loadOrderList();
  },

  // 加载订单列表
  async loadOrderList() {
    this.setData({ loading: true });

    try {
      const { userType, status, page, pageSize } = this.data;
      
      let result;
      
      if (userType === 'client') {
        result = await mockData.mockGetOrderList({ status, page, pageSize });
      } else {
        result = await mockData.mockGetMerchantOrders({ status, page, pageSize });
      }

      const newOrders = result.list || [];
      const currentList = this.data.page === 1 ? [] : this.data.orderList;
      
      this.setData({
        orderList: [...currentList, ...newOrders],
        hasMore: newOrders.length >= pageSize,
        total: result.total,
        page: page + 1
      });

    } catch (err) {
      console.error('加载订单失败', err);
      util.showToastInfo('加载失败，请重试');
    } finally {
      this.setData({ loading: false });
    }
  },

  // 筛选状态
  filterByStatus(e) {
    const status = e.currentTarget.dataset.status;
    this.setData({ 
      status, 
      page: 1, 
      hasMore: true,
      orderList: []
    });
    this.loadOrderList();
  },

  // 刷新
  onPullDownRefresh() {
    this.setData({ page: 1, hasMore: true, status: '' });
    this.loadOrderList();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 500);
  },

  // 加载更多
  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadOrderList();
    }
  },

  // 查看订单详情
  viewOrderDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/orderDetail/orderDetail?id=${id}`
    });
  },

  // 联系对方
  contactOther(e) {
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
