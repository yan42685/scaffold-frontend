import { store } from "@/store";
import { ref, Ref, onMounted, onUnmounted } from "vue";
import Cookies from "js-cookie";

// 获取随机字符串
export function randomString(length = 20) {
    const charset =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = length; i > 0; --i)
        result += charset[Math.floor(Math.random() * charset.length)];
    return result;
}

// setInterval之后立即执行一次
export function setIntervalImmediately(func: Function, interval: number) {
    func();
    return setInterval(func, interval);
}

// 平整状态
export function array2Object<T extends { id: string }>(
    array: Array<T>
): { [key: string]: T } {
    return array.reduce((prev, cur) => {
        if (cur.id) {
            prev[cur.id] = cur;
        }
        return prev;
    }, {} as { [key: string]: T });
}

export function object2Array<T>(obj: { [key: string]: T }): Array<T> {
    return Object.keys(obj).map((key) => obj[key]);
}

export function isClickOutside(elementRef: Ref<null | HTMLElement>) {
    const isClickOutside = ref(false);

    const handler = (event: MouseEvent) => {
        if (
            elementRef.value &&
            elementRef.value.contains(event.target as HTMLElement)
        ) {
            isClickOutside.value = true;
        } else {
            isClickOutside.value = false;
        }
    };

    onMounted(() => {
        document.addEventListener("click", handler);
    });
    onUnmounted(() => {
        document.removeEventListener("click", handler);
    });
    return isClickOutside;
}

export function concatPath(base: string, current: string) {
    let result = "";
    if (current === "/") {
        result = "/";
    } else if (base === "" || base === "/") {
        result = "/" + current;
    } else {
        result = base.trim() + "/" + current.trim();
    }
    // HACK:
    if (result.startsWith("//")) {
        result = result.slice(1);
    }

    return result;
}

export class AutoRetryConfig {
    // 重试计数器
    retryCount = 0;
    maxRetryCount = 30;
    retryDelay = 500;
}

// fn 需要是一个失败return false, 成功返回true的函数
// HACK: 失败自动重复的通用函数
export function autoRetry(
    fn: () => boolean,
    config: AutoRetryConfig = new AutoRetryConfig()
) {
    const retryCount = config.retryCount;
    if (retryCount > config.maxRetryCount) {
        // 表示最终重试失败
        return false;
    }
    if (!fn()) {
        // console.log(`第${callSelfCount + 1}次调用失败`);
        setTimeout(
            () => autoRetry(fn, { ...config, retryCount: retryCount + 1 }),
            config.retryDelay
        );
        return false;
    }
    // console.log(`第${callSelfCount + 1}次调用成功`);
    return true;
}

export async function autoRetryAsync(
    fn: () => Promise<boolean>,
    config: AutoRetryConfig = new AutoRetryConfig()
) {
    const retryCount = config.retryCount;
    if (retryCount > config.maxRetryCount) {
        return false;
    }

    const isSuccess = await fn();
    if (!isSuccess) {
        setTimeout(
            () => autoRetryAsync(fn, { ...config, retryCount: retryCount + 1 }),
            config.retryDelay
        );
        return false;
    }
    return true;
}

export function isStrEmpty(str: string) {
    return !str || 0 === str.length;
}

export function isStrBlank(str: string) {
    return !str || /^\s*$/.test(str);
}

export const cookies = Cookies;
