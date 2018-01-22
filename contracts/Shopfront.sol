pragma solidity ^0.4.4;

contract Shopfront {

    struct Product{
        string productName;
        uint productPrice;
    }


    modifier onlyOwner() {
        require (msg.sender == owner);
        _;

    }

    mapping (address => uint) balances;
    mapping(uint => Product) products;
    uint[] ids;
    address public warehouse;
    address public owner;
    event LogProductAdded(string name, uint price);
    event LogProductGetted(uint id, string productName, uint productPrice);
    event LogProductPurchased(uint id, address customer, uint price);
    event LogWithdrawal(uint value, address sender);
    event Transfer(address from, address to, uint value);

   function  Shopfront() payable{
        balances[tx.origin] = 10000;
        owner = msg.sender;
   }

    function addProduct(uint id, string name, uint price)
    returns(bool success){
        products[id] = Product(name, price);
        return true;
    }

    function getProduct(uint id) returns (string productName, uint productPrice){
        Product product = products[id];
            return(
            product.productName,
            product.productPrice
        );
        LogProductGetted(id, productName, productPrice);
    }

    function buyProduct(uint id) payable returns (bool success){
        if(msg.value < products[id].productPrice){
            throw;
        }
        LogProductPurchased(id, msg.sender, products[id].productPrice);
        return true;
    }

    function ship(uint id, address customer) returns (bool success){
        LogProductPurchased(id, msg.sender,  products[id].productPrice);
        return true;
    }

    function makePayment(address receiver, uint amount) returns(bool success){
       if(balances[msg.sender] < amount) return false;
       balances[msg.sender] -= amount;
	   balances[receiver] += amount;
	   Transfer(msg.sender, receiver, amount);
       return true;
    }

    function getBalance(address customerAddress)
    payable returns(uint balance){
        return balances[customerAddress];
    }

    function withdraw(uint amount) onlyOwner returns (bool success){
        owner.send(amount);
        return true;
    }

     function getBalanceContract() constant returns(uint){
        return this.balance;
    }

    function getProductCount() external returns (uint) {
        return ids.length;
    }
}


