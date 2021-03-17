<template>
  <HelloWorld v-if="loading" />
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';
import { useStore } from 'vuex';
import { onMounted, ref } from 'vue';
import Web3 from 'web3';
import TodoTaskABI from './abi/todo-task_abi';

export default {
  name: 'App',
  components: {
    HelloWorld,
  },
  setup() {
    const store = useStore();
    let loading = ref(false);

    onMounted(async () => {
      const web3js = new Web3(window.ethereum);

      const web3Contract = new web3js.eth.Contract(
        TodoTaskABI,
        '0x065b13b4f4016195Eba6C7C0280f40D6B2e6B3EE'
      );

      store.dispatch('addWeb3', web3js);
      store.dispatch('addTodoContract', web3Contract);
      console.log(loading.value);
      loading.value = true;
      console.log(loading.value);
    });

    return { loading };
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

html {
  width: 100%;
  background: lightgray;
}
</style>
