<template>
  <view class="detail" v-if="card">
    <!-- 登录弹窗：未登录时从底部弹出 -->
    <RegisterPopup
      v-if="showRegister"
      @close="onRegisterClose"
      @success="onRegisterSuccess"
    />
    <!-- 状态栏占位 -->
    <view :style="{ height: statusBarH + 'px', flexShrink: 0 }"></view>
    <view class="detail-topbar">
      <view class="detail-back" @click="back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </view>
    </view>
    <scroll-view class="detail-scroll" scroll-y>
      <view class="detail-hero">
        <view class="detail-avatar-ring">
          <image class="detail-avatar" :src="card.avatar" mode="aspectFill" />
        </view>
        <view class="detail-name-row">
          <text class="detail-name">{{ card.name }}</text>
          <view class="detail-verified">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </view>
        </view>
        <view class="detail-price">
          <text class="yen">¥</text>
          <text>{{ card.price }}</text>
        </view>
        <view class="detail-tagrow">
          <text v-for="s in card.styles" :key="s" class="detail-chip">{{ s }}</text>
        </view>
      </view>
      <view class="detail-section">
        <text class="detail-h">关于我</text>
        <text class="detail-p">{{ aboutText }}</text>
      </view>
      <view class="detail-section">
        <text class="detail-h">作品展示</text>
        <view class="detail-works">
          <view v-for="(src, i) in card.shots" :key="i" class="detail-work">
            <image :src="src" mode="aspectFill" />
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="action-buttons">
      <view class="action-btn collect-btn" @click="toggleFav" :class="{ liked: isLiked }">
        <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        <text>收藏</text>
      </view>
      <view class="action-btn report-btn" @click="report">
        <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
        <text>举报</text>
      </view>
    </view>
    <view class="da-primary" @click="copyWechat">
      <text>复制微信号</text>
    </view>
    <view v-if="toastShow" class="toast">{{ toastText }}</view>
  </view>
</template>

<script setup>
import { getStatusBarHeight } from '@/utils/system.js'
import { computed, ref, onMounted } from 'vue'
import { aboutMap, cardsList } from '@/utils/data.js'
import { appState, isLiked as checkLiked, toggleLike } from '@/store/app.js'

const statusBarH = getStatusBarHeight()
import RegisterPopup from '@/pages/register/register.vue'
const props = defineProps({
  id: { type: String, default: '' }
})

const card = computed(() => {
  if (appState.currentDetailCard) return appState.currentDetailCard
  return cardsList.find((c) => c.id === props.id) || cardsList[0]
})

const aboutText = computed(() => {
  return aboutMap[card.value.name] || aboutMap['开到茶花'] || ''
})

const isLiked = computed(() => checkLiked(card.value.id))

const showRegister = ref(false)
const toastShow = ref(false)
const toastText = ref('')

function showToast(text) {
  toastText.value = text
  toastShow.value = true
  setTimeout(() => {
    toastShow.value = false
  }, 1200)
}

function toggleFav() {
  toggleLike(card.value.id)
}

function report() {
  showToast('已提交举报（原型）')
}

function copyWechat() {
  const id = card.value.wechatId || 'shiro_wechat_001'
  uni.setClipboardData({
    data: id,
    success: () => showToast('已复制微信号')
  })
}

function back() {
  uni.navigateBack()
}

function onRegisterClose() {
  uni.navigateBack()
}

function onRegisterSuccess() {
  showRegister.value = false
}

onMounted(() => {
  if (!appState.isLoggedIn) {
    showRegister.value = true
  }
})
</script>

<style lang="scss" scoped>

.detail {
  min-height: 100vh;
  background: #fff;
  color: rgba(22, 22, 22, 0.92);
  padding-bottom: 168rpx;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}
.detail-topbar {
  height: 112rpx;
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx 0;
  background: #fff;
}
.detail-back {
  width: 80rpx;
  height: 80rpx;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(22, 22, 22, 0.9);
  font-size: 40rpx;
}
.detail-scroll {
  height: calc(100vh - 112rpx - 168rpx);
}
.detail-hero {
  padding: 20rpx 0 12rpx;
  text-align: center;
}
.detail-avatar-ring {
  width: 172rpx;
  height: 172rpx;
  border-radius: 50%;
  background: rgba(200, 162, 122, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 12rpx auto 20rpx;
}
.detail-avatar {
  width: 132rpx;
  height: 132rpx;
  border-radius: 50%;
  background: #fff;
}
.detail-name-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  margin-top: 4rpx;
}
.detail-name {
  font-size: 34rpx;
  font-weight: 900;
}
.detail-verified {
  width: 36rpx;
  height: 36rpx;
  background: linear-gradient(135deg, #4d94ff 0%, #2563eb 100%);
  color: #fff;
  font-size: 22rpx;
  font-weight: 1000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.detail-price {
  margin-top: 20rpx;
  font-size: 68rpx;
  font-weight: 900;
}
.yen {
  font-size: 40rpx;
  margin-right: 8rpx;
  color: rgba(22, 22, 22, 0.78);
}
.detail-tagrow {
  margin-top: 24rpx;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16rpx;
}
.detail-chip {
  padding: 14rpx 24rpx;
  border-radius: 999rpx;
  background: rgba(22, 22, 22, 0.06);
  border: 2rpx solid rgba(22, 22, 22, 0.08);
  color: rgba(22, 22, 22, 0.58);
  font-size: 24rpx;
  font-weight: 900;
}
.detail-section {
  padding: 36rpx 36rpx 8rpx;
}
.detail-h {
  font-size: 32rpx;
  font-weight: 1000;
  margin-bottom: 20rpx;
  color: rgba(22, 22, 22, 0.88);
  display: block;
}
.detail-p {
  font-size: 27rpx;
  line-height: 1.75;
  color: rgba(22, 22, 22, 0.58);
  white-space: pre-line;
  display: block;
}
.detail-works {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24rpx;
  padding-top: 12rpx;
}
.detail-work {
  aspect-ratio: 4 / 3;
  border-radius: 32rpx;
  overflow: hidden;
  background: #f1f1f1;
  image {
    width: 100%;
    height: 100%;
  }
}
.action-buttons {
  display: flex;
  gap: 20rpx;
  padding: 24rpx;
  background: #fff;
  border-top: 2rpx solid $xl-line;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
}
.action-btn {
  flex: 1;
  height: 96rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  font-weight: 800;
  gap: 12rpx;
}
.collect-btn {
  background: rgba(22, 22, 22, 0.06);
  color: rgba(22, 22, 22, 0.72);
  border: 2rpx solid rgba(22, 22, 22, 0.12);
  &.liked {
    background: rgba(226, 75, 64, 0.08);
    color: $xl-danger;
    border-color: rgba(226, 75, 64, 0.18);
  }
}
.report-btn {
  background: #fff;
  color: $xl-danger;
  border: 2rpx solid $xl-danger;
}
.action-icon {
  width: 36rpx;
  height: 36rpx;
}
.da-primary {
  flex: 1;
  height: 104rpx;
  border-radius: 32rpx;
  background: rgba(0, 0, 0, 0.92);
  color: #fff;
  font-weight: 1000;
  font-size: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 144rpx;
  left: 24rpx;
  right: 24rpx;
  z-index: 9;
}
.toast {
  position: absolute;
  left: 50%;
  bottom: 192rpx;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.82);
  color: #fff;
  padding: 20rpx 28rpx;
  border-radius: 999rpx;
  font-size: 25rpx;
  font-weight: 900;
  z-index: 100;
}
</style>
