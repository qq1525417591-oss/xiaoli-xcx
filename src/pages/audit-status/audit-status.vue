<template>
  <view class="audit-page">
    <view :style="{ height: statusBarH + 'px', flexShrink: 0 }"></view>
    <view class="profile-header">
      <view class="profile-back" @click="back">
        <text>←</text>
      </view>
      <text class="profile-title">入驻申请</text>
    </view>
    <view class="profile-content">
      <view class="audit-status-content">
        <!-- 审核中 -->
        <view v-show="currentStatus === 'pending'" class="audit-view">
          <view class="audit-icon-wrapper">
            <view class="audit-icon pending">
              <text>🕐</text>
            </view>
          </view>
          <text class="audit-title">审核中</text>
          <text class="audit-desc">您的入驻申请已提交，预计 1-2 个工作日内反馈审核结果，请耐心等待。</text>
          <view class="submitted-info-card">
            <view class="submitted-info-header">
              <text>已提交资料</text>
            </view>
            <view class="submitted-info-item">
              <text class="label">昵称</text>
              <text class="value">食盐 shiro</text>
            </view>
            <view class="submitted-info-item">
              <text class="label">微信号</text>
              <text class="value">Justnnni</text>
            </view>
            <view class="submitted-info-item">
              <text class="label">擅长风格</text>
              <view class="tags">
                <text class="tag">日系</text>
                <text class="tag">胶片复古</text>
                <text class="tag">人像摄影</text>
              </view>
            </view>
            <view class="submitted-info-item">
              <text class="label">价格范围</text>
              <text class="value">¥300-800</text>
            </view>
            <view class="submitted-info-item gallery-item-wrapper">
              <text class="label">作品展示</text>
              <view class="gallery-preview">
                <image src="https://images.unsplash.com/photo-1518972559570-7cc1309f3229?auto=format&fit=crop&w=200&q=80" mode="aspectFill" />
                <image src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=200&q=80" mode="aspectFill" />
                <image src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=200&q=80" mode="aspectFill" />
              </view>
            </view>
          </view>
          <view class="audit-btn-wrap single">
            <button class="audit-btn secondary full" @click="back">返回我的</button>
          </view>
        </view>
        <!-- 已通过 -->
        <view v-show="currentStatus === 'passed'" class="audit-view">
          <view class="audit-icon-wrapper">
            <view class="audit-icon passed">
              <text>✓</text>
            </view>
          </view>
          <text class="audit-title">审核通过</text>
          <text class="audit-desc">审核已通过！快去「我的」页面开启接单，让更多同学看到你的精美客片吧。</text>
          <view class="submitted-info-card">
            <view class="submitted-info-header">
              <text>已提交资料</text>
            </view>
            <view class="submitted-info-item">
              <text class="label">昵称</text>
              <text class="value">食盐 shiro</text>
            </view>
            <view class="submitted-info-item">
              <text class="label">微信号</text>
              <text class="value">Justnnni</text>
            </view>
            <view class="submitted-info-item">
              <text class="label">擅长风格</text>
              <view class="tags">
                <text class="tag">日系</text>
                <text class="tag">胶片复古</text>
                <text class="tag">人像摄影</text>
              </view>
            </view>
            <view class="submitted-info-item">
              <text class="label">价格范围</text>
              <text class="value">¥300-800</text>
            </view>
            <view class="submitted-info-item gallery-item-wrapper">
              <text class="label">作品展示</text>
              <view class="gallery-preview">
                <image src="https://images.unsplash.com/photo-1518972559570-7cc1309f3229?auto=format&fit=crop&w=200&q=80" mode="aspectFill" />
                <image src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=200&q=80" mode="aspectFill" />
                <image src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=200&q=80" mode="aspectFill" />
              </view>
            </view>
          </view>
          <view class="audit-btn-wrap">
            <button class="audit-btn secondary" @click="back">修改资料</button>
            <button class="audit-btn primary" @click="openOrder">去开启接单</button>
          </view>
        </view>
        <!-- 未通过 -->
        <view v-show="currentStatus === 'rejected'" class="audit-view">
          <view class="audit-icon-wrapper">
            <view class="audit-icon rejected">
              <text>!</text>
            </view>
          </view>
          <text class="audit-title">审核未通过</text>
          <text class="audit-desc">很抱歉，您的入驻申请暂未通过。</text>
          <view class="reject-reason">
            <text class="reject-reason-title">驳回原因：</text>
            <text class="reject-reason-text">作品包含非本人原创网图，请替换为真实客片。</text>
          </view>
          <view class="submitted-info-card">
            <view class="submitted-info-header">
              <text>已提交资料</text>
            </view>
            <view class="submitted-info-item">
              <text class="label">昵称</text>
              <text class="value">食盐 shiro</text>
            </view>
            <view class="submitted-info-item">
              <text class="label">微信号</text>
              <text class="value">Justnnni</text>
            </view>
            <view class="submitted-info-item">
              <text class="label">擅长风格</text>
              <view class="tags">
                <text class="tag">日系</text>
                <text class="tag">胶片复古</text>
                <text class="tag">人像摄影</text>
              </view>
            </view>
            <view class="submitted-info-item">
              <text class="label">价格范围</text>
              <text class="value">¥300-800</text>
            </view>
            <view class="submitted-info-item gallery-item-wrapper">
              <text class="label">作品展示</text>
              <view class="gallery-preview">
                <image src="https://images.unsplash.com/photo-1518972559570-7cc1309f3229?auto=format&fit=crop&w=200&q=80" mode="aspectFill" />
                <image src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=200&q=80" mode="aspectFill" />
                <image src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=200&q=80" mode="aspectFill" />
              </view>
            </view>
          </view>
          <view class="audit-btn-wrap single">
            <button class="audit-btn danger full" @click="goApply">修改资料并重新提交</button>
          </view>
        </view>
      </view>
      <!-- 状态切换演示 -->
      <view class="status-demo-bar">
        <text class="status-demo-title">切换查看其它状态（演示用）</text>
        <view class="status-demo-btns">
          <view
            class="status-demo-btn"
            :class="{ active: currentStatus === 'pending' }"
            @click="currentStatus = 'pending'; appState.auditStatusValue = 'pending'"
          >
            <text>审核中</text>
          </view>
          <view
            class="status-demo-btn"
            :class="{ active: currentStatus === 'passed' }"
            @click="currentStatus = 'passed'; appState.auditStatusValue = 'passed'"
          >
            <text>已通过</text>
          </view>
          <view
            class="status-demo-btn"
            :class="{ active: currentStatus === 'rejected' }"
            @click="currentStatus = 'rejected'; appState.auditStatusValue = 'rejected'"
          >
            <text>未通过</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { getStatusBarHeight } from '@/utils/system.js'
