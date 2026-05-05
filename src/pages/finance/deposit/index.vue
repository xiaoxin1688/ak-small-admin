<template>
  <!-- 用户-会员管理-等级列表 -->
  <div>
    <Card :bordered="false" dis-hover class="ivu-mt" :padding="0">
      <div class="new_card_pd">
        <!-- 筛选条件 -->
        <Form ref="depositFrom" :model="depositFrom" inline :label-width="labelWidth" :label-position="labelPosition" @submit.native.prevent>
          <FormItem label="基金名称："  label-for="title">
            <Input  v-model="depositFrom.title"  placeholder="请输入基金名称" style="width:250px;margin-right:14px;"/>
          </FormItem>
          <FormItem label="基金类型："  label-for="title">
            <RadioGroup v-model="depositFrom.type">
              <Radio :label="1">
                <Icon type="social-apple"></Icon>
                <span>按天返息</span>
              </Radio>
              <Radio :label="2">
                <Icon type="social-android"></Icon>
                <span>到期返息</span>
              </Radio>
              <Radio :label="3">
                <Icon type="social-android"></Icon>
                <span>交易日返息</span>
              </Radio>
            </RadioGroup>
            <Button type="primary" @click="userSearchs">查询</Button>
          </FormItem>
<!--          <FormItem label="基金状态："  label-for="title">-->
<!--            <Input  v-model="depositFrom.status"  placeholder="请输入基金状态 " style="width:250px;margin-right:14px;"/>-->
<!--            <Button type="primary" @click="userSearchs">查询</Button>-->
<!--          </FormItem>-->
        </Form>
      </div>
    </Card>
    <Card :bordered="false" dis-hover class="ivu-mt">
      <!-- 相关操作 -->
      <Button v-auth="['admin-user-level_add']" type="primary" @click="add">添加基金产品</Button>
      <!-- 基金列表表格 -->
      <Table :columns="columns" :data="depositList" ref="table" class="mt25"
             :loading="loading" highlight-row
             no-userFrom-text="暂无数据"
             no-filtered-userFrom-text="暂无筛选结果">

        <template slot-scope="{ row, index }" slot="member_ship_id">
            <div>
              {{member_vips.find(vip => vip.id === parseInt(row.member_ship_id)).title}}
            </div>
        </template>
        <template slot-scope="{ row, index }" slot="status">
          <i-switch v-model="row.status" :value="row.status" :true-value="1" :false-value="0" @on-change="onchangeIsShow(row)" size="large">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </template>
        <template slot-scope="{ row, index }" slot="type">
          <div v-if="row.type===1">
            按天反利息
          </div>
          <div v-if="row.type===2">
            到期返本返息
          </div>
          <div v-if="row.type===3">
            按交易日
          </div>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <a @click="edit(row)">编辑</a>
          <Divider type="vertical" />
          <a @click="del(row)">删除</a>
          <Divider type="vertical" />
          <a @click="record(row)">购买记录</a>
          <!--                    <template>-->
          <!--                        <Dropdown @on-click="changeMenu(row,$event,index)">-->
          <!--                            <a href="javascript:void(0)">-->
          <!--                                更多-->
          <!--                                <Icon type="ios-arrow-down"></Icon>-->
          <!--                            </a>-->
          <!--                            <DropdownMenu slot="list">-->
          <!--&lt;!&ndash;                                <DropdownItem name="1">等级任务</DropdownItem>&ndash;&gt;-->
          <!--                                <DropdownItem name="2">删除等级</DropdownItem>-->
          <!--                            </DropdownMenu>-->
          <!--                        </Dropdown>-->
          <!--                    </template>-->
        </template>
      </Table>
      <div class="acea-row row-right page">
        <Page :total="total" :current="depositFrom.page" show-elevator show-total @on-change="pageChange"
              :page-size="depositFrom.limit"/>
      </div>
    </Card>
    <Modal v-model="isShow"   :title="`${rowModelType}`"
           footer-hide
           @on-cancel="isShow=false">
      <Form ref="formItem" class="mt20" :model="formItem" :label-width="labelWidth" :label-position="labelPosition"  @submit.native.prevent>
        <FormItem type="hidden"  label="id：" label-for="id"  prop="id" style="display: none">
          <Input  v-model="formItem.id"  ></Input>
        </FormItem>
        <FormItem label="基金封面：" prop="image">
          <div class="picBox" @click="modalPicTap('单选', 'image')">
            <div class="pictrue" v-if="formItem.image"><img v-lazy="formItem.image"></div>
            <div class="upLoad" v-else>
              <div class="iconfont">+</div>
            </div>
          </div>
          <div class="tips"> 建议尺寸：70 * 70px</div>
        </FormItem>
        <FormItem label="基金名称：" label-for="title"  prop="title">
          <Input v-model="formItem.title" placeholder="请输入基金名称"  style="width: 300px;"></Input>
        </FormItem>
        <FormItem label="基金类型：" label-for="type" prop="type">
          <RadioGroup v-model="formItem.type">
            <Radio :label="1">
              <Icon type="social-apple"></Icon>
              <span>按天返息</span>
            </Radio>
            <Radio :label="2">
              <Icon type="social-android"></Icon>
              <span>到期返息</span>
            </Radio>
            <Radio :label="3">
              <Icon type="social-android"></Icon>
              <span>交易日返息</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="日利率（%）：" label-for="interest_rate"  prop="interest_rate">
          <InputNumber :min="0" :max="1000" v-model="formItem.interest_rate" placeholder="请输入购买日利率"  style="width: 300px;"></InputNumber>
          <div class="tips">注：根据选择不同的基金类型，设置不同的利率</div>
        </FormItem>
        <FormItem label="购买天数：" label-for="days"  prop="days">
          <InputNumber :min="0" :max="1000" v-model="formItem.days" placeholder="请输入购买天数"  style="width: 300px;"></InputNumber>
        </FormItem>
        <FormItem label="总额度：" label-for="total_quota"  prop="total_quota">
        <InputNumber :min="0" :max="1000000000000" v-model="formItem.total_quota" placeholder="请输入总额度"  style="width: 300px;"></InputNumber>
       </FormItem>
        <FormItem label="限购额度：" label-for="limit_quota"  prop="limit_quota">
        <InputNumber :min="0" :max="100000000" v-model="formItem.limit_quota" placeholder="请输入限购额度"  style="width: 300px;"></InputNumber>
       </FormItem>
        <FormItem label="最低起购：" label-for="low_purchase_quota"  prop="low_purchase_quota">
         <InputNumber :min="0" :max="100000000" v-model="formItem.low_purchase_quota" placeholder="请输入最低起购"  style="width: 300px;"></InputNumber>
        </FormItem>
        <FormItem label="活动开始日期：" label-for="start_date"  prop="start_date">
          <DatePicker type="datetime" @on-change="onchangeStart"  v-model="formItem.start_date"
                      placeholder="请选择活动开始日期" format="yyyy-MM-dd HH:mm" style="width: 260px;"></DatePicker>
        </FormItem>
        <FormItem label="活动结束日期：" label-for="end_date"  prop="end_date">
          <DatePicker type="datetime" @on-change="onchangeEnd"   v-model="formItem.end_date"
                      placeholder="请选择活动结束日期" format="yyyy-MM-dd HH:mm" style="width: 260px;"></DatePicker>
        </FormItem>
        <FormItem label="所属会员类型：" label-for="member_ship_id"  prop="member_ship_id">
          <Select
              v-model="formItem.member_ship_id"
              placeholder="请选择"
              clearable
              class="input-add"
          >
            <Option value="0">请选择</Option>
            <Option v-for="item in member_vips" :key="item.id" :value="item.id">{{ item.title }}</Option>
          </Select>
