export const settings: any = {};

// 运行时可变的配置
export class AppConfig {
    theme: "light" | "dark" = "light";
}

// 运行时不可变的配置
export class InternalConfig {
    accessControl = true; // 是否开启权限控制
    loginInterception = true; // 是否开启登录拦截
    appName = "Aspirin Platform";
    keepAliveMaxNum = 10;
    isDebug = false;
    // debug 模式下自动登录的角色
    debugRole: "ADMINISTRATOR" | "STUDENT" | "TEACHER" = "TEACHER";
    defaultAvatar =
        "http://qiniu-cdn.alexyan.cn/administrator/admin1/avatar/defaultAvatar.jpg";
}

export const internalConfig = new InternalConfig();
export const appConfig = new AppConfig();
