// SPDX-License-Identifier: MIT LICENSE


pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";


abstract contract ERC677Receiver {
  function onTokenTransfer(address _sender, uint _value, bytes memory _data) public  virtual;
}

contract USDT is ERC20, ERC20Burnable, Ownable {

  using SafeERC20 for ERC20;

  constructor() Ownable(_msgSender()) ERC20("Tether USD", "USDT") {}

  function mint(uint256 amount) external onlyOwner {
    _mint(msg.sender, amount);
  }

   /**
  * @dev transfer token to a contract address with additional data if the recipient is a contact.
  * @param _to The address to transfer to.
  * @param _value The amount to be transferred.
  * @param _data The extra data to be passed to the receiving contract.
  */
  function transferAndCall(address _to, uint _value, bytes memory _data)
    public
    returns (bool success)
  {
    super.transfer(_to, _value);
    emit Transfer(msg.sender, _to, _value);
    if (isContract(_to)) {
      contractFallback(_to, _value, _data);
    }
    return true;
  }


  // PRIVATE

  function contractFallback(address _to, uint _value, bytes memory _data)
    private
  {
    ERC677Receiver receiver = ERC677Receiver(_to);
    receiver.onTokenTransfer(msg.sender, _value, _data);
  }

  function isContract(address _addr)
    private
    returns (bool hasCode)
  {
    uint length;
    assembly { length := extcodesize(_addr) }
    return length > 0;
  }
}