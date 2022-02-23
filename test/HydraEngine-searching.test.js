const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const HydraEngine = artifacts.require('HydraEngine');
const HydraEngineMock = artifacts.require('HydraEngineMock');
const RandomSeedContract = artifacts.require('RandomSeedContract');

contract('HydraEngine-searching', function (accounts) {
  beforeEach(async function () {
    this.randomSeed = await RandomSeedContract.new();
    await this.randomSeed.requestRandomNumber();
    this.instance = await HydraEngine.new(this.randomSeed.address);
    this.instanceMock = await HydraEngineMock.new(this.randomSeed.address);
  });

/// ---------------------------------------------------------------------------------
  describe('内部函数测试,', function () {
    describe('operationSearchResult,', function () {
      it('写入[5, 2, 5, 2, 5, 2]，结果应该是 273', async function () {
        const result = await this.instanceMock._operationSearchResult([new BN(5), new BN(2), new BN(5), new BN(2), new BN(5), new BN(2)]);

        expect(result).to.be.bignumber.equal(new BN(273));
      });
    });

    describe('combating,', function () {
      it('参数是 273，应该抛出事件', async function () {
        const _combatingReceipt = await this.instanceMock._combating(new BN(273));

        expectEvent(_combatingReceipt, 'TestCombating', {
          rCodes: ['40101', '20220'],
        });
      });
    });

  });

/// ---------------------------------------------------------------------------------
  describe('填写搜索结果，', function () {
    it('写入第一次 [5, 0], [2, 1]', async function () {
      await this.instance.moveActorTo(true, new BN(1));
      const searchingReceipt = await this.instance.searching(new BN(5), new BN(0), new BN(2), new BN(1));

      expectEvent(searchingReceipt, 'GameEvents', {
        rCodes: ['50610'],
        seedIsUsed: true
      });
    });

    it('写入第一次 [5, 0], [2, 1]后，种子是已使用的状态', async function () {
      await this.instance.moveActorTo(true, new BN(1));
      await this.instance.searching(new BN(5), new BN(0), new BN(2), new BN(1));
      const isUsed = await this.randomSeed.checkSeed(accounts[0]);
      expect(isUsed).to.be.false;
    });

    it('写入全部数据 [5, 0], [2, 1]/ [5, 2], [2, 3] / [5, 4], [2, 5]', async function () {
      await this.instance.moveActorTo(true, new BN(1));
      await this.instance.searching(new BN(5), new BN(0), new BN(2), new BN(1));
      await this.randomSeed.requestRandomNumber();
      await this.instance.searching(new BN(5), new BN(2), new BN(2), new BN(3));
      await this.randomSeed.requestRandomNumber();
      const searchingReceipt = await this.instance.searching(new BN(5), new BN(4), new BN(2), new BN(5), { from: accounts[0], gas: 6721975 });

      expectEvent(searchingReceipt, 'GameEvents', {
        rCodes: ['20400', '40111', '20221', '20000', '50201', '50210', '50220', '50233'],
        seedIsUsed: true
      });
    });

  });
/// ---------------------------------------------------------------------------------
  describe('输入数据格式校验，', function () {
    it('输入异常骰子数据应该拦截', async function () {
      await expectRevert(
        this.instance.searching(new BN(0), new BN(1), new BN(0), new BN(1), { from: accounts[0] }),
        'wrong inputs number.0',
      );
      await expectRevert(
        this.instance.searching(new BN(1), new BN(1), new BN(8), new BN(1), { from: accounts[0] }),
        'wrong inputs number.1',
      );
    });

    it('输入异常骰子位置应该拦截', async function () {
      await expectRevert(
        this.instance.searching(new BN(1), new BN(8), new BN(1), new BN(1), { from: accounts[0] }),
        'wrong inputs index.0',
      );
      await expectRevert(
        this.instance.searching(new BN(1), new BN(1), new BN(1), new BN(10), { from: accounts[0] }),
        'wrong inputs index.1',
      );
      await expectRevert(
        this.instance.searching(new BN(5), new BN(1), new BN(2), new BN(1), { from: accounts[0] }),
        'wrong inputs same index',
      );
    });

    it('输入和种子不一样的骰子数据应该拦截', async function () {
      await expectRevert(
        this.instance.searching(new BN(1), new BN(1), new BN(1), new BN(2), { from: accounts[0] }),
        'wrong inputs random.0',
      );
      await expectRevert(
        this.instance.searching(new BN(5), new BN(1), new BN(1), new BN(2), { from: accounts[0] }),
        'wrong inputs random.1',
      );
    });

    it('输入位置和已存储的空位置信息不符的应该拦截', async function () {
      await this.instance.moveActorTo(true, new BN(1));
      await this.instance.searching(new BN(5), new BN(1), new BN(2), new BN(2));
      await this.randomSeed.requestRandomNumber();

      await expectRevert(
        this.instance.searching(new BN(5), new BN(1), new BN(2), new BN(2), { from: accounts[0] }),
        'wrong inputs index.0',
      );
      await expectRevert(
        this.instance.searching(new BN(5), new BN(5), new BN(2), new BN(2), { from: accounts[0] }),
        'wrong inputs index.1',
      );
    });

    it('演员位置异常应该拦截', async function () {
      await expectRevert(
        this.instance.searching(new BN(5), new BN(1), new BN(2), new BN(3), { from: accounts[0] }),
        'wrong actor position',
      );
    });

  });

});