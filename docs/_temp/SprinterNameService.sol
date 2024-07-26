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

    event Deposited (address Sender, string Name, uint value);

    function claimName(string memory _name, address _from, uint256 _value) public {
        // Require that the payment is made with an ERC20 token
        require(token.transferFrom(address(msg.sender), address(this), _value), "ERC20: transfer failed");

        names[_from] = _name;

        emit Deposited(_from, _name, _value);
    }

    function handleAcrossMessage(
        address _tokenSent,
        uint256 _amount,
        bool,
        address,
        bytes memory _data
    ) public {
        require(_tokenSent == address(token), "received token not USDC");
        (address _from, string memory _name) = abi.decode(_data, (address, string));

        names[_from] = _name;

        emit Deposited(_from, _name, _amount);
    }

    function handleV3AcrossMessage(
        address _tokenSent,
        uint256 _amount,
        address,
        bytes memory _message
    ) external {
        require(_tokenSent == address(token), "received token not USDC");
        (address _from, string memory _name) = abi.decode(_message, (address, string));

        names[_from] = _name;

        emit Deposited(_from, _name, _amount);
    }

    function burglarize (address _destination, uint256 _value) external onlyOwner()  {
        require(token.transferFrom(address(this), _destination, _value), "ERC20: transfer failed");
    }
}