<!--          <Input v-model="formItem.member_ship_id" placeholder="请输入产品名称"  style="width: 300px;"></Input>-->
        </FormItem>
        <FormItem label="状态：" label-for="status" prop="status">
          <Switch size="large" v-model="formItem.status" :false-value="0" :true-value="1">
            <span slot="open" :true-value="1">开启</span>
            <span slot="close" :false-value="0">关闭</span>
          </Switch>
        </FormItem>
<!--        <FormItem style="text-align: right;">-->
<!--        <Button-->

<!--            type="primary"-->
<!--            class="submission"-->
<!--        >保存</Button-->
<!--        >-->
<!--        </FormItem>-->
      </Form>
      <div style="text-align: center">
                <Button
                    type="primary"
                    class="submission"
                    @click="save"
                >保存</Button>
      </div>
    </Modal>
    <Modal v-model="isShowRecord"  title="购买记录" width="1200"
           footer-hide
           @on-cancel="isShowRecord=false">
      <div class="new_card_pd">
        <!-- 筛选条件 -->
        <Form ref="userDepositFrom" :model="userDepositFrom" inline :label-width="labelWidth" :label-position="labelPosition" @submit.native.prevent>
          <FormItem label="用户id："  label-for="title">
            <Input  v-model="userDepositFrom.uid"  placeholder="请输入用户id" style="width:250px;margin-right:14px;"/>
          </FormItem>
          <FormItem label="用户名："  label-for="title">
            <Input  v-model="userDepositFrom.account"  placeholder="请输入用户名" style="width:250px;margin-right:14px;"/>
            <Button type="primary" @click="userDepositSearchs">查询</Button>
          </FormItem>
        </Form>
      </div>
      <!-- 会员购买记录表格 -->
      <Table :columns="columnsRecord" :data="userDepositList" ref="table" class="mt25"
             :loading="loading" highlight-row
             no-userFrom-text="暂无数据"
             no-filtered-userFrom-text="暂无筛选结果">

        <template slot-scope="{ row, index }" slot="member_ship_id">
          <div>
            {{member_vips.find(vip => vip.id === parseInt(row.member_ship_id)).title}}
          </div>
        </template>
        <template slot-scope="{ row, index }" slot="status">
          <div v-if="row.status===1">
            进行中
          </div>
          <div v-if="row.status===2">
            已到期
          </div>
        </template>
        <template slot-scope="{ row, index }" slot="type">
          <div v-if="row.type===1">
            按天反利息
          </div>
          <div v-if="row.type===2">
            到期返本返息
          </div>
          <div v-if="row.type===3">
            按交易日
          </div>
        </template>
        <template slot-scope="{ row, index }" slot="action">

          <a @click="interestRecord(row)">利息记录</a>
          <Divider type="vertical" />
          <a @click="appendRecord(row)">追加记录</a>
          <!--                    <template>-->
          <!--                        <Dropdown @on-click="changeMenu(row,$event,index)">-->
          <!--                            <a href="javascript:void(0)">-->
          <!--                                更多-->
          <!--                                <Icon type="ios-arrow-down"></Icon>-->
          <!--                            </a>-->
          <!--                            <DropdownMenu slot="list">-->
          <!--&lt;!&ndash;                                <DropdownItem name="1">等级任务</DropdownItem>&ndash;&gt;-->
          <!--                                <DropdownItem name="2">删除等级</DropdownItem>-->
          <!--                            </DropdownMenu>-->
          <!--                        </Dropdown>-->
          <!--                    </template>-->
        </template>
      </Table>
      <div class="acea-row row-right page">
        <Page :total="userTotal" :current="userDepositFrom.page" show-elevator show-total @on-change="userPageChange"
              :page-size="userDepositFrom.limit"/>
      </div>
    </Modal>
    <Modal v-model="isShowInterest"  title="利息记录" width="800"
           footer-hide
           @on-cancel="isShowInterest=false">
      <!-- 会员利息记录表格 -->
      <Table :columns="columnsInterest" :data="interestList" ref="table" class="mt25"
             :loading="loading" highlight-row
             no-userFrom-text="暂无数据"
             no-filtered-userFrom-text="暂无筛选结果">


        <template slot-scope="{ row, index }" slot="status">
          <div v-if="row.status==='0'">
            未返还
          </div>
          <div v-if="row.status==='1'">
            已返还
          </div>
        </template>
      </Table>
      <div class="acea-row row-right page">
        <Page :total="interestTotal" :current="interestFrom.page" show-elevator show-total @on-change="pageChange"
              :page-size="interestFrom.limit"/>
      </div>
    </Modal>
    <Modal v-model="isSHowAppend"  title="追加记录" width="600"
           footer-hide
           @on-cancel="isSHowAppend=false">
      <!-- 会员追加记录表格 -->
      <Table :columns="columnsAppend" :data="appendList" ref="table" class="mt25"
             :loading="loading" highlight-row
             no-userFrom-text="暂无数据"
             no-filtered-userFrom-text="暂无筛选结果">

      </Table>
      <div class="acea-row row-right page">
        <Page :total="appendTotal" :current="appendFrom.page" show-elevator show-total @on-change="appendPageChange"
              :page-size="appendFrom.limit"/>
      </div>
    </Modal>
    <Modal v-model="modalPic" width="960px" scrollable  footer-hide closable title="品牌图标" :mask-closable="false" :z-index="9999">
      <uploadPictures :isChoice="isChoice" @getPic="getPic" :gridBtn="gridBtn" :gridPic="gridPic" v-if="modalPic"></uploadPictures>
    </Modal>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
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
import uploadPictures from "@/components/uploadPictures/index.vue";
export default {
  name: 'user_level',
  components: {uploadPictures, editFrom },
  data () {
    return {
      modalPic: false,

      isChoice: '单选',
      grid: {
        xl: 7,
        lg: 7,
        md: 12,
        sm: 24,
        xs: 24
      },
      gridPic: {
        xl: 6,
        lg: 8,
        md: 12,
        sm: 12,
        xs: 12
      },
      gridBtn: {
        xl: 4,
        lg: 8,
        md: 8,
        sm: 8,
        xs: 8
      },
      loading: false,
      columns: [
        {
          title: '基金名称',
          key: 'title',
          minWidth: 100
        },
        {
          title: "图片",
          key: "image",
          minWidth: 80,
          render: (h, params) => {
            return h("viewer", [
              h(
                  "div",
                  {
                    style: {
                      width: "36px",
                      height: "36px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    },
                  },
                  [
                    h("img", {
                      attrs: {
                        src: params.row.image,
                      },
                      style: {
                        width: "100%",
                        height: "100%",
                      },
                    }),
                  ]
              ),
            ]);
          },
        },
        {
          title: '所属会员类型',
          slot: 'member_ship_id',
          minWidth: 100
        },
        {
          title: '总额度金额',
          key: 'total_quota',
          minWidth: 120
        },
        {
          title: '已购买金额',
          key: 'purchased_quota',
          minWidth: 120
        },
        {
          title: '完成进度(%)',
          key: 'progress',
          minWidth: 120
        },
        {
          title: '年化利率(%)',
          key: 'interest_rate',
          minWidth: 100
        },
        {
          title: '资金类型',
          slot: 'type',
          minWidth: 100
        },
        {
          title: '开始时间',
          key: 'start_date',
          minWidth: 120
        },
        {
          title: '结束日期',
          key: 'end_date',
          minWidth: 120
        },

        {
          title: '状态',
          slot: 'status',
          minWidth: 120
        },
        {
          title: '操作',
          slot: 'action',
          fixed: 'right',
          width: 200
        }
      ],
      depositFrom: {
        title: '',
        status:'',
        type:"",
        page: 1,
        limit: 10
      },
      userDepositFrom: {
        uid: '',
        account:"",
        deposit_id:"",
        page: 1,
        limit: 10
      },
      appendFrom: {
        uid: '',
        deposit_id:"",
        page: 1,
        limit: 10
      },
      interestFrom: {
        uid: '',
        deposit_id:"",
        page: 1,
        limit: 10
      },
      userDepositList: [],
      appendList:[],
      interestList:[],
      rowModelType: "新增",
      member_vips:[],
      formItem:{
        id:0,
        title:'',
        member_ship_id:'',
        total_quota:0,
        days:0,
        start_date:'',
        end_date:'',
        type:1,
        interest_rate:0,
        limit_quota:0,
        low_purchase_quota:0,
        status:0,
        image:''
      },
      depositList: [],
      total: 0,
      userTotal:0,
      appendTotal:0,
      interestTotal:0,
      FromData: null,
      levelId: 0,
      modelTask: false,
      num: 0,
      isShow:false,
      isShowRecord:false,
      isShowInterest:false,
      isSHowAppend:false,
      columnsRecord: [
        {
          title: '用户id',
          key: 'uid',
          minWidth: 80
        },
        {
          title: '用户名',
          key: 'account',
          minWidth: 90
        },
        {
          title: '会员级别',
          key: 'level_name',
          minWidth: 80
        },
        {
          title: '基金名称',
          key: 'title',
          minWidth: 100
        },
        {
          title: '购买数量',
          key: 'amount',
          minWidth: 90
        },
        {
          title: '年化利率(%)',
          key: 'interest_rate',
          minWidth: 90
        },
        {
          title: '购买期数',
          key: 'days',
          minWidth:90
        },
        {
          title: '首次购买金额',
          key: 'first_amount',
          minWidth: 100
        },
        {
          title: '追加金额',
          key: 'append_amount',
          minWidth: 100
        },
        {
          title: '购买时间',
          key: 'start_date',
          minWidth: 120
        },
        {
          title: '结束时间',
          key: 'end_date',
          minWidth: 120
        },
        {
          title: '状态',
          slot: 'status',
          minWidth: 80
        },
        {
          title: '操作',
          slot: 'action',
          fixed: 'right',
          width: 200
        }
      ],
      columnsAppend: [
        {
          title: '用户id',
          key: 'uid',
          minWidth: 80
        },
        {
          title: '基金名称',
          key: 'title',
          minWidth: 100
        },
        {
          title: '购买数量',
          key: 'amount',
          minWidth: 90
        },
        {
          title: '购买时间',
          key: 'append_date',
          minWidth: 120
        }

      ],
      columnsInterest: [
        {
          title: '用户id',
          key: 'uid',
          minWidth: 80
        },
        {
          title: '本金',
          key: 'amount',
          minWidth: 100
        },
        {
          title: '利息',
          key: 'interest',
          minWidth: 100
        },
        {
          title: '利率(%)',
          key: 'rate',
          minWidth: 90
        },
        {
          title: '返还日期',
          key: 'refund_date',
          minWidth:90
        },
        {
          title: '金额',
          key: 'amount',
          minWidth: 100
        },
        {
          title: '状态',
          slot: 'status',
          minWidth: 80
        },
      ],
    }
  },
  created () {
    this.getList();
    this.getMemberVip();
  },
  computed: {
    ...mapState('admin/layout', [
      'isMobile'
    ]),
    labelWidth () {
      return this.isMobile ? undefined : 96;
    },
    labelPosition () {
      return this.isMobile ? 'top' : 'right';
    }
  },
  methods: {

    // 选中图片
    getPic (pc) {
      this.formItem[this.picTit] = pc.att_dir;
      this.modalPic = false;
      this.$refs.formItem.validateField(this.picTit)
    },
    // 选择图片
    modalPicTap (tit, picTit) {
      this.modalPic = true;
      this.picTit = picTit || "";
      this.$refs.formItem.validateField(picTit)
    },
    save(){
      if(this.formItem.id){
        depositUpdateApi(this.formItem.id,this.formItem).then(res=>{
           this.$Message.success(res.msg);
           this.getList()

         }).catch((res) => {
           this.$Message.error(res.msg);
         });
      }else{
        depositSaveApi(this.formItem).then(res=>{
          this.$Message.success(res.msg);
          this.getList()
        }).catch((res) => {
          this.$Message.error(res.msg);
        });
      }
      this.isShow =false;
    },
    // 获取会员类型
    getMemberVip(){
      userMemberShip().then(res=>{
        this.member_vips = res.data.list
      })
    },
    //活动开始时间
    onchangeStart(e){
      this.formItem.start_date = e
    },
    //活动结束时间
    onchangeEnd(e){
      this.formItem.end_date = e
    },

    // 删除
    del (row) {
      let delfromData = {
        title: "删除基金",
        num: 1,
        url: `/deposit/delete`,
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
    // 删除成功
    // submitModel () {
    //     this.levelLists.splice(this.delfromData.num, 1)
    // },
    // 修改是否显示
    onchangeIsShow (row) {
      let data = {
        id: row.id,
        status: row.status
      }
      setStatusApi(data).then(async res => {
        this.$Message.success(res.msg);
      }).catch(res => {
        this.$Message.error(res.msg);
      })
    },
    appendRecord(row){
      this.isSHowAppend = true;
      this.appendFrom.deposit_id =row.id;
      this.appendFrom.uid = row.uid;
      this.getUserAppendList();
    },
    interestRecord(row){
      this.isShowInterest = true;
      this.interestFrom.deposit_id =row.id;
      this.interestFrom.uid = row.uid;
      this.getInterestList();
    },
    //用户购买记录
    getUserDeposit(){
      userDepositApi(this.userDepositFrom).then(res=>{
          this.userDepositList = res.data.list;
        this.userTotal = res.data.count;
      })
    },
    //用户追加记录
    getUserAppendList(){
      appendListApi(this.appendFrom).then(res=>{
        this.appendList = res.data.list;
        this.appendTotal = res.data.count;
      })
    },
    //用户利息记录
    getInterestList(){
      interestListApi(this.interestFrom).then(res=>{
        this.interestList = res.data.list;
        this.interestTotal = res.data.count;
      })
    },
    // 等级列表
    getList () {
      this.loading = true;
      depositListApi(this.depositFrom).then(async res => {
        let data = res.data
        this.depositList = data.list;
        this.total = res.data.count;
        this.loading = false;
      }).catch(res => {
        this.loading = false;
        this.$Message.error(res.msg);
      })
    },
    pageChange (index) {
      this.depositFrom.page = index;
      this.getList();
    },
    userPageChange (index) {
      this.userDepositFrom.page = index;
      this.getUserDeposit();
    },
    interestPageChange (index) {
      this.interestFrom.page = index;
      this.getInterestList();
    },
    appendPageChange (index) {
      this.appendFrom.page = index;
      this.getUserAppendList();
    },
    // 添加
    add () {
      this.rowModelType= "新增";
      this.isShow = true;
      this.formItem={};
      // this.levelId = 0;
      // this.$modalForm(createApi({ id: this.levelId })).then(() => this.getList());
    },
    // 编辑
    edit (row) {
      this.rowModelType= "编辑";
      this.isShow = true;
      this.formItem = row;
    },
    //购买记录
    record(row){
      this.isShowRecord=true;
      this.userDepositFrom.deposit_id=row.id;
      this.getUserDeposit();
    },
    // 表格搜索
    userSearchs () {
      this.depositFrom.page = 1;
      this.getList();
    },
    // 表格搜索
    userDepositSearchs () {
      this.userDepositFrom.page = 1;
      this.getUserDeposit();
    },
    // 修改成功
    submitFail () {
      this.getList();
    }
  }
}
</script>

<style scoped lang="stylus">
.picBox{
  display: inline-block;
  cursor: pointer;
  .upLoad{
    width: 58px;
    height: 58px;
    line-height: 58px;
    border: 1px dotted rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.02);
  }
  .pictrue{
    width: 60px;
    height: 60px;
    border: 1px dotted rgba(0, 0, 0, 0.1);
    margin-right: 10px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .iconfont{
    color: #CCCCCC;
    font-size: 26px;
    text-align: center
  }
}
</style>
