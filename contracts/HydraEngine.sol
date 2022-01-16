// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

contract HydraEngine {
  enum Artifacts {artifactQ, artifactW, artifactE, artifactR, artifactT, artifactY}
  enum Components {componentA, componentS, componentD, componentF, componentG, componentH}
  enum Treasures {treasureZ, treasureX, treasureC, treasureV, treasureB, treasureN}
  enum Tools {toolJ, toolK, toolL}

  struct Map {
    uint8[6][6][6] regions;
    uint8[4] eventInRegions;
  }

  struct Workshop {
    uint8[16][6] artifactFragments;
    uint8[10] wastebasket;
    uint[6][6] linkPaths;
  }

  struct Actor {
    // 3[0]->favorited; 3[1]->activated; 3[2]->used
    bool[6][3] artifactsStates;
    bool[6][3] treasuresStates;
    bool[3][3] toolsStates;
    int8 hitPoints;
    bool isOutdoorOrInWorkshop;
    uint8 inRegionIndex;
    uint8 inBoxIndex;
    bool[22] spentFreedays;
  }

  mapping(address => Map) private _mapOfAllPlayers; // player address => map data
  mapping(address => Workshop) private _workshopOfAllPlayers; // player address => workshop data
  mapping(address => Actor) private _actorOfAllPlayers; // player address => actor data

  constructor() {

  }
  
  // start or restart game.
  function startGame() external {
    initGame();
  }

  function reStartGame() external {
    initGame();
    reloadGameData();
  }

  function initGame() private {

  }

  function reloadGameData() private {
    // raload Map - regions
    uint8[6][6][6] memory regions;
    for(uint8 i = 0; i < 6; i++) {
      for(uint8 j = 0; j < 6; j++) {
        for(uint8 k = 0; k < 6; k++) {
          regions[i][j][k] = 0;
        }
      }
    }
    _mapOfAllPlayers[msg.sender].regions = regions;
    // reload Map - eventInRegions
    _mapOfAllPlayers[msg.sender].eventInRegions = [0, 0, 0, 0];
    // reload Workshop - artifactFragments
    uint8[16][6] memory artifactFragments;
    for(uint8 j = 0; j < 6; j++) {
      for(uint8 k = 0; k < 16; k++) {
        artifactFragments[j][k] = 0;
      }
    }
    _workshopOfAllPlayers[msg.sender].artifactFragments = artifactFragments;
    // reload Workshop - wastebasket
    uint8[10] memory wastebasket;
    for(uint8 i = 0; i < 10; i++) {
      wastebasket[i] = 0;
    }
    _workshopOfAllPlayers[msg.sender].wastebasket = wastebasket;
    // reload Workshop - linkPaths
    uint[6][6] memory linkPaths;
    for(uint8 j = 0; j < 6; j++) {
      for(uint8 k = 0; k < 6; k++) {
        linkPaths[j][k] = 0;
      }
    }
    _workshopOfAllPlayers[msg.sender].linkPaths = linkPaths;
    // reload Actor - artifacts treasures tools states
    bool[6][3] memory artifactsStates;
    for(uint8 j = 0; j < 3; j++) {
      for(uint8 k = 0; k < 6; k++) {
        artifactsStates[j][k] = false;
      }
    }
    _actorOfAllPlayers[msg.sender].artifactsStates = artifactsStates;

    bool[6][3] memory treasuresStates;
    for(uint8 j = 0; j < 3; j++) {
      for(uint8 k = 0; k < 6; k++) {
        treasuresStates[j][k] = false;
      }
    }
    _actorOfAllPlayers[msg.sender].treasuresStates = treasuresStates;

    bool[3][3] memory toolsStates;
    for(uint8 j = 0; j < 3; j++) {
      for(uint8 k = 0; k < 3; k++) {
        toolsStates[j][k] = false;
      }
    }
    _actorOfAllPlayers[msg.sender].toolsStates = toolsStates;
    // reload Actor - hitPoints
    _actorOfAllPlayers[msg.sender].hitPoints = 0;
    // reload Actor - location
    _actorOfAllPlayers[msg.sender].isOutdoorOrInWorkshop = false;
    _actorOfAllPlayers[msg.sender].inRegionIndex = 0;
    _actorOfAllPlayers[msg.sender].inBoxIndex = 0;
    // reload spentFreedays
    bool[22] memory spentFreedays;
    for(uint8 i = 0; i < 22; i++) {
      spentFreedays[i] = false;
    }
    _actorOfAllPlayers[msg.sender].spentFreedays = spentFreedays;
  }

  function allSpentTimes() public pure returns (uint8[6][6] memory) {
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
  function combatHitDices() public pure returns (bool[6][2][5] memory) {
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

    bool[6][2][5] memory _CombatHitDices;
    for(uint8 i = 0; i < 5; i++) {
      _CombatHitDices[i][0] = ragdollHitDices[i];
      _CombatHitDices[i][1] = actorHitDices[i];
    }
    return _CombatHitDices;
  }

  function artifactCheckValue() public pure returns (uint8[6] memory) {
    return [4, 4, 4, 4, 4, 4];
  }

  function deathHitPoint() public pure returns (int8) {
    return -6;
  }

  function eventdaysIndex() public pure returns (uint8[7] memory) {
    return [1, 4, 7, 10, 13, 16, 19];
  }

  function doomsdayCountdown() public pure returns (int8) {
    return 8;
  }

  function mapOfAllPlayers(address playerAddress) external view returns (Map memory) {
    return _mapOfAllPlayers[playerAddress];
  }

  function workshopOfAllPlayers(address playerAddress) external view returns (Workshop memory) {
    return _workshopOfAllPlayers[playerAddress];
  }

  function actorOfAllPlayers(address playerAddress) external view returns (Actor memory) {
    return _actorOfAllPlayers[playerAddress];
  }

}