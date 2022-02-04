const HydraEngine = artifacts.require("HydraEngine");
const HydraEngineConfig = artifacts.require('HydraEngineConfig');
const RandomSeedContract = artifacts.require('RandomSeedContract');
const HydraEngineMock = artifacts.require('HydraEngineMock');
const RandomSeedContractMock = artifacts.require('RandomSeedContractMock');

module.exports = async function(deployer) {
  deployer.deploy(HydraEngineConfig);
  deployer.link(HydraEngineConfig, [HydraEngine, HydraEngineMock]);
  await deployer.deploy(RandomSeedContract);
  const randomSeedContract = await RandomSeedContract.deployed();
  await deployer.deploy(HydraEngine, randomSeedContract.address);
  await deployer.deploy(HydraEngineMock, randomSeedContract.address);
  await deployer.deploy(RandomSeedContractMock);
}
