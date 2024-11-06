import { ethers, run } from "hardhat";
import * as readline from 'readline';

async function chainlinkFlow() {
    const gasPrice = ethers.parseUnits('120', 'gwei'); // Adjust the '10' as needed
    const gasLimit = 5000000; // Adjust this value based on your needs
    
    // Create a signer using the private key and provider
    const signer = new ethers.Wallet(process.env.POLYGON_PRIVATE_KEY!, new ethers.JsonRpcProvider(process.env.POLYGON_AMOY_RPC_URL));
    const signer_address = await signer.getAddress();
    // const l3usdgovernance = m.contract("L3USDGovernance", ["0x63b06883ec551e75E4ad565dDadb4AaE97659f34","0x6196E56D45Bac15ee4679a9861Ef7e074F380dc2"]);

    console.log("Deploying L3USDGovernance token")
    const L3USDGovernance = await ethers.getContractFactory("L3USDGovernance");
    const l3usdgovernance = await L3USDGovernance.deploy("0x63b06883ec551e75E4ad565dDadb4AaE97659f34","0x6196E56D45Bac15ee4679a9861Ef7e074F380dc2",{ gasPrice: gasPrice, gasLimit: gasLimit });
    await l3usdgovernance.waitForDeployment();
    const l3usdgovernance_address = await l3usdgovernance.getAddress();
    console.log("L3USDGovernance token deployed to:", l3usdgovernance_address);
    console.log("");

    await l3usdgovernance.deploymentTransaction().wait(6);

    try {
        await run("verify:verify", {
            address: l3usdgovernance_address,
            contract: "contracts/L3USDGovernance.sol:L3USDGovernance",
            constructorArguments: ["0x63b06883ec551e75E4ad565dDadb4AaE97659f34", "0x6196E56D45Bac15ee4679a9861Ef7e074F380dc2"]
        });
        console.log("Contract verified on Etherscan!");
    } catch (err: any) {
        if (err.message.includes("Already Verified")) {
            console.log("Contract is already verified.");
        } else {
            console.error("Verification failed:", err);
        }
    }
}

chainlinkFlow()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

