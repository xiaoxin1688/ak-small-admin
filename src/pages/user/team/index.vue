<template>
<!-- 用户-用户分组 -->
    <div>

        <Card :bordered="false" dis-hover class="ivu-mt">
            <!-- 相关操作 -->
          <div class="card_pd">
            <!-- 查询条件 -->
            <Form
                ref="formValidate"
                inline
                :model="userFrom1"
                :label-width="labelWidth"
                :label-position="labelPosition"
                @submit.native.prevent
            >
              <FormItem label="用户id：">
                <Input
                    v-model="userFrom1.uid"
                    placeholder="用户id"
                    class="input-add mr14"
                />
                <Button class="mr14" @click="search" type="primary">查询</Button>
                <Button @click="reset">重置</Button>

              </FormItem>
            </Form>
          </div>

        </Card>
      <card style="margin-top: 20px">
        <div style="display:flex;">
          <div v-for="(num, index) in numbers" :key="index" class="number-item" :class="{'active': selectedIndex === index}" @click="selectNumber(num,index)">

            <span >{{ num }}</span>
          </div>
        </div>
      </card>
      <Card style="margin-top: 20px">
        <Table :columns="columns" :data="teamData"
               ref="table"
               :loading="loading"
               no-userFrom-text="暂无数据"
               no-filtered-userFrom-text="暂无筛选结果"
        >
          <template slot-scope="{ row }" slot="uid">
            <div >
              <a @click="childTeamHandle(row.uid)">{{ row.uid }}</a>
            </div>
          </template>
          <template slot-scope="{ row }" slot="is_group">
            <div v-if="row.is_group===1">是</div>
            <div  v-else>
              否
            </div>
          </template>
          <template slot-scope="{ row }" slot="task_off">
            <div v-if="row.task_off===1">开</div>
            <div  v-else>
              关
            </div>
          </template>
        </Table>
        <div class="acea-row row-right page">
          <Page :total="total1" :current.sync="userFrom1.page" show-elevator show-total @on-change="onPageChange" :page-size="userFrom1.limit"  />
        </div>
      </Card>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { infoApi} from '@/api/user';
    export default {
        name: "user_group",
        data() {
            return {
                grid: {
                    xl: 7,
                    lg: 7,
                    md: 12,
                    sm: 24,
                    xs: 24
                },
                loading: false,
              teamData:[],
              columns:[
                {
                  title: 'uid',
                  slot: 'uid',

                },
                {
                  title: '账号',
                  key: 'account',

                },
                {
                  title: '手机号',
                  key: 'phone',

                },
                {
                  title: '注册ip',
                  key: 'add_ip',

                },
                {
                  title: 'vip等级',
                  key: 'level_name',

                },
                {
                  title: '是否群主',
                  slot: 'is_group',

                },
                {
                  title: '人数',
                  key: 'spread_conut',
                },
                {
                  title: '任务状态',
                  slot: 'task_off',

                },
                {
                  title: '业务员id',
                  key: 'business_id',

                },
                {
                  title: '最后登录ip',
                  key: 'last_ip',

                }
              ],
              numbers: [],
              selectedIndex: null, // 用于存储当前选中的索引
              userFrom1: {
                  uid:'',
                limit:10,
                page:1,
                isover:'',
                keyword: '',
                pathtype: "0",
                memberid:"",
                type:"geteam",
                start: "",
                stop: "",
              },
                groupLists: [],
                total1:0
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
          //  this.getTeamList();
        },
        methods:{

            // 分组列表
          getTeamList () {
            let data={
              id: this.userFrom1.uid,
              datas:this.userFrom1
            }
              infoApi(data).then(res=>{
                if(res.data){
                  this.total1 = res.data.count;
                  this.teamData = res.data.list;
                  if(res.data.group_path){
                    this.numbers = res.data.group_path;
                  }
                  this.selectedIndex = this.numbers.length-1
                }
              })
            },
          onPageChange(index){
            this.userFrom1.page = index;
            this.getTeamList();
          },
          selectNumber(num,index) {
            this.selectedIndex = index;
            this.userFrom1.uid =num
            this.getTeamList()
          },
          childTeamHandle(uid){
            this.userFrom1.uid = uid;
            // this.numbers=[];
            this.userFrom1.page=1;
            this.selectedIndex=0;
            this.getTeamList()
          },
          search(){
            this.getTeamList();
          },
          reset() {
            this.userFrom1 = {
              uid: "",
              page: 1,
              limit: 20
            };
            this.getTeamList();
          },
        }
    }
</script>
<style scoped lang="stylus">
.number-item {

  align-items: center;
  margin-right: 10px;
  width: 90px;
  height: 32px;
  border-radius: 4px;
  /* Rectangle 1302 */
  //left: 84px;
  top: 0;
  background: #DCDEE2;
  padding: 5px;
  text-align: center;

}

.number-item span {
  font-size: 16px;
  color: #333;
}
.number-item.active {
  font-weight: bold;
  background-color: #2084EE;
}
.number-item.active span {
  color: #FFFFFF; /* 蓝色 */
  font-weight: bold;
}

.number-item:not(.active):hover span {
  color: #666;
}

</style>
