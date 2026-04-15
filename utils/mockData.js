// utils/mockData.js - 模拟数据（开发测试用）

const util = require('./util');

const DEFAULT_LOCATION = {
  latitude: 22.5431,
  longitude: 114.0579,
  address: '深圳市南山区科技园'
};

function buildConversationId(userId, merchantId) {
  return `conv_${userId}_${merchantId}`;
}

function getDefaultLocation() {
  return util.deepClone(DEFAULT_LOCATION);
}

function buildOrderNo(index) {
  return `20260415${String(index).padStart(3, '0')}`;
}

// 模拟延迟
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 模拟用户数据
const mockUsers = [
  {
    id: 'user_001',
    nickname: '小明',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
    phone: '13800138101',
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
    phone: '13900139102',
    userType: 'client',
    location: {
      latitude: 22.545,
      longitude: 114.055,
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
    phone: '13800139012',
    location: {
      latitude: 22.54,
      longitude: 114.05,
      address: '深圳市南山区跑腿服务站'
    },
    rating: 4.8,
    description: '提供文件取送、代买代送、即时配送等高频同城服务。',
    serviceCategory: '跑腿代送',
    serviceTags: ['文件取送', '代买代送', '即时配送'],
    startingPrice: 18,
    monthlyOrders: 286,
    eta: '15分钟起'
  },
  {
    id: 'merchant_002',
    name: '安心代驾',
    logo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=merchant2',
    phone: '13900133456',
    location: {
      latitude: 22.548,
      longitude: 114.06,
      address: '深圳市南山区代驾服务中心'
    },
    rating: 4.6,
    description: '专业司机随叫随到，支持酒后代驾、接送代驾、长途代驾。',
    serviceCategory: '代驾服务',
    serviceTags: ['酒后代驾', '接送代驾', '长途代驾'],
    startingPrice: 58,
    monthlyOrders: 174,
    eta: '20分钟起'
  },
  {
    id: 'merchant_003',
    name: '邻里家政到家',
    logo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=merchant3',
    phone: '13700137654',
    location: {
      latitude: 22.5468,
      longitude: 114.0532,
      address: '深圳市南山区家政服务驿站'
    },
    rating: 4.9,
    description: '提供保洁、深度清洗、收纳整理等上门家政服务。',
    serviceCategory: '家政服务',
    serviceTags: ['日常保洁', '深度清洁', '收纳整理'],
    startingPrice: 88,
    monthlyOrders: 213,
    eta: '2小时内上门'
  },
  {
    id: 'merchant_004',
    name: '闪电维修师傅',
    logo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=merchant4',
    phone: '13600136678',
    location: {
      latitude: 22.551,
      longitude: 114.0625,
      address: '深圳市南山区便民维修点'
    },
    rating: 4.7,
    description: '覆盖水电维修、家电故障排查、门锁安装等本地维修需求。',
    serviceCategory: '维修服务',
    serviceTags: ['水电维修', '家电检修', '门锁安装'],
    startingPrice: 66,
    monthlyOrders: 196,
    eta: '30分钟响应'
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
    clientPhone: '13800138101',
    clientLocation: {
      latitude: 22.5431,
      longitude: 114.0579,
      address: '深圳市南山区科技园'
    },
    title: '文件取送',
    description: '需要从科技园取一份合同文件送到福田区',
    status: 'pending',
    createdAt: '2026-04-15 10:30:00',
    price: 2500
  },
  {
    id: 'order_002',
    orderId: '20260415002',
    clientId: 'user_002',
    merchantId: null,
    clientName: '小红',
    clientPhone: '13900139102',
    clientLocation: {
      latitude: 22.545,
      longitude: 114.055,
      address: '深圳市南山区商业中心'
    },
    title: '代买午餐',
    description: '帮我买一份宫保鸡丁和一份米饭',
    status: 'pending',
    createdAt: '2026-04-15 11:00:00',
    price: 3500
  },
  {
    id: 'order_003',
    orderId: '20260415003',
    clientId: 'user_001',
    merchantId: 'merchant_001',
    clientName: '小明',
    clientPhone: '13800138101',
    clientLocation: {
      latitude: 22.5431,
      longitude: 114.0579,
      address: '深圳市南山区科技园'
    },
    title: '药品配送',
    description: '急需感冒药，尽快送达',
    status: 'accepted',
    createdAt: '2026-04-15 09:00:00',
    price: 1800
  }
];

const mockAppointments = [];

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
async function mockLogin() {
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
    location: data.location || getDefaultLocation()
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
    orders = orders.filter((order) => order.status === params.status);
  }

  const userType = wx.getStorageSync('userType');
  if (userType === 'merchant') {
    orders = orders.filter((order) => order.merchantId);
  }

  return {
    list: orders,
    total: orders.length
  };
}

