// EmptyMessage
import styles from "./style.module.less";

const EmptyMessage = () => {
  return (
    <div class={styles.container}>
      <div>暂无待办事项</div>
    </div>
  );
};

export default EmptyMessage;
