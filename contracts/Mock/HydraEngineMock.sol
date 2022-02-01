// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "../HydraEngine.sol";

contract HydraEngineMock is HydraEngine {

  constructor(address randomSeedAddress) HydraEngine(randomSeedAddress) {
  }

  function _operationSearchResult(uint8[6] memory numbers) public view returns (int16) {
    return operationSearchResult(numbers);
  }

  event TestCombating(string[] rCodes);

  function _combating(int16 searchResult) public returns (string[] memory) {
    string[] memory rCodes = combating(searchResult);
    emit TestCombating(rCodes);
    return rCodes;
  }

}