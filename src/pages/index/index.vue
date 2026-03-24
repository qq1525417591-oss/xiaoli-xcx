<template>
  <view class="page-home">
    <!-- 状态栏占位（自定义导航时撑开顶部安全区域） -->
    <view :style="{ height: statusBarH + 'px', flexShrink: 0 }"></view>
    <view class="top">
      <text class="title">校里·约拍</text>
      <view class="school-tag">广西医科大学</view>
    </view>

    <view class="tabs">
      <view
        class="tab"
        :class="{ active: activeGroup === 'new' }"
        @click="setActiveGroup('new')"
      >
        <text>新入驻</text>
      </view>
      <view
        class="tab"
        :class="{ active: activeGroup === 'active' }"
        @click="setActiveGroup('active')"
      >
        <text>接单中</text>
      </view>
      <view class="tab tab-filter" @click="showFilter = true">
        <text class="filter-text">筛选</text>
        <text v-if="filterBadgeCount > 0" class="filter-badge">{{ filterBadgeCount }}</text>
      </view>
    </view>

    <scroll-view class="content scrolling" scroll-y @scroll="onContentScroll">
      <view
        v-for="card in filteredCards"
        :key="card.id"
        class="card"
        @click="goDetail(card)"
      >
        <view class="card-head">
          <view class="who">
            <image class="avatar" :src="card.avatar" mode="aspectFill" />
            <view class="who-info">
              <view class="name">
            <text>{{ card.name }}</text>
            <view class="verified-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </view>
          </view>
              <text class="subtitle">{{ card.subtitle }}</text>
            </view>
          </view>
          <text class="price">¥{{ card.price }}</text>
        </view>
        <text class="bio">{{ card.bio }}</text>
        <view class="gallery cols-3">
          <view v-for="(src, i) in card.shots.slice(0, 3)" :key="i" class="shot">
            <image :src="src" mode="aspectFill" />
          </view>
        </view>
        <view class="card-foot">
          <view class="chips">
            <text v-if="card.statusLabel" class="chip status">{{ card.statusLabel }}</text>
            <text v-for="s in card.styles" :key="s" class="chip">{{ s }}</text>
          </view>
          <view
            class="fav"
            :class="{ liked: isLiked(card.id) }"
            @click.stop="toggleLike(card.id)"
          >
            <text class="heart">♥</text>
          </view>
        </view>
      </view>
      <view v-if="filteredCards.length === 0" class="empty">
        <text class="empty-title">没有符合条件的摄影师</text>
        <text class="empty-desc">试试调整风格或价格范围</text>
      </view>
    </scroll-view>

    <!-- 筛选弹层 -->
    <view v-if="showFilter" class="overlay" @click="showFilter = false">
      <view class="sheet" @click.stop>
        <view class="sheet-head">
          <text class="sheet-title">筛选</text>
          <view class="sheet-close" @click="showFilter = false">×</view>
        </view>
        <view class="section">
          <text class="section-label">擅长</text>
          <view class="style-grid">
            <view
              v-for="s in filterStyles"
              :key="s"
              class="pill"
              :class="{ selected: draftStyles.includes(s) }"
              @click="toggleDraftStyle(s)"
            >
              <text>{{ s }}</text>
            </view>
          </view>
        </view>
        <view class="section">
          <text class="section-label">价格范围 (元)</text>
          <view class="price-area">
            <view class="price-top">
              <text class="price-min">{{ draftMin }}</text>
              <text class="price-max">{{ draftMax }}</text>
            </view>
            <view class="rs-wrapper" @touchstart="rsTouchStart" @touchmove="rsTouchMove" @touchend="rsTouchEnd" @mousedown="rsMouseDown" @mousemove="rsMouseMove" @mouseup="rsMouseUp" @mouseleave="rsMouseUp">
              <view class="rs-track">
                <view class="rs-fill" :style="rsFillStyle"></view>
              </view>
              <view class="rs-thumb rs-thumb-min" :style="{ left: rsMinPct + '%' }"></view>
              <view class="rs-thumb rs-thumb-max" :style="{ left: rsMaxPct + '%' }"></view>
            </view>
            <view class="price-scale">
              <text>0</text>
              <text>{{ PRICE_CAP }}</text>
            </view>
            <view class="custom-range">
              <text class="label">自定义区间</text>
              <view class="fields">
                <input v-model.number="draftMin" type="number" class="price-input" :min="0" :max="PRICE_CAP" />
                <text class="sep">-</text>
                <input v-model.number="draftMax" type="number" class="price-input" :min="0" :max="PRICE_CAP" />
              </view>
            </view>
          </view>
        </view>
        <view class="actions">
          <button class="btn" @click="resetFilter">重置</button>
          <button class="btn primary" @click="applyFilter">完成</button>
        </view>
      </view>
    </view>

    <!-- 底部导航 -->
    <view class="bottom">
      <view class="dock">
        <view class="nav active" @click="goIndex">
          <image class="nav-icon" src="/static/icons/camera-active.svg" mode="aspectFit" />
          <text>约拍</text>
        </view>
        <view class="nav" @click="goMe">
          <image class="nav-icon" src="/static/icons/person.svg" mode="aspectFit" />
          <text>我的</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { cardsList, filterStyles, PRICE_CAP } from '@/utils/data.js'
