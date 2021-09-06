<template>
  <div class="card-container">
    <delayed-spin :loading="loading" :loadingDelay="loadingDelay" class="spin">
      <a-card class="card">
        <slot></slot>
      </a-card>
    </delayed-spin>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DelayedSpin from "./DelayedSpin.vue";

export default defineComponent({
  components: { DelayedSpin },
  name: "UseCard",
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
    },
    boxShadow: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    return {};
  }
});
</script>

<style scoped lang="scss">
.spin,
::v-deep .ant-card-bordered {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>
