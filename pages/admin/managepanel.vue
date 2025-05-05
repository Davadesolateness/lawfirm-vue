<template>
  <PageLayout>
    <view class="admin-container">
      <!-- 垂直排列管理模块 -->
      <scroll-view class="management-list" scroll-y>
        <!-- 用户管理 -->
        <view class="management-card">
          <view class="card-header" @click="toggleUserManagement">
            <text class="title">👥 用户管理</text>
            <uni-icons :type="isExpanded ? 'arrowup' : 'arrowdown'" size="20" color="#666"></uni-icons>
          </view>
          <view v-if="isExpanded" class="options-menu">
            <view class="menu-item" @click="addUser">
              <uni-icons type="plus-filled" size="16" color="#666"></uni-icons>
              <text>新增用户</text>
            </view>
          </view>
        </view>

        <!-- 律师管理 -->
        <view class="management-card">
          <view class="card-header" @click="toggleLawyerManagement">
            <text class="title">⚖️ 律师管理</text>
            <uni-icons :type="isLawyerExpanded ? 'arrowup' : 'arrowdown'" size="20" color="#666"></uni-icons>
          </view>
          <view v-if="isLawyerExpanded" class="options-menu">
            <view class="menu-item" @click="showLawyerForm">
              <uni-icons type="plus-filled" size="16" color="#666"></uni-icons>
              <text>增加律师信息</text>
            </view>
            <view class="menu-item" @click="editLawyer">
              <uni-icons type="compose" size="16" color="#666"></uni-icons>
              <text>修改律师信息</text>
            </view>
          </view>
        </view>

        <!-- 审核模块 -->
        <view class="management-card">
          <view class="card-header" @click="toggleAuditManagement">
            <text class="title">📝 信息审核</text>
            <uni-icons :type="isAuditExpanded ? 'arrowup' : 'arrowdown'" size="20" color="#666"></uni-icons>
          </view>
          <view v-if="isAuditExpanded" class="options-menu">
            <view class="menu-item" @click="auditUserInfo">
              <uni-icons type="person" size="16" color="#666"></uni-icons>
              <text>审核用户信息</text>
            </view>
            <view class="menu-item" @click="auditLawyerInfo">
              <uni-icons type="contact" size="16" color="#666"></uni-icons>
              <text>审核律师信息</text>
            </view>
          </view>
        </view>

        <!-- 福利管理 -->
        <view class="management-card">
          <view class="card-header" @click="toggleWelfareManagement">
            <text class="title">🎁 福利发放</text>
            <uni-icons :type="isWelfareExpanded ? 'arrowup' : 'arrowdown'" size="20" color="#666"></uni-icons>
          </view>
          <view v-if="isWelfareExpanded" class="options-menu">
            <view class="menu-item" @click="issueMembership">
              <uni-icons type="vip" size="16" color="#666"></uni-icons>
              <text>发放会员</text>
            </view>
            <view class="menu-item" @click="issueConsultation">
              <uni-icons type="chat" size="16" color="#666"></uni-icons>
              <text>发放咨询次数</text>
            </view>
          </view>
        </view>

        <!-- 公告管理 -->
        <view class="management-card">
          <view class="card-header" @click="toggleNoticeManagement">
            <text class="title">📢 公告管理</text>
            <uni-icons :type="isNoticeExpanded ? 'arrowup' : 'arrowdown'" size="20" color="#666"></uni-icons>
          </view>
          <view v-if="isNoticeExpanded" class="options-menu">
            <view class="menu-item" @click="manageHomeNotice">
              <uni-icons type="home" size="16" color="#666"></uni-icons>
              <text>主页公告管理</text>
            </view>
            <view class="menu-item" @click="addActivity">
              <uni-icons type="plus-filled" size="16" color="#666"></uni-icons>
              <text>添加活动</text>
            </view>
          </view>
        </view>

        <!-- 权限管理 -->
        <view class="management-card">
          <view class="card-header" @click="togglePermissionManagement">
            <text class="title">🔐 权限管理</text>
            <uni-icons :type="isPermissionExpanded ? 'arrowup' : 'arrowdown'" size="20" color="#666"></uni-icons>
          </view>
          <view v-if="isPermissionExpanded" class="options-menu">
            <view class="menu-item" @click="showRoleForm">
              <uni-icons type="plus-filled" size="16" color="#666"></uni-icons>
              <text>新建角色</text>
            </view>
            <view class="menu-item" @click="managePermissions">
              <uni-icons type="gear" size="16" color="#666"></uni-icons>
              <text>权限配置</text>
            </view>
          </view>
        </view>
      </scroll-view>

    </view>
  </PageLayout>
