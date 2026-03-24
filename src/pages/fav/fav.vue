<template>
  <view class="fav-page">
    <view :style="{ height: statusBarH + 'px', flexShrink: 0 }"></view>
    <view class="fav-header">
      <view class="fav-back" @click="back">
        <text>←</text>
      </view>
      <text class="fav-title">我的收藏</text>
    </view>
    <scroll-view class="fav-content scrolling" scroll-y @scroll="onFavScroll">
      <view class="fav-list">
        <view
          v-for="card in favCards"
          :key="card.id"
          class="fav-card"
          @click="goDetail(card)"
        >
          <view class="fav-card-head">
            <view class="fav-card-left">
              <image class="fav-avatar" :src="card.avatar" mode="aspectFill" />
              <view class="fav-card-info">
                <view class="fav-name-row">
                  <text class="fav-name">{{ card.name }}</text>
                  <text class="fav-verify">✓</text>
                </view>
              </view>
            </view>
            <text class="fav-price">¥{{ card.price }}</text>
          </view>
          <text class="fav-bio">{{ card.bio }}</text>
          <view class="fav-gallery">
            <view v-for="(src, i) in card.shots" :key="i" class="fav-shot">
              <image :src="src" mode="aspectFill" />
            </view>
          </view>
          <view class="fav-footer">
            <view class="fav-chips">
              <text v-if="card.statusLabel" class="fav-status">{{ card.statusLabel }}</text>
              <text v-for="s in card.styles" :key="s" class="fav-chip">{{ s }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { getStatusBarHeight } from '@/utils/system.js'
import { ref, computed } from 'vue'
import { cardsList } from '@/utils/data.js'
import { appState } from '@/store/app.js'

const statusBarH = getStatusBarHeight()

const favCards = computed(() => {
  return cardsList.filter((c) => appState.likedIds.includes(String(c.id)))
})

const isScrolling = ref(false)
let scrollTimer = null

function onFavScroll() {
  isScrolling.value = true
  clearTimeout(scrollTimer)
  scrollTimer = setTimeout(() => {
    isScrolling.value = false
  }, 800)
}

function back() {
  uni.navigateBack()
}

function goDetail(card) {
  appState.currentDetailCard = card
  uni.navigateTo({
    url: `/pages/detail/detail?id=${card.id}`
  })
}
</script>

<style lang="scss" scoped>

.fav-page {
  height: 100vh;
  background: $xl-bg;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}
.fav-header {
  padding: 32rpx 40rpx;
  background: $xl-bg;
  display: flex;
  align-items: center;
  position: relative;
  border-bottom: 2rpx solid $xl-line;
}
.fav-back {
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
.fav-title {
  flex: 1;
  text-align: center;
  font-size: 36rpx;
  font-weight: 800;
  color: rgba(22, 22, 22, 0.92);
}
.fav-content {
  flex: 1;
  height: 0;
  padding: 32rpx 40rpx;
  width: 100%;
  box-sizing: border-box;
  &::-webkit-scrollbar-thumb {
    background: transparent;
  }
  &.scrolling::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.18);
    transition: background 0.35s ease;
  }
}
.fav-list {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}
.fav-card {
  background: $xl-card;
  border-radius: 32rpx;
  padding: 32rpx;
  border: 2rpx solid rgba(22, 22, 22, 0.06);
  width: 100%;
  box-sizing: border-box;
}
.fav-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}
.fav-card-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}
.fav-avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: #f0f0f0;
}
.fav-name-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.fav-name {
  font-size: 32rpx;
  font-weight: 800;
  color: rgba(22, 22, 22, 0.92);
}
.fav-verify {
  width: 36rpx;
  height: 36rpx;
  background: linear-gradient(135deg, #4d94ff 0%, #2563eb 100%);
  color: #fff;
  font-size: 22rpx;
  font-weight: 900;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fav-price {
  font-size: 30rpx;
  font-weight: 900;
  color: rgba(22, 22, 22, 0.86);
}
.fav-bio {
  font-size: 26rpx;
  line-height: 1.5;
  color: $xl-muted;
  margin-bottom: 24rpx;
  display: block;
}
.fav-gallery {
  display: flex;
  gap: 16rpx;
  margin-bottom: 24rpx;
}
.fav-shot {
  width: 160rpx;
  height: 160rpx;
  border-radius: 16rpx;
  overflow: hidden;
  background: #f0f0f0;
  image {
    width: 100%;
    height: 100%;
  }
}
.fav-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.fav-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}
.fav-status {
  padding: 8rpx 20rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  font-weight: 800;
  background: rgba(67, 179, 90, 0.12);
  color: $xl-green;
}
.fav-chip {
  padding: 8rpx 20rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  background: $xl-chip;
  color: $xl-chip-text;
}
</style>
