// utils/util.js - 工具函数

/**
 * 格式化日期
 * @param {Date} date 日期对象
 * @param {string} format 格式化模板
 */
function formatDate(date, format = 'YYYY-MM-DD HH:mm') {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 防抖函数
 * @param {Function} fn 需要防抖的函数
 * @param {number} delay 延迟时间
 */
function debounce(fn, delay = 300) {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * 节流函数
 * @param {Function} fn 需要节流的函数
 * @param {number} interval 间隔时间
 */
function throttle(fn, interval = 300) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

/**
 * 深拷贝
 * @param {*} obj 需要拷贝的对象
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (obj instanceof Date) {
    return new Date(obj);
  }
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  if (obj instanceof Object) {
    const copy = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        copy[key] = deepClone(obj[key]);
      }
    }
    return copy;
  }
  return obj;
}

/**
 * 生成唯一ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * 截取文本
 * @param {string} str 原始文本
 * @param {number} len 最大长度
 */
function truncateText(str, len = 20) {
  if (!str) return '';
  return str.length > len ? str.substring(0, len) + '...' : str;
}

/**
 * 格式化金额
 * @param {number} amount 金额（分）
 */
function formatPrice(amount) {
  if (!amount) return '0.00';
  return (amount / 100).toFixed(2);
}

/**
 * 显示加载提示
 */
function showLoading(title = '加载中...') {
  wx.showLoading({
    title,
    mask: true
  });
}

/**
 * 隐藏加载提示
 */
function hideLoading() {
  wx.hideLoading();
}

/**
 * 显示成功提示
 */
function showToast(title, icon = 'success') {
  wx.showToast({
    title,
    icon,
    duration: 2000
  });
}

/**
 * 显示普通提示
 */
function showToastInfo(title) {
  wx.showToast({
    title,
    icon: 'none',
    duration: 2000
  });
}

/**
 * 显示错误提示
 */
function showToastError(title) {
  wx.showToast({
    title,
    icon: 'error',
    duration: 2000
  });
}

/**
 * 显示普通消息
 */
function showMessage(content, type = 'info') {
  wx.showModal({
    title: '',
    content,
    showCancel: false,
    confirmText: '确定'
  });
}

/**
 * 显示确认对话框
 */
function showConfirm(title, content, success) {
  wx.showModal({
    title,
    content,
    success: (res) => {
      if (res.confirm) {
        success && success();
      }
    }
  });
}

/**
 * 获取本地存储
 */
function getStorage(key, defaultValue = null) {
  try {
    const item = wx.getStorageSync(key);
    return item ? item : defaultValue;
  } catch (error) {
    console.error('获取本地存储失败', error);
    return defaultValue;
  }
}

/**
 * 设置本地存储
 */
function setStorage(key, value) {
  try {
    wx.setStorageSync(key, value);
  } catch (error) {
    console.error('设置本地存储失败', error);
  }
}

/**
 * 删除本地存储
 */
function removeStorage(key) {
  try {
    wx.removeStorageSync(key);
  } catch (error) {
    console.error('删除本地存储失败', error);
  }
}

/**
 * 清空本地存储
 */
function clearStorage() {
  try {
    wx.clearStorageSync();
  } catch (error) {
    console.error('清空本地存储失败', error);
  }
}

/**
 * 跳转页面
 */
function navigateTo(url, params = {}) {
  const queryString = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  wx.navigateTo({ url: fullUrl });
}

/**
 * 返回上一页
 */
function navigateBack(delta = 1) {
  wx.navigateBack({ delta });
}

/**
 * 重定向
 */
function redirectTo(url) {
  wx.redirectTo({ url });
}

/**
 * 切换Tab
 */
function switchTab(url) {
  wx.switchTab({ url });
}

/**
 * 拨打电话
 */
function makePhoneCall(phoneNumber) {
  if (!phoneNumber) {
    showToastInfo('手机号不能为空');
    return;
  }
  wx.makePhoneCall({
    phoneNumber,
    fail: () => {
      showToastError('无法拨打电话');
    }
  });
}

/**
 * 打开位置
 */
function openLocation(latitude, longitude, name = '位置') {
  if (!latitude || !longitude) {
    showToastInfo('位置信息不完整');
    return;
  }
  wx.openLocation({
    latitude,
    longitude,
    name,
    scale: 15,
    fail: (err) => {
      console.error('打开位置失败', err);
    }
  });
}

module.exports = {
  formatDate,
  debounce,
  throttle,
  deepClone,
  generateId,
  truncateText,
  formatPrice,
  showLoading,
  hideLoading,
  showToast,
  showToastInfo,
  showToastError,
  showMessage,
  showConfirm,
  getStorage,
  setStorage,
  removeStorage,
  clearStorage,
  navigateTo,
  navigateBack,
  redirectTo,
  switchTab,
  makePhoneCall,
  openLocation
};
