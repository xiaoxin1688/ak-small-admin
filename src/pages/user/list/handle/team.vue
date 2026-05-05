<template>
  <div class="container">
    <!-- 查询框 -->
    <Card :bordered="false" dis-hover class="ivu-mt" :padding="0">
      <div class="padding-add">
        <Row :gutter="24">
          <Col span="8">
            <Select
                v-model="userFrom.sex"
                placeholder="类型"
                clearable
                class="input-add"
            >
              <Option value="1">团队</Option>
              <Option value="2">群主</Option>
            </Select>
          </Col>
          <Col span="8">
            <Input
                v-model="userFrom.nickname"
                placeholder="搜索用户名称"
                element-id="nickname"
                clearable
                class="input-add"
            ></Input>
          </Col>
          <Col span="8">
            <DatePicker :editable="false" @on-change="onchangeTime" :value="timeVal" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="自定义时间" class="width20"></DatePicker>
          </Col>
        </Row>

        <Row :gutter="24" style="margin-top: 10px">
          <Col span="8">
            <Select
                v-model="userFrom.sex"
                placeholder="vip类型"
                clearable
                class="input-add"
            >
              <Option value="0">请选择</Option>
              <Option value="1">未过期</Option>
              <Option value="2">一周内到期</Option>
              <Option value="3">已到期</Option>
            </Select>
          </Col>
          <Col span="8">
            <Select
                v-model="userFrom.sex"
                placeholder="到期会员"
                clearable
                class="input-add"
            >
              <Option value="0">请选择</Option>
              <Option value="1">未过期</Option>
              <Option value="2">一周内到期</Option>
              <Option value="3">已到期</Option>
            </Select>
          </Col>
          <Col span="6" class="ivu-text-right userFrom">
            <Button type="primary" label="default" class="mr15">搜索</Button>
            <Button class="ResetSearch" @click="resetSearch">重置</Button>
          </Col>
        </Row>
      </div>
    </Card>
    <Table :columns="columns" :data="teamList"
           ref="table"
           :loading="loading"
           no-userFrom-text="暂无数据"
           no-filtered-userFrom-text="暂无筛选结果"
    >
      <template slot-scope="{ row }" slot="coupon_price">
        <span v-if="row.coupon_type==1">{{row.coupon_price}}元</span>
        <span v-if="row.coupon_type==2">{{parseFloat(row.coupon_price)/10}}折（{{row.coupon_price.toString().split(".")[0]}}%）</span>
      </template>
      <template slot-scope="{ row }" slot="source">
        <div v-if="row.brokerage_type===1">下级会员{{row.nickname}}购买会员返佣金</div>
        <div  v-else-if="row.brokerage_type===2">
          下级群成员{{row.nickname}}购买会员返佣金</div>
        <div  v-else-if="row.brokerage_type===3">
          下级群成员{{row.nickname}}购买商品返佣金</div>
        <div v-else>
          <span  v-if="row.uid===userId"> 每日佣金返佣</span>
          <span  v-else>
                              下级会员{{row.nickname}}每日佣金返佣
                            </span>
        </div>
      </template>
      <template slot-scope="{ row }" slot="brokerage_pice">
        <span  v-if="row.uid===userId">+{{row.brokerage_pice}}</span>
        <span  v-if="row.one_uid===userId">+{{row.one_brokerage}}</span>
        <span  v-if="row.two_uid===userId">+{{row.two_brokerage}}</span>
        <span  v-if="row.three_uid===userId">+{{row.three_brokerage}}</span>
      </template>
      <template slot-scope="{ row }" slot="update_member_time">
        <span> {{row.update_member_time|formatDate}}</span>
      </template>
      <template slot-scope="{ row }" slot="product">
        <div class="product">
          <div class="image" v-viewer>
            <img v-lazy="row.image">
          </div>
          <div class="title">{{ row.store_name }}</div>
        </div>
      </template>
    </Table>
    <div class="acea-row row-right page">
      <Page :total="total" :current.sync="userFrom.page" show-elevator show-total @on-change="pageChange" :page-size="userFrom.limit"  />
    </div>
<!--    &lt;!&ndash; 渲染主节点 &ndash;&gt;-->
<!--    <div v-for="(item, index) in filteredData" :key="item.uid" class="item">-->
<!--      <div @click="toggle(item.uid)">-->
<!--        <span class="item-text">-->
<!--          <span v-if="item.udata && item.udata.length > 0" class="toggle-icon">-->
<!--            {{ isExpanded(item.uid) ? '-' : '+' }}-->
<!--          </span>-->
<!--          {{ item.nickname }} (UID: {{ item.uid }})-->
<!--        </span>-->
<!--      </div>-->

<!--      &lt;!&ndash; 渲染下级节点 &ndash;&gt;-->
<!--      <div v-if="isExpanded(item.uid)" class="nested-item">-->
<!--        <div v-for="(subItem, subIndex) in item.udata" :key="subItem.uid">-->
<!--          <div @click="toggle(subItem.uid)">-->
<!--            <span class="item-text">-->
<!--              <span v-if="subItem.udata && subItem.udata.length > 0" class="toggle-icon">-->
<!--                {{ isExpanded(subItem.uid) ? '-' : '+' }}-->
<!--              </span>-->
<!--              {{ subItem.nickname }} (UID: {{ subItem.uid }})-->
<!--            </span>-->
<!--          </div>-->

