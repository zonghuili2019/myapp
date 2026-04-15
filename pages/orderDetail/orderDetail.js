// pages/orderDetail/orderDetail.js - 订单详情页
const app = getApp();
const util = require('../../utils/util');
const mockData = require('../../utils/mockData');

Page({
  data: {
    order: null,
    userType: 'client',
    loading: true,
    showCancelDialog: false,
    showCompleteDialog: false
  },

  onLoad(options) {
    const { id } = options;
    this.setData({
      userType: app.globalData.userType || 'client'
    });
    this.loadOrderDetail(id);
  },

  // 加载订单详情
  async loadOrderDetail(orderId) {
    this.setData({ loading: true });

    try {
      const order = await mockData.mockGetOrderDetail(orderId);
      this.setData({ order });
    } catch (err) {
      console.error('加载订单详情失败', err);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } finally {
      this.setData({ loading: false });
    }
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

  // 拨打电话
  makePhoneCall(e) {
    const { phone } = e.currentTarget.dataset;
    if (phone) {
      util.makePhoneCall(phone);
    }
  },

  // 打开位置
  openLocation(e) {
    const { lat, lng, address } = e.currentTarget.dataset;
    if (lat && lng) {
      util.openLocation(Number(lat), Number(lng), address);
    }
  },

  // 取消订单
  cancelOrder() {
    this.setData({ showCancelDialog: true });
  },

  // 确认取消
  async confirmCancel() {
    this.setData({ showCancelDialog: false });

    try {
      await mockData.mockCancelOrder(this.data.order.id);
      util.showToast('订单已取消');
      this.loadOrderDetail(this.data.order.id);
    } catch (err) {
      util.showToastError('取消失败');
    }
  },

  // 完成订单
  completeOrder() {
    this.setData({ showCompleteDialog: true });
  },

  // 确认完成
  async confirmComplete() {
    this.setData({ showCompleteDialog: false });

    try {
      await mockData.mockCompleteOrder(this.data.order.id);
      util.showToast('订单已完成');
      this.loadOrderDetail(this.data.order.id);
    } catch (err) {
      util.showToastError('操作失败');
    }
  },

  // 关闭弹窗
  closeDialog() {
    this.setData({
      showCancelDialog: false,
      showCompleteDialog: false
    });
  },

  // 返回
  goBack() {
    wx.navigateBack();
  }
});
