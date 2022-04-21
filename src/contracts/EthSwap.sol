pragma solidity ^0.5.0;

import "./Token.sol";

contract EthSwap {
    string public name = "EthSwap Instant Exchange";
    Token public token;
    uint public rate = 100; // 1 ether for 100 DApp Token

    // event is usually to keep track of when something occurs
    // account: person who purchased 
    // token: purchased from 
    // amount: amount of tokens purchased
    // rate: the rate in which the tokens were purchased by
    event TokensPurchased(
        address account, 
        address token,
        uint amount,
        uint rate
    );

    event TokensSold(
        address account, 
        address token,
        uint amount,
        uint rate
    );

    // gets called everytime a smart contract gets deployed
    constructor(Token _token) public {
        token = _token;
    }

    // payable means ether will be sent when calling function
    // public means anyone can call function
    function buyTokens() public payable {
        uint amount = msg.value * rate; // msg.value is the amount of ether being sent

        // "this" is a self reference to the smart contract
        // require that ethswap has enough tokens to be purchased
        require(token.balanceOf(address(this)) >= amount);
        token.transfer(msg.sender, amount); // msg.sender is the address of person calling function

        emit TokensPurchased(msg.sender, address(token), amount, rate);
    }

    // We don't use payable because ether isn't being sent my the caller. Instead they're receiving ether.
    function sellTokens(uint _amount) public {
        require(token.balanceOf(msg.sender) >= _amount); // seller cannot sell more than they have

        uint etherAmount = _amount / rate;

        require(address(this).balance >= etherAmount);

        token.transferFrom(msg.sender, address(this), _amount);
        msg.sender.transfer(etherAmount);

        emit TokensSold(msg.sender, address(token), _amount, rate);
    }
}
