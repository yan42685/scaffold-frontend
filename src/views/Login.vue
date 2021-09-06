<template>
  <div id="login">
    <div class="box">
      <h1>欢迎使用crm系统</h1>
      <a-form layout="horizontal" :model="formData" @submit="handleSubmit">
        <a-form-item>
          <a-input
            v-model:value="formData.username"
            placeholder="账号"
            style="width: 100%"
          >
            <template #prefix
              ><UserOutlined style="color: rgba(0, 0, 0, 0.25)"
            /></template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-model:value="formData.password"
            type="password"
            placeholder="密码"
            style="width: 100%"
          >
            <template #prefix
              ><LockOutlined style="color: rgba(0, 0, 0, 0.25)"
            /></template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button
            block
            type="primary"
            html-type="submit"
            :disabled="formData.username === '' || formData.password === ''"
            :loading="btnLoading"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts">
import {  Result, TokenDto } from "@/api/rest-api";
import { router } from "@/router";
import { saveAccessToken, saveRefreshToken } from "@/utils/cookies";
import { loginHook } from "@/utils/hooks/on-login";
import { getRequest } from "@/utils/request";
import { loginRedirect } from "@/utils/timeout-actions";
import { LockOutlined, UserOutlined } from "@ant-design/icons-vue";
import { defineComponent, reactive, toRefs } from "vue";
import { messenger } from "../utils/my-ant-design-vue";

export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined,
  },
  name: "Login",
  setup() {
    const data = reactive({
      btnLoading: false,
      formData: {
        username: "",
        password: "",
      },
      async handleSubmit(e: any) {
        const { username, password } = data.formData;
        const usernameRgx =
          username !== "" && /^[^\u4e00-\u9fa5]+$/.test(username);
        const pwdRgx = password !== "";
        if (!usernameRgx || !pwdRgx) {
          messenger.warning("请检查用户名和密码");
          return;
        }
        data.btnLoading = true;

        const result: Result<TokenDto> = await getRequest(
          "/api/account/login",
          {
            ...data.formData,
          }
        );
        data.btnLoading = false;

        if (result.code !== 0) {
          messenger.warning(result.message);
          return;
        }

        saveAccessToken(result.data.accessToken);
        saveRefreshToken(result.data.refreshToken);

        loginHook();
        router.push("/home");
      },
    });

    return {
      loginRedirect,
      ...toRefs(data),
    };
  },
});
</script>

<style scoped lang="scss">
#login {
  background-image: url("https://t1.hxzdhn.com/uploads/allimg/tuku2/1049116429-7.jpg");
  background-size: 100% 100%;
  height: 100vh;
  .box {
    h1 {
      color: #616161;
      font-weight: bold;
    }
    width: 30vw;
    background-color: #fdfdfdc7;
    padding: 30px 50px;
    border-radius: 8px;
    box-shadow: 0 0 10px 2px #383434;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    // display: flex;
    // justify-content: center; /* 水平居中 */
    // align-items: center; /* 垂直居中 */
  }
}

::v-deep .ant-col.ant-form-item-control-wrapper {
  width: 100%;
}
</style>
