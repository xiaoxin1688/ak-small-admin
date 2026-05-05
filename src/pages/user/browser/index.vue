<template>
<!-- 用户-用户分组 -->
    <div>
        <Card :bordered="false" dis-hover class="ivu-mt">
            <!-- 相关操作 -->
          <Row type="flex">
            <Col v-bind="grid">
              <Form
                  ref="formValidate"
                  inline
                  :model="userForm"
                  :label-width="labelWidth"
                  :label-position="labelPosition"
                  @submit.native.prevent
              >
<!--                <FormItem label="时间选择：">-->
<!--                  <DatePicker-->
<!--                      :editable="false"-->
<!--                      @on-change="onchangeTime"-->
<!--                      :value="timeVal"-->
<!--                      format="yyyy/MM/dd HH:mm"-->
<!--                      type="datetimerange"-->
<!--                      placement="bottom-end"-->
<!--                      placeholder="自定义时间"-->
<!--                      class="input-width"-->
<!--                      :options="options"-->
<!--                  ></DatePicker>-->
<!--                </FormItem>-->

                <FormItem label="用户uid：">
                  <Input
                      v-model="userForm.uid"
                      placeholder="请输入用户id"
                      class="input-add mr14"
                  />
                </FormItem>
                <FormItem label="浏览器id：">
                  <Input
                      v-model="userForm.browser_id"
                      placeholder="请输入浏览器id"
                      class="input-add mr14"
                  />
                </FormItem>

                <FormItem label="搜索：">

                  <Button class="mr14" @click="selChange" type="primary">查询</Button>
                  <Button @click="reset">重置</Button>
<!--                  <Button class="mr14" style="margin-left: 15px"-->
<!--                          v-auth="['export-userRecharge']"-->
<!--                          @click="exports"-->
<!--                  >导出</Button>-->
                </FormItem>
              </Form>
<!--              <Button v-auth="['admin-user-group']" type="primary" @click="getList">刷新</Button>-->
            </Col>
          </Row>
          <!-- 用户分组表格 -->
          <Table :columns="columns2" :data="userList" ref="table" class="mt25"
                 :loading="loading" highlight-row
                 no-userFrom-text="暂无数据"
                 no-filtered-userFrom-text="暂无筛选结果">
            <template slot-scope="{ row, index }" slot="nickname">
              <div>
                {{row.user.nickname}}
              </div>

            </template>
            <template slot-scope="{ row, index }" slot="business_id">
              <div>
                {{row.user.business_id}}
              </div>

            </template>
            <template slot-scope="{ row, index }" slot="action">
              <a @click="detail(row.finger_print_id)">浏览器用户记录</a>
              <Divider type="vertical" />

            </template>
          </Table>
          <div class="acea-row row-right page">
            <Page :total="userTotal" :current="userForm.page" show-elevator show-total @on-change="userPageChange"
                  :page-size="userForm.limit"/>
          </div>
        </Card>
      <Card>
        <Row type="flex">
          <Col v-bind="grid">
            <Button v-auth="['admin-user-group']" type="primary" @click="getList">刷新</Button>
          </Col>
        </Row>
        <!-- 用户分组表格 -->
        <Table :columns="columns" :data="browserLists" ref="table" class="mt25"
               :loading="loading" highlight-row
               no-userFrom-text="暂无数据"
               no-filtered-userFrom-text="暂无筛选结果">
          <template slot-scope="{ row, index }" slot="icons">
            <viewer>
              <div class="tabBox_img">
                <img v-lazy="row.icon">
              </div>
            </viewer>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <a @click="detail(row.finger_print_id)">查看详情</a>
            <Divider type="vertical" />

          </template>
        </Table>
        <div class="acea-row row-right page">
          <Page :total="total" :current="browserFrom.page" show-elevator show-total @on-change="pageChange"
                :page-size="browserFrom.limit"/>
        </div>
      </Card>
      <Modal v-model="isShow"  title="用户记录" width="600"
             footer-hide
             @on-cancel="isShow=false">
        <!-- 会员利息记录表格 -->
        <Table :columns="columns1" :data="userList" ref="table" class="mt25"
               :loading="loading" highlight-row
               no-userFrom-text="暂无数据"
               no-filtered-userFrom-text="暂无筛选结果">

          <template slot-scope="{ row, index }" slot="nickname">
            <div>
              {{row.user.nickname}}
            </div>

          </template>
          <template slot-scope="{ row, index }" slot="business_id">
            <div>
              {{row.user.business_id}}
            </div>

          </template>
        </Table>
        <div class="acea-row row-right page">
          <Page :total="userTotal" :current="userForm.page" show-elevator show-total @on-change="userPageChange"
                :page-size="userForm.limit"/>
        </div>
      </Modal>
    </div>

