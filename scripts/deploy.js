const { ethers, run, network } = require("hardhat");

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying...!");
  const SimpleStorage = await SimpleStorageFactory.deploy();
  await SimpleStorage.deployed();
  console.log(`Deployed to: ${SimpleStorage.address}`);
  //we cant verify our contract when we are deploying to our hardhat network
  if (network.config.chainId == 4 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block confirmations...");
    await SimpleStorage.deployTransaction.wait(6);
    await verify(SimpleStorage.address, []);
  }

  const currentValue = await SimpleStorage.retrieve();
  console.log(`Current value is: ${currentValue}`);
  const storingValue = await SimpleStorage.store("5");
  await storingValue.wait(1);
  const updatedValue = await SimpleStorage.retrieve();
  console.log(`Updated value is: ${updatedValue}`);
}
async function verify(contractAddress, args) {
  console.log("Verifying contract..");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified");
    } else {
      console.log(e);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
