import { Component } from 'react'
import { View } from '@tarojs/components'

import './index.less'

export default class UserAgreement extends Component {

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }


  render() {
    return (
      <View className='agreement'>
        <View className='versionnumber'>
          协议版本：20220924
        </View>
        <View className='subhead'>
          尊敬的用户：
        </View>
        <View className='main'>
          欢迎注册并使用本网站。Parent Lab 养育实验室微信小程序网站（以下简称“本网站”）， 是由育见（杭州）科技有限公司（以下简称 “甲方”）开发并提供服务。通过页面点击、 勾选或其他方式确认后，将视为您（以下简称“乙方”或“用户”）同意并与甲方签署本协 议。您的注册、登录、使用等行为将视为无条件接受本协议之约束。
        </View>

        <View className='subhead'>
          1. 网站注册及提供服务
        </View>
        <View className='main'>
          （1）乙方按照网站提示完成全部注册程序，获得注册账户。在用户注册及使用本网站时， 本网站需要搜集用户信息，包括但不限于用户身份证件信息、所在城市、联系方式等。甲方 对以上用户信息的使用受到法律法规及本协议隐私保护条款的约束。
        </View>

        <View className='main'>
          （2）乙方在注册及使用本网站过程中应保证所提供用户信息的真实性，若因乙方提供信息 不真实而引起的问题及相关法律责任，由乙方自行承担。
        </View>

        <View className='main'>
          （3）乙方在本网站中可选取、购买、使用 Parent Lab 中国旗下家庭关系沟通培训项目服务 及其他各种增值服务。
        </View>

        <View className='main'>
          （4）甲方通过本网站推出的新产品、新功能、新服务，均受到本协议及《用户服务协议》 之规范。
        </View>

        <View className='subhead'>
          2. 隐私保护
        </View>

        <View className='main'>
          （1）甲方承诺所收集用户信息仅为了通过创建账户、查询识别用户、联系回复用户等方式 来为用户提供服务。
        </View>

        <View className='main'>
          （2）根据用户上传信息产生的匿名汇总统计数据，不属于用户信息范畴，也不存在隐私泄 露风险。在确保用户资料安全的前提下，甲方保留对匿名汇总统计数据进行分析及进行商业 利用的权利。
        </View>

        <View className='main'>
          （3）甲方将尽力采取商业及技术范畴的必要、合理的保障措施来保护用户上传的个人信息。 同时，乙方也应了解网络信息传输数据并非完全安全，必须充分意识到非因甲方原因导致隐私泄露的风险存在。
        </View>

        <View className='main'>
          （4） 乙方应对其注册帐号、密码等信息保密，以免被盗用或遭窜改。若发现上述情况应立 即与甲方联系。怠于保护本人隐私导致的损害后果，由乙方自行承担。
        </View>

        <View className='main'>
          （5）虽然我们会尽最大努力保护用户隐私，但当我们有理由相信只有公开个人信息才能遵 循现行司法程序、 法院指令或其他法律程序或者保护我公司、我公司用户或第三方的权利、 财产或安全时，我们可能披露个人信息。
        </View>

        <View className='subhead'>
          3. 内容规范
        </View>

        <View className='main'>
          （1）本条款所述内容是指用户使用本网站过程中所制作、上传、发布、传播的文字、语音、 图片等任何内容，包括但不限于账号头像、账户名等注册信息及认证资料等。
        </View>

        <View className='main'>
          （2）用户承诺规范使用本网站服务，所制作、上传、发布、传播的内容不得有以下情形：
        </View>

        <View className='main'>
          A. 违反宪法、法律法规及国家政策；
        </View>

        <View className='main'>
          B. 发布骚扰、垃圾广告、恶意信息、诱骗信息等；
        </View>

        <View className='main'>
          C. 侵犯其他用户或第三方合作权益的内容；
        </View>

        <View className='main'>
          C. 侵犯其他用户或第三方合作权益的内容；
        </View>

        <View className='main'>
          D. 含有诱骗、骚扰、广告和其他恶意信息；
        </View>


        <View className='subhead'>
          4. 知识产权
        </View>

        <View className='main'>
          本网站服务中包含的任何文字、图表、音频、视频、数据、程序、代码等信息或材料均 受著作权法、商标法和其它法律法规保护，未经甲方及相关权利人书面同意，用户不得以任 何方式使用该信息或材料。若未经允许使用的，用户应赔偿甲方一切损失，并承担甲方主张 权利而产生的一切费用（包括诉讼费用、保全费用、公证费用及律师费等）。
        </View>



        <View className='subhead'>
          5. 免责声明
        </View>

        <View className='main'>
          （1）如因用户违反有关法律、法规或本协议项下的任何条款而给任何其他第三人造成损失， 用户同意承担由此造成的损害赔偿责任。
        </View>

        <View className='main'>
          （2）因恶意网络攻击等非甲方原因的情形，导致用户隐私信息泄露的，用户同意我公司不 承担任何责任。
        </View>

        <View className='main'>
          （3）因电信系统、网络故障、计算机故障或其它任何不可抗力原因而使用户产生损失的, 甲 方不承担任何责任,但将尽力减少因此给用户造成的损失和影响。
        </View>

        <View className='main'>
          （4）如因网站系统维护或升级的需要而需暂停服务的，甲方将在（公告页面）进行事先通 告。用户未及时知悉导致使用服务受阻碍的，甲方不承担任何责任,但将尽力减少因此给用 户造成的损失和影响。
        </View>


        <View className='subhead'>
          6. 其他
        </View>

        <View className='main'>
          （1）甲方不行使、未能及时行使或者未充分行使本协议或者按照法律规定所享有的权利， 不应被视为放弃该权利，也不影响甲方在将来行使该权利。
        </View>

        <View className='main'>
          （2）本协议适用中华人民共和国大陆地区现行法律法规。因履行本协议而发生的任何争议， 经双方协商仍不能一致的，应提交至甲方所在地有管辖权的人民法院通过诉讼解决。
        </View>

        <View className='main'>
          （3）本协议自用户成功注册之日起视为签署生效。甲方保留在任何时候修改本协议条款的 权利，若本协议条款进行修改，则将在（公告页面）进行公告，不再向您单独通知。变更后 的协议一经网站公示/更新，立即自动生效。若您不接受修改后的条款，则请立即停止使用 本协议所涉 Parent Lab 项目服务，继续使用服务将被视为接受修改后的协议。
        </View>



        <View className='subhead'>

        </View>

        <View className='main'>

        </View>

        <View className='main'>

        </View>

      </View>

    )
  }
}
