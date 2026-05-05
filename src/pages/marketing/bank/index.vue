<template>
<!-- 营销-充值金额 -->
    <div  :style="bgcolors">
		<!-- <div class="i-layout-page-header">
		  <PageHeader
		    class="product_tabs"
		    :title="$route.meta.title"
		    hidden-breadcrumb
		  ></PageHeader>
		</div> -->
        <Card :bordered="false" dis-hover class="ivu-mt">
            <Row class="ivu-mt acea-row">
				<!-- 右边充值金额设置 -->
				<Col class="right ml20">
					<div class="table_box">
						<Row type="flex">
							<Col v-bind="grid">
								<div class="title">银行设置</div>
								<Button type="primary"  @click="groupAdd('添加数据')" class="ml14 mt30">添加数据</Button>
							</Col>
						</Row>
						<div class="table">
							<Table :columns="columns" :data="recharge" ref="table" class="mt25"
								   :loading="loading" highlight-row
								   no-userFrom-text="暂无数据"
								   no-filtered-userFrom-text="暂无筛选结果">
								<template slot-scope="{ row, index }" slot="status">
									<i-switch v-model="row.status" :value="row.status" :true-value="1" :false-value="0" @on-change="onchangeIsShow(row)" size="large">
										<span slot="open">显示</span>
										<span slot="close">隐藏</span>
									</i-switch>
								</template>
								<template slot-scope="{ row, index }" slot="action">
									<a @click="edit(row, '编辑')">编辑</a>
									<Divider type="vertical"/>
									<a @click="del(row,'删除这条信息',index)">删除</a>
								</template>
							</Table>
						</div>
					</div>
				</Col>
            </Row>
        </Card>

      <Modal v-model="bankModel" :title="title" width="550" class-name="batch-modal" >
        <Form  v-model="formData" :label-width="120">
          <FormItem label="收款类型：">
            <RadioGroup v-model="formData.type" @on-change="selectChange">
              <Radio :label="1">银行卡</Radio>
              <Radio :label="2">USDT</Radio>
            </RadioGroup>
          </FormItem>
          <div v-show="bank_type===1">
            <FormItem   label="收款人姓名：" >
              <Input v-model="formData.bank_uname" style="width: 350px;"></Input>
            </FormItem>
            <FormItem  label="收款人银行账户号码：" >
              <Input v-model="formData.bank_code"   style="width: 350px;"></Input>
            </FormItem>
            <FormItem  label="收款人银行的名称：" >
              <Input v-model="formData.bank_name" style="width: 350px;"></Input>
            </FormItem>
            <!--          <FormItem  label="身份证代码：" >-->
            <!--            <Input  v-model="formData.id_card" style="width: 350px;"></Input>-->
            <!--          </FormItem>-->
          </div>
           <div v-show="bank_type===2">
             <FormItem  label="收款名称：" >
               <Input v-model="formData.bank_name" style="width: 350px;"></Input>
             </FormItem>
             <FormItem   label="usdt地址：" >
               <Input v-model="formData.usdt_url" style="width: 350px;"></Input>
             </FormItem>
             <FormItem  label="usdt二维码：" >
               <Input v-model="formData.imgurl"   style="width: 350px;"></Input>
             </FormItem>
           </div>
        </Form>

        <div slot="footer">
          <Button @click="bankModel=false" >取消</Button>
          <Button type="primary"  @click="saveData" >保存</Button>
        </div>
      </Modal>
    </div>
</template>

