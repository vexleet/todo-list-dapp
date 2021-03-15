pragma solidity ^0.8.2;

contract TodoList {
    event NewTask(uint256 todo_id, string name, bool is_done);

    uint256 randNonce = 0;

    struct TodoTask {
        uint256 todo_id;
        string name;
        bool is_done;
    }

    struct TaskInfo {
        address owner;
        uint256 indexOfTodoTask;
    }

    TodoTask[] tasks;

    mapping(uint256 => TaskInfo) public ownerOfTask;
    mapping(address => uint256) public tasksCount;

    modifier onlyOwnerOf(uint256 _todoId) {
        require(msg.sender == ownerOfTask[_todoId].owner);
        _;
    }

    function addTask(string memory _name) external {
        TodoTask memory newTask = TodoTask(randMod(100), _name, false);
        tasks.push(newTask);
        ownerOfTask[newTask.todo_id] = TaskInfo(msg.sender, tasks.length - 1);
        tasksCount[msg.sender] = tasks.length;
        emit NewTask(newTask.todo_id, newTask.name, newTask.is_done);
    }

    function removeTask(uint256 taskId) external onlyOwnerOf(taskId) {
        TaskInfo memory taskInfo = ownerOfTask[taskId];
        delete tasks[taskInfo.indexOfTodoTask];
        delete ownerOfTask[taskId];
        tasksCount[msg.sender]--;
    }

    function getTasks() external view returns (TodoTask[] memory) {
        TodoTask[] memory result = new TodoTask[](tasksCount[msg.sender]);
        uint256 counter = 0;
        for (uint256 i = 0; i < tasks.length; i++) {
            if (ownerOfTask[tasks[i].todo_id].owner == msg.sender) {
                result[counter] = tasks[i];
                counter++;
            }
            if (tasksCount[msg.sender] == counter) {
                break;
            }
        }
        return result;
    }

    function completeTask(uint256 taskId) external onlyOwnerOf(taskId) {
        TaskInfo memory taskInfo = ownerOfTask[taskId];
        tasks[taskInfo.indexOfTodoTask].is_done = true;
    }

    function randMod(uint256 _modulus) internal returns (uint256) {
        // increase nonce
        randNonce++;
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.timestamp, msg.sender, randNonce)
                )
            ) % _modulus;
    }
}
