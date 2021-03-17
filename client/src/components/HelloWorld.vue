<template>
  <todo-add></todo-add>

  <div class="todos">
    <todo-item
      v-for="(todo, index) in todos"
      :key="todo.id"
      :todoItemIndex="index"
    ></todo-item>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import TodoItem from './TodoItem';
import TodoAdd from './TodoAdd';

export default {
  components: {
    TodoItem,
    TodoAdd,
  },
  setup() {
    const store = useStore();
    let todos = ref([]);

    onMounted(async () => {
      const accounts = await store.state.web3.eth.getAccounts();
      // await store.state.todoContract.methods
      //   .addTask('Test')
      //   .send({ from: accounts[0] });
      todos.value = await store.state.todoContract.methods.getTasks().call({
        from: accounts[0],
      });

      store.dispatch('addTodos', todos.value);
    });

    return { todos };
  },
};
</script>

<style lang="scss" scoped>
.todos {
  width: 400px;
  margin: 0 auto;
}
</style>
