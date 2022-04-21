const { assert } = require('chai');

const EthSwap = artifacts.require("EthSwap");
const Token = artifacts.require("Token");

require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

// abstractifies the array "accounts" to get accounts[0] and accounts[1]
contract("EthSwap", ([deployer, investor]) => {
    let token, ethSwap;

    before(async () => {
        token = await Token.new();
        ethSwap = await EthSwap.new(token.address);
        await token.transfer(ethSwap.address, tokens('1000000')); // 
    })

    describe("Token deployment", async () => {
    });

    describe("EthSwap deployment", async () => {
    });

    describe('buyTokens() inside EthSwap', async () => {
        let result;
        
        before(async () => {
            // "from" is msg.sender AND "value" is msg.value
            result = await ethSwap.buyTokens({ from: investor, value: web3.utils.toWei('1', 'ether')});
        })

        it("Allows user to instantly purchase tokens from ethSwap for a fixed price", async () => {
            // Check investor token balance after purchase
            let investorBalance = await token.balanceOf(investor);
            assert.equal(investorBalance.toString(), tokens('100'))

            // Check ethSwap balance after purchase
            // checks the balance of tokens has been deducted from ethswap
            let ethSwapBalance = await token.balanceOf(ethSwap.address);
            assert.equal(ethSwapBalance.toString(), tokens('999900'));

            // checks balance of ethereum has by added to ethswap
            ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei('1', 'Ether'));

            // emitted events will be inside of the logs of a function
            const event = result.logs[0].args;
            assert.equal(event.account, investor);
            assert.equal(event.token, token.address);
            assert.equal(event.amount, tokens('100').toString());
            assert.equal(event.rate.toString(), '100');
        })
    });

    describe('sellTokens() inside EthSwap', async () => {
        let result;
        
        before(async () => {
            // All ERC-20 tokens need to be approved before selling
            await token.approve(ethSwap.address, tokens('100'), {from: investor});
            result = await ethSwap.sellTokens(tokens('100'), {from: investor})
        })

        it("Allows user to instantly sell tokens to ethSwap for a fixed price", async () => {
            // Check investor token balance after purchase
            let investorBalance = await token.balanceOf(investor);
            assert.equal(investorBalance.toString(), tokens('0'));

            // Check ethSwap balance after purchase
            // checks the balance of tokens has been added from ethswap
            let ethSwapBalance = await token.balanceOf(ethSwap.address);
            assert.equal(ethSwapBalance.toString(), tokens('1000000'));

            // checks balance of ethereum has been deducted from ethSwap
            ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei('0', 'Ether'));

            // emitted events will be inside of the logs of a function
            const event = result.logs[0].args;
            assert.equal(event.account, investor);
            assert.equal(event.token, token.address);
            assert.equal(event.amount, tokens('100').toString());
            assert.equal(event.rate.toString(), '100');

            // FAILURE: investor can't sell more tokens than they have
            await ethSwap.sellTokens(tokens('500'), {from: investor}).should.be.rejected;
        })
    })
})