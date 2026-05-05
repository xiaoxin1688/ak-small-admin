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
          <FormItem label="任务id：">
            <Input
                v-model="formValidate.id"
                placeholder="任务id"
                class="input-add mr14"
            />
          </FormItem>
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

          <FormItem label="状态：">
            <Select v-model="formValidate.status" clearable class="input-add" @on-change="selChange">
              <Option
                  v-for="(itemn, indexn) in treeData.withdrawal"
                  :value="itemn.value"
                  :key="indexn"
              >{{ itemn.title }}</Option
              >
            </Select>
          </FormItem>

<!--          <FormItem label="会员等级：">-->
<!--            <Select-->
<!--                v-model="formValidate.svip_id"-->
<!--                placeholder="请选择"-->
<!--                clearable-->
<!--                class="input-add"-->
<!--            >-->
<!--              <Option value="0">请选择</Option>-->
<!--              <Option v-for="item in member_vips" :key="item.id" :value="item.id">{{ item.title }}</Option>-->
<!--            </Select>-->
<!--          </FormItem>-->
          <FormItem label="用户id：">
            <Input
                v-model="formValidate.uid"
                placeholder="用户id"
                class="input-add mr14"
            />
          </FormItem>

          <FormItem >
            <Button class="mr14" @click="selChange" type="primary">查询</Button>
            <Button @click="reset">重置</Button>
<!--            <Button class="mr14" style="margin-left: 15px"-->
<!--                    v-auth="['export-userRecharge']"-->
<!--                    @click="exports"-->
<!--            >导出</Button>-->
          </FormItem>
        </Form>
      </div>
    </Card>
    <cards-data :cardLists="cardLists" v-if="extractStatistics"></cards-data>
    <!-- 批量操作按钮 -->
<!--    <button @click="handleBatchAction" :disabled="selectedRows.length === 0">-->
<!--      批量操作-->
<!--    </button>-->
<!--    <Card :bordered="false" dis-hover>-->
<!--      &lt;!&ndash; 表格 &ndash;&gt;-->
<!--      <Table-->
<!--          ref="table"-->
<!--          :columns="columns"-->
<!--          :data="tabList"-->
<!--          class="ivu-mt"-->
<!--          :loading="loading"-->
<!--          no-data-text="暂无数据"-->
<!--          no-filtered-data-text="暂无筛选结果"-->

