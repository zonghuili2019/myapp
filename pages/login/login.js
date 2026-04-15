// pages/login/login.js - 登录页
const app = getApp();
const util = require('../../utils/util');

Page({
  data: {
    phone: '',
    password: '',
    verifyCode: '',
    loginType: 'password', // password 或 verifyCode
    showPassword: false,
    countDown: 0,
    loggingIn: false
  },

  onLoad() {},

  // 输入变化
  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [field]: e.detail.value
    });
  },

  // 切换登录方式
  switchLoginType() {
    this.setData({
      loginType: this.data.loginType === 'password' ? 'verifyCode' : 'password',
      password: '',
      verifyCode: ''
    });
  },

  // 切换密码显示
  togglePassword() {
    this.setData({
      showPassword: !this.data.showPassword
    });
  },

  // 发送验证码
  sendVerifyCode() {
    if (!this.data.phone.trim()) {
      util.showToastInfo('请输入手机号');
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(this.data.phone)) {
      util.showToastInfo('请输入正确的手机号');
      return;
    }

    // 开始倒计时
    this.setData({ countDown: 60 });
    const timer = setInterval(() => {
      this.setData({
        countDown: this.data.countDown - 1
      });
      if (this.data.countDown <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    util.showToast('验证码已发送');
  },

  // 验证表单
  validateForm() {
    if (this.data.loginType === 'password') {
      if (!this.data.phone.trim()) {
        util.showToastInfo('请输入手机号');
        return false;
      }
      if (!this.data.password.trim()) {
        util.showToastInfo('请输入密码');
        return false;
      }
    } else {
      if (!this.data.phone.trim()) {
        util.showToastInfo('请输入手机号');
        return false;
      }
      if (!this.data.verifyCode.trim()) {
        util.showToastInfo('请输入验证码');
        return false;
      }
    }
    return true;
  },

  // 提交登录
  async submitLogin() {
    if (this.data.loggingIn) return;

    if (!this.validateForm()) return;

    this.setData({ loggingIn: true });

    try {
      // 模拟登录
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = require('../../utils/mockData');
      const res = await mockData.mockLogin();
      
      const { token, userType, userInfo } = res;
      app.setLoginStatus(userInfo, userType, token);

      util.showToast('登录成功');
      
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/home/home'
        });
      }, 1500);

    } catch (err) {
      util.showToastError('登录失败，请重试');
      console.error('登录失败', err);
    } finally {
      this.setData({ loggingIn: false });
    }
  },

  // 返回
  goBack() {
    wx.navigateBack();
  },

  // 去注册
  goToRegister() {
    wx.navigateTo({
      url: '/pages/register/register'
    });
  }
});
