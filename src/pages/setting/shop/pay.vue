<template>
    <div>
        <Card v-if="isSuperAdmin" :bordered="false" dis-hover class="ivu-mb-16">
            <Button type="primary" icon="ios-card" @click="openPaymentChannels">第三方支付通道参数</Button>
        </Card>
        <from-submit :validate="ruleValidate" :url="url" :title="title" :rules="rules"/>
    </div>
</template>

<script>
    import fromSubmit from '@/components/fromSubmit/fromSubmit.vue';
    import buildData from "./buildData";
    import { mapState } from 'vuex';
    import util from '@/libs/util';

    export default {
        name: "pay",
        components:{fromSubmit},
        mixins:[buildData],
        computed: {
            ...mapState('admin/user', ['info']),
            isSuperAdmin() {
                if (this.info && this.info.level !== undefined) {
                    return Number(this.info.level) === 0;
                }
                return Number((this.info && this.info.id) || util.cookies.get('uuid')) === 1;
            }
        },
        data() {
            return {
                ruleValidate: {},
                rules: [],
                url: '',
                title:'支付设置',
                type: 'pay'
            };
        },
        methods: {
            openPaymentChannels() {
                this.$router.push({ name: 'setting_payment_channels' });
            }
        }
    }
</script>

<style scoped>

</style>
