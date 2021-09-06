<template>
  <div class="tab-bar">
    <a-row>
      <a-col :span="20">
        <div class="tab-bar-left-panel">
          <a-tabs
            @tab-click="handleTabClick"
            @edit="handleTabClose"
            hide-add
            v-model:activeKey="activeTabKey"
            type="editable-card"
            tab-position="left"
          >
            <a-tab-pane
              class="tab-pane"
              size="small"
              v-for="tab in openTabs"
              :key="tab.path"
              :closable="!(tab.meta && tab.meta.affix)"
              :tab="tab.meta.title"
            ></a-tab-pane>
          </a-tabs>
        </div>
      </a-col>
      <a-col :span="1">
        <div class="tab-bar-right-panel">
          <a-dropdown>
            <template v-slot:overlay>
              <a-menu @click="handleTabOperation">
                <a-menu-item key="CLOSE_OTHER">
                  <a>关闭其他</a>
                </a-menu-item>
                <a-menu-item key="CLOSE_LEFT">
                  <a>关闭左侧</a>
                </a-menu-item>
                <a-menu-item key="CLOSE_RIGHT">
                  <a>关闭右侧</a>
                </a-menu-item>
                <a-menu-item key="CLOSE_ALL">
                  <a>关闭全部</a>
                </a-menu-item>
              </a-menu>
            </template>
            <a-button>
              <DownOutlined />
            </a-button>
          </a-dropdown>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
  Ref,
  watch,
  watchEffect
} from "vue";
import {
  useRoute,
  RouteLocation,
  RouteRecord,
  onBeforeRouteUpdate
} from "vue-router";
import { store } from "@/store";
import { router } from "@/router";
import { getTabByPath } from "@/service/tab";
import { DownOutlined } from "@ant-design/icons-vue";
import { routeMetaContains } from "@/utils/route";
import { eventBus } from "@/utils/event-bus";

type TabOperation = "CLOSE_LEFT" | "CLOSE_RIGHT" | "CLOSE_OTHER" | "CLOSE_ALL";

export default defineComponent({
  name: "UseTabBar",
  components: { DownOutlined },

  setup() {
    // 当前路由信息
    const currentRoute = useRoute();
    const openTabs: Ref<RouteLocation[]> = computed(
      () => store.state.tabBar.openTabs
    );

    const addTab = (newTab: RouteLocation | RouteRecord) =>
      store.commit("addTab", newTab);
    const deleteTab = (targetTab: RouteLocation) =>
      store.commit("deleteTab", targetTab);
    const deleteOtherTabs = (currentTab: RouteLocation) =>
      store.commit("deleteOtherTabs", currentTab);
    const deleteLeftTabs = (currentTab: RouteLocation) =>
      store.commit("deleteLeftTabs", currentTab);
    const deleteRightTabs = (currentTab: RouteLocation) =>
      store.commit("deleteRightTabs", currentTab);
    const deleteAllTabs = () => store.commit("deleteAllTabs");

    // 手动给watchEffect监听oldPath, 注意不能直接监听Route，因为监听的是对象的引用，而基本类型是值
    let oldPath = "";

    const data = reactive({
      // 当前激活的tab的key(path)
      activeTabKey: "",
      goToLastTab() {
        const latestTab = openTabs.value.slice(-1)[0];
        if (latestTab) router.push(latestTab);
      },

      handleTabClick: (path: string) => {
        if (currentRoute.path !== path) {
          router.push(path);
        }
      },
      handleTabClose: (path: string) => {
        const target = openTabs.value.find(tab => {
          return path === tab.path;
        });
        if (target) {
          deleteTab(target);
        }
        if (target && target.path == currentRoute.path) {
          data.goToLastTab();
        }
      },

      handleTabOperation: (operation: any) => {
        const currentTab = getTabByPath(data.activeTabKey);
        if (!currentTab) {
          console.log("找不到当前tab");
          return;
        }

        switch (operation.key as TabOperation) {
          case "CLOSE_LEFT":
            deleteLeftTabs(currentTab);
            break;
          case "CLOSE_RIGHT":
            deleteRightTabs(currentTab);
            break;
          case "CLOSE_OTHER":
            deleteOtherTabs(currentTab);
            break;
          case "CLOSE_ALL":
            deleteAllTabs();
            data.goToLastTab();
            break;
          default:
            break;
        }
      }
    });

    function initAffixTabs(routes: RouteRecord[]) {
      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          addTab(route);
          data.activeTabKey = route.path;
        }
      });
    }

    // 初始化固定标签页
    initAffixTabs(router.getRoutes());

    watchEffect(() => {
      const newRoute = currentRoute;
      if (newRoute.path !== oldPath) {
        addTab(newRoute);
        data.activeTabKey = newRoute.path;
        oldPath = newRoute.path;
      }
    });

    eventBus.on("close-tab-by-path", (e: any) => data.handleTabClose(e.path));

    return {
      ...toRefs(data),
      openTabs,
      routeMetaContains
    };
  }
});
</script>
<style scoped lang="scss">
.tab-bar {
  position: relative;
  &-left-panel {
    width: calc(100% - 52px - 30px);
  }
  &-right-panel {
    align-items: center !important;
    ::v-deep .ant-btn {
      top: 10px !important;
      padding: 0 10px !important;
      height: 22px !important;
    }
  }

  // ::v-deep 样式穿透并且写上!important 就可以覆盖用了scoped的组件的样式
  ::v-deep .ant-tabs {
    margin-bottom: 5px !important;
    &-bar {
      margin: 5px !important;
    }
    &-vertical {
      height: $subheader2-height !important;
    }
    &-tab {
      display: inline-block !important;
      height: 32px !important;
      margin-right: 5px !important;
      padding-bottom: 5px !important;
      line-height: 32px !important;
      background: #ffffff !important;
      border: 1px solid #dedede !important;
    }
    &-tab-prev,
    &-tab-next {
      height: 32px !important;
      line-height: 32px !important;
    }

    &-tab-active {
      border: 1px solid #1890ff !important;
      .ant-tabs-close-x {
        color: #1890ff !important;
      }
    }
  }
}
</style>
