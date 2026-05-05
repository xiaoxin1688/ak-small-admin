<template>
  <!-- 运营-首页-顶部组件 -->
  <Row :gutter="24" class="pl-6 pr-6">
    <Col  class="ivu-mb"  >

      <Card :bordered="false" dis-hover :padding="16">
        <div>
          <Button
              v-auth="['admin-user-save']"
              type="primary"
              class="mr20"
              @click="add"
          >添加</Button
          >
        </div>



        <Table :columns="columns" :data="taskLists"   ref="table" class="mt25"
               :loading="loading" highlight-row
               no-userFrom-text="暂无数据"
               no-filtered-userFrom-text="暂无筛选结果">
          <template slot-scope="{ row, index }" slot="icon">
            <viewer>
              <div class="tabBox_img">
                <img v-lazy="row.icon"  style="width: 40px;height: 40px">
              </div>
            </viewer>
          </template>
          <template slot-scope="{ row, index }" slot="type">
            <!--            {{row.type}}-->
            <div v-if="row.type==1">推荐注册</div>
            <div v-if="row.type==2">推广激活会员</div>
            <div v-if="row.type==3">激活会员等级</div>
            <div v-if="row.type==4">查看产品</div>
            <div v-if="row.type==5">查看文章</div>
            <div v-if="row.type==6">分享产品</div>
            <div v-if="row.type==7">分享文章</div>
            <div v-if="row.type==8">点赞文章</div>
            <div v-if="row.type==9">分享好友APP下载</div>
            <div v-if="row.type==10">浏览商品</div>
            <div v-if="row.type==11">购买商品</div>
            <div v-if="row.type==12">认购基金</div>
            <div v-if="row.type==13">参与公益活动</div>
            <div v-if="row.type==14">邀请好友分享</div>
            <div v-if="row.type==15">查看视频</div>
            <div v-if="row.type==16">点赞</div>
          </template>
          <template slot-scope="{ row, index }" slot="is_forevers">
            <i-switch v-model="row.is_forever" :value="row.is_forever" :true-value="1" :false-value="0" :disabled="true" size="large">
              <span slot="open">永久</span>
              <span slot="close">非永久</span>
            </i-switch>
          </template>
          <template slot-scope="{ row, index }" slot="is_pays">
            <i-switch v-model="row.is_pay" :value="row.is_pay" :true-value="1" :false-value="0"  :disabled="true" size="large">
              <span slot="open">付费</span>
              <span slot="close">免费</span>
            </i-switch>
          </template>
          <template slot-scope="{ row, index }" slot="is_shows">
            <i-switch v-model="row.is_show" :value="row.is_show" :true-value="1" :false-value="0" @on-change="onchangeIsShow(row)" size="large">
              <span slot="open">显示</span>
              <span slot="close">隐藏</span>
            </i-switch>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <a @click="setting(row)">添加</a>
            <Divider type="vertical" />
            <a @click="edit(row)">编辑</a>
            <Divider type="vertical" />
            <a @click="del(row)">删除</a>
          </template>
        </Table>
<!--        <div class="acea-row row-right page">-->
<!--          <Page :total="total" :current="levelFrom.page" show-elevator show-total @on-change="pageChange"-->
<!--                :page-size="levelFrom.limit"/>-->
<!--        </div>-->
      </Card>
    </Col>
    <Col  class="ivu-mb"  >

      <Card :bordered="false" dis-hover :padding="16">
        <div>
          已选择会员类型:{{member_vips_text}} 任务总金额: {{taskMoney}}
          <div style="display: flex">
            <div>
              会员类型:
              <Select
                  v-model="vip_id"
                  placeholder="请选择"
                  class="input-add"
                  @on-change="vipChangeHandle"
              >
                <Option value="0">请选择</Option>
                <Option v-for="item in member_vips" :key="item.id" :value="item.id">{{ item.title }}</Option>
              </Select>

            </div>
            <div>
              任务时间:
              <Select
                  v-model="week"
                  placeholder="请选择"
                  class="input-add"
                  @on-change="weekChangeHandle"
              >
                <Option value="0">请选择</Option>

                <Option value="1">周一</Option>
                <Option value="2">周二</Option>
                <Option value="3">周三</Option>
                <Option value="4">周四</Option>
                <Option value="5">周五</Option>
                <Option value="6">周六</Option>
                <Option value="7">周日</Option>
              </Select>

            </div>
          </div>
        </div>
        <Table :columns="columns1" :data="taskVipLists"  ref="table" class="mt25"
               highlight-row
               no-userFrom-text="暂无数据"
               no-filtered-userFrom-text="暂无筛选结果">
          <template slot-scope="{ row, index }" slot="icon">
            <viewer>
              <div class="tabBox_img">
                <img v-lazy="row.icon"  style="width: 40px;height: 40px">
              </div>
            </viewer>
          </template>
          <template slot-scope="{ row, index }" slot="type">
