const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const HydraEngine = artifacts.require('HydraEngine');
const RandomSeedContract = artifacts.require('RandomSeedContract');

contract('HydraEngine-searching', function (accounts) {
  beforeEach(async function () {
    this.randomSeed = await RandomSeedContract.new();
    await this.randomSeed.requestRandomNumber(accounts[0]);
    this.instance = await HydraEngine.new(this.randomSeed.address);
  });

/// ---------------------------------------------------------------------------------
  describe('输入数据格式校验，', function () {
    it('输入异常骰子数据应该拦截', async function () {
      await expectRevert(
        this.instance.searching([[new BN(0), new BN(1)], [new BN(0), new BN(1)]], { from: accounts[0] }),
        'wrong inputs number.0',
      );
      await expectRevert(
        this.instance.searching([[new BN(1), new BN(1)], [new BN(8), new BN(1)]], { from: accounts[0] }),
        'wrong inputs number.1',
      );
    });

    it('输入异常骰子位置应该拦截', async function () {
      await expectRevert(
        this.instance.searching([[new BN(1), new BN(8)], [new BN(1), new BN(1)]], { from: accounts[0] }),
        'wrong inputs index.0',
      );
      await expectRevert(
        this.instance.searching([[new BN(1), new BN(1)], [new BN(1), new BN(10)]], { from: accounts[0] }),
        'wrong inputs index.1',
      );
      await expectRevert(
        this.instance.searching([[new BN(1), new BN(1)], [new BN(1), new BN(1)]], { from: accounts[0] }),
        'wrong inputs same index',
      );
    });

    it('输入和种子不一样的骰子数据应该拦截', async function () {
      await expectRevert(
        this.instance.searching([[new BN(1), new BN(1)], [new BN(1), new BN(2)]], { from: accounts[0] }),
        'wrong inputs random.0',
      );
      await expectRevert(
        this.instance.searching([[new BN(5), new BN(1)], [new BN(1), new BN(2)]], { from: accounts[0] }),
        'wrong inputs random.1',
      );
    });

    it('输入位置和已存储的空位置信息不符的应该拦截', async function () {
      await this.instance.moveActorTo(true, new BN(1));
      await this.instance.searching([[new BN(5), new BN(1)], [new BN(2), new BN(2)]]);
      await this.randomSeed.requestRandomNumber(accounts[0]);

      await expectRevert(
        this.instance.searching([[new BN(5), new BN(1)], [new BN(2), new BN(2)]], { from: accounts[0] }),
        'wrong inputs index.0',
      );
      await expectRevert(
        this.instance.searching([[new BN(5), new BN(5)], [new BN(2), new BN(2)]], { from: accounts[0] }),
        'wrong inputs index.1',
      );
    });

    it('演员位置异常应该拦截', async function () {
      await expectRevert(
        this.instance.searching([[new BN(5), new BN(1)], [new BN(2), new BN(3)]], { from: accounts[0] }),
        'wrong actor position',
      );
    });

  });

  // it('非 0~5 的参数会捕获异常', async function () {
  //   const moveActorToReceipt = await this.instance.combating(new BN(-1), { from: accounts[0] });
  //   expectEvent(moveActorToReceipt, 'GameEvents', {
  //     rCodes: ['20000', '50204', '50211', '50221', '50230', '50301'],
  //     seedIsUsed: true
  //   });
  // });

  // it('非 0~5 的参数会捕获异常', async function () {
  //   const numbers = [new BN(6), new BN(4), new BN(3), new BN(2), new BN(2), new BN(2)]
  //   const moveActorToReceipt = await this.instance.operationSearchResult(numbers, { from: accounts[0] });
  //   expectEvent(moveActorToReceipt, 'GameEvents', {
  //     rCodes: ['20000', '50204', '50211', '50221', '50230', '50301'],
  //     seedIsUsed: true
  //   });
  // });

});