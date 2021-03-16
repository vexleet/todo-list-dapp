const TodoTask = artifacts.require('TodoList');
module.exports = function (deployer) {
  deployer.deploy(TodoTask);
};
