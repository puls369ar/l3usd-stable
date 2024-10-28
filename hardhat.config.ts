import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const {vars} = require("hardhat/config")
const polygonscan=vars.get("POLYGONSCAN_API_KEY")

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.27",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  
  networks: {
    polygonAmoy: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      
    }
  },
  etherscan: {
    
    apiKey:{
      polygonAmoy: process.env.POLYGONSCAN_API_KEY,
    }
  }
};

export default config;
