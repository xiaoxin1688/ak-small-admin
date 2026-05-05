<template>
	<div>
		<div class="i-layout-page-header">
		  <PageHeader class="product_tabs" hidden-breadcrumb>
		    <div slot="title" class="acea-row row-middle">
		      <router-link :to="{ path: `${routerPre}/store/region/list` }">
		        <div class="font-sm after-line">
		          <span class="iconfont iconfanhui"></span>
		          <span class="pl10">返回</span>
		        </div>
		      </router-link>
		      <span v-text="$route.params.id ? '编辑区域' : '添加区域'" class="mr20 ml16"></span>
		    </div>
		  </PageHeader>
		</div>
		<Card :bordered="false" dis-hover :padding="16" class="ivu-mt">
			<Tabs v-model="currentTab">
				<TabPane :label="'基础信息'" name="1" />
				<TabPane :label="'添加门店'" name="2" />
			</Tabs>
			<Form ref="formItem" class="mt20" :model="formItem" :label-width="labelWidth" :label-position="labelPosition" :rules="ruleValidate" @submit.native.prevent>
				<Row type="flex" :gutter="24" v-show="currentTab == 1">
					<Col span="24">
					    <FormItem label="区域名称：" prop="name" label-for="name">
					        <Input v-model="formItem.name"  maxlength="20" show-word-limit  placeholder="请输入区域名称" class="inputW"/>
					    </FormItem>
					</Col>
					<Col span="24">
						<FormItem label="排序：" label-for="sort" prop="sort">
							<InputNumber :min="0" v-model="formItem.sort" class="inputW"></InputNumber>
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="区域隔离：" label-for="is_alone" prop="is_alone">
							<Switch size="large" v-model="formItem.is_alone" :false-value="0" :true-value="1">
								<span slot="open" :true-value="1">开启</span>
								<span slot="close" :false-value="0">关闭</span>
							</Switch>
						</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="推荐地区：" label-for="region" prop="region">
							<LazyCascader
							        v-model="formItem.recommend_region"
							        class="inputW"
							        :props="props"
							        collapse-tags
							        clearable
							        :filterable="false"
							        size="small"
							/>
						</FormItem>
					</Col>
				</Row>
				<div class="ml15" v-show="currentTab == 2">
					<Button type="primary" @click="addStore">添加门店</Button>
					<Table
					    :columns="columns"
					    :data="storesList"
						class="ivu-mt"
						highlight-row
						no-userFrom-text="暂无数据"
						no-filtered-userFrom-text="暂无筛选结果"
					>
					  <template slot-scope="{ row }" slot="image">
						<viewer>
							<img class="w-36 h-36" :src="row.image" />
						</viewer>
					  </template>
					  <template slot-scope="{ row, index }" slot="action">
					    <a @click="delte(index)">删除</a>
					  </template>
					</Table>
				</div>
			</Form>
		</Card>
		<Card :bordered="false" dis-hover class="fixed-card" :style="{left: `${!menuCollapse?'236px':isMobile?'0':'60px'}`}">
		  <Form>
		    <FormItem>
		      <Button v-if="currentTab !== '1'" @click="upTab">上一步</Button>
		      <Button
			      type="primary"
		          class="ml10"
		          v-if="Number(currentTab) < 2"
		          @click="downTab('formItem')"
		      >下一步</Button
		      >
		      <Button
		          type="primary"
		          class="ml10"
		          @click="handleSubmit('formItem')"
		          v-if="id || (!id && currentTab == 2)"
		      >保存</Button>
		    </FormItem>
		  </Form>
		</Card>
		<Modal v-model="storeModals" title="门店列表" footerHide  scrollable width="900" @on-cancel="cancelStore">
		  <store-list ref="storelist" :region='-1' @getStoreId="getStoreId" v-if="storeModals"></store-list>
		</Modal>
	</div>
</template>

