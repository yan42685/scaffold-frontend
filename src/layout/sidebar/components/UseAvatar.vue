<template>
  <div class="avatar-container">
    <a-popover placement="rightTop">
      <template #content>
        <div>
          <router-link to="/student/personal-center"
            ><UserOutlined /> 个人中心</router-link
          >
        </div>
        <div class="logout-container">
          <a @click.stop.prevent="logout"><LogoutOutlined /> 登出</a>
        </div>
      </template>
      <a-avatar :size="65" class="avatar">
        <template #icon><img :src="avatarUrl" alt="" /></template>
      </a-avatar>
    </a-popover>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, toRefs } from "vue";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons-vue";
import { logout } from "@/service/account";
import { internalConfig } from "@/config/app-settings";

export default defineComponent({
  name: "UseAvatar",
  components: {
    UserOutlined,
    LogoutOutlined,
  },
  setup() {
    const data = reactive({
      avatarUrl: internalConfig.defaultAvatar,
    });

    return { ...toRefs(data), logout };
  },
});
</script>

<style scoped lang="scss">
.logout-container {
  margin-top: 8px;
}
.avatar-container {
  display: block;
}
</style>
