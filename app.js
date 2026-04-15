// app.js
App({
  globalData: {
    userInfo: null,
    isLoggedIn: false,
    userType: null, // 'client' 客户端, 'merchant' 商家端
    token: null,
    location: null // {latitude, longitude, address}
  },

  onLaunch() {
    // 检查登录状态
    this.checkLoginStatus();
  },

  // 检查登录状态
  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    const userType = wx.getStorageSync('userType');
    
    if (token && userType) {
      this.globalData.token = token;
      this.globalData.userType = userType;
      this.globalData.isLoggedIn = true;
      
      // 获取用户信息
      this.getUserInfo();
    }
  },

  // 获取用户信息
  getUserInfo() {
    const token = this.globalData.token;
    if (!token) return;

    wx.request({
      url: `${this.globalData.baseUrl}/api/user/info`,
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        if (res.data.code === 0) {
          this.globalData.userInfo = res.data.data;
        }
      }
    });
  },

  // 设置登录状态
  setLoginStatus(userInfo, userType, token) {
    this.globalData.userInfo = userInfo;
    this.globalData.userType = userType;
    this.globalData.isLoggedIn = true;
    this.globalData.token = token;
    
    wx.setStorageSync('token', token);
    wx.setStorageSync('userType', userType);
  },

  // 获取位置信息
  getLocation(callback) {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.globalData.location = {
          latitude: res.latitude,
          longitude: res.longitude,
          address: res.name || ''
        };
        callback && callback(true, this.globalData.location);
      },
      fail: (err) => {
        console.error('获取位置失败', err);
        callback && callback(false, null);
      }
    });
  },

  // 获取距离（单位：km）
  getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // 地球半径（km）
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
      Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  },

  // 显示提示
  showToast(title, icon = 'none') {
    wx.showToast({
      title,
      icon,
      duration: 2000
    });
  },

  // 显示加载
  showLoading(title = '加载中...') {
    wx.showLoading({
      title,
      mask: true
    });
  },

  // 隐藏加载
  hideLoading() {
    wx.hideLoading();
  },

  // 请求封装
  request(options) {
    this.showLoading();
    
    return new Promise((resolve, reject) => {
      wx.request({
        url: options.url,
        method: options.method || 'GET',
        data: options.data || {},
        header: {
          'Content-Type': 'application/json',
          'Authorization': this.globalData.token ? `Bearer ${this.globalData.token}` : ''
        },
        success: (res) => {
          this.hideLoading();
          if (res.data.code === 0) {
            resolve(res.data.data);
          } else {
            this.showToast(res.data.msg || '请求失败');
            reject(res.data);
          }
        },
        fail: (err) => {
          this.hideLoading();
          this.showToast('网络错误');
          reject(err);
        }
      });
    });
  }
});
