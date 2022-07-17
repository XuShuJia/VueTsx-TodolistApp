// TodoList
import { defineComponent, onMounted, reactive } from "vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import styles from "./styles/style.module.less";
import HeaderBar from "./components/HeaderBar";
import Content from "./components/Content";
import FooterBar from "./components/FooterBar";
import Button from "./components/Button";
import TodoItem from "./components/TodoItem";
import EmptyMessage from "./components/EmptyMessage";
import AddNewTodoPanel from "./components/AddNewTodoPanel";
import useTodoList from "./hooks/useTodoList";

const TodoList = defineComponent({
  setup() {
    const state = reactive({
      appShow: false,
    });
    const { todolist } = useTodoList();
    const handleAddNewTodo = () => {
      AddNewTodoPanel({
        onOk(todo) {
          todolist.value.push(todo);
        },
      });
    };
    const handleDeleteTodoItem = (id: string) => {
      todolist.value = todolist.value.filter((item) => item.id !== id);
    };
    const handleTitleChange = (id: string, title: string) => {
      todolist.value.forEach((todo) => {
        if (todo.id === id) {
          todo.title = title;
        }
      });
    };
    const handleRemarkChange = (id: string, remark: string) => {
      todolist.value.forEach((todo) => {
        if (todo.id === id) {
          todo.remark = remark;
        }
      });
    };
    const handleComplateChange = (id: string, complete: boolean) => {
      todolist.value.forEach((todo) => {
        if (todo.id === id) {
          todo.complete = complete;
        }
      });
    };
    onMounted(() => {
      setTimeout(() => {
        state.appShow = true;
      }, 100);
    });
    return () => {
      return (
        <div
          class={[
            styles.container,
            state.appShow ? styles["app-show"] : undefined,
          ]}
        >
          <HeaderBar />
          <Content>
            {todolist.value.length === 0 ? <EmptyMessage /> : null}
            {todolist.value.map((item) => {
              return (
                <TodoItem
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  remark={item.remark}
                  date={item.date}
                  complete={item.complete}
                  deadline={item.deadline}
                  onDelete={handleDeleteTodoItem}
                  onTitleChange={handleTitleChange}
                  onRemarkChange={handleRemarkChange}
                  onCompleteChange={handleComplateChange}
                />
              );
            })}
          </Content>
          <FooterBar>
            <Button primary onClick={handleAddNewTodo}>
              <PlusOutlined />
              新待办事项
            </Button>
          </FooterBar>
        </div>
      );
    };
  },
});

export default TodoList;
