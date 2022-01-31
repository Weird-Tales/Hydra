// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "../RandomSeedContract.sol";

contract RandomSeedContractMock is RandomSeedContract {

  constructor() { }

  function createRandomNumber(uint256 seed, uint8 overValue, bool startZero, uint8 rangeStart, uint8 rangeEnd) public view returns (uint8[] memory numbers) {
    return _createRandomNumber(seed, overValue, startZero, rangeStart, rangeEnd);
  }

}