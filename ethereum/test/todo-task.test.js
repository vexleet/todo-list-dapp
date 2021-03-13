const { assert } = require('chai');

const TodoList = artifacts.require('TodoList');
const tasksNames = ['Task #1', 'Task #2', 'Task #3'];

contract('TodoList', (accounts) => {
  let [alice, bob] = accounts;
  let contractInstance;
  beforeEach(async () => {
    contractInstance = await TodoList.new();
  });

  it("should be able to add a task and its name to equal 'Task#1'", async () => {
    const result = await contractInstance.addTask(tasksNames[0], {
      from: alice,
    });
    assert.equal(result.receipt.status, true);
    assert.equal(result.logs[0].args.name, tasksNames[0]);
  });

  it('should be able to add two tasks', async () => {
    const result1 = await contractInstance.addTask(tasksNames[0], {
      from: alice,
    });
    const result2 = await contractInstance.addTask(tasksNames[1], {
      from: alice,
    });
    const numberOfTasks = await contractInstance.tasksCount(alice);
    assert.equal(result1.receipt.status, true);
    assert.equal(result1.logs[0].args.name, tasksNames[0]);
    assert.equal(result2.receipt.status, true);
    assert.equal(result2.logs[0].args.name, tasksNames[1]);
    assert.equal(numberOfTasks, 2);
  });

  it('users should have separate tasks', async () => {
    const aliceTask = await contractInstance.addTask(tasksNames[0], {
      from: alice,
    });
    const bobTask = await contractInstance.addTask(tasksNames[0], {
      from: bob,
    });
    const aliceTaskOwnerAddress = await contractInstance.ownerOfTask(
      aliceTask.logs[0].args.todo_id
    );
    const bobTaskOwnerAddress = await contractInstance.ownerOfTask(
      bobTask.logs[0].args.todo_id
    );
    assert.equal(aliceTask.logs[0].args.name, tasksNames[0]);
    assert.equal(bobTask.logs[0].args.name, tasksNames[0]);
    assert.equal(aliceTaskOwnerAddress, alice);
    assert.equal(bobTaskOwnerAddress, bob);
    assert.notEqual(aliceTaskOwnerAddress, bobTaskOwnerAddress);
  });
});
