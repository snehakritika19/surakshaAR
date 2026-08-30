import { network } from "hardhat";

const { ethers } = await network.connect();

const contractAddress =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const certificateRegistry = await ethers.getContractAt(
  "CertificateRegistry",
  contractAddress
);

// Sample certificate data
const certificateId = "CERT-FIRE-WKR001-001";

const certificateHash = ethers.keccak256(
  ethers.toUtf8Bytes(
    "WKR001-FIRE-85-1-0-true"
  )
);

console.log("Certificate ID:", certificateId);
console.log("Certificate Hash:", certificateHash);

// Issue certificate
const transaction =
  await certificateRegistry.issueCertificate(
    certificateId,
    certificateHash
  );

await transaction.wait();

console.log("Certificate issued successfully!");
// Revoke certificate
const revokeTransaction =
  await certificateRegistry.revokeCertificate(certificateId);

await revokeTransaction.wait();

console.log("Certificate revoked successfully!");

// Verify again
const revokedResult =
  await certificateRegistry.verifyCertificate(certificateId);

console.log("Valid after revocation:", revokedResult[1]);
// Verify certificate
const result =
  await certificateRegistry.verifyCertificate(
    certificateId
  );

console.log("Stored Hash:", result[0]);
console.log("Valid:", result[1]);
console.log("Issued At:", result[2].toString());