<!--      >-->
<!--        &lt;!&ndash; 多选框列 &ndash;&gt;-->
<!--        <template slot-scope="{ row, index }" slot="checkbox">-->
<!--          <Checkbox :value="isRowSelected(row)" @change="toggleRowSelection(row)" />-->
<!--        </template>-->
<!--        <template slot-scope="{ row, index }" slot="imgurl">-->
<!--          <viewer-->
<!--          >-->
<!--            <div class="tabBox_img">-->
<!--              <img v-lazy="row.imgurl" />-->
<!--            </div>-->
<!--          </viewer>-->
<!--        </template>-->
<!--        <template slot-scope="{ row, index }" slot="status">-->
<!--          <div class="status" v-if="row.status === 0">-->
<!--            审核中-->
<!--          </div>-->
<!--          <div class="status" v-if="row.status === 1">-->
<!--            通过-->
<!--          </div>-->
<!--          <div class="status" v-if="row.status === 2">-->
<!--            拒绝-->
<!--          </div>-->
<!--        </template>-->
<!--        <template-->
<!--            slot-scope="{ row }"-->
<!--            slot="createModalFrame"-->
<!--        >-->
<!--          <div class="status" v-if="row.status===0"  style="display: flex">-->
<!--            <a @click="examine(row)" v-if="row.status == 0">审核</a>-->
<!--            </div>-->
<!--        </template>-->
<!--      </Table>-->
<!--      <div class="acea-row row-right page">-->
<!--        <Page-->
<!--            :total="total"-->
<!--            :current="formValidate.page"-->
<!--            show-elevator-->
<!--            show-total-->
<!--            @on-change="pageChange"-->
<!--            :page-size="formValidate.limit"-->
<!--        />-->
<!--      </div>-->
<!--    </Card>-->

    <Row type="flex" justify="space-between">
      <!-- 相关操作 -->
      <Col span="24">

        <Tooltip
            content="本页至少选中一项"
            :disabled="!!checkUidList.length && isAll==0"
        >
          <Button
              v-auth="['admin-user-coupon']"
              type="primary"
              class="mr20"
              :disabled="!checkUidList.length && isAll==0"
              @click="onSend"
          >批量审核</Button
          >
        </Tooltip>
      </Col>
    </Row>
    <!-- 用户列表表格 -->
    <vxe-table
        ref="xTable"
        class="mt25"
        :loading="loading"
        row-id="id"
        :expand-config="{accordion: true}"
        :checkbox-config="{reserve: true}"
        @checkbox-all="checkboxAll"
        @checkbox-change="checkboxItem"
        :data="tabList">
      <vxe-column type="" width="0"></vxe-column>
      <vxe-column type="checkbox" width="100">
        <template #header>
          <div>
            <Dropdown transfer @on-click="allPages">
              <a href="javascript:void(0)" class="acea-row row-middle">
                <span>全选({{isAll==1?(total-checkUidList.length):checkUidList.length}})</span>
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <template #list>
                <DropdownMenu>
                  <DropdownItem name="0">当前页</DropdownItem>
                  <!--                    <DropdownItem name="1">所有页</DropdownItem>-->
                </DropdownMenu>
              </template>
            </Dropdown>
          </div>
        </template>
      </vxe-column>
      <vxe-column field="id" title="ID" width="60"></vxe-column>
      <vxe-column field="uid" title="用户id">
      </vxe-column>
      <vxe-column field="business_id" title="业务员id">
      </vxe-column>
      <vxe-column field="taskurl" title="任务链接">
      </vxe-column>
      <vxe-column field="imgurl" title="凭证" >
        <template v-slot="{ row }">
          <viewer>
            <div class="tabBox_img">
              <img v-lazy="row.imgurl" />
            </div>
          </viewer>
        </template>
      </vxe-column>
      <vxe-column field="status" title="审核状态" >
        <template v-slot="{ row }">
                    <div class="status" v-if="row.status === 0">
                      审核中
                    </div>
                    <div class="status" v-if="row.status === 1">
                      通过
                    </div>
                    <div class="status" v-if="row.status === 2">
                      拒绝
                    </div>
        </template>

      </vxe-column>
      <vxe-column field="msg" title="拒绝原因" ></vxe-column>
      <vxe-column field="addtime" title="添加时间" ></vxe-column>
      <vxe-column field="action" title="操作" align="center" width="180" fixed="right">
        <template v-slot="{ row }">
                    <div class="status" v-if="row.status===0"  style="display: flex">
                      <a @click="examine(row)" v-if="row.status == 0">审核</a>
                      </div>
        </template>
      </vxe-column>
    </vxe-table>
    <vxe-pager class="mt20" border size="medium" :page-size="formValidate.limit" :current-page="formValidate.page" :total="total"
               :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Total']" @page-change="pageChange">
    </vxe-pager>

    <!-- 审核 -->
    <Modal title="审核" v-model="modal" :mask-closable="false">
      <Form :model="formItem" :label-width="80">
        <FormItem label="审核状态：">
          <RadioGroup v-model="formItem.status">
            <Radio label="1">通过</Radio>
            <Radio label="2">拒绝</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="拒绝原因：" v-if="formItem.status === '2'">
          <Input v-model="formItem.msg" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入拒绝原因"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary"  @click="ok">提交</Button>
        <Button @click="cancel">取消</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
