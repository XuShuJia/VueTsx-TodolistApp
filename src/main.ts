import { createApp } from "vue";
import "normalize.css";
import "./styles/reset.less";
import TodoList from "./app";

createApp(TodoList).mount("#app");

// 禁用safari双指缩放页面
document.body.addEventListener("gesturestart", function (event) {
  event.preventDefault();
});

// 匹配系统亮度模式
if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  document.body.setAttribute("data-theme", "dark");
} else {
  document.body.setAttribute("data-theme", "light");
}
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    if (e.matches) {
      document.body.setAttribute("data-theme", "dark");
    } else {
      document.body.setAttribute("data-theme", "light");
    }
  });