</template>

<script>
    import { mapState } from 'vuex';
    import {browserListApi, userListApi} from "@api/browser";
    export default {
        name: "user_group",
        data() {
            return {
              userTotal:0,
              isShow:false,
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
                        title: '浏览器id',
                        key: 'finger_print_id',
                        minWidth: 500
                    },
                    {
                        title: '用户数量',
                        key: 'uid_count',
                        maxWidth: 200
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        fixed: 'right',
                        minWidth: 120,
                        maxWidth: 140
                    }
                ],
              columns2: [
                {
                  title: "编号",
                  key: 'id',

                },
                {
                  title: '用户uid',
                  key: 'uid',

                },
                {
                  title: '昵称',
                  slot: 'nickname',

                },
                {
                  title: '业务线',
                  slot: 'business_id',

                },
                {
                  title: '浏览器id',
                  key: 'finger_print_id',
                  // width: 120
                },
                {
                  title: '操作',
                  slot: 'action',
                  fixed: 'right',
                  minWidth: 120,
                  maxWidth: 140
                }
              ],
              columns1: [
                {
                  title: "编号",
                  key: 'id',
                  width: 80
                },
                {
                  title: '用户uid',
                  key: 'uid',
                  width: 80
                },
                {
                  title: '昵称',
                  slot: 'nickname',
                  width: 100
                },
                {
                  title: '业务线',
                  slot: 'business_id',
                  width: 80
                },
                {
                  title: '浏览器id',
                  key: 'finger_print_id',
                  // width: 120
                },
              ],
                browserFrom: {
                    browser_id:'',
                    page: 1,
                    limit: 10
                },
                userForm: {
                  browser_id:'',
                  uid:'',
                  page: 1,
                  limit: 10
                },
              userList:[],
              browserLists: [],
                total:0
            }
        },
        computed: {
            ...mapState('admin/layout', [
                'isMobile'
            ]),
            labelWidth () {
                return this.isMobile ? undefined : 75;
            },
            labelPosition () {
                return this.isMobile ? 'top' : 'left';
            }
        },
        created () {
            this.getList();
            this.getUserList();
        },
        methods:{
          reset(){
            this.userForm.page=1
            this.userForm.browser_id=''
            this.userForm.uid=''
            this.getUserList()
            this.browserFrom.browser_id=''
            this.getList()
          },
          // 选择
          selChange() {
           // this.userForm.browser_id=
            this.userForm.page = 1;
            this.getUserList();
            if(this.userForm.browser_id){
              this.browserFrom.browser_id=this.userForm.browser_id
              this.getList()
            }

          },

          detail(id){
            this.isShow =true
            this.userForm.page=1
            this.userForm.uid=''
            this.userForm.browser_id=id
            this.userList=[]
            this.getUserList();
          },
          getUserList(){

            userListApi(this.userForm).then(res=>{
              let data = res.data;
              this.userList = data.list;
              this.userTotal = data.count;
              this.loading = false;
            }).catch(res => {
              this.loading = false;
              this.$Message.error(res.msg);
            })
          },
            // 分组列表
            getList () {

              this.loading = true;
              browserListApi(this.browserFrom).then(async res => {
                    let data = res.data;
                    this.browserLists = data.list;
                    this.total = data.count;
                    this.loading = false;
                }).catch(res => {
                    this.loading = false;
                    this.$Message.error(res.msg);
                })
            },
            pageChange (index) {
                this.browserFrom.page = index;
                this.getList();
            },
          userPageChange(index){
            this.userForm.page = index;
            this.getUserList();
          }

        }
    }
</script>
