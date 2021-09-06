import { RouteRecordRaw } from "vue-router";
import Framework from "@/layout/framework/Framework.vue";

export const AdministratorRoutes: RouteRecordRaw[] = [
    {
        name: "administrator",
        path: "/administrator",
        component: Framework,
        meta: {
            title: "管理信息",
        },
        children: [
            {
                name: "studentList",
                path: "studentList",
                component: () =>
                    import("@/views/administrator/StudentList.vue"),
                meta: {
                    title: "学生列表",
                },
            },
        ],
    },
];
