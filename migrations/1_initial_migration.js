const HydraEngine = artifacts.require("HydraEngine");
const RandomSeedContract = artifacts.require('RandomSeedContract');
const RandomSeedContractMock = artifacts.require('RandomSeedContractMock');

module.exports = function (deployer) {
  deployer.deploy(RandomSeedContract).then(function() {
    return deployer.deploy(HydraEngine, RandomSeedContract.address);
  }).then(function() {
    return deployer.deploy(RandomSeedContractMock);
  });
};