<!--          &lt;!&ndash; 渲染下级的下级节点 &ndash;&gt;-->
<!--          <div v-if="isExpanded(subItem.uid)" class="nested-item">-->
<!--            <div v-for="(subSubItem, subSubIndex) in subItem.udata" :key="subSubItem.uid">-->
<!--              <span class="item-text">{{ subSubItem.nickname }} (UID: {{ subSubItem.uid }})</span>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    TeamData: {
      type: Array, // 修改为接受数组
      required: true
    },
  },
  data() {
    return {
      teamList:[],
      columns:[
        {
          title: '推荐人ID',
          key: 'spread_uid',
          minWidth: 120
        },
        {
          title: '推荐人',
          key: 'nickname',
          minWidth: 120,
          render: (h, params) => {
            return h('div', [
              h('img', {
                style: {
                  borderRadius: '50%',
                  marginRight: '10px',
                  verticalAlign: 'middle'
                },
                attrs: {
                  with: 38,
                  height: 38
                },
                directives: [
                  {
                    name: 'lazy',
                    value: params.row.avatar
                  },
                  {
                    name: 'viewer'
                  }
                ]
              }),
              h('span', {
                style: {
                  verticalAlign: 'middle'
                }
              }, params.row.nickname)
            ]);
          }
        },
        {
          title: '变更方式',
          key: 'type',
          minWidth: 120
        },
        {
          title: '变更时间',
          key: 'spread_time',
          minWidth: 120
        }
      ],
      userFrom: {
        type: 'info',
        page: 1, // 当前页
        limit: 12 // 每页显示条数
      },
      total: 0,
      timeVal: [],
      data: [], // 存储从服务器获取的数据
      expanded: [],
      searchQuery: {
        nickname: '',
        vipType: '',
        isExpired: '',
        startDate: '',
        endDate: ''
      },
      filteredData: this.TeamData // 存储筛选后的数据
    };
  },
  mounted() {
    console.log(2222,this.TeamData);
  //  this.fetchData(); // 在组件加载时发起数据请求
  },
  methods: {
    pageChange (index) {
      this.userFrom.page = index

    },
    // 请求数据
    fetchData() {
      axios.get('https://your-api-endpoint.com/api/users')  // 替换为实际的API地址
          .then(response => {
            this.data = response.data;  // 假设接口返回的数据格式为数组
            this.filteredData = this.data; // 默认将数据赋给filteredData
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
    },

    // 选择时间
    onchangeTime(e) {
      this.timeVal = e;
    },

    // 切换展开状态
    toggle(uid) {
      const index = this.expanded.indexOf(uid);
      if (index === -1) {
        this.expanded.push(uid); // 展开该节点
      } else {
        this.expanded.splice(index, 1); // 收起该节点
      }
    },

    isExpanded(uid) {
      return this.expanded.includes(uid);
    },

    // 执行查询
    applySearch() {
      this.filteredData = this.data.filter(item => this.matchesSearch(item));

      // 对嵌套子项进行递归查询
      this.filteredData.forEach(item => {
        item.udata = item.udata.filter(subItem => this.matchesSearch(subItem));
        item.udata.forEach(subItem => {
          subItem.udata = subItem.udata.filter(subSubItem => this.matchesSearch(subSubItem));
        });
      });
    },

    // 判断一个项是否符合查询条件
    matchesSearch(item) {
      const { nickname, vipType, isExpired, startDate, endDate } = this.searchQuery;

      // 检查名称是否匹配
      const matchesName = nickname ? item.nickname.includes(nickname) : true;

      // 检查VIP类型是否匹配
      const matchesVipType = vipType ? item.vipType === vipType : true;

      // 检查过期类型是否匹配
      const matchesExpired = isExpired ? item.isExpired === isExpired : true;

      // 检查时间范围是否匹配
      const matchesDateRange =
          (startDate ? item.createdAt >= startDate : true) &&
          (endDate ? item.createdAt <= endDate : true);

      return matchesName && matchesVipType && matchesExpired && matchesDateRange;
    },

    // 重置查询
    resetSearch() {
      this.userFrom.nickname = '';
      this.userFrom.sex = 1;
      this.timeVal = [];
      this.filteredData = this.data; // 重置为原始数据
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
}

.search-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input, .search-select {
  padding: 5px 10px;
  font-size: 14px;
}

.search-button {
  padding: 5px 10px;
  background-color: #007aff;
  color: white;
  border: none;
  cursor: pointer;
}

.search-button:hover {
  background-color: #005bb5;
}

.item {
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
}

.item-text {
  font-size: 16px;
  color: #333;
  cursor: pointer;
}

.item-text:hover {
  color: #007aff;
}

.toggle-icon {
  margin-right: 10px;
  font-weight: bold;
  color: #007aff;
}

.nested-item {
  margin-left: 20px;
}

.search-input {
  width: 150px;
}

.search-select {
  width: 120px;
}
</style>
