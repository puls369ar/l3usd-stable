import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const JAN_1ST_2030 = 1893456000;
const ONE_GWEI: bigint = 1_000_000_000n;

const ChainlinkFlowModule = buildModule("ChainlinkFlowModule", (m) => {
  
  const mlink = m.contract("MLink");

  await run("verify:verify", {
    address: mlink.address,
    constructorArguments: [],  // Add constructor arguments if there are any
  });
  const operator = m.contract("Operator",[mlink.target]);

  return { mlink,operator };
});

export default ChainlinkFlowModule;