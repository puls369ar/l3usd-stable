// SPDX-License-Identifier: MIT LICENSE



pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./chainlink/ATestnetConsumer.sol";
import "./L3USD.sol";
import "./L3USDReserves.sol";

contract L3USDGovernance is Ownable, ReentrancyGuard, AccessControl { 
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

    
    ATestnetConsumer public caller;
    mapping (uint256 => ReserveList) public rsvList;  // mapping connecting id to the collateral token
    L3USD private l3usd;
    //
    address private reserveContract;
    uint256 public l3usdsupply;             
    uint256 public supplyChangeCount;       

    uint256 public stableColatPrice; // Obtained by oracle using feeding `datafeed` value to the `AggregatorV3Interface` interface 
    uint256 public stableColatAmount;
    address public datafeed;



    uint256 private constant COL_PRICE_TO_WEI = 1e10;
    uint256 private constant WEI_VALUE = 1e18;
    
    uint256 public reserveCount;

    mapping (uint256 => SupChange) public _supplyChanges;

    bytes32 public constant GOVERN_ROLE = keccak256("GOVERN_ROLE");

    event RepegAction(uint256 time, uint256 amount);
    event Withdraw(uint256 time, uint256 amount);

    constructor(L3USD _l3usd, address consumer_address) Ownable(_msgSender()) {
        l3usd = _l3usd;
        caller = ATestnetConsumer(consumer_address);
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _grantRole(GOVERN_ROLE, _msgSender());
    }

    // function setDataFeedAddress(address contractaddress) external onlyRole(GOVERN_ROLE) {
    //     datafeed = contractaddress;
    //     priceOracle = AggregatorV3Interface(datafeed);
    // }

    function fetchColPrice() external nonReentrant onlyRole(GOVERN_ROLE) {
        stableColatAmount = caller.currentPrice();
    }

    function setReserveContract(address reserve) external nonReentrant onlyRole(GOVERN_ROLE) {
        reserveContract = reserve;
    }

    function addColateralToken(IERC20 colcontract) external nonReentrant onlyRole(GOVERN_ROLE) {
        rsvList[reserveCount].colToken = colcontract;
        reserveCount++;
    }

    function colateralRebalancing() internal onlyRole(GOVERN_ROLE) returns (bool) {
        uint256 stableBalance = rsvList[0].colToken.balanceOf(reserveContract);
        if (stableBalance != stableColatAmount) {
            stableColatAmount = stableBalance;
        }
       
        return true;
    }

    function setl3USDSupply(uint256 totalSupply) external onlyRole(GOVERN_ROLE) {
         l3usdsupply = totalSupply;
    }

    function validatePeg() external nonReentrant onlyRole(GOVERN_ROLE) {
        bool result = colateralRebalancing();
        if (result = true) {
            uint256 colvalue = stableColatAmount;
            if (colvalue < l3usdsupply) {
                uint256 supplyChange = l3usdsupply-colvalue;
                L3USDReserves(reserveContract).withdrawCollateral(0, supplyChange);
                _supplyChanges[supplyChangeCount].method = "Burn";
                _supplyChanges[supplyChangeCount].amount = supplyChange;
            }
            if (colvalue > l3usdsupply) {
                uint256 supplyChange = colvalue-l3usdsupply;
                L3USDReserves(reserveContract).depositCollateral(0, supplyChange);
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
