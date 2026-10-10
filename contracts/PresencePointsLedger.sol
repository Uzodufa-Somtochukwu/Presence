// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @notice Records non-transferable Presence Points earned by each wallet.
contract PresencePointsLedger {
    mapping(address => uint256) private _points;

    /// @notice The only address allowed to record points.
    address public immutable awarder;

    event PointsAwarded(address indexed user, uint256 amount, uint256 newTotal);

    error UnauthorizedAwarder();
    error InvalidAwarder();
    error InvalidUser();
    error InvalidAmount();

    constructor(address initialAwarder) {
        if (initialAwarder == address(0)) revert InvalidAwarder();
        awarder = initialAwarder;
    }

    /// @notice Adds earned points to a user's existing total.
    function awardPoints(address user, uint256 amount) external {
        if (msg.sender != awarder) revert UnauthorizedAwarder();
        if (user == address(0)) revert InvalidUser();
        if (amount == 0) revert InvalidAmount();

        uint256 newTotal = _points[user] + amount;
        _points[user] = newTotal;

        emit PointsAwarded(user, amount, newTotal);
    }

    /// @notice Returns a user's total earned Presence Points.
    function pointsOf(address user) external view returns (uint256) {
        return _points[user];
    }
}
