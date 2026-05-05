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

          <FormItem label="类型：">
            <Select
                v-model="formValidate.type"
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
		<FormItem label="用户id：">
		    <Input
		      v-model="formValidate.uid"
		      placeholder="用户id"
		      class="input-add mr14"
		    />
		    <Button class="mr14" @click="selChange" type="primary">查询</Button>
			<Button @click="reset">重置</Button>

		</FormItem>
      </Form>
      </div>
    </Card>
    <div>
      <!--v-if="item.count && item.count!='0.00'"-->
      <Row type="flex" align="middle" :gutter="16" class="ivu-mt">
        <Col
            :xs="24"
            :sm="24"
            :md="12"
            :lg="12"
            :xl="8"
            :xxl="{ span: item.col }"
            class="ivu-mb"
            v-for="(item, index) in cardLists"
            :key="index"
        >
          <Card shadow :padding="0" class="card_cent">
            <div class="card_box">
              <div
                  class="card_box_cir"
                  :class="{
                one: index % 5 == 0,
                two: index % 5 == 1,
                three: index % 5 == 2,
                four: index % 5 == 3,
                five: index % 5 == 4,
              }"
              >
                <div
                    class="card_box_cir1"
                    :class="{
                  one1: index % 5 == 0,
                  two1: index % 5 == 1,
                  three1: index % 5 == 2,
                  four1: index % 5 == 3,
                  five1: index % 5 == 4,
                }"
                >
                  <Icon type="md-cash" />
                </div>
              </div>
              <div class="card_box_txt">
                <span class="sp2">总人数:{{item.uv_uid}}</span>
<!--                <span class="sp2">vipid:{{item.svip_id}}</span>-->
                <span class="sp2">完成任务人数:{{item.Completed}}</span>
                <span class="sp2">未完成任务人数:{{item.Complete}}</span>
                <span class="sp2">vip名称:{{item.title}}</span>
              </div>

            </div>
          </Card>
        </Col>
      </Row>
    </div>
    <Card :bordered="false" dis-hover>
      <!-- 表格 -->
      <Table
        ref="table"
        :columns="columns"
        :data="tabList"
        class="ivu-mt"
        :loading="loading"
        no-data-text="暂无数据"
        no-filtered-data-text="暂无筛选结果"
      >

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
  </div>
</template>
<script>
import cardsData from "@/components/cards/cards";
import searchFrom from "@/components/publicSearchFrom";
import { mapState } from "vuex";
import { formatDate } from "@/utils/validate";
import editFrom from "@/components/from/from";
import timeOptions from "@/utils/timeOptions";
import {getMissonTaskApi, userMemberShip} from '@api/user';

import Setting from '@/setting';
export default {
  name: "cashApply",
  components: { cardsData, searchFrom, editFrom },
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
      member_vips:[],
      modal_loading: false,
      options: timeOptions,
      modals: false,
      total: 0,
      cardLists: [],
      loading: false,
      columns: [
        {
          title: "用户id",
          key: "uid",
          minWidth: 120,
        },
        {
          title: "vipid",
          key: "vipid",
          minWidth: 120,
        },
        {
          title: "VIP等级",
          key: "title",
          minWidth: 120,
        },
        {
          title: "任务名称",
          key: "taskname",
          minWidth: 120,
        },
        {
          title: "任务说明",
          key: "mission",
          minWidth: 120,
        },
        {
          title: "任务奖励",
          key: "award",
          minWidth: 90,
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
          title: '星期',
          key: 'weekday',
          minWidth: 120
        },
        {
          title: '完成时间',
          key: 'end_time',
          minWidth: 120
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
      formValidate: {
        uid:'',
        type:'',
        data: "",
        page: 1,
        limit: 20,
      },
      isEdit:0,
      extractStatistics: {},
      timeVal: [],
      FromData: null,
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

    this.getList();

  },
  methods: {

    // 获取会员类型
    getMemberVip() {
      userMemberShip().then(res => {
        this.member_vips = res.data.list
      })
    },


    // 具体日期
    onchangeTime(e) {
      this.timeVal = e;
      this.formValidate.data = this.timeVal[0] ? this.timeVal.join("-") : "";
      this.formValidate.page = 1;
      this.getList();
    },
    // 选择时间
    selectChange(tab) {
      this.formValidate.page = 1;
      this.formValidate.data = tab;
      this.timeVal = [];
      this.getList();
    },
    // 选择
    selChange() {
      this.formValidate.page = 1;
      this.getList();
    },
    reset() {
      this.formValidate = {
        data:'',
        uid: "",
        page: 1,
        limit: 20
      };
      this.getList();
    },
    // 列表
    getList() {
      this.loading = true;
      getMissonTaskApi(this.formValidate)
          .then(async (res) => {
            let data = res.data;
            this.tabList = data.list;
            this.total = data.count;
            this.cardLists = data.count3

            this.loading = false;
          })
          .catch((res) => {
            this.loading = false;
            this.$Message.error(res.msg);
          });
    },
    pageChange(index) {
      this.formValidate.page = index;
      this.getList();
    },


  }
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
/deep/.ivu-card-body{
  height: 110px;
}
/deep/.card_box{
  padding: 0 25px;
}
.card_box_cir1 >>> .ivu-icon {
  font-size: 26px;
  color: #fff;
}

.one {
  background: #E4ECFF;
}

.two {
  background: #FFF3E0;
}

.three {
  background: #EAF9E1;
}

.four {
  background: #FFEAF4;
}

.five {
  background: #F1E4FF;
}

.one1 {
  background: #4D7CFE;
}

.two1 {
  background: #FFAB2B;
}

.three1 {
  background: #6DD230;
}

.four1 {
  background: #FF85C0;
}

.five1 {
  background: #B37FEB;
}

.card_box {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  /* justify-content: center */
  padding: 25px;
  box-sizing: border-box;
  border-radius: 4px;

  .card_box_cir {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 20px;
    display: flex;
    justify-content: center;
    align-items: center;

    .card_box_cir1 {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .card_box_txt {
    .sp1 {
      display: block;
      color: #252631;
      font-size: 24px;
    }

    .sp2 {
      display: block;
      color: #0e0f10;
      font-size: 12px;
    }
  }
}

.card_box_cir1 .iconfont {
  color: #fff;
  font-size: 23px;
}
@media (min-width: 1600px) {
  .ivu-col-span-xxl-4-8 {
    display: block;
    flex: 0 0 20%;
    max-width: 20%;
  }
}
</style>
