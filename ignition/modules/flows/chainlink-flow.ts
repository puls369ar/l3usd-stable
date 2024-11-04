

import { ethers } from "hardhat";
import * as readline from 'readline';



async function chainlinkFlow() {
    const gasPrice = ethers.parseUnits('120', 'gwei'); // Adjust the '10' as needed
    const gasLimit = 5000000; // Adjust this value based on your needs
    
    // Create a signer using the private key and provider
    const signer = new ethers.Wallet(process.env.POLYGON_PRIVATE_KEY!, new ethers.JsonRpcProvider(process.env.POLYGON_AMOY_RPC_URL));
    const signer_address = await signer.getAddress();

    /*** For Lif3 Chainlink Node */
    // const nodeAddress = "0x0D9C65941cbC27c08D15378B191efA08d65e296D";
    // const jobID = "23d1e5a4b09d42ab9cf92a8836fa968c";

    const nodeAddress = "0xc2796fDDC1A8a398b079fAd680037A35DAC2657d";
    

    
    console.log("Deploying Mock `MLink` token")
    const MLink = await ethers.getContractFactory("MLink");
    const mlink = await MLink.deploy({ gasPrice: gasPrice, gasLimit: gasLimit });
    const mlink_address = await mlink.getAddress();
    console.log("MLink token deployed to:", mlink_address);
    console.log("");



    console.log("Minting all present `Mlink` tokens into the *OWNER* account who is also the token creator with `MLink::LinkToken()` function");
    console.log("TX address:", (await mlink.LinkToken()).hash);
    console.log("");


    
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
    console.log("");
    

    // After creating the operator create chainlink Job and provide operator's address to it
    // As a result we have this job's ID

    let jobID : string;

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    jobID = await new Promise<string>((resolve) => {
        rl.question('JobID: ', (answer) => {
            resolve(answer);
            rl.close();
        })
    });
    

    

    console.log("Deploying `ATestnetConsumer` giving `MLink` address in constructor");
    const Consumer = await ethers.getContractFactory("ATestnetConsumer");
    const consumer = await Consumer.deploy(mlink_address, { gasPrice: gasPrice, gasLimit: gasLimit });
    const consumer_address = await consumer.getAddress()
    console.log(consumer_address);
    console.log("");



    console.log("Calling `requestEthereumPrice()` function giving `jobId` and `operator_address`");
    const tx = await consumer.requestEthereumPrice(operator_address,jobID);
    console.log("TX address:", tx.hash);


}

chainlinkFlow()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });