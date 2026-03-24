<template>
  <view class="me-page">
    <!-- 登录弹窗 -->
    <RegisterPopup
      v-if="showRegister"
      @close="showRegister = false"
      @success="showRegister = false"
    />

    <!-- 状态栏占位（自定义导航时撑开顶部安全区域） -->
    <view :style="{ height: statusBarH + 'px', flexShrink: 0 }"></view>

    <view class="me-container">
      <view class="me-header">
        <!-- 头像 + 名称区域，未登录时可点击触发登录 -->
        <view class="me-user-area" @click="onUserAreaTap">
          <view v-if="!appState.isLoggedIn" class="me-avatar-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </view>
          <image v-else class="me-avatar" :src="appState.meAvatar" mode="aspectFill" />
          <view class="me-name-wrap">
            <text class="me-name" :class="{ 'me-name-unlogged': !appState.isLoggedIn }">
              {{ appState.isLoggedIn ? appState.meName : '登录/注册' }}
            </text>
            <text v-if="!appState.isLoggedIn" class="me-name-hint">点击登录，解锁全部功能</text>
          </view>
        </view>
        <view class="me-segmented">
          <view
            class="me-seg-btn"
            :class="{ active: meTab === 'find' }"
            @click="switchTab('find')"
          >
            <text>找约拍</text>
          </view>
          <view
            class="me-seg-btn"
            :class="{ active: meTab === 'photographer' }"
            @click="switchTab('photographer')"
          >
            <text>摄影师</text>
          </view>
        </view>
      </view>  <!-- /me-header -->
      <view class="me-content-wrap">
        <!-- 找约拍 -->
        <view v-if="meTab === 'find'" class="me-list">
          <view class="me-list-item" @click="goProfile">
            <view class="me-list-left">
              <image class="me-list-icon" src="/static/icons/ic-person.svg" mode="aspectFit" />
              <text class="me-list-text">个人信息</text>
            </view>
            <text class="me-list-arrow">›</text>
          </view>
          <view class="me-list-item" @click="goFav">
            <view class="me-list-left">
              <image class="me-list-icon" src="/static/icons/ic-heart.svg" mode="aspectFit" />
              <text class="me-list-text">我的收藏</text>
            </view>
            <text class="me-list-arrow">›</text>
          </view>
          <view class="me-list-item" @click="goRules">
            <view class="me-list-left">
              <image class="me-list-icon" src="/static/icons/ic-rules.svg" mode="aspectFit" />
              <text class="me-list-text">平台规则</text>
            </view>
            <text class="me-list-arrow">›</text>
          </view>
          <view class="me-list-item" @click="logout">
            <view class="me-list-left">
              <image class="me-list-icon" src="/static/icons/ic-logout.svg" mode="aspectFit" />
              <text class="me-list-text">退出登录</text>
            </view>
          </view>
        </view>
        <!-- 摄影师 -->
        <view v-if="meTab === 'photographer'" class="me-list">
          <!-- 接单状态（摄影师专属） -->
          <view class="me-list-item">
            <view class="me-list-left">
              <image class="me-list-icon" src="/static/icons/ic-order.svg" mode="aspectFit" />
              <text class="me-list-text">接单状态</text>
            </view>
            <view
              class="order-status-toggle"
              :class="{ off: !appState.orderEnabled }"
              @click="appState.orderEnabled = !appState.orderEnabled"
            >
              <view class="order-status-knob" />
            </view>
          </view>
          <!-- 个人信息（与找约拍一致） -->
          <view class="me-list-item" @click="goProfile">
            <view class="me-list-left">
              <image class="me-list-icon" src="/static/icons/ic-person.svg" mode="aspectFit" />
              <text class="me-list-text">个人信息</text>
            </view>
            <text class="me-list-arrow">›</text>
          </view>
          <!-- 入驻审核（摄影师专属） -->
          <view class="me-list-item" @click="goAuditStatus">
            <view class="me-list-left">
              <image class="me-list-icon" src="/static/icons/ic-audit.svg" mode="aspectFit" />
              <text class="me-list-text">入驻审核</text>
            </view>
            <view :class="['audit-status', auditStatusClass]">
              <text>{{ auditStatusLabel }}</text>
            </view>
          </view>
          <!-- 我的收藏（与找约拍一致） -->
          <view class="me-list-item" @click="goFav">
            <view class="me-list-left">
              <image class="me-list-icon" src="/static/icons/ic-heart.svg" mode="aspectFit" />
              <text class="me-list-text">我的收藏</text>
            </view>
            <text class="me-list-arrow">›</text>
          </view>
          <!-- 平台规则（与找约拍一致） -->
          <view class="me-list-item" @click="goRules">
            <view class="me-list-left">
              <image class="me-list-icon" src="/static/icons/ic-rules.svg" mode="aspectFit" />
              <text class="me-list-text">平台规则</text>
            </view>
            <text class="me-list-arrow">›</text>
          </view>
          <!-- 退出登录（与找约拍一致） -->
          <view class="me-list-item" @click="logout">
            <view class="me-list-left">
              <image class="me-list-icon" src="/static/icons/ic-logout.svg" mode="aspectFit" />
              <text class="me-list-text">退出登录</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="bottom">
      <view class="dock">
        <view class="nav" @click="goIndex">
          <image class="nav-icon" src="/static/icons/camera.svg" mode="aspectFit" />
          <text>约拍</text>
        </view>
        <view class="nav active">
          <image class="nav-icon" src="/static/icons/person-active.svg" mode="aspectFit" />
          <text>我的</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { appState } from '@/store/app.js'
