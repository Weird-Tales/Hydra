// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "./RandomSeedInterface.sol";
import "./HydraEngineConfig.sol";

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
    uint8[6] componentsCount;
  }

  struct Actor {
    // 3[0]->favorited; 3[1]->activated; 3[2]->used
    bool[6][3] artifactsStates;
    bool[6][3] treasuresStates;
    bool[3][3] toolsStates;
    int8 hitPoints;
    bool isOutdoorOrInWorkshop;
    // 0...5
    uint8[2] inMapIndex;
  }

  struct TimeTrack {
    uint8 spentFreedays;
    uint8 handOfGodEnergy;
    uint8 delayedDoomsday;
  }

  struct PlayerInput {
    /// 1~6
    uint8 number;
    /// 0~5
    uint8 index;
  }

  mapping(address => Map) internal _mapOfAllPlayers; // player address => map data
  mapping(address => Workshop) internal _workshopOfAllPlayers; // player address => workshop data
  mapping(address => Actor) internal _actorOfAllPlayers; // player address => actor data
  mapping(address => TimeTrack) internal _timeTrackOfAllPlayers; // player address => timeTrack data
  mapping(address => bool) internal _isGameOver; // player address => is game end

  RandomSeedInterface private RandomSeed;

  constructor(address randomSeedAddress) {
    RandomSeed = RandomSeedInterface(randomSeedAddress);
  }

  event GameEvents(address operator, string[] rCodes, bool seedIsUsed);

  modifier isPlaying() {
    require(
      _isGameOver[msg.sender] == false,
      'GAME OVER'
      );
    _;
  }

  modifier seedIsUnused() {
    require(
      RandomSeed.checkSeed() == false,
      'seed is used'
      );
    _;
  }

  // struct Workshop {
  //   uint8[16][6] artifactFragments;
  //   uint8[10] wastebasket;
  //   uint[6][6] linkPaths;
  //   uint8[6] componentsCount;
  // }

  function activatingArtifacts(uint8 inputA, uint8 inputAIndex, uint8 inputB, uint8 inputBIndex, uint8 artifactIndex) external isPlaying seedIsUnused {
    Actor memory actor = _actorOfAllPlayers[msg.sender];
    require(
      actor.isOutdoorOrInWorkshop == false,
      'wrong actor position'
      );
    require(
      artifactIndex < 6,
      'wrong artifactIndex'
      );
    require(
      actor.artifactsStates[1][artifactIndex] == false,
      'cannot be reactivated'
      );
    uint8[] memory randomNumbers = RandomSeed.getRandomNumber(6, false, 0, 2);
    PlayerInput[2] memory inputs = inputArraysMappingTo(inputA, inputAIndex, inputB, inputBIndex);
    playerInputsCheck(inputs, randomNumbers, 8);
    uint8[16] memory storageInputs = _workshopOfAllPlayers[msg.sender].artifactFragments[artifactIndex];
    bool isTop = checkArtifactFragmentsInputTop(storageInputs);
    if (isTop == false) {
      inputs[0].index = inputs[0].index + 8;
      inputs[1].index = inputs[1].index + 8;
    }
    require(
      storageInputs[inputs[0].index] == 0,
      'wrong inputs index.0'
      );
    if (storageInputs[inputs[1].index] == 0) {
      storageInputs[inputs[0].index] = inputs[0].number;
      storageInputs[inputs[1].index] = inputs[1].number;
      _workshopOfAllPlayers[msg.sender].artifactFragments[artifactIndex] = storageInputs;
    } else {

    }
    uint8 zeroCount = 0;
    for (uint8 i; i < 6; i++) {
      if (storageInputs[i] == 0) {
        zeroCount++;
      }
    }


    // require(
    //   storageInputs[inputs[1][1]] == 0,
    //   'wrong inputs index.1'
    //   );
  }

  function removeEmptyFragmentsEnergy(uint8[16] memory storageInputs) internal pure returns (uint8[16] memory resultStorageInputs) {
    for (uint8 i; i < 4; i++) {
      if (storageInputs[i] == storageInputs[i + 4]) {
        storageInputs[i] = 0;
        storageInputs[i + 4] = 0;
      }
    }
    for (uint8 i = 8; i < 12; i++) {
      if (storageInputs[i] == storageInputs[i + 4]) {
        storageInputs[i] = 0;
        storageInputs[i + 4] = 0;
      }
    }
    return storageInputs;
  }

  function inputArraysMappingTo(uint8 inputA, uint8 inputAIndex, uint8 inputB, uint8 inputBIndex)
    internal pure returns (PlayerInput[2] memory playerInputs) {
    PlayerInput[2] memory _playerInputs;
    PlayerInput memory playerInputA;
    playerInputA.number = inputA;
    playerInputA.index = inputAIndex;
    _playerInputs[0] = playerInputA;

    PlayerInput memory playerInputB;
    playerInputB.number = inputB;
    playerInputB.index = inputBIndex;
    _playerInputs[1] = playerInputB;
    return _playerInputs;
  }

  function checkArtifactFragmentsInputTop(uint8[16] memory storageInputs) internal pure returns (bool isTop) {
    for (uint8 i; i < 8; i++) {
      if (storageInputs[i] == 0) {
        return true;
      }
    }
    return false;
  }

  function startHandOfGodEnergy() external isPlaying {
    TimeTrack memory timeTrack = _timeTrackOfAllPlayers[msg.sender];
    require(
      timeTrack.handOfGodEnergy > 2,
      'not enough energy'
      );
    require(
      timeTrack.delayedDoomsday < 7,
      'doomsday cannot be delayed indefinitely'
      );
    string[] memory startRCode;
    if (timeTrack.handOfGodEnergy == 6) {
      timeTrack.handOfGodEnergy = 0;
      startRCode = createRCode('10202');
      timeTrack.delayedDoomsday = timeTrack.delayedDoomsday + 2;
      startRCode = combination(startRCode, createRCode('10204'));
      if (timeTrack.delayedDoomsday > 7) {
        timeTrack.delayedDoomsday = 7;
        startRCode = combination(startRCode, createRCode('10205'));
      }
    } else if (timeTrack.handOfGodEnergy >= 3) {
      timeTrack.handOfGodEnergy = timeTrack.handOfGodEnergy - 3;
      startRCode = createRCode('10201');
      timeTrack.delayedDoomsday++;
      startRCode = combination(startRCode, createRCode('10203'));
    }
    _timeTrackOfAllPlayers[msg.sender] = timeTrack;
    emit GameEvents(msg.sender, startRCode, false);
  }

  function restingActor(uint8 day) external isPlaying seedIsUnused {
    require(
      day < 13,
      'taking too long a break'
      );
    bool isOutdoorOrInWorkshop = _actorOfAllPlayers[msg.sender].isOutdoorOrInWorkshop;
    string[] memory restingRCode;
    if (isOutdoorOrInWorkshop) {
      restingRCode = createRCode('40300');
    } else {
      restingRCode = createRCode('40301');
    }
    bool finallySeedIsUsed;
    for (uint8 i; i < day; i++) {
      (string[] memory usedOneDayRCode, bool seedIsUsed) = usedOneDay();
      if (seedIsUsed == true) {
        finallySeedIsUsed = true;
      }
      restingRCode = combination(restingRCode, usedOneDayRCode);
      if (_actorOfAllPlayers[msg.sender].hitPoints >= 0) {
        _actorOfAllPlayers[msg.sender].hitPoints = 0;
        restingRCode = combination(restingRCode, createRCode('40303'));
      } else {
        _actorOfAllPlayers[msg.sender].hitPoints++;
        restingRCode = combination(restingRCode, createRCode('40302'));
      }
    }
    if (day > 2 && isOutdoorOrInWorkshop == false) {
      if (_actorOfAllPlayers[msg.sender].hitPoints >= 0) {
        _actorOfAllPlayers[msg.sender].hitPoints = 0;
        restingRCode = combination(restingRCode, createRCode('40305'));
      } else {
        _actorOfAllPlayers[msg.sender].hitPoints++;
        restingRCode = combination(restingRCode, createRCode('40304'));
      }
    }
    emit GameEvents(msg.sender, restingRCode, finallySeedIsUsed);
  }

  function searching(uint8 inputA, uint8 inputAIndex, uint8 inputB, uint8 inputBIndex) external isPlaying seedIsUnused {
    uint8[] memory randomNumbers = RandomSeed.getRandomNumber(6, false, 0, 2);
    PlayerInput[2] memory inputs = inputArraysMappingTo(inputA, inputAIndex, inputB, inputBIndex);
    playerInputsCheck(inputs, randomNumbers, 6);
    Actor memory actor = _actorOfAllPlayers[msg.sender];
    require(
      actor.isOutdoorOrInWorkshop == true,
      'wrong actor position'
      );
    uint8[6] memory storageInputs = _mapOfAllPlayers[msg.sender].regions[actor.inMapIndex[0]][actor.inMapIndex[1]];
    require(
      storageInputs[inputs[0].index] == 0,
      'wrong inputs index.0'
      );
    require(
      storageInputs[inputs[1].index] == 0,
      'wrong inputs index.1'
      );
    storageInputs[inputs[0].index] = inputs[0].number;
    storageInputs[inputs[1].index] = inputs[1].number;
    _mapOfAllPlayers[msg.sender].regions[actor.inMapIndex[0]][actor.inMapIndex[1]] = storageInputs;
    uint8 zeroCount = 0;
    for (uint8 i; i < 6; i++) {
      if (storageInputs[i] == 0) {
        zeroCount++;
      }
    }
    if (zeroCount == 0) {
      string[] memory searchingRCode = createRCode('20400');
      int16 _operationSearchResult = operationSearchResult(storageInputs);
      if (_operationSearchResult >= 100 || _operationSearchResult <= -1) {
        string[] memory combatingRCode = combating(_operationSearchResult);
        searchingRCode = combination(searchingRCode, combatingRCode);
      } else if (_operationSearchResult >= 11 && _operationSearchResult <= 99) {
        string[] memory foundItRCode = foundIt(2, actor.inMapIndex[0]);
        searchingRCode = combination(searchingRCode, foundItRCode);
      } else if (_operationSearchResult >= 1 && _operationSearchResult <= 10) {
        string[] memory foundItRCode = foundIt(0, actor.inMapIndex[0]);
        searchingRCode = combination(searchingRCode, foundItRCode);
      } else if (_operationSearchResult == 0) {
        string[] memory foundItRCode = foundIt(3, actor.inMapIndex[0]);
        searchingRCode = combination(searchingRCode, foundItRCode);
      }
      uint8[6] memory _spentTimes = HydraEngineConfig.allSpentTimes()[actor.inMapIndex[0]];
      if (_spentTimes[actor.inMapIndex[1]] == 1) {
        (string[] memory usedOneDayRCode, bool seedIsUsed) = usedOneDay();
        emit GameEvents(msg.sender, combination(searchingRCode, usedOneDayRCode), true);
      } else {
        emit GameEvents(msg.sender, searchingRCode, true);
      }
      _actorOfAllPlayers[msg.sender].inMapIndex[1]++;
      RandomSeed.markRandomSeedUsed();
    } else {
      string memory rcodeStr = string(abi.encodePacked('506', toString(actor.inMapIndex[0]), toString(actor.inMapIndex[1])));
      RandomSeed.markRandomSeedUsed();
      emit GameEvents(msg.sender, createRCode(rcodeStr), true);
    }
  }

  function playerInputsCheck(PlayerInput[2] memory playerInputs, uint8[] memory randomNumbers, uint8 maxValue) internal pure {
    require(
      playerInputs[0].number != 0 && playerInputs[0].number < 7,
      'wrong inputs number.0'
      );
    require(
      playerInputs[1].number != 0 && playerInputs[1].number < 7,
      'wrong inputs number.1'
      );
    require(
      playerInputs[0].index < maxValue,
      'wrong inputs index.0'
      );
    require(
      playerInputs[1].index < maxValue,
      'wrong inputs index.1'
      );
    require(
      playerInputs[0].number == randomNumbers[0],
      'wrong inputs random.0'
      );
    require(
      playerInputs[1].number == randomNumbers[1],
      'wrong inputs random.1'
      );
    require(
      playerInputs[0].index != playerInputs[1].index,
      'wrong inputs same index'
      );
  }

  function operationSearchResult(uint8[6] memory numbers) internal pure returns (int16) {
    int16[] memory int16Array = new int16[](6);
    for (uint8 i; i < 6; i++) {
      int16Array[i] = int16(int8(numbers[i]));
    }
    int16 topNumber = int16Array[0] * 100 + int16Array[1] * 10 + int16Array[2] * 1;
    int16 bottomNumber = int16Array[3] * 100 + int16Array[4] * 10 + int16Array[5] * 1;
    return topNumber - bottomNumber;
  }

  function combating(int16 searchResult) internal returns (string[] memory) {
    require(
      searchResult >= 100 && searchResult <= 555 || searchResult >= -555 && searchResult <= -1,
      'wrong searchResult range'
      );
    uint8 combatLevel;
    if (searchResult >= 100 && searchResult <= 199 || searchResult >= -100 && searchResult <= -1) {
      combatLevel = 0;
    } else if (searchResult >= 200 && searchResult <= 299 || searchResult >= -200 && searchResult <= -101) {
      combatLevel = 1;
    } else if (searchResult >= 300 && searchResult <= 399 || searchResult >= -300 && searchResult <= -201) {
      combatLevel = 2;
    } else if (searchResult >= 400 && searchResult <= 499 || searchResult >= -400 && searchResult <= -301) {
      combatLevel = 3;
    } else if (searchResult >= 500 && searchResult <= 555 || searchResult >= -401 && searchResult <= -555) {
      combatLevel = 4;
    }
    bool[6][2][5] memory _combatHitRates = HydraEngineConfig.combatHitRates();
    bool[6] memory ragdollHitDice = _combatHitRates[combatLevel][0];
    bool[6] memory actorHitDices = _combatHitRates[combatLevel][1];

    Actor memory actor = _actorOfAllPlayers[msg.sender];
    int8 gotHitCount;
    int8 _deathHitPoint = HydraEngineConfig.deathHitPoint();
    bool isLive = true;
    uint8 usedDiceCount;
    uint8 index = 200;
    string[] memory combatingRCode;
    while (isLive || usedDiceCount < 6) {
      uint8[] memory randomNumbers = RandomSeed.getRandomNumber(6, true, index, index + 2);
      index = index + 2;
      if (actorHitDices[randomNumbers[0]] == true || actorHitDices[randomNumbers[1]] == true) {
        string memory hitRagdollRCode = string(abi.encodePacked('401', toString(actor.inMapIndex[0]), toString(combatLevel)));
        combatingRCode = combination(combatingRCode, createRCode(hitRagdollRCode));
        string[] memory foundItRCode;
        if (combatLevel < 4) {
          foundItRCode = foundIt(2, actor.inMapIndex[0]);
        } else {
          foundItRCode = foundIt(1, actor.inMapIndex[0]);
        }
        return combination(combatingRCode, foundItRCode);
      }
      if (ragdollHitDice[randomNumbers[0]] == true) {
        gotHitCount++;
        string[] memory gotHitRCode = new string[](2);
        gotHitRCode[0] = string(abi.encodePacked('402', toString(actor.inMapIndex[0]), toString(combatLevel)));
        gotHitRCode[1] = '10302';
        combatingRCode = combination(combatingRCode, gotHitRCode);
      }
      if (ragdollHitDice[randomNumbers[1]] == true) {
        gotHitCount++;
        string[] memory gotHitRCode = new string[](2);
        gotHitRCode[0] = string(abi.encodePacked('402', toString(actor.inMapIndex[0]), toString(combatLevel)));
        gotHitRCode[1] = '10302';
        combatingRCode = combination(combatingRCode, gotHitRCode);
      }
      isLive = (actor.hitPoints - gotHitCount) > _deathHitPoint;
      usedDiceCount++;
    }
    if (isLive == false) {
      if ((actor.hitPoints - gotHitCount) == _deathHitPoint) {
        string[] memory unconsciousRCode = unconsciousIn(actor.inMapIndex[0]);
        return combination(combatingRCode, unconsciousRCode);
      }
      return combination(createRCode('10500'), gameOver());
    }
    return combination(combatingRCode, createRCode('4999'));
  }

  // level: 0-> artifacts, 1-> treasures, 2-> Components, 3->
  function foundIt(uint8 level, uint8 regionIndex) internal returns (string[] memory) {
    require(
      level < 4,
      'wrong foundIt level'
      );
    if (level == 0) {
      _actorOfAllPlayers[msg.sender].artifactsStates[0][regionIndex] = true;
      string memory rCode = string(abi.encodePacked('2020', toString(regionIndex)));
      return createRCode(rCode);
    } else if (level == 1) {
      _actorOfAllPlayers[msg.sender].treasuresStates[0][regionIndex] = true;
      string memory rCode = string(abi.encodePacked('2021', toString(regionIndex)));
      return createRCode(rCode);
    } else if (level == 2) {
      uint8 componentsCount = _workshopOfAllPlayers[msg.sender].componentsCount[regionIndex];
      componentsCount++;
      if (componentsCount > 4) {
        _workshopOfAllPlayers[msg.sender].componentsCount[regionIndex] = 4;
        string[] memory rCodes = new string[](2);
        string memory rCode = string(abi.encodePacked('2022', toString(regionIndex)));
        rCodes[0] = rCode;
        rCodes[1] = '20300';
        return rCodes;
      } else {
        _workshopOfAllPlayers[msg.sender].componentsCount[regionIndex] = componentsCount;
        string memory rCode = string(abi.encodePacked('2022', toString(regionIndex)));
        return createRCode(rCode);
      }
    } else if (level == 3) {
      _workshopOfAllPlayers[msg.sender].componentsCount[regionIndex]++;
      string memory rCode = string(abi.encodePacked('2990', toString(regionIndex)));
      return createRCode(rCode);
    }
    string[] memory emptyStrA;
    return emptyStrA;
  }

  function unconsciousIn(uint8 regionIndex) internal returns (string[] memory) {
    _actorOfAllPlayers[msg.sender].hitPoints = HydraEngineConfig.deathHitPoint();
    if (_actorOfAllPlayers[msg.sender].isOutdoorOrInWorkshop) {
      string[] memory unconsciousRCode = new string[](2);
      unconsciousRCode[0] = string(abi.encodePacked('1041', toString(regionIndex)));
      unconsciousRCode[1] = '50500';
      string[] memory eraseAllProgressMarksRcode = eraseAllProgressMarksFrom(regionIndex);
      return combination(unconsciousRCode, eraseAllProgressMarksRcode);
    }
    return createRCode('10420');
  }

  function moveActorTo(bool isOutdoorOrInWorkshop, uint8 inMapRegionIndex) external isPlaying seedIsUnused {
    require(
      inMapRegionIndex < 6,
      'inMapRegionIndex out of range'
      );
    bool _isOutdoorOrInWorkshop = _actorOfAllPlayers[msg.sender].isOutdoorOrInWorkshop;
    if (_isOutdoorOrInWorkshop == isOutdoorOrInWorkshop) {
      uint8[2] memory _inMapIndex = _actorOfAllPlayers[msg.sender].inMapIndex;
      require(
        _inMapIndex[0] != inMapRegionIndex,
        'invalid move actor'
        );
      string[] memory eraseAllProgressMarksRCode = eraseAllProgressMarksFrom(_inMapIndex[0]);
      (string[] memory usedOneDayRCode, bool seedIsUsed) = usedOneDay();
      string[] memory rCodes = combination(usedOneDayRCode, eraseAllProgressMarksRCode);
      _actorOfAllPlayers[msg.sender].inMapIndex[0] = inMapRegionIndex;
      _actorOfAllPlayers[msg.sender].inMapIndex[1] = 0;
      if (seedIsUsed) {
        RandomSeed.markRandomSeedUsed();
      }
      emit GameEvents(msg.sender, rCodes, seedIsUsed);
      return;
    }
    _actorOfAllPlayers[msg.sender].isOutdoorOrInWorkshop = isOutdoorOrInWorkshop;
    if (isOutdoorOrInWorkshop == true) {
      _actorOfAllPlayers[msg.sender].inMapIndex[0] = inMapRegionIndex;
      _actorOfAllPlayers[msg.sender].inMapIndex[1] = 0;
      eraseAllProgressMarksFrom(inMapRegionIndex);
      (string[] memory usedOneDayRCode, bool seedIsUsed) = usedOneDay();
      string[] memory rCodes = combination(createRCode('50400'), usedOneDayRCode);
      if (seedIsUsed) {
        RandomSeed.markRandomSeedUsed();
      }
      emit GameEvents(msg.sender, rCodes, seedIsUsed);
    } else {
      string[] memory eraseAllProgressMarksRCode = eraseAllProgressMarksFrom(_actorOfAllPlayers[msg.sender].inMapIndex[0]);
      (string[] memory usedOneDayRCode, bool seedIsUsed) = usedOneDay();
      string[] memory rCodes = combination(createRCode('50500'), combination(usedOneDayRCode, eraseAllProgressMarksRCode));
      _actorOfAllPlayers[msg.sender].inMapIndex[0] = 0;
      _actorOfAllPlayers[msg.sender].inMapIndex[1] = 0;
      if (seedIsUsed) {
        RandomSeed.markRandomSeedUsed();
      }
      emit GameEvents(msg.sender, rCodes, seedIsUsed);
    }
  }

  function eraseAllProgressMarksFrom(uint8 inMapRegionIndex) internal returns (string[] memory) {
    require(
      inMapRegionIndex < 6,
      'inMapRegionIndex out of range'
    );
    uint8[6][6] memory boxes;
    _mapOfAllPlayers[msg.sender].regions[inMapRegionIndex] = boxes;
    return createRCode(string(abi.encodePacked('5030', toString(inMapRegionIndex))));
  }

  function usedOneDay() internal returns (string[] memory, bool) {
    uint8 spentFreedays = _timeTrackOfAllPlayers[msg.sender].spentFreedays;
    spentFreedays++;
    _timeTrackOfAllPlayers[msg.sender].spentFreedays = spentFreedays;

    string[] memory checkDoomsdayRCode = checkDoomsday();
    if (checkDoomsdayRCode.length > 0) {
      return (combination(createRCode('20000'), checkDoomsdayRCode), false);
    }

    string[] memory mapEventHappendRCode = mapEventHappend(spentFreedays);
    if (mapEventHappendRCode.length > 0) {
      return (combination(createRCode('20000'), mapEventHappendRCode), true);
    }
    return (createRCode('20000'), false);
  }

  function mapEventHappend(uint8 spentFreedays) internal returns (string[] memory) {
    uint8[7] memory _eventdaysIndex = HydraEngineConfig.eventdaysIndex();
    for (uint8 i; i < 7; i++) {
      if (_eventdaysIndex[i] == spentFreedays) {
        uint8[4] memory randomEvents;
        uint8[] memory randomNumbers = RandomSeed.getRandomNumber(6, true, 2, 6);
        for (uint8 k; k < 4; k++) {
          randomEvents[k] = randomNumbers[k];
        }
        _mapOfAllPlayers[msg.sender].eventInRegions = randomEvents;
        string[4] memory eventTypeStrA = [string("0"), "1", "2", "3"];
        string[] memory mapEventHappendRCode = new string[](4);
        for (uint32 j; j < 4; j++) {
          mapEventHappendRCode[j] = string(abi.encodePacked('502', eventTypeStrA[j], toString(randomEvents[j])));
        }
        return mapEventHappendRCode;
      }
    }
    string[] memory emptyStrA;
    return emptyStrA;
  }

  function checkDoomsday() internal returns (string[] memory) {
    TimeTrack memory timeTrack = _timeTrackOfAllPlayers[msg.sender];
    uint8 _doomsdayCountdown = HydraEngineConfig.doomsdayCountdown();

    if (timeTrack.spentFreedays - timeTrack.delayedDoomsday > _doomsdayCountdown) {
      string[] memory gameOverRCode = gameOver();
      return combination(createRCode('20100'), gameOverRCode);
    }
    string[] memory emptyStrA;
    return emptyStrA;
  }

  function gameOver() private returns (string[] memory) { // NFT score
    _isGameOver[msg.sender] = true;
    return createRCode('10000');
  }
  
  function startGame() external {
    initGame();
    // 开始游戏测试，游戏状态。已经开始了，不能再次点开始 TODO
  }

  function reStartGame() external {
    initGame();
    reloadGameData();
  }

  function initGame() private {

  }

  function reloadGameData() private {
    // raload game
    _isGameOver[msg.sender] = true;
    // raload Map - regions
    uint8[6][6][6] memory regions;
    _mapOfAllPlayers[msg.sender].regions = regions;
    // reload Map - eventInRegions
    _mapOfAllPlayers[msg.sender].eventInRegions = [uint8(0), 0, 0, 0];
    // reload Workshop - artifactFragments
    uint8[16][6] memory artifactFragments;
    _workshopOfAllPlayers[msg.sender].artifactFragments = artifactFragments;
    // reload Workshop - wastebasket
    uint8[10] memory wastebasket;
    _workshopOfAllPlayers[msg.sender].wastebasket = wastebasket;
    // reload Workshop - linkPaths
    uint[6][6] memory linkPaths;
    _workshopOfAllPlayers[msg.sender].linkPaths = linkPaths;
    // reload Actor - artifacts treasures tools states
    bool[6][3] memory artifactsStates;
    _actorOfAllPlayers[msg.sender].artifactsStates = artifactsStates;

    bool[6][3] memory treasuresStates;
    _actorOfAllPlayers[msg.sender].treasuresStates = treasuresStates;

    bool[3][3] memory toolsStates;
    _actorOfAllPlayers[msg.sender].toolsStates = toolsStates;
    // reload Actor - hitPoints
    _actorOfAllPlayers[msg.sender].hitPoints = 0;
    // reload Actor - location
    _actorOfAllPlayers[msg.sender].isOutdoorOrInWorkshop = false;
    uint8[2] memory inMapIndex;
    _actorOfAllPlayers[msg.sender].inMapIndex = inMapIndex;
    // reload TimeTrack - 
    _timeTrackOfAllPlayers[msg.sender].spentFreedays = 0;
    _timeTrackOfAllPlayers[msg.sender].handOfGodEnergy = 0;
    _timeTrackOfAllPlayers[msg.sender].delayedDoomsday = 0;
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

  function timeTrackOfAllPlayers(address playerAddress) external view returns (TimeTrack memory) {
    return _timeTrackOfAllPlayers[playerAddress];
  }

  /**
   * @dev Converts a `uint8` to its ASCII `string` decimal representation.
   * OpenZeppelin Contracts v4.4.1 (utils/Strings.sol)
   */
  function toString(uint8 value) internal pure returns (string memory) {
    if (value == 0) {
      return "0";
    }
    uint8 temp = value;
    uint8 digits;
    while (temp != 0) {
      digits++;
      temp /= 10;
    }
    bytes memory buffer = new bytes(digits);
    while (value != 0) {
      digits -= 1;
      buffer[digits] = bytes1(uint8(48 + uint8(value % 10)));
      value /= 10;
    }
    return string(buffer);
  }

  function combination(string[] memory arrayA, string[] memory arrayB) public pure returns (string[] memory) {
    uint32 arrayCount;
    for (uint32 i; i < arrayA.length; i++) {
      arrayCount++;
    }
    for (uint32 i; i < arrayB.length; i++) {
      arrayCount++;
    }

    string[] memory tempArray = new string[](arrayCount);
    for (uint32 i; i < arrayA.length; i++) {
      tempArray[i] = arrayA[i];
    }
    for (uint256 i = arrayA.length; i < arrayCount; i++) {
      tempArray[i] = arrayB[i - arrayA.length];
    }
    return tempArray;
  }

  function createRCode(string memory element) private pure returns (string[] memory) {
    string[] memory memoryArray = new string[](1);
    memoryArray[0] = element;
    return memoryArray;
  }

}