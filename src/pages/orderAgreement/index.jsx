import { Component } from 'react'
import { View, Text } from '@tarojs/components'

import './index.less'

export default class OrderAgreement extends Component {

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
          欢迎参加 Parent Lab 中国旗下家庭关系沟通培训项目。
        </View>
        <View className='main'>
          <Text className='highlight'> 请您仔细阅读以下全部内容，特别关注免除或者限制责任的条款，并确认已完全了解本 协议之约定。</Text>通过页面点击、勾选或其他方式确认后，将视为您（以下简称“乙方”）同意 并与育见（杭州）科技有限公司（以下简称“甲方”）签署本协议。您的注册、登录、使用 等行为将视为无条件接受本协议之约束。
        </View>



        <View className='subhead'>
          1. 服务内容及费用支付
        </View>

        <View className='main'>
          Parent Lab 中国致力于为中国家庭提供支持家庭关系沟通的个性化定制服务。在本协 议签署后，乙方根据项目流程指引，通过与甲方专业教练的指导与探讨，支持改善家庭关系， 找到最适合的沟通方式。
        </View>

        <View className='main'>
          乙方根据所选择的服务项目，通过线上平台（支付宝或微信）进行付款；也可转账缴款， 乙方在转账或汇款的时候请在备注栏注明乙方姓名及联系电话。
        </View>

        <View className='main'>
          甲方银行账户资料如下：
        </View>

        <View className='main'>
          户 名：育见（杭州）科技有限公司
        </View>

        <View className='main'>
          开户行：中国工商银行杭州湖滨支行
        </View>
        <View className='main'>
          帐 号：1202 0244 0980 0002 970
        </View>
        <View className='main'>
          乙方付清本协议费用开始进行服务后，可申请开具服务费等额的电子增值税普通发票， 乙方应及时提供开票所需要的真实信息，甲方将在受理申请后 14 个工作日内完成开票并同 步给乙方。
        </View>



        <View className='subhead'>
          2. 参与方须知
        </View>

        <View className='main'>
          （1）因乙方交互对象存在各类差异，甲方教练所提供沟通建议所产生反应、效果可能根据 交互对象有所不同，乙方应对服务效果有合理预期。
        </View>

        <View className='main'>
          <Text className='highlight'> 2）本项目服务不涉及心理咨询或者心理治疗（包括精神科疾病的诊断及治疗）也无法处理任何紧急的危机情况（如成年人或者儿童的自杀自残等），</Text> （若乙方方面人员在接受服务 前已确诊或在沟通中发现可能涉及服务范围外的问题，乙方应另行咨询具有相应资质的专业 人士或联系医疗机构等相关机构寻求帮助。
        </View>

        <View className='main'>
          （3）在提供服务过程中甲方教练可能会向乙方提供行为建议，以获得乙方家庭成员的交互 反应。但以上建议非强制性，且是基于甲、乙双方沟通后作出的，乙方应根据实际情况，充 分结合对方心理、行为反应进行考量、调整。若乙方交互对象产生不良交互反应（如焦虑、 暴怒等），乙方应及时停止。
        </View>

        <View className='main'>
          <Text className='highlight'>
            （4）出现上述第（2）、（3）项情形，乙方未及时寻求合理解决方式或未合理应用建议的， 甲方及甲方工作人员不承担任何法律责任。
          </Text>
        </View>






        <View className='subhead'>
          3. 保密条款
        </View>

        <View className='main'>
          为更好完成该项服务，甲方教练可能会通过调查问卷、个别交谈等方式了解乙方家庭背 景、家庭成员个人信息及其他涉及隐私的信息。如：可能需要乙方录制关于日常生活的视频， 仅用以教练团队观察、研究。甲方将严格保护乙方及乙方家庭隐私，不向甲方参与团队服务 外的任何第三方泄露保密信息，并承诺不会将乙方提交的隐私信息用于任何与服务无关的用 途。
        </View>

