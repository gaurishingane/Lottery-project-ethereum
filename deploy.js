// deploy code will go here
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
  <secret-words>,
  <rinkeby-url>
);

const web3 = new Web3(provider);
const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Account used: ", accounts[0]);
  // console.log("Interface: ", interface);
  // console.log("bytecode: ", bytecode);
  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data:bytecode })
    .send({ from:accounts[0], gas:'1000000' });
  console.log(interface);
  console.log("Deployed at: ", result.options.address);
  };

deploy();
