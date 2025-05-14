<template>
  <!-- 筛选条件区域 -->
  <view class="filter-wrapper">
    <view class="filter-item">
      <view class="filter-label">专长领域</view>
      <picker :range="categories" :value="categoryIndex" @change="onCategoryChange" class="filter-picker">
        <view class="picker-value">
          {{ currentTag }}
          <uni-icons type="bottom" size="14" color="#666"></uni-icons>
        </view>
      </picker>
    </view>
    
    <view class="filter-item">
      <view class="filter-label">所在地区</view>
      <picker mode="multiSelector" :range="regionArray" :value="regionIndex" 
          @columnchange="onRegionColumnChange" @change="onRegionChange" class="filter-picker">
        <view class="picker-value">
          {{ currentRegion }}
          <uni-icons type="bottom" size="14" color="#666"></uni-icons>
        </view>
      </picker>
    </view>
    
    <view class="filter-item">
      <view class="filter-label">执业年限</view>
      <picker :range="experienceOptions" :value="experienceIndex" @change="onExperienceChange" class="filter-picker">
        <view class="picker-value">
          {{ currentExperience }}
          <uni-icons type="bottom" size="14" color="#666"></uni-icons>
        </view>
      </picker>
    </view>
  </view>

  <!-- 搜索框 -->
  <view class="search-container">
    <view class="search-box">
      <uni-icons type="search" size="18" color="#718096"></uni-icons>
      <input
          type="text"
          class="search-input"
          placeholder="搜索律师名称、专长领域"
          confirm-type="search"
          v-model="searchKeyword"
          @input="debounceSearch"
      />
      <view v-if="searchKeyword" class="clear-icon" @click="clearSearch">
        <uni-icons type="clear" size="14" color="#718096"></uni-icons>
      </view>
    </view>
    <view class="search-btn" @click="searchLawyers">搜索</view>
  </view>

  <view class="lawyer-list">
    <!-- 搜索中状态 -->
    <view v-if="loading" class="loading-container">
      <view class="loading">搜索中...</view>
    </view>

    <!-- 无搜索结果 -->
    <view v-else-if="filterLawyerList.length === 0 && searchKeyword" class="empty-result">
      <uni-icons type="info" size="32" color="#cecece"></uni-icons>
      <text class="empty-text">没有找到"{{ searchKeyword }}"相关的律师</text>
    </view>

    <!-- 搜索结果列表 -->
    <template v-else>
      <view
          v-for="(lawyer, index) in filterLawyerList"
          :key="lawyer.id"
          class="lawyer-card"
          @click="handleClick(lawyer)"
      >
        <view class="lawyer-header">
          <image class="avatar" :src="lawyer.avatar" mode="aspectFill" />
          <view class="lawyer-info">
            <view class="name-line">
              <text class="name">{{ lawyer.lawyerName }}</text>
              <text class="cert-badge">律师认证</text>
              <text v-if="lawyer.recommend" class="recommend-badge">平台优选</text>
            </view>
            <view class="stats">
              <text>咨询人数 {{ lawyer.consultCount || 0 }}</text>
              <text class="score">用户评分 {{ lawyer.rating || '暂无' }}</text>
            </view>
            <view class="expertise">{{ formatExpertise(lawyer) }}</view>
            <view class="location">{{ formatLocation(lawyer) }}</view>
          </view>
        </view>
        <view class="price-line">
          <text class="price">¥{{ lawyer.price || 0 }}/30分钟</text>
          <text class="consult-type">电话咨询</text>
        </view>
      </view>

      <!-- 底部状态显示 -->
      <view v-if="filterLawyerList.length > 0 && !noMore" class="list-footer">
        <view class="loading">加载更多中...</view>
      </view>
      <view v-else-if="filterLawyerList.length > 0" class="list-footer">
        <view class="no-more">没有更多了</view>
      </view>
      <view v-else-if="filterLawyerList.length === 0 && !loading" class="empty-result">
        <uni-icons type="info" size="32" color="#cecece"></uni-icons>
        <text class="empty-text">暂无律师信息</text>
      </view>
    </template>
  </view>
</template>


