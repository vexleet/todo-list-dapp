<template>
  <div class="todo-item">
    <p :style="{ textDecoration: todoItem.is_done ? 'line-through' : 'none' }">
      {{ todoItem.name }}
    </p>
    <button :disabled="isMining || todoItem.is_done" @click="completeTask">
      Complete Item
    </button>
    <button :disabled="isMining" @click="deleteItem">Delete Item</button>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
export default {
  name: 'TodoItem',
  props: {
    todoItemIndex: {
      required: true,
      type: Number,
    },
  },
  setup(props) {
    const store = useStore();
    const todoItem = store.state.todos[props.todoItemIndex];
    const isMining = ref(false);

    const deleteItem = async () => {
      isMining.value = true;
      const accounts = await store.state.web3.eth.getAccounts();
      await store.state.todoContract.methods
        .removeTask(todoItem.todo_id)
        .send({ from: accounts[0] });
      store.dispatch('updateTodos', accounts[0]);
      isMining.value = false;
    };

    const completeTask = async () => {
      isMining.value = true;
      const accounts = await store.state.web3.eth.getAccounts();
      await store.state.todoContract.methods
        .completeTask(todoItem.todo_id)
        .send({ from: accounts[0] });
      store.dispatch('updateTodos', accounts[0]);
      isMining.value = false;
    };

    return {
      todoItem,
      isMining,
      deleteItem,
      completeTask,
    };
  },
};
</script>

<style lang="scss" scoped>
.todo-item {
  padding: 10px 0;
  border-radius: 50px;
  background: #fff;
  box-shadow: 1px solid;
  margin-bottom: 20px;
  box-shadow: 0 0 10px #666666;
}
</style>
