<template>
  <!-- 积分-积分分类 -->
  <div>
<!--    <Card :bordered="false" dis-hover class="ivu-mt" :padding="0">-->
<!--      <div class="new_card_pd">-->
<!--        &lt;!&ndash; 筛选条件 &ndash;&gt;-->
<!--        <Form-->
<!--            ref="sortFrom"-->
<!--            inline-->
<!--            :model="sortFrom"-->
<!--            :label-width="labelWidth"-->
<!--            :label-position="labelPosition"-->
<!--            @submit.native.prevent-->
<!--        >-->
<!--          <Row :gutter="24" type="flex" justify="end">-->
<!--            <Col span="24">-->
<!--              <FormItem label="分类状态："  label-for="is_show">-->
<!--                <Select v-model="sortFrom.is_show" placeholder="请选择" clearable  @on-change="sortSearchs"  class="input-add">-->
<!--                  <Option value="1">显示</Option>-->
<!--                  <Option value="0">隐藏</Option>-->
<!--                </Select>-->
<!--              </FormItem>-->
<!--              <FormItem label="分类名称：">-->
<!--                <Input-->
<!--                    v-model="sortFrom.name"-->
<!--                    placeholder="请输入分类名称"-->
<!--                    class="input-add"-->
<!--                ></Input>-->
<!--                <Button @click="sortSearchs" type="primary">查询</Button>-->
<!--              </FormItem>-->
<!--            </Col>-->
<!--          </Row>-->
<!--        </Form>-->
<!--      </div>-->
<!--    </Card>-->

    <Card :bordered="false" dis-hover class="ivu-mt">
      <!-- 相关操作 -->
      <Row type="flex">
        <Col v-bind="grid">
          <Button type="primary" @click="add"
          >添加红包</Button
          >
        </Col>
      </Row>
      <!-- 积分表格 -->
      <Table
          :columns="columns1"
          :data="list"
          ref="table"
          class="mt25"
          :loading="loading"
          highlight-row
          no-userFrom-text="暂无数据"
          no-filtered-userFrom-text="暂无筛选结果"
      >
        <template slot-scope="{ row, index }" slot="range">{{row.integral_min}} - {{row.integral_max}}</template>
        <template slot-scope="{ row, index }" slot="type">

           <div v-if="row.type===1">
             随机
           </div>
          <div v-else>
            固定平均
          </div>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <a @click="receive(row)">领取记录</a>
          <Divider type="vertical" />
          <a class="copy-btn" @click="copy(row.uincode)">复制</a>
          <Divider type="vertical" />
          <a @click="edit(row.id)">编辑</a>
          <Divider type="vertical" />
          <a @click="del(row, '删除单位', index)">删除</a>
        </template>
      </Table>
      <div class="acea-row row-right page">
        <Page
            :total="total"
            show-elevator
            show-total
            @on-change="pageChange"
            :page-size="sortFrom.limit"
        />
      </div>
    </Card>
    <!-- 领取记录 -->
    <Modal v-model="modals2" scrollable  footer-hide closable title="领取记录" :mask-closable="false"  width="700">
      <Table :columns="columns2" :data="receiveList" ref="table" class="mt25"
             :loading="loading2" highlight-row
             no-userFrom-text="暂无数据"
             no-filtered-userFrom-text="暂无筛选结果">
        <template slot-scope="{ row, index }" slot="type">

          <div v-if="row.type===1">
            随机
          </div>
          <div v-else>
            固定平均
          </div>
        </template>
        <template slot-scope="{ row, index }" slot="addtime">
          {{row.addtime|formatDate}}
        </template>
      </Table>
      <div class="acea-row row-right page">
        <Page :total="total2" show-elevator show-total @on-change="receivePageChange"
              :page-size="tableFrom.limit"/>
      </div>
    </Modal>


  </div>
</template>

