// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "../HydraEngine.sol";

contract HydraEngineMock is HydraEngine {

  constructor(address randomSeedAddress) HydraEngine(randomSeedAddress) {
  }

  function _operationSearchResult(uint8[6] memory numbers) public pure returns (int16) {
    return operationSearchResult(numbers);
  }

  event TestCombating(string[] rCodes);

  function _combating(int16 searchResult) public returns (string[] memory) {
    string[] memory rCodes = combating(searchResult);
    emit TestCombating(rCodes);
    return rCodes;
  }
  
/// ---------------------------------------------------------------------------------
  function changeActor_hitPoints_test(int8 value) public {
    _actorOfAllPlayers[msg.sender].hitPoints = value;
  }

  function changeActor_isOutdoorOrInWorkshop_test(bool value) public {
    _actorOfAllPlayers[msg.sender].isOutdoorOrInWorkshop = value;
  }

}