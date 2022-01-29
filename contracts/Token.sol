//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract Token is ERC20('Test', 'TST') {
    constructor() {
        _mint(msg.sender, 1_000_000_000 ether);
    }
}
