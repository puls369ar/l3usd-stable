// SPDX-License-Identifier: MIT LICENSE



pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "./L3USD.sol";

contract L3USDGovernanceHybridCollateral is Ownable, ReentrancyGuard, AccessControl { 
    using SafeERC20 for IERC20;

    struct SupChange {    // logging change in stablecoin's supply
        string method;
        uint256 amount;
        uint256 timestamp;
        uint256 blocknum;
    }

    struct ReserveList {  // Instances of collateral tokens
        IERC20 colToken;
    }

    mapping (uint256 => ReserveList) public rsvList;  // mapping connecting id to the collateral token

    L3USD private l3usd;
    
    address private reserveContract;
    uint256 public l3usdsupply;             // Supply of our stablecoin
    uint256 public supplyChangeCount;       // How many times supply was changed

    uint256 public stableColatPrice = 1e18; // Address of Stable Collateral, should be monitored via Oracle in production
    uint256 public stableColatAmount;

    uint256 public unstableColatAmount;     // Obtained by oracle using feeding `datafeed` value to the `AggregatorV3Interface` interface
    uint256 public unstableColPrice;
    AggregatorV3Interface private priceOracle;
    address public datafeed;

    uint256 private constant COL_PRICE_TO_WEI = 1e10;
    uint256 private constant WEI_VALUE = 1e18;
    
    uint256 public reserveCount;

    mapping (uint256 => SupChange) public _supplyChanges;

    bytes32 public constant GOVERN_ROLE = keccak256("GOVERN_ROLE");

    event RepegAction(uint256 time, uint256 amount);
    event Withdraw(uint256 time, uint256 amount);

    constructor(L3USD _l3usd) Ownable(_msgSender()) {
        l3usd = _l3usd;
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _grantRole(GOVERN_ROLE, _msgSender());
    }

    function setDataFeedAddress(address contractaddress) external onlyRole(GOVERN_ROLE) {
        datafeed = contractaddress;
        priceOracle = AggregatorV3Interface(datafeed);
    }

    function addColateralToken(IERC20 colcontract) external nonReentrant onlyRole(GOVERN_ROLE) {
        rsvList[reserveCount].colToken = colcontract;
        reserveCount++;
    }

    function fetchColPrice() external nonReentrant onlyRole(GOVERN_ROLE) {
        ( , uint256 price, , , ) = priceOracle.latestRoundData();
        uint256 value = (price)*COL_PRICE_TO_WEI;
        unstableColPrice = value;
    }

    function setReserveContract(address reserve) external nonReentrant onlyRole(GOVERN_ROLE) {
        reserveContract = reserve;
    }

    function colateralReBalancing() internal onlyRole(GOVERN_ROLE) returns (bool) {
        uint256 stableBalance = rsvList[0].colToken.balanceOf(reserveContract);
        uint256 unstableBalance = rsvList[1].colToken.balanceOf(reserveContract);
        if (stableBalance != stableColatAmount) {
            stableColatAmount = stableBalance;
        }
        if (unstableBalance != unstableColatAmount) {
            unstableColatAmount = unstableBalance;
        }
        return true;
    }

    function setl3USDSupply(uint256 totalSupply) external onlyRole(GOVERN_ROLE) {
         l3usdsupply = totalSupply;
    }

    function validatePeg() external nonReentrant onlyRole(GOVERN_ROLE) {
        bool result = colateralReBalancing();
        if (result = true) {
            uint256 rawcolvalue = (stableColatAmount*WEI_VALUE)+(unstableColatAmount*unstableColPrice);
            uint256 colvalue = rawcolvalue/WEI_VALUE;
            if (colvalue < l3usdsupply) {
                uint256 supplyChange = l3usdsupply-colvalue;
                l3usd.burn(supplyChange);
                _supplyChanges[supplyChangeCount].method = "Burn";
                _supplyChanges[supplyChangeCount].amount = supplyChange;
            }
            if (colvalue > l3usdsupply) {
                uint256 supplyChange = colvalue-l3usdsupply;
                l3usd.mint(supplyChange);
                _supplyChanges[supplyChangeCount].method = "Mint";
                _supplyChanges[supplyChangeCount].amount = supplyChange;
            }
        l3usdsupply = colvalue;
        _supplyChanges[supplyChangeCount].blocknum = block.number;
        _supplyChanges[supplyChangeCount].timestamp = block.timestamp;
        supplyChangeCount++;
        emit RepegAction(block.timestamp, colvalue);
        }
    }

    function withdraw(uint256 _amount) external nonReentrant onlyRole(GOVERN_ROLE) {
        l3usd.transfer(address(msg.sender), _amount);
        emit Withdraw(block.timestamp, _amount);
    }


}
