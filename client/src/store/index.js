import { createStore } from 'vuex';

export default createStore({
  state: {
    web3: null,
    todoContract: null,
    todos: null,
  },
  mutations: {
    SET_WEB3(state, data) {
      state.web3 = data;
    },
    SET_TODO_CONTRACT(state, data) {
      state.todoContract = data;
    },
    SET_TODOS(state, data) {
      state.todos = data;
    },
  },
  actions: {
    addWeb3({ commit }, web3) {
      commit('SET_WEB3', web3);
    },
    addTodoContract({ commit }, todoContract) {
      commit('SET_TODO_CONTRACT', todoContract);
    },
    addTodos({ commit }, todos) {
      commit('SET_TODOS', todos);
    },
    async updateTodos({ commit, state }, account) {
      const todos = await state.todoContract.methods.getTasks().call({
        from: account,
      });
      console.log(todos);
      commit('SET_TODOS', todos);
    },
  },
  modules: {},
});
