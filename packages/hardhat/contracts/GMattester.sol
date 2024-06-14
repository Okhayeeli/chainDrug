//SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import { IEAS, AttestationRequest, AttestationRequestData } from "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";
import { NO_EXPIRATION_TIME, EMPTY_UID } from "@ethereum-attestation-service/eas-contracts/contracts/Common.sol";

/// @title GMattester
/// @notice Ethereum Attestation Service - Example
contract GMattester {
    error InvalidEAS();

    // The address of the global EAS contract.
    IEAS private immutable _eas;

    /// @notice Creates a new ExampleAttester instance.
    /// @param eas The address of the global EAS contract.
    constructor(IEAS eas) {
        if (address(eas) == address(0)) {
            revert InvalidEAS();
        }

        _eas = eas;
    }

    /// @notice Attests to a schema that receives a uint256 parameter.
    /// @param schema The schema UID to attest to.
    /// @param input The uint256 value to pass to to the resolver.
    /// @return The UID of the new attestation.
    function attestUint(bytes32 schema, uint256 input) external returns (bytes32) {
        return
            _eas.attest(
            AttestationRequest({
                schema: schema,
                data: AttestationRequestData({
                recipient: address(0), // No recipient
                expirationTime: NO_EXPIRATION_TIME, // No expiration time
                revocable: true,
                refUID: EMPTY_UID, // No references UI
                data: abi.encode(input), // Encode a single uint256 as a parameter to the schema
                value: 0 // No value/ETH
            })
            })
        );
    }

    function attestGM( bool input) external returns (bytes32) {

        bytes32 schema = 0x85500e806cf1e74844d51a20a6d893fe1ed6f6b0738b50e43d774827d08eca61; //GM schema
        return
            _eas.attest(
            AttestationRequest({
                schema: schema,
                data: AttestationRequestData({
                recipient: address(0), // No recipient
                expirationTime: NO_EXPIRATION_TIME, // No expiration time
                revocable: true,
                refUID: EMPTY_UID, // No references UI
                data: abi.encode(input), 
                value: 0 // No value/ETH
            })
            })
        );
    }
}