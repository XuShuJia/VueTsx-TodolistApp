// Panel
import {
  defineComponent,
  nextTick,
  reactive,
  watchEffect,
  defineEmits,
  onMounted,
  type VNode,
  type PropType,
  type Component,
  createApp,
  type App,
} from "vue";
import styles from "./style.module.less";

const Panel = defineComponent({
  name: "SPanel",
  inheritAttrs: false,
  emits: defineEmits<{
    close: () => void;
    closed: () => void;
    ok: () => void;
    cancel: () => void;
    mounted: (doClosePanel: () => void) => void;
  }>(),
  props: {
    title: { type: [String] as PropType<string | VNode>, required: true },
    visible: { type: Boolean, default: false },
    okButtonName: { type: String, default: "确定" },
    okButtonClose: { type: Boolean, default: true },
    cancelButtonName: { type: String, default: "取消" },
    cancelButtonClose: { type: Boolean, default: true },
    commandMode: { type: Boolean, default: false },
  },
  setup(props, { slots, emit }) {
    const state = reactive({
      render: false,
      show: false,
    });
    // 处理关闭面板
    const doClosePanel = () => {
      state.show = false;
      nextTick(() => {
        setTimeout(() => {
          state.render = false;
          emit("closed");
        }, 300);
      });
    };
    // safari css active 兼容
    const handleTouchstart = () => {
      //
    };
    // 声明模式处理打开和关闭Panel
    watchEffect(() => {
      if (!props.commandMode) {
        if (props.visible && !state.render && !state.show) {
          state.render = true;
          nextTick(() => {
            setTimeout(() => {
              state.show = true;
            }, 0);
          });
        }
        if (!props.visible && state.render && state.show) {
          doClosePanel();
        }
      }
    });
    // 处理指令模式
    onMounted(() => {
      if (props.commandMode) {
        state.render = true;
        nextTick(() => {
          setTimeout(() => {
            state.show = true;
          }, 0);
        });
        emit("mounted", doClosePanel);
      }
    });
    return () => {
      if (state.render) {
        return (
          <div data-show={state.show} class={styles.container}>
            <div class={styles.panel} onClick={(e) => e.stopPropagation()}>
              <div class={styles.header}>
                <div
                  data-button="cancel"
                  class={styles["header-button"]}
                  onTouchstart={handleTouchstart}
                  onClick={() => {
                    emit("cancel");
                    if (props.cancelButtonClose) {
                      emit("close");
                      if (props.commandMode) {
                        doClosePanel();
                      }
                    }
                  }}
                >
                  {props.cancelButtonName}
                </div>
                <div class={styles["header-title"]}>{props.title}</div>
                <div
                  data-button="ok"
                  class={styles["header-button"]}
                  onTouchstart={handleTouchstart}
                  onClick={() => {
                    emit("ok");
                    if (props.okButtonClose) {
                      emit("close");
                      if (props.commandMode) {
                        doClosePanel();
                      }
                    }
                  }}
                >
                  {props.okButtonName}
                </div>
              </div>
              <div class={styles.content}>
                {slots.default ? slots.default() : null}
              </div>
            </div>
          </div>
        );
      }
      return null;
    };
  },
});

interface ICommandPanelProps {
  commandMode: boolean;
  onMounted: (doClosePanel: () => void) => void;
  onClosed: () => void;
  doClosePanel: () => void;
}
const CreatePanel = <P,>(
  Content: (contentProps: {
    panelProps: ICommandPanelProps;
    payload: P;
  }) => Component
) => {
  return (props?: P) => {
    let _container: HTMLDivElement | null = null;
    let _instance: App | null = null;
    // remove container
    const _removeContainer = () => {
      if (_container instanceof HTMLDivElement) {
        document.body.removeChild(_container);
      }
    };
    // 默认处理直接卸载Panel
    let _doClosePanel = () => {
      if (_instance) {
        _instance.unmount();
        _removeContainer();
      }
    };
    const open = (payload = {} as unknown as P) => {
      const instance = createApp(
        Content({
          payload,
          panelProps: {
            commandMode: true,
            onMounted(doClosePanel) {
              // 当Panel挂载后替换默认关闭处理
              _doClosePanel = doClosePanel;
            },
            onClosed() {
              _removeContainer();
            },
            doClosePanel: () => {
              _doClosePanel();
            },
          },
        })
      );
      _instance = instance;
      _container = document.createElement("div");
      document.body.appendChild(_container);
      instance.mount(_container);
    };
    const close = () => {
      _doClosePanel();
    };
    open(props);
    return {
      open,
      close,
    };
  };
};

export { CreatePanel };
export default Panel;
