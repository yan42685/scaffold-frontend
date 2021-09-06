import { RoleEnum } from "@/api/rest-api";
import { StudentDTO, TeacherDTO } from "@/api/rest-api";
import { RouteLocation, RouteRecordRaw } from "vue-router";

export interface AllState {
    tabBar: TabBarState;
    layout: LayoutState;
}

export interface TabBarState {
    openTabs: Array<RouteLocation>;
}

export interface LayoutState {
    sidebarCollapsed: boolean;
}