<script>
	import { mapState,mapMutations } from "vuex";
	import Setting from "@/setting";
	import storeList from "@/components/storeList";
	import LazyCascader from '@/components/lazyCascader'
	import { cityData } from '@/api/setting';
	import { getRegionInfo, postRegion, getStoreResolveCity } from '@/api/store';
	const cacheAddress = {}
	export default{
		name: 'region',
		components: {
			storeList,
			LazyCascader
		},
		props: {},
		data () {
			return{
				routerPre: Setting.roterPre,
				id:0, //区域id
				currentTab:'1',
				formItem:{
					name:'',
					sort:0,
					is_alone:1,
					recommend_region:[], //推荐区域
					store_id:[]
				},
				recommend_region_id:[], // 禁止选择的区域
				recommend_region_id_all:[], //禁止选择的区域(包括父级)
				ruleValidate:{
					name: [
						{ required: true, message: '请输入区域名称', trigger: 'blur' }
					],
				},
				columns: [
				  {
				    title: "ID",
				    key: "id",
				    width: 60,
				  },
				  {
				    title: "门店图片",
				    slot: "image",
				    minWidth: 80,
				  },
				  {
				    title: "门店分类",
				    key: "cate_name",
				    minWidth: 80,
				  },
				  {
				    title: "门店名称",
				    key: "name",
				    minWidth: 100,
				  },
				  {
				    title: "联系电话",
				    key: "phone",
				    minWidth: 90,
				  },
				  {
				    title: "门店地址",
				    key: "address",
				    ellipsis: true,
				    minWidth: 150,
				  },
				  {
				    title: "营业时间",
				    key: "day_time",
				    minWidth: 120,
				  },
				  {
				    title: "营业状态",
				    key: "status_name",
				    minWidth: 80,
				  },
				  {
				    title: "操作",
				    slot: "action",
				    width: 60,
				  }
				],
				storesList:[],
				storeModals: false,
				props: {
				    children: 'children',
				    label: 'label',
				    value: 'value',
				    multiple: true,
				    lazy: true,
				    lazyLoad: this.lazyLoad,
				    checkStrictly: true
				},
			}
		},
		computed: {
			...mapState("admin/layout", ["isMobile","menuCollapse"]),
			labelWidth () {
				return this.isMobile ? undefined : 120;
			},
			labelPosition () {
				return this.isMobile ? 'top' : 'right';
			}
		},
		created(){
			this.id = this.$route.params.id || 0
			if(this.id){
				this.regionInfo();
			}
			this.storeResolveCity();
		},
		mounted(){
			this.setCopyrightShow({ value: false });
		},
		destroyed () {
		  this.setCopyrightShow({ value: true });
		},
		methods:{
			...mapMutations('admin/layout', [
			  'setCopyrightShow'
			]),
			//对象数组去重；
			unique(arr) {
			  const res = new Map();
			  return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1));
			},
			lazyLoad(node, resolve) {
			    const p = cityData({pid:node,level:2})
			    cacheAddress[node] = () => p
			    p.then(res => {
			    	let result = res.data.map(item => {
					  item.disabled = this.recommend_region_id_all.some(j => j === item.id);
			    	  item.disabledOpen = this.recommend_region_id.some(j => j === item.id);
			    	  item.leaf = !item.hasOwnProperty('children') || item.disabledOpen;
			    	  return item;
			    	});
			        cacheAddress[node] = () => new Promise((resolve1) => {
			            setTimeout(() => resolve1(res), 300)
			        })
			        resolve(result)
			    }).catch(res => {
			        this.$message.error(res.message)
			    })
			},
			//删除门店
			delte(index){
			  this.storesList.splice(index, 1)
			},
			//添加门店
			addStore(){
			  this.storeModals = true;
			},
			//关闭门店弹窗
			cancelStore(){
			  this.storeModals = false;
			},
			getStoreId (data) {
			  this.storeModals = false;
			  let list = this.storesList.concat(data);
			  let uni = this.unique(list);
			  this.storesList = uni;
			},
			// 上一页；
			upTab() {
				this.currentTab = (Number(this.currentTab) - 1).toString();
			},
			// 下一页；
			downTab(name) {
			  this.$refs[name].validate((valid) => {
			    if (valid) {
			      this.currentTab = (Number(this.currentTab) + 1).toString();
			    }else{
			      this.$Message.warning("请输入区域名称");
			    }
			  })
			},
			storeResolveCity(){
				getStoreResolveCity({
					region_id: this.id
				}).then(res=>{
					this.recommend_region_id = res.data.city;
					this.recommend_region_id_all = res.data.region;
				}).catch(err=>{
					this.$Message.error(err.msg);
				})
			},
			regionInfo(){
				getRegionInfo(this.id).then(res=>{
					this.formItem = res.data;
					this.storesList = res.data.stores;
				}).catch(err=>{
					this.$Message.error(err.msg);
				})
			},
			handleSubmit(name){
				this.$refs[name].validate((valid) => {
				  if (valid) {
					let storeId = []
					this.storesList.forEach(item=>{
					  storeId.push(item.id)
					})
					this.formItem.store_id = storeId;
				    postRegion(this.formItem,this.id)
				      .then((res) => {
				        this.$Message.success(res.msg);
				        this.$router.push({ path: this.routerPre + "/store/region/list" });
				      })
				      .catch((err) => {
				        this.$Message.error(err.msg);
				      });
				  } else {
				    this.$Message.error("请输入区域名称");
				  }
				});
			}
		}
	}
</script>

<style scoped lang="stylus">
	/deep/.lazy-cascader .lazy-cascader-input{
		padding:0 5px;
		line-height: 0;
		min-height: 32px;
	}
	/deep/.lazy-cascader .lazy-cascader-input > .lazy-cascader-placeholder{
		color: #ccc;
	}
	/deep/.lazy-cascader .lazy-cascader-input > .lazy-cascader-clear{
		line-height: 32px;
	}
	/deep/.ivu-tabs-nav .ivu-tabs-tab{
	  padding:4px 16px 20px !important;
	  font-weight: 500;
	}
	/deep/.el-input--suffix .el-input__inner{
		padding-left: 7px !important;
	}
	.inputW{
		width: 400px;
	}
	.fixed-card {
	    position: fixed;
	    right: 0;
	    bottom: 0;
	    left: 200px;
	    z-index: 45;
	    box-shadow: 0 -1px 2px rgb(240, 240, 240);
	
	    /deep/ .ivu-card-body {
	      padding: 15px 16px 14px;
	    }
	
	    .ivu-form-item {
	      margin-bottom: 0;
	    }
	
	    /deep/ .ivu-form-item-content {
	      margin-right: 124px;
	      text-align: center;
	    }
	
	    .ivu-btn {
	      height: 36px;
	      padding: 0 20px;
	    }
	}
</style>