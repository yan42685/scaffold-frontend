<template>
  <div>
    <a-spin :spinning="loading" :delay="loadingDelay">
      <slot></slot>
    </a-spin>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "DelayedSpin",
  props: {
    // 正在加载中
    loading: {
      type: Boolean,
      default: false
    },
    // 延迟显示
    loadingDelay: {
      type: Number,
      default: 500
    }
  },
  setup() {
    return {};
  }
});
</script>

<style scoped>
.spin-content {
  border: 1px solid #91d5ff;
  background-color: #e6f7ff;
  padding: 30px;
}
::v-deep .ant-spin-nested-loading,
::v-deep .ant-spin-container {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>
