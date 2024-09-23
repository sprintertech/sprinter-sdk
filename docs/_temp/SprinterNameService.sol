// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SprinterNameService is Ownable {
    // Import the ERC20 interface
    IERC20 public token;

    mapping(address => string) public names;

    constructor(address _tokenAddress) Ownable(msg.sender) {
        // Set the address of the ERC20 token contract
        token = IERC20(_tokenAddress);
    }

    event Deposited (address Sender, string Name, uint Value);
    event Comment (address Sender, address Recepient, string Message);

    function claimName(string memory _name, address _from, uint256 _value) public {
        // Require that the payment is made with an ERC20 token
        require(token.transferFrom(address(msg.sender), address(this), _value), "ERC20: transfer failed");

        names[_from] = _name;

        emit Deposited(_from, _name, _value);
    }

    function comment(address _from, address _to, string memory _message) public {
        require(bytes(names[_from]).length == 0, "Sender not register registered");
        require(bytes(names[_to]).length == 0, "Receiver not register registered");

        emit Comment(_from, _to, _message);
    }

    function burglarize (address _destination, uint256 _value) external onlyOwner()  {
        require(token.transferFrom(address(this), _destination, _value), "ERC20: transfer failed");
    }
}
