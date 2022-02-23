// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "./RandomSeedInterface.sol";

contract RandomSeedContract is RandomSeedInterface {
  struct Seed {
    bool isAvailable;
    uint256 seed;
    address belongAddress;
  }

  constructor() { }

  mapping(address => bytes32) private rRSIOfAllPlayers; // player address => request Random Seed ID
  mapping(bytes32 => Seed) private seedOfAllPlayers; // player address => random seed

  event FulfillEvent(address operator, bytes32 requestId, uint256 seed);

  function requestRandomNumber() external payable returns (bytes32) {
    bytes32 requestId = 'MockTest';// requestRandomness(keyHash, fee);
    uint256 mockSeed = 115792089237316195423570985008687907853269984665640564039458; // Mock
    rRSIOfAllPlayers[tx.origin] = requestId;
    seedOfAllPlayers[requestId].belongAddress = tx.origin;

    fulfillRandomness(requestId, mockSeed);
    return requestId;
  }

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal {
    address requestAddress = seedOfAllPlayers[requestId].belongAddress;
    require(
      requestAddress == seedOfAllPlayers[requestId].belongAddress,
      'address mismatch'
      );
    seedOfAllPlayers[requestId].seed = randomness;
    seedOfAllPlayers[requestId].isAvailable = true;

    emit FulfillEvent(requestAddress, requestId, randomness);
  }

  // 合约调用是 检查种子合法性 TODO: 抽到库内
  function getRandomNumber(uint256 seed, uint8 overValue, bool startZero, uint8 rangeStart, uint8 rangeEnd) external pure returns (uint8[] memory) {
    require(
      rangeEnd > rangeStart,
      'invalid range'
      );
    require(
      rangeEnd > 0,
      'invalid range'
      );
    uint8 count = rangeEnd - rangeStart;
    uint8[] memory expandedValues = new uint8[](count);
    for (uint8 i = rangeStart; i < rangeEnd; i++) {
      uint8 random = uint8(uint256(keccak256(abi.encode(seed, i))) % overValue);
      if (startZero == false) {
        random++;
      }
      expandedValues[i - rangeStart] = random;
    }
    return expandedValues;
  }

  function markRandomSeedUsed() external {
    bytes32 requestId = rRSIOfAllPlayers[tx.origin];
    require(
      tx.origin == seedOfAllPlayers[requestId].belongAddress,
      'address mismatch'
      );
    seedOfAllPlayers[requestId].isAvailable = false;
  }

  function checkSeed(address operator) external view returns (bool) {
    bytes32 requestId = rRSIOfAllPlayers[operator];
    require(
      operator == seedOfAllPlayers[requestId].belongAddress,
      'address mismatch'
      );
    return seedOfAllPlayers[requestId].isAvailable;
  }
 
  function seedOf(address operator) external view returns (uint256) {
    bytes32 requestId = rRSIOfAllPlayers[operator];
    require(
      operator == seedOfAllPlayers[requestId].belongAddress,
      'address mismatch'
      );
    return seedOfAllPlayers[requestId].seed;
  }
}

/**
import "@openzeppelin/contracts@4.4.2/utils/math/SafeMath.sol";

struct Ticket {
  uint256 expiredTicketsTimestamp;
  bool isGameOver;
  uint256 roundRoundNumber;
}

struct GameRound {
  bool ended;
  uint256 soldTicketCount;
  uint256 soldTicketFee;
  uint256 sponsorshipFee;
}

contract RlyehContract {
  using SafeMath for *;

// GAME DATA 
//****************
    mapping(address => Ticket) public ticketOfAllPlayers; // player address => ticket data

// ENGINE DATA 
//****************
  uint256 currentRoundNumber; // start timestamp
  mapping(uint256 => GameRound) public roundOfAllGame; // round number => GameRound data

  constructor() {
    
    }

    // function buyTicket(uint8 ticketValidDay, address inviter) external payable {
  function buyTicket(uint8 ticketValidDay) external payable {
      require(
            (ticketValidDay == 1 || ticketValidDay == 2 || ticketValidDay == 3),
            "Invalid ticket valid day"
        );

        require(msg.value == 0.1 ether);
        // (bool sent, bytes memory data)
      (bool sent,) = payable(msg.sender).call{value: msg.value}("");
        require(sent, "Failed to send Ether");

      // if (licenseOfAllInviters[inviter][currentRoundNumber].isRegister == true) {
      //  licenseOfAllInviters[inviter][currentRoundNumber].numberOfInvitees += 1;
      // }

        ticketOfAllPlayers[msg.sender].expiredTicketsTimestamp = block.timestamp + 86400 * ticketValidDay;
        ticketOfAllPlayers[msg.sender].roundRoundNumber = currentRoundNumber;
        ticketOfAllPlayers[msg.sender].isGameOver = false;
    }
}
/**
// interface DaiToken {
//     function transfer(address dst, uint wad) external returns (bool);
//     function balanceOf(address guy) external view returns (uint);
// }

// INVITATION SYSTEM
//==============================================================================

// INVITATION DATA
//****************
  DaiToken daitoken;

  uint256 public ticketPriceOfOnePlayer = 1 * 10 * 18;
  uint256 public inviterFeeRate = 65; // ‰ of inviter fee

  struct InviterLicense {
    uint256 numberOfInvitees;
    bool isWithdraw;
    bool isRegister;
  }
  mapping(address => mapping(uint256 => InviterLicense)) public licenseOfAllInviters;
  
  function registerAnInviter(uint256 roundNumber) external {
    licenseOfAllInviters[msg.sender][roundNumber].numberOfInvitees = 0;
    licenseOfAllInviters[msg.sender][roundNumber].isWithdraw = false;
    licenseOfAllInviters[msg.sender][roundNumber].isRegister = true;
  }

  function withdrawInviterFee(uint256 roundNumber) external {
    require(
      licenseOfAllInviters[msg.sender][roundNumber].numberOfInvitees != 0,
      "Invalid number of invitees"
    );
    require(
      licenseOfAllInviters[msg.sender][roundNumber].isWithdraw == false,
      "License is withdraw"
    );
    require(
      licenseOfAllInviters[msg.sender][roundNumber].isRegister == true,
      "License is not register"
    );
    require(
      roundOfAllGame[roundNumber].ended == true,
      "Only ended rounds can be withdraw"
    );
    uint256 soldTicketCount = roundOfAllGame[roundNumber].soldTicketCount;
    uint256 numberOfInvitees = licenseOfAllInviters[msg.sender][roundNumber].numberOfInvitees;
    uint256 inviterFee = soldTicketCount.mul(numberOfInvitees).mul(ticketPriceOfOnePlayer).mul(inviterFeeRate).div(1000); 
    daitoken.transfer(msg.sender, inviterFee);
    licenseOfAllInviters[msg.sender][roundNumber].isWithdraw == true;
  }

// MANAGEMENT INTERFACE
//****************
*/