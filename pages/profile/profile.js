// pages/profile/profile.js - 个人中心页
const app = getApp();
const util = require('../../utils/util');
const mockData = require('../../utils/mockData');

Page({
  data: {
    userInfo: null,
    userType: 'client',
    location: null,
    showLogoutDialog: false
  },

  onLoad() {
    this.loadUserInfo();
  },

  onShow() {
    this.loadUserInfo();
  },

  // 加载用户信息
  loadUserInfo() {
    this.setData({
      userInfo: app.globalData.userInfo,
      userType: app.globalData.userType || 'client',
      location: app.globalData.location
    });
  },

  // 获取位置
  async getLocation() {
    util.showLoading('获取位置中...');
    try {
      const location = await mockData.getCurrentLocation();
      app.getLocation((success, data) => {
        if (success) {
          this.setData({ location: data });
        }
      });
    } catch (err) {
      util.showToastInfo('获取位置失败');
    } finally {
      util.hideLoading();
    }
  },

  // 编辑资料
  editProfile() {
    wx.navigateTo({
      url: '/pages/register/register'
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

  // 意见反馈
  feedback() {
    wx.showModal({
      title: '意见反馈',
      content: '感谢您的反馈，我们会认真处理',
      showCancel: false,
      confirmText: '确定'
    });
  },

  // 关于我们
  aboutUs() {
    wx.showModal({
      title: '关于我们',
      content: '本地生活服务平台 v1.0.0\n提供便捷的本地生活服务',
      showCancel: false
    });
  },

  // 用户协议
  userAgreement() {
    wx.showModal({
      title: '用户协议',
      content: '用户协议内容...',
      showCancel: false
    });
  },

  // 隐私政策
  privacyPolicy() {
    wx.showModal({
      title: '隐私政策',
      content: '隐私政策内容...',
      showCancel: false
    });
  },

  // 退出登录
  logout() {
    this.setData({ showLogoutDialog: true });
  },

  // 确认退出
  confirmLogout() {
    this.setData({ showLogoutDialog: false });

    // 清除登录状态
    wx.removeStorageSync('token');
    wx.removeStorageSync('userType');
    
    app.setLoginStatus(null, null, null);
    app.globalData.userInfo = null;
    app.globalData.userType = null;

    util.showToast('已退出登录');

    setTimeout(() => {
      wx.reLaunch({
        url: '/pages/index/index'
      });
    }, 1500);
  },

  // 取消退出
  cancelLogout() {
    this.setData({ showLogoutDialog: false });
  },

  // 返回首页
  goHome() {
    wx.switchTab({
      url: '/pages/home/home'
    });
  }
});
