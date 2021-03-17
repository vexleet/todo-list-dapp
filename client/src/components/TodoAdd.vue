<template>
  <div>
    <input type="text" v-model="newItem" />

    <button :disabled="addButtonIsDisabled" @click="addItem">Add Task</button>

    <p v-if="addButtonIsDisabled">Mining...</p>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
export default {
  setup() {
    const store = useStore();
    const newItem = ref('');
    const addButtonIsDisabled = ref(false);

    const addItem = async () => {
      addButtonIsDisabled.value = true;
      const accounts = await store.state.web3.eth.getAccounts();
      await store.state.todoContract.methods
        .addTask(newItem.value)
        .send({ from: accounts[0] });

      store.dispatch('updateTodos', accounts[0]);
      addButtonIsDisabled.value = false;
    };

    return { newItem, addButtonIsDisabled, addItem };
  },
};
</script>

<style></style>
