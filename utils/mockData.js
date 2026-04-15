// utils/mockData.js - 模拟数据（开发测试用）

const util = require('./util');

// 模拟延迟
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 模拟用户数据
const mockUsers = [
  {
    id: 'user_001',
    nickname: '小明',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
    phone: '138****1234',
    userType: 'client',
    location: {
      latitude: 22.5431,
      longitude: 114.0579,
      address: '深圳市南山区科技园'
    }
  },
  {
    id: 'user_002',
    nickname: '小红',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
    phone: '139****5678',
    userType: 'client',
    location: {
      latitude: 22.5450,
      longitude: 114.0550,
      address: '深圳市南山区商业中心'
    }
  }
];

// 模拟商家数据
const mockMerchants = [
  {
    id: 'merchant_001',
    name: '快捷跑腿服务',
    logo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=merchant1',
    phone: '138****9012',
    location: {
      latitude: 22.5400,
      longitude: 114.0500,
      address: '深圳市南山区跑腿服务站'
    },
    rating: 4.8,
    description: '提供快速跑腿配送服务'
  },
  {
    id: 'merchant_002',
    name: '代驾服务',
    logo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=merchant2',
    phone: '139****3456',
    location: {
      latitude: 22.5480,
      longitude: 114.0600,
      address: '深圳市南山区代驾服务中心'
    },
    rating: 4.6,
    description: '专业代驾服务，安全可靠'
  }
];

// 模拟订单数据
const mockOrders = [
  {
    id: 'order_001',
    orderId: '20260415001',
    clientId: 'user_001',
    merchantId: 'merchant_001',
    clientName: '小明',
    clientPhone: '138****1234',
    clientLocation: {
      latitude: 22.5431,
      longitude: 114.0579,
      address: '深圳市南山区科技园'
    },
    title: '文件取送',
    description: '需要从科技园取一份合同文件送到福田区',
    status: 'pending', // pending, processing, accepted, completed, cancelled
    createdAt: '2026-04-15 10:30:00',
    price: 2500 // 25元
  },
  {
    id: 'order_002',
    orderId: '20260415002',
    clientId: 'user_002',
    merchantId: null,
    clientName: '小红',
    clientPhone: '139****5678',
    clientLocation: {
      latitude: 22.5450,
      longitude: 114.0550,
      address: '深圳市南山区商业中心'
    },
    title: '代买午餐',
    description: '帮我买一份宫保鸡丁和一份米饭',
    status: 'pending',
    createdAt: '2026-04-15 11:00:00',
    price: 3500 // 35元
  },
  {
    id: 'order_003',
    orderId: '20260415003',
    clientId: 'user_001',
    merchantId: 'merchant_001',
    clientName: '小明',
    clientPhone: '138****1234',
    clientLocation: {
      latitude: 22.5431,
      longitude: 114.0579,
      address: '深圳市南山区科技园'
    },
    title: '药品配送',
    description: '急需感冒药，尽快送达',
    status: 'accepted',
    createdAt: '2026-04-15 09:00:00',
    price: 1800 // 18元
  }
];

// 模拟聊天数据
const mockMessages = [
  {
    conversationId: buildConversationId('user_001', 'merchant_001'),
    userId: 'user_001',
    merchantId: 'merchant_001',
    messages: [
      {
        id: 'msg_001',
        senderId: 'user_001',
        senderType: 'client',
        content: '你好，请问大概多久能到？',
        type: 'text',
        createdAt: '2026-04-15 10:35:00'
      },
      {
        id: 'msg_002',
        senderId: 'merchant_001',
        senderType: 'merchant',
        content: '您好，预计15-20分钟内到达，请保持电话畅通。',
        type: 'text',
        createdAt: '2026-04-15 10:36:00'
      }
    ]
  }
];

/**
 * 模拟登录
 */
async function mockLogin(code) {
  await delay(500);
  return {
    token: `token_${util.generateId()}`,
    userType: 'client',
    userInfo: mockUsers[0]
  };
}

/**
 * 模拟注册
 */
