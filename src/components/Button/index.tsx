// Button
import { defineComponent, type PropType, defineEmits } from "vue";
import styles from "./style.module.less";

const Button = defineComponent({
  name: "SButton",
  inheritAttrs: false,
  emits: defineEmits<{
    click: (e: MouseEvent) => void;
  }>(),
  props: {
    size: {
      type: String as PropType<"default" | "small" | "large">,
      default: "default",
    },
    block: { type: Boolean, default: false },
    primary: { type: Boolean, default: false },
    danger: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    border: { type: Boolean, default: true },
    // onClick: { type: Function as PropType<(e?: MouseEvent) => void> },
  },
  setup(props, { slots, emit }) {
    // safari css active 兼容
    const handleTouchstart = () => {
      //
    };
    return () => {
      const classnames: string[] = [
        styles.button,
        styles[`button-${props.size}`],
      ];
      if (props.primary) classnames.push(styles["button-primary"]);
      if (props.danger) classnames.push(styles["button-danger"]);
      if (props.disabled) classnames.push(styles["button-disabled"]);
      if (props.border === false) classnames.push(styles["button-no-border"]);
      if (props.block) classnames.push(styles["button-block"]);

      return (
        <div
          data-button="true"
          onClick={(e) => emit("click", e)}
          class={classnames}
          onTouchstart={handleTouchstart}
        >
          {slots.default ? slots.default() : null}
        </div>
      );
    };
  },
});

export default Button;
