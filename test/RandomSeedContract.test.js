const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { MAX_UINT256 } = constants;

const RandomSeedContract = artifacts.require('RandomSeedContract');
const RandomSeedContractMock = artifacts.require('RandomSeedContractMock');

contract('RandomSeedContract', function (accounts) {

  // it('请求种子后，会抛出事件', async function () {
  //   const randomSeed = await RandomSeedContract.new();
  //   const _randomSeedReceipt = await randomSeed.requestRandomNumber({ from: accounts[0] });

  //   expectEvent(_randomSeedReceipt, 'FulfillEvent', {
  //     operator: accounts[0],
  //     requestId: 'MockTest',
  //     seed: new BN(115792089237316195423570985008687907853269984665640564039458)
  //   });
  // });

  it('新部署合约，任意地址检查种子会报错', async function () {
    const randomSeed = await RandomSeedContract.new();
    await expectRevert(
      randomSeed.checkSeed(accounts[0]),
      'address mismatch',
    );
  });

  it('新部署合约，空地址检查种子是不能使用状态', async function () {
    const randomSeed = await RandomSeedContract.new();
    const isAvailable = await randomSeed.checkSeed("0x0000000000000000000000000000000000000000");
    expect(isAvailable).to.be.false;
  });

  it('请求随机数后，种子是能使用状态', async function () {
    const randomSeed = await RandomSeedContract.deployed();
    await randomSeed.requestRandomNumber();
    const isAvailable = await randomSeed.checkSeed(accounts[0]);
    expect(isAvailable).to.be.true;
  });
  
  it('兑换随机数后，种子是不能使用状态', async function () {
    const randomSeed = await RandomSeedContract.deployed();
    await randomSeed.requestRandomNumber();
    await randomSeed.markRandomSeedUsed();
    const isAvailable = await randomSeed.checkSeed(accounts[0]);
    expect(isAvailable).to.be.false;
  });

  describe('固定种子下，', function () {
    it('startZero=false情况下，位置0~2的随机数应该是5和2', async function () {
      const randomSeedMock = await RandomSeedContractMock.deployed();
      await randomSeedMock.requestRandomNumber();
      const seed = new BN('115792089237316195423570985008687907853269984665640564039458');
      const randomNumbers = await randomSeedMock.getRandomNumber(seed, 6, false, 0, 2);
      expect(randomNumbers[0]).to.be.bignumber.equal(new BN(5));
      expect(randomNumbers[1]).to.be.bignumber.equal(new BN(2));
    });
    it('startZero=true情况下，位置200~202的随机数应该是1和2', async function () {
      const randomSeedMock = await RandomSeedContractMock.deployed();
      await randomSeedMock.requestRandomNumber();
      const seed = new BN('115792089237316195423570985008687907853269984665640564039458');
      const randomNumbers = await randomSeedMock.getRandomNumber(seed, 6, true, 200, 202);
      expect(randomNumbers[0]).to.be.bignumber.equal(new BN(1));
      expect(randomNumbers[1]).to.be.bignumber.equal(new BN(2));
    });
    it('startZero=true情况下，位置0~2的随机数应该是4和1', async function () {
      const randomSeedMock = await RandomSeedContractMock.deployed();
      await randomSeedMock.requestRandomNumber();
      const seed = new BN('115792089237316195423570985008687907853269984665640564039458');
      const randomNumbers = await randomSeedMock.getRandomNumber(seed, 6, true, 0, 2);
      expect(randomNumbers[0]).to.be.bignumber.equal(new BN(4));
      expect(randomNumbers[1]).to.be.bignumber.equal(new BN(1));
    });
    it('startZero=false情况下，位置4~6的随机数应该是1和4', async function () {
      const randomSeedMock = await RandomSeedContractMock.deployed();
      await randomSeedMock.requestRandomNumber();
      const seed = new BN('115792089237316195423570985008687907853269984665640564039458');
      const randomNumbers = await randomSeedMock.getRandomNumber(seed, 6, false, 4, 6);
      expect(randomNumbers[0]).to.be.bignumber.equal(new BN(1));
      expect(randomNumbers[1]).to.be.bignumber.equal(new BN(4));
    });
    it('startZero=true情况下，位置0~2的随机数长度应该是2', async function () {
      const randomSeedMock = await RandomSeedContractMock.deployed();
      await randomSeedMock.requestRandomNumber();
      const seed = new BN('115792089237316195423570985008687907853269984665640564039458');
      const randomNumbers = await randomSeedMock.getRandomNumber(seed, 6, true, 0, 2);
      expect(randomNumbers.length).to.be.equal(2);
    });
    it('startZero=false情况下，位置4~9的随机数长度应该是5', async function () {
      const randomSeedMock = await RandomSeedContractMock.deployed();
      await randomSeedMock.requestRandomNumber();
      const seed = new BN('115792089237316195423570985008687907853269984665640564039458');
      const randomNumbers = await randomSeedMock.getRandomNumber(seed, 6, false, 4, 9);
      expect(randomNumbers.length).to.be.equal(5);
    });
  });

});