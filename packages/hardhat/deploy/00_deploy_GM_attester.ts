import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployGMattester: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("GMattester", {
    from: deployer,
    // Contract constructor arguments
    args: ["0x4200000000000000000000000000000000000021"],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });
};

export default deployGMattester;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags GMattester
deployGMattester.tags = ["GMattester"];
