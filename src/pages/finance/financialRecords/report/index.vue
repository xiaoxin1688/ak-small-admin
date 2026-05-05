<template>
  <!-- 营销-优惠券列表 -->
  <div>
    <Card :bordered="false" dis-hover class="mt15 ivu-mt" :padding="0">
      <div class="new_card_pd">
        <!-- 查询条件 -->
        <Form ref="tableFrom"  inline
              :model="tableFrom"  :label-width="labelWidth"
              :label-position="labelPosition" @submit.native.prevent>
          <FormItem label="业务员id："  label-for="sales_id">
            <Input  v-model="tableFrom.business_id" placeholder="业务员id"
                    class="input-add mr14"/>

          </FormItem>
          <!--          <FormItem label="会员id："  label-for="uid">-->
          <!--            <Input  v-model="tableFrom.uid" placeholder="会员id" @on-search="userSearchs"-->
          <!--                    class="input-add mr14"/>-->

          <!--          </FormItem>-->
<!--          <FormItem label="会员类型：">-->
<!--            <Select-->
<!--                v-model="tableFrom.member_type"-->
<!--                clearable-->
<!--                class="input-add"-->
<!--            >-->
<!--              <Option-->
<!--                  v-for="item in treeSelect"-->
<!--                  :value="item.value"-->
<!--                  :key="item.value"-->
<!--              >{{ item.label }}</Option-->
<!--              >-->
<!--            </Select>-->
<!--          </FormItem>-->
          <FormItem label="时间选择：">
            <DatePicker
                :editable="false"
                @on-change="onchangeTime"
                :value="timeVal"
                format="yyyy/MM/dd HH:mm"
                type="datetimerange"
                placement="bottom-start"
                placeholder="自定义时间"
                class="input-add"
                :options="options"
            ></DatePicker>
          </FormItem>
          <Button type="primary" @click="orderSearch()" class="mr14">查询</Button>
          <Button  @click="reset()" class="mr14">重置</Button>
        </Form>
      </div>
    </Card>
    <cards-data :cardLists="cardLists" ></cards-data>
    <Card :bordered="false" dis-hover class="ivu-mt">
      <!-- 操作 -->
      <!-- 优惠券列表-表格 -->
      <Table :columns="columns1" :data="tableList" ref="table" class="ivu-mt"
             :loading="loading" highlight-row
             no-userFrom-text="暂无数据"
             no-filtered-userFrom-text="暂无筛选结果">

        <!--        <template slot-scope="{ row }" slot="status">-->
        <!--          <i-switch v-model="row.status" :value="row.status" :true-value="1" :false-value="0" size="large" @on-change="openChange(row)">-->
        <!--            <span slot="open">开启</span>-->
        <!--            <span slot="close">关闭</span>-->
        <!--          </i-switch>-->
        <!--        </template>-->

        <!--        <template slot-scope="{ row, index }" slot="created_at">-->
        <!--          <span> {{row.created_at | formatDate}}</span>-->
        <!--        </template>-->
        <template slot-scope="{ row, index }" slot="totalprice">
          <a href="#"  class="copy-btn"  @click.prevent="tablePopup(row,'totalprice')">{{row.totalprice}}</a>
        </template>
        <template slot-scope="{ row, index }" slot="totalextract_price">
          <a href="#"  class="copy-btn"  @click.prevent="tablePopup(row,'totalextract_price')">{{row.totalextract_price}}</a>
        </template>
        <!--        <template slot-scope="{ row, index }" slot="action">-->
        <!--          <a href="#"  class="copy-btn"  @click.prevent="receive(row)">详情</a>-->
        <!--        </template>-->
      </Table>
      <!--      <div class="acea-row row-right page">-->
      <!--        <Page :total="total" :current="tableFrom.page" show-elevator show-total @on-change="pageChange"-->
      <!--              :page-size="tableFrom.limit"/>-->
      <!--      </div>-->
    </Card>
    <!-- 领取记录 -->
    <Modal v-model="modals2" scrollable  footer-hide closable title="财务记录" :mask-closable="false"  width="900">
      <Table :columns="columns2" :data="receiveList" ref="table" class="mt25"
             :loading="loading2" highlight-row
             no-userFrom-text="暂无数据"
             no-filtered-userFrom-text="暂无筛选结果">
        <template slot-scope="{ row, index }" slot="avatar">
          <viewer>
            <div class="tabBox_img">
              <img v-lazy="row.avatar">
            </div>
          </viewer>
        </template>
      </Table>
      <div class="acea-row row-right page">
        <Page :total="total2" show-elevator show-total
              :page-size="receiveFrom.limit"/>

      </div>
    </Modal>
  </div>