<script setup>
import {navigateToUrl} from "@/utils/navigateTo";
import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {apiSearchLawyers} from "@/api/lawyerapi" 
//import {apiGetProvinces, apiGetCitiesByProvince} from "@/api/regionapi" // 新增地区API

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const isSearchMode = ref(false) // 是否搜索模式

// 接收搜索关键词参数
const props = defineProps({
  externalSearchKeyword: {
    type: String,
    default: ''
  }
});

// 搜索关键词
const searchKeyword = ref('');

// 专长领域数据
const categories = ref([
  '全部', '刑事案件', '经济纠纷', '劳动纠纷', '工伤纠纷',
  '退费纠纷', '交通事故', '房产纠纷', '征地拆迁',
  '离婚纠纷', '债务协商', '更多领域'
]);
const commonCategories = ['刑事案件', '经济纠纷', '劳动纠纷', '工伤纠纷', '退费纠纷', '交通事故', '房产纠纷', '征地拆迁', '离婚纠纷', '债务协商'];
const currentTag = ref('全部'); // 当前选中的标签
const categoryIndex = ref(0); // 当前选中的标签索引

// 省市数据
const provinces = ref([{code: '', name: '全部'}]);
const cities = ref([{code: '', name: '全部'}]);
const regionArray = ref([['全部'], ['全部']]);
const regionIndex = ref([0, 0]);
const currentRegion = ref('全部');
const selectedProvince = ref('');
const selectedCity = ref('');

// 执业年限选项
const experienceOptions = ref(['全部', '3年以下', '3-5年', '5-10年', '10年以上']);
const experienceIndex = ref(0);
const currentExperience = ref('全部');

const lawyerList = ref([]); // 律师列表数据

// 定义搜索状态
const loading = ref(false);
const noMore = ref(false);

// 加载省份数据
const loadProvinces = async () => {
  try {
    const response = null;//await apiGetProvinces();
    if (response && response.data) {
      // 确保第一个选项是"全部"
      const allProvinces = [{code: '', name: '全部'}, ...response.data];
      provinces.value = allProvinces;
      regionArray.value[0] = allProvinces.map(item => item.name);
    }
  } catch (error) {
    console.error('获取省份数据失败:', error);
    uni.showToast({title: '获取省份数据失败', icon: 'none'});
  }
};

// 加载城市数据
const loadCities = async (provinceCode) => {
  try {
    if (!provinceCode) {
      // 重置为默认"全部"
      cities.value = [{code: '', name: '全部'}];
      regionArray.value[1] = ['全部'];
      return;
    }
    
    const response = null;//await apiGetCitiesByProvince(provinceCode);
    if (response && response.data) {
      // 确保第一个选项是"全部"
      const allCities = [{code: '', name: '全部'}, ...response.data];
      cities.value = allCities;
      regionArray.value[1] = allCities.map(item => item.name);
    }
  } catch (error) {
    console.error('获取城市数据失败:', error);
    uni.showToast({title: '获取城市数据失败', icon: 'none'});
  }
};

// 处理专长领域选择
const onCategoryChange = (e) => {
  const index = e.detail.value;
  categoryIndex.value = index;
  currentTag.value = categories.value[index];
  searchLawyers();
};

// 处理地区选择器列变化
const onRegionColumnChange = async (e) => {
  const { column, value } = e.detail;
  
  if (column === 0) { // 省份列变化
    regionIndex.value[0] = value;
    // 当选择新的省份时，重置城市选择
    if (value === 0) {
      // 选择了"全部"省份
      selectedProvince.value = '';
      await loadCities('');
    } else {
      // 选择了特定省份
      const province = provinces.value[value];
      selectedProvince.value = province.code;
      await loadCities(province.code);
    }
    regionIndex.value[1] = 0;
    selectedCity.value = '';
  } else if (column === 1) { // 城市列变化
    regionIndex.value[1] = value;
    if (value === 0) {
      selectedCity.value = '';
    } else {
      selectedCity.value = cities.value[value].code;
    }
  }
};

