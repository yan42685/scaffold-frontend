<template>
  <a-breadcrumb separator="/">
    <a-breadcrumb-item v-for="route in matched" :key="route.path">
      <transition mode="out-in" name="fade-in">
        <span :key="route.path"> {{ route.meta.title }} </span>
      </transition>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watchEffect } from "vue";
import { useRoute, RouteLocationMatched } from "vue-router";

export default defineComponent({
  name: "UseBreadCrumb",
  setup() {
    const currentRoute = useRoute();
    const data = reactive({
      matched: [] as RouteLocationMatched[]
    });

    watchEffect(() => {
      const newRoute = currentRoute;
      const matched = newRoute.matched.filter(
        route => route.meta && route.meta.title
      );
      if (matched.length > 0) {
        data.matched = matched;
      }
    });

    return {
      ...toRefs(data)
    };
  }
});
</script>

<style scoped lang="scss">
@import "@/styles/transitions.scss";
.ant-breadcrumb {
  text-align: left;
  height: 80%;
  line-height: $subheader1-height;
  margin-left: 20px;
}
</style>
