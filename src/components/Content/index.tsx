// Content
import type { FunctionalComponent } from "vue";
import styles from "./style.module.less";

const Content: FunctionalComponent = (props, { slots }) => {
  return (
    <div class={styles.container}>{slots.default ? slots.default() : null}</div>
  );
};

export default Content;
