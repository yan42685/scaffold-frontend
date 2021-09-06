import { Result } from "@/api/rest-api";
import { messenger } from "../my-ant-design-vue";

// 请求成功或失败后的通知
export function notifyRequestResult(
    result: Result<unknown>,
    successMsg: string,
    failMsg: string
) {
    if (result.code === 0) {
        messenger.success(successMsg);
    } else {
        messenger.error(`${failMsg}，${result.message}`);
    }
}
