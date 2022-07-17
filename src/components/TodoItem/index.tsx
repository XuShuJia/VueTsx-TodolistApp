// TodoItem
import {
  defineComponent,
  defineEmits,
  onMounted,
  reactive,
  ref,
  watchEffect,
} from "vue";
import { DeleteOutlined } from "@ant-design/icons-vue";
import Input from "../Input";
import styles from "./style.module.less";

const TodoItem = defineComponent({
  inheritAttrs: false,
  props: {
    id: { type: String, required: true },
    title: { type: String, default: "" },
    remark: { type: String, default: "" },
    date: { type: Number, default: 0 },
    complete: { type: Boolean, default: false },
    deadline: { type: Number, default: 0 },
  },
  emits: defineEmits<{
    completeChange: (id: string, complete: boolean) => void;
    delete: (id: string) => void;
    titleChange: (id: string, title: string) => void;
    remarkChange: (id: string, remark: string) => void;
  }>(),
  setup(props, { emit }) {
    let titleUpdateTimer: number | undefined;
    let remarkUpdateTimer: number | undefined;
    let menuOpenWidth = 0;
    const state = reactive({
      show: false,
    });
    const todoItemContainerRef = ref<HTMLDivElement | null>(null);
    const todoItemContentRef = ref<HTMLDivElement | null>(null);
    const todoItemDeleteRef = ref<HTMLDivElement | null>(null);
    const handleCardTouchstart = (e: TouchEvent) => {
      const startX = e.touches[0].clientX;
      const handleTouchmove = (touchMoveEvent: TouchEvent) => {
        touchMoveEvent.preventDefault();
        touchMoveEvent.stopPropagation();
        const currentX = touchMoveEvent.touches[0].clientX;
        const distance = currentX - startX;
        if (currentX > startX) {
          // 往右边滑动，如果menuOpened或者menuOpenWidth大于0则向右滑动关闭menu
          menuOpenWidth += distance;
          menuOpenWidth = menuOpenWidth >= -10 ? 0 : menuOpenWidth;
        } else if (currentX < startX) {
          // 往左边滑动，如果menuOpened为false，则继续滑动直至完全打开menu
          // distance = distance <= -50 ? -60 : distance;
          menuOpenWidth = distance;
          menuOpenWidth = menuOpenWidth <= -50 ? -60 : menuOpenWidth;
        }
        const opacity = ((Math.abs(distance) / 100) * 100) / 60;
        if (todoItemContentRef.value instanceof HTMLDivElement) {
          todoItemContentRef.value.style.transform = `translateX(${menuOpenWidth}px)`;
        }
        if (todoItemDeleteRef.value instanceof HTMLDivElement) {
          todoItemDeleteRef.value.style.opacity = String(opacity);
        }
      };
      const handleTouchend = () => {
        if (menuOpenWidth < 0) {
          const handleCloseMenu = () => {
            menuOpenWidth = 0;
            if (todoItemContentRef.value instanceof HTMLDivElement) {
              todoItemContentRef.value.style.transform = `translateX(${menuOpenWidth}px)`;
            }
            if (todoItemDeleteRef.value instanceof HTMLDivElement) {
              todoItemDeleteRef.value.style.opacity = String(0);
            }
            window.removeEventListener("touchstart", handleCloseMenu);
          };
          window.addEventListener("touchstart", handleCloseMenu);
        }
        if (menuOpenWidth < 0 && menuOpenWidth !== -60) {
          menuOpenWidth = 0;
          if (todoItemContentRef.value instanceof HTMLDivElement) {
            todoItemContentRef.value.style.transform = `translateX(${menuOpenWidth}px)`;
          }
          if (todoItemDeleteRef.value instanceof HTMLDivElement) {
            todoItemDeleteRef.value.style.opacity = String(0);
          }
        }
        window.removeEventListener("touchmove", handleTouchmove);
        window.removeEventListener("touchend", handleTouchend);
      };
      window.addEventListener("touchmove", handleTouchmove);
      window.addEventListener("touchend", handleTouchend);
    };
    const handleDeleteTodoItem = () => {
      if (
        todoItemContainerRef.value instanceof HTMLDivElement &&
        todoItemContentRef.value instanceof HTMLDivElement &&
        todoItemDeleteRef.value instanceof HTMLDivElement
      ) {
        const rect = todoItemContainerRef.value.getBoundingClientRect();
        todoItemContainerRef.value.style.transitionDuration = "0.3s";
        todoItemContentRef.value.style.transitionDuration = "0.3s";
        todoItemContainerRef.value.style.height = `${rect.height}px`;
        todoItemContentRef.value.style.transform = `translateX(-${rect.width}px)`;
        todoItemDeleteRef.value.style.transition = `widht 0.3s ease,opacity 1s ease`;
        todoItemDeleteRef.value.style.width = `${rect.width}px`;
        todoItemDeleteRef.value.style.opacity = "1";
        setTimeout(() => {
          (todoItemContainerRef.value as HTMLDivElement).style.background =
            "transparent";
          (todoItemContainerRef.value as HTMLDivElement).style.height = "2px";
          (todoItemDeleteRef.value as HTMLDivElement).style.opacity = "0";
          (todoItemContainerRef.value as HTMLDivElement).style.marginBottom =
            "0px";
        }, 0);
      }
      setTimeout(() => {
        emit("delete", props.id);
      }, 1000);
    };
    watchEffect(() => {
      if (todoItemDeleteRef.value instanceof HTMLDivElement) {
        todoItemDeleteRef.value.addEventListener("touchstart", (e) => {
          e.stopPropagation();
        });
      }
    });
    onMounted(() => {
      setTimeout(() => {
        state.show = true;
      }, 100);
    });
    return () => {
      return (
        <div
          ref={todoItemContainerRef}
          class={styles["todo-item"]}
          data-show={state.show}
          onTouchstart={handleCardTouchstart}
        >
          <div ref={todoItemContentRef} class={styles["todo-item-content"]}>
            <div class={styles["todo-item-left"]}>
              <input
                type="checkbox"
                checked={props.complete}
                onChange={(e) => {
                  emit(
                    "completeChange",
                    props.id,
                    (e.target as HTMLInputElement).checked
                  );
                }}
              />
            </div>
            <div class={styles["todo-item-right"]}>
              <div class={styles["todo-item-input"]}>
                <div class={styles["todo-item-input-title"]}>标题</div>
                <Input
                  value={props.title}
                  onChange={(e) => {
                    clearTimeout(titleUpdateTimer);
                    titleUpdateTimer = setTimeout(() => {
                      emit(
                        "titleChange",
                        props.id,
                        (e.target as HTMLInputElement).value
                      );
                    }, 200);
                  }}
                />
              </div>
              <div class={styles["todo-item-input"]}>
                <div class={styles["todo-item-input-title"]}>备注</div>
                <Input
                  value={props.remark}
                  onChange={(e) => {
                    clearTimeout(remarkUpdateTimer);
                    remarkUpdateTimer = setTimeout(() => {
                      emit(
                        "remarkChange",
                        props.id,
                        (e.target as HTMLInputElement).value
                      );
                    }, 200);
                  }}
                />
              </div>
            </div>
          </div>
          <div
            ref={todoItemDeleteRef}
            class={styles["todo-item-delete"]}
            onClick={handleDeleteTodoItem}
          >
            <DeleteOutlined />
          </div>
        </div>
      );
    };
  },
});

export default TodoItem;
