import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const {vars} = require("hardhat/config");
const polygonscan=process.env.POLYGONSCAN_API_KEY;

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.4.11",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.8.27",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },

  paths: {
    sources: "./contracts/chainlink", 
  },
  
  networks: {
    polygonAmoy: {
      url: process.env.POLYGON_AMOY_RPC_URL,
      accounts: [process.env.POLYGON_PRIVATE_KEY],
      
    },
    lif3Testnet: {
      url: process.env.LIF3_TESTNET_RPC_URL,
      accounts: [process.env.LIF3_PRIVATE_KEY],
      
    }
  },
  etherscan: {
    
    apiKey:{
      polygonAmoy: process.env.POLYGONSCAN_API_KEY,
      lif3Testnet: process.env.LIF3SCOUT_API_KEY
    },
    customChains: [
      {
        network: "lif3Testnet",
        chainId: 1811,
        urls: {
          apiURL: "https://eth-sepolia.blockscout.com/api",
          browserURL: "https://eth-sepolia.blockscout.com"
        }
      }
    ]
  }
};

export default config;
