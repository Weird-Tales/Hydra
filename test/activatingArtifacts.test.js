const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const HydraEngineMock = artifacts.require('HydraEngineMock');
const RandomSeedContract = artifacts.require('RandomSeedContract');

contract('HydraEngine-activatingArtifacts', function (accounts) {
  beforeEach(async function () {
    this.randomSeed = await RandomSeedContract.new();
    await this.randomSeed.requestRandomNumber();
    this.instanceMock = await HydraEngineMock.new(this.randomSeed.address);
  });

  describe('startHandOfGodEnergy测试，', function () {
    it('异常数据，应该抛出异常', async function () {
      await expectRevert(
        this.instanceMock.startHandOfGodEnergy(),
        'not enough energy',
      );
      await this.instanceMock.changeTimeTrack_test(new BN(0), new BN(3), new BN(7));
      await expectRevert(
        this.instanceMock.startHandOfGodEnergy(),
        'doomsday cannot be delayed indefinitely',
      );
    });

    it('能量是3点时，末日延迟0时，应该抛出事件', async function () {
      await this.instanceMock.changeTimeTrack_test(new BN(0), new BN(3), new BN(0));
      const restingActorReceipt = await this.instanceMock.startHandOfGodEnergy();

      expectEvent(restingActorReceipt, 'GameEvents', {
        rCodes: ['10201', '10203'],
      });
    });

    it('能量是3点时，末日延迟0时，末日延期应该是1天，能量应该为0', async function () {
      await this.instanceMock.changeTimeTrack_test(new BN(0), new BN(3), new BN(0));
      await this.instanceMock.startHandOfGodEnergy();

      const structTimeTrack = await this.instanceMock.timeTrackOfAllPlayers(accounts[0]);
      expect(structTimeTrack.handOfGodEnergy).to.be.bignumber.equal(new BN(0));
      expect(structTimeTrack.delayedDoomsday).to.be.bignumber.equal(new BN(1));
    });

    it('能量是5点时，末日延迟0时，应该抛出事件', async function () {
      await this.instanceMock.changeTimeTrack_test(new BN(0), new BN(5), new BN(0));
      const restingActorReceipt = await this.instanceMock.startHandOfGodEnergy();

      expectEvent(restingActorReceipt, 'GameEvents', {
        rCodes: ['10201', '10203'],
      });
    });

    it('能量是5点时，末日延迟0时，末日延期应该是1天，能量应该为2', async function () {
      await this.instanceMock.changeTimeTrack_test(new BN(0), new BN(5), new BN(0));
      await this.instanceMock.startHandOfGodEnergy();

      const structTimeTrack = await this.instanceMock.timeTrackOfAllPlayers(accounts[0]);
      expect(structTimeTrack.handOfGodEnergy).to.be.bignumber.equal(new BN(2));
      expect(structTimeTrack.delayedDoomsday).to.be.bignumber.equal(new BN(1));
    });

    it('能量是6点时，末日延迟0时，应该抛出事件', async function () {
      await this.instanceMock.changeTimeTrack_test(new BN(0), new BN(6), new BN(0));
      const restingActorReceipt = await this.instanceMock.startHandOfGodEnergy();

      expectEvent(restingActorReceipt, 'GameEvents', {
        rCodes: ['10202', '10204'],
      });
    });

    it('能量是6点时，末日延迟0时，末日延期应该是2天，能量应该为0', async function () {
      await this.instanceMock.changeTimeTrack_test(new BN(0), new BN(6), new BN(0));
      await this.instanceMock.startHandOfGodEnergy();

      const structTimeTrack = await this.instanceMock.timeTrackOfAllPlayers(accounts[0]);
      expect(structTimeTrack.handOfGodEnergy).to.be.bignumber.equal(new BN(0));
      expect(structTimeTrack.delayedDoomsday).to.be.bignumber.equal(new BN(2));
    });

    it('能量是6点时，末日延迟6时，应该抛出事件', async function () {
      await this.instanceMock.changeTimeTrack_test(new BN(0), new BN(6), new BN(6));
      const restingActorReceipt = await this.instanceMock.startHandOfGodEnergy();

      expectEvent(restingActorReceipt, 'GameEvents', {
        rCodes: ['10202', '10204', '10205'],
      });
    });

    it('能量是6点时，末日延迟6时，末日延期应该是7天，能量应该为0', async function () {
      await this.instanceMock.changeTimeTrack_test(new BN(0), new BN(6), new BN(6));
      await this.instanceMock.startHandOfGodEnergy();

      const structTimeTrack = await this.instanceMock.timeTrackOfAllPlayers(accounts[0]);
      expect(structTimeTrack.handOfGodEnergy).to.be.bignumber.equal(new BN(0));
      expect(structTimeTrack.delayedDoomsday).to.be.bignumber.equal(new BN(7));
    });

  });

});