</template>

<script setup>
import {ref, reactive, computed} from 'vue';
import {navigateTo, navigateToUrl} from "@/utils/navigateTo";
import PageLayout from "@/components/custom/tabbarlayout.vue";

// 展开状态管理
const expandedStates = reactive({
  user: false,
  lawyer: false,
  audit: false,
  welfare: false,
  notice: false,
  permission: false
})


const roleForm = reactive({
  id: null,
  name: ''
})

const selectedPermissions = ref([])
const rolePopup = ref(null)

// 切换展开状态的方法
const toggleExpanded = (key) => {
  expandedStates[key] = !expandedStates[key]
}

// 导出展开状态
const isExpanded = computed(() => expandedStates.user)
const isLawyerExpanded = computed(() => expandedStates.lawyer)
const isAuditExpanded = computed(() => expandedStates.audit)
const isWelfareExpanded = computed(() => expandedStates.welfare)
const isNoticeExpanded = computed(() => expandedStates.notice)
const isPermissionExpanded = computed(() => expandedStates.permission)

// 切换方法
const toggleUserManagement = () => toggleExpanded('user')
const toggleLawyerManagement = () => toggleExpanded('lawyer')
const toggleAuditManagement = () => toggleExpanded('audit')
const toggleWelfareManagement = () => toggleExpanded('welfare')
const toggleNoticeManagement = () => toggleExpanded('notice')
const togglePermissionManagement = () => toggleExpanded('permission')

// 角色管理方法
const showRoleForm = (role = null) => {
  if (role) {
    roleForm.id = role.id
    roleForm.name = role.name
    selectedPermissions.value = [...role.permissions]
  } else {
    roleForm.id = null
    roleForm.name = ''
    selectedPermissions.value = []
  }
  rolePopup.value.open()
}


// 新增用户
function addUser() {
  navigateToUrl('/pages/user/adduserinfo/adduserinfo')
}

// 增加律师
function showLawyerForm() {
  navigateTo({
    url: "/pages/lawyer/addlawyerinfo",
    params: {
      isEditMode: false
    }
  })
}

// 修改律师
function editLawyer (){
  navigateTo({
    url: "/pages/lawyer/addlawyerinfo",
    params: {
      isEditMode: true,
      lawyerId: "444"
    }
  })
}
const auditUserInfo = () => console.log('审核用户信息')
const auditLawyerInfo = () => console.log('审核律师信息')
const issueMembership = () => console.log('发放会员')
const issueConsultation = () => console.log('发放咨询次数')
const manageHomeNotice = () => console.log('主页公告管理')
const addActivity = () => console.log('添加活动')
const managePermissions = () => console.log('管理权限')
</script>

<style lang="scss" scoped>
.admin-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 24rpx;
}

.management-list {
  height: calc(100vh - 48rpx);
}

.management-card {
  background: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2rpx);
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx;
    cursor: pointer;
    border-bottom: 1rpx solid #f0f0f0;

    .title {
      font-size: 32rpx;
      font-weight: 500;
      color: #333;
    }
  }
}

.options-menu {
  padding: 16rpx 24rpx;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  color: #666;
  transition: all 0.3s ease;
  border-radius: 8rpx;
  margin-bottom: 8rpx;

  &:hover {
    background: #f5f7fa;
    color: #4A67FF;
  }

  text {
    margin-left: 16rpx;
    font-size: 28rpx;
  }
}

// 弹窗样式
:deep(.uni-popup) {
  .uni-popup__wrapper {
    border-radius: 16rpx;
  }
}
</style>