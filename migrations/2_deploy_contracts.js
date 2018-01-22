var ConvertLib = artifacts.require("./ConvertLib.sol");
var Shopfront = artifacts.require("./Shopfront.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, Shopfront);
  deployer.deploy(Shopfront);
};
