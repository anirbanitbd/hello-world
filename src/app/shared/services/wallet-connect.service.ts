// noinspection ExceptionCaughtLocallyJS

import {Injectable} from '@angular/core';
import {
  Config,
  configureChains,
  createConfig, fetchFeeData, mainnet,
  prepareWriteContract,
  readContract, sepolia, waitForTransaction,
  WebSocketPublicClient,
  writeContract
} from "@wagmi/core";
import {EthereumClient, w3mConnectors, w3mProvider} from "@web3modal/ethereum";
import {Web3Modal} from "@web3modal/html";
import {
  Chain,
  decodeEventLog,
  FallbackTransport,
  parseEther,
  parseGwei,
  parseUnits
} from "viem";
import {BehaviorSubject, Observable} from "rxjs";
import {mumbai} from "../chains";
import {environment} from "../../../environments/environment";
// import Web3 from "web3";
import {LoaderService} from "./loader.service";
import {ApiService} from "./api.service";

@Injectable({
  providedIn: 'root'
})
export class WalletConnectService {
  projectId = environment.walletConnectId;
  usdcAbi = require('src/app/shared/jsons/usdc-token-abi.json');
  usdtAbi = require('src/app/shared/jsons/usdt-token-abi.json');
  usdcAbiNew = require('src/app/shared/jsons/usdc-token-abi-new.json');
  usdtAbiNew = require('src/app/shared/jsons/usdt-token-abi-new.json');
  usdcAbiNewAddress:any = environment.NEW_USDC_CONTRACT_ADDRESS;
  usdtAbiNewAddress:any = environment.NEW_USDT_CONTRACT_ADDRESS;
  factoryAbi = require('src/app/shared/jsons/factory-abi.json');
  communityAbi = require('src/app/shared/jsons/community-abi.json');
  walletAbi = require('src/app/shared/jsons/Wallet.json');
  factoryContractAddress: any = environment.factoryAbiAddress;
  newContractAddress: any = environment.NEW_WALLET_ADDRESS;
  isLive = environment.isLive;
  chains: Chain[] = []
  // @ts-ignore
  wagmiConfig: Config<PublicClient<FallbackTransport>, WebSocketPublicClient>
  ethereumClient: EthereumClient
  web3Modal: Web3Modal
  private isWalletConnectedSubject = new BehaviorSubject<boolean>(false);
  isWalletConnected$: Observable<boolean> = this.isWalletConnectedSubject.asObservable();
  private connectedAccountSubject = new BehaviorSubject<any>('');
  connectedAccount$: Observable<string> = this.connectedAccountSubject.asObservable();
  ethBalanceSubject = new BehaviorSubject<any>(0);
  ethBalance$: Observable<any> = this.ethBalanceSubject.asObservable();
  usdtBalanceSubject = new BehaviorSubject<any>(0);
  usdtBalance$: Observable<any> = this.usdtBalanceSubject.asObservable();
  usdcBalanceSubject = new BehaviorSubject<any>(0);
  usdcBalance$: Observable<any> = this.usdcBalanceSubject.asObservable();
  fcfaBalanceSubject = new BehaviorSubject<any>(0);
  fcfaBalance$: Observable<any> = this.fcfaBalanceSubject.asObservable();
  // private web3: Web3

  constructor(
    private loaderService: LoaderService,
    private apiService: ApiService
  ) {
    // this.web3 = new Web3(new Web3.providers.HttpProvider('https://eth-mainnet.blastapi.io/9d4ffbcf-a134-441b-afe6-a4762e7c5ec3'))

    // const block =  this.web3.eth.getBlock(blockNumber);
    // console.log('isLive', this.isLive)
    if (this.isLive) {
      this.chains = [mainnet]
    } else {
      this.chains = [sepolia]
    }
    const {publicClient} = configureChains(this.chains, [w3mProvider({
      projectId: this.projectId
    })])
    this.wagmiConfig = createConfig({
      autoConnect: true,
      connectors: w3mConnectors({
        projectId: this.projectId,
        chains: this.chains
      }),
      publicClient
    })
    this.ethereumClient = new EthereumClient(this.wagmiConfig, this.chains)
    this.web3Modal = new Web3Modal({
      projectId: this.projectId
    }, this.ethereumClient)
    this.web3Modal.setDefaultChain(this.isLive ? mainnet : sepolia)
    this.web3Modal.setTheme({
      themeVariables: {
        "--w3m-accent-color": '#0D002E'
      }
    })
    //wallet connect watch account
    this.ethereumClient.watchAccount(x => {
      // console.log('watchAccount', x)
      if (x.status === 'connected') {
        this.isWalletConnectedSubject.next(true)
      }
      if (x.status === 'disconnected') {
        this.isWalletConnectedSubject.next(false)
      }
      if (x.address) {
        this.connectedAccountSubject.next(x.address)
      } else {
        this.connectedAccountSubject.next('')
      }
      // console.log('isWalletConnectedSubject', this.connectedAccountSubject.value)
      // console.log('isWalletConnectedSubject', this.isWalletConnectedSubject.value)
    })
    fetchFeeData({
      chainId: this.isLive ? mainnet.id : sepolia.id,
      formatUnits: 'gwei',
    }).then(x => {
       // console.log('fetchFeeData', x)
    })
  }


