<template>
  <!-- 递归动态生成item -->
  <component
    :is="itemType"
    v-if="!route.meta || (route.meta && !route.meta.hidden)"
    :route="route"
    :key="currentFullPath"
    :basePath="basePath"
  >
    <template v-if="nonHiddenChildren.length">
      <dynamic-menu
        v-for="child in nonHiddenChildren"
        :key="concatPath(currentFullPath, child.path)"
        :route="child"
        :basePath="currentFullPath"
      ></dynamic-menu>
    </template>
  </component>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs, computed } from "vue";
import { RouteRecordRaw } from "vue-router";
import SubMenu from "./SubMenu.vue";
import MenuItem from "./MenuItem.vue";
import { concatPath } from "@/utils/basic-lib";

type ItemType = "SubMenu" | "MenuItem";

export default defineComponent({
  name: "DynamicMenu",
  components: { SubMenu, MenuItem },
  props: {
    route: {
      type: Object as PropType<RouteRecordRaw>,
      default: {},
    },
    basePath: {
      type: String,
      default: "",
    },
  },

  setup(props) {
    function getNonHiddenChildren(route: RouteRecordRaw) {
      let children = [] as Array<RouteRecordRaw>;
      if (route.children && route.children.length !== 0) {
        children = route.children.filter(
          (route) => !route.meta || (route.meta && !route.meta.hidden)
        );
      }
      return children;
    }

    const data = reactive({
      nonHiddenChildren: computed(() => getNonHiddenChildren(props.route)),
      itemType: computed(
        (): ItemType =>
          data.nonHiddenChildren.length > 0 ? "SubMenu" : "MenuItem"
      ),
      currentFullPath: computed(() =>
        concatPath(props.basePath, props.route.path)
      ),
    });

    return { ...toRefs(data), concatPath };
  },
});
</script>

<style scoped lang="scss"></style>