import { appState, isLiked, toggleLike } from '@/store/app.js'
import { getStatusBarHeight } from '@/utils/system.js'

const statusBarH = getStatusBarHeight()

const activeGroup = ref('active')
const isScrolling = ref(false)
let scrollTimer = null

function onContentScroll() {
  isScrolling.value = true
  clearTimeout(scrollTimer)
  scrollTimer = setTimeout(() => {
    isScrolling.value = false
  }, 800)
}

const showFilter = ref(false)
const appliedStyles = ref([])
const appliedMin = ref(0)
const appliedMax = ref(PRICE_CAP)
const draftStyles = ref(['人像摄影'])
const draftMin = ref(0)
const draftMax = ref(PRICE_CAP)

// 滑块百分比计算
const rsMinPct = computed(() => (draftMin.value / PRICE_CAP) * 100)
const rsMaxPct = computed(() => (draftMax.value / PRICE_CAP) * 100)
const rsFillStyle = computed(() => ({
  left: rsMinPct.value + '%',
  right: (100 - rsMaxPct.value) + '%'
}))

// 拖拽状态
const rsDragging = ref(null)
const rsTrackRect = ref(null)

// 自定义输入框同步：输入后自动校验并更新滑块/显示
watch(draftMin, (newVal) => {
  if (isNaN(newVal) || newVal === null || newVal === '') return
  const v = Math.floor(Number(newVal))
  if (v < 0) { draftMin.value = 0; return }
  if (v > PRICE_CAP) { draftMin.value = PRICE_CAP; return }
  if (v > draftMax.value) { draftMin.value = draftMax.value }
})

watch(draftMax, (newVal) => {
  if (isNaN(newVal) || newVal === null || newVal === '') return
  const v = Math.floor(Number(newVal))
  if (v > PRICE_CAP) { draftMax.value = PRICE_CAP; return }
  if (v < 0) { draftMax.value = 0; return }
  if (v < draftMin.value) { draftMax.value = draftMin.value }
})

function setActiveGroup(group) {
  activeGroup.value = group
}

const filteredCards = computed(() => {
  const list = cardsList.filter((c) => c.group === activeGroup.value)
  const styles = appliedStyles.value
  const min = appliedMin.value
  const max = appliedMax.value
  return list.filter((card) => {
    const cardStyles = card.styles || []
    const styleOk = styles.length === 0 || styles.some((s) => cardStyles.includes(s))
    const [cMin, cMax] = (card.price || '0-0').split('-').map(Number)
    const priceOk = !(cMax < min || cMin > max)
    return styleOk && priceOk
  })
})

const filterBadgeCount = computed(() => {
  let c = 0
  if (appliedStyles.value.length > 0) c += 1
  if (appliedMin.value !== 0 || appliedMax.value !== PRICE_CAP) c += 1
  return c
})

