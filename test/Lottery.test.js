// contract test code will go here
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); // Upper case Web3 because it is a constructor
const web3 = new Web3(ganache.provider()); //Ganache is a local dummy Ethereum network
const { interface, bytecode } = require('../compile');


let lottery;
let accounts;

beforeEach(async () => {
//Get a list of all accounts
  accounts = await web3.eth.getAccounts();
//use one of the accounts to deploy the contract
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: '1000000' });
    // console.log(lottery);
});

describe('Lottery', () => {
  //check if the contract was deployed
  it('deploys a contract', () => {
    assert.ok(lottery.options.address); //ok method makes assertion that what we are passing in function exists
  });

  it('allows one account to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    });

    const players = await lottery.methods.getPlayer().call({
      from: accounts[0]
    });

    assert.equal(accounts[0],players[0]);
    assert.equal(1,players.length);
  });

  it('allows multiple accounts to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    });
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.02', 'ether')
    });
    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('0.02', 'ether')
    });

    const players = await lottery.methods.getPlayer().call({
      from: accounts[0]
    });

    assert.equal(accounts[0],players[0]);
    assert.equal(accounts[1],players[1]);
    assert.equal(accounts[2],players[2]);
    assert.equal(3,players.length);
  });

  it('requires minimum amount of ether to enter', async () => {
    try{
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 0
      });
      assert(false);
    }
    catch(err){
      assert(err);
    }
  });

  it('only manager can call pick winner', async() => {
    try{
      await lottery.methods.pickWinner.send({
        from: accounts[1]
      });
      assert(false);
    }
    catch(err) {
      assert(err);
    }
  });

  it('sends money to winner and resets the players array', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('2','ether')
    });

    const initialBal = await web3.eth.getBalance(accounts[0]);
    await lottery.methods.pickWinner().send({from: accounts[0]});
    const finalBal = await web3.eth.getBalance(accounts[0]);
    const diff = finalBal - initialBal;
    // console.log(diff);
    assert(diff > web3.utils.toWei('1.8','ether'));

  });



});