<!--            {{row.type}}-->
            <div v-if="row.type==1">推荐注册</div>
            <div v-if="row.type==2">推广激活会员</div>
            <div v-if="row.type==3">激活会员等级</div>
            <div v-if="row.type==4">查看产品</div>
            <div v-if="row.type==5">查看文章</div>
            <div v-if="row.type==6">分享产品</div>
            <div v-if="row.type==7">分享文章</div>
            <div v-if="row.type==8">点赞文章</div>
            <div v-if="row.type==9">分享好友APP下载</div>
            <div v-if="row.type==10">浏览商品</div>
            <div v-if="row.type==11">购买商品</div>
            <div v-if="row.type==12">认购基金</div>
            <div v-if="row.type==13">参与公益活动</div>
            <div v-if="row.type==14">邀请好友分享</div>
            <div v-if="row.type==15">查看视频</div>
            <div v-if="row.type==16">点赞</div>
          </template>
          <template slot-scope="{ row, index }" slot="is_forevers">
            <i-switch v-model="row.is_forever" :value="row.is_forever" :true-value="1" :false-value="0" :disabled="true" size="large">
              <span slot="open">永久</span>
              <span slot="close">非永久</span>
            </i-switch>
          </template>
          <template slot-scope="{ row, index }" slot="is_pays">
            <i-switch v-model="row.is_pay" :value="row.is_pay" :true-value="1" :false-value="0"  :disabled="true" size="large">
              <span slot="open">付费</span>
              <span slot="close">免费</span>
            </i-switch>
          </template>
          <template slot-scope="{ row, index }" slot="is_shows">
            <i-switch v-model="row.is_show" :value="row.is_show" :true-value="1" :false-value="0" @on-change="onchangeIsShow(row)" size="large">
              <span slot="open">显示</span>
              <span slot="close">隐藏</span>
            </i-switch>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <a @click="settingTask(row)">设置</a>
            <Divider type="vertical" />
            <a @click="delVip(row)">删除</a>
          </template>
        </Table>
      </Card>
    </Col>
    <Modal v-model="isShow"   :title="`${rowModelType}`"
           footer-hide :z-index="44"
          >
      <Form ref="formItem" class="mt20" :model="formItem" :label-width="labelWidth" :label-position="labelPosition"
           @submit.native.prevent>
        <FormItem type="hidden"  label="id：" label-for="id"  prop="id" style="display: none">
          <Input  v-model="formItem.id"  ></Input>
        </FormItem>
        <FormItem label="类型：" label-for="title"  prop="title">
          <Select
              v-model="formItem.type"
              placeholder="请选择"
              element-id="type"
              clearable
              class="input-add"
          >
            <Option :value="5">查看文章</Option>
            <Option :value="15">查看视频</Option>
<!--            <Option :value="1">推荐注册</Option>-->
            <Option :value="2">推广激活会员</Option>
            <Option :value="3">激活会员等级</Option>
            <Option :value="4">查看产品</Option>
            <Option :value="6">分享产品</Option>
            <Option :value="7">分享文章</Option>
            <Option :value="8">点赞文章</Option>
            <Option :value="9">分享好友APP下载</Option>
            <Option :value="16">点赞</Option>
<!--            <Option :value="10">浏览商品</Option>-->
<!--            <Option :value="11">购买商品</Option>-->
<!--            <Option :value="12">认购基金</Option>-->
<!--            <Option :value="13">参与公益活动</Option>-->
<!--            <Option :value="14">邀请好友分享</Option>-->

          </Select>
        </FormItem>
