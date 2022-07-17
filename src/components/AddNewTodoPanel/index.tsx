// AddNewTodoPanel
import { reactive, defineComponent } from "vue";
import { nanoid } from "nanoid";
import styles from "./style.module.less";
import Panel, { CreatePanel } from "../Panel";
import Input from "../Input";
import type { ITodoItem } from "@/interface";

interface IAddNewTodoPanelProps {
  onOk: (todo: ITodoItem) => void;
}

const AddNewTodoPanel = CreatePanel<IAddNewTodoPanelProps>(
  ({ panelProps, payload }) => {
    return defineComponent({
      setup() {
        const state = reactive<ITodoItem>({
          id: nanoid(),
          title: "",
          remark: "",
          date: 0,
          complete: false,
          deadline: 0,
        });
        const handleClickOkButton = () => {
          payload.onOk(state);
        };
        return () => {
          return (
            <Panel
              {...panelProps}
              title="新待办事项"
              onOk={handleClickOkButton}
            >
              <div class={styles["form-item"]}>
                <div class={styles["form-item-title"]}>标题</div>
                <Input size="large" v-model={state.title} />
              </div>
              <div class={styles["form-item"]}>
                <div class={styles["form-item-title"]}>备注</div>
                <Input size="large" v-model={state.remark} />
              </div>
            </Panel>
          );
        };
      },
    });
  }
);

export default AddNewTodoPanel;
