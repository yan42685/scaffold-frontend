import { messenger } from "./my-ant-design-vue";
import { randomString, setIntervalImmediately } from "./basic-lib";
import { router } from "@/router";

export function loginRedirect() {
  const key: string = randomString();
  let timeout = 3;

  const interval = setIntervalImmediately(() => {
    if (timeout > 0) {
      messenger.info({
        content: `您尚未登录, ${timeout}秒后回到登录页面`,
        key,
        duration: timeout
      });
      --timeout;
    } else {
      clearInterval(interval);
      router.push("/login");
    }
  }, 1000);
}

export function homeRedirect() {
  const key: string = randomString();
  let timeout = 3;

  const interval = setIntervalImmediately(() => {
    if (timeout > 0) {
      messenger.info({
        content: `将在${timeout}秒后回到首页`,
        key,
        duration: timeout
      });
      --timeout;
    } else {
      clearInterval(interval);
      router.push("/home");
    }
  }, 1000);
}