// 处理地区最终选择
const onRegionChange = (e) => {
  const [provinceIdx, cityIdx] = e.detail.value;
  regionIndex.value = [provinceIdx, cityIdx];
  
  if (provinceIdx === 0) {
    // 选择全部省份
    currentRegion.value = '全部';
    selectedProvince.value = '';
    selectedCity.value = '';
  } else {
    const provinceName = regionArray.value[0][provinceIdx];
    
    if (cityIdx === 0) {
      // 选择了省份但是城市选择全部
      currentRegion.value = provinceName;
      selectedProvince.value = provinces.value[provinceIdx].code;
      selectedCity.value = '';
    } else {
      // 选择了特定省份和特定城市
      const cityName = regionArray.value[1][cityIdx];
      currentRegion.value = `${provinceName} ${cityName}`;
      selectedProvince.value = provinces.value[provinceIdx].code;
      selectedCity.value = cities.value[cityIdx].code;
    }
  }
  
  searchLawyers();
};

// 处理执业年限选择
const onExperienceChange = (e) => {
  const index = e.detail.value;
  experienceIndex.value = index;
  currentExperience.value = experienceOptions.value[index];
  searchLawyers();
};

// 监听外部搜索关键词变化
watch(() => props.externalSearchKeyword, (newValue) => {
  searchKeyword.value = newValue;
  searchLawyers();
});

// 加载律师数据
const fetchLawyers = async (loadMore = false) => {
  try {
    if (loading.value || (noMore.value && loadMore)) return;

    loading.value = true;
    if (!loadMore) {
      currentPage.value = 1;
      lawyerList.value = [];
      noMore.value = false; // 重置加载状态
    }

    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value
    };
    
    // 处理专业领域
    if (currentTag.value !== '全部') {
      if (currentTag.value === '更多领域') {
        // "更多领域"分类逻辑：排除常见领域的律师
        params.excludeSpecialties = commonCategories;
      } else {
        // 常规分类
        params.specialty = currentTag.value;
      }
    }

    // 处理地区筛选
    if (selectedProvince.value) {
      params.provinceCode = selectedProvince.value;
      if (selectedCity.value) {
        params.cityCode = selectedCity.value;
      }
    }

    // 处理执业年限筛选
    if (currentExperience.value !== '全部') {
      switch(currentExperience.value) {
        case '3年以下':
          params.experienceMin = 0;
          params.experienceMax = 3;
          break;
        case '3-5年':
          params.experienceMin = 3;
          params.experienceMax = 5;
          break;
        case '5-10年':
          params.experienceMin = 5;
          params.experienceMax = 10;
          break;
        case '10年以上':
          params.experienceMin = 10;
          break;
      }
    }

    console.log('请求参数:', JSON.stringify(params));
    const response = await apiSearchLawyers(params);
    console.log('响应数据:', JSON.stringify(response));

    if (response && response.data) {
      total.value = response.total || 0;
      const processedData = (response.data || []).map(lawyer => {
        // 处理头像数据
        let avatarUrl = '/static/avatar-default.png';
        if (lawyer.imageData && lawyer.imageType) {
          const imageType = lawyer.imageType === 'image/jpg' ? 'image/jpeg' : lawyer.imageType;
          avatarUrl = `data:${imageType};base64,${lawyer.imageData}`;
        }

        return {
          ...lawyer,
          avatar: avatarUrl,
          consultCount: lawyer.consultCount || 0,
          price: lawyer.price || 48
        };
      });

      if (loadMore) {
        lawyerList.value = [...lawyerList.value, ...processedData];
      } else {
        lawyerList.value = processedData;
      }

      noMore.value = lawyerList.value.length >= total.value;
      if (!noMore.value) {
        currentPage.value++;
      }
    } else {
      console.error('接口返回异常:', response);
      uni.showToast({title: '数据加载异常', icon: 'none'});
    }
  } catch (error) {
    console.error('获取数据失败:', error);
    uni.showToast({title: '加载失败', icon: 'none'});
  } finally {
    loading.value = false;
  }
};

// 防抖函数
let searchTimeout = null;
const debounceSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchLawyers();
  }, 500);
};

// 清除搜索
const clearSearch = () => {
  searchKeyword.value = '';
  searchLawyers();
};

// 搜索律师
const searchLawyers = async () => {
  isSearchMode.value = !!searchKeyword.value || 
                       currentTag.value !== '全部' || 
                       currentRegion.value !== '全部' ||
                       currentExperience.value !== '全部';
  await fetchLawyers(false); // 传入false强制重新从第一页开始加载
};

