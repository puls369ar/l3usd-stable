

import { ethers } from "hardhat";


async function chainlinkFlow() {
    const gasPrice = ethers.parseUnits('70', 'gwei'); // Adjust the '10' as needed
    const gasLimit = 1000000; // Adjust this value based on your needs
    const valueToSend = ethers.parseEther("0.9");
    
    // Create a signer using the private key and provider
    const signer = new ethers.Wallet(process.env.LIF3_PRIVATE_KEY!, new ethers.JsonRpcProvider(process.env.LIF3_TESTNET_RPC_URL));
    const signer_address = await signer.getAddress();

    

    
    const nodeAddress = "0x0D9C65941cbC27c08D15378B191efA08d65e296D";
    const jobID = "23d1e5a4b09d42ab9cf92a8836fa968c";


    
    console.log("Deploying Mock `MLink` token")
    const MLink = await ethers.getContractFactory("MLink");
    const mlink = await MLink.deploy({ gasPrice: gasPrice, gasLimit: gasLimit });
    const mlink_address = await mlink.getAddress();
    console.log("MLink token deployed to:", mlink_address);

    console.log("Minting all present `Mlink` tokens into the *OWNER* account who is also the token creator with `MLink::LinkToken()` function");
    console.log("TX address:", (await mlink.LinkToken()).hash);


    
    console.log("Deploying `Operator` giving `LINK: MLink.address` and `OWNER: msg.sedner()` as constructor parameters")
    const Operator = await ethers.getContractFactory("Operator");
    const operator = await Operator.deploy(mlink_address, signer.getAddress(), { gasPrice: gasPrice, gasLimit: gasLimit });
    const operator_address = await operator.getAddress()
    console.log("Operator deployed to:",  operator_address);
    console.log("LINK:", mlink_address);
    console.log("OWNER:", signer_address);
    console.log("");

    console.log("Setting *Authorized Chainlink Node* by calling `setAuthorizedSenders([nodeAddress])` function");
    console.log("TX address:", (await operator.setAuthorizedSenders([nodeAddress])).hash);

    console.log("Deploying `ATestnetConsumer` giving `MLink` address in constructor");
    const Consumer = await ethers.getContractFactory("ATestnetConsumer");
    const consumer = await Consumer.deploy(mlink_address, { gasPrice: gasPrice, gasLimit: gasLimit });
    const consumer_address = await consumer.getAddress()
    
    console.log(consumer_address);


    console.log("Calling `requestEthereumPrice()` function giving `jobId` and `operator_address`");
    
    const tx = await consumer.requestEthereumPrice(operator_address,jobID);
    console.log("TX address:", tx.hash);
    console.log("TX res:", tx);

    
    


}

chainlinkFlow()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });