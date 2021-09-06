<template>
  <a-layout class="layout-wrap">
    <a-row>
      <a-col :span="3"> <use-sidebar class="sidebar" /> </a-col>
      <a-col :span="21"> <use-header /><use-content /></a-col>
    </a-row>
  </a-layout>
</template>

<script lang="ts">
import { store } from "@/store";
import { computed, defineComponent, reactive, toRefs } from "vue";
import UseContent from "../content/UseContent.vue";
import UseHeader from "../header/UseHeader.vue";
import UseSidebar from "../sidebar/UseSidebar.vue";

export default defineComponent({
  name: "Framework",
  components: {
    UseSidebar,
    UseHeader,
    UseContent,
  },
  setup() {
    const data = reactive({
      sidebarCollapsed: computed(() => store.state.layout.sidebarCollapsed),
      toggleCollapse: () => {
        store.commit("toggleSidebarCollapse");
      },
    });

    return { ...toRefs(data) };
  },
});
</script>

<style scoped lang="scss">
.sidebar {
  width: 12.5vw;
}
</style>
