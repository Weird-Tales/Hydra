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
    uint8[2] inMapIndex;
  }

  struct TimeTrack {
    uint8 spentFreedays;
    uint8 handOfGodEnergy;
    uint8 delayedDoomsday;
  }

  mapping(address => Map) private _mapOfAllPlayers; // player address => map data
  mapping(address => Workshop) private _workshopOfAllPlayers; // player address => workshop data
  mapping(address => Actor) private _actorOfAllPlayers; // player address => actor data
  mapping(address => TimeTrack) private _timeTrackOfAllPlayers; // player address => timeTrack data
  mapping(address => bool) private _isGameOver; // player address => is game end

  constructor() {
    
  }

  event GameEvents(address operator, string[] rCodes);

  modifier isGameOver() {
      require(
          _isGameOver[msg.sender] == false,
          "GAME OVER"
      );
      _;
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

  function createArray(string memory element) private pure returns (string[] memory) {
    string[] memory memoryArray = new string[](1);
    memoryArray[0] = element;
    return memoryArray;
  }

  function moveActorTo(bool isOutdoorOrInWorkshop, uint8 inMapRegionIndex) external isGameOver {
    require(
      inMapRegionIndex < 6,
      "inMapRegionIndex out of range"
    );
    bool _isOutdoorOrInWorkshop = _actorOfAllPlayers[msg.sender].isOutdoorOrInWorkshop;
    if (_isOutdoorOrInWorkshop == isOutdoorOrInWorkshop) {
      uint8[2] memory _inMapIndex = _actorOfAllPlayers[msg.sender].inMapIndex;
      require(
        _inMapIndex[0] != inMapRegionIndex,
        "invalid move actor"
      );
      string[] memory usedOneDayRCode = usedOneDay();
      string[] memory eraseAllProgressMarksRCode = eraseAllProgressMarksFrom(_inMapIndex[0]);
      string[] memory rCodes = combination(usedOneDayRCode, eraseAllProgressMarksRCode);
      emit GameEvents(msg.sender, rCodes);
    }
    _actorOfAllPlayers[msg.sender].isOutdoorOrInWorkshop = isOutdoorOrInWorkshop;
    if (isOutdoorOrInWorkshop == true) {
      _actorOfAllPlayers[msg.sender].inMapIndex[0] = inMapRegionIndex;
      _actorOfAllPlayers[msg.sender].inMapIndex[1] = 0;
      eraseAllProgressMarksFrom(inMapRegionIndex);
      string[] memory usedOneDayRCode = usedOneDay();
      string[] memory rCodes = combination(usedOneDayRCode, createArray('50400'));
      emit GameEvents(msg.sender, rCodes);
    } else {
      string[] memory usedOneDayRCode = usedOneDay();
      string[] memory eraseAllProgressMarksRCode = eraseAllProgressMarksFrom(_actorOfAllPlayers[msg.sender].inMapIndex[0]);
      string[] memory happendRCode = combination(usedOneDayRCode, eraseAllProgressMarksRCode);
      string[] memory rCodes = combination(happendRCode, createArray('50500'));
      _actorOfAllPlayers[msg.sender].inMapIndex[0] = 0;
      _actorOfAllPlayers[msg.sender].inMapIndex[1] = 0;
      emit GameEvents(msg.sender, rCodes);
    }
  }

  function eraseAllProgressMarksFrom(uint8 inMapRegionIndex) private returns (string[] memory) {
    require(
      inMapRegionIndex < 6,
      'inMapRegionIndex out of range'
    );
    uint8[6][6] memory boxes;
    _mapOfAllPlayers[msg.sender].regions[inMapRegionIndex] = boxes;
    return createArray(string(abi.encodePacked('5030', toString(inMapRegionIndex))));
  }

  function usedOneDay() private returns (string[] memory) {
    _timeTrackOfAllPlayers[msg.sender].spentFreedays++;

    string[] memory checkDoomsdayRCode = checkDoomsday();
    if (checkDoomsdayRCode.length > 0) {
      return combination(checkDoomsdayRCode, createArray('20000'));
    }

    return createArray('20000');
  }

  function mapEventHappend() private returns (string[] memory) {
    uint8 spentFreedays = _timeTrackOfAllPlayers[msg.sender].spentFreedays;

    uint8[7] memory _eventdaysIndex = eventdaysIndex();
    for (uint8 i; i < 7; i++) {
      if (_eventdaysIndex[i] == spentFreedays) {
        // TODO: 随机数
        uint8[4] memory randomEvents = [uint8(1), 2, 3, 4];
        _mapOfAllPlayers[msg.sender].eventInRegions = randomEvents;
        string[4] memory eventTypeStrA = [string("00"), "10", "20", "30"];
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

  function checkDoomsday() private returns (string[] memory) {
    TimeTrack memory timeTrack = _timeTrackOfAllPlayers[msg.sender];
    uint8 _doomsdayCountdown = doomsdayCountdown();

    if (timeTrack.spentFreedays - timeTrack.delayedDoomsday > _doomsdayCountdown) {
      string[] memory gameOverRCode = gameOver();
      return combination(gameOverRCode, createArray('20100'));
    }
    string[] memory emptyStrA;
    return emptyStrA;
  }

  function gameOver() private returns (string[] memory) {
    _isGameOver[msg.sender] = true;
    return createArray('10000');
  }

  function mockRandomNumbers(uint256 randomValue) public view returns (uint8[2] memory randomNumbers) {
    uint8[2] memory expandedValues;
    for (uint256 i; i < 2; i++) {
        expandedValues[i] = uint8(uint256(keccak256(abi.encode(randomValue + i, block.timestamp, msg.sender))) % 6 + 1);
    }
    return expandedValues;
  }
  
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
    for (uint8 i = 0; i < 5; i++) {
      _CombatHitDices[i][0] = ragdollHitDices[i];
      _CombatHitDices[i][1] = actorHitDices[i];
    }
    return _CombatHitDices;
  }

  function artifactCheckValue() public pure returns (uint8[6] memory) {
    return [uint8(4), 4, 4, 4, 4, 4];
  }

  function deathHitPoint() public pure returns (int8) {
    return -6;
  }

  function eventdaysIndex() public pure returns (uint8[7] memory) {
    return [uint8(2), 5, 8, 11, 14, 17, 20];
  }

  function doomsdayCountdown() public pure returns (uint8) {
    return 14;
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

}