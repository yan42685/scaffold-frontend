<template>
  <a-button
    shape="circle"
    @click.stop="toggleFullScreen"
    v-if="isFullScreenEnabled"
  >
    <template #icon>
      <span v-if="!isFullScreen"><ExpandOutlined /></span>
      <span v-else><CompressOutlined /></span>
    </template>
  </a-button>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, toRefs } from "vue";
import screenfull from "screenfull";
import { ExpandOutlined, CompressOutlined } from "@ant-design/icons-vue";

export default defineComponent({
  name: "FullScreenButton",
  components: {
    ExpandOutlined,
    CompressOutlined
  },
  setup() {
    const data = reactive({
      isFullScreenEnabled: computed(() => screenfull.isEnabled),
      isFullScreen: false,
      toggleFullScreen: () => {
        if (screenfull.isEnabled) {
          data.isFullScreen = !data.isFullScreen;
          screenfull.toggle();
        }
      }
    });
    return { ...toRefs(data) };
  }
});
</script>

<style scoped lang="scss"></style>
