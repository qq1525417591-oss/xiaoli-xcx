<template>
  <view class="profile-page">
    <view :style="{ height: statusBarH + 'px', flexShrink: 0 }"></view>
    <view class="profile-header">
      <view class="profile-back" @click="back">
        <text>←</text>
      </view>
      <text class="profile-title">个人信息</text>
    </view>
    <scroll-view class="profile-content" scroll-y>
      <view class="profile-avatar-section">
        <image class="profile-avatar" :src="form.avatar" mode="aspectFill" />
      </view>
      <view class="profile-form">
        <view class="profile-form-item">
          <text class="profile-label">昵称<text class="required">*</text></text>
          <input v-model="form.nickname" class="profile-input" placeholder="请输入昵称" />
        </view>
        <view class="profile-form-item">
          <text class="profile-label">性别</text>
          <view class="profile-select" @click="showGenderPicker = true">
            <text class="profile-select-text">{{ form.gender }}</text>
            <text>›</text>
          </view>
        </view>
        <view class="profile-form-item">
          <text class="profile-label">手机</text>
          <input v-model="form.phone" type="number" class="profile-input" placeholder="请输入手机号" />
        </view>
        <view class="profile-form-item">
          <text class="profile-label">生日</text>
          <view class="profile-select" @click="showBirthdayPicker = true">
            <text class="profile-select-text">{{ form.birthday || '请选择生日' }}</text>
            <text>›</text>
          </view>
        </view>
        <view class="profile-form-item">
          <text class="profile-label">校区</text>
          <view class="profile-select" @click="showCampusPicker = true">
            <text class="profile-select-text">{{ form.campus || '请选择校区' }}</text>
            <text>›</text>
          </view>
        </view>
      </view>
      <view class="profile-save-section">
        <button class="profile-save-btn" @click="save">保存</button>
      </view>
    </scroll-view>
    <!-- 性别选择 -->
    <view v-if="showGenderPicker" class="picker-overlay" @click.self="showGenderPicker = false">
      <view class="picker-panel">
        <view class="picker-header">
          <text class="picker-cancel" @click="showGenderPicker = false">取消</text>
          <text class="picker-title">选择性别</text>
          <text class="picker-confirm" @click="showGenderPicker = false">确定</text>
        </view>
        <view class="picker-content">
          <view
            v-for="g in ['男', '女', '其他']"
            :key="g"
            class="picker-option"
            :class="{ selected: form.gender === g }"
            @click="form.gender = g; showGenderPicker = false"
          >
            <text>{{ g }}</text>
          </view>
        </view>
      </view>
    </view>
    <!-- 生日选择 -->
    <view v-if="showBirthdayPicker" class="picker-overlay" @click.self="showBirthdayPicker = false">
      <view class="picker-panel birthday-panel">
        <view class="picker-header">
          <text class="picker-cancel" @click="showBirthdayPicker = false">取消</text>
          <text class="picker-title">选择生日</text>
          <text class="picker-confirm" @click="confirmBirthday">确定</text>
        </view>
        <view class="birthday-display">
          <view class="display-item" :class="{ active: birthdayActive === 'year' }" @click="birthdayActive = 'year'">
            <input 
              v-if="birthdayActive === 'year'" 
              v-model.number="editYear" 
              type="number" 
              class="display-input"
              @blur="onYearInputBlur('year')"
              @keyup.enter="onYearInputBlur('year')"
            />
            <text v-else>{{ birthdayYear }}年</text>
          </view>
          <view class="display-item" :class="{ active: birthdayActive === 'month' }" @click="birthdayActive = 'month'">
            <input 
              v-if="birthdayActive === 'month'" 
              v-model.number="editMonth" 
              type="number" 
              class="display-input"
              @blur="onYearInputBlur('month')"
              @keyup.enter="onYearInputBlur('month')"
            />
            <text v-else>{{ birthdayMonth }}月</text>
          </view>
          <view class="display-item" :class="{ active: birthdayActive === 'day' }" @click="birthdayActive = 'day'">
            <input 
              v-if="birthdayActive === 'day'" 
              v-model.number="editDay" 
              type="number" 
              class="display-input"
              @blur="onYearInputBlur('day')"
              @keyup.enter="onYearInputBlur('day')"
            />
            <text v-else>{{ birthdayDay }}日</text>
          </view>
        </view>
        <view class="birthday-sliders">
          <view v-if="birthdayActive === 'year'" class="slider-section">
            <text class="slider-label">滑动选择年份</text>
            <slider 
              :min="currentYear - 100" 
              :max="currentYear" 
              :value="birthdayYear" 
              :step="1"
              activeColor="#d4a574"
              backgroundColor="rgba(22, 22, 22, 0.08)"
              block-size="24"
              @changing="onYearSliderChange"
              @change="onYearSliderChange"
            />
          </view>
          <view v-if="birthdayActive === 'month'" class="slider-section">
            <text class="slider-label">滑动选择月份</text>
            <slider 
              :min="1" 
              :max="12" 
              :value="birthdayMonth" 
              :step="1"
              activeColor="#d4a574"
              backgroundColor="rgba(22, 22, 22, 0.08)"
              block-size="24"
              @changing="onMonthSliderChange"
              @change="onMonthSliderChange"
            />
          </view>
          <view v-if="birthdayActive === 'day'" class="slider-section">
            <text class="slider-label">滑动选择日期</text>
            <slider 
              :min="1" 
              :max="daysInMonth" 
              :value="birthdayDay" 
              :step="1"
              activeColor="#d4a574"
              backgroundColor="rgba(22, 22, 22, 0.08)"
              block-size="24"
              @changing="onDaySliderChange"
              @change="onDaySliderChange"
            />
          </view>
        </view>
      </view>
    </view>
    <!-- 校区选择 -->
    <view v-if="showCampusPicker" class="picker-overlay" @click.self="showCampusPicker = false">
      <view class="picker-panel">
        <view class="picker-header">
          <text class="picker-cancel" @click="showCampusPicker = false">取消</text>
          <text class="picker-title">选择校区</text>
          <text class="picker-confirm" @click="showCampusPicker = false">确定</text>
        </view>
        <view class="picker-content">
          <view
            v-for="c in ['双拥校区', '武鸣校区', '玉林校区']"
            :key="c"
            class="picker-option"
            :class="{ selected: form.campus === c }"
            @click="form.campus = c; showCampusPicker = false"
          >
            <text>{{ c }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { getStatusBarHeight } from '@/utils/system.js'
import { reactive, ref, computed, watch } from 'vue'
import { appState } from '@/store/app.js'

const form = reactive({
  avatar: appState.meAvatar,
  nickname: appState.meName,
  gender: '男',
  phone: '15951762747',
  birthday: '',
  campus: ''
})

const showGenderPicker = ref(false)
const showBirthdayPicker = ref(false)
const showCampusPicker = ref(false)

const currentYear = new Date().getFullYear()

const birthdayActive = ref('year')
const birthdayYear = ref(currentYear - 20)
const birthdayMonth = ref(1)
const birthdayDay = ref(1)
const editYear = ref(currentYear - 20)
const editMonth = ref(1)
const editDay = ref(1)

const daysInMonth = computed(() => {
  const d = new Date(birthdayYear.value, birthdayMonth.value, 0)
  return d.getDate()
})

watch(birthdayMonth, () => {
  if (birthdayDay.value > daysInMonth.value) {
    birthdayDay.value = daysInMonth.value
  }
})

watch(birthdayYear, () => {
  if (birthdayDay.value > daysInMonth.value) {
    birthdayDay.value = daysInMonth.value
  }
})

watch(birthdayActive, (newVal) => {
  if (newVal === 'year') {
    editYear.value = birthdayYear.value
  } else if (newVal === 'month') {
    editMonth.value = birthdayMonth.value
  } else if (newVal === 'day') {
    editDay.value = birthdayDay.value
  }
})

function onYearInputBlur(type) {
  if (type === 'year') {
    let val = Number(editYear.value)
    const minYear = currentYear - 100
    if (isNaN(val)) val = birthdayYear.value
    if (val < minYear) val = minYear
    if (val > currentYear) val = currentYear
    birthdayYear.value = val
    editYear.value = val
  } else if (type === 'month') {
    let val = Number(editMonth.value)
    if (isNaN(val)) val = birthdayMonth.value
    if (val < 1) val = 1
    if (val > 12) val = 12
    birthdayMonth.value = val
    editMonth.value = val
  } else if (type === 'day') {
    let val = Number(editDay.value)
    if (isNaN(val)) val = birthdayDay.value
    if (val < 1) val = 1
    if (val > daysInMonth.value) val = daysInMonth.value
    birthdayDay.value = val
    editDay.value = val
  }
}

function onYearSliderChange(e) {
  birthdayYear.value = e.detail.value
  editYear.value = e.detail.value
}

function onMonthSliderChange(e) {
  birthdayMonth.value = e.detail.value
  editMonth.value = e.detail.value
}

function onDaySliderChange(e) {
  birthdayDay.value = e.detail.value
  editDay.value = e.detail.value
}

function confirmBirthday() {
  const monthStr = String(birthdayMonth.value).padStart(2, '0')
  const dayStr = String(birthdayDay.value).padStart(2, '0')
  form.birthday = `${birthdayYear.value}-${monthStr}-${dayStr}`
  showBirthdayPicker.value = false
}

const statusBarH = getStatusBarHeight()

function back() {
  uni.navigateBack()
}

function save() {
  if (!form.nickname.trim()) {
    uni.showToast({ title: '请输入昵称', icon: 'none' })
    return
  }
  if (!form.phone.trim()) {
    uni.showToast({ title: '请输入手机号', icon: 'none' })
    return
  }
  appState.meAvatar = form.avatar
  appState.meName = form.nickname
  uni.showToast({ title: '保存成功' })
  setTimeout(() => uni.navigateBack(), 800)
}
</script>

<style lang="scss" scoped>

.profile-page {
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
  width: 100%;
  box-sizing: border-box;
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
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
}
.profile-avatar-section {
  display: flex;
  justify-content: center;
  margin-bottom: 48rpx;
}
.profile-avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: #f5f5f5;
}
.profile-form {
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
}
.profile-form-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 2rpx solid rgba(22, 22, 22, 0.06);
  width: 100%;
  box-sizing: border-box;
  &:last-child {
    border-bottom: none;
  }
}
.profile-label {
  font-size: 30rpx;
  color: rgba(22, 22, 22, 0.68);
  font-weight: 500;
  .required {
    color: $xl-danger;
  }
}
.profile-input {
  font-size: 30rpx;
  color: rgba(22, 22, 22, 0.92);
  text-align: right;
  width: 400rpx;
}
.profile-select {
  display: flex;
  align-items: center;
  gap: 16rpx;
  font-size: 30rpx;
  color: rgba(22, 22, 22, 0.92);
}
.profile-save-section {
  margin-top: 64rpx;
  padding: 0 32rpx;
  width: 100%;
  box-sizing: border-box;
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
.picker-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 100;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.picker-panel {
  width: 100%;
  max-width: 750rpx;
  max-height: 60%;
  border-radius: 36rpx 36rpx 0 0;
  background: #fff;
  padding: 32rpx;
}
.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12rpx 0 24rpx;
}
.picker-cancel,
.picker-confirm {
  font-size: 30rpx;
  font-weight: 700;
  color: $xl-accent;
}
.picker-title {
  font-size: 36rpx;
  font-weight: 900;
  color: rgba(22, 22, 22, 0.92);
}
.picker-option {
  padding: 24rpx 28rpx;
  font-size: 30rpx;
  font-weight: 700;
  color: rgba(22, 22, 22, 0.92);
  border-bottom: 2rpx solid rgba(22, 22, 22, 0.06);
  &.selected {
    color: $xl-accent;
  }
}
.birthday-panel {
  border-radius: 40rpx 40rpx 0 0;
  overflow: hidden;
}
.birthday-display {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24rpx;
  padding: 24rpx 32rpx 32rpx;
}
.display-item {
  padding: 16rpx 32rpx;
  border: 2rpx solid rgba(22, 22, 22, 0.12);
  border-radius: 16rpx;
  font-size: 30rpx;
  color: rgba(22, 22, 22, 0.6);
  transition: all 0.2s;
  min-width: 140rpx;
  text-align: center;
  position: relative;
  &.active {
    border-color: rgba(200, 162, 122, 1);
    color: rgba(22, 22, 22, 0.92);
    font-weight: 600;
  }
}
.display-input {
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 30rpx;
  font-weight: 600;
  color: rgba(22, 22, 22, 0.92);
  border: none;
  background: transparent;
  outline: none;
}
.birthday-sliders {
  padding: 0 32rpx 32rpx;
}
.slider-section {
  margin-bottom: 40rpx;
  &:last-child {
    margin-bottom: 0;
  }
}
.slider-label {
  display: block;
  font-size: 28rpx;
  color: rgba(22, 22, 22, 0.65);
  margin-bottom: 24rpx;
}
</style>
