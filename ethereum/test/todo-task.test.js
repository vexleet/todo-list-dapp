const { assert } = require('chai');
const utils = require('./helpers/utils');

const TodoList = artifacts.require('TodoList');
const tasksNames = [
  'Task #1',
  'Task #2',
  'Task #3',
  'Task #4',
  'Task #5',
  'Task #6',
];

contract('TodoList', (accounts) => {
  let [alice, bob] = accounts;
  let contractInstance;
  beforeEach(async () => {
    contractInstance = await TodoList.new();
  });

  describe('Adding Tasks', () => {
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
      assert.equal(aliceTaskOwnerAddress.owner, alice);
      assert.equal(bobTaskOwnerAddress.owner, bob);
      assert.notEqual(aliceTaskOwnerAddress.owner, bobTaskOwnerAddress.owner);
    });
  });

  describe('Getting Tasks', () => {
    it('should return correct count of tasks', async () => {
      for (let i = 1; i <= 3; i++) {
        await contractInstance.addTask(tasksNames[0], {
          from: alice,
        });
      }
      const numberOfTasks = await contractInstance.getTasks({ from: alice });

      assert.equal(numberOfTasks.length, 3);
    });

    it('should return correct names of tasks', async () => {
      for (let i = 1; i <= 3; i++) {
        await contractInstance.addTask(tasksNames[i - 1], {
          from: alice,
        });
      }

      const aliceTasks = await contractInstance.getTasks({ from: alice });

      for (let i = 0; i < aliceTasks; i++) {
        assert.equal(aliceTasks.name, tasksNames[i]);
      }
    });

    it('should return tasks corresponding to the different users', async () => {
      for (let i = 1; i <= 3; i++) {
        await contractInstance.addTask(tasksNames[i - 1], {
          from: alice,
        });
      }
      for (let i = 4; i <= 6; i++) {
        await contractInstance.addTask(tasksNames[i - 1], {
          from: bob,
        });
      }

      const aliceTasks = await contractInstance.getTasks({ from: alice });
      const bobTasks = await contractInstance.getTasks({ from: bob });

      for (let i = 0; i < aliceTasks; i++) {
        assert.equal(aliceTasks.name, tasksNames[i]);
      }

      for (let i = 0; i < bobTasks; i++) {
        assert.equal(bobTasks.name, tasksNames[i + 3]);
      }
    });
  });

  describe('Completing Tasks', () => {
    it('should complete task', async () => {
      const aliceTask = await contractInstance.addTask(tasksNames[0], {
        from: alice,
      });
      await contractInstance.completeTask(aliceTask.logs[0].args.todo_id, {
        from: alice,
      });
      const aliceTasks = await contractInstance.getTasks({ from: alice });
      assert.equal(aliceTasks[0].is_done, true);
    });

    it('user should not complete other user task', async () => {
      const aliceTask = await contractInstance.addTask(tasksNames[0], {
        from: alice,
      });
      await utils.shouldThrow(
        contractInstance.completeTask(aliceTask.logs[0].args.todo_id, {
          from: bob,
        })
      );
    });
  });

  describe('Deleting Tasks', () => {
    it('should delete task', async () => {
      const aliceTask = await contractInstance.addTask(tasksNames[0], {
        from: alice,
      });
      await contractInstance.removeTask(aliceTask.logs[0].args.todo_id, {
        from: alice,
      });
      const aliceTasks = await contractInstance.getTasks({ from: alice });
      assert.equal(aliceTasks.length, 0);
    });

    it('user should not delete other user task', async () => {
      const aliceTask = await contractInstance.addTask(tasksNames[0], {
        from: alice,
      });
      await utils.shouldThrow(
        contractInstance.removeTask(aliceTask.logs[0].args.todo_id, {
          from: bob,
        })
      );
    });
  });
});
