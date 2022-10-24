export default defineAppConfig({
  pages: [
    // 'pages/index/index',   // 首页
    // 'pages/personalCenter/index',  // 个人中心
    // 'pages/detail/index',  // 活动详情页
    // 'pages/login/index',  // 登录页
    'pages/transition/index',  // 中转页
    'pages/questionnaire/index',   // 问卷
    'pages/register/index',     // 预约面谈
    'pages/registerFinished/index', // 预约面谈完成
    'pages/myRegistered/index',  // 我报名的活动
    'pages/myOrder/index',  // 我的订单
    'pages/myProfile/index',  // 我的基本信息
    'pages/interviewFinished/index',  // 面谈结果
    'pages/agreementPreview/index',   // 协议预览
    'pages/ratifyAccord/index',   // 签署协议
    'pages/payOrder/index',   // 待支付
    'pages/paymentSuccess/index',   // 支付已完成
    'pages/bannerDetail/index',   // 打开banner 公众号文章
    'pages/assessmentCenter/index',   // 测一测
    'pages/assessmentDetail/index',   // 测评详情
    'pages/myAssessment/index',   // 我的测评
    'pages/assessment/index',   // 测评
    'pages/report/index',   // 测评结果
    
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fefaee',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
})
