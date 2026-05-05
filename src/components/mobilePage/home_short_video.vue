<template>
    <div class="shortVideo" :style="{
		background:bottomBgColor,
		marginTop:mTop+'px',
		paddingTop:topConfig+'px',
		paddingBottom:bottomConfig+'px',
		paddingLeft:prConfig+'px',
		paddingRight:prConfig+'px'
	}">
        <div class="nav acea-row row-between-wrapper" :style="{
			background:`linear-gradient(90deg,${headerBgColorLeft} 0%,${headerBgColorRight} 100%)`,
			borderRadius: bgRadius
		}">
            <div class="title" v-if="titleConfig" :style="(titleTabVal==2?'fontStyle:':'fontWeight:') + titleText+';color:'+titleColor+';fontSize:'+titleNumber+'px;'">{{titleTxtConfig}}</div>
			<img v-else :src="imgUrl" alt="" />
            <div class="more" :style="{
				color:headerBntColor,
				fontSize:bntNumber+'px'
			}">{{rightBntConfig}}<span class="iconfont iconjinru" :style="{
				fontSize:bntNumber+'px'
			}"></span></div>
        </div>
        <div v-if="styleConfig" class="list on acea-row row-middle" :style="{
			background: bgColor,
			borderRadius: bgRadius2
		}">
            <div class="item" :style="{
				marginRight:videoSpace2+'px'
			}" v-for="(item,index) in videoList" :key="index" v-if="index<numberConfig">
                <div class="pictrue">
                    <img :style="{
						borderRadius:imgRadius
					}" v-if="item.image" :src="item.image">
                    <div v-else class="empty-box" :style="{
						borderRadius:imgRadius
					}">
					  <img src="../../assets/images/shan.png"/>
					</div>
                </div>
            </div>
        </div>
        <div v-else class="list" :style="{
			background: bgColor,
			borderRadius: bgRadius2
		}">
            <div class="item acea-row row-between" :style="{
				marginBottom:videoSpace+'px'
			}" v-for="(item,index) in videoList" :key="index" v-if="index<numberConfig">
                <div class="pictrue">
                    <img :style="{
						borderRadius:imgRadius
					}" v-if="item.image" :src="item.image">
                    <div v-else class="empty-box" :style="{
						borderRadius:imgRadius
					}">
					  <img src="../../assets/images/shan.png"/>
					</div>
                </div>
                <div class="text">
                    <div class="conter">
                        <div class="header acea-row row-middle">
                            <img v-if="item.type_image" :src="item.type_image">
							<img v-else src="@/assets/images/yonghu.png">
                            <div class="name line1">{{item.type_name || '公司名称'}}</div>
                        </div>
                        <div class="info line2">{{item.desc || '观看视频讲解更多好礼等你来抢，每天都有哟～ 更多好礼请联…'}}</div>
                    </div>
                    <div class="goodsList acea-row row-middle">
                        <div class="pictrue" v-for="(j,jindex) in item.product_info || 3" :key="jindex" v-if="jindex<3">
                            <img v-if="j.image" :src="j.image">
                            <div v-else class="empty-icon">
								<img src="../../assets/images/shan.png"/>
							</div>
                            <div class="money acea-row row-bottom row-center" v-if="jindex<2">
                                <span>¥{{j.price ||'9.9'}}</span>
                            </div>
                            <div v-else class="num acea-row row-center-wrapper">
                                <span>+{{item.product_num-2 || 1}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex'
	import { videoList } from '@/api/marketing'
    export default {
        name: 'home_short_video',
        cname: '短视频',
        configName: 'c_short_video',
        icon: '#iconzujian-duanshipin',
        type:1,// 0 基础组件 1 营销组件 2工具组件
        defaultName:'shortVideo', // 外面匹配名称
        props: {
            index: {
                type: null
            },
            num: {
                type: null
            }
        },
        computed: {
            ...mapState('admin/mobildConfig', ['defaultArray'])
        },
        watch: {
            pageData: {
                handler (nVal, oVal) {
                    this.setConfig(nVal)
                },
                deep: true
            },
            num: {
                handler (nVal, oVal) {
                    let data = this.$store.state.admin.mobildConfig.defaultArray[nVal]
                    this.setConfig(data)
                },
                deep: true
            },
            'defaultArray': {
                handler (nVal, oVal) {
                    let data = this.$store.state.admin.mobildConfig.defaultArray[this.num]
                    this.setConfig(data);
                },
                deep: true
            }
        },
        data () {
            return {
                // 默认初始化数据禁止修改
                defaultConfig: {
					cname: '短视频',
                    name: 'shortVideo',
                    timestamp: this.num,
					isHide:false,
                    setUp: {
                        tabVal: 0
                    },
					titleLeft:'视频设置',
					titleHead:'头部设置',
					titleContent:'内容展示',
					titleRight:'头部样式',
					titleVideoStyle:'视频样式',
					titleCurrency:'通用样式',
					styleConfig:{
						title: '选择风格',
						tabVal: 0,
						tabList: [
							{
							  name: '样式一'
							},
						    {
						      name: '样式二'
						    }
						]
					},
					titleConfig:{
						title: '标题类型',
						tabVal: 0,
						tabList: [
							{
							  name: '图片'
							},
						    {
						      name: '文字'
						    }
						]
					},
					imgConfig:{
						info: '建议：104px * 32px',
						url: require('@/assets/images/shortVideo02.png'),
						type:'code',
						delType:0,
						name:'上传图片'
					},
					titleTxtConfig:{
						title: '标题文字',
						value: '短视频',
						place: '请输入标题文字',
						max: 6
					},
					rightBntConfig:{
						title: '右侧文字',
						value: '更多',
						place: '请输入右侧文字',
						max: 6
					},
					numberConfig:{
						title: '视频数量',
						val: 3,
						min: 1
					},
					headerBgColor:{
						title: '背景颜色',
						name: 'headerBgColor',
						default: [
						    {
						        item: '#E93323'
						    },
							{
							    item: '#FF7931'
							}
						],
						color: [
						    {
						        item: '#E93323'
						    },
						    {
						        item: '#FF7931'
						    }
						]
					},
					titleText:{
						title: '标题文字',
						tabVal: 0,
						tabList: [
							{
							    name: '加粗',
							    style: 'bold'
							},
						    {
						        name: '正常',
						        style: 'normal'
						    },
						    {
						        name: '倾斜',
						        style: 'italic'
						    }
						]
					},
					titleColor:{
						title: '标题颜色',
						name: 'titleColor',
						default: [
						    {
						        item: '#fff'
						    }
						],
						color: [
						    {
						        item: '#fff'
						    }
						]
					},
					titleNumber:{
						title: '标题字号',
						val: 16,
						min: 0
					},
					headerBntColor:{
						title: '按钮文字',
						name: 'headerBntColor',
						default: [
						    {
						        item: '#fff'
						    }
						],
						color: [
						    {
						        item: '#fff'
						    }
						]
					},
					bntNumber:{
						title: '按钮大小',
						val: 12,
						min: 0
					},
					videoSpace:{
						title: '视频间距',
						val: 20,
						min: 0
					},
					videoSpace2:{
						title: '视频间距',
						val: 12,
						min: 0
					},
					filletImg:{
						title:'视频圆角',
						type: 0,
						list: [
						  {
						    val: "全部",
						    icon: "iconcaozuo-zhengti",
						  },
						  {
						    val: "单个",
						    icon: "iconcaozuo-bianjiao",
						  }
						],
						valName:'圆角值',
						val: 8,
						min: 0,
						valList:[
							{val:0},
							{val:0},
							{val:0},
							{val:0}
						]
					},
					moduleColor:{
						title: '组件背景',
						default: [
						    {
						        item: '#fff'
						    },
							{
							    item: '#fff'
							}
						],
						color: [
						    {
						        item: '#fff'
						    },
							{
							    item: '#fff'
							}
						]
					},
					bottomBgColor:{
						title: '底部背景',
						default: [
						    {
						        item: '#f5f5f5'
						    }
						],
						color: [
						    {
						        item: '#f5f5f5'
						    }
						]
					},
					topConfig: {
						title: '上边距',
						val: 0,
						min: 0
					},
					bottomConfig: {
						title: '下边距',
						val: 0,
						min: 0
					},
					prConfig: {
					    title: '左右边距',
					    val: 10,
					    min: 0
					},
					mbConfig: {
					    title: '页面上间距',
					    val: 0,
					    min: 0
					},
					fillet:{
						title:'背景圆角',
						type: 0,
						list: [
						  {
						    val: "全部",
						    icon: "iconcaozuo-zhengti",
						  },
						  {
						    val: "单个",
						    icon: "iconcaozuo-bianjiao",
						  }
						],
						valName:'圆角值',
						val: 8,
						min: 0,
						valList:[
							{val:0},
							{val:0},
							{val:0},
							{val:0}
						]
					}   
                },
                pageData: {},
                videoList: [],
				numberConfig:0,
				headerBgColorLeft:'',
				headerBgColorRight:'',
				styleConfig:0,
				titleConfig:0,
				imgUrl:'',
				headerBntColor:'',
				rightBntConfig:'',
				titleTxtConfig:'',
				numberConfig:0,
				titleText:0,
				titleColor:'',
				titleNumber:0,
				videoSpace:0,
				videoSpace2:0,
				imgRadius:0,
				bgColor:'',
				bgRadius:0,
				bgRadius2:0,
				bottomBgColor:'',
				mTop: 0,
				topConfig:0,
				bottomConfig:0,
				prConfig:0,
				bntNumber:0
            }
        },
        mounted () {
            this.$nextTick(() => {
                this.pageData = this.$store.state.admin.mobildConfig.defaultArray[this.num]
                this.setConfig(this.pageData);
				this.getVideoList();
            })
        },
        methods: {
			getVideoList(){
				this.videoList = this.numberConfig;
			    videoList({
			        page:1
			    }).then(res=>{
					this.videoList = res.data.list;
			    }).catch(err=>{
			        this.$message.error(err.msg)
			    })
			},
            setConfig (data) {
                if(!data) return
                if(data.mbConfig){
					this.headerBgColorLeft = data.headerBgColor.color[0].item;
					this.headerBgColorRight = data.headerBgColor.color[1].item;
					this.styleConfig = data.styleConfig.tabVal;
					this.titleConfig = data.titleConfig.tabVal;
					this.imgUrl = data.imgConfig.url;
					this.headerBntColor = data.headerBntColor.color[0].item;
					this.rightBntConfig = data.rightBntConfig.value;
					this.titleTxtConfig = data.titleTxtConfig.value;
					this.numberConfig = data.numberConfig.val;
					this.bntNumber = data.bntNumber.val;
					let tabVal = data.titleText.tabVal;
					this.titleTabVal = tabVal;
					this.titleText = data.titleText.tabList[tabVal].style;
					this.titleColor = data.titleColor.color[0].item;
					this.titleNumber = data.titleNumber.val;
					this.videoSpace = data.videoSpace.val;
					this.videoSpace2 = data.videoSpace2.val;
					let filletImg = data.filletImg.type;
					let filletValImg = data.filletImg.val;
					let valListImg = data.filletImg.valList;
					this.imgRadius = filletImg? valListImg[0].val+ 'px ' +valListImg[1].val + 'px ' + valListImg[3].val + 'px ' + valListImg[2].val +'px' : filletValImg +'px';
					let bgColorLeft =  data.moduleColor.color[0].item;
					let bgColorRight =  data.moduleColor.color[1].item;
					this.bgColor = `linear-gradient(90deg,${bgColorLeft} 0%,${bgColorRight} 100%)`;
					let fillet = data.fillet.type;
					let filletVal = data.fillet.val
					let valList = data.fillet.valList;
					this.bgRadius = fillet? valList[0].val+ 'px ' +valList[1].val + 'px 0 0': filletVal +'px ' +filletVal + 'px 0 0';
					this.bgRadius2 = fillet? '0 0 '+valList[3].val+ 'px ' +valList[2].val + 'px': '0 0 '+filletVal +'px ' +filletVal + 'px';
					this.bottomBgColor = data.bottomBgColor.color[0].item;
					this.mTop = data.mbConfig.val;
					this.topConfig = data.topConfig.val;
					this.bottomConfig = data.bottomConfig.val;
					this.prConfig = data.prConfig.val;
					if(!this.videoList.length){
						this.videoList = this.numberConfig
					}
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .shortVideo{
        .nav{
            width: 100%;
            height: 48px;
			padding: 0 12px;
			img {
				width: 52px;
				height: 16px;
				display: block;
			}
            .title{
                font-weight: 600;
                color: #333333;
                font-size: 15px;
            }
            .more{
                font-weight: 400;
                color: #999999;
                font-size: 12px;
                .iconfont{
                    font-size: 12px;
                }
            }
        }
        .list{
			padding: 12px 10px;
            &.on{
                flex-wrap: nowrap;
                overflow: hidden;
				
                .item{
                    margin-right: 12px;
                    margin-bottom: 0;
                    .pictrue{
                        margin-right: 0;
                    }
                }
            }
            .item{
                margin-bottom: 20px;
				&:nth-last-child(1){
					margin-bottom: 0 !important;
				}
                .pictrue{
                    width: 113px;
                    height: 150px;
                    border-radius: 8px;
                    position: relative;
                    margin-right: 11px;
                    img{
                        width: 100%;
                        height: 100%;
                        border-radius: 4px;
                        object-fit:cover;
                    }
					.empty-box{
						background-color: #F3F9FF;
						img {
							width: 65px;
							height: 50px;
							display: block;
						}
					}
                }
                .text{
                    flex: 1;
                    /*width: 219px;*/
                    .goodsList{
                        margin-top: 17px;
                        overflow: hidden;
						.empty-icon{
							width: 100%;
							height: 100%;
							background-color: #F3F9FF;
							display: flex;
							align-items: center;
							justify-content: center;
							
							img {
								width: 36px !important;
								height: 28px !important;
								display: block;
							}
						}
                        .pictrue{
                            width: 64px;
                            height: 64px;
                            border-radius: 4px;
                            position: relative;
                            margin-right: 10px;
                            &:nth-of-type(3n){
                                margin-right: 0;
                            }
                            .num{
                                position: absolute;
                                top:0;
                                left:0;
                                color: #fff;
                                font-size: 15px;
                                font-weight: 400;
                                background: rgba(0, 0, 0, 0.3);
                                width: 100%;
                                height: 100%;
                                border-radius: 3px;
                            }
                            img{
                                width: 100%;
                                height: 100%;
                                display: block;
                                border-radius: 3px;
                            }
                            .money{
                                position: absolute;
                                color: #fff;
                                font-size: 11px;
                                bottom: 0;
                                left:0;
                                width: 100%;
                                height: 23px;
                                background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%);
                                border-radius: 0 0 4px 4px;
                                text-align: center;
								padding-bottom: 1px;
                            }
                        }
                    }
                    .conter{
                        height: 67px;
                        .header{
                            .name{
                                flex: 1;
                                width: 150px;
                            }
                            .empty-icon{
                                width: 18px;
                                height: 18px;
                                border-radius: 50%;
                                background-color: #f3f5f7;
                                border: 1px solid #FFFFFF;
                                margin-right: 5px;
                            }
                            img{
                                width: 18px;
                                height: 18px;
                                border: 1px solid #FFFFFF;
                                display: block;
                                margin-right: 5px;
                                border-radius: 50%;
                            }
                            font-weight: 500;
                            color: #333333;
                            font-size: 14px;
                        }
                        .info{
                            font-weight: 400;
                            color: #666666;
                            font-size: 12px;
                            margin-top: 7px;
                        }
                    }
                }
            }
        }
    }
</style>
