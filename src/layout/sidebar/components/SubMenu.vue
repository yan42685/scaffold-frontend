<template>
  <a-sub-menu :key="targetPath">
    <template v-slot:title>
      <span class="icon" v-if="route.meta && route.meta.icon">
        <use-icon :icon="route.meta.icon" />
      </span>
      <span v-if="route.meta && route.meta.title">{{ route.meta.title }}</span>
      <span v-else>链接{{ route.path }}的title不存在</span>
    </template>
    <slot></slot>
  </a-sub-menu>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import { RouteRecordRaw } from "vue-router";
import { router } from "@/router";
import UseIcon from "@/components/UseIcon.vue";
import { concatPath } from "@/utils/basic-lib";

export default defineComponent({
  name: "SubMenu",
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

  components: { UseIcon },

  setup(props) {
    const targetPath = computed(() =>
      concatPath(props.basePath, props.route.path)
    );
    return { targetPath };
  },
});
</script>

<style scoped lang="scss"></style>
