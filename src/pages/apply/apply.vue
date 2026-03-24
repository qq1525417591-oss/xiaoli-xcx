<template>
  <view class="apply-page">
    <view :style="{ height: statusBarH + 'px', flexShrink: 0 }"></view>
    <view class="profile-header">
      <view class="profile-back" @click="back">
        <text>←</text>
      </view>
      <text class="profile-title">入驻申请</text>
    </view>
    <view class="profile-content">
      <view class="apply-form-group">
        <text class="apply-form-label">昵称<text class="required">*</text></text>
        <input v-model="form.nickname" type="text" class="apply-input" placeholder="请输入昵称" />
      </view>
      <view class="apply-form-group">
        <text class="apply-form-label">微信号<text class="required">*</text></text>
        <input v-model="form.wechat" type="text" class="apply-input" placeholder="请输入微信号" />
      </view>
      <view class="apply-form-group">
        <text class="apply-form-label">个人简介</text>
        <textarea v-model="form.bio" class="apply-textarea" placeholder="请输入个人简介" />
      </view>
      <view class="apply-form-group">
        <text class="apply-form-label">擅长风格（多选）</text>
        <view class="apply-pill-grid">
          <view
            v-for="s in styleOptions"
            :key="s"
            class="apply-pill"
            :class="{ selected: form.styles.includes(s) }"
            @click="toggleStyle(s)"
          >
            <text>{{ s }}</text>
          </view>
        </view>
      </view>
      <view class="apply-form-group">
        <text class="apply-form-label">价格范围/每组</text>
        <view class="price-range-wrapper">
          <view class="price-input-group">
            <text>¥</text>
            <input v-model.number="form.priceMin" type="number" class="price-input" placeholder="最低价" />
          </view>
          <view class="price-input-group">
            <text>¥</text>
            <input v-model.number="form.priceMax" type="number" class="price-input" placeholder="最高价" />
          </view>
        </view>
      </view>
      <view class="apply-form-group">
        <text class="apply-form-label">作品展示<text class="required">*</text></text>
        <text class="gallery-hint">最多 8 张</text>
        <view class="gallery-grid">
          <view v-for="(img, i) in form.gallery" :key="i" class="gallery-item">
            <image :src="img" mode="aspectFill" />
          </view>
        </view>
      </view>
      <view class="apply-agree">
        <text>提交申请即代表您同意《摄影师入驻协议》及《平台服务条款》</text>
      </view>
      <view class="profile-save-section">
        <button class="profile-save-btn" @click="submit">提交申请</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { getStatusBarHeight } from '@/utils/system.js'
import { reactive } from 'vue'
import { appState } from '@/store/app.js'

const statusBarH = getStatusBarHeight()
import { filterStyles } from '@/utils/data.js'

const form = reactive({
  nickname: '食盐 shiro',
  wechat: 'Justnnni',
  bio: '',
  styles: ['人像摄影', '棚拍'],
  priceMin: 300,
  priceMax: 800,
  gallery: [
    'https://images.unsplash.com/photo-1518972559570-7cc1309f3229?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=300&q=80'
  ]
})

const styleOptions = filterStyles

function toggleStyle(s) {
  const i = form.styles.indexOf(s)
  if (i >= 0) {
    form.styles.splice(i, 1)
  } else {
    form.styles.push(s)
  }
}

function back() {
  uni.navigateBack()
}

function submit() {
  if (!form.nickname.trim()) {
    uni.showToast({ title: '请输入昵称', icon: 'none' })
    return
  }
  if (!form.wechat.trim()) {
    uni.showToast({ title: '请输入微信号', icon: 'none' })
    return
  }
  appState.auditStatusValue = 'pending'
  uni.redirectTo({ url: '/pages/audit-status/audit-status' })
}
</script>

<style lang="scss" scoped>

.apply-page {
  min-height: 100vh;
  background: $xl-bg;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}
.profile-header {
  padding: 32rpx 40rpx;
  background: $xl-bg;
  display: flex;
  align-items: center;
  position: relative;
  border-bottom: 2rpx solid $xl-line;
}
.profile-back {
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
.profile-title {
  flex: 1;
  text-align: center;
  font-size: 36rpx;
  font-weight: 800;
  color: rgba(22, 22, 22, 0.92);
}
.profile-content {
  flex: 1;
  padding: 40rpx;
  padding-bottom: 120rpx;
  width: 100%;
  box-sizing: border-box;
  max-height: calc(100vh - 140rpx);
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}
.apply-form-group {
  background: #fff;
  border-radius: 28rpx;
  padding: 32rpx 36rpx;
  margin-bottom: 32rpx;
  width: 100%;
  box-sizing: border-box;
}
.apply-form-label {
  font-size: 30rpx;
  font-weight: 700;
  color: rgba(22, 22, 22, 0.85);
  margin-bottom: 20rpx;
  display: block;
  .required {
    color: $xl-danger;
  }
}
.apply-input {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  border: 2rpx solid rgba(22, 22, 22, 0.08);
  border-radius: 20rpx;
  padding: 0 28rpx;
  font-size: 30rpx;
  color: rgba(22, 22, 22, 0.92);
  box-sizing: border-box;
  background-color: #fff;
}
.apply-textarea {
  width: 100%;
  min-height: 200rpx;
  border: 2rpx solid rgba(22, 22, 22, 0.08);
  border-radius: 20rpx;
  padding: 24rpx 28rpx;
  font-size: 30rpx;
  color: rgba(22, 22, 22, 0.92);
  box-sizing: border-box;
}
.apply-pill-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}
.apply-pill {
  padding: 18rpx 28rpx;
  border-radius: 999rpx;
  border: 2rpx solid rgba(22, 22, 22, 0.12);
  background: rgba(255, 255, 255, 0.8);
  color: rgba(22, 22, 22, 0.56);
  font-size: 26rpx;
  font-weight: 800;
  &.selected {
    background: rgba(200, 162, 122, 0.18);
    color: rgba(140, 92, 48, 0.98);
    border-color: rgba(200, 162, 122, 0.42);
  }
}
.price-range-wrapper {
  display: flex;
  gap: 24rpx;
}
.price-input-group {
  flex: 1;
  display: flex;
  align-items: center;
  border: 2rpx solid rgba(22, 22, 22, 0.08);
  border-radius: 20rpx;
  padding: 0 24rpx;
  text {
    margin-right: 8rpx;
    color: $xl-muted;
  }
}
.price-input {
  flex: 1;
  height: 80rpx;
  font-size: 28rpx;
}
.gallery-hint {
  font-size: 24rpx;
  color: $xl-muted;
  margin-left: 16rpx;
}
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
  margin-top: 16rpx;
}
.gallery-item {
  aspect-ratio: 1;
  border-radius: 16rpx;
  overflow: hidden;
  background: #f0f0f0;
  image {
    width: 100%;
    height: 100%;
  }
}
.apply-agree {
  margin-bottom: 32rpx;
  font-size: 24rpx;
  color: $xl-muted;
}
.profile-save-section {
  padding: 0;
}
.profile-save-btn {
  width: 100%;
  height: 96rpx;
  border-radius: 24rpx;
  border: none;
  background: rgba(22, 22, 22, 0.92);
  color: #fff;
  font-size: 32rpx;
  font-weight: 700;
}
</style>
