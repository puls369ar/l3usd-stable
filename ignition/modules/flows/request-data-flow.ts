

import { ethers } from "hardhat";


async function chainlinkFlow() {
    const gasPrice = ethers.parseUnits('90', 'gwei'); // Adjust the '10' as needed
    const gasLimit = 5000000; // Adjust this value based on your needs
    const valueToSend = ethers.parseEther("0.9");
    
    // Create a signer using the private key and provider
    const signer = new ethers.Wallet(process.env.LIF3_PRIVATE_KEY!, new ethers.JsonRpcProvider(process.env.LIF3_TESTNET_RPC_URL));
    const signer_address = await signer.getAddress();

    const jobID = "cabcd695d7894a4ea5c0e41eaf1b6309";
    const operator_address = "0xE9fb047EA6A54099C9ecb49786EE3f42fB03cea4";
    

    console.log("Deploying `ATestnetConsumer` giving `MLink` address in constructor");
    const Consumer = await ethers.getContractFactory("ATestnetConsumer");
    const consumer = await Consumer.deploy(mlink_address, { gasPrice: gasPrice, gasLimit: gasLimit });
    const consumer_address = await consumer.getAddress()
    console.log(consumer_address);
    console.log("");



    console.log("Calling `requestEthereumPrice()` function giving `jobId` and `operator_address`");
    const tx = await consumer.requestEthereumPrice(operator_address,jobID);
    console.log("TX address:", tx.hash);

    


    
    console.log("Calling `requestEthereumPrice()` function giving `jobId` and `operator_address`");
    const tx1 = await consumer.requestEthereumPrice(operator_address,jobID);
    console.log("TX address:", tx1.hash);
    
    console.log("Reading the price");
    const tx2 = await consumer.currentPrice();
    
    console.log("TX address:", tx2.hash);

    
    


}

chainlinkFlow()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });