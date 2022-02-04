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

  function _checkArtifactFragmentsInputTop(uint8[16] memory storageInputs) public pure returns (bool) {
    return checkArtifactFragmentsInputTop(storageInputs);
  }

  function _inputArraysMappingTo(uint8 inputA, uint8 inputAIndex, uint8 inputB, uint8 inputBIndex) public pure returns (PlayerInput[2] memory) {
    return inputArraysMappingTo(inputA, inputAIndex, inputB, inputBIndex);
  }

  function _removeEmptyFragmentsEnergy(uint8[16] memory storageInputs) public pure returns (uint8[16] memory) {
    return removeEmptyFragmentsEnergy(storageInputs);
  }
  
/// ---------------------------------------------------------------------------------
  function changeActor_hitPoints_test(int8 value) public {
    _actorOfAllPlayers[msg.sender].hitPoints = value;
  }

  function changeActor_isOutdoorOrInWorkshop_test(bool value) public {
    _actorOfAllPlayers[msg.sender].isOutdoorOrInWorkshop = value;
  }

  function changeTimeTrack_test(uint8 spentFreedays, uint8 handOfGodEnergy, uint8 delayedDoomsday) public {
    TimeTrack memory timeTrack;
    timeTrack.spentFreedays = spentFreedays;
    timeTrack.handOfGodEnergy = handOfGodEnergy;
    timeTrack.delayedDoomsday = delayedDoomsday;
    _timeTrackOfAllPlayers[msg.sender] = timeTrack;
  }

}