<script>
import { mapState } from "vuex";
import Clipboard from 'clipboard';
import {
  integralCategory,
  integralCreate,
  integralCategoryEdit,
  categorySetShow,
  releasedissueLogApi, integralProductListApi
} from '@/api/marketing';
import { formatDate } from '@/utils/validate';
export default {
  name: "user_group",
  filters: {
    formatDate (time) {
      if (time !== 0) {
        let date = new Date(time * 1000);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    }
  },
  data() {
    return {
      modals2: false,
      receiveList: [],
      loading2: false,
      total2: 0,
      tableFrom: {
        integral_time: "",
        is_show: "",
        store_name: "",
        page: 1,
        limit: 15,
        rid:0,
      },
      rows: {},
      columns2: [
        {
          title: "ID",
          key: "id",
          width: 80,
        },
        {
          title: "用户id",
          key: "uid",
          minWidth: 90,
        },
        {
          title: "红包id",
          key: "rid",
          minWidth: 130,
        },
        {
          title: "金额",
          key: "amount",
          minWidth: 100,
        },

        {
          title: "类型",
          slot: "type",
          minWidth: 100,
        },
        {
          title: "领取时间",
          slot: "addtime",
          minWidth: 130,
        },
        {
          title: "业务员id",
          key: "business_id",
          minWidth: 100,
        },
        {
          title: "发起人",
          key: "business_id",
          minWidth: 100,
        },
      ],
      clipboard: null,
      site_url:'',
      grid: {
        xl: 7,
        lg: 7,
        md: 12,
        sm: 24,
        xs: 24,
      },
      loading: false,
      columns1: [
        {
          title: "ID",
          key: "id",
          width: 80,
        },
        {
          title: "数量",
          key: "number",
          minWidth: 100,
        },
        {
          title: "金额",
          key: "amount",
          minWidth: 100,
        },

        {
          title: "已领取数量",
          key: "receive",
          minWidth: 100,
        },
        {
          title: "类型",
          slot: "type",
          minWidth: 100,
        },
        {
          title: "过期时间",
          key: "expired",
          minWidth: 100,
        },

        {
          title: "发起人",
          key: "business_id",
          minWidth: 100,
        },
        // {
        //   title: "排序",
        //   key: "sort",
        //   minWidth: 100,
        // },
        {
          title: "操作",
          slot: "action",
          width: 120,
        },
      ],
      sortFrom: {
        page: 1,
        limit: 15,
        name: "",
        is_show: '',
        rid:''
      },
      list: [],
      total: 0,
    };
  },
  computed: {
    ...mapState("admin/layout", ["isMobile"]),
    labelWidth() {
      return this.isMobile ? undefined : 85;
    },
    labelPosition() {
      return this.isMobile ? "top" : "right";
    },
  },
  created() {
    this.getList();
  },
  methods: {
    // 领取记录
    receive(row) {
      this.modals2 = true;
      this.rows = row;
      this.getReceivelist(row);
    },
    getReceivelist(row) {
      this.loading2 = true;
      this.tableFrom.rid = row.id
      integralProductListApi(this.tableFrom)
          .then(async (res) => {
            let data = res.data;
            this.receiveList = data.list;
            this.total2 = res.data.count;
            this.loading2 = false;
          })
          .catch((res) => {
            this.loading2 = false;
            this.$Message.error(res.msg);
          });
    },
    // 领取记录改变分页
    receivePageChange(index) {
      this.tableFrom.page = index;
      this.getReceivelist(this.rows);
    },
    copy(code){

      // let text = this.site_url+"/pages/activity/redPork/index?id="+code;
      let text = this.site_url+"/pages/activity/redPork/index?id="+code
      this.clipboard = new Clipboard('.copy-btn', {
        text: () => text
      });
      this.clipboard.on('success', (e) => {
        e.clearSelection();
        alert('文本已复制到剪贴板');
        this.clipboard.destroy();
      });
      this.clipboard.on('error', () => {
        alert('复制失败，请手动复制');
        this.clipboard.destroy();
      });
      this.clipboard.onClick();
    },
    sortSearchs() {
      this.sortFrom.page = 1;
      this.list = [];
      this.getList();
    },
    // 修改状态
    onchangeIsShow (row) {
      let data = {
        id: row.id,
        is_show: row.is_show
      }
      categorySetShow(data).then(async res => {
        this.$Message.success(res.msg);
        this.getList()
      }).catch(res => {
        this.$Message.error(res.msg);
      })
    },
    // 添加
    add() {
      this.$modalForm(integralCreate()).then(() => this.getList());
    },
    // 分类列表
    getList() {
      this.loading = true;
      integralCategory(this.sortFrom)
          .then((res) => {
            let data = res.data;
            this.list = data.list;
            this.total = data.count;
            this.site_url = data.site_url;
            this.loading = false;
          })
          .catch((err) => {
            this.loading = false;
            this.$Message.error(err.msg);
          });
    },
    pageChange(index) {
      this.sortFrom.page = index;
      this.getList();
    },
    //修改
    edit(id) {
      this.$modalForm(integralCategoryEdit(id)).then(() => this.getList());
    },
    // 删除
    del(row, tit, num) {
      let delfromData = {
        title: tit,
        num: num,
        url: `/marketing/integral/category/${row.id}`,
        method: "DELETE",
        ids: "",
      };
      this.$modalSure(delfromData)
          .then((res) => {
            this.$Message.success(res.msg);
            this.list.splice(num, 1);
            if (!this.list.length) {
              this.sortFrom.page =
                  this.sortFrom.page == 1 ? 1 : this.sortFrom.page - 1;
            }
            this.getList();
          })
          .catch((err) => {
            this.$Message.error(err.msg);
          });
    },
  },
};
</script>

<style scoped lang="stylus">
.input-add {
  width: 250px;
  margin-right:14px;
}
</style>
