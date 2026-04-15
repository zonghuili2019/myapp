// pages/register/register.js - 注册页
const app = getApp();
const util = require('../../utils/util');
const mockData = require('../../utils/mockData');

Page({
  data: {
    userType: 'client', // client 或 merchant
    form: {
      nickname: '',
      phone: '',
      location: {
        latitude: '',
        longitude: '',
        address: ''
      },
      // 商家额外字段
      name: '',
      description: ''
    },
    rules: {
      nickname: [
        { required: true, message: '请输入昵称' }
      ],
      phone: [
        { required: true, message: '请输入手机号' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
      ]
    },
    submitting: false
  },

  onLoad(options) {
    // 如果有预设的用户类型
    if (options.type === 'merchant') {
      this.setData({ userType: 'merchant' });
    }
  },

  // 切换用户类型
  switchUserType(e) {
    const userType = e.currentTarget.dataset.type;
    this.setData({ userType });
  },

  // 输入变化
  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`form.${field}`]: e.detail.value
    });
  },

  // 获取位置
  async getLocation() {
    util.showLoading('获取位置中...');
    try {
      const res = await mockData.getCurrentLocation();
      this.setData({
        'form.location': res
      });
      util.showToast('位置获取成功');
    } catch (err) {
      util.showToastInfo('获取位置失败，请手动选择');
    } finally {
      util.hideLoading();
    }
  },

  // 选择位置
  async chooseLocation() {
    try {
      const res = await mockData.chooseLocation();
      this.setData({
        'form.location': res
      });
    } catch (err) {
      util.showToastInfo('选择位置失败');
    }
  },

  // 表单验证
  validateForm() {
    const { form, userType } = this.data;
    
    if (!form.nickname.trim()) {
      util.showToastInfo('请输入昵称');
      return false;
    }

    if (!form.phone.trim()) {
      util.showToastInfo('请输入手机号');
      return false;
    }

    if (!/^1[3-9]\d{9}$/.test(form.phone)) {
      util.showToastInfo('请输入正确的手机号');
      return false;
    }

    if (!form.location.address) {
      util.showToastInfo('请选择服务地址');
      return false;
    }

    // 商家额外验证
    if (userType === 'merchant') {
      if (!form.name.trim()) {
        util.showToastInfo('请输入商家名称');
        return false;
      }
    }

    return true;
  },

  // 提交注册
  async submitRegister() {
    if (this.data.submitting) return;
    
    if (!this.validateForm()) return;

    this.setData({ submitting: true });

    try {
      const registerData = {
        nickname: this.data.form.nickname,
        phone: this.data.form.phone,
        location: this.data.form.location,
        userType: this.data.userType
      };

      let result;
      
      if (this.data.userType === 'merchant') {
        registerData.name = this.data.form.name;
        registerData.description = this.data.form.description;
        result = await mockData.mockMerchantRegister(registerData);
      } else {
        result = await mockData.mockRegister(registerData);
      }

      const { token, userType, userInfo, merchantInfo } = result;
      
      // 保存登录状态
      if (merchantInfo) {
        app.setLoginStatus(merchantInfo, 'merchant', token);
      } else {
        app.setLoginStatus(userInfo, 'client', token);
      }

      util.showToast('注册成功');
      
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/home/home'
        });
      }, 1500);

    } catch (err) {
      util.showToastError('注册失败，请重试');
      console.error('注册失败', err);
    } finally {
      this.setData({ submitting: false });
    }
  },

  // 返回
  goBack() {
    wx.navigateBack();
  }
});