/**
 * 模拟获取商家列表
 */
async function mockGetMerchantList(params = {}) {
  await delay(300);
  const center = {
    lat: params.latitude || DEFAULT_LOCATION.latitude,
    lng: params.longitude || DEFAULT_LOCATION.longitude
  };

  let merchants = mockMerchants.map((merchant) => {
    const distance = util.getDistance(
      center.lat,
      center.lng,
      merchant.location.latitude,
      merchant.location.longitude
    );

    return {
      ...merchant,
      distance: Math.round(distance * 1000)
    };
  });

  if (params.category) {
    merchants = merchants.filter((merchant) => merchant.serviceCategory === params.category);
  }

  merchants.sort((a, b) => a.distance - b.distance || b.rating - a.rating);

  return {
    list: merchants,
    total: merchants.length
  };
}

/**
 * 模拟获取附近订单
 */
async function mockGetNearbyOrders(params = {}) {
  await delay(500);
  const { latitude, longitude, radius = 3000 } = params;
  const center = {
    lat: latitude || DEFAULT_LOCATION.latitude,
    lng: longitude || DEFAULT_LOCATION.longitude
  };

  const nearbyOrders = mockOrders
    .filter((order) => !order.merchantId)
    .map((order) => {
      const distance = util.getDistance(
        center.lat,
        center.lng,
        order.clientLocation.latitude,
        order.clientLocation.longitude
      );

      return {
        ...order,
        distance: Math.round(distance * 1000)
      };
    })
    .filter((order) => order.distance <= radius)
    .sort((a, b) => a.distance - b.distance);

  return {
    list: nearbyOrders,
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
    orderId: buildOrderNo(mockOrders.length + 1),
    clientId: data.clientId,
    merchantId: data.merchantId || null,
    clientName: data.clientName,
    clientPhone: data.clientPhone,
    clientLocation: data.location || getDefaultLocation(),
    title: data.title,
    description: data.description,
    status: data.status || 'pending',
    createdAt: util.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
    price: data.price || Math.floor(Math.random() * 50 + 10) * 100
  };

  if (data.extra) {
    Object.assign(newOrder, data.extra);
  }

  mockOrders.unshift(newOrder);
  return newOrder;
}

/**
 * 模拟创建预约
 */
async function mockCreateAppointment(data) {
  await delay(350);

  if (!data || !data.merchantId || !data.serviceType || !data.serviceDate || !data.serviceTime) {
    throw new Error('预约信息不完整');
  }

  if (!data.contactName || !data.contactPhone || !data.location || !data.location.address) {
    throw new Error('联系人信息不完整');
  }

  const merchant = mockMerchants.find((item) => item.id === data.merchantId);
  if (!merchant) {
    throw new Error('商家不存在');
  }

  const createdAt = util.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss');
  const appointment = {
    id: `booking_${Date.now()}`,
    merchantId: merchant.id,
    merchantName: merchant.name,
    merchantPhone: merchant.phone,
    clientId: data.clientId || mockUsers[0].id,
    contactName: data.contactName,
    contactPhone: data.contactPhone,
    location: util.deepClone(data.location),
    serviceType: data.serviceType,
    serviceDate: data.serviceDate,
    serviceTime: data.serviceTime,
    remark: data.remark || '',
    createdAt,
    status: 'pending'
  };

  mockAppointments.unshift(appointment);

  const order = await mockCreateOrder({
    clientId: appointment.clientId,
    merchantId: merchant.id,
    clientName: data.contactName,
    clientPhone: data.contactPhone,
    location: data.location,
    title: `${data.serviceType}预约`,
    description: `已预约 ${merchant.name}，上门时间 ${data.serviceDate} ${data.serviceTime}${data.remark ? `，备注：${data.remark}` : ''}`,
    status: 'pending',
    price: data.estimatedPrice || merchant.startingPrice * 100,
    extra: {
      appointmentId: appointment.id,
      appointmentDate: data.serviceDate,
      appointmentTime: data.serviceTime,
      serviceType: data.serviceType
    }
  });

  return {
    appointment,
    order
  };
}

