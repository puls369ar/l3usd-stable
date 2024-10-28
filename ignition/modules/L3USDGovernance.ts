// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const JAN_1ST_2030 = 1893456000;
const ONE_GWEI: bigint = 1_000_000_000n;

const L3USDGovernanceModule = buildModule("L3USDGovernance", (m) => {
  
  const l3usdgovernance = m.contract("L3USDGovernance", ["0x63b06883ec551e75E4ad565dDadb4AaE97659f34"]);

  return { l3usdgovernance };
});

export default L3USDGovernanceModule;