<!--        <FormItem label="图标：" label-for="icon" prop="icon">-->
<!--          <Input v-model="formItem.icon" placeholder="请输入图标"  style="width: 300px;"></Input>-->
<!--        </FormItem>-->
        <FormItem label="图标：" prop="image">
          <div class="picBox" @click="modalPicTap('单选', 'icon')">
            <div class="pictrue" v-if="formItem.icon"><img v-lazy="formItem.icon"></div>
            <div class="upLoad" v-else>
              <div class="iconfont">+</div>
            </div>
          </div>
        </FormItem>
        <FormItem label="对应链接id：" label-for="dataid"  prop="dataid">
          <Input v-model="formItem.dataid" placeholder="对应链接id"  style="width: 300px;"></Input>
        </FormItem>
        <FormItem label="任务名称(客户端)：" label-for="taskname"  prop="taskname">
          <Input v-model="formItem.taskname" placeholder="请输入任务名称"  style="width: 300px;"></Input>
        </FormItem>
        <FormItem label="任务说明(客户端)：" label-for="mission"  prop="mission">
          <Input v-model="formItem.mission" placeholder="请输入任务名称"  style="width: 300px;"></Input>
        </FormItem>
        <FormItem label="次数：" label-for="frequency"  prop="frequency">
          <Input v-model="formItem.frequency" placeholder="请输入次数"  style="width: 300px;"></Input>
        </FormItem>
        <FormItem label="查看时间(秒)：" label-for="cycle"  prop="cycle">
          <Input v-model="formItem.cycle" placeholder="请输入查看时间"  style="width: 300px;"></Input>
        </FormItem>
        <FormItem label="任务名称中文：" label-for="ctaskname"  prop="ctaskname">
          <Input v-model="formItem.ctaskname" placeholder="请输入任务名称中文"  style="width: 300px;"></Input>
        </FormItem>
        <FormItem label="任务说明中：" label-for="cmission"  prop="cmission">
          <Input v-model="formItem.cmission" placeholder="请输入任务说明中"  style="width: 300px;"></Input>
        </FormItem>
        <FormItem label="任务奖励：" label-for="award"  prop="award">
          <Input v-model="formItem.award" placeholder="请输入任务奖励"  style="width: 300px;"></Input>
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
    <Modal v-model="modalPic" width="960px" scrollable  footer-hide closable :title='picTit == "image"?"上传图标":"上传图标"' :mask-closable="false" :z-index="222">
      <uploadPictures :isChoice="isChoice" @getPic="getPic" :gridBtn="gridBtn" :gridPic="gridPic" v-if="modalPic"></uploadPictures>
    </Modal>
    <Modal v-model="isShowAward"   :title="`${rowModelType}`"
           footer-hide :z-index="44"
    >
      <Form ref="formItem" class="mt20" :model="formSettingItem" :label-width="labelWidth" :label-position="labelPosition"
            @submit.native.prevent>

        <FormItem label="任务奖励：" label-for="award"  prop="award">
          <Input v-model="formSettingItem.award" placeholder="请输入任务奖励金额"  style="width: 300px;"></Input>
        </FormItem>
        <FormItem label="对应链接id：" label-for="dataid"  prop="dataid">
          <Input v-model="formSettingItem.dataid" placeholder="请输入任务对应链接id"  style="width: 300px;"></Input>
        </FormItem>
        <FormItem label="任务时间：" label-for="cycle"  prop="cycle">
          <Input v-model="formSettingItem.cycle" placeholder="请输入任务时间"  style="width: 300px;"></Input>
        </FormItem>
      </Form>
      <div style="text-align: center">
        <Button
            type="primary"
            class="submission"
            @click="saveAward"
        >保存</Button>
      </div>
    </Modal>
  </Row>

</template>
<script>

