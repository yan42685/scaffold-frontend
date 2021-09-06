import { createStore } from "vuex";
import { tabBarMutations } from "./modules/tab-bar";
import { AllState } from "./types";

export const store = createStore<AllState>({
    state: {
        tabBar: { openTabs: [] },
        layout: { sidebarCollapsed: false },
    },

    getters: {},

    mutations: {
        // ==========================
        //  路由
        // ==========================
        toggleSidebarCollapse({ layout }) {
            layout.sidebarCollapsed = !layout.sidebarCollapsed;
        },
        // ==========================
        //  标签页
        // ==========================
        ...tabBarMutations,
    },

    actions: {},
});
