// useTodoList
import type { TTodoList } from "@/interface";
import { ref, watchEffect } from "vue";

export default () => {
  const todolist = ref<TTodoList>(
    (() => {
      const todolistCache: TTodoList = JSON.parse(
        window.localStorage.getItem("todolist") || "[]"
      );
      return Array.isArray(todolistCache) ? todolistCache : [];
    })()
  );

  watchEffect(() => {
    window.localStorage.setItem("todolist", JSON.stringify(todolist.value));
  });

  return {
    todolist,
  };
};
