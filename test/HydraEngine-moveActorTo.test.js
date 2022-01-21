const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const HydraEngine = artifacts.require('HydraEngine');
const RandomSeedContract = artifacts.require('RandomSeedContract');

contract('HydraEngine-moveActorTo', function (accounts) {
  beforeEach(async function () {
    const randomSeed = await RandomSeedContract.deployed();
    randomSeed.requestRandomNumber(accounts[0]);
    this.instance = await HydraEngine.new(randomSeed.address);
  });

  const defaultsNumber = new BN(0);

  it('非 0~5 的参数会捕获异常', async function () {
    await expectRevert(
      this.instance.moveActorTo(true, new BN(6), { from: accounts[0] }),
      'inMapRegionIndex out of range',
    );
  });

  it('种子只能使用一次', async function () {
    await this.instance.moveActorTo(true, new BN(2));
    await this.instance.moveActorTo(true, new BN(1));
    await expectRevert(
      this.instance.moveActorTo(true, new BN(3), { from: accounts[0] }),
      'seed is used',
    );
  });

  it('移动两次后，会抛出响应事件 GameEvents', async function () {
    await this.instance.moveActorTo(true, new BN(1));
    const moveActorToReceipt = await this.instance.moveActorTo(true, new BN(2), { from: accounts[0] });

    expectEvent(moveActorToReceipt, 'GameEvents', {
      rCodes: ['20000', '50204', '50211', '50221', '50230', '50301'],
      seedIsUsed: true
    });
  });
/// ---------------------------------------------------------------------------------
  describe('第一次移动到户外，', function () {
    it('应该抛出 GameEvents', async function () {
      const moveActorToReceipt = await this.instance.moveActorTo(true, defaultsNumber, { from: accounts[0] });

      expectEvent(moveActorToReceipt, 'GameEvents', {
        rCodes: ['50400', '20000'],
        seedIsUsed: false
      });
    });

    it('移动到区域 0，调用者的 时间应该正确设置', async function () {
      await this.instance.moveActorTo(true, defaultsNumber, { from: accounts[0] });

      const structTimeTrack = await this.instance.timeTrackOfAllPlayers(accounts[0]);
      expect(structTimeTrack.spentFreedays).to.be.bignumber.equal(new BN(1));
    });

    it('移动到区域 0，调用者的 位置信息 应该设置正常', async function () {
      const moveActorToReceipt = await this.instance.moveActorTo(true, defaultsNumber, { from: accounts[0] });

      const structActor = await this.instance.actorOfAllPlayers(accounts[0]);
      expect(structActor.isOutdoorOrInWorkshop).to.be.true;
      expect(structActor.inMapIndex[0]).to.be.bignumber.equal(defaultsNumber);
      expect(structActor.inMapIndex[1]).to.be.bignumber.equal(defaultsNumber);
    });

    it('移动到区域 5，调用者的 位置信息 应该设置正常', async function () {
      const moveActorToReceipt = await this.instance.moveActorTo(true, new BN(5), { from: accounts[0] });

      const structActor = await this.instance.actorOfAllPlayers(accounts[0]);
      expect(structActor.isOutdoorOrInWorkshop).to.be.true;
      expect(structActor.inMapIndex[0]).to.be.bignumber.equal(new BN(5));
      expect(structActor.inMapIndex[1]).to.be.bignumber.equal(defaultsNumber);
    });

    it('移动到的区域 搜索记录应该清空', async function () {
      const moveActorToReceipt = await this.instance.moveActorTo(true, new BN(3), { from: accounts[0] });

      const structMap = await this.instance.mapOfAllPlayers(accounts[0]);
      for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 6; j++) {
          expect(structMap.regions[3][i][j]).to.be.bignumber.equal(defaultsNumber);
        }
      }
    });
  });
