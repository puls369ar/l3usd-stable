This document represents the problem emerged when implementing data request behaviour according to [instructions](https://docs.chain.link/chainlink-nodes/v1/fulfilling-requests#requirements)

* ATestnetConsumer [contract](https://testnet.lif3scout.com/address/0xFCD2a09dafD5aF69FeD44800482807183e667dC7?tab=contract)] was deployed into LIF3-testnet  
  `_setChainlinkToken(0xa17d959f3d2602c6661340A6309B331ccD9590d5)` address of LINK token was changed to wrapped chain native WLIF3 [address](https://testnet.lif3scout.com/token/0xa17d959f3d2602c6661340A6309B331ccD9590d5?tab=token_transfers)

    `requestEthereumPrice()` function should return ETH/USD price from API, inputs chainlink's running NodeID and deployed Oracle's address
    * Oracle [contract](https://testnet.lif3scout.com/address/0x216218130e89878de75F2D92FB3791beb6276bbE)
    * Admin [wallet](https://testnet.lif3scout.com/address/0xe5BefEB20b7Cd906a833B2265DCf22f495E29214) is the one that receives payment when data request is fulfilled by the chainlink node
    * Chainlink node has it's own [wallet](https://testnet.lif3scout.com/address/0x0D9C65941cbC27c08D15378B191efA08d65e296D) that should always have vanilla LIF3 to pay for gas
    * Chainlink's NodeID is `bd873656a86141dd964ad18606126518`

    ```
    contracts above will be verified soon
    ```

    `requestEthereumPrice(<CHAINLINK_NODE_ID>,<ORACLE_ADDRESS>)` was supposed to return the value fetched from API [call](https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD), but it is being reverted with no logs. Reason isn't identified

This document represents the problem emerged when implementing data request behaviour according to [instructions](https://docs.chain.link/chainlink-nodes/v1/fulfilling-requests#requirements)

* ATestnetConsumer [contract](https://testnet.lif3scout.com/address/0xFCD2a09dafD5aF69FeD44800482807183e667dC7?tab=contract)] was deployed into LIF3-testnet  
  `_setChainlinkToken(0xa17d959f3d2602c6661340A6309B331ccD9590d5)` address of LINK token was changed to wrapped chain native WLIF3 [address](https://testnet.lif3scout.com/token/0xa17d959f3d2602c6661340A6309B331ccD9590d5?tab=token_transfers)

  `requestEthereumPrice()` function should return ETH/USD price from API, inputs chainlink's running NodeID and deployed Oracle's address
* Oracle [contract](https://testnet.lif3scout.com/address/0x216218130e89878de75F2D92FB3791beb6276bbE)
* Admin [wallet](https://testnet.lif3scout.com/address/0xe5BefEB20b7Cd906a833B2265DCf22f495E29214) is the one that receives payment when data request is fulfilled by the chainlink node
* Chainlink node has it's own [wallet](https://testnet.lif3scout.com/address/0x0D9C65941cbC27c08D15378B191efA08d65e296D) that should always have vanilla LIF3 to pay for gas
* Chainlink's NodeID is `bd873656a86141dd964ad18606126518`

```
contracts above will be verified soon
```

`requestEthereumPrice(<CHAINLINK_NODE_ID>,<ORACLE_ADDRESS>)` was supposed to return the value fetched from API [call](https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD), but it is being reverted with no logs. Reason isn't identified
