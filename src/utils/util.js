
// 判断手机号
export const isPhone = (num) => {
    return /^1\d{10}( 1\d{10})*$/.test(num);
};

// 判断邮箱
export const isEmail = (str) => {
    return /^\w+((-\w+)|(\.\w+))*\@{1}\w+\.{1}\w{2,4}(\.{0,1}\w{2}){0,1}/ig.test(str);
};

// 判断身份证号
export const isIDNum = (str) => {
    var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return regIdNo.test(str);
};


// 根据状态返回下一步的URL
export const getQueryRegisterProgressUrl = (hasProfile, state, registerID, eventID) => {
    let url = ''
    if (hasProfile === false) {
        url = `/pages/myProfile/index?state=${state}&registerID=${registerID}&eventID=${eventID}`
    } else {
        if (state === 'registered') {
            // 已预约了活动，但是还未填写问卷（跳转到问卷页）
            url = `/pages/questionnaire/index?registerID=${registerID}&eventID=${eventID}`
        } else if (state === 'questionnaire_completed' || state === 'to_be_interviewed') {
            // 已完成问卷，或者不需要填写问卷（跳转到选择预约面谈时间页）
            url = `/pages/register/index?registerID=${registerID}`
        } else if (state === 'meeting_time_submitted' || state === 'meeting_time_confirmed') {
            // 已预约面谈时间，或后台确认了具体时间（跳转到完成预约面谈时间页）
            url = `/pages/registerFinished/index?registerID=${registerID}`
        } else if (state === 'interview_passed' || state === 'interview_failed') {
            // 面谈通过，或未通过 （跳转到面谈结果页）
            url = `/pages/interviewFinished/index?registerID=${registerID}`
        } else if (state === 'to_be_signed') {
            // 不需要面谈 （直接跳签约页面）
            url = `/pages/agreementPreview/index?registerID=${registerID}`
        }
    }
    return url
}

/**
 * 时间戳转化为年 月 日 时 分 秒
 * number: 传入时间戳
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
 */
export function formatTime(number, format) {
    if (!number) return null;
    number = number && number / 1000;
    var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
    var returnArr = [];
    var date = new Date(number * 1000);
    returnArr.push(date.getFullYear());
    returnArr.push(date.getMonth() + 1);
    returnArr.push(date.getDate());
    returnArr.push(date.getHours());
    returnArr.push(
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
    );
    returnArr.push(date.getSeconds());
    format = typeof format == 'function' ? format(number * 1000) : format;
    for (var i in returnArr) {
        format = format.replace(formateArr[i], returnArr[i]);
    }
    return format;
}

export function IDTypeCode(type) {
    switch (type) {
        case '身份证':
            return 'CRED_PSN_CH_IDCARD'
            break
        case '护照':
            return 'CRED_PSN_PASSPORT'
            break
        default:
            return ''
    }
}

export function IDCodeType(code) {
    switch (code) {
        case 'CRED_PSN_CH_IDCARD':
            return '身份证'
            break
        case 'CRED_PSN_PASSPORT':
            return '护照'
            break
        default:
            return ''
    }
}
