import { Component } from '@angular/core';
const Web3 = require('web3');
const contract = require('truffle-contract');
//const metaincoinArtifacts = require('../../build/contracts/MetaCoin.json');
const shopfrontArtifact = require('../../build/contracts/Shopfront.json');


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';


 // MetaCoin = contract(metaincoinArtifacts);
  Shopfront = contract(shopfrontArtifact);

  deployed: any;
  account: any;
  accounts: any;
  web3: any;

  withdrawAmount: number;
  paymentAmount: number;
  balance: number;
  status: string;

  addProductId: number;
  getProductId: number;
  buyProductId: number;
  shipProductId: number;
  addProductName: string;
  productPrice: number;
  paymentReciever: string;
  productRecieverAddress: string;
  productCount: number;


   constructor() {
     /*
     if (typeof window['web3'] !== 'undefined') {
          this.web3 = new Web3(window['web3'].currentProvider);
       } else {
          this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
     }
     */

    this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    let deployed;
    this.Shopfront.setProvider(this.web3.currentProvider);
    this.onReady();
    this.Shopfront.deployed()
        .then(_deployed => {
            deployed = _deployed;
            this.setStatus('Contract is deployed!');
            deployed.LogProductAdded({fromBlock: 0}).watch(function (err, data) {
              console.log('Product purchased event called');
              this.setStatus('Product Is Added !');
            });
            console.log(this.status);
         }).catch(e => {
            console.log(e);
         });
   }


 onReady = () => {
    // Bootstrap the MetaCoin abstraction for Use.
   // this.MetaCoin.setProvider(this.web3.currentProvider);
    this.Shopfront.setProvider(this.web3.currentProvider);
    // Get the initial account balance so it can be displayed.
    this.web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        alert('There was an error fetching your accounts.');
        return;
      }

      if (accs.length === 0) {
        alert(
          'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'
        );
        return;
      }
      this.accounts = accs;
      this.account = this.accounts[0];
      console.log(this.account);
     });
  }


  setStatus = message => {
    this.status = message;
  }


  addProduct(): void {
   const id = this.addProductId;
   const productName = this.addProductName;
   const price = this.productPrice;

   let shopfront;
   this.Shopfront.deployed()
   .then(instance => {
    shopfront = instance;
    return shopfront.addProduct(id, productName, price, {
       from: this.account
    });
  }).then(txObject => {
     console.log('You add a Product by ID');
  }).catch(e => {
     console.log(e);
  });
   }



  getProduct(): void{
   const id = this.getProductId;

   let shopfront;
   this.Shopfront.deployed()
   .then(instance => {
    shopfront = instance;
    return shopfront.getProduct.call(id, {
       from: this.account
    });
  })
   .then(data => {
     console.log('You get a Product by Id !');
  }).catch(e => {
     console.log(e);
  });
 }



  buyProduct(): void{
   const id = this.buyProductId;

   let shopfront;
   this.Shopfront.deployed()
   .then(instance => {
    shopfront = instance;
    return shopfront.buyProduct(id, {
       from: this.account
    });
  })
   .then(data => {
     console.log('You buy a Product by Id !');
  }).catch(e => {
     console.log(e);
  });
 }


  ship(): void{
    const id = this.shipProductId;
    const shipmentRAddress = this.productRecieverAddress;

    let shopfront;
    this.Shopfront.deployed()
      .then(instance => {
        shopfront = instance;
        return shopfront.ship(id, shipmentRAddress, {
          from: this.account
        });
      })
      .then(data => {
        console.log('You ship a Product !');
      }).catch(e => {
        console.log(e);
    });
  }



  makePayment(): void{
    const amount = this.paymentAmount;
    const reciever = this.paymentReciever;

    let shopfront;
    this.Shopfront.deployed()
      .then(instance => {
        shopfront = instance;
        return shopfront.makePayment(reciever,  amount, {
          from: this.account
        });
      })
      .then(data => {
        console.log('You make a Payment !');
      }).catch(e => {
        console.log(e);
    });
   }



  withdraw(): void{
    const amount = this.withdrawAmount;

    let shopfront;
    this.Shopfront.deployed()
      .then(instance => {
        shopfront = instance;
        return shopfront.withdraw(amount, {
          from: this.account
        });
      })
      .then(data => {
        console.log('You withdraw money !');
      }).catch(e => {
        console.log(e);
    });
  }


  getProductCount(): void{
     const count = this.productCount;

    let shopfront;
    this.Shopfront.deployed()
      .then(instance => {
        shopfront = instance;
        return shopfront.getProductCount.call( {
          from: this.account
        });
      })
      .then(data => {
        console.log('Product Count');
        console.log(data);
      }).catch(e => {
        console.log(e);
    });
  }
}
