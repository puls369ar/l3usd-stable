// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const JAN_1ST_2030 = 1893456000;
const ONE_GWEI: bigint = 1_000_000_000n;

const L3USDModule = buildModule("L3USD", (m) => {
  
  const l3usd = m.contract("L3USD");

  return { l3usd };
});

export default L3USDModule;
