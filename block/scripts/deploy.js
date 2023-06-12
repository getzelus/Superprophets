const { ethers } = require("hardhat");

async function main() {

  const contractFactory = await ethers.getContractFactory("SuperProphets");
  const contract = await contractFactory.deploy();
  await contract.deployed();

  // print the address of the deployed contract
  console.log( "contract address: ", contract.address);
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });