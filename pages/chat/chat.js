// pages/chat/chat.js - 聊天页
const app = getApp();
const util = require('../../utils/util');
const mockData = require('../../utils/mockData');

Page({
  data: {
    userId: '',
    merchantId: '',
    userInfo: null,
    targetInfo: null,
    messageList: [],
    inputText: '',
    showInput: true,
    loading: true,
    scrollToView: '',
    scrollWithAnimation: false
  },

  onLoad(options) {
    const { userId, merchantId } = options;
    this.setData({
      userId,
      merchantId
    });
    this.loadMessages();
  },

  onShow() {
    // 页面显示时可以刷新消息
  },

  // 加载消息列表
  async loadMessages() {
    this.setData({ loading: true });

    try {
      // 获取会话信息
      const userType = app.globalData.userType;
      let targetInfo;
      
      if (userType === 'client') {
        // 客户端获取商家信息
        const merchants = mockData.getMockMerchants();
        targetInfo = merchants.find(m => m.id === this.data.merchantId);
      } else {
        // 商家端获取客户信息
        const users = mockData.getMockUsers();
        targetInfo = users.find(u => u.id === this.data.userId);
      }

      // 获取消息列表
      const conversationId = `conv_${this.data.userId}_${this.data.merchantId}`;
      const messages = await mockData.mockGetMessageList(conversationId);
      
      // 获取用户信息
      const userInfo = app.globalData.userInfo;

      this.setData({
        userInfo,
        targetInfo,
        messageList: messages
      });

      // 滚动到底部
      this.scrollToBottom();

    } catch (err) {
      console.error('加载消息失败', err);
    } finally {
      this.setData({ loading: false });
    }
  },

  // 输入变化
  onInputChange(e) {
    this.setData({ inputText: e.detail.value });
  },

  // 发送消息
  async sendMessage() {
    const { inputText, userId, merchantId, userInfo } = this.data;
    
    if (!inputText.trim()) return;

    try {
      const userType = app.globalData.userType;
      const conversationId = `conv_${userId}_${merchantId}`;
      
      // 添加发送消息
      const sentMessage = {
        id: `msg_${Date.now()}`,
        senderId: userInfo.id,
        senderType: userType,
        senderName: userInfo.nickname,
        senderAvatar: userInfo.avatar,
        content: inputText,
        type: 'text',
        isSent: true,
        createdAt: util.formatDate(new Date(), 'HH:mm')
      };

      // 更新消息列表
      const newMessageList = [...this.data.messageList, sentMessage];
      this.setData({
        messageList: newMessageList,
        inputText: ''
      });

      // 滚动到底部
      this.scrollToBottom();

      // 模拟接收回复
      setTimeout(() => {
        this.simulateReply(inputText);
      }, 1500);

    } catch (err) {
      console.error('发送消息失败', err);
    }
  },

  // 模拟对方回复
  simulateReply(content) {
    const { userId, merchantId, targetInfo } = this.data;
    
    if (!targetInfo) return;

    const userType = app.globalData.userType;
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

    const newMessageList = [...this.data.messageList, replyMessage];
    this.setData({
      messageList: newMessageList
    });

    this.scrollToBottom();
  },

  // 生成回复内容
  generateReply(content) {
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

  // 滚动到底部
  scrollToBottom() {
    const messageId = this.data.messageList[this.data.messageList.length - 1]?.id;
    if (messageId) {
      this.setData({
        scrollToView: messageId,
        scrollWithAnimation: true
      });
    }
  },

  // 长按消息
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

  // 撤回消息
  recallMessage(index) {
    const messageList = [...this.data.messageList];
    messageList[index].content = '[消息已撤回]';
    messageList[index].recalled = true;
    
    this.setData({ messageList });
    util.showToast('消息已撤回');
  },

  // 语音输入
  onVoiceInput() {
    wx.showModal({
      title: '语音输入',
      content: '此功能开发中，敬请期待',
      showCancel: false
    });
  },

  // 选择图片
  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        
        // 模拟发送图片消息
        const sentMessage = {
          id: `msg_${Date.now()}`,
          senderId: app.globalData.userInfo.id,
          senderType: app.globalData.userType,
          senderName: app.globalData.userInfo.nickname,
          senderAvatar: app.globalData.userInfo.avatar,
          content: tempFilePath,
          type: 'image',
          isSent: true,
          createdAt: util.formatDate(new Date(), 'HH:mm')
        };

        const newMessageList = [...this.data.messageList, sentMessage];
        this.setData({
          messageList: newMessageList
        });

        this.scrollToBottom();
      }
    });
  },

  // 返回
  goBack() {
    wx.navigateBack();
  }
});
