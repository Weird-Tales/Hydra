// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

interface RandomSeedInterface {
    function requestRandomNumber() external payable returns (bytes32 requestId);
    function getRandomNumber(uint8 overValue, bool startZero, uint8 rangeStart, uint8 rangeEnd) external returns (uint8[] memory numbers);
    function markRandomSeedUsed() external;
    function checkSeed() external returns (bool isUsed);
}