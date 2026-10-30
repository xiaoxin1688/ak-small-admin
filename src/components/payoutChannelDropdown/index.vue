<template>
  <Dropdown
    trigger="click"
    transfer
    :disabled="disabled || !channels.length"
    @on-click="selectChannel"
  >
    <Button :type="type" :size="size" :disabled="disabled || !channels.length">
      {{ channels.length ? label : emptyLabel }}
      <Icon type="ios-arrow-down" />
    </Button>
    <DropdownMenu slot="list">
      <DropdownItem
        v-for="channel in channels"
        :key="channel.value"
        :name="channel.type"
      >
        {{ channel.label }}
      </DropdownItem>
    </DropdownMenu>
  </Dropdown>
</template>

<script>
export default {
  name: 'PayoutChannelDropdown',
  props: {
    channels: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: '选择代付通道'
    },
    emptyLabel: {
      type: String,
      default: '暂无可用代付通道'
    },
    type: {
      type: String,
      default: 'primary'
    },
    size: {
      type: String,
      default: 'default'
    }
  },
  methods: {
    selectChannel(type) {
      this.$emit('select', Number(type));
    }
  }
};
</script>
