const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const HydraEngineMock = artifacts.require('HydraEngineMock');
const RandomSeedContract = artifacts.require('RandomSeedContract');

contract('HydraEngine-activating', function (accounts) {
  beforeEach(async function () {
    this.randomSeed = await RandomSeedContract.new();
    await this.randomSeed.requestRandomNumber();
    this.instanceMock = await HydraEngineMock.new(this.randomSeed.address);
  });

  describe('_inputArraysMappingTo测试，', function () {
    it('函数应该测试正常映射', async function () {
      // uint8 inputA, uint8 inputAIndex, uint8 inputB, uint8 inputBIndex
      const result = await this.instanceMock._inputArraysMappingTo(new BN(1), new BN(2), new BN(3), new BN(4));
      expect(result[0].number).to.be.bignumber.equal(new BN(1));
      expect(result[0].index).to.be.bignumber.equal(new BN(2));
      expect(result[1].number).to.be.bignumber.equal(new BN(3));
      expect(result[1].index).to.be.bignumber.equal(new BN(4));
    });
  });

  describe('_removeEmptyFragmentsEnergy测试，', function () {
    it('top区0和4相同的输入，应该都等于0', async function () {
      let inputs = [];
      for (let i = 0; i < 16; i++) {
        inputs[i] = new BN(0);
      }
      inputs[0] = 5;
      inputs[4] = 5;
      const result = await this.instanceMock._removeEmptyFragmentsEnergy(inputs);
      expect(result[0]).to.be.bignumber.equal(new BN(0));
      expect(result[4]).to.be.bignumber.equal(new BN(0));
    });

    it('top区11和15相同的输入，应该都等于0', async function () {
      let inputs = [];
      for (let i = 0; i < 16; i++) {
        inputs[i] = new BN(0);
      }
      inputs[11] = 1;
      inputs[15] = 1;
      const result = await this.instanceMock._removeEmptyFragmentsEnergy(inputs);
      expect(result[11]).to.be.bignumber.equal(new BN(0));
      expect(result[15]).to.be.bignumber.equal(new BN(0));
    });

    it('top区1和5不相同的输入，应该都等于原值', async function () {
      let inputs = [];
      for (let i = 0; i < 16; i++) {
        inputs[i] = new BN(0);
      }
      inputs[1] = 5;
      inputs[5] = 6;
      const result = await this.instanceMock._removeEmptyFragmentsEnergy(inputs);
      expect(result[1]).to.be.bignumber.equal(new BN(5));
      expect(result[5]).to.be.bignumber.equal(new BN(6));
    });

    it('top区8和12不相同的输入，应该都等于原值', async function () {
      let inputs = [];
      for (let i = 0; i < 16; i++) {
        inputs[i] = new BN(0);
      }
      inputs[8] = 1;
      inputs[12] = 3;
      const result = await this.instanceMock._removeEmptyFragmentsEnergy(inputs);
      expect(result[8]).to.be.bignumber.equal(new BN(1));
      expect(result[12]).to.be.bignumber.equal(new BN(3));
    });
  });
  
  describe('_checkArtifactFragmentsInputTop测试，', function () {
    it('前8个元素不是0的情况下，应该判断top=false', async function () {
      let inputs = [];
      for (let i = 0; i < 16; i++) {
        inputs[i] = new BN(0);
      }
      for (let i = 0; i < 8; i++) {
        inputs[i] = new BN(1);
      }
      const result = await this.instanceMock._checkArtifactFragmentsInputTop(inputs);
      expect(result).to.be.false;
    });

    it('前8个元素有0的情况下，应该判断top=true', async function () {
      let inputs = [];
      for (let i = 0; i < 16; i++) {
        inputs[i] = new BN(0);
      }
      for (let i = 0; i < 5; i++) {
        inputs[i] = new BN(1);
      }

      const result = await this.instanceMock._checkArtifactFragmentsInputTop(inputs);
      expect(result).to.be.true;
    });
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