import { internalConfig } from "@/config/app-settings";
import { getAccessToken } from "@/utils/cookies";
import { messenger } from "@/utils/my-ant-design-vue";
import { hasPermission, updateDynamicRoutes } from "@/utils/route";
import { homeRedirect, loginRedirect } from "@/utils/timeout-actions";
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Framework from "../layout/framework/Framework.vue";
import { AdministratorRoutes } from "./modules/administrator";

// 旧版本是RouteConfig 新版本是RouteRecordRaw
export const staticRootRoutes: Array<RouteRecordRaw> = [
    {
        path: "/",
        component: Framework,
        redirect: "/home",
        children: [
            {
                path: "home",
                name: "Home",
                component: () => import("../views/pages/UseHome.vue"),
                meta: {
                    title: "首页",
                    icon: "home-4-line",
                    // 是否固定到标签页
                    affix: true,
                },
            },
        ],
    },

    {
        name: "Login",
        path: "/login",
        component: () => import("../views/Login.vue"),
        meta: {
            // 决定是否出现在侧栏菜单中
            hidden: true,
        },
    },
    {
        name: "error-page",
        path: "/error-page",
        component: Framework,
        meta: {
            hidden: true,
        },
        children: [
            {
                name: "404",
                path: "404",
                component: () => import("@/views/404.vue"),
                meta: {
                    hidden: true,
                    title: "404",
                },
            },
        ],
    },
];

export const dynamicRootRoutes: RouteRecordRaw[] = [
    {
        name: "Page",
        path: "/page",
        component: Framework,
        meta: {
            title: "首页",
            icon: "home",
            // affix: true // TODO: 取消注释
        },
        children: [
            {
                name: "Test1",
                path: "test",
                component: () => import("../views/pages/TestOne.vue"),
                meta: { title: "测试页面" },
            },
            {
                name: "Test2",
                path: "test-two",
                component: () => import("../views/pages/TestTwo.vue"),
                meta: { title: "测试页面 Two" },
            },
            {
                name: "UserCenter",
                path: "user-center",
                component: () => import("../views/pages/UserCenter.vue"),
                meta: {
                    title: "用户中心",
                },
            },
        ],
    },

    // 模块
    ...AdministratorRoutes,

    // 在动态路由注入后，再注入404重定向规则，以确保该规则置于路由表最底部
    {
        path: "/:catchAll(.*)",
        redirect: "/error-page/404",
        meta: {
            hidden: true,
        },
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes: staticRootRoutes,
});

const ROUTE_WHITE_LIST = ["/login", "/register", "/404"];

router.beforeEach(async (to, from, next) => {
    updateDynamicRoutes();
    if (ROUTE_WHITE_LIST.includes(to.path)) {
        next();
    } else if (internalConfig.loginInterception && !getAccessToken()) {
        loginRedirect();
    } else if (internalConfig.accessControl && !hasPermission(to)) {
        messenger.warning("抱歉，您没有权限访问此资源");
        homeRedirect();
    } else {
        // TODO: 待处理
        next();
    }
});

router.afterEach((to) => {
    if (to.meta && to.meta.title) {
        document.title = to.meta.title + " - " + internalConfig.appName;
    }
});

// 刷新页面后执行
updateDynamicRoutes();

export { router };