function toggleDraftStyle(s) {
  const i = draftStyles.value.indexOf(s)
  if (i >= 0) {
    draftStyles.value = draftStyles.value.filter((x) => x !== s)
  } else {
    draftStyles.value = [...draftStyles.value, s]
  }
}

function resetFilter() {
  draftStyles.value = []
  draftMin.value = 0
  draftMax.value = PRICE_CAP
}

function applyFilter() {
  let min = Number(draftMin.value) || 0
  let max = Number(draftMax.value) || PRICE_CAP
  if (min > max) [min, max] = [max, min]
  if (min < 0) min = 0
  if (max > PRICE_CAP) max = PRICE_CAP
  appliedStyles.value = [...draftStyles.value]
  appliedMin.value = min
  appliedMax.value = max
  showFilter.value = false
}

function goDetail(card) {
  appState.currentDetailCard = card
  uni.navigateTo({
    url: `/pages/detail/detail?id=${card.id}`
  })
}

function goMe() {
  uni.reLaunch({ url: '/pages/me/me' })
}

function goIndex() {
  uni.reLaunch({ url: '/pages/index/index' })
}

// 自定义滑块拖拽逻辑
function rsGetTrackRect() {
  return new Promise((resolve) => {
    uni.createSelectorQuery()
      .select('.rs-track')
      .boundingClientRect()
      .exec((res) => {
        resolve(res[0])
      })
  })
}

function rsUpdatePosition(clientX) {
  if (!rsTrackRect.value) return
  
  const trackLeft = rsTrackRect.value.left
  const trackWidth = rsTrackRect.value.width
  const px = ((clientX - trackLeft) / trackWidth) * PRICE_CAP
  const value = Math.round(Math.max(0, Math.min(PRICE_CAP, px)))
  
  if (rsDragging.value === 'min') {
    if (value > draftMax.value) {
      draftMin.value = draftMax.value
    } else {
      draftMin.value = value
    }
  } else if (rsDragging.value === 'max') {
    if (value < draftMin.value) {
      draftMax.value = draftMin.value
    } else {
      draftMax.value = value
    }
  }
}

async function rsTouchStart(e) {
  const touch = e.touches[0]
  rsTrackRect.value = await rsGetTrackRect()
  
  const px = ((touch.clientX - rsTrackRect.value.left) / rsTrackRect.value.width) * PRICE_CAP
  const value = Math.round(Math.max(0, Math.min(PRICE_CAP, px)))
  
  const distMin = Math.abs(value - draftMin.value)
  const distMax = Math.abs(value - draftMax.value)
  
  if (distMin < distMax) {
    rsDragging.value = 'min'
  } else {
    rsDragging.value = 'max'
  }
}

function rsTouchMove(e) {
  if (!rsDragging.value) return
  const touch = e.touches[0]
  rsUpdatePosition(touch.clientX)
}

function rsTouchEnd() {
  rsDragging.value = null
}

async function rsMouseDown(e) {
  rsTrackRect.value = await rsGetTrackRect()
  
  const px = ((e.clientX - rsTrackRect.value.left) / rsTrackRect.value.width) * PRICE_CAP
  const value = Math.round(Math.max(0, Math.min(PRICE_CAP, px)))
  
  const distMin = Math.abs(value - draftMin.value)
  const distMax = Math.abs(value - draftMax.value)
  
  if (distMin < distMax) {
    rsDragging.value = 'min'
  } else {
    rsDragging.value = 'max'
  }
}

function rsMouseMove(e) {
  if (!rsDragging.value) return
  rsUpdatePosition(e.clientX)
}

function rsMouseUp() {
  rsDragging.value = null
}
</script>

<style lang="scss" scoped>

.page-home {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: $xl-bg;
  position: relative;
}

.top {
  padding: 16rpx 32rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}
.title {
  font-size: 38rpx;
  font-weight: 700;
  color: rgba(22, 22, 22, 0.92);
}
.school-tag {
  padding: 6rpx 14rpx;
  border-radius: 12rpx;
  background: rgba(22, 22, 22, 0.45);
  color: #fff;
  font-size: 22rpx;
  font-weight: 600;
}

