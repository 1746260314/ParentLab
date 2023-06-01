export default defineAppConfig({
  pages: [
    // 'pages/detail/index',  // 活动详情页
    // 'pages/transition/index',  // 中转页
    // 'pages/questionnaire/index',   // 问卷
    // 'pages/register/index',     // 预约面谈
    // 'pages/registerFinished/index', // 预约面谈完成
    // 'pages/myRegistered/index',  // 我报名的活动
    // 'pages/myOrder/index',  // 我的订单
    // 'pages/myProfile/index',  // 我的基本信息
    // 'pages/interviewFinished/index',  // 面谈结果
    // 'pages/agreementPreview/index',   // 协议预览
    // 'pages/ratifyAccord/index',   // 签署协议
    // 'pages/payOrder/index',   // 待支付
    // 'pages/orderExpired/index',   // 订单已失效
    // 'pages/paymentSuccess/index',   // 支付已完成

    'pages/index/index',   // 首页
    'pages/bannerDetail/index',   // 打开banner 公众号文章
    'pages/parentCoach/index',   // 家长教练
    'pages/assessmentCenter/index',   // 养育测试
    'pages/personalCenter/index',  // 个人中心
    'pages/login/index',  // 登录页
    'pages/assessmentDetail/index',   // 测评详情
    'pages/myAssessment/index',   // 我的测评
    'pages/assessment/index',   // 测评
    'pages/report/index',   // 测评结果
    'pages/userAgreement/index',   // 网站许可及服务协议
    'pages/orderAgreement/index',   // 用户服务协议
    'pages/assessmentDetailV2/index',   // 测评详情V2
    'pages/assessmentV2/index',   // 测评V2
    'pages/reportV2/index',   // 测评结果V2
    'pages/reportInsights/index',   // 详情解读
    'pages/otherInsights/index',   // 其他详情解读
    'pages/feedback/index',   // 吐槽我们
    'pages/comparison/index',   // 对比报告
    'pages/myChildren/index',   // 我的孩子
    'pages/myChildRearing/index',   // 我的孩子
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fefaee',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
})
