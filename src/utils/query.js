import { request } from '../request'

// 获取首页 Banner 列表接口
export async function getHomepageBanners() {
    return request('/wechat_mp/homepage_banners')
}

// 获取首页 event 列表接口
export async function getHomepageEvents() {
    return request('/wechat_mp/homepage_event_banners')
}

// 获取首页 event 详情接口
export async function getEventForID(id) {
    return request(`/wechat_mp/events/${id}`)
}

// 微信小程序登陆（注册）功能接口
export async function wechatLogin(data) {
    return request('/wechat_mp/login', {
        method: 'POST',
        data
    })
}

// 更新用户微信信息的接口
export async function updateUsersWechatInfo(data) {
    return request('/wechat_mp/users', {
        method: 'PUT',
        data
    })
}

// 用户选择 SKU 后，点击‘下一步’按钮时，报名（生成订单）接口（此接口需要鉴权）
export async function registrations(data) {
    return request('/wechat_mp/event_registrations', {
        method: 'POST',
        data
    })
}

// 获取用户profile信息
export async function getUserProfile() {
    return request('/wechat_mp/users')
}

// 更新用户profile信息的接口
export async function updateUsersProfileInfo(data) {
    return request('/wechat_mp/users/update_profile', {
        method: 'PUT',
        data
    })
}

// 获取某 Event 的问卷问题列表接口
export async function getQuestionsForEventID(eventID) {
    return request(`/wechat_mp/events/${eventID}/questions`)
}

// 提交用户填写的问卷内容
export async function submitQuestionnaire(data, eventID) {
    return request(`/wechat_mp/event_registrations/${eventID}/submit_questionnaire`, {
        method: 'PUT',
        data
    })
}

// 提交用户选择的期望面谈时间
export async function submitMeetingTime(data, registerID) {
    return request(`/wechat_mp/event_registrations/${registerID}/submit_expected_meeting_time`, {
        method: 'PUT',
        data
    })
}

// 获取某 EventRegistration（订单）详情接口
export async function getRegisteredDetail(registerID) {
    return request(`/wechat_mp/event_registrations/${registerID}`)
}

// 获取已报名的活动列表
export async function getRegisteredList() {
    return request('/wechat_mp/event_registrations/my_registered_events')
}

// 获取支付和待支付订单列表
export async function getOrderList() {
    return request('/wechat_mp/event_registrations/my_orders')
}

// 提交用户协议信息
export async function submitProtocolUserInfo(data, registerID) {
    return request(`/wechat_mp/event_registrations/${registerID}/generate_agreement`, {
        method: 'POST',
        data
    })
}

// 获取一步签署参数
export async function getStartSignParams(registerID) {
    return request(`/wechat_mp/event_registrations/${registerID}/start_sign`, {
        method: 'POST',
    })
}

// 签署完成后通知后端更新订单状态
export async function agreementSigned(registerID) {
    return request(`/wechat_mp/event_registrations/${registerID}/agreement_signed`, {
        method: 'PUT',
    })
}

// 获取待支付订单详情
export async function getOrderInfo(registerID) {
    return request(`/wechat_mp/event_registrations/${registerID}`)
}

// 退出登录
export async function logout() {
    return request('/wechat_mp/logout', {
        method: 'DELETE'
    })
}

// 获取小程序统一配置信息接口
export async function getWeChatSettings() {
    return request('/wechat_mp/settings')
}

// 获取微信支付参数
export async function getWeChatPayParams(registerID) {
    return request(`/wechat_mp/event_registrations/${registerID}/wx_pay`, {
        method: 'POST'
    })
}

// 获取已支付订单的详情
export async function getPaidOrderInfo(registerID) {
    return request(`/wechat_mp/event_registrations/${registerID}/check_payment_status`)
}

// 发起退款
export async function initiateRefund(registerID) {
    return request(`/wechat_mp/event_registrations/${registerID}/refund`, {
        method: 'POST'
    })
}

// 获取测评分类
export async function getAssessmentCategories() {
    return request('/wechat_mp/assessment_categories')
}

// 根据分类查询测评列表
export async function getAssessmentsForCategoriesID(ategoryId) {
    return request(`/wechat_mp/assessments?q[assessment_category_id_eq]=${ategoryId}`, {
        method: 'GET',
    })
}

// 获取测评详情
export async function getAssessmentDetail(assessmentID) {
    return request(`/wechat_mp/assessments/${assessmentID}`)
}

// 获取测评进度和题目
export async function getAssessmentQuestions(data) {
    return request('/wechat_mp/assessment_user_relations', {
        method: 'POST',
        data
    })
}

// 更新答题进度
export async function updateProgress(relationsID, data) {
    return request(`/wechat_mp/assessment_user_relations/${relationsID}`, {
        method: 'PUT',
        data
    })
}

// 更新答题进度
export async function assessmentFinished(relationsID) {
    return request(`/wechat_mp/assessment_user_relations/${relationsID}/finish`, {
        method: 'PUT',
    })
}

// 更新答题进度
export async function getReportInfo(relationsID) {
    return request(`/wechat_mp/assessment_user_relations/${relationsID}`)
}

// 获取用户公开信息信息
export async function getUserPublicInfo(openid) {
    return request(`/wechat_mp/users/${openid}/public_info`)
}

// 获取我的测评列表
export async function getMyAssessments() {
    return request('/wechat_mp/assessment_user_relations')
}

// 上报微信手机code
export async function updatePhoneNumber(data) {
    return request('/wechat_mp/users/update_phone_number', {
        method: 'PUT',
        data
    })
}

// 获取用户昵称头像手机号
export async function getUserProfileInfo() {
    return request('/wechat_mp/users/profile_info')
}

// 用户直接修改手机号
export async function updatePhone(data) {
    return request('/wechat_mp/users/update_phone_number_by_user', {
        method: 'PUT',
        data
    })
}