// ---------------------------------------------------------------------------------
  describe('第一次移动到户外，再移动到工作间', function () {
    it('应该抛出 GameEvents', async function () {
      const outdoorMapIndex = new BN(4);
      await this.instance.moveActorTo(true, outdoorMapIndex);
      const moveActorToReceipt = await this.instance.moveActorTo(false, defaultsNumber, { from: accounts[0] });

      expectEvent(moveActorToReceipt, 'GameEvents', {
        rCodes: ['50500', '20000', '50204', '50211', '50221', '50230', '5030' + '4'],
        seedIsUsed: true
      });
    });

    it('从区域 1 移动到室，调用者的 时间应该正常', async function () {
      const outdoorMapIndex = new BN(1);
      await this.instance.moveActorTo(true, outdoorMapIndex);
      await this.instance.moveActorTo(false, defaultsNumber);

      const structTimeTrack = await this.instance.timeTrackOfAllPlayers(accounts[0]);
      expect(structTimeTrack.spentFreedays).to.be.bignumber.equal(new BN(2));
    });

    it('从区域 1 移动到室内，调用者的 位置信息 应该正确设置', async function () {
      const outdoorMapIndex = new BN(1);
      await this.instance.moveActorTo(true, outdoorMapIndex);
      const moveActorToReceipt = await this.instance.moveActorTo(false, defaultsNumber, { from: accounts[0] });

      const structActor = await this.instance.actorOfAllPlayers(accounts[0]);
      expect(structActor.isOutdoorOrInWorkshop).to.be.false;
      expect(structActor.inMapIndex[0]).to.be.bignumber.equal(defaultsNumber);
      expect(structActor.inMapIndex[1]).to.be.bignumber.equal(defaultsNumber);
    });

    it('从区域 5移动到室内，调用者的 位置信息 应该设置正常', async function () {
      const outdoorMapIndex = new BN(5);
      await this.instance.moveActorTo(true, outdoorMapIndex);
      const moveActorToReceipt = await this.instance.moveActorTo(false, defaultsNumber, { from: accounts[0] });

      const structActor = await this.instance.actorOfAllPlayers(accounts[0]);
      expect(structActor.isOutdoorOrInWorkshop).to.be.false;
      expect(structActor.inMapIndex[0]).to.be.bignumber.equal(defaultsNumber);
      expect(structActor.inMapIndex[1]).to.be.bignumber.equal(defaultsNumber);
    });

    it('旧的室外区域 搜索记录应该清空', async function () {
      const outdoorMapIndex = new BN(5);
      await this.instance.moveActorTo(true, outdoorMapIndex);
      // TODO 修改室外区域数字
      const moveActorToReceipt = await this.instance.moveActorTo(false, defaultsNumber, { from: accounts[0] });

      const structMap = await this.instance.mapOfAllPlayers(accounts[0]);
      for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 6; j++) {
          expect(structMap.regions[5][i][j]).to.be.bignumber.equal(defaultsNumber);
        }
      }
    });
  });
/// ---------------------------------------------------------------------------------
  describe('在户外，再次移动户外区域', function () {
    it('移动到相同区域会抛出异常', async function () {
      const outdoorMapIndex = new BN(5);
      await this.instance.moveActorTo(true, outdoorMapIndex);

      await expectRevert(
        this.instance.moveActorTo(true, outdoorMapIndex, { from: accounts[0] }),
        'invalid move actor',
      );
    });

    it('从区域 1 移动到 区域2，应该抛出 GameEvents', async function () {
      await this.instance.moveActorTo(true, new BN(1));
      const moveActorToReceipt = await this.instance.moveActorTo(true, new BN(2), { from: accounts[0] });

      expectEvent(moveActorToReceipt, 'GameEvents', {
        rCodes: ['20000', '50204', '50211', '50221', '50230', '5030' + '1'],
        seedIsUsed: true
      });
    });

    it('从区域 1 移动到 区域2，调用者的 时间应该正常', async function () {
      await this.instance.moveActorTo(true, new BN(1));
      await this.instance.moveActorTo(true, new BN(2));

      const structTimeTrack = await this.instance.timeTrackOfAllPlayers(accounts[0]);
      expect(structTimeTrack.spentFreedays).to.be.bignumber.equal(new BN(2));
    });

    it('从区域 1 移动到 区域2，调用者的 位置信息 应该设置正常', async function () {
      await this.instance.moveActorTo(true, new BN(1));
      await this.instance.moveActorTo(true, new BN(2));

      const structActor = await this.instance.actorOfAllPlayers(accounts[0]);
      expect(structActor.isOutdoorOrInWorkshop).to.be.true;
      expect(structActor.inMapIndex[0]).to.be.bignumber.equal(new BN(2));
      expect(structActor.inMapIndex[1]).to.be.bignumber.equal(defaultsNumber);
    });

    it('从区域 2 移动到 区域3，调用者的 位置信息 应该设置正常', async function () {
      await this.instance.moveActorTo(true, new BN(2));
      await this.instance.moveActorTo(true, new BN(3));

      const structActor = await this.instance.actorOfAllPlayers(accounts[0]);
      expect(structActor.isOutdoorOrInWorkshop).to.be.true;
      expect(structActor.inMapIndex[0]).to.be.bignumber.equal(new BN(3));
      expect(structActor.inMapIndex[1]).to.be.bignumber.equal(defaultsNumber);
    });

    it('从区域 1 移动到 区域2，旧的室外区域 搜索记录应该清空', async function () {
      await this.instance.moveActorTo(true, new BN(1));
      await this.instance.moveActorTo(true, new BN(2));
      // TODO 修改室外区域数字

      const structMap = await this.instance.mapOfAllPlayers(accounts[0]);
      for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 6; j++) {
          expect(structMap.regions[1][i][j]).to.be.bignumber.equal(defaultsNumber);
        }
      }
    });
  });

});