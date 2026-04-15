const app = getApp();
const util = require('../../utils/util');
const mockData = require('../../utils/mockData');

const DEFAULT_CATEGORY = '全部';

function formatDistance(distance) {
  if (!distance) {
    return '就在附近';
  }

  if (distance < 1000) {
    return `${distance}m`;
  }

  return `${(distance / 1000).toFixed(distance >= 10000 ? 0 : 1)}km`;
}

function buildMapMarkers(currentLocation, merchantList) {
  const markers = [];

  if (currentLocation && currentLocation.latitude && currentLocation.longitude) {
    markers.push({
      id: 0,
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      width: 28,
      height: 32,
      callout: {
        content: '我的位置',
        display: 'ALWAYS',
        bgColor: '#07c160',
        color: '#ffffff',
        padding: 8,
        borderRadius: 12
      }
    });
  }

  merchantList.slice(0, 6).forEach((merchant, index) => {
    markers.push({
      id: index + 1,
      latitude: merchant.location.latitude,
      longitude: merchant.location.longitude,
      width: 30,
      height: 34,
      callout: {
        content: merchant.name,
        display: 'BYCLICK',
        padding: 8,
        borderRadius: 12
      }
    });
  });

  return markers;
}

Page({
  data: {
    loading: true,
    categoryList: [DEFAULT_CATEGORY],
    activeCategory: DEFAULT_CATEGORY,
    currentLocation: {},
    mapCenter: {
      latitude: 22.5431,
      longitude: 114.0579
    },
    mapMarkers: [],
    merchantList: [],
    summary: {
      total: 0,
      nearby: 0
    }
  },

  onLoad(options) {
    const activeCategory = options.category ? decodeURIComponent(options.category) : DEFAULT_CATEGORY;
    this.setData({ activeCategory }, () => {
      this.loadPage();
    });
  },

  onPullDownRefresh() {
    this.loadPage(true);
  },

  getCategoryList() {
    const categories = mockData.getMockMerchants()
      .map((merchant) => merchant.serviceCategory)
      .filter(Boolean);

    return [DEFAULT_CATEGORY].concat(Array.from(new Set(categories)));
  },

  async loadPage(fromPullDown = false) {
    this.setData({ loading: true });

    try {
      const currentLocation = await mockData.getCurrentLocation();
      const categoryList = this.getCategoryList();
      const activeCategory = categoryList.includes(this.data.activeCategory)
        ? this.data.activeCategory
        : DEFAULT_CATEGORY;
      const result = await mockData.mockGetMerchantList({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        category: activeCategory === DEFAULT_CATEGORY ? '' : activeCategory
      });

      const merchantList = (result.list || []).map((merchant) => ({
        ...merchant,
        distanceText: formatDistance(merchant.distance),
        startingPriceText: `¥${merchant.startingPrice}起`
      }));

      this.setData({
        categoryList,
        activeCategory,
        currentLocation,
        mapCenter: currentLocation,
        mapMarkers: buildMapMarkers(currentLocation, merchantList),
        merchantList,
        summary: {
          total: result.total || merchantList.length,
          nearby: merchantList.filter((merchant) => (merchant.distance || 0) <= 3000).length
        }
      });
    } catch (err) {
      console.error('加载商家列表失败', err);
      util.showToastInfo('加载商家列表失败');
    } finally {
      this.setData({ loading: false });
      if (fromPullDown) {
        wx.stopPullDownRefresh();
      }
    }
  },

  changeCategory(e) {
    const { category } = e.currentTarget.dataset;
    if (!category || category === this.data.activeCategory) {
      return;
    }

    this.setData({ activeCategory: category }, () => {
      this.loadPage();
    });
  },

  refreshLocation() {
    this.loadPage();
  },

  onMarkerTap(e) {
    const markerId = e.detail.markerId;
    if (!markerId) {
      return;
    }

    const merchant = this.data.merchantList[markerId - 1];
    if (merchant) {
      util.openLocation(
        merchant.location.latitude,
        merchant.location.longitude,
        merchant.name
      );
    }
  },

  callMerchant(e) {
    const { phone } = e.currentTarget.dataset;
    util.makePhoneCall(phone);
  },

  openLocation(e) {
    const { latitude, longitude, name } = e.currentTarget.dataset;
    util.openLocation(Number(latitude), Number(longitude), name);
  },

  goBooking(e) {
    if ((app.globalData.userType || 'client') !== 'client') {
      util.showToastInfo('请使用用户账号预约服务');
      return;
    }

    const { id } = e.currentTarget.dataset;
    util.navigateTo('/pages/booking/booking', { merchantId: id });
  }
});
