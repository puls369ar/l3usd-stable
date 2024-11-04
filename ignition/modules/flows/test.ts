

import { ethers } from "hardhat";


async function chainlinkFlow() {
    const gasPrice = ethers.parseUnits('90', 'gwei'); // Adjust the '10' as needed
    const gasLimit = 5000000; // Adjust this value based on your needs
    const valueToSend = ethers.parseEther("0.9");
    
    // Create a signer using the private key and provider
    const signer = new ethers.Wallet(process.env.LIF3_PRIVATE_KEY!, new ethers.JsonRpcProvider(process.env.LIF3_TESTNET_RPC_URL));
    const signer_address = await signer.getAddress();

    const jobID: string = "cabcd695d7894a4ea5c0e41eaf1b6309";

    const operator_address: string = "0xE9fb047EA6A54099C9ecb49786EE3f42fB03cea4";
    

    console.log("Deploying `ATestnetConsumer2F` ");
    const Consumer = await ethers.getContractFactory("ATestnetConsumer2F");
    const consumer = await Consumer.deploy("0x47CC0b4B6C2AC1D26345c6Ad40c2E251991a1121");
    console.log("deployed at: ", await consumer.getAddress());

    
    // const tx1 = await consumer.requestEthereumPrice.call(operator_address, jobID);
    // await tx1.wait();
    // console.log("Simulation successful, result:", tx1);
   
    
    // console.log("Reading the price");
    // const tx2 = await consumer.currentPrice();
    
    // console.log("TX address:", tx2.hash);

    
    


}

chainlinkFlow()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });