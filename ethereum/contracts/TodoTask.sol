pragma solidity ^0.8.2;

contract TodoList {
    event NewTask(uint256 todo_id, string name, bool is_done);

    uint256 randNonce = 0;

    struct TodoTask {
        uint256 todo_id;
        string name;
        bool is_done;
    }

    TodoTask[] tasks;

    mapping(uint256 => address) public ownerOfTask;
    mapping(address => uint256) public tasksCount;

    function addTask(string memory _name) external {
        TodoTask memory newTask = TodoTask(randMod(100), _name, false);
        tasks.push(newTask);
        ownerOfTask[newTask.todo_id] = msg.sender;
        tasksCount[msg.sender] = tasks.length;
        emit NewTask(newTask.todo_id, newTask.name, newTask.is_done);
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
