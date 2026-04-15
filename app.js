const mockData = require('./utils/mockData');

App({
  globalData: {
    baseUrl: '',
    userInfo: null,
    isLoggedIn: false,
    userType: null,
    token: null,
    location: null
  },

  onLaunch() {
    this.checkLoginStatus();
  },

  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    const userType = wx.getStorageSync('userType');
    const userInfo = wx.getStorageSync('userInfo');

    if (!token || !userType) {
      return;
    }

    this.globalData.token = token;
    this.globalData.userType = userType;
    this.globalData.userInfo = userInfo || null;
    this.globalData.isLoggedIn = true;

    this.getUserInfo();
  },

  getUserInfo() {
    const token = this.globalData.token;

    if (!token) {
      return Promise.resolve(null);
    }

    if (!this.globalData.baseUrl) {
      return this.loadMockUserInfo();
    }

    return new Promise((resolve) => {
      wx.request({
        url: `${this.globalData.baseUrl}/api/user/info`,
        method: 'GET',
        header: {
          Authorization: `Bearer ${token}`
        },
        success: (res) => {
          if (res.data && res.data.code === 0 && res.data.data) {
            this.globalData.userInfo = res.data.data;
            wx.setStorageSync('userInfo', res.data.data);
            resolve(res.data.data);
            return;
          }

          this.loadMockUserInfo().then(resolve);
        },
        fail: () => {
          this.loadMockUserInfo().then(resolve);
        }
      });
    });
  },

  loadMockUserInfo() {
    const userType = this.globalData.userType;
    const currentUser = this.globalData.userInfo;
    const getter = userType === 'merchant'
      ? mockData.mockGetMerchantInfo
      : mockData.mockGetUserInfo;

    return getter(currentUser && currentUser.id).then((userInfo) => {
      this.globalData.userInfo = userInfo;
      wx.setStorageSync('userInfo', userInfo);
      return userInfo;
    });
  },

  setLoginStatus(userInfo, userType, token) {
    if (!userInfo || !userType || !token) {
      this.clearLoginStatus();
      return;
    }

    this.globalData.userInfo = userInfo;
    this.globalData.userType = userType;
    this.globalData.isLoggedIn = true;
    this.globalData.token = token;

    wx.setStorageSync('token', token);
    wx.setStorageSync('userType', userType);
    wx.setStorageSync('userInfo', userInfo);
  },

  clearLoginStatus() {
    this.globalData.userInfo = null;
    this.globalData.userType = null;
    this.globalData.isLoggedIn = false;
    this.globalData.token = null;

    wx.removeStorageSync('token');
    wx.removeStorageSync('userType');
    wx.removeStorageSync('userInfo');
  },

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

  getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
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

  showToast(title, icon = 'none') {
    wx.showToast({
      title,
      icon,
      duration: 2000
    });
  },

  showLoading(title = '加载中...') {
    wx.showLoading({
      title,
      mask: true
    });
  },

  hideLoading() {
    wx.hideLoading();
  },

  request(options) {
    this.showLoading();

    return new Promise((resolve, reject) => {
      if (!options || !options.url) {
        this.hideLoading();
        reject(new Error('请求地址不能为空'));
        return;
      }

      wx.request({
        url: options.url,
        method: options.method || 'GET',
        data: options.data || {},
        header: {
          'Content-Type': 'application/json',
          Authorization: this.globalData.token ? `Bearer ${this.globalData.token}` : ''
        },
        success: (res) => {
          this.hideLoading();
          if (res.data && res.data.code === 0) {
            resolve(res.data.data);
          } else {
            this.showToast((res.data && res.data.msg) || '请求失败');
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