import cardsData from "@/components/cards/cards";
import searchFrom from "@/components/publicSearchFrom";
import { mapState } from "vuex";
import { userTaskListApi, userTaskListViewApi, userTaskViewApi } from '@/api/finance';
import { formatDate } from "@/utils/validate";
import editFrom from "@/components/from/from";
import timeOptions from "@/utils/timeOptions";
import { userMemberShip } from '@api/user';
import exportExcel from '@/utils/newToExcel';
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
      member_vips:[],
      modal_loading: false,
      options: timeOptions,
      modal: false,
      formItem: {
        id:0,
        status: "1",
        msg: "",
        type:1,
      },
      modals: false,
      total: 0,
      cardLists: [],
      loading: false,
      columns: [

        {
          title: "ID",
          key: "id",
          width: 80,
        },
        {
          title: "用户id",
          key: "uid",

        },
        {
          title: "业务员id",
          key: "business_id",

        },
        {
          title: "凭证",
          slot: "imgurl",

        },
        {
          title: "审核状态",
          slot: "status",
        },
        {
          title: "拒绝原因",
          key: "msg",
        },
        {
          title: "添加时间",
          key: "addtime",
        },

        {
          title: "操作",
          slot: "createModalFrame",
          fixed: "right",
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
            title: "审核中",
            value: 0,
          },
          {
            title: "已通过",
            value: 1,
          },
          {
            title: "拒绝",
            value: 2,
          },
        ],
      },
      formValidate: {
        status:'',
        id:"",
        uid:'',
        page: 1,
        limit: 20,
      },
      extractStatistics: {},
      timeVal: [],
      FromData: null,
      extractId: 0,
      checkUidList:[],
      isAll: 0,
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
    // 点击发送优惠券
    onSend() {
      if (this.checkUidList.length === 0 && this.isAll==0) {
        return this.$Message.warning("请选择要批量审核的任务");
      }
      this.formItem.id = this.checkUidList
      this.formItem.type=2
      this.modal = true;
    },
    checkboxItem(e){

      if (e.row.status===0){

        let uid = parseInt(e.rowid);
        let index = this.checkUidList.indexOf(uid);
        if(index !== -1){
          this.checkUidList = this.checkUidList.filter((item)=> item !== uid);
        }else{
          this.checkUidList.push(uid);
        }
      }

    },
    checkboxAll(){
      // 获取选中当前值
      let obj2 = this.$refs.xTable.getCheckboxRecords(true);
      // 获取之前选中值
      let obj = this.$refs.xTable.getCheckboxReserveRecords(true);
      if(this.isAll == 0 && this.checkUidList.length <= obj.length && !this.isCheckBox){
        obj = [];
      }
      obj = obj.concat(obj2);

      let uids = [];
      obj.forEach((item)=>{
        if(item.status===0){
          uids.push(parseInt(item.id))
        }
      })
      this.checkUidList = uids;

      if(!obj2.length){
        this.isCheckBox = false;
      }
    },
    allPages(e){
      this.isAll = e;
      if(e==0){
        this.$refs.xTable.toggleAllCheckboxRow();
        // this.checkboxAll();
      }else{
        if(!this.isCheckBox){
          this.$refs.xTable.setAllCheckboxRow(true);
          this.isCheckBox = true;
          this.isAll = 1;
        }else{
          this.$refs.xTable.setAllCheckboxRow(false);
          this.isCheckBox = false;
          this.isAll = 0;
        }
        this.checkUidList = []
      }
    },
    //审核
    examine(row) {
      this.modal = true;
      this.formItem.id = row.id;
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
    //审核提交
    ok() {
      if (this.formItem.status === 2) {
        if (this.formItem.message === "") {
          this.$Message.error("请填写拒绝原因");
          return;
        }
      }
      let  taskApi
      if(this.formItem.type===1){
        taskApi = userTaskViewApi
      }else{
        taskApi = userTaskListViewApi
      }
      taskApi(this.formItem)
          .then((res) => {
            this.$Message.success(res.msg);
            this.formItem = {
              id:0,
              status: "1",
              msg: "",
              type: 1
            };
            this.modal = false;
            this.getList();
          })
          .catch((err) => {
            this.$Message.error(err.msg);
            this.modal = false;
          });
    },
    // 取消按钮
    cancel() {
      this.formItem = {
        type: 1,
        msg: "",
        id:0,
      };
      this.modal = false;
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
    reset(){
      this.formValidate = {
        status: "",
        page: 1,
        limit: 20
      };
      this.timeVal = [];
      // this.$refs.formValidate.resetFields()
      this.getList();
    },
    // 列表
    getList() {
      this.loading = true;
      userTaskListApi(this.formValidate)
          .then(async (res) => {
            let data = res.data;
            this.tabList = data.list;
            this.total = data.count;
            this.loading = false;

          });
    },
    pageChange(index) {
      console.log(index);
      this.formValidate.page = index.currentPage;
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
  //width: 100%;
  //height: auto;
  //cursor: zoom-in; /* 添加放大镜图标 */
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
