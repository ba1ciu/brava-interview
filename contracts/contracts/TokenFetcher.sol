// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title TokenFetcher
 * @dev A contract that fetches tokens by transferring them from the caller to itself
 */
contract TokenFetcher {
    // Events
    event TokenFetched(address indexed token, address indexed sender, uint256 amount);
    
    /**
     * @dev Fetches tokens by transferring them from the caller to this contract
     * @param tokenAddress The address of the ERC20 token
     * @param amount The amount of tokens to transfer
     */
    function fetchToken(
        address tokenAddress,
        uint256 amount
    ) external {
        require(tokenAddress != address(0), "Invalid token address");
        require(amount > 0, "Amount must be greater than 0");
        
        IERC20 token = IERC20(tokenAddress);
        
        // Transfer tokens from caller to this contract
        bool success = token.transferFrom(msg.sender, address(this), amount);
        require(success, "Token transfer failed");
        
        emit TokenFetched(tokenAddress, msg.sender, amount);
    }
}

// Interface for ERC20 metadata
interface IERC20Metadata is IERC20 {
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
} 