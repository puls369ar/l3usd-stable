pragma solidity ^0.8.27;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract PriceOracle {
    AggregatorV3Interface private priceOracle;
    uint256 public unstableColPrice;
    address public dataFeed;

    function setDataFeedAddress(address _contractAddress) external {
        dataFeed = _contractAddress;
        priceOracle = AggregatorV3Interface(dataFeed);
    }

    function colPriceToWei() external {
        (, uint256 price, , ,) = priceOracle.latestRoundData();
        uint256 unstablePrice = price*1e10;
    }

    function rawColPrice() external view returns (uint256) {
        ( ,uint256 price, , , ) = priceOracle.latestRoundData();
        return price;
    }
}