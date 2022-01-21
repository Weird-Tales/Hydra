const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const HydraEngine = artifacts.require('HydraEngine');
const RandomSeedContract = artifacts.require('RandomSeedContract');

contract('HydraEngine-searching', function (accounts) {
  beforeEach(async function () {
    const randomSeed = await RandomSeedContract.deployed();
    randomSeed.requestRandomNumber(accounts[0]);
    this.instance = await HydraEngine.new(randomSeed.address);
  });

  it('非 0~5 的参数会捕获异常', async function () {
    const moveActorToReceipt = await this.instance.combating(new BN(-1), { from: accounts[0] });
    expectEvent(moveActorToReceipt, 'GameEvents', {
      rCodes: ['20000', '50204', '50211', '50221', '50230', '50301'],
      seedIsUsed: true
    });
  });

});