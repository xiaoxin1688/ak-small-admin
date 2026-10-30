<template>
  <!-- 用户-会员管理-等级列表 -->
  <div>
    <Card :bordered="false" dis-hover class="ivu-mt" :padding="0">
      <div class="new_card_pd">
        <!-- 筛选条件 -->
        <Form ref="depositFrom" :model="channelFrom" inline :label-width="labelWidth" :label-position="labelPosition" @submit.native.prevent>
          <FormItem label="名称："  label-for="title">
            <Input  v-model="channelFrom.title"  placeholder="请输入名称" style="width:250px;margin-right:14px;"/>
            <Button type="primary" @click="userSearchs">查询</Button>
          </FormItem>
        </Form>
      </div>
    </Card>
    <Card :bordered="false" dis-hover class="ivu-mt">
      <!-- 相关操作 -->
      <Button v-auth="['admin-user-level_add']" type="primary" @click="add">添加</Button>
      <Button v-if="isSuperAdmin" class="ivu-ml-8" icon="ios-card" @click="configure()">支付参数配置</Button>
      <!-- 基金列表表格 -->
      <Table :columns="columns" :data="channelList" ref="table" class="mt25"
             :loading="loading" highlight-row
             no-userFrom-text="暂无数据"
             no-filtered-userFrom-text="暂无筛选结果">
        <template slot-scope="{ row, index }" slot="status">
          <i-switch v-model="row.status" :value="row.status" :true-value="1" :false-value="0" @on-change="onchangeIsShow(row)" size="large">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </template>
        <template slot-scope="{ row }" slot="recharge_status">
          <i-switch v-model="row.recharge_status" :true-value="1" :false-value="0" @on-change="onchangeUsageStatus(row, 'recharge_status')" size="large">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </template>
        <template slot-scope="{ row }" slot="payout_status">
          <i-switch v-model="row.payout_status" :true-value="1" :false-value="0" @on-change="onchangeUsageStatus(row, 'payout_status')" size="large">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <template v-if="isConfigurable(row)">
            <a @click="configure(row)">参数配置</a>
            <Divider type="vertical" />
          </template>
          <a @click="edit(row)">编辑</a>
          <Divider type="vertical" />
          <a @click="del(row)">删除</a>
          <Divider type="vertical" />
        </template>
      </Table>
      <div class="acea-row row-right page">
        <Page :total="total" :current="channelFrom.page" show-elevator show-total @on-change="pageChange"
              :page-size="channelFrom.limit"/>
      </div>
    </Card>
    <Modal v-model="isShow"   :title="`${rowModelType}`"
           footer-hide
           @on-cancel="isShow=false">
      <Form ref="formItem" class="mt20" :model="formItem" :label-width="labelWidth" :label-position="labelPosition"  @submit.native.prevent>
        <FormItem type="hidden"  label="id：" label-for="id"  prop="id" style="display: none">
          <Input  v-model="formItem.id"  ></Input>
        </FormItem>
        <FormItem label="通道名称：" label-for="name"  prop="name">
          <Input v-model="formItem.name" placeholder="请输入通道名称"  style="width: 300px;"></Input>
        </FormItem>
        <FormItem label="通道标题：" label-for="title"  prop="title">
          <Input v-model="formItem.title" placeholder="请输入通道标题"  style="width: 300px;"></Input>
        </FormItem>
        <FormItem label="通道值：" label-for="value"  prop="value">
          <Input v-model="formItem.value" placeholder="请输入通道值"  style="width: 300px;"></Input>
        </FormItem>
        <FormItem label="状态：" label-for="status" prop="status">
          <Switch size="large" v-model="formItem.status" :false-value="0" :true-value="1">
            <span slot="open" :true-value="1">开启</span>
            <span slot="close" :false-value="0">关闭</span>
          </Switch>
        </FormItem>
        <FormItem label="充值启用：" prop="recharge_status">
          <i-switch size="large" v-model="formItem.recharge_status" :false-value="0" :true-value="1">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </FormItem>
        <FormItem label="代付启用：" prop="payout_status">
          <i-switch size="large" v-model="formItem.payout_status" :false-value="0" :true-value="1">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </FormItem>
        <FormItem label="链接有效期：" prop="link_expire_minutes">
          <InputNumber v-model="formItem.link_expire_minutes" :min="1" :step="1" style="width: 300px;"></InputNumber>
          <span class="ivu-ml-8">分钟</span>
        </FormItem>
        <FormItem label="排序：" label-for="value"  prop="value">
          <input-number v-model="formItem.sort" :min="1" :step="1" placeholder="请输入排序值约大越靠前"  style="width: 300px;"></input-number>
        </FormItem>
      </Form>
      <div style="text-align: center">
                <Button
                    type="primary"
                    class="submission"
                    @click="save"
                >保存</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import util from '@/libs/util';
import {levelListApi, setShowApi, createApi, userMemberShip, updateTaskApi} from '@/api/user';
import editFrom from '@/components/from/from';
import {
  appendListApi,
  depositListApi,
  depositSaveApi,
  depositUpdateApi, interestListApi,
  setStatusApi,
  userDepositApi
} from "@api/deposit";
import {channelStatusApi, configProvidersApi, listApi, saveApi, updateApi} from "@api/paychannel";

