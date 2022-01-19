const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const HydraEngine = artifacts.require('HydraEngine');
const RandomSeedContract = artifacts.require('RandomSeedContract');

contract('HydraEngine-moveActorTo', function (accounts) {
  beforeEach(async function () {
    const randomSeed = await RandomSeedContract.deployed();
    this.instance = await HydraEngine.new(randomSeed.address);
  });

  const defaultsNumber = new BN(0);

  describe('新部署合约，调用 moveActorTo，', function () {
    it('非 0~5 的参数会导致异常并恢复', async function () {
      await expectRevert(
        this.instance.moveActorTo(true, new BN(6), { from: accounts[0] }),
        'inMapRegionIndex out of range',
      );
    });

    it('移动两次后，会抛出响应事件 GameEvents', async function () {
      await this.instance.moveActorTo(true, new BN(1));
      const moveActorToReceipt = await this.instance.moveActorTo(true, new BN(2), { from: accounts[0] });

      expectEvent(moveActorToReceipt, 'GameEvents', {
        operator: accounts[0],
        rCodes: ['20000', '50203', '50214', '50221', '50230', '50301'],
      });
    });
/// ---------------------------------------------------------------------------------
//     describe('第一次移动到户外，', function () {
//       it('应该抛出 GameEvents', async function () {
//         const instance = await HydraEngine.new();
//         const moveActorToReceipt = await instance.moveActorTo(true, defaultsNumber, { from: accounts[0] });

//         expectEvent(moveActorToReceipt, 'GameEvents', {
//           operator: accounts[0],
//           rCodes: ['20000', '50400'],
//         });
//       });

//       it('移动到区域 0，调用者的 时间应该正确设置', async function () {
//         const instance = await HydraEngine.new();
//         await instance.moveActorTo(true, defaultsNumber, { from: accounts[0] });

//         const structTimeTrack = await instance.timeTrackOfAllPlayers(accounts[0]);
//         expect(structTimeTrack.spentFreedays).to.be.bignumber.equal(new BN(1));
//       });

//       it('移动到区域 0，调用者的 位置信息 应该设置正常', async function () {
//         const instance = await HydraEngine.new();
//         const moveActorToReceipt = await instance.moveActorTo(true, defaultsNumber, { from: accounts[0] });

//         const structActor = await instance.actorOfAllPlayers(accounts[0]);
//         expect(structActor.isOutdoorOrInWorkshop).to.be.true;
//         expect(structActor.inMapIndex[0]).to.be.bignumber.equal(defaultsNumber);
//         expect(structActor.inMapIndex[1]).to.be.bignumber.equal(defaultsNumber);
//       });

//       it('移动到区域 5，调用者的 位置信息 应该设置正常', async function () {
//         const instance = await HydraEngine.new();
//         const moveActorToReceipt = await instance.moveActorTo(true, new BN(5), { from: accounts[0] });

//         const structActor = await instance.actorOfAllPlayers(accounts[0]);
//         expect(structActor.isOutdoorOrInWorkshop).to.be.true;
//         expect(structActor.inMapIndex[0]).to.be.bignumber.equal(new BN(5));
//         expect(structActor.inMapIndex[1]).to.be.bignumber.equal(defaultsNumber);
//       });

//       it('移动到的区域 搜索记录应该清空', async function () {
//         const instance = await HydraEngine.new();
//         const moveActorToReceipt = await instance.moveActorTo(true, new BN(3), { from: accounts[0] });

//         const structMap = await instance.mapOfAllPlayers(accounts[0]);
//         for (var i = 0; i < 6; i++) {
//           for (var j = 0; j < 6; j++) {
//             expect(structMap.regions[3][i][j]).to.be.bignumber.equal(defaultsNumber);
//           }
//         }
//       });
//     });
// /// ---------------------------------------------------------------------------------
//     describe('第一次移动到户外，再移动到工作间', function () {
//       it('应该抛出 GameEvents', async function () {
//         const instance = await HydraEngine.new();
//         const outdoorMapIndex = new BN(4);
//         await instance.moveActorTo(true, outdoorMapIndex);
//         const moveActorToReceipt = await instance.moveActorTo(false, defaultsNumber, { from: accounts[0] });

//         expectEvent(moveActorToReceipt, 'GameEvents', {
//           operator: accounts[0],
//           rCodes: ['20000', '5030' + '4', '50500'],
//         });
//       });

//       it('从区域 1 移动到室，调用者的 时间应该正常', async function () {
//         const instance = await HydraEngine.new();
//         const outdoorMapIndex = new BN(1);
//         await instance.moveActorTo(true, outdoorMapIndex);
//         await instance.moveActorTo(false, defaultsNumber);

//         const structTimeTrack = await instance.timeTrackOfAllPlayers(accounts[0]);
//         expect(structTimeTrack.spentFreedays).to.be.bignumber.equal(new BN(2));
//       });

//       it('从区域 1 移动到室内，调用者的 位置信息 应该正确设置', async function () {
//         const instance = await HydraEngine.new();
//         const outdoorMapIndex = new BN(1);
//         await instance.moveActorTo(true, outdoorMapIndex);
//         const moveActorToReceipt = await instance.moveActorTo(false, defaultsNumber, { from: accounts[0] });

//         const structActor = await instance.actorOfAllPlayers(accounts[0]);
//         expect(structActor.isOutdoorOrInWorkshop).to.be.false;
//         expect(structActor.inMapIndex[0]).to.be.bignumber.equal(defaultsNumber);
//         expect(structActor.inMapIndex[1]).to.be.bignumber.equal(defaultsNumber);
//       });

//       it('从区域 5移动到室内，调用者的 位置信息 应该设置正常', async function () {
//         const instance = await HydraEngine.new();
//         const outdoorMapIndex = new BN(5);
//         await instance.moveActorTo(true, outdoorMapIndex);
//         const moveActorToReceipt = await instance.moveActorTo(false, defaultsNumber, { from: accounts[0] });

//         const structActor = await instance.actorOfAllPlayers(accounts[0]);
//         expect(structActor.isOutdoorOrInWorkshop).to.be.false;
//         expect(structActor.inMapIndex[0]).to.be.bignumber.equal(defaultsNumber);
//         expect(structActor.inMapIndex[1]).to.be.bignumber.equal(defaultsNumber);
//       });

//       it('旧的室外区域 搜索记录应该清空', async function () {
//         const instance = await HydraEngine.new();
//         const outdoorMapIndex = new BN(5);
//         await instance.moveActorTo(true, outdoorMapIndex);
//         // TODO 修改室外区域数字
//         const moveActorToReceipt = await instance.moveActorTo(false, defaultsNumber, { from: accounts[0] });

//         const structMap = await instance.mapOfAllPlayers(accounts[0]);
//         for (var i = 0; i < 6; i++) {
//           for (var j = 0; j < 6; j++) {
//             expect(structMap.regions[5][i][j]).to.be.bignumber.equal(defaultsNumber);
//           }
//         }
//       });
//     });
// /// ---------------------------------------------------------------------------------
//     describe('在户外，再次移动户外区域', function () {
//       it('移动到相同区域会抛出异常', async function () {
//         const instance = await HydraEngine.new();
//         const outdoorMapIndex = new BN(5);
//         await instance.moveActorTo(true, outdoorMapIndex);

//         await expectRevert(
//           instance.moveActorTo(true, outdoorMapIndex, { from: accounts[0] }),
//           'invalid move actor',
//         );
//       });

//       it('从区域 1 移动到 区域2，应该抛出 GameEvents', async function () {
//         const instance = await HydraEngine.new();
//         await instance.moveActorTo(true, new BN(1));
//         const moveActorToReceipt = await instance.moveActorTo(true, new BN(2), { from: accounts[0] });

//         expectEvent(moveActorToReceipt, 'GameEvents', {
//           operator: accounts[0],
//           rCodes: ['20000', '5030' + '1'],
//         });
//       });

//       it('从区域 1 移动到 区域2，调用者的 时间应该正常', async function () {
//         const instance = await HydraEngine.new();
//         await instance.moveActorTo(true, new BN(1));
//         await instance.moveActorTo(true, new BN(2));

//         const structTimeTrack = await instance.timeTrackOfAllPlayers(accounts[0]);
//         expect(structTimeTrack.spentFreedays).to.be.bignumber.equal(new BN(2));
//       });

//       it('从区域 1 移动到 区域2，调用者的 位置信息 应该设置正常', async function () {
//         const instance = await HydraEngine.new();
//         await instance.moveActorTo(true, new BN(1));
//         await instance.moveActorTo(true, new BN(2));

//         const structActor = await instance.actorOfAllPlayers(accounts[0]);
//         expect(structActor.isOutdoorOrInWorkshop).to.be.true;
//         expect(structActor.inMapIndex[0]).to.be.bignumber.equal(new BN(2));
//         expect(structActor.inMapIndex[1]).to.be.bignumber.equal(defaultsNumber);
//       });

//       it('从区域 2 移动到 区域3，调用者的 位置信息 应该设置正常', async function () {
//         const instance = await HydraEngine.new();
//         await instance.moveActorTo(true, new BN(2));
//         await instance.moveActorTo(true, new BN(3));

//         const structActor = await instance.actorOfAllPlayers(accounts[0]);
//         expect(structActor.isOutdoorOrInWorkshop).to.be.true;
//         expect(structActor.inMapIndex[0]).to.be.bignumber.equal(new BN(3));
//         expect(structActor.inMapIndex[1]).to.be.bignumber.equal(defaultsNumber);
//       });

//       it('从区域 1 移动到 区域2，旧的室外区域 搜索记录应该清空', async function () {
//         const instance = await HydraEngine.new();
//         await instance.moveActorTo(true, new BN(1));
//         await instance.moveActorTo(true, new BN(2));
//         // TODO 修改室外区域数字

//         const structMap = await instance.mapOfAllPlayers(accounts[0]);
//         for (var i = 0; i < 6; i++) {
//           for (var j = 0; j < 6; j++) {
//             expect(structMap.regions[1][i][j]).to.be.bignumber.equal(defaultsNumber);
//           }
//         }
//       });

//     });

  });

  // 开始游戏测试，游戏状态。已经开始了，不能再次点开始

});