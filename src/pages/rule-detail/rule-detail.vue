<template>
  <view class="rule-detail-page">
    <view :style="{ height: statusBarH + 'px', flexShrink: 0 }"></view>
    <view class="rule-header">
      <view class="rule-back" @click="back">
        <text>←</text>
      </view>
      <text class="rule-title">{{ title }}</text>
    </view>
    <view class="rule-content">
      <view class="rule-body">
        <text class="rule-section-title">{{ contentTitle }}</text>
        <text class="rule-text">{{ content }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { getStatusBarHeight } from '@/utils/system.js'
import { computed } from 'vue'

const statusBarH = getStatusBarHeight()

const props = defineProps({
  type: { type: String, default: 'service' }
})

const titles = {
  service: '用户服务协议',
  privacy: '隐私政策',
  settle: '入驻补充协议'
}

const contentTitles = {


  service: '《用户服务协议》',
  privacy: '《隐私政策》',
  settle: '《摄影师入驻补充协议》'
}

const contents = {
  // 用户服务协议（对应第一张图片）
  service: '《校里平台用户服务协议》\n\n一、协议的确认与接受\n欢迎使用“校里”小程序平台（以下简称“本平台”）。\n您在使用本平台前，应仔细阅读并同意本协议全部内容。\n如您不同意本协议，应立即停止使用本平台。\n\n二、平台服务内容\n本平台为校园场景下的综合信息服务平台，目前主要提供：\n• 校园约拍信息发布与展示\n• 摄影师展示与认证\n• 校园互免合作信息\n• 用户内容发布与管理\n• 校园类便捷信息撮合\n本平台仅为信息撮合平台，不直接参与用户之间的实际线下服务行为。\n用户之间达成的线下服务行为、交易行为或纠纷，与本平台无直接关系。\n\n三、用户注册与账号管理\n1. 用户需提供真实、合法、有效的信息注册账号。\n2. 用户应妥善保管账号信息。\n3. 因账号泄露造成的损失，由用户自行承担。\n4. 本平台有权对异常账号进行冻结或封禁处理。\n\n四、用户行为规范\n用户不得利用本平台从事以下行为：\n• 发布违法违规内容\n• 发布涉黄、低俗、诱导性内容\n• 发布虚假信息\n• 侵犯他人肖像权、著作权\n• 进行诈骗或诱导转账行为\n• 线下实施违法行为\n如发现违规行为，本平台有权：删除内容、限制账号、永久封禁、向有关部门报告。\n\n五、内容归属与授权\n用户在本平台发布的文字、图片、视频等内容，其知识产权归用户或原权利人所有。\n用户同意授予本平台在运营范围内对其发布内容进行展示、推广、信息传播的权利。\n\n六、免责条款\n1. 本平台为信息展示与撮合服务平台，不对用户线下行为承担责任。\n2. 用户之间产生的纠纷，由双方自行协商解决。\n3. 因不可抗力或系统维护造成的服务中断，本平台不承担赔偿责任。\n\n七、协议修改\n本平台有权根据运营需要修改本协议内容，并在平台公示。\n修改后的协议自公示之日起生效。',

  // 隐私政策（对应第二张图片）
  privacy: '《校里平台隐私政策》\n\n一、我们收集的信息\n为了提供服务，我们可能收集以下信息：\n1. 注册信息（昵称、手机号码）\n2. 身份认证信息（摄影师认证所需资料）\n3. 发布内容信息（文字、系统版本）\n4. 设备信息（设备型号、操作系统）\n5. 日志信息（访问时间、操作记录）\n\n二、信息的使用目的\n我们收集信息用于：\n• 用户身份识别\n• 内容展示\n• 优化平台体验\n• 处理纠纷\n• 安全风控\n我们不会将用户信息出售给第三方。\n\n三、信息共享情况\n在以下情况下，可能会共享信息：\n1. 法律法规要求\n2. 监管机关要求\n3. 用户明确授权\n\n四、信息存储与保护\n• 采用合理技术措施保护数据安全\n• 防止信息泄露、篡改\n• 非必要不长期保存数据\n\n五、用户权利\n用户有权：\n• 查询个人信息\n• 修改个人信息\n• 注销账号\n• 删除发布内容\n\n六、未成年人保护\n本平台原则上仅面向年满16周岁用户。',

  // 入驻补充协议（对应第三张图片）
  settle: '《摄影师入驻补充协议》\n\n一、入驻条件\n• 提供真实身份信息\n• 提供真实作品\n• 保证具备合法经营资格\n\n二、服务责任\n摄影师需自行承担：\n• 服务质量责任\n• 线下行为责任\n• 与客户之间的合同责任\n• 因服务引发的纠纷\n平台仅做信息展示服务。\n\n三、平台抽佣（尚未开启）\n若未来开启佣金模式，平台有权收取约定比例服务费。\n\n四、违规处理\n• 虚假宣传\n• 诱导线下交易欺诈\n• 收款后不履约\n平台有权下架并封禁账号。'
}

const title = computed(() => titles[props.type] || '规则详情')
const contentTitle = computed(() => contentTitles[props.type] || '')
const content = computed(() => contents[props.type] || '暂无内容')

function back() {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>

.rule-detail-page {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}
.rule-header {
  padding: 32rpx 40rpx;
  background: #fff;
  display: flex;
  align-items: center;
  position: relative;
  border-bottom: 2rpx solid $xl-line;
}
.rule-back {
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
.rule-title {
  flex: 1;
  text-align: center;
  font-size: 36rpx;
  font-weight: 800;
  color: rgba(22, 22, 22, 0.92);
}
.rule-content {
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
.rule-body {
  padding: 0;
  font-size: 28rpx;
  line-height: 1.8;
  color: rgba(22, 22, 22, 0.85);
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-all;
  width: 100%;
  box-sizing: border-box;
}
.rule-section-title {
  font-size: 34rpx;
  font-weight: 900;
  color: rgba(22, 22, 22, 0.92);
  margin-bottom: 32rpx;
  display: block;
}
.rule-text {
  font-size: 28rpx;
  line-height: 1.8;
  color: rgba(22, 22, 22, 0.78);
  white-space: pre-line;
  display: block;
}
</style>
