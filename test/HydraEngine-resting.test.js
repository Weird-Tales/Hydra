const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const HydraEngineMock = artifacts.require('HydraEngineMock');
const RandomSeedContract = artifacts.require('RandomSeedContract');

contract('HydraEngine-resting', function (accounts) {
  beforeEach(async function () {
    this.randomSeed = await RandomSeedContract.new();
    await this.randomSeed.requestRandomNumber();
    this.instanceMock = await HydraEngineMock.new(this.randomSeed.address);
  });

  it('异常数据，应该抛出异常', async function () {
    await expectRevert(
      this.instanceMock.restingActor(new BN(13)),
      'taking too long a break',
    );
  });

  it('生命值是0，户外休息1天，应该抛出事件', async function () {
    await this.instanceMock.changeActor_isOutdoorOrInWorkshop_test(true);
    await this.instanceMock.changeActor_hitPoints_test(new BN(0));
    const restingActorReceipt = await this.instanceMock.restingActor(new BN(1));

    expectEvent(restingActorReceipt, 'GameEvents', {
      rCodes: ['40300', '20000', '40303'],
    });
  });

  it('生命值是-1，户外休息1天，生命值应该0', async function () {
    await this.instanceMock.changeActor_hitPoints_test(new BN(-1));
    await this.instanceMock.restingActor(new BN(1));

    const structActor = await this.instanceMock.actorOfAllPlayers(accounts[0]);
    expect(structActor.hitPoints).to.be.bignumber.equal(new BN(0));
  });

  it('生命值是0，室内休息1天，应该抛出事件', async function () {
    await this.instanceMock.changeActor_isOutdoorOrInWorkshop_test(false);
    await this.instanceMock.changeActor_hitPoints_test(new BN(0));
    const restingActorReceipt = await this.instanceMock.restingActor(new BN(1));

    expectEvent(restingActorReceipt, 'GameEvents', {
      rCodes: ['40301', '20000', '40303'],
    });
  });

  it('生命值是-4，户外休息3天，生命值应该0', async function () {
    await this.instanceMock.changeActor_hitPoints_test(new BN(-4));
    await this.instanceMock.restingActor(new BN(3));

    const structActor = await this.instanceMock.actorOfAllPlayers(accounts[0]);
    expect(structActor.hitPoints).to.be.bignumber.equal(new BN(0));
  });

  it('生命值是0，室内休息2天，应该抛出事件', async function () {
    await this.instanceMock.changeActor_isOutdoorOrInWorkshop_test(false);
    await this.instanceMock.changeActor_hitPoints_test(new BN(0));
    const restingActorReceipt = await this.instanceMock.restingActor(new BN(2));

    expectEvent(restingActorReceipt, 'GameEvents', {
      rCodes: ['40301', '20000', '40303', '20000', '50201', '50210', '50220', '50233', '40303'],
    });
  });

  it('生命值是0，室内休息3天，应该抛出事件', async function () {
    await this.instanceMock.changeActor_isOutdoorOrInWorkshop_test(false);
    await this.instanceMock.changeActor_hitPoints_test(new BN(0));
    const restingActorReceipt = await this.instanceMock.restingActor(new BN(3));

    expectEvent(restingActorReceipt, 'GameEvents', {
      rCodes: ['40301', '20000', '40303', '20000', '50201', '50210', '50220', '50233', '40303', '20000', '40303', '40305'],
    });
  });

});