import {
  createApi, delTaskApi, delVipTaskApi,
  getTaskcreationApi,
  getTaskvipApi,
  saveTaskApi, saveTaskAwardApi,
  taskVipApi,
  updateTaskApi,
  userMemberShip
} from "@api/user";
import {mapState} from "vuex";
import uploadPictures from "@/components/uploadPictures/index.vue";
export default {
  components: {uploadPictures},
  data () {
    return {
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
      type_arr:{
        1:"推荐注册",
        2:"推广激活会员",
        3:"激活会员等级",
        4:"查看产品",
        5:"查看文章",
        6:"分享产品",
        7:"分享文章",
        8:"点赞文章",
        9:"分享好友APP下载",
        10:"浏览商品",
        11:"购买商品",
        12:"认购基金",
        13:"参与公益活动",
        14:"邀请好友分享",
        16:"点赞"
      },
      columns:[
        {
          title: '任务id',
          key: 'id',
          minWidth: 120
        },
        {
          title: '类型',
          slot: 'type',
          minWidth: 120
        },
        {
          title: '图标',
          slot: 'icon',
          minWidth: 120
        },
        {
          title: '对应链接id',
          key: 'dataid',
          minWidth: 120
        },
        {
          title: '任务名称',
          key: 'taskname',
          minWidth: 120
        },
        {
          title: '任务说明',
          key: 'mission',
          minWidth: 120
        },
        {
          title: '次数',
          key: 'frequency',
          minWidth: 120
        },
        {
          title: '查看时间',
          key: 'cycle',
          minWidth: 120
        },
        {
          title: '任务名称中文',
          key: 'ctaskname',
          minWidth: 120
        },
        {
          title: '任务说明中文',
          key: 'cmission',
          minWidth: 120
        },
        {
          title: '任务奖励',
          key: 'award',
          minWidth: 120
        },
        {
          title: '操作',
          slot: 'action',
          fixed: 'right',
          width: 200
        }
      ],
      columns1:[
        // {
        //   title: '主键',
        //   key: 'id',
        //
        // },
        {
          title: 'vipid',
          key: 'vipid',
          minWidth: 120
        },
        {
          title: '任务奖励',
          key: 'award',
          minWidth: 120
        },
        {
          title: '类型',
          slot: 'type',
          minWidth: 120
        },
        {
          title: '图标',
          slot: 'icon',
          minWidth: 120
        },
        {
          title: '对应链接id',
          key: 'dataid',
          minWidth: 120
        },
        {
          title: '任务名称',
          key: 'taskname',
          minWidth: 120
        },
        {
          title: '任务说明',
          key: 'mission',
          minWidth: 120
        },
        {
          title: '次数',
          key: 'frequency',
          minWidth: 120
        },
        {
          title: '查看时间',
          key: 'cycle',
          minWidth: 120
        },
        {
          title: '任务名称中文',
          key: 'ctaskname',
          minWidth: 120
        },
        {
          title: '任务说明中文',
          key: 'cmission',
          minWidth: 120
        },

        {
          title: '操作',
          slot: 'action',
          fixed: 'right',
          width: 200
        }
      ],
      infoList: [],
      grid: {
        xl: 6,
        lg: 12,
        md: 12,
        sm: 12,
        xs: 24
      },
      excessStyle: {
        color: '#f56a00',
        backgroundColor: '#fde3cf'
      },
      taskLists: [],
      taskVipLists: [],
      vip_id:0,
      week:1,
      member_vips:[],
      isShow:false,
      isShowAward:false,
      rowModelType: "新增",
      formItem:{
        id:0,
        type:'',
        icon:'',
        dataid:'',
        taskname:'',
        mission:'',
        frequency:'',
        cycle:0,
        ctaskname:'',
        cmission:'',
        award:0,
      },
      formSettingItem:{
        id:0,
        award:0,
        week:0,
        dataid:0,
        cycle:0,
      },
      taskRow:[],
      member_vips_text:'暂无类型',
      showConfirm:false,
      modalPic: false,
      picTit:'',
      isChoice: '单选',

    }
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
    },
    typeArr(type){
      console.log(type)
      return this.type_arr[type]
    },
    taskMoney(){

      return  this.taskVipLists
          .reduce((sum, task) => sum + task.award, 0); // 累加金额
    }

  },
  methods: {
    confirmSure(){

    },
    saveAward(){
      saveTaskAwardApi(this.formSettingItem).then(res=>{
        this.$Message.success(res.msg);
        this.getTaskVipList()
        this.isShowAward=false
      }).catch((res) => {
        this.$Message.error(res.msg);
      });
    },
    // 选择图片
    modalPicTap (tit, picTit) {
      this.modalPic = true;
      this.picTit = picTit || "";
      this.$refs.formItem.validateField(picTit)
    },
    // 选中图片
    getPic (pc) {
      console.log(this.picTit)
      this.formItem[this.picTit] = pc.att_dir;
      this.modalPic = false;
      this.$refs.formItem.validateField(this.picTit)
    },
    vipChangeHandle() {
      this.taskVipLists=[]
      this.member_vips_text = this.member_vips.find(vip => vip.id === parseInt(this.vip_id)).title
      this.getTaskVipList();
    },
    weekChangeHandle(){
      this.getTaskVipList();
    },
    save(){
      if(this.formItem.id){
        updateTaskApi(this.formItem).then(res=>{
          this.$Message.success(res.msg);
          this.getTaskApi()

        }).catch((res) => {
          this.$Message.error(res.msg);
        });
      }else{
        saveTaskApi(this.formItem).then(res=>{
          this.$Message.success(res.msg);
          this.getTaskApi()
        }).catch((res) => {
          this.$Message.error(res.msg);
        });
      }
      this.isShow =false
    },
    getTaskVipList(){

      getTaskvipApi(this.vip_id,this.week).then(res=>{
          this.taskVipLists = res.data
      })
    },
    getTaskApi(){

      getTaskcreationApi().then(res=>{
         this.taskLists= res.data
      })
    },
    // 添加
    add () {
      this.rowModelType= "新增";
      this.isShow = true;
      this.formItem ={};
      // this.levelId = 0;
      // this.$modalForm(createApi({ id: this.levelId })).then(() => this.getList());
    },
    // 编辑
    edit (row) {
      this.rowModelType= "编辑";
      this.isShow = true;
      this.formItem = row;

    },
    del(row){
      let delfromData = {
        title: "删除任务",
        num: 1,
        url: `/user/deltaskcreation`,
        method: "post",
        ids: {id:row.id},
      };
      this.$modalSure(delfromData)
          .then((res) => {
            this.$Message.success(res.msg);
            this.getTaskApi();
          })
          .catch((res) => {
            this.$Message.error(res.msg);
          });
    },
    settingTask(row){
      this.isShowAward= true;
      this.formSettingItem.id = row.id
    },
    delVip(row){
      let delfromData = {
        title: "删除vip任务",
        num: 1,
        url: `/user/deltaskvip`,
        method: "post",
        ids: {id:row.id},
      };
      this.$modalSure(delfromData)
          .then((res) => {
            this.$Message.success(res.msg);
            this.getTaskVipList();
          })
          .catch((res) => {
            this.$Message.error(res.msg);
          });
    },
    setting(row){
      this.taskRow = row;
      this.taskRow.vipid =  this.vip_id;
      this.taskRow.week = this.week
      taskVipApi(this.taskRow).then(res=>{
        this.$Message.success(res.msg);
        this.getTaskVipList();
      }).catch((res) => {
        this.$Message.error(res.msg);
      });
    },
    // 获取会员类型
    getMemberVip(){
      userMemberShip().then(res=>{
        this.member_vips = res.data.list
      })
    },

  },
  mounted () {
    this.getMemberVip()
    this.getTaskApi()
    this.getTaskVipList();

  }
}
</script>
<style lang="stylus" scoped>
/deep/.ivu-card-head{
  border-bottom:0;
}
/deep/.ivu-icon{
  font-size: 16px;
}
/deep/.ivu-row{
  padding: 2px 0;
  color: #606266;
}
/deep/.ivu-card-extra{
  top:18px;
}
.ivu-mb{
  padding: 0 6px !important;
  margin-bottom: 12px !important;
}
.title{
  font-weight: 600 !important;
  font-size: 16px;
  margin-top: 4px;
  color: #333;
}
.nl{
  display: inline-block;
  padding: 0 3px
}
.number{
  font-size: 30px;
  margin-bottom: 10px;
}
.iconColor{
  color: #F56464;
  font-size: 14px;
}
.iconColor.on{
  color: #19BE6B;
}
.ivu-mr{
  margin-right: 16px !important;
}
.ivu-text-right {
  text-align: right;
}
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
