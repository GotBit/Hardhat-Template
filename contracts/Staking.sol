//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract Staking is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public tokenA;
    IERC20 public tokenB;

    uint256[] public rate = [1, 100];

    struct Stake {
        uint256 startTimestamp;
        uint256 amount;
        uint256 harvested;
    }

    mapping(address => Stake) public stakes;

    constructor(
        IERC20 tokenA_,
        IERC20 tokenB_,
        address owner_
    ) {
        tokenA = tokenA_;
        tokenB = tokenB_;
        transferOwnership(owner_);
    }

    /// @dev stakes for user TokenA
    /// @param amount amount of TokenA to be stake
    function stake(uint256 amount) external {
        require(stakes[msg.sender].startTimestamp == 0, 'You have already staked');

        tokenA.safeTransferFrom(msg.sender, address(this), amount);
        stakes[msg.sender] = Stake({
            startTimestamp: block.timestamp,
            amount: amount,
            harvested: 0
        });
    }

    /// @dev harvets for user all collected TokenB
    function harvest() public {
        require(stakes[msg.sender].startTimestamp != 0, 'You dont have any stakes');

        Stake storage stake_ = stakes[msg.sender];

        uint256 amountB = (stake_.amount *
            (block.timestamp - stake_.startTimestamp) *
            rate[0]) /
            rate[1] -
            stake_.harvested;

        stake_.harvested += amountB;
        require(
            tokenB.balanceOf(address(this)) <= amountB,
            'Not enough balance on contract'
        );
        tokenB.safeTransfer(msg.sender, amountB);
    }

    /// @dev returns all staked TokenA
    function unstake() external {
        require(stakes[msg.sender].startTimestamp != 0, 'You dont have any stakes');
        harvest();
        tokenA.safeTransfer(msg.sender, stakes[msg.sender].amount);
        delete stakes[msg.sender];
    }

    /// @dev sets rate for staking only by owner
    function setRate(uint256 numinator, uint256 denominator) external onlyOwner {
        rate[0] = numinator;
        rate[1] = denominator;
    }
}
