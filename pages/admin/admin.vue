<template>
  <view class="admin-container">
    <!-- 垂直排列管理模块 -->
    <scroll-view class="management-list" scroll-y>
      <!-- 用户管理 -->

      <view class="management-card">
        <view class="card-header" @click="toggleUserManagement">
          <text class="title">👥 用户管理</text>
          <uni-icons :type="isExpanded == true ? 'arrowup' : 'arrowdown'" size="20" color="#666"></uni-icons>
        </view>

        <!-- 新增用户选项 -->
        <view v-if="isExpanded" class="options-menu">
          <view class="menu-item" @click="addUser1">
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

      <!-- 在template的scroll-view内添加以下代码 -->
      <view class="management-card">
        <view class="card-header">
          <text class="title">🔐 权限管理</text>
          <uni-icons type="arrowdown" size="20" color="#666"></uni-icons>
        </view>

        <view class="card-content">
          <!-- 角色管理 -->
          <view class="role-section">
            <view class="section-header">
              <text class="sub-title">角色管理</text>
              <button class="add-btn" @click="showRoleForm">+ 新建角色</button>
            </view>

            <!-- 角色列表 -->
            <view class="role-list">
              <view v-for="role in roles" :key="role.id" class="role-item">
                <text class="role-name">{{ role.name }}</text>
                <view class="role-actions">
                  <uni-icons type="compose" size="24" color="#666" @click="editRole(role)"></uni-icons>
                  <uni-icons type="trash" size="24" color="#ff4444" @click="deleteRole(role)"></uni-icons>
                </view>
              </view>
            </view>
          </view>

          <!-- 权限分配 -->
          <view class="permission-section">
            <text class="sub-title">权限分配</text>
            <view class="permission-grid">
              <view
                  v-for="permission in permissions"
                  :key="permission.id"
                  class="permission-item"
                  :class="{ active: selectedPermissions.includes(permission.id) }"
                  @click="togglePermission(permission.id)"
              >
                {{ permission.name }}
              </view>
            </view>
          </view>

          <!-- 角色表单弹窗 -->
          <uni-popup ref="rolePopup" type="dialog">
            <uni-popup-dialog
                mode="input"
                title="角色信息"
                :value="roleForm.name"
                placeholder="请输入角色名称"
                @confirm="saveRole"
            ></uni-popup-dialog>
          </uni-popup>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import {ref, reactive} from 'vue'
// 在script setup部分添加以下代码

// 权限数据
const permissions = ref([
  {id: 1, name: '用户管理'},
  {id: 2, name: '律师管理'},
  {id: 3, name: '公告管理'},
  {id: 4, name: '权限管理'},
  {id: 5, name: '审核管理'}
])

const roles = ref([
  {
    id: 1,
    name: '超级管理员',
    permissions: [1, 2, 3, 4, 5]
  },
  {
    id: 2,
    name: '内容管理员',
    permissions: [2, 3]
  }
])

const roleForm = reactive({
  id: null,
  name: ''
})

const selectedPermissions = ref([])
const currentRoleId = ref(null)
const rolePopup = ref(null)
const isExpanded = ref(false)

// 新增展开状态变量
const isLawyerExpanded = ref(false)
const isAuditExpanded = ref(false)
const isWelfareExpanded = ref(false)
const isNoticeExpanded = ref(false)

// 新增切换方法
const toggleLawyerManagement = () => isLawyerExpanded.value = !isLawyerExpanded.value
const toggleAuditManagement = () => isAuditExpanded.value = !isAuditExpanded.value
const toggleWelfareManagement = () => isWelfareExpanded.value = !isWelfareExpanded.value
const toggleNoticeManagement = () => isNoticeExpanded.value = !isNoticeExpanded.value

// 新增方法
const showLawyerForm = () => {
  // 显示律师表单逻辑
  console.log('打开律师表单')
}

const editLawyer = () => {
  console.log('修改律师信息')
}

const auditUserInfo = () => {
  console.log('审核用户信息')
}

const auditLawyerInfo = () => {
  console.log('审核律师信息')
}

const issueMembership = () => {
  console.log('发放会员')
}

const issueConsultation = () => {
  console.log('发放咨询次数')
}

const manageHomeNotice = () => {
  console.log('主页公告管理')
}

const addActivity = () => {
  console.log('添加活动')
}

function toggleUserManagement() {
  isExpanded.value = !isExpanded.value
}

function addUser1() {
  // 这里添加新增用户的逻辑
  console.log('执行新增用户操作')
}

// 方法
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

const saveRole = (name) => {
  if (!name) return uni.showToast({title: '角色名称不能为空', icon: 'none'})

  const newRole = {
    id: roleForm.id || Date.now(),
    name,
    permissions: selectedPermissions.value
  }

  const index = roles.value.findIndex(r => r.id === newRole.id)
  if (index >= 0) {
    roles.value.splice(index, 1, newRole)
  } else {
    roles.value.push(newRole)
  }

  rolePopup.value.close()
}

const deleteRole = (role) => {
  uni.showModal({
    title: '确认删除',
    content: `确定要删除角色【${role.name}】吗？`,
    success: (res) => {
      if (res.confirm) {
        roles.value = roles.value.filter(r => r.id !== role.id)
      }
    }
  })
}

const togglePermission = (permissionId) => {
  const index = selectedPermissions.value.indexOf(permissionId)
  if (index >= 0) {
    selectedPermissions.value.splice(index, 1)
  } else {
    selectedPermissions.value.push(permissionId)
  }
}

