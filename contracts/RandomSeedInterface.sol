// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

interface RandomSeedInterface {
    function requestRandomNumber(address player) external payable returns (bytes32 requestId);
    function getRandomNumber(address player, uint8 overValue, bool startZero, uint8 rangeStart, uint8 rangeEnd) external returns (uint8[] memory numbers);
    function checkSeed(address player) external returns (bool isUsed);
}