// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CertificateRegistry {

    struct Certificate {
        string certificateId;
        bytes32 certificateHash;
        bool valid;
        uint256 issuedAt;
    }

    mapping(string => Certificate) private certificates;

    function issueCertificate(
        string memory certificateId,
        bytes32 certificateHash
    ) public {
        certificates[certificateId] = Certificate(
            certificateId,
            certificateHash,
            true,
            block.timestamp
        );
    }

    function verifyCertificate(
        string memory certificateId
    )
        public
        view
        returns (
            bytes32 certificateHash,
            bool valid,
            uint256 issuedAt
        )
    {
        Certificate memory cert = certificates[certificateId];

        return (
            cert.certificateHash,
            cert.valid,
            cert.issuedAt
        );
    }

    function revokeCertificate(
        string memory certificateId
    ) public {
        certificates[certificateId].valid = false;
    }
}