import { ref, onMounted } from 'vue'
import { appState } from '@/store/app.js'

const statusBarH = getStatusBarHeight()
const currentStatus = ref(appState.auditStatusValue || 'pending')

onMounted(() => {
  currentStatus.value = appState.auditStatusValue || 'pending'
})

function back() {
  uni.navigateBack()
}

function openOrder() {
  uni.showToast({ title: '去开启接单' })
}

function goApply() {
  uni.redirectTo({ url: '/pages/apply/apply' })
}
</script>

<style lang="scss" scoped>

.audit-page {
  min-height: 100vh;
  height: 100vh;
  background: $xl-bg;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
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
  padding: 48rpx 32rpx 120rpx;
  width: 100%;
  box-sizing: border-box;
  height: calc(100vh - 140rpx);
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.14);
    border-radius: 999px;
  }
}
.audit-status-content {
  padding: 0 0 48rpx;
  width: 100%;
  box-sizing: border-box;
}
.audit-view {
  width: 100%;
  box-sizing: border-box;
}
.audit-icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 32rpx;
}
.audit-icon {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80rpx;
  &.pending {
    background: rgba(22, 22, 22, 0.08);
    color: $xl-muted;
  }
  &.passed {
    background: rgba(67, 179, 90, 0.12);
    color: $xl-green;
    font-size: 60rpx;
  }
  &.rejected {
    background: rgba(226, 75, 64, 0.12);
    color: $xl-danger;
    font-size: 60rpx;
  }
}
.audit-title {
  font-size: 40rpx;
  font-weight: 800;
  text-align: center;
  margin-bottom: 16rpx;
  color: $xl-text;
  display: block;
  width: 100%;
  box-sizing: border-box;
}
.audit-desc {
  font-size: 28rpx;
  text-align: center;
  color: $xl-muted;
  line-height: 1.6;
  margin-bottom: 48rpx;
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 0 16rpx;
}
.reject-reason {
  background: rgba(226, 75, 64, 0.08);
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}
.reject-reason-title {
  font-size: 28rpx;
  font-weight: 800;
  color: $xl-danger;
  margin-bottom: 16rpx;
  display: block;
}
.reject-reason-text {
  font-size: 28rpx;
  color: $xl-muted;
  line-height: 1.6;
  display: block;
}
.submitted-info-card {
  background: $xl-card;
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: $xl-shadow2;
  margin-bottom: 24rpx;
  width: 100%;
  box-sizing: border-box;
}
.submitted-info-header {
  margin-bottom: 32rpx;
  padding-bottom: 24rpx;
  border-bottom: 2rpx solid $xl-line;
  font-size: 28rpx;
  font-weight: 800;
  color: $xl-text;
}
.submitted-info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 2rpx solid rgba(22, 22, 22, 0.04);
  width: 100%;
  box-sizing: border-box;
  &:last-child {
    border-bottom: none;
  }
}
.label {
  font-size: 28rpx;
  color: $xl-muted;
  flex-shrink: 0;
}
.value {
  font-size: 28rpx;
  color: $xl-text;
  font-weight: 700;
  text-align: right;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  max-width: 60%;
  flex-shrink: 1;
}
.tags {
  display: flex;
  gap: 16rpx;
  flex-wrap: wrap;
  justify-content: flex-end;
  max-width: 60%;
}
.tag {
  padding: 8rpx 20rpx;
  background: rgba(22, 22, 22, 0.04);
  border-radius: 8rpx;
  font-size: 24rpx;
  color: $xl-muted;
  flex-shrink: 0;
}
.gallery-item-wrapper {
  flex-direction: column;
  align-items: flex-start;
  .label {
    margin-bottom: 20rpx;
  }
}
.gallery-preview {
  display: flex;
  gap: 16rpx;
  width: 100%;
  image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 16rpx;
    flex-shrink: 0;
  }
}
.audit-btn-wrap {
  display: flex;
  gap: 24rpx;
  padding: 24rpx 0;
  width: 100%;
  box-sizing: border-box;
  &.single {
    display: block;
  }
}
.audit-btn {
  flex: 1;
  height: 88rpx;
  border-radius: 24rpx;
  border: none;
  font-size: 30rpx;
  font-weight: 700;
  &.full {
    width: 100%;
  }
  &.secondary {
    background: rgba(22, 22, 22, 0.06);
    color: $xl-text;
  }
  &.primary {
    background: $xl-accent;
    color: #fff;
  }
  &.danger {
    background: $xl-danger;
    color: #fff;
  }
}
.status-demo-bar {
  margin-top: 48rpx;
  padding: 32rpx;
  background: $xl-card;
  border-radius: 24rpx;
  box-shadow: $xl-shadow2;
  width: 100%;
  box-sizing: border-box;
}
.status-demo-title {
  font-size: 26rpx;
  color: $xl-muted;
  text-align: center;
  margin-bottom: 24rpx;
  display: block;
}
.status-demo-btns {
  display: flex;
  gap: 16rpx;
  width: 100%;
  box-sizing: border-box;
}
.status-demo-btn {
  flex: 1;
  min-width: 0;
  height: 72rpx;
  border-radius: 16rpx;
  border: 2rpx solid rgba(22, 22, 22, 0.12);
  background: $xl-card;
  font-size: 26rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  &.active {
    background: $xl-text;
    border-color: $xl-text;
    color: #fff;
  }
}
</style>
