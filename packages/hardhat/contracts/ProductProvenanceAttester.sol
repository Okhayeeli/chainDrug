//SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import { IEAS, AttestationRequest, AttestationRequestData } from "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";
import { NO_EXPIRATION_TIME, EMPTY_UID } from "@ethereum-attestation-service/eas-contracts/contracts/Common.sol";

/// @title ProductProvenanceAttester
/// @notice Ethereum Attestation Service - Example
contract ProductProvenanceAttester {
    error InvalidEAS();

    // The address of the global EAS contract.
    IEAS private immutable _eas;

    struct ProductProvenance {
        bytes32 productId;
        string productName;
        address producerAddress;
        bytes32 batchId;
        uint64 productionDate;
        uint64 expirationDate;
    }

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

    function attestProductProvenance(ProductProvenance memory input) external returns (bytes32) {
        bytes32 schema = 0xa18f97dfff3f61f3577d9019d0af390b2375d315555482fe379256b504e6d5e4; //ProductProvenance schema
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