// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import { IERC20MetadataUpgradeable } from '@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol';

interface IProjectTokenERC20 is IERC20MetadataUpgradeable {
	function claim(address account, uint256 amount) external;
}
