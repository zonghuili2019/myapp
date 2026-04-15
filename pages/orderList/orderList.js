// pages/orderList/orderList.js - 订单列表页
const app = getApp();
const util = require('../../utils/util');
const mockData = require('../../utils/mockData');

const STATUS_TEXT_MAP = {
  pending: '待接单',
  accepted: '已接单',
  processing: '服务中',
  completed: '已完成',
  cancelled: '已取消'
};

function formatOrders(orderList) {
  return (orderList || []).map((order) => ({
    ...order,
    statusText: STATUS_TEXT_MAP[order.status] || '未知状态'
  }));
}

Page({
  data: {
    userType: 'client',
    status: '',
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
    this.setData({ page: 1, hasMore: true, orderList: [] });
    this.loadOrderList();
  },

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

      const newOrders = formatOrders(result.list || []);
      const currentList = page === 1 ? [] : this.data.orderList;

      this.setData({
        orderList: currentList.concat(newOrders),
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

  onPullDownRefresh() {
    this.setData({ page: 1, hasMore: true, status: '', orderList: [] });
    this.loadOrderList();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 500);
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadOrderList();
    }
  },

  viewOrderDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/orderDetail/orderDetail?id=${id}`
    });
  },

  contactOther(e) {
    const { userId, merchantId } = e.currentTarget.dataset;
    const resolvedMerchantId = merchantId || (app.globalData.userInfo && app.globalData.userInfo.id);

    if (!userId || !resolvedMerchantId) {
      util.showToastInfo('当前暂无可用会话');
      return;
    }

    wx.navigateTo({
      url: `/pages/chat/chat?userId=${userId}&merchantId=${resolvedMerchantId}`
    });
  },

  goBack() {
    wx.navigateBack();
  }
});
