import { network } from "hardhat";

const { ethers } = await network.connect();

const certificateRegistry = await ethers.deployContract(
  "CertificateRegistry"
);

await certificateRegistry.waitForDeployment();

console.log(
  "CertificateRegistry deployed to:",
  await certificateRegistry.getAddress()
);