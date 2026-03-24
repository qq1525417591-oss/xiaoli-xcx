/**
 * 获取状态栏高度（px）
 * 优先使用 uni.getWindowInfo（对应新版 wx.getWindowInfo），
 * 避免 wx.getSystemInfoSync deprecated 警告。
 */
export function getStatusBarHeight() {
  try {
    if (typeof uni.getWindowInfo === 'function') {
      return uni.getWindowInfo().statusBarHeight || 44
    }
    return uni.getSystemInfoSync().statusBarHeight || 44
  } catch (e) {
    return 44
  }
}
