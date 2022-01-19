const HydraEngine = artifacts.require("HydraEngine");
const RandomSeedContract = artifacts.require('RandomSeedContract');

module.exports = function (deployer) {
  deployer.deploy(RandomSeedContract).then(function() {
    return deployer.deploy(HydraEngine, RandomSeedContract.address);
  });
};
