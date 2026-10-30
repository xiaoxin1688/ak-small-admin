<template>
<!-- 财务-提现申请 -->
  <div>
    <Card :bordered="false" dis-hover class="ivu-mt" :padding="0">
      <div class="card_pd">
        <!-- 查询条件 -->
        <Form
        ref="formValidate"
        inline
        :model="formValidate"
        :label-width="labelWidth"
        :label-position="labelPosition"
        @submit.native.prevent
      >
        <FormItem label="时间选择：">
          <DatePicker
            :editable="false"
            @on-change="onchangeTime"
            :value="timeVal"
            format="yyyy/MM/dd HH:mm"
            type="datetimerange"
            placement="bottom-end"
            placeholder="自定义时间"
           class="input-width"
            :options="options"
          ></DatePicker>
        </FormItem>
          <FormItem label="提现类型：">
            <Select
                v-model="formValidate.type"
                placeholder="请选择"
                clearable
                class="input-add"
            >
              <Option value="0">请选择</Option>
              <Option  value="1">余额提现</Option>
              <Option  value="2">钱包提现</Option>
            </Select>
          </FormItem>
          <FormItem label="代付通道类型：">
            <Select
                v-model="formValidate.channel_type"
                placeholder="请选择"
                clearable
                class="input-add"
            >
              <Option value="">全部</Option>
              <Option v-for="channel in payoutChannels" :key="channel.value" :value="channel.type">
                {{ channel.label }}
              </Option>
            </Select>
          </FormItem>
        <FormItem label="提现状态：">
          <Select v-model="formValidate.status" clearable class="input-add" @on-change="selChange">
            <Option
              v-for="(itemn, indexn) in treeData.withdrawal"
              :value="itemn.value"
              :key="indexn"
              >{{ itemn.title }}</Option
            >
          </Select>
        </FormItem>

          <FormItem label="会员等级：">
            <Select
                v-model="formValidate.svip_id"
                placeholder="请选择"
                clearable
                class="input-add"
            >
              <Option value="0">请选择</Option>
              <Option v-for="item in member_vips" :key="item.id" :value="item.id">{{ item.title }}</Option>
            </Select>
          </FormItem>
          <FormItem label="业务员：">
            <Input
                v-model="formValidate.business_id"
                placeholder="请输入业务员id"
                class="input-add mr14"
            />
          </FormItem>
          <FormItem label="用户uid：">
            <Input
                v-model="formValidate.uid"
                placeholder="请输入业务员id"
                class="input-add mr14"
            />
          </FormItem>
          <FormItem label="到期天数：">
            <Input
                v-model="formValidate.overdue_time"
                placeholder="请输入到期天数"
                class="input-add mr14"
            />
          </FormItem>

		<FormItem label="搜索：">
		    <Input
		      v-model="formValidate.nireid"
		      placeholder="微信昵称/姓名/支付宝账号/银行卡号"
		      class="input-add mr14"
		    />
		    <Button class="mr14" @click="selChange" type="primary">查询</Button>
			<Button @click="reset">重置</Button>
      <Button class="mr14" style="margin-left: 15px"
          v-auth="['export-userRecharge']"
          @click="exports"
      >导出</Button>
		</FormItem>
      </Form>
      </div>
    </Card>
    <cards-data :cardLists="cardLists" v-if="extractStatistics"></cards-data>
    <Card :bordered="false" dis-hover>
      <div v-if="isEdit">
        <Tooltip
            content="本页至少选中一项"
            :disabled="!!checkIdList.length"
        >
          <Button

              type="primary"
              class="mr20"
              :disabled="!checkIdList.length"
              @click="setBatchPass"
          >批量通过</Button
          >
        </Tooltip>
        <Tooltip
          v-show="SITE_NUM === 'cheet'"
          content="本页至少选中一项"
          :disabled="!!checkIdList.length"
        >
          <payout-channel-dropdown
            v-auth="['admin-user-coupon']"
            class="mr20"
            label="批量代付"
            :channels="payoutChannels"
            :disabled="!checkIdList.length || !is_proxy_pay"
            @select="batchAdoptProxy('批量代付', $event)"
          />
        </Tooltip>
      </div>

      <!-- 表格 -->
      <Table
        ref="table"
        :columns="columns"
        :data="tabList"
        class="ivu-mt"
        :loading="loading"
        row-id="uid"
        no-data-text="暂无数据"
        no-filtered-data-text="暂无筛选结果"
        @on-selection-change="onSelectionChange"
      >
        <template slot-scope="{ row }" slot="nickname">
          <div>
            用户昵称: {{ row.nickname }} <br />
            会员等级: {{ row.level_name }} <br />
            用户id:{{ row.uid }}<br />
            手机号:{{ row.account }}<br />
            备注:{{ row.remark }}
          </div>
        </template>
        <template slot-scope="{ row }" slot="extract_price">
          <div>{{ row.extract_price }}</div>
        </template>
        <template slot-scope="{ row }" slot="extract_fee">
          <div>{{ row.extract_fee }}</div>
        </template>
        <template slot-scope="{ row, index }" slot="add_time">
