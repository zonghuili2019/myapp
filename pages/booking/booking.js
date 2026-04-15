const app = getApp();
const util = require('../../utils/util');
const mockData = require('../../utils/mockData');

function pad(num) {
  return String(num).padStart(2, '0');
}

function getDateOffset(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function getNextHourTime() {
  const date = new Date(Date.now() + 60 * 60 * 1000);
  date.setMinutes(0, 0, 0);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

Page({
  data: {
    loading: true,
    submitting: false,
    merchantId: '',
    merchantInfo: null,
    minDate: getDateOffset(0),
    maxDate: getDateOffset(30),
    form: {
      serviceType: '',
      serviceDate: getDateOffset(0),
      serviceTime: getNextHourTime(),
      contactName: '',
      contactPhone: '',
      location: {
        latitude: '',
        longitude: '',
        address: ''
      },
      remark: ''
    }
  },

  onLoad(options) {
    this.initPage(options.merchantId || '');
  },

  async initPage(merchantId) {
    this.setData({ loading: true });

    try {
      const merchantInfo = await mockData.mockGetMerchantInfo(merchantId);
      const currentUser = await mockData.mockGetUserInfo(
        app.globalData.userInfo && app.globalData.userInfo.id
      );
      const defaultLocation = currentUser.location || await mockData.getCurrentLocation();

      this.setData({
        loading: false,
        merchantId: merchantInfo.id,
        merchantInfo,
        form: {
          serviceType: (merchantInfo.serviceTags && merchantInfo.serviceTags[0]) || merchantInfo.serviceCategory || '',
          serviceDate: getDateOffset(0),
          serviceTime: getNextHourTime(),
          contactName: currentUser.nickname || currentUser.name || '',
          contactPhone: currentUser.phone || '',
          location: defaultLocation,
          remark: ''
        }
      });
    } catch (err) {
      console.error('初始化预约页失败', err);
      util.showToastInfo('加载预约信息失败');
      setTimeout(() => {
        wx.navigateBack();
      }, 800);
    }
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`form.${field}`]: e.detail.value
    });
  },

  onDateChange(e) {
    this.setData({
      'form.serviceDate': e.detail.value
    });
  },

  onTimeChange(e) {
    this.setData({
      'form.serviceTime': e.detail.value
    });
  },

  async chooseLocation() {
    try {
      const location = await mockData.chooseLocation();
      this.setData({
        'form.location': location
      });
    } catch (err) {
      util.showToastInfo('选择服务地址失败');
    }
  },

  callMerchant() {
    if (this.data.merchantInfo && this.data.merchantInfo.phone) {
      util.makePhoneCall(this.data.merchantInfo.phone);
    }
  },

  openMerchantLocation() {
    if (this.data.merchantInfo && this.data.merchantInfo.location) {
      util.openLocation(
        this.data.merchantInfo.location.latitude,
        this.data.merchantInfo.location.longitude,
        this.data.merchantInfo.name
      );
    }
  },

  validateForm() {
    const { merchantInfo, form } = this.data;

    if (!merchantInfo || !merchantInfo.id) {
      util.showToastInfo('商家信息异常，请返回重试');
      return false;
    }

    if (!form.serviceType.trim()) {
      util.showToastInfo('请输入预约项目');
      return false;
    }

    if (!form.serviceDate) {
      util.showToastInfo('请选择预约日期');
      return false;
    }

    if (!form.serviceTime) {
      util.showToastInfo('请选择预约时间');
      return false;
    }

    if (!form.contactName.trim()) {
      util.showToastInfo('请输入联系人姓名');
      return false;
    }

    if (!/^1[3-9]\d{9}$/.test(form.contactPhone)) {
      util.showToastInfo('请输入正确的联系电话');
      return false;
    }

    if (!form.location.address) {
      util.showToastInfo('请选择服务地址');
      return false;
    }

    return true;
  },

  async submitBooking() {
    if (this.data.submitting) {
      return;
    }

    if (!this.validateForm()) {
      return;
    }

    this.setData({ submitting: true });

    try {
      const currentUser = await mockData.mockGetUserInfo(
        app.globalData.userInfo && app.globalData.userInfo.id
      );
      const result = await mockData.mockCreateAppointment({
        clientId: currentUser.id,
        merchantId: this.data.merchantId,
        serviceType: this.data.form.serviceType,
        serviceDate: this.data.form.serviceDate,
        serviceTime: this.data.form.serviceTime,
        contactName: this.data.form.contactName,
        contactPhone: this.data.form.contactPhone,
        location: this.data.form.location,
        remark: this.data.form.remark,
        estimatedPrice: this.data.merchantInfo.startingPrice * 100
      });

      util.showToast('预约提交成功');
      setTimeout(() => {
        wx.redirectTo({
          url: `/pages/orderDetail/orderDetail?id=${result.order.id}`
        });
      }, 800);
    } catch (err) {
      console.error('提交预约失败', err);
      util.showToastError('预约失败，请重试');
    } finally {
      this.setData({ submitting: false });
    }
  }
});
