const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { MAX_UINT256 } = constants;

const RandomSeedContract = artifacts.require('RandomSeedContract');
const RandomSeedContractMock = artifacts.require('RandomSeedContractMock');

contract('RandomSeedContract', function (accounts) {

  it('请求随机数后，种子是未使用状态', async function () {
    const randomSeed = await RandomSeedContract.deployed();
    await randomSeed.requestRandomNumber();
    const isUsed = await randomSeed.checkSeed();
    expect(isUsed).to.be.false;
  });
  
  it('兑换随机数后，种子是已使用状态', async function () {
    const randomSeed = await RandomSeedContract.deployed();
    await randomSeed.requestRandomNumber();
    await randomSeed.markRandomSeedUsed();
    const isUsed = await randomSeed.checkSeed();
    expect(isUsed).to.be.true;
  });

  describe('固定种子下，', function () {
    it('startZero=false情况下，位置0~2的随机数应该是5和2', async function () {
      const randomSeedMock = await RandomSeedContractMock.deployed();
      await randomSeedMock.requestRandomNumber();
      const seed = new BN('115792089237316195423570985008687907853269984665640564039458');
      const randomNumbers = await randomSeedMock.createRandomNumber(seed, 6, false, 0, 2);
      expect(randomNumbers[0]).to.be.bignumber.equal(new BN(5));
      expect(randomNumbers[1]).to.be.bignumber.equal(new BN(2));
    });
    it('startZero=true情况下，位置0~2的随机数应该是4和1', async function () {
      const randomSeedMock = await RandomSeedContractMock.deployed();
      await randomSeedMock.requestRandomNumber(accounts[0]);
      const seed = new BN('115792089237316195423570985008687907853269984665640564039458');
      const randomNumbers = await randomSeedMock.createRandomNumber(seed, 6, true, 0, 2);
      expect(randomNumbers[0]).to.be.bignumber.equal(new BN(4));
      expect(randomNumbers[1]).to.be.bignumber.equal(new BN(1));
    });
    it('startZero=false情况下，位置4~6的随机数应该是1和4', async function () {
      const randomSeedMock = await RandomSeedContractMock.deployed();
      await randomSeedMock.requestRandomNumber(accounts[0]);
      const seed = new BN('115792089237316195423570985008687907853269984665640564039458');
      const randomNumbers = await randomSeedMock.createRandomNumber(seed, 6, false, 4, 6);
      expect(randomNumbers[0]).to.be.bignumber.equal(new BN(1));
      expect(randomNumbers[1]).to.be.bignumber.equal(new BN(4));
    });
    it('startZero=true情况下，位置0~2的随机数长度应该是2', async function () {
      const randomSeedMock = await RandomSeedContractMock.deployed();
      await randomSeedMock.requestRandomNumber(accounts[0]);
      const seed = new BN('115792089237316195423570985008687907853269984665640564039458');
      const randomNumbers = await randomSeedMock.createRandomNumber(seed, 6, true, 0, 2);
      expect(randomNumbers.length).to.be.equal(2);
    });
    it('startZero=false情况下，位置4~9的随机数长度应该是5', async function () {
      const randomSeedMock = await RandomSeedContractMock.deployed();
      await randomSeedMock.requestRandomNumber(accounts[0]);
      const seed = new BN('115792089237316195423570985008687907853269984665640564039458');
      const randomNumbers = await randomSeedMock.createRandomNumber(seed, 6, false, 4, 9);
      expect(randomNumbers.length).to.be.equal(5);
    });
  });

});