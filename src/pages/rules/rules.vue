<template>
  <view class="rules-page">
    <view :style="{ height: statusBarH + 'px', flexShrink: 0 }"></view>
    <view class="rules-header">
      <view class="rules-back" @click="back">
        <text>←</text>
      </view>
      <text class="rules-title">平台规则</text>
    </view>
    <scroll-view class="rules-content" scroll-y>
      <view class="rules-list">
        <view class="rules-list-item" @click="goRule('service')">
          <text class="rules-list-text">用户服务协议</text>
          <text class="rules-list-arrow">›</text>
        </view>
        <view class="rules-list-item" @click="goRule('privacy')">
          <text class="rules-list-text">隐私政策</text>
          <text class="rules-list-arrow">›</text>
        </view>
        <view class="rules-list-item" @click="goRule('settle')">
          <text class="rules-list-text">入驻补充协议</text>
          <text class="rules-list-arrow">›</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { getStatusBarHeight } from '@/utils/system.js'
const statusBarH = getStatusBarHeight()

function back() {
  uni.navigateBack()
}

function goRule(type) {
  uni.navigateTo({
    url: `/pages/rule-detail/rule-detail?type=${type}`
  })
}
</script>

<style lang="scss" scoped>

.rules-page {
  min-height: 100vh;
  background: $xl-bg;
  display: flex;
  flex-direction: column;
}
.rules-header {
  padding: 32rpx 40rpx;
  background: $xl-bg;
  display: flex;
  align-items: center;
  position: relative;
  border-bottom: 2rpx solid $xl-line;
}
.rules-back {
  position: absolute;
  left: 32rpx;
  width: 68rpx;
  height: 68rpx;
  border-radius: 50%;
  background: rgba(22, 22, 22, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
}
.rules-title {
  flex: 1;
  text-align: center;
  font-size: 36rpx;
  font-weight: 800;
  color: rgba(22, 22, 22, 0.92);
}
.rules-content {
  flex: 1;
  padding: 0;
}
.rules-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 40rpx;
  border-bottom: 2rpx solid $xl-line;
  background: #fff;
}
.rules-list-text {
  font-size: 30rpx;
  font-weight: 700;
  color: rgba(22, 22, 22, 0.92);
}
.rules-list-arrow {
  font-size: 32rpx;
  color: rgba(22, 22, 22, 0.4);
}
</style>