<!--          <span> {{ row.add_time | formatDate }}</span>-->
          <span> {{ row._add_time }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="proxy_pay_date">
<!--          <span> {{ row.proxy_pay_date | formatDate }}</span>-->
          <span> {{ row._proxy_pay_date  }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="channel_type">
          <div class="type">{{ payoutChannelLabel(row.channel_type) }}</div>
        </template>
        <template slot-scope="{ row }" slot="extract_type">
          <div class="type" v-if="row.extract_type === 'bank'">
            <div class="item">姓名:{{ row.real_name }}</div>
            <div class="item">银行卡号:{{ row.bank_code }}</div>
<!--            <div class="item">身份证号:{{ row.id_card }}</div>-->
            <div class="item">银行开户地址:{{ row.bank_address }}</div>
            <div class="item">账号类型:{{ row.account_type }}</div>
          </div>
          <div class="type" v-if="row.extract_type === 'usdt'">
            <div class="item">usdt地址:{{ row.bank_code }}</div>
          </div>
          <div class="type" v-if="row.extract_type === 'alipay'">
            <div class="item">姓名:{{ row.real_name }}</div>
            <div class="item">支付宝号:{{ row.alipay_code }}</div>
          </div>

          <div class="type" v-if="row.extract_type === 'balance'">
            <div class="item">姓名:{{ row.real_name }}</div>
            <div class="item">提现方式：佣金转入余额</div>
          </div>
        </template>
        <template slot-scope="{ row, index }" slot="qrcode_url">
          <viewer
            v-if="
              row.extract_type === 'weixin' || row.extract_type === 'alipay'
            "
          >
            <div class="tabBox_img">
              <img v-lazy="row.qrcode_url" />
            </div>
          </viewer>
        </template>
        <template slot-scope="{ row, index }" slot="on_group">
          <div  v-if="row.on_group === 1">
            是
          </div>
          <div v-else>
            否
          </div>
        </template>

        <template slot-scope="{ row, index }" slot="type">
          <div  v-if="row.type === 1">
            余额提现
          </div>
          <div v-else>
            钱包提现
          </div>
        </template>
        <template slot-scope="{ row, index }" slot="status">
          <div  >
            <div class="status" v-if="row.status === 0">
              <div class="statusVal" v-if="row.transfer_status===1">代付申请中</div>
              <div class="statusVal" v-else>申请中</div>
              <div v-if="isEdit">
                <Button
                    type="error"
                    icon="md-close"
                    size="small"
                    class="item"
                    @click="invalid(row)"
                >无效</Button
                >
                <Button
                    type="info"
                    icon="md-checkmark"
                    size="small"
                    class="item"
                    @click="adopt(row, '审核通过', index)"
                >通过</Button
                >
                <div v-if="row.transfer_status === 0" class="payout-action">
                  <payout-channel-dropdown
                    label="选择代付通道"
                    size="small"
                    :channels="payoutChannels"
                    :disabled="!is_proxy_pay"
                    @select="adoptProxy(row, '代付提交', $event)"
                  />
                </div>
              </div>
            </div>
            <div class="statusVal" v-if="row.status === 1">提现通过</div>
            <div class="statusVal" v-if="row.status === -1">
              提现未通过<br />未通过原因：{{ row.fail_msg }}
            </div>
            <div class="statusVal" v-if="row.transfer_status === 3">
              代付提现未通过<br />未通过原因：{{ row.fail_msg }}
            </div>
          </div>

        </template>
        <template
          slot-scope="{ row }"
          slot="createModalFrame"
          v-if="row.extract_type != 'balance' && isEdit"
        >
          <a href="javascript:void(0);" @click="edit(row)">编辑</a>
        </template>
      </Table>
      <div class="acea-row row-right page">
        <Page
          :total="total"
          :current="formValidate.page"
          show-elevator
          show-total
          @on-change="pageChange"
          :page-size="formValidate.limit"
        />
      </div>
    </Card>

    <!-- 编辑表单-->
    <edit-from
      ref="edits"
      :FromData="FromData"
      @submitFail="submitFail"
    ></edit-from>
    <!-- 拒绝通过-->
    <Modal
      v-model="modals"
      scrollable
      closable
      title="未通过原因"
      :mask-closable="false"
    >
      <Input
        v-model="fail_msg.message"
        type="textarea"
        :rows="4"
        placeholder="请输入未通过原因"
      />

      <div v-if="SITE_NUM==='marte'">

        <Select  clearable class="input-add" @on-change="failMsgHandle">
          <Option
              v-for="(item, index) in fail_msg_es_list"
              :value="item.value"
              :key="index"
          >{{ item.title}}</Option
          >
        </Select>
      </div>
      <div v-else>
        <Select  clearable class="input-add" @on-change="failMsgHandle">
          <Option
              v-for="(item, index) in fail_msg_id_list"
              :value="item.value"
              :key="index"
          >{{ item.title}}</Option
          >
        </Select>
      </div>

      <div slot="footer">
        <Button
          type="primary"
          size="large"
          long
          :loading="modal_loading"
          @click="oks"
          >确定</Button
        >
      </div>
    </Modal>
  </div>
</template>
<script>
import cardsData from "@/components/cards/cards";
import searchFrom from "@/components/publicSearchFrom";
import { mapState } from "vuex";

import {cashListApi, cashEditApi, refuseApi, exportUserExtractApi, extractListApi} from '@/api/finance';
import { formatDate } from "@/utils/validate";
import editFrom from "@/components/from/from";
import timeOptions from "@/utils/timeOptions";
import { userMemberShip } from '@api/user';
import exportExcel from '@/utils/newToExcel';
import Setting from '@/setting';
import PayoutChannelDropdown from '@/components/payoutChannelDropdown';
export default {
  name: "cashApply",
  components: { cardsData, searchFrom, editFrom, PayoutChannelDropdown },
  filters: {
    formatDate(time) {
      if (time !== 0) {
        let date = new Date(time * 1000);
        return formatDate(date, "yyyy-MM-dd hh:mm");
      }
    },
  },
  data() {
    return {
      SITE_NUM: Setting.SITE_NUM,
      payoutChannels: [],
      member_vips:[],
      modal_loading: false,
      options: timeOptions,
      fail_msg: {
        message: "Withdrawal failed verification, please contact your customer manager.",
      },
      fail_msg_id_list:[
        {
          title:'提款验证失败，请联系您的客户经理',
          value: "Withdrawal verification failed, please contact your account manager."
        },
        {
          title:"您的账户涉嫌恶意注册套利，请联系您的经理解决该问题",
          value: "Your account is suspected of fraudulent registration for arbitrage. Please contact your manager to resolve this issue."
        },
        {
          title:"您的帐户已长时间处于闲置状态。请联系您的经理激活该帐户。",
          value:"Your account has been inactive for an extended period. Please contact your manager to activate it."
        },
        {
          title:"您的账户状态异常，请联系您的专属经理。",
          value:"Your account status is abnormal. Please contact your dedicated manager."
        },
        {
          title:"您的会员已经到期，请联系您的经理。",
          value:"Your membership has expired. Please contact your manager."
        },
        {
          title: "您的银行信息错误，请联系您的经理修改",
          value: "Your bank information is incorrect. Please contact your manager to correct it."
        },
        {
          title: "您的会员已经到期，请联系您的经理",
          value: "Your membership has expired. Please contact your manager."
        },
        {
          title: "您还不是付费用户",
          value: "You are not yet a paid user."
        },
        {
          title: "使用整数重新提交付款请求，例如 40,000 和 100,000",
          value: "Resubmit the payment request using whole numbers, for example 40,000 and 100,000."
        },
        {
          title: "请联系你的经理",
          value: "Please contact your manager."
        },
        {
          title: "你的账号为涉诈账户，请联系经理处理。",
          value: "Your account is involved in fraudulent activities. Please contact your manager for handling."
        },
        {
          title: "由于账号长期处于静止状态，请联系专属经理",
          value: "Due to prolonged account inactivity, please contact your dedicated manager."
        }
      ],
      fail_msg_es_list:[
        {
          title:'提款验证失败，请联系您的客户经理',
          value: "Error de verificación de retiro, comuníquese con su gerente de cuenta."
        },
        {
          title:"您的账户涉嫌恶意注册套利，请联系您的经理解决该问题",
          value: "Su cuenta está sospechosa de registro malicioso con fines de arbitraje, por favor contacte a su gerente para resolver este problema."
        },
        {
          title:"您的帐户已长时间处于闲置状态。请联系您的经理激活该帐户。",
          value:"Su cuenta ha estado inactiva durante mucho tiempo. Por favor, contacte a su administrador para que la active."
        },
        {
          title:"您的账户状态异常，请联系您的专属经理。",
          value:"El estado de su cuenta es anormal, comuníquese con su gerente dedicado."
        },
        {
          title:"您的会员已经到期，请联系您的经理。",
          value:"Su membresía ha expirado, por favor contacte a su gerente."
        },
        {
          title:"您的银行信息有误，请联系您的经理修改",
          value:"Su información bancaria es incorrecta, comuníquese con su gerente para corregirla.",
        },

        {
          title: "您的会员已经到期，请联系您的经理",
          value: "Su membresía ha expirado. Por favor, contacte a su gerente."
        },
        {
          title: "您还不是付费用户",
          value: "Aún no es un usuario premium/de pago."
        },
        {
          title: "使用整数重新提交付款请求，例如 40,000 和 100,000",
          value: "Vuelva a enviar la solicitud de pago utilizando números enteros, por ejemplo 40.000 y 100.000."
        },
        {
          title: "请联系你的经理",
          value: "Por favor, contacte a su gerente."
        },
        {
          title: "你的账号为涉诈账户，请联系经理处理。",
          value: "Su cuenta está involucrada en actividades fraudulentas. Por favor, contacte a su gerente para su manejo."
        },
        {
          title: "由于账号长期处于静止状态，请联系专属经理",
          value: "Debido a la inactividad prolongada de la cuenta, por favor contacte a su gerente dedicado."
        }
      ],
      modals: false,
      total: 0,
      cardLists: [],
      loading: false,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          // fixed: 'left'
        },
        {
          title: "ID",
          key: "id",
          width: 80,
        },

        {
          title: "订单号",
          key: "transfer_no",
          width: 80,
        },
        {
          title: "用户信息",
          slot: "nickname",
          minWidth: 180,
        },
        {
          title: "提现到账金额",
          slot: "extract_price",
          minWidth: 90,
        },
        {
          title: "手续费",
          slot: "extract_fee",
          minWidth: 90,
        },
        {
          title: "提现方式",
          slot: "extract_type",
          minWidth: 150,
        },
        {
          title: "会员等级",
          key: "level_name",
          minWidth: 150,
        },
        {
          title: "到期天数",
          key: "overdue_time",
          minWidth: 90,
        },
        {
          title: "业务员",
          key: "business_id",
          minWidth: 150,
        },
        {
          title: "是否进群",
          slot: "on_group",
          minWidth: 100,
        },
        {
          title: "通道类型",
          slot: "channel_type",
          minWidth: 100,
        },
        {
          title: "申请时间",
          slot: "add_time",
          minWidth: 100,
        },
        {
          title: "转账时间",
          slot: "proxy_pay_date",
          minWidth: 100,
        },
        {
          title: "备注",
          key: "mark",
          minWidth: 100,
        },
        {
          title: "审核状态",
          slot: "status",
          minWidth: 200,
        },
        {
          title: "操作",
          slot: "createModalFrame",
          fixed: "right",
          width: 100,
        },
      ],
      tabList: [],
      fromList: {
        title: "选择时间",
        custom: true,
        fromTxt: [
          { text: "全部", val: "" },
          { text: "昨天", val: "yesterday" },
          { text: "今天", val: "today" },
          { text: "本周", val: "week" },
          { text: "本月", val: "month" },
          { text: "本季度", val: "quarter" },
          { text: "本年", val: "year" },
        ],
      },
      treeData: {
        withdrawal: [
          {
            title: "全部",
            value: "",
          },
          {
            title: "未通过",
            value: -1,
          },
          {
            title: "申请中",
            value: 0,
          },
          {
            title: "已通过",
            value: 1,
          },
        ],
        payment: [
          {
            title: "全部",
            value: "",
          },
          {
            title: "支付宝",
            value: "alipay",
          },
          {
            title: "银行卡",
            value: "bank",
          },
          {
            title: "微信",
            value: "wx",
          },
          // {
          // 	title: '提现到余额',
          // 	value: 'balance'
          // }
        ],
      },
      formValidate: {
        uid:'',
        channel_type: '',
        overdue_time:'',
        business_id:"",
        svip_id:"",
        status: "",
        extract_type: "",
        nireid: "",
        data: "",
        page: 1,
        limit: 20,
        type:2
      },
      isEdit:0,
      extractStatistics: {},
      timeVal: [],
      FromData: null,
      extractId: 0,
      is_proxy_pay:1,
      checkIdList:[],
      isAll:0
    };
  },
  watch: {
    $route() {
      if (
        this.$route.fullPath === "/finance/user_extract/index?status=0"
      ) {
        this.getPath();
      }
    },
  },
  computed: {
    ...mapState("admin/layout", ["isMobile"]),
    labelWidth() {
      return this.isMobile ? undefined : 96;
    },
    labelPosition() {
      return this.isMobile ? "top" : "right";
    },
  },
  // created() {
  //     if(this.$route.query.key == 0){
  //         this.formValidate.status = parseInt(this.$route.query.key)
  //     }
  // },
  mounted() {

    this.getMemberVip();
    if (this.$route.fullPath === "/finance/user_extract/index?status=0") {
      this.getPath();
    } else {
      this.getList();
      if(this.SITE_NUM==='cheet'){
        this.getExtractData();
      }
    }

    // this.getList();
  },
  methods: {
    payoutChannelLabel(type) {
      const channel = this.payoutChannels.find(item => Number(item.type) === Number(type));
      if (channel) return channel.label;
      const fallback = {1: 'SolPay', 2: 'BossPay', 3: 'HLPay', 4: 'BasePay', 5: 'MgmPay', 6: 'SubPay', 7: 'UzPay', 8: 'WgePay'};
      return fallback[Number(type)] || '-';
    },
    onSelectionChange(e){
      this.checkIdList = e.filter(item => item.status !== 1).map(item => item.id);

    },
    failMsgHandle(e){
      this.fail_msg.message = e
    },
    // 获取会员类型
    getMemberVip(){
      userMemberShip().then(res=>{
        this.member_vips = res.data.list
      })
    },
    getPath() {
      this.formValidate.page = 1;
      this.formValidate.status = parseInt(this.$route.query.status);
      this.getList();
    },
    // 无效
    invalid(row) {
      this.extractId = row.id;
      this.modals = true;

    },
    // 确定
    oks() {
      this.modal_loading = true;
      refuseApi(this.extractId, this.fail_msg)
        .then(async (res) => {
          this.getList();
          this.$Message.success(res.msg);
          this.modal_loading = false;
          this.modals = false;

        })
        .catch((res) => {
          this.$Message.error(res.msg);
        });

    },
    setBatchPass(){

      let delfromData = {
        title: "批量通过",
        num: 1,
        url: `finance/extract/batchAdopt`,
        method: "post",
        ids: {params:this.checkIdList},
      };

      this.$modalSure(delfromData)
          .then((res) => {
            this.$Message.success(res.msg);
            this.getList();
          })
          .catch((res) => {
            this.$Message.error(res.msg);
          });
    },
    // 通过
    adopt(row, tit, num) {
      let delfromData = {
        title: tit,
        num: num,
        url: `finance/extract/adopt/${row.id}`,
        method: "put",
        ids: "",
      };

      this.$modalSure(delfromData)
        .then((res) => {
          this.$Message.success(res.msg);
          this.getList();
        })
        .catch((res) => {
          this.$Message.error(res.msg);
        });
    },
    // 批量代付
    batchAdoptProxy(tit, num) {
      let that = this;

      if(!that.is_proxy_pay){
        return;
      }
      that.is_proxy_pay = 0;
      let delfromData = {
        title: `${tit} - ${this.payoutChannelLabel(num)}`,
        num: num,
        url: `finance/extract/batchAdoptProxy`,
        method: "post",
        ids: {ids:this.checkIdList,type:num},
      };

      this.$modalSure(delfromData)
          .then((res) => {
            // that.is_proxy_pay = 1
            this.$Message.success(res.msg);
            this.getList();
            that.is_proxy_pay = 1
          })
          .catch((res) => {
            that.is_proxy_pay = 1
            this.$Message.error(res.msg);
          });

    },
    // 代付
    adoptProxy(row, tit, num) {
      let that = this;

      if(!that.is_proxy_pay){
        return;
      }
      that.is_proxy_pay = 0;
      let delfromData = {
        title: `${tit} - ${this.payoutChannelLabel(num)}`,
        num: num,
        url: `finance/extract/adopt_proxy/${row.id}`,
        method: "put",
        ids: {type:num},
      };

      this.$modalSure(delfromData)
          .then((res) => {

            this.$Message.success(res.msg);

            that.is_proxy_pay = 1
            this.getList();

          })
          .catch((res) => {
            that.is_proxy_pay = 1
            this.$Message.error(res.msg);
          });

    },
    // 具体日期
    onchangeTime(e) {
      this.timeVal = e;
      this.formValidate.data = this.timeVal[0] ? this.timeVal.join("-") : "";
      this.formValidate.page = 1;
      this.getList();
      if(this.SITE_NUM==='cheet'){
        this.getExtractData();
      }
    },
    // 选择时间
    selectChange(tab) {
      this.formValidate.page = 1;
      this.formValidate.data = tab;
      this.timeVal = [];
      this.getList();
      if(this.SITE_NUM==='cheet'){
        this.getExtractData();
      }
    },
    // 选择
    selChange() {
      this.formValidate.page = 1;
      this.getList();
      if(this.SITE_NUM==='cheet'){
        this.getExtractData();
      }
    },
    reset(){
      this.formValidate = {
        uid: '',
        channel_type: '',
        overdue_time: '',
        business_id: '',
        svip_id: '',
        status: "",
        extract_type: "",
        nireid: "",
        data: "",
        page: 1,
        limit: 20,
        type: 2
      };
      this.timeVal = [];
      // this.$refs.formValidate.resetFields()
      this.getList();
      if(this.SITE_NUM==='cheet'){
        this.getExtractData();
      }

    },
    // 列表
    getList() {
      this.loading = true;
      cashListApi(this.formValidate)
        .then(async (res) => {
          let data = res.data;
          this.payoutChannels = data.payout_channels || [];
          this.isEdit = res.data.edit;
          this.tabList = data.list.list;
          this.total = data.list.count;
          if(this.SITE_NUM==='marte'){
            this.extractStatistics = data.extract_statistics;
            this.cardLists = [
              {
                col: 6,
                count: this.extractStatistics.price,
                name: "待提现金额",
                className: "md-basket",
              },
              {
                col: 6,
                count: this.extractStatistics.brokerage_count,
                name: "佣金总金额",
                className: "md-pricetags",
              },
              {
                col: 6,
                count: this.extractStatistics.priced,
                name: "已提现金额",
                className: "md-cash",
              },
              {
                col: 6,
                count: this.extractStatistics.brokerage_not,
                name: "未提现金额",
                className: "ios-cash",
              },
            ];
          }

          this.loading = false;
        })
        .catch((res) => {
          this.loading = false;
          this.$Message.error(res.msg);
        });
    },
    getExtractData(){
      extractListApi(this.formValidate).then(res=>{
        this.cardLists = res.data
      })
    },
    pageChange(index) {
      this.formValidate.page = index;
      this.getList();
    },
    // 编辑
    edit(row) {
      cashEditApi(row.id)
        .then(async (res) => {
          if (res.data.status === false) {
            return this.$authLapse(res.data);
          }
          this.FromData = res.data;
          this.$refs.edits.modals = true;
        })
        .catch((res) => {
          this.$Message.error(res.msg);
        });
    },
    // 编辑提交成功
    submitFail() {
      this.getList();
    },

    // 数据导出；
    async exports() {
      let [th, filekey, data, fileName] = [[], [], [], ""];
      //   let fileName = "";
      let excelData = JSON.parse(JSON.stringify(this.formValidate));
      excelData.page = 1;
      for (let i = 0; i < excelData.page + 1; i++) {
        let lebData = await this.getExcelData(excelData);
        if (!fileName) fileName = lebData.filename;
        if (!filekey.length) {
          filekey = lebData.filekey;
        }
        if (!th.length) th = lebData.header;
        if (lebData.export.length) {
          data = data.concat(lebData.export);
          excelData.page++;
        } else {
          exportExcel(th, filekey, fileName, data);
          return;
        }
      }
    },
    getExcelData(excelData) {
      return new Promise((resolve, reject) => {
        exportUserExtractApi(excelData).then((res) => {
          return resolve(res.data);
        });
      });
    },
  },
};
</script>
<style scoped lang="stylus">
.btn-add {
margin:0 14px 0 -90px;
}
.ivu-mt .type .item {
  margin: 3px 0;
}
.card_pd{
  padding:20px 20px 0;
}
.Refresh {
  font-size: 12px;
  color: #1890FF;
  cursor: pointer;
}
.status >>> .item~.item {
  margin-left: 6px;
}

.status >>> .statusVal {
  margin-bottom: 7px;
}

.payout-action {
  margin-top: 8px;
}

/* .ivu-mt >>> .ivu-table-header */
/* border-top:1px dashed #ddd!important */
.type {
  padding: 3px 0;
  box-sizing: border-box;
}

.tabBox_img {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
