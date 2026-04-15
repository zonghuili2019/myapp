// utils/api.js - API 接口封装
const app = getApp();

/**
 * 通用请求方法
 */
function request(options) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': app.globalData.token ? `Bearer ${app.globalData.token}` : ''
      },
      success: (res) => {
        if (res.data.code === 0) {
          resolve(res.data.data);
        } else if (res.data.code === 401) {
          // Token 过期，清除登录状态
          wx.removeStorageSync('token');
          wx.removeStorageSync('userType');
          app.globalData.isLoggedIn = false;
          app.globalData.token = null;
          app.globalData.userType = null;
          app.globalData.userInfo = null;
          reject(new Error('登录已过期，请重新登录'));
        } else {
          reject(new Error(res.data.msg || '请求失败'));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

// ==================== 用户相关接口 ====================

/**
 * 微信登录
 */
function login(code) {
  return request({
    url: `${app.globalData.baseUrl}/api/auth/login`,
    method: 'POST',
    data: { code }
  });
}

/**
 * 用户注册
 */
function register(data) {
  return request({
    url: `${app.globalData.baseUrl}/api/auth/register`,
    method: 'POST',
    data
  });
}

/**
 * 获取用户信息
 */
function getUserInfo() {
  return request({
    url: `${app.globalData.baseUrl}/api/user/info`
  });
}

/**
 * 更新用户信息
 */
function updateUserInfo(data) {
  return request({
    url: `${app.globalData.baseUrl}/api/user/update`,
    method: 'POST',
    data
  });
}

/**
 * 获取用户位置
 */
function getUserLocation() {
  return request({
    url: `${app.globalData.baseUrl}/api/user/location`
  });
}

// ==================== 订单相关接口 ====================

/**
 * 发布订单
 */
function createOrder(data) {
  return request({
    url: `${app.globalData.baseUrl}/api/order/create`,
    method: 'POST',
    data
  });
}

/**
 * 获取订单列表
 */
function getOrderList(params = {}) {
  return request({
    url: `${app.globalData.baseUrl}/api/order/list?${new URLSearchParams(params).toString()}`
  });
}

/**
 * 获取订单详情
 */
function getOrderDetail(orderId) {
  return request({
    url: `${app.globalData.baseUrl}/api/order/${orderId}`
  });
}

/**
 * 取消订单
 */
function cancelOrder(orderId) {
  return request({
    url: `${app.globalData.baseUrl}/api/order/${orderId}/cancel`,
    method: 'POST'
  });
}

/**
 * 接单
 */
function acceptOrder(orderId) {
  return request({
    url: `${app.globalData.baseUrl}/api/order/${orderId}/accept`,
    method: 'POST'
  });
}

/**
 * 完成订单
 */
function completeOrder(orderId) {
  return request({
    url: `${app.globalData.baseUrl}/api/order/${orderId}/complete`,
    method: 'POST'
  });
}

/**
 * 获取附近订单（商家端）
 */
function getNearbyOrders(params = {}) {
  return request({
    url: `${app.globalData.baseUrl}/api/order/nearby?${new URLSearchParams(params).toString()}`
  });
}

// ==================== 商家相关接口 ====================

/**
 * 商家注册
 */
function merchantRegister(data) {
  return request({
    url: `${app.globalData.baseUrl}/api/merchant/register`,
    method: 'POST',
    data
  });
}

/**
 * 获取商家信息
 */
function getMerchantInfo() {
  return request({
    url: `${app.globalData.baseUrl}/api/merchant/info`
  });
}

/**
 * 更新商家信息
 */
function updateMerchantInfo(data) {
  return request({
    url: `${app.globalData.baseUrl}/api/merchant/update`,
    method: 'POST',
    data
  });
}

/**
 * 获取商家订单列表
 */
function getMerchantOrders(params = {}) {
  return request({
    url: `${app.globalData.baseUrl}/api/merchant/orders?${new URLSearchParams(params).toString()}`
  });
}

/**
 * 获取商家订单详情
 */
function getMerchantOrderDetail(orderId) {
  return request({
    url: `${app.globalData.baseUrl}/api/merchant/order/${orderId}`
  });
}

// ==================== IM 相关接口 ====================

/**
 * 获取会话列表
 */
function getConversationList() {
  return request({
    url: `${app.globalData.baseUrl}/api/im/conversations`
  });
}

/**
 * 获取消息列表
 */
function getMessageList(conversationId, params = {}) {
  return request({
    url: `${app.globalData.baseUrl}/api/im/conversation/${conversationId}/messages?${new URLSearchParams(params).toString()}`
  });
}

/**
 * 发送消息
 */
function sendMessage(data) {
  return request({
    url: `${app.globalData.baseUrl}/api/im/message/send`,
    method: 'POST',
    data
  });
}

/**
 * 获取用户信息（通过ID）
 */
function getUserById(userId) {
  return request({
    url: `${app.globalData.baseUrl}/api/user/${userId}`
  });
}

/**
 * 获取商家信息（通过ID）
 */
function getMerchantById(merchantId) {
  return request({
    url: `${app.globalData.baseUrl}/api/merchant/${merchantId}`
  });
}

// ==================== 位置相关接口 ====================

/**
 * 获取当前位置
 */
function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        resolve({
          latitude: res.latitude,
          longitude: res.longitude,
          address: res.name || ''
        });
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

/**
 * 选择位置
 */
function chooseLocation() {
  return new Promise((resolve, reject) => {
    wx.chooseLocation({
      success: (res) => {
        resolve({
          latitude: res.latitude,
          longitude: res.longitude,
          address: res.name,
          detail: res.address
        });
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

module.exports = {
  request,
  // 用户相关
  login,
  register,
  getUserInfo,
  updateUserInfo,
  getUserLocation,
  // 订单相关
  createOrder,
  getOrderList,
  getOrderDetail,
  cancelOrder,
  acceptOrder,
  completeOrder,
  getNearbyOrders,
  // 商家相关
  merchantRegister,
  getMerchantInfo,
  updateMerchantInfo,
  getMerchantOrders,
  getMerchantOrderDetail,
  // IM相关
  getConversationList,
  getMessageList,
  sendMessage,
  getUserById,
  getMerchantById,
  // 位置相关
  getCurrentLocation,
  chooseLocation
};