  async withdrawEther(data: any) {
    try{
      const {request} = await prepareWriteContract({
        abi: this.walletAbi,
        address: this.newContractAddress,
        functionName: 'withdrawFromETHOnlyOwner',
        args: [parseEther(data.amount.toString())],
        account: this.connectedAccountSubject.value,
        chainId: this.isLive ? mainnet.id : sepolia.id,
      })
      const {hash} = await writeContract(request)
      // console.log('writeContract', hash)
      await new Promise(resolve => setTimeout(resolve, 2000))

      // const receiptData = await waitForTransaction({
      //   hash: hash,
      // })

      // console.log('data', receiptData)
      // let commData = receiptData.logs.find(x => x.address.toLowerCase() == this.newContractAddress.toLowerCase())!
      // const topics: any = decodeEventLog({
      //   abi: this.walletAbi,
      //   topics: commData.topics,
      //   data: commData.data,
      // })
      // console.log('topics', topics)
      return hash
    }catch (e:any) {
      console.log('error from withdraw',e.shortMessage)
      throw e
    }

  }

  async withdrawUSDT(data: any) {
    try {
      let findDecimals = await readContract({
        abi: this.usdtAbiNew,
        address: this.usdtAbiNewAddress,
        functionName: 'decimals',
        args: [],
        chainId: this.isLive ? mainnet.id : sepolia.id,
      })
      const {request} = await prepareWriteContract({
        abi: this.walletAbi,
        address: this.newContractAddress,
        functionName: 'withdrawFromUSDTOnlyOwner',
        args: [parseUnits(data.amount.toString(), Number(findDecimals)).toString()],
        chainId: this.isLive ? mainnet.id : sepolia.id,
      })
      const {hash} = await writeContract(request)
      await new Promise(resolve => setTimeout(resolve, 2000))
      // const receiptData = await waitForTransaction({
      //   hash: hash,
      //   chainId: this.isLive ? mainnet.id : sepolia.id,
      // })
      return hash
    }catch (e:any) {
      console.log('error from withdraw',e.shortMessage)
      throw e
    }
  }

  async withdrawUSDC(data: any) {
    try {
      let findDecimals = await readContract({
        abi: this.usdcAbiNew,
        address: this.usdcAbiNewAddress,
        functionName: 'decimals',
        args: [],
        chainId: this.isLive ? mainnet.id : sepolia.id,
      })
      const {request} = await prepareWriteContract({
        abi: this.walletAbi,
        address: this.newContractAddress,
        functionName: 'withdrawFromUSDCOnlyOwner',
        args: [parseUnits(data.amount.toString(), Number(findDecimals)).toString()],
        chainId: this.isLive ? mainnet.id : sepolia.id,
      })
      const {hash} = await writeContract(request)
      await new Promise(resolve => setTimeout(resolve, 2000))
      // const receiptData = await waitForTransaction({
      //   hash: hash,
      //   chainId: this.isLive ? mainnet.id : sepolia.id,
      // })
      return hash
    }catch (e:any) {
      console.log('error from withdraw',e.shortMessage)
      throw e
    }
  }

  getUserBalance(userId:any) {
    return this.apiService.getBalance().subscribe((res) => {
      console.log('res', res)
      if (res.flag) {
        this.ethBalanceSubject.next(res.data?.['eth'])
        this.usdtBalanceSubject.next(res.data?.['usdt'])
        this.usdcBalanceSubject.next(res.data?.['usdc'])
        this.fcfaBalanceSubject.next(res.data?.['fcfa'])
      }else {
        this.ethBalanceSubject.next(0)
        this.usdtBalanceSubject.next(0)
        this.usdcBalanceSubject.next(0)
        this.fcfaBalanceSubject.next(0)
      }
    },error => {
      console.log('error', error)
      this.ethBalanceSubject.next(0)
      this.usdtBalanceSubject.next(0)
      this.usdcBalanceSubject.next(0)
      this.fcfaBalanceSubject.next(0)
    })
  }
}
