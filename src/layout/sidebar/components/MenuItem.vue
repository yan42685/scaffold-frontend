<template>
  <a-menu-item :key="targetPath" @click.capture="handleClick">
    <span class="icon" v-if="route.meta && route.meta.icon">
      <use-icon :icon="route.meta.icon" />
    </span>
    <span v-if="route.meta && route.meta.title">{{ route.meta.title }}</span>
    <span v-else>链接{{ route.path }}的title不存在</span>
  </a-menu-item>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, reactive, toRefs } from "vue";
import { RouteRecordRaw, useRoute } from "vue-router";
import UseIcon from "@/components/UseIcon.vue";
import { router } from "@/router";
import { concatPath } from "@/utils/basic-lib";

export default defineComponent({
  name: "MenuItem",
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
    const data = reactive({
      currentRoute: useRoute(),
      targetPath: computed(() => concatPath(props.basePath, props.route.path)),
      handleClick: () => router.push(data.targetPath),
    });

    return { ...toRefs(data) };
  },
});
</script>

<style scoped lang="scss"></style>
