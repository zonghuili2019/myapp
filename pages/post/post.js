// pages/post/post.js - 发布订单页
const app = getApp();
const util = require('../../utils/util');
const mockData = require('../../utils/mockData');

Page({
  data: {
    form: {
      title: '',
      description: '',
      location: {
        latitude: '',
        longitude: '',
        address: ''
      }
    },
    submitting: false,
    locationError: ''
  },

  onLoad() {
    // 获取当前位置
    this.getCurrentLocation();
  },

  // 获取当前位置
  async getCurrentLocation() {
    try {
      const location = await mockData.getCurrentLocation();
      this.setData({
        'form.location': location,
        locationError: ''
      });
    } catch (err) {
      console.error('获取位置失败', err);
    }
  },

  // 输入变化
  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`form.${field}`]: e.detail.value,
      locationError: ''
    });
  },

  // 标题输入
  onTitleChange(e) {
    this.setData({
      'form.title': e.detail.value,
      locationError: ''
    });
  },

  // 描述输入
  onDescChange(e) {
    this.setData({
      'form.description': e.detail.value,
      locationError: ''
    });
  },

  // 获取位置
  async getLocation() {
    util.showLoading('获取位置中...');
    try {
      const location = await mockData.getCurrentLocation();
      this.setData({
        'form.location': location,
        locationError: ''
      });
      util.showToast('位置获取成功');
    } catch (err) {
      this.setData({
        locationError: '获取位置失败，请手动选择'
      });
    } finally {
      util.hideLoading();
    }
  },

  // 选择位置
  async chooseLocation() {
    try {
      const location = await mockData.chooseLocation();
      this.setData({
        'form.location': location,
        locationError: ''
      });
      util.showToast('位置选择成功');
    } catch (err) {
      this.setData({
        locationError: '选择位置失败，请重试'
      });
    }
  },

  // 表单验证
  validateForm() {
    const { form } = this.data;
    
    if (!form.title.trim()) {
      util.showToastInfo('请输入需求标题');
      return false;
    }

    if (!form.description.trim()) {
      util.showToastInfo('请输入详细描述');
      return false;
    }

    if (!form.location.address) {
      this.setData({
        locationError: '请选择服务位置'
      });
      return false;
    }

    return true;
  },

  // 提交发布
  async submitPost() {
    if (this.data.submitting) return;

    if (!this.validateForm()) return;

    this.setData({ submitting: true });

    try {
      // 获取用户信息
      const userInfo = app.globalData.userInfo;
      
      // 创建订单
      const orderData = {
        clientId: userInfo.id,
        clientName: userInfo.nickname,
        clientPhone: userInfo.phone,
        location: this.data.form.location,
        title: this.data.form.title,
        description: this.data.form.description,
        status: 'pending',
        createdAt: util.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
        price: Math.floor(Math.random() * 50 + 10) * 100
      };

      const order = await mockData.mockCreateOrder(orderData);

      util.showToast('发布成功');

      setTimeout(() => {
        wx.navigateBack();
      }, 1500);

    } catch (err) {
      util.showToastError('发布失败，请重试');
      console.error('发布失败', err);
    } finally {
      this.setData({ submitting: false });
    }
  },

  // 返回
  goBack() {
    wx.navigateBack();
  }
});
