pragma solidity ^0.4.17;

contract Lottery{
    address public manager;
    address[] public players;

    constructor() public {
        manager = msg.sender;
    }

    function enter() public payable {
        //the player needs to send min of 0.01 eth to enter the lottery
        require(msg.value > 0.01 ether);
        players.push(msg.sender);
    }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, now, players)));
    }

    function pickWinner() public restricted {
        uint index = random() % players.length;
        players[index].transfer(address(this).balance);
        players = new address[](0);// the zero at end is the length of new array we want to create
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function getPlayer() public view returns(address[]) {
        return players;
    }

}
