<template>
  <!-- 用户-会员管理-等级列表 -->
  <div>
    <Card :bordered="false" dis-hover class="ivu-mt" :padding="0">
      <div class="new_card_pd">
        <!-- 筛选条件 -->
        <Form ref="noticeFrom" :model="noticeFrom" inline :label-width="labelWidth" :label-position="labelPosition" @submit.native.prevent>
          <FormItem label="标题："  label-for="title">
            <Input  v-model="noticeFrom.title"  placeholder="请输入标题" style="width:250px;margin-right:14px;"/>
          </FormItem>

          <Button type="primary" @click="userSearchs">查询</Button>
<!--          <FormItem label="基金状态："  label-for="title">-->
<!--            <Input  v-model="depositFrom.status"  placeholder="请输入基金状态 " style="width:250px;margin-right:14px;"/>-->
<!--            <Button type="primary" @click="userSearchs">查询</Button>-->
<!--          </FormItem>-->
        </Form>
      </div>
    </Card>
    <Card :bordered="false" dis-hover class="ivu-mt">
      <!-- 相关操作 -->
      <Button v-auth="['admin-user-level_add']" type="primary" @click="add">添加</Button>
      <!-- 基金列表表格 -->
      <Table :columns="columns" :data="depositList" ref="table" class="mt25"
             :loading="loading" highlight-row
             no-userFrom-text="暂无数据"
             no-filtered-userFrom-text="暂无筛选结果">

        <template slot-scope="{ row, index }" slot="level">
            <div>
              {{member_vips.find(vip => vip.id === parseInt(row.level)).title}}
            </div>
        </template>
        <template slot-scope="{ row, index }" slot="status">
          <i-switch v-model="row.status" :value="row.status" :true-value="1" :false-value="0" @on-change="onchangeIsShow(row)" size="large">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </template>

        <template slot-scope="{ row, index }" slot="action">
          <a @click="edit(row)">编辑</a>
          <Divider type="vertical" />
          <a @click="del(row)">删除</a>
          <Divider type="vertical" />
        </template>
      </Table>
      <div class="acea-row row-right page">
        <Page :total="total" :current="noticeFrom.page" show-elevator show-total @on-change="pageChange"
              :page-size="noticeFrom.limit"/>
      </div>
    </Card>
    <Modal v-model="isShow"   :title="`${rowModelType}`"
           footer-hide
           @on-cancel="isShow=false">
      <Form ref="formItem" class="mt20" :model="formItem" :label-width="labelWidth" :label-position="labelPosition"  @submit.native.prevent>
        <FormItem type="hidden"  label="id：" label-for="id"  prop="id" style="display: none">
          <Input  v-model="formItem.id"  ></Input>
        </FormItem>
        <FormItem label="标题：" label-for="title"  prop="title">
          <Input v-model="formItem.title" placeholder="请输入标题"  style="width: 300px;"></Input>
        </FormItem>
        <FormItem label="内容：" label-for="title"  prop="title">
          <textarea v-model="formItem.content" placeholder="请输入内容"  style="width: 300px;"></textarea>
        </FormItem>
        <FormItem label="链接跳转：" label-for="link_url"  prop="link_url">
          <Input v-model="formItem.link_url" placeholder="请输入链接跳转"  style="width: 300px;"></Input>
        </FormItem>
        <FormItem label="开始日期：" label-for="start_date"  prop="start_date">
          <DatePicker type="datetime" @on-change="onchangeStart"  v-model="formItem.start_time"
                      placeholder="请选择开始日期" format="yyyy-MM-dd HH:mm" style="width: 260px;"></DatePicker>
        </FormItem>
        <FormItem label="结束日期：" label-for="end_date"  prop="end_date">
          <DatePicker type="datetime" @on-change="onchangeEnd"   v-model="formItem.end_time"
                      placeholder="请选择结束日期" format="yyyy-MM-dd HH:mm" style="width: 260px;"></DatePicker>
        </FormItem>
        <FormItem label="所属会员类型：" label-for="level"  prop="level">
          <Select
              v-model="formItem.level_name"
              placeholder="请选择"
              clearable
              class="input-add"
          >
            <Option value="0">请选择</Option>
            <Option v-for="item in member_vips" :key="item.title" :value="item.title">{{ item.title }}</Option>
          </Select>
<!--          <Input v-model="formItem.member_ship_id" placeholder="请输入产品名称"  style="width: 300px;"></Input>-->
        </FormItem>
        <FormItem label="状态：" label-for="status" prop="status">
          <Switch size="large" v-model="formItem.status" :false-value="0" :true-value="1">
            <span slot="open" :true-value="1">开启</span>
            <span slot="close" :false-value="0">关闭</span>
          </Switch>
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
import {userMemberShip} from '@/api/user';
import editFrom from '@/components/from/from';
import {
 listApi,
 saveApi,
 updateApi,
    deleteApi
} from "@api/notice";
export default {
  name: 'user_level',
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
          title: '标题',
          key: 'title',
          minWidth: 100
        },
        {
          title: '会员等级',
          key: 'level_name',
          minWidth: 100
        },
        {
          title: '跳转链接',
          key: 'link_url',
          minWidth: 120
        },

        {
          title: '开始时间',
          key: 'start_time',
          minWidth: 120
        },
        {
          title: '结束日期',
          key: 'end_time',
          minWidth: 120
        },



        {
          title: '创建时间',
          key: 'add_time',
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
      noticeFrom: {
        title: '',
        page: 1,
        limit: 10
      },
      rowModelType: "新增",
      member_vips:[],
      formItem:{
        id:0,
        title:'',
        content:'',
        link_url:'',
        level:0,
        level_name:'',
        start_time:'',
        end_time:'',
        status:0,
      },
      depositList: [],
      total: 0,
      FromData: null,
      levelId: 0,
      modelTask: false,
      num: 0,
      isShow:false,
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
    // 选择图片
    modalPicTap (tit, picTit) {
      this.modalPic = true;
      this.picTit = picTit || "";
      this.$refs.formItem.validateField(picTit)
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
        url: `/system/notice/delete`,
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



    // 等级列表
    getList () {
      this.loading = true;
     listApi(this.noticeFrom).then(async res => {
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
      this.noticeFrom.page = index;
      this.getList();
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

    // 表格搜索
    userSearchs () {
      this.noticeFrom.page = 1;
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
