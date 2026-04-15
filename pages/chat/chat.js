// pages/chat/chat.js - 聊天页
const app = getApp();
const util = require('../../utils/util');
const mockData = require('../../utils/mockData');

const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=chat-default';

function getConversationId(userId, merchantId) {
  return `conv_${userId}_${merchantId}`;
}

function normalizeTargetInfo(targetInfo, fallbackName) {
  if (!targetInfo) {
    return {
      id: '',
      nickname: fallbackName,
      name: fallbackName,
      avatar: DEFAULT_AVATAR
    };
  }

  return {
    ...targetInfo,
    nickname: targetInfo.nickname || targetInfo.name || fallbackName,
    name: targetInfo.name || targetInfo.nickname || fallbackName,
    avatar: targetInfo.avatar || targetInfo.logo || DEFAULT_AVATAR
  };
}

Page({
  data: {
    userId: '',
    merchantId: '',
    userInfo: null,
    targetInfo: null,
    messageList: [],
    inputText: '',
    loading: true,
    scrollToView: '',
    scrollWithAnimation: false
  },

  onLoad(options) {
    const resolvedParams = this.resolveConversationParams(options || {});
    this.setData(resolvedParams);
    this.loadMessages();
  },

  resolveConversationParams(options) {
    const userType = app.globalData.userType || 'client';
    const currentUser = app.globalData.userInfo || {};
    const orders = mockData.getMockOrders();
    const fallbackOrder = orders.find((order) => order.merchantId) || orders[0] || {};

    let userId = options.userId || (userType === 'client' ? currentUser.id : fallbackOrder.clientId) || 'user_001';
    let merchantId = options.merchantId || (userType === 'merchant' ? currentUser.id : fallbackOrder.merchantId) || 'merchant_001';

    if (!merchantId) {
      merchantId = fallbackOrder.merchantId || 'merchant_001';
    }

    if (!userId) {
      userId = fallbackOrder.clientId || 'user_001';
    }

    return { userId, merchantId };
  },

  async loadMessages() {
    this.setData({ loading: true });

    try {
      const userType = app.globalData.userType || 'client';
      const rawUserInfo = app.globalData.userInfo || (userType === 'merchant'
        ? mockData.getMockMerchants()[0]
        : mockData.getMockUsers()[0]);
      const userInfo = normalizeTargetInfo(rawUserInfo, '我');
      const targetSource = userType === 'client'
        ? mockData.getMockMerchants().find((merchant) => merchant.id === this.data.merchantId)
        : mockData.getMockUsers().find((user) => user.id === this.data.userId);
      const targetInfo = normalizeTargetInfo(targetSource, '在线联系');
      const messageResult = await mockData.mockGetMessageList(getConversationId(this.data.userId, this.data.merchantId));
      const messages = this.normalizeMessageList((messageResult && messageResult.messages) || [], userInfo);

      this.setData({
        userInfo,
        targetInfo,
        messageList: messages
      });

      this.scrollToBottom();
    } catch (err) {
      console.error('加载消息失败', err);
      this.setData({
        targetInfo: normalizeTargetInfo(null, '在线联系'),
        messageList: []
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  normalizeMessageList(messageList, userInfo) {
    const users = mockData.getMockUsers();
    const merchants = mockData.getMockMerchants();

    return (messageList || []).map((message) => {
      const source = message.senderType === 'merchant'
        ? merchants.find((merchant) => merchant.id === message.senderId)
        : users.find((user) => user.id === message.senderId);
      const normalizedSource = normalizeTargetInfo(source, message.senderType === 'merchant' ? '商家' : '用户');

      return {
        ...message,
        senderName: message.senderName || normalizedSource.nickname || normalizedSource.name,
        senderAvatar: message.senderAvatar || normalizedSource.avatar,
        isSent: message.senderId === userInfo.id || !!message.isSent
      };
    });
  },

  onInputChange(e) {
    this.setData({ inputText: e.detail.value });
  },

  sendMessage() {
    const { inputText, userId, merchantId, userInfo } = this.data;

    if (!inputText.trim()) {
      return;
    }

    const userType = app.globalData.userType || 'client';
    const sentMessage = {
      id: `msg_${Date.now()}`,
      senderId: userInfo.id,
      senderType: userType,
      senderName: userInfo.nickname || userInfo.name,
      senderAvatar: userInfo.avatar,
      content: inputText,
      type: 'text',
      isSent: true,
      createdAt: util.formatDate(new Date(), 'HH:mm')
    };

    const newMessageList = this.data.messageList.concat(sentMessage);
    this.setData({
      messageList: newMessageList,
      inputText: ''
    });

    mockData.mockSendMessage({
      userId,
      merchantId,
      senderId: userInfo.id,
      senderType: userType,
      content: inputText
    });

    this.scrollToBottom();

    setTimeout(() => {
      this.simulateReply(inputText);
    }, 800);
  },

  simulateReply(content) {
    const { userId, merchantId, targetInfo } = this.data;
    const userType = app.globalData.userType || 'client';

    const replyMessage = {
      id: `msg_${Date.now()}`,
      senderId: userType === 'client' ? merchantId : userId,
      senderType: userType === 'client' ? 'merchant' : 'client',
      senderName: targetInfo.nickname || targetInfo.name,
      senderAvatar: targetInfo.avatar,
      content: this.generateReply(content),
      type: 'text',
      isSent: false,
      createdAt: util.formatDate(new Date(), 'HH:mm')
    };

    this.setData({
      messageList: this.data.messageList.concat(replyMessage)
    });

    this.scrollToBottom();
  },

  generateReply() {
    const replies = [
      '好的，我收到了，正在处理中。',
      '没问题，我会尽快为您处理。',
      '收到，预计15分钟内到达。',
      '好的，有什么需要随时告诉我。',
      '没问题，您放心好了。',
      '好的，我这就去办理。'
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  },

  scrollToBottom() {
    const messageList = this.data.messageList;
    const lastMessage = messageList[messageList.length - 1];

    if (lastMessage && lastMessage.id) {
      this.setData({
        scrollToView: lastMessage.id,
        scrollWithAnimation: true
      });
    }
  },

  onLongPress(e) {
    const { index } = e.currentTarget.dataset;
    const message = this.data.messageList[index];

    if (message && message.isSent) {
      wx.showActionSheet({
        itemList: ['撤回消息'],
        success: (res) => {
          if (res.tapIndex === 0) {
            this.recallMessage(index);
          }
        }
      });
    }
  },

  recallMessage(index) {
    const messageList = this.data.messageList.slice();
    messageList[index].content = '[消息已撤回]';
    messageList[index].recalled = true;
    this.setData({ messageList });
    util.showToast('消息已撤回');
  },

  onVoiceInput() {
    wx.showModal({
      title: '语音输入',
      content: '此功能开发中，敬请期待',
      showCancel: false
    });
  },

  chooseImage() {
    const userInfo = this.data.userInfo;

    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        const sentMessage = {
          id: `msg_${Date.now()}`,
          senderId: userInfo.id,
          senderType: app.globalData.userType || 'client',
          senderName: userInfo.nickname || userInfo.name,
          senderAvatar: userInfo.avatar,
          content: tempFilePath,
          type: 'image',
          isSent: true,
          createdAt: util.formatDate(new Date(), 'HH:mm')
        };

        this.setData({
          messageList: this.data.messageList.concat(sentMessage)
        });

        this.scrollToBottom();
      }
    });
  },

  goBack() {
    wx.navigateBack();
  }
});
