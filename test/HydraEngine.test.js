const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const HydraEngine = artifacts.require('HydraEngine');

contract('HydraEngine', function (accounts) {
  

  beforeEach(async function () {

  });

  const defaultsNumber = new BN(0);

  describe('当 -------的', function () {
    it("2222", async () => {
      const instance = await HydraEngine.deployed();
      const eventRCode = await instance.moveActorTo(true, new BN(0));
      console.log(eventRCode);
      expect(1).to.be.equal(1);
    });

    it("随机数 随机20次 都应该在 1~6 之间", async () => {
      const instance = await HydraEngine.deployed();
      for (var i = 0; i< 20; i++) {
        const randomNumbers = await instance.mockRandomNumbers(i);
        expect(randomNumbers[0].toNumber()).to.be.oneOf([1, 2, 3, 4, 5, 6]);
        expect(randomNumbers[1].toNumber()).to.be.oneOf([1, 2, 3, 4, 5, 6]);
      }
    });
  });

  // it("111111", async () => {
  //   const instance = await HydraEngine.deployed();
  //   const array = await instance.combination([new BN(1), new BN(2)], [new BN(4), new BN(5), new BN(6)]);
  //   const array1 = await instance.combination([new BN(1), new BN(2), new BN(3)], [new BN(5), new BN(6)]);
  //   const array2 = await instance.combination([new BN(1), new BN(2), new BN(3)], [new BN(4), new BN(5), new BN(6)]);
  //   const array3 = await instance.combination([new BN(1)], [new BN(2)]);
  //   const array4 = await instance.combination([new BN(1)], []);
  //   console.log(array3);
  //   console.log(array4);

  //   expect(1).to.be.equal(1);
  // });

  // 开始游戏测试，游戏状态。已经开始了，不能再次点开始

  describe('当 合约部署后，任意地址的', function () {
    it("struct Map/Workshop/Actor/TimeTrack 内数据应该都响应默认值", async () => {
      const instance = await HydraEngine.deployed();
      // Map
      const structMap = await instance.mapOfAllPlayers(accounts[1]);
      expect(structMap.regions[0][0][0]).to.be.bignumber.equal(defaultsNumber);
      expect(structMap.regions[1][2][3]).to.be.bignumber.equal(defaultsNumber);
      expect(structMap.regions[4][5][5]).to.be.bignumber.equal(defaultsNumber);
      expect(structMap.regions[5][2][0]).to.be.bignumber.equal(defaultsNumber);
      expect(structMap.regions[5][5][5]).to.be.bignumber.equal(defaultsNumber);

      expect(structMap.eventInRegions[0]).to.be.bignumber.equal(defaultsNumber);
      expect(structMap.eventInRegions[1]).to.be.bignumber.equal(defaultsNumber);
      expect(structMap.eventInRegions[2]).to.be.bignumber.equal(defaultsNumber);
      expect(structMap.eventInRegions[3]).to.be.bignumber.equal(defaultsNumber);
      // Workshop
      const structWorkshop = await instance.workshopOfAllPlayers(accounts[2]);
      expect(structWorkshop.artifactFragments[0][0]).to.be.bignumber.equal(defaultsNumber);
      expect(structWorkshop.artifactFragments[2][7]).to.be.bignumber.equal(defaultsNumber);
      expect(structWorkshop.artifactFragments[3][10]).to.be.bignumber.equal(defaultsNumber);
      expect(structWorkshop.artifactFragments[5][15]).to.be.bignumber.equal(defaultsNumber);

      expect(structWorkshop.wastebasket[0]).to.be.bignumber.equal(defaultsNumber);
      expect(structWorkshop.wastebasket[3]).to.be.bignumber.equal(defaultsNumber);
      expect(structWorkshop.wastebasket[6]).to.be.bignumber.equal(defaultsNumber);
      expect(structWorkshop.wastebasket[7]).to.be.bignumber.equal(defaultsNumber);
      expect(structWorkshop.wastebasket[9]).to.be.bignumber.equal(defaultsNumber);

      expect(structWorkshop.linkPaths[0][0]).to.be.bignumber.equal(defaultsNumber);
      expect(structWorkshop.linkPaths[1][2]).to.be.bignumber.equal(defaultsNumber);
      expect(structWorkshop.linkPaths[4][5]).to.be.bignumber.equal(defaultsNumber);
      expect(structWorkshop.linkPaths[5][5]).to.be.bignumber.equal(defaultsNumber);
      // Actor
      const structActor = await instance.actorOfAllPlayers(accounts[3]);
      expect(structActor.artifactsStates[0][0]).to.equal(false);
      expect(structActor.artifactsStates[1][2]).to.equal(false);
      expect(structActor.artifactsStates[2][5]).to.equal(false);

      expect(structActor.treasuresStates[0][0]).to.equal(false);
      expect(structActor.treasuresStates[1][2]).to.equal(false);
      expect(structActor.treasuresStates[2][5]).to.equal(false);

      expect(structActor.toolsStates[0][0]).to.equal(false);
      expect(structActor.toolsStates[1][1]).to.equal(false);
      expect(structActor.toolsStates[2][2]).to.equal(false);

      expect(structActor.hitPoints).to.be.bignumber.equal(defaultsNumber);

      expect(structActor.isOutdoorOrInWorkshop).to.equal(false);

      expect(structActor.inMapIndex[0]).to.be.bignumber.equal(defaultsNumber);
      expect(structActor.inMapIndex[1]).to.be.bignumber.equal(defaultsNumber);
      // TimeTrack
      const structTimeTrack = await instance.timeTrackOfAllPlayers(accounts[4]);
      expect(structTimeTrack.spentFreedays).to.be.bignumber.equal(defaultsNumber);
      expect(structTimeTrack.handOfGodEnergy).to.be.bignumber.equal(defaultsNumber);
      expect(structTimeTrack.delayedDoomsday).to.be.bignumber.equal(defaultsNumber);
      // TODO
      // const _isGameOver
    });
  });
  // 需要先打乱数据，然后再测试 reStart
  // describe('当 reStartGame() 函数运行后', function () {
  //   it("struct Map/Workshop/Actor 内数据应该都响应默认值", async () => {
  //     const instance = await HydraEngine.deployed();
  //     await instance.reStartGame();
  //     // Map
  //     const structMap = await instance.mapOfAllPlayers(accounts[0]);
  //     expect(structMap.regions[0][0][0]).to.be.bignumber.equal(defaultsNumber);
  //     expect(structMap.regions[1][2][3]).to.be.bignumber.equal(defaultsNumber);
  //     expect(structMap.regions[4][5][5]).to.be.bignumber.equal(defaultsNumber);
  //     expect(structMap.regions[5][2][0]).to.be.bignumber.equal(defaultsNumber);
  //     expect(structMap.regions[5][5][5]).to.be.bignumber.equal(defaultsNumber);

  //     expect(structMap.eventInRegions[0]).to.be.bignumber.equal(defaultsNumber);
  //     expect(structMap.eventInRegions[1]).to.be.bignumber.equal(defaultsNumber);
  //     expect(structMap.eventInRegions[2]).to.be.bignumber.equal(defaultsNumber);
  //     expect(structMap.eventInRegions[3]).to.be.bignumber.equal(defaultsNumber);
  //     // Workshop
  //     const structWorkshop = await instance.workshopOfAllPlayers(accounts[0]);
  //     expect(structWorkshop.artifactFragments[0][0]).to.be.bignumber.equal(defaultsNumber);
  //     expect(structWorkshop.artifactFragments[2][7]).to.be.bignumber.equal(defaultsNumber);
  //     expect(structWorkshop.artifactFragments[3][10]).to.be.bignumber.equal(defaultsNumber);
  //     expect(structWorkshop.artifactFragments[5][15]).to.be.bignumber.equal(defaultsNumber);

  //     expect(structWorkshop.wastebasket[0]).to.be.bignumber.equal(defaultsNumber);
  //     expect(structWorkshop.wastebasket[3]).to.be.bignumber.equal(defaultsNumber);
  //     expect(structWorkshop.wastebasket[6]).to.be.bignumber.equal(defaultsNumber);
  //     expect(structWorkshop.wastebasket[7]).to.be.bignumber.equal(defaultsNumber);
  //     expect(structWorkshop.wastebasket[9]).to.be.bignumber.equal(defaultsNumber);

  //     expect(structWorkshop.linkPaths[0][0]).to.be.bignumber.equal(defaultsNumber);
  //     expect(structWorkshop.linkPaths[1][2]).to.be.bignumber.equal(defaultsNumber);
  //     expect(structWorkshop.linkPaths[4][5]).to.be.bignumber.equal(defaultsNumber);
  //     expect(structWorkshop.linkPaths[5][5]).to.be.bignumber.equal(defaultsNumber);
  //     // Actor
  //     const structActor = await instance.actorOfAllPlayers(accounts[0]);
  //     expect(structActor.artifactsStates[0][0]).to.equal(false);
  //     expect(structActor.artifactsStates[1][2]).to.equal(false);
  //     expect(structActor.artifactsStates[2][5]).to.equal(false);

  //     expect(structActor.treasuresStates[0][0]).to.equal(false);
  //     expect(structActor.treasuresStates[1][2]).to.equal(false);
  //     expect(structActor.treasuresStates[2][5]).to.equal(false);

  //     expect(structActor.toolsStates[0][0]).to.equal(false);
  //     expect(structActor.toolsStates[1][1]).to.equal(false);
  //     expect(structActor.toolsStates[2][2]).to.equal(false);

  //     expect(structActor.hitPoints).to.be.bignumber.equal(defaultsNumber);

  //     expect(structActor.isOutdoorOrInWorkshop).to.equal(false);

  //     expect(structActor.inMapIndex[0]).to.be.bignumber.equal(defaultsNumber);
  //     expect(structActor.inMapIndex[1]).to.be.bignumber.equal(defaultsNumber);

  //     expect(structActor.spentFreedays[0]).to.equal(false);
  //     expect(structActor.spentFreedays[1]).to.equal(false);
  //     expect(structActor.spentFreedays[4]).to.equal(false);
  //     expect(structActor.spentFreedays[6]).to.equal(false);
  //     expect(structActor.spentFreedays[9]).to.equal(false);
  //     expect(structActor.spentFreedays[13]).to.equal(false);
  //     expect(structActor.spentFreedays[15]).to.equal(false);
  //     expect(structActor.spentFreedays[21]).to.equal(false);
  //   });
  // });

});