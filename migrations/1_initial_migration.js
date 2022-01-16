const HydraEngine = artifacts.require("HydraEngine");

module.exports = function (deployer) {
  deployer.deploy(HydraEngine);
};
