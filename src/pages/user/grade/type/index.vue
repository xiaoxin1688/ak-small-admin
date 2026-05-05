<template>
  <!-- 用户-付费会员-会员类型 -->
  <div>
    <Card :bordered="false" dis-hover class="ivu-mt">
      <Button type="primary" @click="addType">添加类型</Button>
      <!-- 会员类型表格 -->
      <Table
          class="mt25"
          :columns="thead"
          :data="tbody"
          :loading="loading"
          highlight-row
          no-userFrom-text="暂无数据"
          no-filtered-userFrom-text="暂无筛选结果"
      >
        <template slot-scope="{ row }" slot="is_del">
          <i-switch
              v-model="row.is_del"
              :value="row.is_del"
              :true-value="0"
              :false-value="1"
              @on-change="onchangeIsDel(row)"
              size="large"
          >
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </template>
        <template slot-scope="{ row }" slot="is_show">
          <i-switch
              v-model="row.is_show"
              :value="row.is_show"
              :true-value="1"
              :false-value="0"
              @on-change="onchangeIsShow(row)"
              size="large"
          >
            <span slot="open">显示</span>
            <span slot="close">隐藏</span>
          </i-switch>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <a href="javascript:" @click="editType(row)">编辑</a>
          <Divider
              type="vertical"
              v-if="row.type !== 'free' && row.type !== 'ever'"
          />
          <a
              v-if="row.type !== 'free' && row.type !== 'ever'"
              href="javascript:"
              @click="del(row, '删除类型', index)"
          >删除</a
          >
        </template>
      </Table>
    </Card>
    <Modal
        v-model="modal"
        :title="`${rowModelType}${rowEdit && rowEdit.title}会员`"
        footer-hide
        @on-cancel="cancel"
    >
      <form-create
          v-model="fapi"
          :rule="rule"
          @on-submit="onSubmit"
      ></form-create>
    </Modal>
  </div>
</template>

<script>
import {
  userMemberShip,
  memberShipSave,
  memberCard,
  deleteCard, showMemberCard
} from '@/api/user';

