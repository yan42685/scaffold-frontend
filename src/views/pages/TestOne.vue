<!-- template内部只能有一个root标签,否则UseContent那里的transition、router-view会出bug, 所以要用div包起来 -->
<template>
  <white-background>
    <div><h1>Test One...</h1></div>
  </white-background>
</template>

<script lang="ts">
import WhiteBackground from "@/components/basic/WhiteBackground.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: { WhiteBackground },
  name: "TestOne",
  setup() {
    return {};
  },
});
</script>

<style scoped lang="scss"></style>
