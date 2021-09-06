<template>
  <!-- 不要在router-view上写css样式, 应在外层container上写 -->
  <a-layout-content v-if="showRouterView" class="content">
    <!-- NOTE: 和router3.x版本不一样，这里加:key="$router.path"会不缓存, 因为router4会自动绑定this了 -->
    <!-- 作为router-view显示的目标组件，template中只能有一个root标签,否transition、router-view会出bug -->
    <router-view v-slot="{ Component }">
      <transition mode="out-in" name="fade-transform">
        <!-- NOTE: vue router4好像目前不支持带属性的keep-alive -->
        <!-- <keep-alive :include="cachedTabNames" :max="keepAliveMaxNum"> -->
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
        <!-- </keep-alive> -->
      </transition>
    </router-view>
  </a-layout-content>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, toRefs, nextTick } from "vue";
import { RouteLocation, useRoute } from "vue-router";
import { internalConfig } from "@/config/app-settings";
import { store } from "@/store";
import { eventBus } from "@/utils/event-bus";
import { router } from "@/router";
import WhiteBackground from "@/components/basic/WhiteBackground.vue";

export default defineComponent({
  components: { WhiteBackground },
  name: "UseContent",

  setup() {
    const data = reactive({
      // 用于content刷新
      showRouterView: true,
      keepAliveMaxNum: internalConfig.keepAliveMaxNum,
      cachedTabNames: computed(() => {
        const cachedTabNames = [] as string[];
        store.state.tabBar.openTabs.forEach((tab: RouteLocation) => {
          if (!(tab.meta && tab.meta.noKeepAlive)) {
            if (tab.name) {
              cachedTabNames.push(tab.name as string);
            } else {
              console.log("待缓存路由没有name字段");
            }
          }
        });
        return cachedTabNames;
      }),
    });
    const currentRoute = useRoute();

    eventBus.on("reloadTab", () => {
      data.showRouterView = false;
      nextTick(() => {
        data.showRouterView = true;
      });
    });
    return { router, currentRoute, ...toRefs(data) };
  },
});
</script>

<style scoped lang="scss">
@import "@/styles/transitions.scss";

.content {
  /* position: relative; */
  min-height: $tab-content-min-height;
  padding: $medium-padding;
  margin: $medium-margin;
  /* top: $medium-margin !important; */
  /* background: #fff; */
  /* box-shadow: 0 8px 8px rgba(10, 16, 20, 0.24), 0 0 8px rgba(10, 16, 20, 0.12); */
}
</style>
