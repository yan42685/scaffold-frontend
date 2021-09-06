<template>
  <div class="placeholder">
    <a-layout-header class="header">
      <a-row class="sub-header1">
        <!-- NOTE: 栅格系统是指针对 100vw进行划分宽度，由于Framework只给Header分配了21列，所以这里总和应该是21列 -->
        <a-col :span="12"><use-bread-crumb /></a-col>
        <a-col :span="9" class="sub-header1-right">
          <full-screen-button />
          <a-button shape="circle" @click.stop="reloadTab">
            <template #icon><RedoOutlined /> </template>
          </a-button>
        </a-col>
      </a-row>
      <div class="sub-header2"><use-tab-bar /></div>
    </a-layout-header>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, computed } from "vue";
import UseBreadCrumb from "./component/UseBreadCrumb.vue";
import UseTabBar from "./component/UseTabBar.vue";
import { eventBus } from "@/utils/event-bus";
import { RedoOutlined } from "@ant-design/icons-vue";
import FullScreenButton from "@/components/button/FullScreenButton.vue";

export default defineComponent({
  components: {
    UseBreadCrumb,
    UseTabBar,
    RedoOutlined,
    FullScreenButton,
  },
  name: "UseHeader",
  setup() {
    const data = reactive({
      reloadTab: () => eventBus.emit("reloadTab"),
    });
    return { ...toRefs(data) };
  },
});
</script>

<style scoped lang="scss">
.placeholder {
  height: $header-height;
}
.header {
  z-index: 10; /* 确保不会被content覆盖 */
  position: fixed;
  width: 100%;
  height: $header-height;
  border: $common-border;
  background-color: white;

  .sub-header1 {
    &-right {
      align-items: center;

      .ant-btn {
        margin: 0 5px;
      }
    }
  }

  .sub-header2 {
    padding-top: 1.7px;
    justify-content: left;

    border: {
      top: $common-border;
    }
  }

  .ant-col + .ant-col {
    display: flex;
    justify-content: flex-end;
    padding: 0 20px;
  }
}

.ant-layout-header {
  padding: 0;
  line-height: 1em;
}
</style>