const defaultChannelForm = () => ({
  id: 0,
  title: '',
  name: '',
  value: '',
  status: 0,
  recharge_status: 1,
  payout_status: 1,
  link_expire_minutes: 15,
  sort: 1
});

export default {
  name: 'pay_channel',
  components: { editFrom },
  data () {
    return {
      grid: {
        xl: 7,
        lg: 7,
        md: 12,
        sm: 24,
        xs: 24
      },
      loading: false,
      columns: [
        {
          title: '通道名称',
          key: 'name',
          minWidth: 100
        },
        {
          title: '通道标题',
          key: 'title',
          minWidth: 100
        },
        {
          title: '通道值',
          key: 'value',
          minWidth: 120
        },
        {
          title: '状态',
          slot: 'status',
          minWidth: 120
        },
        {
          title: '充值启用',
          slot: 'recharge_status',
          minWidth: 120
        },
        {
          title: '代付启用',
          slot: 'payout_status',
          minWidth: 120
        },
        {
          title: '排序',
          key: 'sort',
          minWidth: 120
        },
        {
          title: '操作',
          slot: 'action',
          fixed: 'right',
          width: 260
        }
      ],
      channelFrom: {
        title: '',
        status:'',
        page: 1,
        limit: 10
      },

      rowModelType: "新增",
      member_vips:[],
      formItem: defaultChannelForm(),
      channelList: [],
      total: 0,
      userTotal:0,
      appendTotal:0,
      interestTotal:0,
      FromData: null,
      levelId: 0,
      modelTask: false,
      num: 0,
      isShow:false,
      configurableChannels: []
    }
  },
  created () {
    this.getList();
    if (this.isSuperAdmin) this.getConfigProviders();
  },
  computed: {
    ...mapState('admin/layout', [
      'isMobile'
    ]),
    ...mapState('admin/user', {
      currentAdmin: 'info'
    }),
    isSuperAdmin () {
      if (this.currentAdmin && this.currentAdmin.level !== undefined) {
        return Number(this.currentAdmin.level) === 0;
      }
      return Number((this.currentAdmin && this.currentAdmin.id) || util.cookies.get('uuid')) === 1;
    },
    labelWidth () {
      return this.isMobile ? undefined : 96;
    },
    labelPosition () {
      return this.isMobile ? 'top' : 'right';
    }
  },
  methods: {
    getConfigProviders () {
      configProvidersApi().then(res => {
        this.configurableChannels = res.data.map(item => item.value);
      }).catch(() => {
        this.configurableChannels = [];
      });
    },
    isConfigurable (row) {
      return this.isSuperAdmin && this.configurableChannels.indexOf(String(row.value || '').toLowerCase()) !== -1;
    },
    configure (row) {
      this.$router.push({
        name: 'setting_payment_channels',
        query: row && row.value ? { provider: String(row.value).toLowerCase() } : {}
      });
    },
    onchangeUsageStatus (row, field) {
      updateApi(row.id, row).then(res => {
        this.$Message.success(res.msg);
      }).catch(res => {
        row[field] = row[field] ? 0 : 1;
        this.$Message.error(res.msg);
      });
    },

    save(){
      if(this.formItem.id){
        updateApi(this.formItem.id,this.formItem).then(res=>{
           this.$Message.success(res.msg);
           this.getList()

         }).catch((res) => {
           this.$Message.error(res.msg);
         });
      }else{
        saveApi(this.formItem).then(res=>{
          this.$Message.success(res.msg);
          this.getList()
        }).catch((res) => {
          this.$Message.error(res.msg);
        });
      }
      this.isShow =false;
    },


    // 删除
    del (row) {
      let delfromData = {
        title: "删除",
        num: 1,
        url: `/channel/delete`,
        method: "post",
        ids: {id:row.id},
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

    // 修改是否显示
    onchangeIsShow (row) {
      let data = {
        id: row.id,
        status: row.status
      }
      channelStatusApi(data).then(async res => {
        this.$Message.success(res.msg);
      }).catch(res => {
        this.$Message.error(res.msg);
      })
    },


    // 等级列表
    getList () {
      this.loading = true;
      listApi(this.channelFrom).then(async res => {
        let data = res.data
        this.channelList = data.list;
        this.total = res.data.count;
        this.loading = false;
      }).catch(res => {
        this.loading = false;
        this.$Message.error(res.msg);
      })
    },
    pageChange (index) {
      this.channelFrom.page = index;
      this.getList();
    },

    // 添加
    add () {
      this.rowModelType= "新增";
      this.isShow = true;
      this.formItem = defaultChannelForm();
    },
    // 编辑
    edit (row) {
      this.rowModelType= "编辑";
      this.isShow = true;
      this.formItem = Object.assign(defaultChannelForm(), row);
    },

    // 表格搜索
    userSearchs () {
      this.channelFrom.page = 1;
      this.getList();
    },

    // 修改成功
    submitFail () {
      this.getList();
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
