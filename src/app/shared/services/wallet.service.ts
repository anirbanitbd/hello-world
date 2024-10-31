import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import Web3 from "web3";

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private web3: Web3 | undefined;
  private isMetamaskInstalledSubject = new BehaviorSubject<boolean>(false);
  private isMetamaskConnectedSubject = new BehaviorSubject<boolean>(false);

  isMetamaskInstalled$: Observable<boolean> = this.isMetamaskInstalledSubject.asObservable();
  isMetamaskConnected$: Observable<boolean> = this.isMetamaskConnectedSubject.asObservable();
  usdcAbi = require('src/app/shared/jsons/usdc-token-abi.json');
  usdtAbi = require('src/app/shared/jsons/usdt-token-abi.json');
  factoryAbi = require('src/app/shared/jsons/factory-abi.json');
  communityAbi = require('src/app/shared/jsons/community-abi.json');
  factoryContractAddress: string = '0x2A722eefb4548A251Fd6EEDa9c41691C37edBFFF';

  constructor() {
    this.checkMetamaskAvailability();

  }

  private async checkMetamaskAvailability() {

    // @ts-ignore
    if (typeof window?.ethereum !== 'undefined') {
      this.isMetamaskInstalledSubject.next(true);
      // @ts-ignore
      this.web3 = new Web3(window?.ethereum);
      console.log('this.web3', this.web3);
      // @ts-ignore
      window?.ethereum?.on('accountsChanged', (accounts: string[]) => {
        console.log('accountsChanged', accounts);
        this.updateConnectionStatus();
      });
      // @ts-ignore
      window.ethereum.on('chainChanged', () => {
        console.log('chainChanged');
        this.updateConnectionStatus();
      });
      this.updateConnectionStatus();
    } else {
      this.isMetamaskInstalledSubject.next(false);
    }
  }

  private updateConnectionStatus() {

    // @ts-ignore
    if (this.web3?.currentProvider?.selectedAddress) {
      this.isMetamaskConnectedSubject.next(true);
    } else {
      this.isMetamaskConnectedSubject.next(false);
    }
  }

  async connectMetamask() {
    if (this.web3) {
      try {
        // @ts-ignore
        if (typeof window?.ethereum !== 'undefined') {
          // @ts-ignore
          this.web3 = new Web3(window?.ethereum);
          // @ts-ignore
          const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
          this.updateConnectionStatus();
        } else {
          this.isMetamaskInstalledSubject.next(false);

        }
        // @ts-ignore
        // await window?.ethereum?.request({method: 'eth_requestAccounts'});
        // this.updateConnectionStatus();
      } catch (error) {
        console.error('Error connecting to Metamask:', error);
        this.updateConnectionStatus();
        throw error;
      }
    }
  }


  async getAccount() {
    // @ts-ignore
    if (this.web3?.currentProvider?.selectedAddress) {
      // @ts-ignore
      return this.web3?.currentProvider?.selectedAddress;
    } else {
      return null;
    }
  }

  //smart contract functions starts from here
  convertAmount(amount: number, decimalPlaces: number) {
    return (amount * Math.pow(10, decimalPlaces)).toString();
  }

  async createNewCommunitySmartContract(data: any) {
    console.log('data', data);
    try {
      let account = await this.getAccount();
      if (this.web3?.eth && account) {
        let factoryContract = new this.web3.eth.Contract(this.factoryAbi, this.factoryContractAddress);
        if (data.type == 'TOK') {
          if (data.tokenName == 'USDT') {
            let tokenContract = new this.web3.eth.Contract(this.usdtAbi, data.tokenAddress);
            let findDecimals = await tokenContract.methods.decimals().call();
            let checkAllowance = await tokenContract.methods.allowance(account, this.factoryContractAddress).call();

            if (checkAllowance < this.convertAmount(data.amount, findDecimals)) {
              await tokenContract.methods.approve(this.factoryContractAddress, '115792089237316195423570985008687907853269984665640564039457584007913129639935').send({
                from: account
              });
            }
            let receipt = await factoryContract.methods.createCommunity(data.endTime, true, data.tokenAddress, this.convertAmount(data.amount, findDecimals), data.rule).send({
              from: account,
            })
            console.log('receipt', receipt);
            return receipt;
          } else if (data.tokenName == 'USDC') {
            let tokenContract = new this.web3.eth.Contract(this.usdcAbi, data.tokenAddress);
            let findDecimals = await tokenContract.methods.decimals().call();
            let checkAllowance = await tokenContract.methods.allowance(account, this.factoryContractAddress).call();
            console.log('coverted value', this.convertAmount(data.amount, findDecimals));
            console.log('decimal', findDecimals);
            if (checkAllowance < this.convertAmount(data.amount, findDecimals)) {
              await tokenContract.methods.approve(this.factoryContractAddress, '115792089237316195423570985008687907853269984665640564039457584007913129639935').send({
                from: account
              });
            }
            let receipt = await factoryContract.methods.createCommunity(data.endTime, true, data.tokenAddress, this.convertAmount(data.amount, findDecimals), data.rule).send({
              from: account,
            })
            console.log('receipt', receipt);
            return receipt;
          }

        } else if (data.type == 'ETH') {
          let receipt = await factoryContract.methods.createCommunity(data.endTime, false, data.tokenAddress, this.convertAmount(data.amount, 18), data.rule).send({
            from: account,
            value: this.convertAmount(data.amount, 18)
          })
          return receipt;
        }
      } else {
        return null;
      }

    } catch (e) {
      console.log(e);
      throw e;
    }
  }

 async stackAmountInCommunitySmartContract(data: any) {
    try {
      let account = await this.getAccount();
      console.log('data', data);
      if (this.web3?.eth && account) {
        let communityContract = new this.web3.eth.Contract(this.communityAbi, data.communityContractAddress);
        if (data.type == 'TOK') {
          if (data.tokenName == 'USDT') {
            let tokenContract = new this.web3.eth.Contract(this.usdtAbi, data.tokenAddress);
            let findDecimals = await tokenContract.methods.decimals().call();
            let checkAllowance = await tokenContract.methods.allowance(account, data.communityContractAddress).call();
            console.log('coverted value', this.convertAmount(data.amount, findDecimals));
            console.log('decimal', findDecimals);
            if (checkAllowance < this.convertAmount(data.amount, findDecimals)) {
              await tokenContract.methods.approve(data.communityContractAddress, '115792089237316195423570985008687907853269984665640564039457584007913129639935').send({
                from: account
              });
            }
            let receipt = await communityContract.methods.stackToken().send({
              from: account,
            })
            console.log('receipt', receipt);
            return receipt;
          }else if (data.tokenName == 'USDC') {
            let tokenContract = new this.web3.eth.Contract(this.usdcAbi, data.tokenAddress);
            let findDecimals = await tokenContract.methods.decimals().call();
            let checkAllowance = await tokenContract.methods.allowance(account, data.communityContractAddress).call();
            console.log('coverted value', this.convertAmount(data.amount, findDecimals));
            console.log('decimal', findDecimals);
            if (checkAllowance < this.convertAmount(data.amount, findDecimals)) {
              await tokenContract.methods.approve(data.communityContractAddress, '115792089237316195423570985008687907853269984665640564039457584007913129639935').send({
                from: account
              });
            }
            let receipt = await communityContract.methods.stackToken().send({
              from: account,
            })
            console.log('receipt', receipt);
            return receipt;
          }

        }else if (data.type == 'ETH') {
          let receipt = await communityContract.methods.stackAmount().send({
            from: account
          })
          return receipt;
        }
      }
    }catch (e) {
      console.log(e);
      throw e;
    }
  }
  async getCommunityAdmin(data:any){
    console.log('data', data);
    let account = await this.getAccount();
    console.log('data', data);
    if (this.web3?.eth && account) {
      let communityContract = new this.web3.eth.Contract(this.communityAbi, data.communityContractAddress);
      let receipt = await communityContract.methods.getCommunityAdmin().call();
      console.log('receipt', receipt);
    }
  }

}