export default {
  name: "list",
  data() {
    return {
      thead: [
        {
          title: "ID",
          key: "id",
          maxWidth: 60
        },
        {
          title: "会员名",
          key: "title",
        },
        {
          title: "有限期（天）",
          key: "vip_day",
          render: (h, params) => {
            return h(
                "span",
                params.row.vip_day === -1 ? "永久" : params.row.vip_day
            );
          },
        },
        {
          title: "划线价",
          key: "price",
        },
        {
          title: "优惠价",
          key: "pre_price",
        },
        {
          title: "排序",
          key: "sort",
        },
        {
          title: "是否开启",
          slot: "is_del",
        },
        {
          title: "是否显示",
          slot: "is_show",
        },
        {
          title: "操作",
          slot: "action",
        },
      ],
      tbody: [],
      loading: false,
      modal: false,
      rowEdit: {},
      rowModelType: "编辑",
      rule: [
        {
          type: "hidden",
          field: "id",
          value: "",
        },
        {
          type: "hidden",
          field: "type",
          value: "",
        },
        {
          type: "input",
          field: "title",
          title: "会员名",
          value: "",
          props: {
            disabled: false,
            required: true
          },
          validate: [
            {
              type: "string",
              max: 100,
              min: 1,
              message: "请输入长度为1-100的名称",
              requred: true,
            },
          ],
        },
        {
          type: "InputNumber",
          field: "vip_day",
          title: "有限期（天）",
          value: null,
          props: {
            precision: 0,
            disabled: false,
            type: "text",
            required: true
          },
          validate: [
            {
              type: "number",
              max: 1000000,
              min: 0,
              message: "最大只能输入1000000,最小为0",
              requred: true,
            },
          ],
        },
        {
          type: "InputNumber",
          field: "price",
          title: "划线价",
          value: null,
          props: {
            min: 0,
            disabled: false,
            required: true
          },
          validate: [
            {
              type: "number",
              max: 1000000000,
              min: 0,
              message: "最大只能输入1000000000,最小为0",
              requred: true,
            },
          ],
        },
        {
          type: "InputNumber",
          field: "pre_price",
          title: "优惠价",
          value: null,
          props: {
            min: 0,
            disabled: false,
            required: true
          },
          validate: [
            {
              type: "number",
              max: 1000000000,
              min: 0,
              message: "最大只能输入1000000000,最小为0.01",
              requred: true,
            },
          ],
        },
        {
          type: "InputNumber",
          field: "sort",
          title: "排序",
          value: 0,
          props: {
            precision: 0,
            min: 1,
            max: 1000000,
            disabled: false,
          },
          validate: [
            {
              type: "number",
              max: 1000000,
              min: 0,
              message: "最大只能输入1000000,最小为0",
              requred: true,
            },
          ],
        },
        {
          type: "InputNumber",
          field: "rebate",
          title: " 佣金",
          value: 0,
          props: {
            precision: 2,
            min: 0,
            max: 1000000000,
            disabled: false,
          },
          validate: [
            {
              type: "number",
              max: 1000000000,
              min: 0,
              message: "最大只能输入1000000000,最小为1",
              requred: true,
            },
          ],
        },
        {
          type: "InputNumber",
          field: "give_away_time",
          title: "多少天送一次",
          value: 0,
          props: {
            precision: 0,
            min: 0,
            max: 1000000,
            disabled: false,
          },
          validate: [
            {
              type: "number",
              max: 1000000,
              min: 0,
              message: "最大只能输入1000000,最小为0",
              requred: true,
            },
          ],
        },
        {
          type: "InputNumber",
          field: "coupon_price",
          title: "优惠券id",
          value: 0,
          props: {
            precision: 0,
            min: 0,
            max: 1000000,
            disabled: false,
          },
          validate: [
            {
              type: "number",
              max: 1000000,
              min: 0,
              message: "最大只能输入1000000,最小为0",
              requred: true,
            },
          ],
        },
        {
          type: "radio",
          field: "give_away",
          title: "开启优惠卷赠送 ",
          value: 0,
          options:[
            {value:1,label:"是"},
            {value:0,label:"否"},
          ],
        },
        {
          type: "radio",
          field: "auto_type",
          title: "开启自动领取佣金 ",
          value: 0,
          options:[
            {value:1,label:"自动"},
            {value:0,label:"手动"},
          ],
        },
        {
          type: "radio",
          field: "expired_offer",
          title: "开启到期优惠",
          value: 0,
          options:[
            {value:1,label:"开"},
            {value:0,label:"关"},
          ],
        },
        {
          type: "InputNumber",
          field: "expired_day",
          title: " 临近几天开启",
          value: 0,
          props: {
            precision: 0,
            min: 0,
            max: 1000000,
            disabled: false,
          },
          validate: [
            {
              type: "number",
              max: 1000000,
              min: 0,
              message: "最大只能输入1000000,最小为0",
              requred: true,
            },
          ],
        },
        {
          type: "InputNumber",
          field: "upgrade_coupon",
          title: " 升级优惠额度",
          value: 0,
          props: {
            precision: 0,
            min: 0,
            max: 1000000,
            disabled: false,
          },
          validate: [
            {
              type: "number",
              max: 1000000,
              min: 0,
              message: "最大只能输入1000000,最小为0",
              requred: true,
            },
          ],
        },
        {
          type: "radio",
          field: "is_label",
          title: "特惠标签",
          value: 0,
          options:[
            {value:1,label:"是"},
            {value:0,label:"否"},
          ],
        },
        {
          type: "InputNumber",
          field: "coupon_offer",
          title: " 优惠券提现折扣",
          value: 0,
          props: {
            precision: 0,
            min: 0,
            max: 100,
            disabled: false,
          },
          validate: [
            {
              type: "number",
              max: 100,
              min: 0,
              message: "最大只能输入100,最小为1",
              requred: true,
            },
          ],
        },
        {
          type: "radio",
          field: "difference_off",
          title: "是否补差价 ",
          value: 0,
          options:[
            {value:1,label:"是"},
            {value:0,label:"否"},
          ],
        },
        {
          type: "radio",
          field: "is_task_work",
          title: "是否做任务",
          value: 0,
          options:[
            {value:1,label:"是"},
            {value:0,label:"否"},
          ],
        },
        {
          type: "InputNumber",
          field: "sign_money",
          title: " 签到金额",
          value: 0,
          props: {
            precision: 2,
            min: 0,
            max: 100000000,
            disabled: false,
          },
          validate: [
            {
              type: "number",
              max: 100000000,
              min: 0,
              message: "最大只能输入100000000,最小为0",
              requred: true,
            },
          ],
        },
        {
          type: "InputNumber",
          field: "exp_prcie",
          title: " 每日预期",
          value: 0,
          props: {
            precision: 2,
            min: 0,
            max: 100000000,
            disabled: false,
          },
          validate: [
            {
              type: "number",
              max: 100000000,
              min: 0,
              message: "最大只能输入100000000,最小为0",
              requred: true,
            },
          ],
        },
        {
          type: "InputNumber",
          field: "war_range",
          title: "  警告百分比",
          value: 0,
          props: {
            precision: 0,
            min: 0,
            max: 100000000,
            disabled: false,
          },
          validate: [
            {
              type: "number",
              max: 100000000,
              min: 0,
              message: "最大只能输入100000000,最小为0",
              requred: true,
            },
          ],
        },
        {
          type: "InputNumber",
          field: "withdrawal",
          title: "最低提现",
          value: 0,
          props: {
            precision: 2,
            min: 0,
            max: 100000000,
            disabled: false,
          },
          validate: [
            {
              type: "number",
              max: 100000000,
              min: 0,
              message: "最大只能输入100000000,最小为0",
              requred: true,
            },
          ],
        },
        {
          type: "radio",
          field: "showmember",
          title: "是否开启推广显示 ",
          value: 0,
          options:[
            {value:1,label:"是"},
            {value:0,label:"否"},
          ],
        },
        {
          type: "input",
          field: "showmemberids",
          title: "推广UID",
          value: "",
          props: {
            width: "300px",
            style: {
              width: "300px"  // 设置宽度为300像素
            }
          }

        },
        {
          type: "radio",
          field: "is_buy",
          title: "是否购买 ",
          value: 0,
          options: [
            {value: 1, label: "是"},
            {value: 0, label: "否"},
          ],
        },
        {
          type: "InputNumber",
          field: "dayincome",
          title: "日收益 ",
          value: 0,
          props: {
            precision: 2,
            min: 0,
            max: 100000000,
            disabled: false,
          },
          validate: [
            {
              type: "number",
              max: 100000000,
              min: 0,
              message: "最大只能输入100000000,最小为0",
              requred: true,
            },
          ],
        },
        {
          type: "InputNumber",
          field: "monthincome",
          title: "月收益 ",
          value: 0,
          props: {
            precision: 2,
            min: 0,
            max: 100000000,
            disabled: false,
          },
          validate: [
            {
              type: "number",
              max: 100000000,
              min: 0,
              message: "最大只能输入100000000,最小为0",
              requred: true,
            },
          ],
        },
        {
          type: "InputNumber",
          field: "yearincome",
          title: "年收益 ",
          value: 0,
          props: {
            precision: 2,
            min: 0,
            max: 100000000,
            disabled: false,
          },
          validate: [
            {
              type: "number",
              max: 100000000,
              min: 0,
              message: "最大只能输入100000000,最小为0",
              requred: true,
            },
          ],
        },
        {
          type: "input",
          field: "group_id",
          title: "群主id",
          value: "",
          props: {
            disabled: false,
          },

        },
        {
          type: "checkbox",
          field: "withdraw_times",
          title: "提现限制时间",
          value: [], // 初始化为数组，因为多选会返回多个值
          options: [
            { value: 1, label: "周一" },
            { value: 2, label: "周二" },
            { value: 3, label: "周三" },
            { value: 4, label: "周四" },
            { value: 5, label: "周五" },
            { value: 6, label: "周六" },
            { value: 0, label: "周天" },
          ],
        }
      ],
      fapi: {
        id: "",
        pre_price: null,
        price: null,
        sort: null,
        title: "",
        type: "owner",
        vip_day: null,
      },
    };
  },
  created() {
    this.getMemberShip();
  },
  mounted() {
  },
  methods: {
    onchangeIsDel(row) {
      let data = {
        id: row.id,
        is_del: row.is_del,
      };
      memberCard(data)
          .then((res) => {
            this.$Message.success(res.msg);
            this.getMemberShip();
          })
          .catch((err) => {
            this.$Message.error(err.msg);
          });
    },
    onchangeIsShow(row) {
      let data = {
        card_id: row.id,
        is_show: row.is_show,
      };
      showMemberCard(data)
          .then((res) => {
            this.$Message.success(res.msg);
            this.getMemberShip();
          })
          .catch((err) => {
            this.$Message.error(err.msg);
          });
    },
    cancel() {
      this.fapi.resetFields();
    },
    getMemberShip() {
      this.loading = true;
      userMemberShip()
          .then((res) => {
            this.loading = false;
            const {count, list} = res.data;
            this.total = count;
            this.tbody = list;
          })
          .catch((err) => {
            this.loading = false;
            this.$Message.error(err.msg);
          });
    },
    addType() {
      this.rowEdit.id = 0;
      this.rowModelType = "新增";
      this.rule[1].value = "owner";
      this.rule[3].props.disabled = false;
      this.rule[5].props.disabled = false;
      this.rowEdit.title = "";
      // this.cancel();
      this.modal = true;
    },
    del(row, tit, num) {
      let delfromData = {
        title: tit,
        num: num,
        url: `user/member_ship/delete/${row.id}`,
        method: "DELETE",
        ids: "",
      };
      this.$modalSure(delfromData)
          .then((res) => {
            this.$Message.success(res.msg);
            this.getMemberShip();
          })
          .catch((res) => {
            this.$Message.error(res.msg);
          });
    },
    editType(row) {
      this.rule.forEach((item) => {
        for (const key in row) {
          if (row.hasOwnProperty(key)) {
            if (item.field === key) {
              if (key === "vip_day") {
                if (row[key] === -1 || row[key] == "永久") {
                  item.type = "Input";
                  item.props.disabled = true;
                  item.validate = [
                    {type: "string", message: "", requred: true},
                  ];
                  row[key] = "永久";
                } else {
                  item.type = "InputNumber";
                  item.props.disabled = false;
                  item.props.min = 1;
                  item.validate = [
                    {
                      type: "number",
                      max: 10000000000,
                      min: 0,
                      message: "最大只能输入10000000000,最小为0",
                      requred: true,
                    },
                  ];
                }
              }

              if (["withdraw_times"].includes(key)) {
                row[key] = row[key].map(Number);
              }
              if (["price"].includes(key)) {

                row[key] = parseFloat(row[key]);
              }
              if (["pre_price"].includes(key)) {
                row[key] = parseFloat(row[key]);
                if (row.type == 'free') {
                  item.props.disabled = true;
                  item.validate = [];
                } else {
                  item.props.disabled = false;
                  item.validate = [
                    {
                      type: "number",
                      max: 10000000000,
                      min: 0.01,
                      message: "最大只能输入10000000000,最小为0.01",
                      requred: true,
                    },
                  ];
                }
              }
              item.value = row[key];
            }
          }
        }
      });
      this.rowModelType = "编辑";
      this.rowEdit = JSON.parse(JSON.stringify(row));
      this.modal = true;
    },
    onSubmit(formData) {

      memberShipSave(this.rowEdit.id, formData)
          .then((res) => {
            this.modal = false;
            this.$Message.success(res.msg);
            this.getMemberShip();
            this.cancel();
          })
          .catch((err) => {
            this.$Message.error(err.msg);
          });
    },
  },
};
</script>
<style scoped lang="stylus">
/deep/ .ivu-modal {
  top: 20% !important;
}

/deep/ .ivu-input {
  width: 300px;
}
</style>
