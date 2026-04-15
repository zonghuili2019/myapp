// pages/profile/profile.js - 个人中心页
const app = getApp();
const util = require('../../utils/util');

Page({
  data: {
    userInfo: null,
    userType: 'client',
    location: null
  },

  onLoad() {
    this.loadUserInfo();
  },

  onShow() {
    this.loadUserInfo();
  },

  loadUserInfo() {
    this.setData({
      userInfo: app.globalData.userInfo,
      userType: app.globalData.userType || 'client',
      location: app.globalData.location
    });
  },

  getLocation() {
    util.showLoading('获取位置中...');
    app.getLocation((success, data) => {
      util.hideLoading();
      if (success) {
        this.setData({ location: data });
        util.showToast('位置已更新');
        return;
      }
      util.showToastInfo('获取位置失败');
    });
  },

  editProfile() {
    wx.navigateTo({
      url: '/pages/register/register'
    });
  },

  contactService() {
    wx.showModal({
      title: '联系我们',
      content: '客服微信：local_service_admin\n客服电话：400-xxx-xxxx',
      showCancel: false
    });
  },

  feedback() {
    wx.showModal({
      title: '意见反馈',
      content: '感谢您的反馈，我们会认真处理',
      showCancel: false,
      confirmText: '确定'
    });
  },

  aboutUs() {
    wx.showModal({
      title: '关于我们',
      content: '本地生活服务平台 v1.0.0\n提供便捷的本地生活服务',
      showCancel: false
    });
  },

  userAgreement() {
    wx.showModal({
      title: '用户协议',
      content: '用户协议内容...',
      showCancel: false
    });
  },

  privacyPolicy() {
    wx.showModal({
      title: '隐私政策',
      content: '隐私政策内容...',
      showCancel: false
    });
  },

  logout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (!res.confirm) {
          return;
        }

        app.clearLoginStatus();
        util.showToast('已退出登录');

        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/index/index'
          });
        }, 800);
      }
    });
  },

  goHome() {
    wx.switchTab({
      url: '/pages/home/home'
    });
  },

  goToLogin() {
    wx.reLaunch({
      url: '/pages/index/index'
    });
  }
});