.tabs {
  padding: 20rpx 28rpx 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20rpx;
  border-bottom: 2rpx solid $xl-line;
}
.tab {
  padding: 20rpx 0 24rpx;
  font-size: 29rpx;
  color: $xl-muted;
  font-weight: 600;
  text-align: center;
  position: relative;
  &.active {
    color: rgba(22, 22, 22, 0.92);
    font-weight: 800;
  }
  &.active::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: -2rpx;
    width: 84rpx;
    height: 6rpx;
    border-radius: 999rpx;
    background: rgba(22, 22, 22, 0.82);
  }
}
.tab-filter {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
}
.filter-badge {
  padding: 4rpx 14rpx;
  font-size: 22rpx;
  border-radius: 999rpx;
  background: rgba(22, 22, 22, 0.12);
  color: rgba(22, 22, 22, 0.78);
}

.content {
  flex: 1;
  padding: 28rpx 28rpx 176rpx;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  /* 滚动条默认隐藏 */
  &::-webkit-scrollbar-thumb {
    background: transparent;
  }
  &.scrolling::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.18);
    transition: background 0.35s ease;
  }
}

.card {
  background: $xl-card;
  border-radius: $xl-radius;
  border: 2rpx solid rgba(22, 22, 22, 0.07);
  padding: 28rpx;
  margin-bottom: 24rpx;
  width: 100%;
  box-sizing: border-box;
}
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}
.who {
  display: flex;
  align-items: center;
  gap: 20rpx;
  min-width: 0;
}
.avatar {
  width: 92rpx;
  height: 92rpx;
  border-radius: 50%;
  background: #ddd;
  flex-shrink: 0;
}
.who-info {
  min-width: 0;
}
.name {
  font-size: 31rpx;
  font-weight: 800;
  color: rgba(22, 22, 22, 0.9);
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.verified-icon {
  width: 36rpx;
  height: 36rpx;
  background: linear-gradient(135deg, #4d94ff 0%, #2563eb 100%);
  color: #fff;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
.subtitle {
  font-size: 24rpx;
  color: $xl-muted2;
  font-weight: 700;
  margin-top: 4rpx;
  display: block;
}
.price {
  font-size: 30rpx;
  font-weight: 900;
  color: rgba(22, 22, 22, 0.86);
  flex-shrink: 0;
}
.bio {
  font-size: 25rpx;
  line-height: 1.45;
  color: $xl-muted;
  margin-bottom: 20rpx;
  display: block;
}
.gallery {
  display: grid;
  gap: 14rpx;
  margin-bottom: 20rpx;
  &.cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }
  &.cols-4 {
    grid-template-columns: repeat(4, 1fr);
  }
}
.shot {
  aspect-ratio: 1;
  border-radius: 20rpx;
  overflow: hidden;
  background: #eceae2;
  image {
    width: 100%;
    height: 100%;
  }
}
.card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  min-width: 0;
}
.chip {
  padding: 10rpx 20rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  background: $xl-chip;
  color: $xl-chip-text;
  border: 2rpx solid rgba(22, 22, 22, 0.05);
  &.status {
    background: rgba(67, 179, 90, 0.12);
    color: rgba(67, 179, 90, 0.95);
    border-color: rgba(67, 179, 90, 0.18);
    font-weight: 800;
  }
}
.fav {
  width: 68rpx;
  height: 68rpx;
  border-radius: 999rpx;
  border: 2rpx solid rgba(22, 22, 22, 0.08);
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  .heart {
    font-size: 36rpx;
    color: rgba(22, 22, 22, 0.16);
  }
  &.liked .heart {
    color: $xl-danger;
  }
}

.empty {
  padding: 68rpx 16rpx;
  text-align: center;
}
.empty-title {
  font-weight: 800;
  color: rgba(22, 22, 22, 0.84);
  font-size: 30rpx;
  display: block;
}
.empty-desc {
  margin-top: 12rpx;
  color: rgba(22, 22, 22, 0.48);
  font-weight: 700;
  font-size: 25rpx;
  display: block;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.52);
  z-index: 99;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.sheet {
  width: 100%;
  border-radius: 36rpx 36rpx 0 0;
  background: #fff;
  padding: 32rpx 32rpx 36rpx;
  overflow-x: hidden;
}
.sheet-head {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 12rpx 0 24rpx;
}
.sheet-title {
  font-size: 36rpx;
  font-weight: 900;
  color: rgba(22, 22, 22, 0.92);
}
.sheet-close {
  position: absolute;
  right: 0;
  top: 0;
  width: 68rpx;
  height: 68rpx;
  border-radius: 999rpx;
  background: rgba(22, 22, 22, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  font-weight: 700;
  color: rgba(22, 22, 22, 0.68);
}
.section {
  padding: 20rpx 0 12rpx;
}
.section-label {
  font-size: 26rpx;
  font-weight: 900;
  color: rgba(22, 22, 22, 0.85);
  margin-bottom: 20rpx;
  display: block;
}
.style-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}
.pill {
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
.price-area {
  padding: 10rpx 0 0;
}
.price-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 16rpx;
  font-weight: 900;
  color: rgba(22, 22, 22, 0.88);
  font-size: 28rpx;
  .price-min {
    font-weight: 900;
  }
  .price-max {
    font-weight: 900;
  }
}
.rs-wrapper {
  position: relative;
  height: 40rpx;
  display: flex;
  align-items: center;
  margin: 0 16px;
  padding: 0 20rpx;
}
.rs-track {
  position: absolute;
  left: 20rpx;
  right: 20rpx;
  height: 4rpx;
  border-radius: 999rpx;
  background: rgba(22, 22, 22, 0.12);
  overflow: hidden;
}
.rs-fill {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: $xl-accent;
  border-radius: 999rpx;
}
.rs-thumb {
  position: absolute;
  top: 50%;
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  background: #fff;
  border: 2rpx solid $xl-accent;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
  transform: translate(-50%, -50%);
  z-index: 10;
}
.price-scale {
  display: flex;
  justify-content: space-between;
  font-size: 24rpx;
  color: rgba(22, 22, 22, 0.6);
}
.custom-range {
  margin-top: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  padding: 20rpx 24rpx;
  border-radius: 16rpx;
  background: rgba(22, 22, 22, 0.04);
  border: 1rpx solid rgba(22, 22, 22, 0.08);
  .label {
    font-size: 28rpx;
    font-weight: 700;
    color: rgba(22, 22, 22, 0.72);
    white-space: nowrap;
  }
  .fields {
    display: inline-flex;
    align-items: center;
    gap: 12rpx;
    margin-left: auto;
  }
  .price-input {
    width: 140rpx;
    height: 64rpx;
    border-radius: 12rpx;
    border: 1rpx solid rgba(22, 22, 22, 0.14);
    background: #fff;
    padding: 0 16rpx;
    font-size: 28rpx;
    font-weight: 700;
    text-align: center;
  }
  .sep {
    font-size: 24rpx;
    color: rgba(22, 22, 22, 0.46);
    font-weight: 500;
    user-select: none;
  }
}
.actions {
  display: flex;
  width: 100%;
  padding-top: 32rpx;
}
.btn {
  flex: 1;
  height: 88rpx;
  border-radius: 0;
  border: none;
  background: #f0f0f0;
  color: rgba(22, 22, 22, 0.72);
  font-size: 28rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  &:first-child {
    border-radius: 16rpx 0 0 16rpx;
  }
  &:last-child {
    border-radius: 0 16rpx 16rpx 0;
  }
  &.primary {
    background: $xl-accent;
    color: #fff;
    border-color: $xl-accent;
  }
}

.bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 24rpx 32rpx 36rpx;
  background: linear-gradient(180deg, rgba(246, 245, 240, 0) 0%, rgba(246, 245, 240, 1) 30%);
  pointer-events: none;
}
.dock {
  pointer-events: auto;
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
  gap: 12rpx;
  color: rgba(22, 22, 22, 0.36);
  font-size: 23rpx;
  font-weight: 800;
  &.active {
    color: $xl-accent;
  }
}
.nav-icon {
  width: 44rpx;
  height: 44rpx;
  display: block;
}
</style>
