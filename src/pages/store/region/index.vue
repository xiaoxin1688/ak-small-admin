<template>
<!-- 商品-商品参数 -->
    <div>
        <Card :bordered="false" dis-hover class="ivu-mt" :padding="0">
			<div class="new_card_pd">
				<!-- 筛选条件 -->
				<Form
				ref="regionFrom"
				inline
				:model="regionFrom"
				:label-width="labelWidth"
				:label-position="labelPosition"
				@submit.native.prevent
				>
					<FormItem label="是否隔离：">
						<Select
						v-model="regionFrom.is_alone"
						placeholder="请选择"
						clearable
						@on-change="searchs"
						class="input-add"
						>
							<Option value="1">开启</Option>
							<Option value="0">关闭</Option>
						</Select>
					</FormItem>
					<FormItem label="区域信息：">
						<Input
						  v-model="regionFrom.name"
						  placeholder="请输入区域名称/ID"
						  class="input-add mr14"
						></Input>
						<Button type="primary" class="mr14" @click="searchs">查询</Button>
						<Button @click="reset">重置</Button>
					</FormItem>
				</Form>
			</div>
        </Card>
        <Card :bordered="false" dis-hover class="ivu-mt">
            <!-- 相关操作 -->
            <Button type="primary" @click="add">添加区域</Button>
            <!-- 区域列表表格 -->
            <Table :columns="columns" :data="list" ref="table" class="mt25"
                   :loading="loading" highlight-row
                   no-userFrom-text="暂无数据"
                   no-filtered-userFrom-text="暂无筛选结果">
                <template slot-scope="{ row, index }" slot="is_alone">
                  <i-switch
                      v-model="row.is_alone"
                      :true-value="1"
                      :false-value="0"
                      size="large"
                      @on-change="showChange(row)"
                  >
                    <span slot="open">开启</span>
                    <span slot="close">关闭</span>
                  </i-switch>
                </template>
                <template slot-scope="{ row, index }" slot="action">
					<a @click="lookStore(row.id)">查看门店</a>
					<Divider type="vertical" />
                    <a @click="edit(row.id)">编辑</a>
                    <Divider type="vertical" />
                    <a @click="del(row,'删除区域',index)">删除</a>
                </template>
            </Table>
            <div class="acea-row row-right page">
                <Page :total="total" show-elevator show-total @on-change="pageChange"
                      :page-size="regionFrom.limit"/>
            </div>
        </Card>
		<Modal v-model="storeModals" title="区域门店" footerHide  scrollable width="900" @on-cancel="cancelStore">
		  <store-list ref="storelist" :region='regionId' v-if="storeModals"></store-list>
		</Modal>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { getRegionList, putRegionSetAlone} from '@/api/store';
    import Setting from '@/setting';
	import storeList from "@/components/storeList";
    export default {
        name: "regionList",
		components: {
			storeList
		},
        data() {
            return {
                roterPre: Setting.roterPre,
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
                        title: 'ID',
                        key: 'id',
                        width: 80
                    },
                    {
                        title: '区域名称',
                        key: 'name',
                        minWidth: 100
                    },
					{
					    title: '区域范围',
					    key: 'recommend_region',
					    minWidth: 100
					},
                    {
                        title: '排序',
                        key: 'sort',
                        minWidth: 50
                    },
                    {
                        title: '是否隔离',
                        slot: 'is_alone',
                        minWidth: 50
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        fixed: 'right',
                        width: 170
                    }
                ],
                regionFrom: {
                    page: 1,
                    limit: 15,
					is_alone:'',
					name:''
                },
                list: [],
                total:0,
				storeModals: false,
				regionId:0 //区域id
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
            }
        },
        created () {
            this.getList();
        },
        methods:{
			showChange(row){
				putRegionSetAlone(row.id,row.is_alone).then(res=>{
					this.$Message.success(res.msg);
					this.getList();
				}).catch(err=>{
					this.$Message.error(err.msg);
				})
			},
			reset(){
				this.regionFrom.page = 1;
				this.regionFrom.is_alone = '';
				this.regionFrom.name = '';
				this.getList();
			},
			searchs(){
				this.regionFrom.page = 1;
				this.getList();
			},
            // 单位列表
            getList () {
                this.loading = true;
                getRegionList(this.regionFrom).then(res => {
                    let data = res.data;
                    this.list = data.list;
                    this.total = data.count;
                    this.loading = false;
                }).catch(err => {
                    this.loading = false;
                    this.$Message.error(err.msg);
                })
            },
            pageChange (index) {
                this.regionFrom.page = index;
                this.getList();
            },
			//关闭门店弹窗
			cancelStore(){
			  this.storeModals = false;
			},
			lookStore(id){
				this.regionId = id;
				this.storeModals = true;
			},
			// 添加
			add(){
			   this.$router.push({ path: this.roterPre + "/store/region/create" });
			},
            //修改
            edit(id){
				this.$router.push({ path: this.roterPre + "/store/region/create/" + id });
			},
            // 删除
            del (row, tit, num) {
                let delfromData = {
                    title: tit,
                    num: num,
                    url: `store/region/${row.id}`,
                    method: 'DELETE',
                    ids: ''
                };
                this.$modalSure(delfromData).then((res) => {
                    this.$Message.success(res.msg);
                    this.list.splice(num, 1);
					if (!this.list.length) {
					  this.regionFrom.page =
					    this.regionFrom.page == 1 ? 1 : this.regionFrom.page - 1;
					}
					this.getList();
                }).catch(err => {
                    this.$Message.error(err.msg);
                });
            }
        }
    }
</script>

<style scoped lang="stylus">
.input-add {
	width: 250px;
	margin-right:14px;
}
</style>