<script>
	import { getColorChange } from  '@/api/diy'
    import { mapState } from 'vuex'
  import {
    groupAllApi,
    groupDataListApi,
    groupDataAddApi,
    groupDataHeaderApi,
    groupDataEditApi,
    groupDataSetApi,
    groupDataAddEditApi
  } from '@/api/system';
  import { bankCreateApi, bankEditApi } from '@api/bank';
    export default {
        name: 'list',
		computed:{
			bgcolors(){
				return {
					'--color-theme':this.bgCol
				}
			},
			labelWidth() {
			  return this.isMobile ? undefined : 120;
			},
			labelPosition() {
			  return this.isMobile ? "top" : "right";
			},
			...mapState('admin/layout', [
				'menuCollapse'
			])
		},
        data () {
            return {
              title:"新增",
              formData:{
                id:'',
                bank_uname:"",
                bank_name:"",
                bank_code:"",
                usdt_url:"",
                imgurl:"",
                type:1,
                gid:0
              },
              bankModel:false,
              bank_type:1,
				gridPic: {
				    xl: 6,
				    lg: 8,
				    md: 12,
				    sm: 12,
				    xs: 12
				},
				gridBtn: {
				    xl: 4,
				    lg: 8,
				    md: 8,
				    sm: 8,
				    xs: 8
				},
				grid: {
						xl: 7,
						lg: 7,
						md: 12,
						sm: 24,
						xs: 24
					},
				name:'user_recharge_quota',

				pageId:0,
				columns:[
          {
            title: "编号",
            key: "id",
            // width: 60,
          },
          {
            title: "收款人姓名",
            key: "bank_uname",
             width: 120,
          },
          {
            title: "收款人银行账户号码",
            key: "bank_code",
            width: 120,
          },
          {
            title: "收款人银行的名称",
            key: "bank_name",
            width: 120,
          },
          {
            title: "usdt地址",
            key: "usdt_url",
            width: 120,
          },
          {
            title: "usdt二维码",
            key: "imgurl",
            width: 120,
          },
          {
            title:"操作",
            slot: "action"

          }
        ],
				bgCol:'',
				loading: false,
				recharge:[],
        gid:0
            }
        },
		created() {
			this.color()
        },
		mounted() {
		//	this.getListHeader();
			this.getGroupAll();
		   this.info()
		},
        methods: {
          selectChange(e){
           this.bank_type = e;
          },
          saveData(){

            if(this.title==="新增"){
              bankCreateApi(this.formData).then(res=>{

                if(res.status==200){
                  this.$Message.success(res.msg)
                  this.info();
                }else{
                  this.$Message.error(res.msg)
                }

              })
            } else{
              bankEditApi(this.formData.id,this.formData).then(res=>{

                if(res.status==200){
                  this.$Message.success(res.msg)
                  this.info();
                }else{
                  this.$Message.error(res.msg)
                }
              })
            }
            this.bankModel = false;
          },
			info(){
			  groupDataListApi({config_name:this.name,type:1}, 'setting/group_data').then(async res => {
				this.recharge = res.data.list;
				}).catch(res => {
					this.loading = false
					this.$Message.error(res.msg)
				})
			},
			// 添加表单
			groupAdd () {
        this.title = "新增";
        this.bankModel = true;
        this.formData ={};
        this.formData.type=1;
        this.bank_type=1;
        // this.$modalForm(groupDataAddApi({ gid: this.gid,config_name:this.name}, 'setting/group_data/create')).then(() => {
				// 	this.info()
				// })
			},
			// 编辑
			edit (row) {
            this.title = "编辑"
        this.bankModel = true;
        this.formData =row;
        this.bank_type =this.formData.type;
				// this.$modalForm(groupDataEditApi({gid:row.gid,config_name:this.name}, 'setting/group_data/'+row.id+'/edit')).then(() => {
				// 	this.info()
				// })
			},
			getGroupAll () {
			    groupAllApi().then(async res => {
			        let groupAll = res.data;
					groupAll.forEach(item=>{
						if(item.config_name == this.name){
							this.pageId = item.id;
						}
					})
			    }).catch(res => {
			        this.$Message.error(res.msg)
			    })
			},
			// 删除
			del (row, tit, num) {
				let delfromData = {
					title: tit,
					num: num,
					url:'setting/group_data/'+row.id,
					method: 'DELETE',
					ids: {type:1}
				}
				this.$modalSure(delfromData).then((res) => {
					this.info()
					this.$Message.success(res.msg)
				}).catch(res => {
					this.$Message.error(res.msg)
				})
			},
			// 修改是否显示
			onchangeIsShow (row) {
				groupDataSetApi('setting/group_data/set_status/'+row.id+'/'+row.status).then(async res => {
					this.$Message.success(res.msg)
					this.info()
				}).catch(res => {
					this.$Message.error(res.msg)
				})
			},
			getListHeader(){
				this.loading = true
				groupDataHeaderApi({config_name:this.name},'setting/sign_data/header').then(res=>{
					this.columns = res.data.header
					this.loading = false
				}).catch(res => {
					this.loading = false
					this.$Message.error(res.msg)
				})
			},
			color(){
				getColorChange('color_change').then(res=>{
					switch(res.data.status){
						case 1:
							this.bgCol = '#1DB0FC'
						break;
						case 2:
							this.bgCol = '#42CA4D'
						break;
						case 3:
							this.bgCol = '#e93323'
						break;
						case 4:
							this.bgCol = '#FF448F'
						break;
						case 5:
							this.bgCol = '#FE5C2D'
						break;
            case 6:
              this.bgCol = '#e0a558'
            break;
					}
				})
			}
        }
    }