</template>

<script>
import { mapState } from "vuex";

import { formatDate } from "@/utils/validate";
import Setting from "@/setting";
import {memberTab} from "@api/user";
import cardsData from "@/components/cards/cards.vue";
import { reportListApi } from '@api/finance';

export default {
  name: "record",
  components: {cardsData},
  filters: {
    formatDate(time) {
      if (time !== 0) {
        let date = new Date(time * 1000);
        return formatDate(date, "yyyy-MM-dd hh:mm:ss");
      }
    }
  },
  data() {
    return {
      cardLists: [],
      roterPre: Setting.roterPre,
      modals2: false,
      treeSelect:[],
      receiveList: [],
      timeVal: [],
      loading2: false,
      columns2: [

      ],
      total2: 0,
      receiveFrom: {
        page: 1,
        limit: 15
      },
      grid: {
        xl: 7,
        lg: 7,
        md: 12,
        sm: 24,
        xs: 24
      },
      loading: false,
      columns1: [

      ],
      tableFrom: {
        start_time: "",
        end_time: "",
        business_id:"",

      },
      tableFromTwo: {
        member_type: "",
        finance: 3,
        start:"",
        stop:"",
        sales_id:"",
      },
      tableList: [],
      total: 0,
      site_url:'',
      FromData: null,
      rows: {},
      options: {
        shortcuts: [
          {
            text: "今天",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(
                  new Date(
                      new Date().getFullYear(),
                      new Date().getMonth(),
                      new Date().getDate()
                  )
              );
              return [start, end];
            },
          },
          {
            text: "昨天",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(
                  start.setTime(
                      new Date(
                          new Date().getFullYear(),
                          new Date().getMonth(),
                          new Date().getDate() - 1
                      )
                  )
              );
              end.setTime(
                  end.setTime(
                      new Date(
                          new Date().getFullYear(),
                          new Date().getMonth(),
                          new Date().getDate() - 1
                      )
                  )
              );
              return [start, end];
            },
          },
          {
            text: "最近7天",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(
                  start.setTime(
                      new Date(
                          new Date().getFullYear(),
                          new Date().getMonth(),
                          new Date().getDate() - 6
                      )
                  )
              );
              return [start, end];
            },
          },
          {
            text: "最近30天",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(
                  start.setTime(
                      new Date(
                          new Date().getFullYear(),
                          new Date().getMonth(),
                          new Date().getDate() - 29
                      )
                  )
              );
              return [start, end];
            },
          },
          {
            text: "上月",
            value() {
              const end = new Date();
              const start = new Date();
              const day = new Date(start.getFullYear(), start.getMonth(), 0).getDate();
              start.setTime(
                  start.setTime(
                      new Date(new Date().getFullYear(), new Date().getMonth()-1, 1)
                  )
              );
              end.setTime(
                  end.setTime(
                      new Date(new Date().getFullYear(), new Date().getMonth()-1, day)
                  )
              );
              return [start, end];
            },
          },
          {
            text: "本月",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(
                  start.setTime(
                      new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                  )
              );
              return [start, end];
            },
          },
          {
            text: "本年",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(
                  start.setTime(new Date(new Date().getFullYear(), 0, 1))
              );
              return [start, end];
            },
          },
        ],
      },
    };
  },
  created() {
    this.fetchData()
   // this.memberTypeList()
  },
  computed: {
    ...mapState("admin/layout", ["isMobile"]),
    labelWidth() {
      return this.isMobile ? undefined : 96;
    },
    labelPosition() {
      return this.isMobile ? "top" : "right";
    }
  },

  methods: {

    async  fetchData() {
      await this.getList();

      //await this.getDepositList();
    },
    reset(){
      this.timeVal=[];
      this.tableFrom= {
        start_time: "",
        end_time: "",
        business_id:"",
      }
    },
    // 获取会员类型
    memberTypeList(){
      memberTab().then(res=>{
        this.treeSelect = res.data
      })
    },
    convertToTimestamp(dateString) {
      if (dateString) {
        const dateParts = dateString.split('/');
        if (dateParts.length === 3) {
          const year = parseInt(dateParts[0], 10);
          const month = parseInt(dateParts[1], 10) - 1; // 月份从 0 开始
          const day = parseInt(dateParts[2], 10);
          const date = new Date(year, month, day);
          if (!isNaN(date.getTime())) {
            return  Math.floor(date.getTime() / 1000);
          }
        }
      }
      return  "";
    },
    // 具体日期
    onchangeTime(e) {
      this.timeVal = e;
      if( this.timeVal){
        this.tableFrom.start_time = this.convertToTimestamp(this.timeVal[0]);
        this.tableFrom.end_time = this.convertToTimestamp(this.timeVal[1]);
      }
    },
    // 列表
    async getList() {
      this.loading = true;
      let that = this;
      reportListApi(that.tableFrom)
          .then(async res => {

            that.cardLists =[];

            for (const key in res.data.tabsumtitle) {
              if (res.data.tabsumtitle.hasOwnProperty(key)) {
                let title_arr = res.data.tabsumtitle[key];

                that.cardLists.push(
                    {
                      col: 6,
                      count: res.data.tabsumdata[title_arr.key],
                      name: title_arr.title,
                      // className: "md-basket",
                    }
                )
              }
            }
            let tableData = res.data.tabdata;
            console.log(tableData);
            if(res.data.tabtitle){
              let columns1 =res.data.tabtitle;
              console.log(columns1)
              that.columns1 =Object.values(columns1);

              // this.columns1.push( {
              //   title: "操作",
              //   slot: "action",
              //   fixed: "center",
              // })
            }
            this.tableList = Object.values(tableData);
            this.loading = false;
          })
          .catch(res => {
            this.loading = false;
            this.$Message.error(res.msg);
          });
    },
    tablePopup(row,key){
      this.modals2 = true;
      this.rows = row;
      this.tableFrom.finance=2
      this.tableFrom.key = key
      this.tableFrom.sales_id = row.sales_id
      this.getSubList(row.pid);
    },
    // 领取记录
    receive(row) {
      this.modals2 = true;
      this.rows = row;
      this.tableFrom.finance=2

      this.getSubList(row.pid);
    },

    getSubList(pid){
      this.tableFrom.pid = pid;
      sumDepositUser(this.tableFrom)
          .then(async res => {
            if(res.data.tabtitle){
              let columns2 =res.data.tabtitle;
              this.columns2 = columns2;
            }
            let data = res.data;
            this.receiveList = data.DepositList;
            // this.loading = false;
          })
          .catch(res => {
            // this.loading = false;
            this.$Message.error(res.msg);
          });
    },

    pageChange(index) {
      this.getList();
    },
    // 表格搜索
    userSearchs() {
      this.getList();
    },
    // 搜索()
    orderSearch () {

      this.fetchData()
    },

  }
};
</script>

<style scoped lang="stylus">
.fa {
  color: #0a6aa1;
  display: block;
}

.sheng {
  color: #ff0000;
  display: block;
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
