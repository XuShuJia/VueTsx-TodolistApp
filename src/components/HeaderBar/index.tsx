// HeaderBar
import type { FunctionalComponent } from "vue";
import Button from "../Button";
import styles from "./style.module.less";

const HeaderBar: FunctionalComponent = () => {
  const handleSetThemeLightMode = () => {
    document.body.setAttribute("data-theme", "light");
  };
  const handleSetThemeDarkMode = () => {
    document.body.setAttribute("data-theme", "dark");
  };
  return (
    <div class={styles.container}>
      <div class={styles.title}>待办事项</div>
      <div class={styles["theme-buttons"]}>
        <Button onClick={handleSetThemeLightMode}>Light</Button>
        <Button onClick={handleSetThemeDarkMode}>Drak</Button>
      </div>
    </div>
  );
};

export default HeaderBar;