        <View className='main'>
          （1）乙方应注意自身隐私的保护，不向专属教练外第三方透露隐私信息。乙方向甲方所提 供的任何有关乙方的资料，将受到中国有关隐私保护的法律法规保护及规范。
        </View>

        <View className='main'>
          （2）基于甲方对所有用户的保密责任，未经甲方允许，乙方不得在本协议服务过程中拍摄、 录制照片、音频、视频或创造其他素材；未经甲方允许，乙方不得将上述资料传播至个人博 客、社交媒体（如微信、抖音、小红书、快手）等应用、网站。乙方对在本协议履行过程中 获悉的甲方及本协议服务产生的所有信息资料（包括但不限于服务内容、甲方及其他参与本 协议所涉项目的第三方参与者记录或被记录的照片、音频、视频、逐字文稿、评估内容等） 应予以保密。
        </View>

        <View className='main'>
          （3）乙方不得复制、转移在接受服务过程中接触到的含有甲方信息的文件、数据、资料。 乙方绝不对与甲方业态相同或相近的任何第三方提供（无论直接地或者间接的）咨询、顾问 意见或服务。
        </View>

        <View className='main'>
          <Text className='highlight'>
            （4）若乙方选择线下服务项目，则乙方应允许甲方对线下活动进行拍照和录像（可能含有 乙方肖像），并作如下使用：
          </Text>
          甲方有权选取部分照片发布于微信公众号等任何公众平台，用 于本项目的介绍及宣传；录像主要用于内部复盘、研究，未经乙方授权，不得发布到微信公 众号等任何公众平台。
        </View>



        <View className='subhead'>
          4. 知识产权保护
        </View>

        <View className='main'>
          甲方向乙方提供的服务中所使用的文案及视听素材，包括但不限于：（线上和线下）活 动策划和组织、文字、图片、图表、音频、视频等。所有这些内容均属于甲方所有或有权使 用，并受著作权、商标、专利和其它财产所有权法律的保护。乙方需在甲方授权下才能为自 用目的合理使用这些内容，而不能擅自复制、传播、或创造与这些内容有关的衍生作品或产 品。
        </View>





        <View className='subhead'>
          5. 协议中止/终止及退款规则
        </View>

        <View className='main'>
          （1）出现以下情形的，双方可协商中止协议及服务重启时间： A. 线下项目因不可抗力（如新冠病毒疫情）等原因导致无法按乙方原定时间举办的； B. 线上项目甲方教练因临时安排，未在服务期内完成约定时间视频沟通和答疑的； C. 线上项目进程中，乙方认为提交问题已解决，且服务期还剩四分之一以上的。 协议中止时间原则上不得超过 3 个月，超过 3 个月双方可按退款规则进行处理。
        </View>

        <View className='main'>
          （2）线上/线下项目出现以下情形的，一方可提前终止协议：
        </View>

        <View className='main'>
          <Text className='highlight'>  请乙方务必仔细阅读，签署本协议，即视为乙方已经完全了解并同意该退款规则。</Text>
          乙 方根据退款规则提交退款申请后，甲方在审核通过后 10 个工作日内向乙方退款。
        </View>


        <View className='table-title'>
          退款规则
        </View>
        <View className='table'>
          <View className='th'>
            <View className='td'>
              退款情形
            </View>
            <View className='td'>
              退款规则
            </View>
          </View>

          <View className='tr'>
            <View className='td'>
            1. 距离活动开始时间当日&gt;30 天。 2. 活动开始前，出现本协议第 5 条 第（2）项 A 款情形的。
            </View>
            <View className='td'>
              无条件退全款
            </View>
          </View>


          <View className='tr'>
            <View className='td'>
            30 天≥距离活动开始时间当日&gt;7 天
            </View>
            <View className='td'>
              扣除所支付金额 10%作为违约金，退还剩余部分
            </View>
          </View>

          <View className='tr'>
            <View className='td'>
              距离活动开始时间≤7 天
            </View>
            <View className='td'>
              扣除所支付金额 30%作为违约金，退还剩余部分
            </View>
          </View>

