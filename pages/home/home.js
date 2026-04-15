// pages/home/home.js - 首页
const app = getApp();
const util = require('../../utils/util');
const mockData = require('../../utils/mockData');

Page({
  data: {
    userInfo: null,
    userType: 'client',
    bannerList: [],
    categoryList: [],
    orderList: [],
    showPostBtn: true, // 是否显示发布按钮
    loading: true
  },

  onLoad() {
    this.initPage();
  },

  onShow() {
    // 每次显示时刷新数据
    if (app.globalData.isLoggedIn) {
      this.refreshData();
    }
  },

  // 初始化页面
  initPage() {
    this.setData({
      userInfo: app.globalData.userInfo,
      userType: app.globalData.userType || 'client'
    });
    
    this.loadMockData();
    this.refreshData();
  },

  // 加载模拟数据
  loadMockData() {
    const banners = [
      {
        id: 1,
        image: 'https://picsum.photos/300/200?random=1',
        title: '优质服务，快速响应'
      },
      {
        id: 2,
        image: 'https://picsum.photos/300/200?random=2',
        title: '专业团队，品质保障'
      }
    ];

    const categories = [
      { id: 1, name: '跑腿代送', icon: '📦', color: '#07c160' },
      { id: 2, name: '代驾服务', icon: '🚗', color: '#576b95' },
      { id: 3, name: '家政服务', icon: '🧹', color: '#fa9d3b' },
      { id: 4, name: '维修服务', icon: '🔧', color: '#70a7e9' },
      { id: 5, name: '代办业务', icon: '📋', color: '#e46c6c' },
      { id: 6, name: '其他服务', icon: '✨', color: '#95a5a6' }
    ];

    this.setData({
      bannerList: banners,
      categoryList: categories
    });
  },

  // 刷新数据
  async refreshData() {
    this.setData({ loading: true });

    try {
      const userType = app.globalData.userType;
      let orderList = [];

      if (userType === 'client') {
        // 客户端显示进行中的订单
        orderList = mockData.getMockOrders().filter(o => 
          ['pending', 'accepted', 'processing'].includes(o.status)
        );
      } else {
        // 商家端显示待处理的订单
        orderList = mockData.getMockOrders().filter(o => 
          o.status === 'pending'
        );
      }

      this.setData({
        orderList: orderList.slice(0, 3),
        showPostBtn: userType === 'client'
      });
    } catch (err) {
      console.error('刷新数据失败', err);
    } finally {
      this.setData({ loading: false });
    }
  },

  // 点击分类
  onCategoryTap(e) {
    const { name } = e.currentTarget.dataset;
    // 可以跳转到分类详情页
    util.showToastInfo(`选择了${name}`);
  },

  // 点击横幅
  onBannerTap(e) {
    const { id } = e.currentTarget.dataset;
    // 跳转到活动详情
  },

  // 点击订单卡片
  onOrderTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/orderDetail/orderDetail?id=${id}`
    });
  },

  // 发布订单
  goToPost() {
    wx.navigateTo({
      url: '/pages/post/post'
    });
  },

  // 查看全部订单
  viewAllOrders() {
    wx.switchTab({
      url: '/pages/orderList/orderList'
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.refreshData();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 500);
  },

  // 页面上拉触底
  onReachBottom() {
    // 加载更多
  },

  // 跳转到商家中心
  goToMerchant() {
    wx.navigateTo({
      url: '/pages/merchant/merchant'
    });
  }
});
