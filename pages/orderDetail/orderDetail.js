// pages/orderDetail/orderDetail.js - 订单详情页
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

Page({
  data: {
    order: null,
    merchantInfo: null,
    userType: 'client',
    loading: true
  },

  onLoad(options) {
    const { id } = options;
    this.setData({
      userType: app.globalData.userType || 'client'
    });
    this.loadOrderDetail(id);
  },

  async loadOrderDetail(orderId) {
    this.setData({ loading: true });

    try {
      const order = await mockData.mockGetOrderDetail(orderId);
      const merchantInfo = order.merchantId
        ? await mockData.mockGetMerchantInfo(order.merchantId)
        : null;

      this.setData({
        order: {
          ...order,
          statusText: STATUS_TEXT_MAP[order.status] || '未知状态'
        },
        merchantInfo
      });
    } catch (err) {
      console.error('加载订单详情失败', err);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 800);
    } finally {
      this.setData({ loading: false });
    }
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

  makePhoneCall(e) {
    const { phone } = e.currentTarget.dataset;
    if (phone) {
      util.makePhoneCall(phone);
    }
  },

  openLocation(e) {
    const { lat, lng, address } = e.currentTarget.dataset;
    if (lat && lng) {
      util.openLocation(Number(lat), Number(lng), address);
    }
  },

  cancelOrder() {
    wx.showModal({
      title: '确认取消',
      content: '确定要取消这个订单吗？',
      success: async (res) => {
        if (!res.confirm || !this.data.order) {
          return;
        }

        try {
          await mockData.mockCancelOrder(this.data.order.id);
          util.showToast('订单已取消');
          this.loadOrderDetail(this.data.order.id);
        } catch (err) {
          util.showToastError('取消失败');
        }
      }
    });
  },

  completeOrder() {
    wx.showModal({
      title: '确认完成',
      content: '确认服务已完成吗？',
      success: async (res) => {
        if (!res.confirm || !this.data.order) {
          return;
        }

        try {
          await mockData.mockCompleteOrder(this.data.order.id);
          util.showToast('订单已完成');
          this.loadOrderDetail(this.data.order.id);
        } catch (err) {
          util.showToastError('操作失败');
        }
      }
    });
  },

  acceptOrder() {
    const currentMerchant = app.globalData.userInfo;

    if (!this.data.order || !currentMerchant || !currentMerchant.id) {
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
          await mockData.mockAcceptOrder(this.data.order.id, currentMerchant.id);
          util.showToast('接单成功');
          this.loadOrderDetail(this.data.order.id);
        } catch (err) {
          util.showToastError('接单失败');
        }
      }
    });
  },

  goBack() {
    wx.navigateBack();
  }
});