async function mockRegister(data) {
  await delay(500);
  const newUser = {
    id: `user_${Date.now()}`,
    nickname: data.nickname,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${util.generateId()}`,
    phone: data.phone,
    userType: data.userType,
    location: data.location
  };
  mockUsers.push(newUser);
  return {
    token: `token_${util.generateId()}`,
    userType: data.userType,
    userInfo: newUser
  };
}

/**
 * 模拟获取订单列表
 */
async function mockGetOrderList(params = {}) {
  await delay(300);
  let orders = [...mockOrders];
  
  if (params.status) {
    orders = orders.filter(o => o.status === params.status);
  }
  
  // 模拟商家只能看到已接单的订单
  const userType = wx.getStorageSync('userType');
  if (userType === 'merchant') {
    orders = orders.filter(o => o.merchantId);
  }
  
  return {
    list: orders,
    total: orders.length
  };
}

/**
 * 模拟获取附近订单
 */
async function mockGetNearbyOrders(params = {}) {
  await delay(500);
  const { latitude, longitude, radius = 3000 } = params;
  const center = { lat: latitude || 22.5431, lng: longitude || 114.0579 };
  
  // 计算距离并筛选
  const nearbyOrders = mockOrders
    .filter(o => !o.merchantId) // 只看未接单的
    .map(o => {
      const distance = util.getDistance(
        center.lat, center.lng,
        o.clientLocation.latitude, o.clientLocation.longitude
      );
      return { ...o, distance: Math.round(distance * 1000) };
    })
    .filter(o => o.distance <= radius);
  
  return {
    list: nearbyOrders.sort((a, b) => a.distance - b.distance),
    total: nearbyOrders.length
  };
}

/**
 * 模拟创建订单
 */
async function mockCreateOrder(data) {
  await delay(300);
  const newOrder = {
    id: `order_${Date.now()}`,
    orderId: `20260415${String(mockOrders.length + 1).padStart(3, '0')}`,
    clientId: data.clientId,
    merchantId: null,
    clientName: data.clientName,
    clientPhone: data.clientPhone,
    clientLocation: data.location,
    title: data.title,
    description: data.description,
    status: 'pending',
    createdAt: util.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
    price: Math.floor(Math.random() * 50 + 10) * 100
  };
  mockOrders.unshift(newOrder);
  return newOrder;
}

/**
 * 模拟接单
 */
async function mockAcceptOrder(orderId, merchantId) {
  await delay(300);
  const order = mockOrders.find(o => o.id === orderId);
  if (order) {
    order.merchantId = merchantId;
    order.status = 'accepted';
    return order;
  }
  throw new Error('订单不存在');
}

/**
 * 模拟获取会话列表
 */
async function mockGetConversationList() {
  await delay(300);
  return mockMessages.map(conv => ({
    id: conv.conversationId,
    userId: conv.userId,
    merchantId: conv.merchantId,
    lastMessage: conv.messages[conv.messages.length - 1],
    unreadCount: 0,
    createdAt: conv.messages[0].createdAt
  }));
}

/**
 * 模拟获取消息列表
 */
async function mockGetMessageList(conversationId) {
  await delay(300);
  const conversation = mockMessages.find(c => c.conversationId === conversationId);
  return conversation ? { messages: conversation.messages } : { messages: [] };
}

/**
 * 模拟发送消息
 */
async function mockSendMessage(data) {
  await delay(300);
  const conversation = mockMessages.find(
    c => c.userId === data.userId && c.merchantId === data.merchantId
  );
  
  const newMessage = {
    id: `msg_${Date.now()}`,
    senderId: data.senderId,
    senderType: data.senderType,
    content: data.content,
    type: 'text',
    createdAt: util.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
  };
  
  if (conversation) {
    conversation.messages.push(newMessage);
  } else {
    mockMessages.push({
      conversationId: `conv_${util.generateId()}`,
      userId: data.userId,
      merchantId: data.merchantId,
      messages: [newMessage]
    });
  }
  
  return newMessage;
}

/**
 * 模拟获取用户信息
 */
async function mockGetUserInfo() {
  await delay(200);
  return mockUsers[0];
}

/**
 * 模拟获取商家信息
 */
async function mockGetMerchantInfo() {
  await delay(200);
  return mockMerchants[0];
}

/**
 * 模拟商家注册
 */
async function mockMerchantRegister(data) {
  await delay(500);
  const newMerchant = {
    id: `merchant_${Date.now()}`,
    name: data.name,
    logo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${util.generateId()}`,
    phone: data.phone,
    location: data.location,
    rating: 5.0,
    description: data.description || ''
  };
  mockMerchants.push(newMerchant);
  return {
    token: `token_${util.generateId()}`,
    userType: 'merchant',
    merchantInfo: newMerchant
  };
}

/**
 * 模拟获取订单详情
 */
async function mockGetOrderDetail(orderId) {
  await delay(200);
  const order = mockOrders.find(o => o.id === orderId);
  if (!order) throw new Error('订单不存在');
  return order;
}

/**
 * 模拟取消订单
 */
async function mockCancelOrder(orderId) {
  await delay(300);
  const order = mockOrders.find(o => o.id === orderId);
  if (order) {
    order.status = 'cancelled';
    return order;
  }
  throw new Error('订单不存在');
}

/**
 * 模拟完成订单
 */
async function mockCompleteOrder(orderId) {
  await delay(300);
  const order = mockOrders.find(o => o.id === orderId);
  if (order) {
    order.status = 'completed';
    return order;
  }
  throw new Error('订单不存在');
}

/**
 * 模拟商家订单列表
 */
async function mockGetMerchantOrders(params = {}) {
  await delay(300);
  let orders = mockOrders.filter(o => o.merchantId);
  
  if (params.status) {
    orders = orders.filter(o => o.status === params.status);
  }
  
  return {
    list: orders,
    total: orders.length
  };
}

async function getCurrentLocation() {
  await delay(150);
  return getDefaultLocation();
}

function chooseLocation() {
  return new Promise((resolve) => {
    wx.chooseLocation({
      success: (res) => {
        resolve({
          latitude: res.latitude,
          longitude: res.longitude,
          address: res.name || res.address || getDefaultLocation().address,
          detail: res.address || ''
        });
      },
      fail: () => {
        resolve(getDefaultLocation());
      }
    });
  });
}

module.exports = {
  mockLogin,
  mockRegister,
  mockGetOrderList,
  mockGetNearbyOrders,
  mockCreateOrder,
  mockAcceptOrder,
  mockGetConversationList,
  mockGetMessageList,
  mockSendMessage,
  mockGetUserInfo,
  mockGetMerchantInfo,
  mockMerchantRegister,
  mockGetOrderDetail,
  mockCancelOrder,
  mockCompleteOrder,
  mockGetMerchantOrders,
  // 获取模拟数据
  getMockOrders: () => mockOrders,
  getMockMerchants: () => mockMerchants,
  getMockUsers: () => mockUsers
};
