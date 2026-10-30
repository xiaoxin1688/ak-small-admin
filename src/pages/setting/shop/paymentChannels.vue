<template>
  <div>
    <Card :bordered="false" dis-hover class="ivu-mt">
      <p slot="title">第三方支付通道参数</p>
      <Button slot="extra" type="text" icon="ios-arrow-back" @click="backToChannels">返回支付通道</Button>
      <Alert show-icon>
        密钥留空会保留原值。保存后，新发起的支付、代付和后续回调会使用新配置。
      </Alert>

      <Form :label-width="180" @submit.native.prevent>
        <FormItem label="支付通道">
          <Select v-model="provider" :disabled="busy || saving" style="width: 360px" @on-change="loadConfig">
            <Option v-for="item in providers" :key="item.value" :value="item.value">
              {{ item.label }}{{ item.active ? '' : '（历史适配器）' }}
            </Option>
          </Select>
        </FormItem>
        <Alert v-if="error" type="error" show-icon>{{ error }}</Alert>

        <template v-if="loaded">
          <FormItem v-for="(field, name) in fields" :key="name" :label="field.label" :required="field.required">
            <Input
              v-if="field.secret"
              v-model="values[name]"
              :type="field.multiline ? 'textarea' : 'password'"
              :rows="field.multiline ? 6 : 1"
              autocomplete="new-password"
              :disabled="saving || clear.indexOf(name) !== -1"
              style="max-width: 700px"
              :placeholder="configured[name] ? '已配置，留空保留；输入新值替换' : '尚未配置'"
            />
            <Input
              v-else
              v-model="values[name]"
              :type="field.multiline ? 'textarea' : 'text'"
              :rows="5"
              :disabled="saving || clear.indexOf(name) !== -1"
              style="max-width: 700px"
              :placeholder="isCallback(name) ? '留空使用后台站点域名自动生成' : '请输入' + field.label"
            />
            <div v-if="field.secret && configured[name] && !field.required">
              <Checkbox :value="clear.indexOf(name) !== -1" :disabled="saving" @on-change="toggleClear(name, $event)">
                清除已保存的密钥
              </Checkbox>
            </div>
          </FormItem>
          <FormItem>
            <Button type="primary" :loading="saving" :disabled="busy" @click="save">保存参数</Button>
            <Button class="ivu-ml-8" :disabled="busy || saving" @click="loadConfig">重新加载</Button>
          </FormItem>
        </template>
        <Spin v-if="busy" fix />
      </Form>
    </Card>
  </div>
</template>

<script>
import { configProvidersApi, getConfigApi, saveConfigApi } from '@/api/paychannel';

export default {
  name: 'PaymentChannelConfig',
  data () {
    return {
      providers: [],
      provider: '',
      fields: {},
      values: {},
      configured: {},
      clear: [],
      version: 0,
      busy: false,
      saving: false,
      loaded: false,
      error: ''
    };
  },
  async mounted () {
    try {
      const response = await configProvidersApi();
      this.providers = response.data;
      if (this.providers.length) {
        const requested = String(this.$route.query.provider || '').toLowerCase();
        this.provider = this.providers.some(item => item.value === requested)
          ? requested
          : this.providers[0].value;
        await this.loadConfig();
      }
    } catch (error) {
      this.error = this.errorMessage(error, '无法读取支付通道');
    }
  },
  methods: {
    backToChannels () {
      this.$router.push({ name: 'finance_channel' });
    },
    errorMessage (error, fallback) {
      return (error && (error.msg || error.message)) || fallback;
    },
    isCallback (name) {
      return ['notify_url', 'proxy_notify_url', 'redirectUrl', 'page_url'].indexOf(name) !== -1;
    },
    toggleClear (name, checked) {
      this.clear = checked
        ? this.clear.filter(value => value !== name).concat(name)
        : this.clear.filter(value => value !== name);
    },
    async loadConfig () {
      if (!this.provider || this.busy) return;
      this.busy = true;
      this.loaded = false;
      this.error = '';
      this.values = {};
      try {
        const response = await getConfigApi(this.provider);
        const data = response.data;
        this.fields = data.fields;
        this.values = data.values;
        this.configured = data.configured;
        this.version = data.version;
        this.clear = [];
        this.loaded = true;
      } catch (error) {
        this.error = this.errorMessage(error, '读取配置失败');
      } finally {
        this.busy = false;
      }
    },
    async save () {
      if (this.saving || this.busy || !this.loaded) return;
      this.saving = true;
      this.error = '';
      try {
        await saveConfigApi(this.provider, { values: this.values, clear: this.clear, version: this.version });
        this.$Message.success('支付参数已保存');
        await this.loadConfig();
      } catch (error) {
        this.error = this.errorMessage(error, '保存失败');
      } finally {
        this.saving = false;
      }
    }
  }
};
</script>
