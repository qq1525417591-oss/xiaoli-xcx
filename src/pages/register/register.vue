<template>
  <view class="reg-root">
    <!-- 遮罩层 + 底部弹窗 -->
    <view class="reg-overlay" @click.self="onClose">
      <view class="reg-sheet">
        <!-- 顶部拖动条 -->
        <view class="reg-drag-bar"></view>

        <!-- 品牌区 -->
        <view class="reg-brand">
          <text class="reg-app-name">校里·约拍</text>
          <text class="reg-slogan">发现身边的摄影师</text>
        </view>

        <!-- 手机号一键登录按钮 -->
        <view class="reg-login-btn" @click="onLoginTap">
          <text class="reg-login-btn-text">手机号一键登录</text>
        </view>

        <!-- 协议勾选 -->
        <view class="reg-agreement">
          <view class="reg-check-box" :class="{ checked: agreed }" @click="toggleAgree">
            <text v-if="agreed" class="reg-check-tick">✓</text>
          </view>
          <text class="reg-agree-text">
            允许我们在必要的场景下，合理使用您的个人信息，且阅读并同意<text class="reg-link" @click.stop="goPrivacy">《隐私协议》</text><text class="reg-link" @click.stop="goService">《用户协议》</text>
          </text>
        </view>
      </view>
    </view>

    <!-- 手机号验证弹窗（第二步） -->
    <view v-if="showVerify" class="verify-overlay" @click.self="showVerify = false">
      <view class="verify-box">
        <view class="verify-head">
          <text class="verify-title">校里·约拍 申请</text>
          <text class="verify-close-btn" @click="showVerify = false">×</text>
        </view>
        <view class="verify-body">
          <text class="verify-label">你的手机号码</text>
          <view class="verify-phone-row">
            <text class="verify-phone">177****3342</text>
            <text class="verify-check-icon">✓</text>
          </view>
          <text class="verify-tip">微信绑定号码</text>
        </view>
        <view class="verify-foot">
          <view class="verify-action-btn verify-allow" @click="onConfirm">
            <text>允许</text>
          </view>
          <view class="verify-action-btn verify-cancel" @click="showVerify = false">
            <text>取消</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { setLoggedIn } from '@/store/app.js'

const emit = defineEmits(['close', 'success'])

const agreed = ref(true)
const showVerify = ref(false)

function toggleAgree() {
  agreed.value = !agreed.value
}

function onLoginTap() {
  if (!agreed.value) {
    uni.showToast({ title: '请先同意用户协议与隐私协议', icon: 'none' })
    return
  }
  showVerify.value = true
}

function onClose() {
  emit('close')
}

function onConfirm() {
  showVerify.value = false
  setLoggedIn()
  emit('success')
}

function goPrivacy() {
  uni.navigateTo({ url: '/pages/rule-detail/rule-detail?type=privacy' })
}

function goService() {
  uni.navigateTo({ url: '/pages/rule-detail/rule-detail?type=service' })
}
</script>

<style lang="scss" scoped>

.reg-root {
  position: fixed;
  inset: 0;
  z-index: 200;
  pointer-events: auto;
}

/* ── 遮罩 & 底部弹窗 ─────────────────────────── */
.reg-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.48);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 200;
}

.reg-sheet {
  width: 100%;
  background: #fff;
  border-radius: 40rpx 40rpx 0 0;
  padding: 20rpx 48rpx 80rpx;
  animation: reg-slide-up 0.3s cubic-bezier(0.34, 1.1, 0.64, 1) both;
}

@keyframes reg-slide-up {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}

.reg-drag-bar {
  width: 72rpx;
  height: 8rpx;
  border-radius: 999rpx;
  background: rgba(22, 22, 22, 0.12);
  margin: 0 auto 40rpx;
}

/* ── 品牌区 ─────────────────────────────────── */
.reg-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 52rpx;
}

.reg-app-name {
  font-size: 44rpx;
  font-weight: 900;
  color: rgba(22, 22, 22, 0.9);
  letter-spacing: 2rpx;
}

.reg-slogan {
  font-size: 26rpx;
  color: rgba(22, 22, 22, 0.42);
  font-weight: 500;
  margin-top: 8rpx;
}

/* ── 登录按钮 ────────────────────────────────── */
.reg-login-btn {
  width: 100%;
  height: 100rpx;
  background: #f5d587;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40rpx;
  box-shadow: 0 8rpx 24rpx rgba(245, 213, 135, 0.45);
}

.reg-login-btn-text {
  font-size: 32rpx;
  font-weight: 700;
  color: rgba(22, 22, 22, 0.88);
}

/* ── 协议 ────────────────────────────────────── */
.reg-agreement {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
}

.reg-check-box {
  width: 36rpx;
  height: 36rpx;
  border-radius: 8rpx;
  border: 2rpx solid rgba(22, 22, 22, 0.22);
  background: #fff;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rpx;
  transition: background 0.18s, border-color 0.18s;

  &.checked {
    background: #f5d587;
    border-color: #f5d587;
  }
}

.reg-check-tick {
  font-size: 22rpx;
  color: rgba(22, 22, 22, 0.78);
  font-weight: 700;
}

.reg-agree-text {
  font-size: 24rpx;
  color: rgba(22, 22, 22, 0.54);
  line-height: 1.6;
  flex: 1;
}

.reg-link {
  color: #f5a623;
  font-weight: 600;
}

/* ── 手机验证弹窗 ─────────────────────────────── */
.verify-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.48);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
}

.verify-box {
  width: 86%;
  max-width: 660rpx;
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  animation: verify-pop 0.22s cubic-bezier(0.34, 1.2, 0.64, 1) both;
}

@keyframes verify-pop {
  from { transform: scale(0.88); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

.verify-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 40rpx;
  border-bottom: 2rpx solid rgba(22, 22, 22, 0.07);
}

.verify-title {
  font-size: 34rpx;
  font-weight: 700;
  color: rgba(22, 22, 22, 0.9);
}

.verify-close-btn {
  font-size: 48rpx;
  color: rgba(22, 22, 22, 0.4);
  font-weight: 300;
  line-height: 1;
}

.verify-body {
  padding: 48rpx 40rpx 32rpx;
}

.verify-label {
  font-size: 40rpx;
  font-weight: 800;
  color: rgba(22, 22, 22, 0.9);
  display: block;
  margin-bottom: 40rpx;
}

.verify-phone-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 2rpx solid rgba(22, 22, 22, 0.08);
}

.verify-phone {
  font-size: 48rpx;
  font-weight: 700;
  color: rgba(22, 22, 22, 0.88);
  letter-spacing: 2rpx;
}

.verify-check-icon {
  font-size: 44rpx;
  color: #09c863;
  font-weight: 700;
}

.verify-tip {
  font-size: 24rpx;
  color: rgba(22, 22, 22, 0.4);
  margin-top: 12rpx;
  display: block;
}

.verify-foot {
  display: flex;
  gap: 24rpx;
  padding: 28rpx 40rpx 40rpx;
}

.verify-action-btn {
  flex: 1;
  height: 88rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: 700;
}

.verify-allow {
  background: #09c863;
  color: #fff;
}

.verify-cancel {
  background: rgba(22, 22, 22, 0.06);
  color: #09c863;
}
</style>
