// Input
import { defineComponent, type PropType, defineEmits, ref } from "vue";
import styles from "./style.module.less";

const Input = defineComponent({
  name: "SInput",
  inheritAttrs: false,
  props: {
    size: {
      type: String as PropType<"default" | "small" | "large">,
      default: "default",
    },
    type: {
      type: String as PropType<"text" | "number" | "date">,
      default: "text",
    },
    value: { type: [String, Number], default: undefined },
    modelValue: { type: [String, Number], default: undefined },
    disabled: { type: Boolean, default: false },
    placeholder: { type: String, default: undefined },
    autofocus: { type: Boolean, default: false },
  },
  emits: defineEmits<{
    "update:modelValue": (value: string | number) => void;
    change: (e: Event) => void;
  }>(),
  setup(props, { emit, expose }) {
    const inputRef = ref<HTMLInputElement | null>(null);
    const focus = () => {
      if (inputRef.value) {
        inputRef.value.focus();
      }
    };
    const blur = () => {
      if (inputRef.value) {
        inputRef.value.blur();
      }
    };
    const handleChange = (e: Event) => {
      emit("update:modelValue", (e.target as HTMLInputElement).value);
      emit("change", e);
    };
    expose({ focus, blur });
    return () => {
      const classnames: string[] = [
        styles.input,
        styles[`input-${props.size}`],
      ];
      if (props.disabled) classnames.push(styles[`input-disabled`]);
      return (
        <input
          class={classnames}
          ref={inputRef}
          type={props.type}
          value={props.modelValue || props.value}
          disabled={props.disabled}
          autofocus={props.autofocus}
          placeholder={props.placeholder}
          onInput={handleChange}
        />
      );
    };
  },
});

export default Input;
