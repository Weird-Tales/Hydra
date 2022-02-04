// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

library HydraEngineConfig {
  function allSpentTimes() external pure returns (uint8[6][6] memory) {
    uint8[6][6] memory _allSpentTimes;
    _allSpentTimes[0] = [1, 1, 0, 1, 0, 0];
    _allSpentTimes[1] = [1, 0, 0, 1, 0, 0];
    _allSpentTimes[2] = [1, 0, 1, 0, 1, 0];
    _allSpentTimes[3] = [1, 1, 0, 1, 0, 0];
    _allSpentTimes[4] = [1, 0, 1, 0, 1, 0];
    _allSpentTimes[5] = [1, 1, 1, 0, 1, 0];
    return _allSpentTimes;
  }

  // [6]true->hit; 2[0]->ragdoll / 2[1]->actor; 5->Lvl
  function combatHitRates() external pure returns (bool[6][2][5] memory) {
    bool[6][5] memory ragdollHitDices;
    ragdollHitDices[0] = [true, false, false, false, false, false];
    ragdollHitDices[1] = [true, false, false, false, false, false];
    ragdollHitDices[2] = [true, true, false, false, false, false];
    ragdollHitDices[3] = [true, true, true, false, false, false];
    ragdollHitDices[4] = [true, true, true, true, false, false];

    bool[6][5] memory actorHitDices;
    actorHitDices[0] = [false, false, false, false, true, true];
    actorHitDices[1] = [false, false, false, false, false, true];
    actorHitDices[2] = [false, false, false, false, false, true];
    actorHitDices[3] = [false, false, false, false, false, true];
    actorHitDices[4] = [false, false, false, false, false, true];

    bool[6][2][5] memory _combatHitRates;
    for (uint8 i = 0; i < 5; i++) {
      _combatHitRates[i][0] = ragdollHitDices[i];
      _combatHitRates[i][1] = actorHitDices[i];
    }
    return _combatHitRates;
  }

  function artifactCheckValue() external pure returns (uint8[6] memory) {
    return [uint8(4), 4, 4, 4, 4, 4];
  }

  function deathHitPoint() external pure returns (int8) {
    return -6;
  }

  function eventdaysIndex() external pure returns (uint8[7] memory) {
    return [uint8(2), 5, 8, 11, 14, 17, 20];
  }

  function doomsdayCountdown() external pure returns (uint8) {
    return 14;
  }
}