</script>

<style scoped lang="stylus">
	.right{
		width calc(100% - 350px);
	}
	.title{
		padding: 0 0 13px 0
		font-weight: bold;
		font-size: 15px;
		border-left: 2px solid #1890FF;
		height: 23px;
		padding-left: 10px;
	}
	.iframe{
		margin-left 20px
		position: relative
		width: 310px;
		height: 550px;
		background: #FFFFFF;
		border: 1px solid #EEEEEE;
		opacity: 1;
		border-radius: 10px;
	}

	/deep/.ivu-form-item-content{
		margin-left 0px !important
	}
	.table{
		color: #515a6e;
		font-size: 14px;
		background-color: #fff;
		box-sizing: border-box;
		margin: 0 auto;
		margin-left: 20px;

	}
	.iframe-boxs::-webkit-scrollbar {
		display: none;
	}

	.iframe-boxs {
		    width: 310px;
		    height: 550px;
		    border-radius: 10px;
			background: rgba(0, 0, 0, 0);
			border: 1px solid #EEEEEE;
			opacity: 1;
			overflow: auto;
			.moneyBox{
				background-color var(--color-theme)
				height 414px
				border-radius: 10px;
				.box1{
					text-align center
					color #FFFFFF
					padding-bottom 15px
					.font1{
						padding-top 20px
						// padding-bottom 15px
						font-size 12px
						opacity: 0.6;
					}
					.font2{
						font-size 30px
						font-style normal
						opacity: 0.9;
					}
				}
				.moneyBox_content{
					background-color #FFFFFF
					height 317px
					border-radius: 4px;
					padding-top:15px;
					.box2{
						display flex
						justify-content space-around
						height 35px
						line-height 35px
						margin-bottom 10px
						div:nth-child(1){
							font-weight bold
							border-bottom 2px solid var(--color-theme)
						}
					}
					.box3{
						padding 0px 10px
						display flex
						justify-content left
						flex-wrap wrap
						.box3_box{
							width 90px
							height 55px
							border-radius 9px
							background-color #f4f4f4
							color #888
							margin-bottom 10px
							text-align: center;
							padding-top: 3px;
							font-size 19px
							margin-right: 3px;
							margin-left: 3px;
							.font{
								font-size 11px
								font-style normal
							}
						}
						.box3_box:nth-child(1){
							width 90px
							height 55px
							border-radius 9px
							background-color  var(--color-theme)
							color #FFFFFF
							text-align: center;
							padding-top: 3px;
							margin-right: 3px;
							margin-left: 3px;
						}
						.other{
							line-height 55px
						}

					}
					.box4{
						padding 0px 10px
						.tips {
							font-size: 14px;
							color: #333333;
							font-weight: 800;
							margin-bottom: 7px;
							margin-top: 10px;
						}
						.tips-samll {
							font-size: 12px;
							color: #333333;
							margin-bottom: 7px;
							p{
								margin 2px 0px
							}
						}
					}
					.box5{
						font-size: 15px;
						width: 225px;
						height: 40px;
						border-radius: 25px;
						margin: 23px auto 0 auto;
						line-height: 40px;
						text-align: center;
						background-color: var(--color-theme);
						color #FFFFFF
					}
				}

			}
		}
	</style>
