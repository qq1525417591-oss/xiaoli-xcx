import { reactive } from 'vue'

/**
 * 简单全局状态（跨页面共享）
 */
export const appState = reactive({
  // 收藏的卡片 id 列表
  likedIds: ['1'],
  // 入驻审核状态：pending | passed | rejected
  auditStatusValue: 'passed',
  // 我的页面展示：头像、昵称
  meAvatar: 'https://picsum.photos/seed/me_avatar/120/120',
  meName: '食盐 shiro',
  // 接单状态开关（摄影师身份）
  orderEnabled: true,
  // 当前查看的详情卡片（用于 detail 页）
  currentDetailCard: null,
  // 登录状态
  isLoggedIn: false
})

export function isLiked(id) {
  return appState.likedIds.includes(String(id))
}

export function toggleLike(id) {
  const s = String(id)
  const i = appState.likedIds.indexOf(s)
  if (i >= 0) {
    appState.likedIds.splice(i, 1)
  } else {
    appState.likedIds.push(s)
  }
}

export function setAuditStatus(value) {
  appState.auditStatusValue = value
}

export function setMeProfile({ avatar, name }) {
  if (avatar) appState.meAvatar = avatar
  if (name !== undefined) appState.meName = name
}

export function setLoggedIn() {
  appState.isLoggedIn = true
}