// 格式化专长信息
const formatExpertise = (lawyer) => {
  if (lawyer.lawyerSpecialtyRelationVolist && lawyer.lawyerSpecialtyRelationVolist.length > 0) {
    return lawyer.lawyerSpecialtyRelationVolist
        .map(relation => relation.lawyerSpecialtyVo?.specialtyName)
        .filter(Boolean)
        .join('、');
  }
  return lawyer.lawyerIntroduction || '专业律师';
};

// 格式化地理位置
const formatLocation = (lawyer) => {
  // 将编码转换为可读地址，这里需要根据实际的省市区编码映射
  // 简化处理：如果没有编码，返回默认值
  if (!lawyer.provinceCode && !lawyer.cityCode && !lawyer.districtCode) {
    return '未知地区';
  }

  // 这里可以根据实际情况从缓存或配置中获取省市区名称
  // 简化示例：
  const provinces = {'330000': '浙江省'};
  const cities = {'330100': '杭州市'};
  const districts = {'330102': '上城区'};

  const province = provinces[lawyer.provinceCode] || lawyer.provinceCode || '';
  const city = cities[lawyer.cityCode] || lawyer.cityCode || '';
  const district = districts[lawyer.districtCode] || lawyer.districtCode || '';

  return `${province} ${city} ${district}`.trim();
};

// 滚动监听
const handleScroll = () => {
  // 获取可见区域高度
  const windowHeight = uni.getSystemInfoSync().windowHeight;
  // 获取滚动位置
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  // 获取内容总高度
  const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

  // 当滚动到距离底部50px时，加载更多
  if (scrollHeight - scrollTop - windowHeight < 50) {
    if (!noMore.value && !loading.value) {
      fetchLawyers(true);
    }
  }
};

// 挂载时添加滚动监听
onMounted(async () => {
  await loadProvinces(); // 先加载省份数据
  fetchLawyers(); // 初始加载所有律师数据
  window.addEventListener('scroll', handleScroll);
});

// 卸载时移除监听
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

// 计算属性
const filterLawyerList = computed(() => {
  return lawyerList.value;
});

// 页面跳转
function handleClick(lawyer) {
  // 跳转到律师详情页
  navigateToUrl(`/pages/lawyer/lawyerinfo?lawyerId=${lawyer.id}`);
}

// 暴露方法供父组件调用
defineExpose({
  searchLawyers
});
</script>

<style scoped>
/* 颜色变量 */
:root {
  --primary-color: #007AFF;
  --danger-color: #ff4444;
  --warning-color: #ff9900;
  --success-color: #4CD964;
  --text-primary: #333;
  --text-secondary: #666;
  --text-tertiary: #999;
  --bg-color: #f9f9f9;
  --card-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

/* 优化后的筛选器样式 */
.filter-wrapper {
  background: #fff;
  padding: 24rpx 32rpx;
  margin-bottom: 24rpx;
  display: flex;
  gap: 28rpx;
  flex-wrap: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.filter-item {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 16rpx;
  position: relative;
}

.filter-item:first-child {
  margin-left: 0;
}

.filter-item:last-child {
  margin-right: 0;
}

/* 标签样式增强 */
.filter-label {
  font-size: 26rpx;
  color: var(--text-primary);
  font-weight: 500;
  white-space: nowrap;
  position: relative;
  padding-right: 12rpx;
}
/* 添加装饰分隔线 */
.filter-label::after {
  content: "";
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 24rpx;
  width: 1px;
  background: #e5e7eb;
}

.filter-picker {
  position: relative;
}

/* 选择器样式升级 */
.picker-value {
  display: flex;
  align-items: center;
  gap: 8rpx;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 40rpx;
  padding: 16rpx 32rpx;
  color: var(--text-primary);
  font-size: 26rpx;
  font-weight: 400;
  white-space: nowrap;
  transition: all 0.2s ease;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.03);
}

/* 悬停交互效果 */
.picker-value:active {
  transform: scale(0.98);
  box-shadow: 0 1rpx 4rpx rgba(0,0,0,0.05);
}

/* 激活状态优化 */
.picker-value.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: #fff;
  box-shadow: 0 2rpx 12rpx rgba(0,122,255,0.2);
}