import { auditStatuses } from '@/utils/data.js'
import RegisterPopup from '@/pages/register/register.vue'
import { getStatusBarHeight } from '@/utils/system.js'

const statusBarH = getStatusBarHeight()
const meTab = ref('find')

const showRegister = ref(false)

function requireLogin(action) {
  if (!appState.isLoggedIn) {
    showRegister.value = true
    return
  }
  action()
}

function onUserAreaTap() {
  requireLogin(() => {})
}

function switchTab(tab) {
  if (tab === 'photographer') {
    requireLogin(() => { meTab.value = tab })
  } else {
    meTab.value = tab
  }
}

const auditStatusLabel = computed(() => {
  const s = auditStatuses.find((x) => x.value === appState.auditStatusValue)
  return s ? s.label : '已通过'
})
const auditStatusClass = computed(() => {
  const s = auditStatuses.find((x) => x.value === appState.auditStatusValue)
  return s ? s.class : 'passed'
})

function goProfile() {
  requireLogin(() => uni.navigateTo({ url: '/pages/profile/profile' }))
}
function goFav() {
  requireLogin(() => uni.navigateTo({ url: '/pages/fav/fav' }))
}
function goRules() {
  uni.navigateTo({ url: '/pages/rules/rules' })
}
function goApply() {
  uni.navigateTo({ url: '/pages/apply/apply' })
}
function goAuditStatus() {
  uni.navigateTo({ url: '/pages/audit-status/audit-status' })
}
function goIndex() {
  uni.reLaunch({ url: '/pages/index/index' })
}
function logout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '已退出登录' })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.me-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: $xl-bg;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}
.me-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.me-header {
  padding: 20rpx 40rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.me-user-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32rpx;
}

.me-avatar {
  width: 144rpx;
  height: 144rpx;
  border-radius: 50%;
  margin-bottom: 20rpx;
  background: #f5e6d3;
}

.me-avatar-placeholder {
  width: 144rpx;
  height: 144rpx;
  border-radius: 50%;
  background: rgba(22, 22, 22, 0.07);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
  svg {
    width: 72rpx;
    height: 72rpx;
    color: rgba(22, 22, 22, 0.28);
  }
}

.me-name-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.me-name {
  font-size: 36rpx;
  font-weight: 800;
  color: rgba(22, 22, 22, 0.92);
  &.me-name-unlogged {
    font-size: 38rpx;
    color: rgba(22, 22, 22, 0.88);
  }
}

.me-name-hint {
  font-size: 24rpx;
  color: rgba(22, 22, 22, 0.38);
  font-weight: 500;
}
.me-segmented {
  width: 100%;
  height: 88rpx;
  background: rgba(22, 22, 22, 0.06);
  border-radius: 44rpx;
  padding: 6rpx;
  display: flex;
  gap: 6rpx;
}
.me-seg-btn {
  flex: 1;
  border-radius: 38rpx;
  font-size: 29rpx;
  font-weight: 700;
  color: rgba(22, 22, 22, 0.56);
  display: flex;
  align-items: center;
  justify-content: center;
  &.active {
    background: #fff;
    color: rgba(22, 22, 22, 0.92);
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
  }
}
.me-content-wrap {
  flex: 1;
  padding: 0 32rpx;
}
.me-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.me-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 0;
  border-bottom: 2rpx solid $xl-line;
}
.me-list-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.me-list-icon {
  width: 40rpx;
  height: 40rpx;
  flex-shrink: 0;
  display: block;
}
.me-list-text {
  font-size: 30rpx;
  font-weight: 700;
  color: rgba(22, 22, 22, 0.92);
}
.me-list-arrow {
  font-size: 32rpx;
  color: rgba(22, 22, 22, 0.4);
}
.audit-status {
  padding: 12rpx 28rpx;
  border-radius: 16rpx;
  font-size: 26rpx;
  font-weight: 800;
  &.passed {
    border: 2rpx solid $xl-green;
    color: $xl-green;
    background: rgba(67, 179, 90, 0.08);
  }
  &.pending {
    border: 2rpx solid rgba(22, 22, 22, 0.18);
    color: rgba(22, 22, 22, 0.56);
    background: rgba(22, 22, 22, 0.04);
  }
  &.rejected {
    border: 2rpx solid $xl-danger;
    color: $xl-danger;
    background: rgba(226, 75, 64, 0.08);
  }
}
.order-status-toggle {
  width: 100rpx;
  height: 56rpx;
  border-radius: 28rpx;
  background: rgba(67, 179, 90, 0.12);
  position: relative;
  &.off {
    background: rgba(226, 75, 64, 0.12);
  }
  .order-status-knob {
    position: absolute;
    right: 4rpx;
    top: 4rpx;
    width: 48rpx;
    height: 48rpx;
    border-radius: 50%;
    background: $xl-green;
    transition: all 0.2s;
  }
  &.off .order-status-knob {
    background: $xl-danger;
    right: auto;
    left: 4rpx;
  }
}
.bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 24rpx 32rpx 36rpx;
  background: linear-gradient(180deg, rgba(246, 245, 240, 0) 0%, rgba(246, 245, 240, 1) 30%);
}
.dock {
  width: 100%;
  height: 152rpx;
  background: rgba(255, 255, 255, 0.96);
  border: 2rpx solid $xl-line;
  border-radius: 56rpx;
  box-shadow: 0 28rpx 68rpx rgba(0, 0, 0, 0.12);
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-sizing: border-box;
}
.nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  color: rgba(22, 22, 22, 0.36);
  font-size: 23rpx;
  font-weight: 800;
  &.active {
    color: $xl-accent;
  }
}
.nav-icon {
  width: 48rpx;
  height: 48rpx;
  display: block;
}
</style>