/**
 * 模拟接单
 */
async function mockAcceptOrder(orderId, merchantId) {
  await delay(300);
  const order = mockOrders.find((item) => item.id === orderId);

  if (!order) {
    throw new Error('订单不存在');
  }

  order.merchantId = merchantId;
  order.status = 'accepted';
  return order;
}

/**
 * 模拟获取会话列表
 */
async function mockGetConversationList() {
  await delay(300);
  return mockMessages.map((conversation) => ({
    id: conversation.conversationId,
    userId: conversation.userId,
    merchantId: conversation.merchantId,
    lastMessage: conversation.messages[conversation.messages.length - 1],
    unreadCount: 0,
    createdAt: conversation.messages[0] && conversation.messages[0].createdAt
  }));
}

/**
 * 模拟获取消息列表
 */
async function mockGetMessageList(conversationId) {
  await delay(300);
  const conversation = mockMessages.find((item) => item.conversationId === conversationId);
  return conversation ? { messages: conversation.messages } : { messages: [] };
}

/**
 * 模拟发送消息
 */
async function mockSendMessage(data) {
  await delay(300);
  const conversationId = buildConversationId(data.userId, data.merchantId);
  const conversation = mockMessages.find((item) => item.conversationId === conversationId);

  const newMessage = {
    id: `msg_${Date.now()}`,
    senderId: data.senderId,
    senderType: data.senderType,
    content: data.content,
    type: data.type || 'text',
    createdAt: util.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
  };

  if (conversation) {
    conversation.messages.push(newMessage);
  } else {
    mockMessages.push({
      conversationId,
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
async function mockGetUserInfo(userId) {
  await delay(200);
  if (!userId) {
    return mockUsers[0];
  }
  return mockUsers.find((user) => user.id === userId) || mockUsers[0];
}

/**
 * 模拟获取商家信息
 */
async function mockGetMerchantInfo(merchantId) {
  await delay(200);
  if (!merchantId) {
    return mockMerchants[0];
  }
  return mockMerchants.find((merchant) => merchant.id === merchantId) || mockMerchants[0];
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
    location: data.location || getDefaultLocation(),
    rating: 5,
    description: data.description || '',
    serviceCategory: '其他服务',
    serviceTags: ['预约服务'],
    startingPrice: 30,
    monthlyOrders: 0,
    eta: '随时预约'
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
  const order = mockOrders.find((item) => item.id === orderId);
  if (!order) {
    throw new Error('订单不存在');
  }
  return order;
}

/**
 * 模拟取消订单
 */
async function mockCancelOrder(orderId) {
  await delay(300);
  const order = mockOrders.find((item) => item.id === orderId);
  if (!order) {
    throw new Error('订单不存在');
  }
  order.status = 'cancelled';
  return order;
}

/**
 * 模拟完成订单
 */
async function mockCompleteOrder(orderId) {
  await delay(300);
  const order = mockOrders.find((item) => item.id === orderId);
  if (!order) {
    throw new Error('订单不存在');
  }
  order.status = 'completed';
  return order;
}

/**
 * 模拟商家订单列表
 */
async function mockGetMerchantOrders(params = {}) {
  await delay(300);
  let orders = mockOrders.filter((order) => order.merchantId);

  if (params.status) {
    orders = orders.filter((order) => order.status === params.status);
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
  mockGetMerchantList,
  mockGetNearbyOrders,
  mockCreateOrder,
  mockCreateAppointment,
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
  getCurrentLocation,
  chooseLocation,
  getDefaultLocation,
  getMockOrders: () => mockOrders,
  getMockMerchants: () => mockMerchants,
  getMockUsers: () => mockUsers,
  getMockAppointments: () => mockAppointments
};
