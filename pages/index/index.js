// pages/index/index.js - 启动页
const app = getApp();

Page({
  data: {
    isLoading: true,
    isLoggingIn: false,
    avatarUrl: ''
  },

  onLoad() {
    this.checkLogin();
  },

  onShow() {
    if (this.data.isLoading) {
      this.checkLogin();
    }
  },

  checkLogin() {
    if (app.globalData.isLoggedIn && app.globalData.userInfo) {
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/home/home'
        });
      }, 500);
      return;
    }

    setTimeout(() => {
      this.setData({ isLoading: false });
    }, 300);
  },

  handleLogin() {
    if (this.data.isLoggingIn) {
      return;
    }

    this.setData({ isLoggingIn: true });

    if (!app.globalData.baseUrl) {
      this.mockLogin();
      return;
    }

    wx.login({
      success: (res) => {
        if (!res.code) {
          this.setData({ isLoggingIn: false });
          wx.showToast({
            title: '登录失败，请重试',
            icon: 'none'
          });
          return;
        }

        wx.request({
          url: `${app.globalData.baseUrl}/api/auth/login`,
          method: 'POST',
          data: { code: res.code },
          success: (loginRes) => {
            if (loginRes.data && loginRes.data.code === 0 && loginRes.data.data) {
              const { token, userType, userInfo } = loginRes.data.data;
              app.setLoginStatus(userInfo, userType, token);
              this.onLoginSuccess();
              return;
            }

            this.setData({ isLoggingIn: false });
            this.goToRegister();
          },
          fail: () => {
            this.mockLogin();
          }
        });
      },
      fail: () => {
        this.mockLogin();
      }
    });
  },

  mockLogin() {
    const mockData = require('../../utils/mockData');

    mockData.mockLogin().then((res) => {
      const { token, userType, userInfo } = res;
      app.setLoginStatus(userInfo, userType, token);
      this.setData({
        isLoggingIn: false,
        avatarUrl: userInfo.avatar || ''
      });
      this.onLoginSuccess();
    }).catch(() => {
      this.setData({ isLoggingIn: false });
      this.goToRegister();
    });
  },

  onLoginSuccess() {
    wx.showToast({
      title: '登录成功',
      icon: 'success'
    });

    setTimeout(() => {
      wx.switchTab({
        url: '/pages/home/home'
      });
    }, 800);
  },

  goToRegister() {
    this.setData({ isLoading: false });
    wx.navigateTo({
      url: '/pages/register/register'
    });
  },

  goToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  }
});
