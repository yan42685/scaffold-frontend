import { MutationTree, GetterTree } from "vuex";
import { AllState } from "../types";
import { RouteLocation, RouteRecord } from "vue-router";
import { hasPermission } from "@/utils/route";

export const tabBarMutations: MutationTree<AllState> = {
  addTab({ tabBar }, newTab: RouteLocation | RouteRecord) {
    if (newTab.meta && newTab.meta.hidden) {
      // 不添加隐藏的tab
      return;
    }
    const tabExists = !!tabBar.openTabs.find(
      (tab: RouteLocation) => tab.path == newTab.path
    );
    if (!tabExists) {
      tabBar.openTabs.push(Object.assign({} as RouteLocation, newTab));
    }
  },

  deleteTab({ tabBar }, targetTab: RouteLocation) {
    tabBar.openTabs.forEach((tab, index) => {
      if (tab.path === targetTab.path) {
        tabBar.openTabs.splice(index, 1);
      }
    });
  },

  deleteOtherTabs({ tabBar }, currentTab: RouteLocation) {
    tabBar.openTabs = tabBar.openTabs.filter((tab: RouteLocation) => {
      if (tab.meta && tab.meta.affix) {
        return true;
      } else if (tab.path == currentTab.path) {
        return true;
      } else {
        return false;
      }
    });
  },

  deleteLeftTabs({ tabBar }, currentTab: RouteLocation) {
    let index = tabBar.openTabs.length;
    const openTabs = tabBar.openTabs;
    tabBar.openTabs = openTabs.filter((tab: RouteLocation) => {
      if (tab.name === currentTab.name) {
        index = openTabs.indexOf(tab);
      }
      return tab.meta.affix || openTabs.indexOf(tab) >= index;
    });
  },

  deleteRightTabs({ tabBar }, currentTab: RouteLocation) {
    let index = tabBar.openTabs.length;
    const openTabs = tabBar.openTabs;
    tabBar.openTabs = openTabs.filter((tab: RouteLocation) => {
      if (tab.name === currentTab.name) {
        index = openTabs.indexOf(tab);
      }
      return tab.meta.affix || openTabs.indexOf(tab) <= index;
    });
  },

  deleteAllTabs({ tabBar }) {
    tabBar.openTabs = tabBar.openTabs.filter(
      (tab: RouteLocation) => tab.meta && tab.meta.affix
    );
  },

  clearNoPermissionTabs({ tabBar }) {
    tabBar.openTabs = tabBar.openTabs.filter((tab: RouteLocation) =>
      hasPermission(tab)
    );
  }
};