          <View className='tr'>
            <View className='td'>
              活动已开始，出现本协议第 5 条第 （2）项 A 款情形的。
            </View>
            <View className='td'>
              按约定服务周数计算并退还剩余服务费用。
            </View>
          </View>

          <View className='tr'>
            <View className='td'>
              当期活动已开始
            </View>
            <View className='td'>
              不受理退款，且甲方无义务另行安排活动时间。
            </View>
          </View>
        </View>



        <View className='table-title'>
          线上项目退款规则
        </View>
        <View className='table'>
          <View className='th'>
            <View className='td'>
              退费情形
            </View>
            <View className='td'>
              退款规则
            </View>
          </View>

          <View className='tr'>
            <View className='td'>
              乙方在第一次视频访谈之前申请解 除协议
            </View>
            <View className='td'>
              无条件退全款
            </View>
          </View>


          <View className='tr'>
            <View className='td'>
              1. 符合本协议第 5 条第（2）项甲 方可提前终止协议的情形。 2. 乙方非首次签约客户，在再次签 约或追加采购服务小时的服务 过程中申请终止协议。 3. 甲、乙双方协商中止协议，超过 3 个月后乙方不再继续履行或申 请终止协议。
            </View>
            <View className='td'>
              按约定服务时间计算单次价格，退还剩余服务费用。
            </View>
          </View>

          <View className='tr'>
            <View className='td'>
              乙方为首次签约客户，乙方在第一次 视频访谈之后，第二次视频访谈之前 申请终止协议
            </View>
            <View className='td'>
              退还 80%服务费用
            </View>
          </View>

          <View className='tr'>
            <View className='td'>
              除以上情形外，乙方在第二次视频访 谈开始后申请退款
            </View>
            <View className='td'>
              不受理退款，且甲方无义务另行安排服务时间。
            </View>
          </View>

        </View>



        <View className='subhead'>
          6. 违约责任
        </View>

        <View className='main'>
          （1）本协议项下保密义务不因本协议中止或服务结束而失效。
        </View>

        <View className='main'>
          （2）服务结束后，若任何一方违反本协议保密约定的，应向另一方支付不高于本协议服务费用总金额 30%的违约金，对于侵犯任何第三方权益的，由违约方自行承担全部责任。
        </View>

        <View className='main'>
          （3）服务提供过程中，若乙方违反保密义务的，甲方有权终止本协议与主协议，对乙方已 付的服务费不予退还，并进一步消除对于甲方或甲方其他客户的不利影响。若乙方违反保密 义务导致甲方被第三方索赔的，乙方应赔偿甲方因此产生的全部损失。
        </View>

        <View className='main'>
          （4）甲方擅自单方终止协议的，乙方有权要求甲方全部退还服务费用；乙方擅自单方终止 协议的，甲方有权不退还乙方服务费用。若因一方擅自终止实际损失超过服务费用的，违约 方应赔偿补足。
        </View>

        <View className='main'>
          （5）违约方应承担守约方为主张权利而支出的所有费用，包括但不仅限于调查、诉讼、保 全、公证、律师代理等费用。
        </View>


        <View className='subhead'>
          7. 其他
        </View>
        <View className='main'>
          1）甲方不行使、未能及时行使或者未充分行使本协议或者按照法律规定所享有的权利， 不应被视为放弃该权利，也不影响甲方在将来行使该权利。
        </View>

        <View className='main'>
          （（2）本协议适用中华人民共和国大陆地区现行法律法规。因履行本协议而发生的任何争议， 经双方协商仍不能一致的，应提交至甲方所在地有管辖权的人民法院通过诉讼解决。
        </View>

        <View className='main'>
          （3）本协议自签署之日起生效。甲方保留在任何时候修改本协议条款的权利，若本协议条 款进行修改，则将以网站公示的方式进行公告，不再向您单独通知。变更后的协议一经网站 公示/更新，立即自动生效。若您不接受修改后的条款，则请立即停止使用本协议所涉 Parent Lab 项目服务，继续使用服务将被视为接受修改后的协议。
        </View>

      </View>
    )
  }
}
