<template>
  <div></div>
</template>

<script>
export default {
  name: "UseIcon",
  props: {
    icon: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
[class*="ri"] {
  font-size: 16px;
  vertical-align: -1px;
}
</style>