/* 图标样式调整 */
.picker-value .uni-icons {
  color: inherit;
  opacity: 0.8;
  transition: transform 0.2s;
}
.picker-value.active .uni-icons {
  transform: rotate(180deg);
}

/* 选中状态样式 */
.filter-item.active {
  background: var(--primary-color);
}

.filter-item.active .filter-label,
.filter-item.active .picker-value {
  color: #fff;
}

/* 搜索框样式 */
.search-container {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background-color: #fff;
  margin: 20rpx;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #f5f7fa;
  border-radius: 8rpx;
  padding: 12rpx 20rpx;
  height: 68rpx;
}

.search-input {
  flex: 1;
  height: 68rpx;
  font-size: 28rpx;
  color: #333;
  margin-left: 16rpx;
}

.clear-icon {
  padding: 10rpx;
}

.search-btn {
  margin-left: 20rpx;
  padding: 0 30rpx;
  height: 68rpx;
  line-height: 68rpx;
  background: linear-gradient(135deg, #4A90E2, #2979FF);
  color: #fff;
  font-size: 28rpx;
  border-radius: 8rpx;
  text-align: center;
}

/* 律师列表样式 */
.lawyer-list {
  height: calc(100vh - 640rpx);
  padding: 0 20rpx;
  background-color: var(--bg-color);
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.lawyer-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: var(--card-shadow);
  transition: transform 0.2s ease;
}

.lawyer-card:active {
  transform: translateY(2rpx);
}

.lawyer-header {
  display: flex;
  gap: 20rpx;
}

.avatar {
  width: 128rpx;
  height: 128rpx;
  border-radius: 50%;
  flex-shrink: 0;
  background-color: #f5f5f5;
  display: block;
}

.lawyer-info {
  flex: 1;
  min-width: 0; /* 防止内容溢出 */
}

.name-line {
  display: flex;
  align-items: center;
  gap: 15rpx;
  flex-wrap: wrap;
}

.name {
  font-size: 32rpx;
  font-weight: bold;
  color: var(--text-primary);
}

.cert-badge {
  background: #f0f7ff;
  color: var(--primary-color);
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
}

.recommend-badge {
  background: #fff3e0;
  color: var(--warning-color);
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
}

.stats {
  font-size: 24rpx;
  color: var(--text-secondary);
  margin: 16rpx 0;
  display: flex;
  gap: 20rpx;
}

.score {
  color: var(--warning-color);
}

.expertise {
  color: var(--text-primary);
  font-size: 26rpx;
  margin: 8rpx 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.location {
  color: var(--text-tertiary);
  font-size: 24rpx;
}

.price-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #eee;
}

.price {
  color: var(--danger-color);
  font-size: 32rpx;
  font-weight: bold;
}

.consult-type {
  color: var(--text-secondary);
  font-size: 26rpx;
}

/* 加载状态优化 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60rpx 0;
}

.list-footer {
  text-align: center;
  padding: 40rpx 0;
}

.loading,
.no-more {
  text-align: center;
  font-size: 28rpx;
  color: var(--text-tertiary);
  padding: 20rpx 0;
  position: relative;
}

.loading::after {
  content: "";
  display: inline-block;
  width: 20rpx;
  height: 20rpx;
  border: 3rpx solid var(--text-tertiary);
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
  margin-left: 12rpx;
  vertical-align: middle;
}

/* 无结果状态 */
.empty-result {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 100rpx 0;
}

.empty-text {
  margin-top: 20rpx;
  color: var(--text-tertiary);
  font-size: 28rpx;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 响应式处理 */
/* 移动端适配优化 */
@media (max-width: 768px) {
  .filter-wrapper {
    padding: 20rpx 24rpx;
    gap: 20rpx;
  }

  .filter-label {
    font-size: 24rpx;
    padding-right: 8rpx;
  }

  .filter-label::after {
    height: 20rpx;
  }

  .picker-value {
    padding: 12rpx 24rpx;
    font-size: 24rpx;
    border-radius: 36rpx;
  }
}

@media (max-width: 480px) {
  .filter-label {
    font-size: 22rpx;
  }

  .picker-value {
    padding: 10rpx 20rpx;
    font-size: 22rpx;
  }
}
</style>

