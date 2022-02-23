// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

interface RandomSeedInterface {
    function requestRandomNumber() external payable returns (bytes32);
    function getRandomNumber(uint256 seed, uint8 overValue, bool startZero, uint8 rangeStart, uint8 rangeEnd) external returns (uint8[] memory);
    function markRandomSeedUsed() external;
    function checkSeed(address operator) external returns (bool);
    function seedOf(address operator) external view returns (uint256);
}