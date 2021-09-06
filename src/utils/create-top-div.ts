import { onUnmounted } from "vue";

// 在setup函数中使用, 让需要独立的组件teleport到这个div即可
export function createTopDiv(divId: string) {
  const div = document.createElement("div");
  div.id = divId;
  document.body.append(div);
  onUnmounted(() => {
    document.body.removeChild(div);
  });
}
