// pages/index/index.js - 启动页
const app = getApp();
const util = require('../../utils/util');

Page({
  data: {
    isLoading: true,
    isLoggingIn: false
  },

  onLoad() {
    this.checkLogin();
  },

  onShow() {
    // 每次显示时检查登录状态
    if (this.data.isLoading) {
      this.checkLogin();
    }
  },

  // 检查登录状态
  checkLogin() {
    if (app.globalData.isLoggedIn && app.globalData.userInfo) {
      // 已登录，跳转到首页
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/home/home'
        });
      }, 1000);
    } else {
      // 未登录，延迟显示登录按钮
      setTimeout(() => {
        this.setData({ isLoading: false });
      }, 1500);
    }
  },

  // 微信登录
  handleLogin() {
    if (this.data.isLoggingIn) return;
    
    this.setData({ isLoggingIn: true });
    
    // 获取微信登录code
    wx.login({
      success: (res) => {
        if (res.code) {
          // 调用后端登录接口
          wx.request({
            url: `${app.globalData.baseUrl}/api/auth/login`,
            method: 'POST',
            data: { code: res.code },
            success: (loginRes) => {
              if (loginRes.data.code === 0) {
                // 登录成功
                const { token, userType, userInfo } = loginRes.data.data;
                app.setLoginStatus(userInfo, userType, token);
                this.setData({ isLoggingIn: false });
                
                wx.showToast({
                  title: '登录成功',
                  icon: 'success'
                });
                
                setTimeout(() => {
                  wx.switchTab({
                    url: '/pages/home/home'
                  });
                }, 1500);
              } else {
                this.setData({ isLoggingIn: false });
                // 首次使用需要注册
                this.goToRegister();
              }
            },
            fail: () => {
              this.setData({ isLoggingIn: false });
              // 网络错误，使用模拟数据
              this.mockLogin();
            }
          });
        } else {
          this.setData({ isLoggingIn: false });
          wx.showToast({
            title: '登录失败，请重试',
            icon: 'none'
          });
        }
      },
      fail: () => {
        this.setData({ isLoggingIn: false });
        this.mockLogin();
      }
    });
  },

  // 模拟登录（开发测试用）
  mockLogin() {
    const mockData = require('../../utils/mockData');
    
    setTimeout(() => {
      mockData.mockLogin().then((res) => {
        const { token, userType, userInfo } = res;
        app.setLoginStatus(userInfo, userType, token);
        this.setData({ isLoggingIn: false });
        
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        });
        
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/home/home'
          });
        }, 1500);
      }).catch(() => {
        this.setData({ isLoggingIn: false });
        this.goToRegister();
      });
    }, 1000);
  },

  // 跳转到注册页
  goToRegister() {
    this.setData({ isLoading: false });
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/register/register'
      });
    }, 300);
  },

  // 跳转到登录页
  goToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  }
});
