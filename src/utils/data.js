/**
 * 校里·约拍 - 共享数据与常量
 */

// 摄影师卡片列表（首页/接单中、新入驻）
export const cardsList = [
  {
    id: '1',
    group: 'active',
    name: '开到茶花',
    avatar: 'https://picsum.photos/seed/avatar1/120/120',
    subtitle: '热爱胶片摄影 · 校园写真/毕业照',
    price: '300-800',
    bio: '热爱胶片摄影，主接校园写真、毕业照，欢迎约拍！',
    styles: ['日系', '胶片复古', '校园风'],
    statusLabel: '接单中',
    galleryCols: 3,
    shots: [
      'https://picsum.photos/seed/shot11/240/240',
      'https://picsum.photos/seed/shot12/240/240',
      'https://picsum.photos/seed/shot13/240/240'
    ],
    liked: true,
    wechatId: 'shiro_wechat_001'
  },
  {
    id: '2',
    group: 'active',
    name: 'Oliver',
    avatar: 'https://picsum.photos/seed/avatar2/120/120',
    subtitle: '人像摄影 · 棚拍/情绪片',
    price: '400-600',
    bio: '擅长人像光影与情绪表达，欢迎来一组高级感棚拍。',
    styles: ['人像摄影', '棚拍'],
    statusLabel: '接单中',
    galleryCols: 4,
    shots: [
      'https://picsum.photos/seed/shot21/240/240',
      'https://picsum.photos/seed/shot22/240/240',
      'https://picsum.photos/seed/shot23/240/240',
      'https://picsum.photos/seed/shot24/240/240'
    ],
    liked: false,
    wechatId: 'oliver_wechat'
  },
  {
    id: '4',
    group: 'active',
    name: '阿澈',
    avatar: 'https://picsum.photos/seed/avatar4/120/120',
    subtitle: '日系清新 · 毕业季/情侣写真',
    price: '200-450',
    bio: '喜欢用镜头记录真实的你，擅长日系清新风格，每一帧都有故事感。',
    styles: ['日系清新', '情绪片', '毕业写真'],
    statusLabel: '接单中',
    galleryCols: 3,
    shots: [
      'https://picsum.photos/seed/shot41/240/240',
      'https://picsum.photos/seed/shot42/240/240',
      'https://picsum.photos/seed/shot43/240/240',
      'https://picsum.photos/seed/shot44/240/240',
      'https://picsum.photos/seed/shot45/240/240',
      'https://picsum.photos/seed/shot46/240/240'
    ],
    liked: false,
    wechatId: 'ache_photo_wx'
  },
  {
    id: '3',
    group: 'new',
    name: '小星',
    avatar: 'https://picsum.photos/seed/avatar3/120/120',
    subtitle: '新入驻 · 毕业写真/校园风',
    price: '120-300',
    bio: '刚入驻，档期充足！偏日系清新，适合校园漫步与毕业留念。',
    styles: ['毕业写真', '校园风'],
    statusLabel: '新入驻',
    galleryCols: 3,
    shots: [
      'https://picsum.photos/seed/shot31/240/240',
      'https://picsum.photos/seed/shot32/240/240',
      'https://picsum.photos/seed/shot33/240/240'
    ],
    liked: false,
    wechatId: 'xiaoxing_wechat'
  }
]

// 筛选「擅长」选项
export const filterStyles = [
  '人像摄影', '胶片复古', '日系清新', '毕业写真', '情绪片',
  '互勉', '证件照', '棚拍', '日系', '女摄', '同校'
]

// 详情页「关于我」文案
export const aboutMap = {
  '食盐shiro': '热爱捕捉校园中转瞬即逝的青春时刻。\n专注于自然光人像和充满情绪的故事感拍摄。\n武鸣校区周末及节假日可预约。',
  '开到茶花': '热爱捕捉校园中转瞬即逝的青春时刻。\n专注于自然光人像和胶片氛围的故事感拍摄。\n周末/节假日可预约，欢迎来聊天～',
  Oliver: '擅长人像光影与情绪表达，偏高级感棚拍与街拍。\n希望每一次按下快门，都能留下你更自信的一面。',
  小星: '新入驻，档期充足！偏日系清新与校园风，适合毕业季与日常纪念。\n可以一起边走边拍，轻松不尬。',
  阿澈: '镜头里的你，比你想象中更好看。\n擅长日系清新与情绪人像，每一帧都有自己的故事。\n武鸣校区周末可约～'
}

// 审核状态
export const auditStatuses = [
  { value: 'pending', label: '审核中', class: 'pending' },
  { value: 'passed', label: '已通过', class: 'passed' },
  { value: 'rejected', label: '未通过', class: 'rejected' }
]

// 价格区间上限
export const PRICE_CAP = 9999     // 滑块轨道上限
export const PRICE_MAX = 9999     // 手动输入上限
