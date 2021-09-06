import { store } from "@/store";
import { computed } from "vue";

const openTabs = computed(() => store.state.tabBar.openTabs);

export function getTabByPath(path: string) {
  return openTabs.value.find(tab => tab.path === path);
}