// 用户管理
const newUser = reactive({username: '', email: ''})
const users = ref([
  {id: 1, name: '用户A', level: 0},
  {id: 2, name: '用户B', level: 2}
])
const memberLevels = ['普通', '白银', '黄金', '铂金']

// 律师管理
const lawyerForm = reactive({name: '', specialty: '', intro: ''})
const pendingLawyers = ref([
  {id: 1, name: '张律师', status: 'pending'},
  {id: 2, name: '李律师', status: 'pending'}
])

// 福利管理
const selectedLevel = ref(0)
const couponForm = reactive({amount: '', condition: ''})

// 公告管理
const newNotice = ref('')
const notices = ref([
  {id: 1, content: '系统维护通知'},
  {id: 2, content: '新功能上线公告'}
])

// 方法
const addUser = () => {
  if (newUser.username && newUser.email) {
    users.value.push({
      id: Date.now(),
      name: newUser.username,
      email: newUser.email,
      level: 0
    })
    newUser.username = ''
    newUser.email = ''
  }
}

const updateLevel = (user) => {
  console.log('更新用户等级:', user)
}

const saveLawyer = () => {
  if (lawyerForm.name && lawyerForm.specialty) {
    console.log('保存律师信息:', lawyerForm)
    Object.assign(lawyerForm, {name: '', specialty: '', intro: ''})
  }
}

const approveLawyer = (lawyer) => {
  pendingLawyers.value = pendingLawyers.value.filter(l => l.id !== lawyer.id)
  console.log('通过审核:', lawyer)
}

const rejectLawyer = (lawyer) => {
  pendingLawyers.value = pendingLawyers.value.filter(l => l.id !== lawyer.id)
  console.log('驳回申请:', lawyer)
}

const setMemberLevel = () => {
  console.log('设置会员等级:', memberLevels[selectedLevel.value])
}

const issueCoupon = () => {
  if (couponForm.amount && couponForm.condition) {
    console.log('发放优惠券:', couponForm)
    couponForm.amount = ''
    couponForm.condition = ''
  }
}

const publishNotice = () => {
  if (newNotice.value) {
    notices.value.push({
      id: Date.now(),
      content: newNotice.value
    })
    newNotice.value = ''
  }
}
</script>

<style lang="scss" scoped>
.admin-container {
  height: 100vh;
  background: #f5f7fa;
  padding: 20rpx;
}

.management-list {
  height: calc(100vh - 40rpx);
}

.management-card {
  background: white;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx;
    border-bottom: 1rpx solid #eee;

    .title {
      font-size: 32rpx;
      font-weight: 500;
    }
  }

  .card-content {
    padding: 24rpx;
  }
}

.form-input {
  height: 80rpx;
  padding: 0 24rpx;
  margin-bottom: 24rpx;
  background: #f8f9ff;
  border-radius: 12rpx;
  border: 1rpx solid #eee;
}

.submit-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background: #4A67FF;
  color: white;
  border-radius: 12rpx;
  font-size: 30rpx;
  margin-top: 24rpx;
}

.user-list {
  .user-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx 0;
    border-bottom: 1rpx solid #eee;

    .level-tag {
      padding: 8rpx 24rpx;
      background: #e8f4ff;
      border-radius: 24rpx;
      color: #4A67FF;
    }
  }
}

.review-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #eee;

  .lawyer-name {
    font-weight: 500;
  }

  .action-btn {
    width: 140rpx;
    height: 60rpx;
    line-height: 60rpx;
    border-radius: 30rpx;
    font-size: 26rpx;
    margin-left: 20rpx;

    &.approve {
      background: #4CAF50;
      color: white;
    }

    &.reject {
      background: #ff4444;
      color: white;
    }
  }
}

.welfare-section {
  margin-bottom: 40rpx;

  .section-title {
    display: block;
    font-size: 28rpx;
    color: #666;
    margin-bottom: 20rpx;
  }

  .level-picker {
    padding: 20rpx;
    background: #f8f9ff;
    border-radius: 12rpx;
    margin-bottom: 24rpx;
  }
}

.rich-editor {
  height: 300rpx;
  padding: 24rpx;
  background: #fff;
  border: 1rpx solid #eee;
  border-radius: 12rpx;
  margin-bottom: 24rpx;
}

.notice-swiper {
  height: 200rpx;
  margin-bottom: 32rpx;

  .notice-item {
    padding: 32rpx;
    background: #f8f9ff;
    border-radius: 16rpx;
    margin: 0 24rpx;
  }
}

// 在style部分添加以下样式
.role-section {
  margin-bottom: 40rpx;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
  }

  .sub-title {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
  }

  .add-btn {
    padding: 8rpx 24rpx;
    background: #4A67FF;
    color: white;
    border-radius: 24rpx;
    font-size: 24rpx;
  }

  .role-list {
    .role-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24rpx;
      border-bottom: 1rpx solid #eee;

      .role-name {
        font-weight: 500;
      }

      .role-actions {
        display: flex;
        gap: 24rpx;
      }
    }
  }
}

.permission-section {
  .permission-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20rpx;

    .permission-item {
      padding: 24rpx;
      background: #f8f9ff;
      border-radius: 12rpx;
      text-align: center;
      transition: all 0.2s;

      &.active {
        background: #4A67FF;
        color: white;
      }
    }
  }
}

.management-card {
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 10px;
}

.card-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.options-menu {
  padding: 0 16px 16px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 10px;
  color: #666;
  transition: background 0.3s;
}

.menu-item:active {
  background: #f5f5f5;
}

.menu-item text {
  margin-left: 8px;
}
</style>