import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WalletConnectService} from "../../shared/services/wallet-connect.service";
import {AuthenticationService} from "../../auth/services/authentication.service";
import {NgbModal, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from "@angular/forms";
import {ToastService} from "../../shared/services/toast.service";
import {LoaderService} from "../../shared/services/loader.service";
import {NgSelectModule} from "@ng-select/ng-select";
import {ApiService} from "../../shared/services/api.service";
import {MobileMoneyModelComponent} from "./mobile-money-model/mobile-money-model.component";

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, NgbNavModule, FormsModule, NgSelectModule, ReactiveFormsModule],
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WalletComponent implements OnInit {
  active = 1;
  userId: any;
  isWalletConnected: boolean = false;
  setPaymentForm: FormGroup;
  ethToUsd: any = 1;
  usdtToUsd: any = 1;
  usdcToUsd: any = 1;
  fcfaToUsd:any=1;
  subactive = 1;
  amountInUsd: any = 0;
  safeGasPrice: any = 0
  proposeGasPrice: any = 0
  fastGasPrice: any = 0
  suggestBaseFee: any = 0
  selectedCurrency: any = 'ETH';
  ethBalance: any = 0;
  usdtBalance: any = 0;
  usdcBalance: any = 0;
  fcfaBalance:any=0
  setMobileMoneyForm: FormGroup;
  currency = [
    {id: 'ETH', name: 'ETH', avatar: '../assets/images/front/ethereum-icon.png'},
    {id: 'USDC', name: 'USDC', avatar: '../assets/images/front/usdc.png'},
    {id: 'USDT', name: 'USDT', avatar: '../assets/images/front/usdt.png'},
    {id: 'FCFA', name: 'FCFA', avatar: '../assets/images/front/fcfa.png'}
  ];

  constructor(
    private walletConnectService: WalletConnectService,
    private authService: AuthenticationService,
    private toastService: ToastService,
    private loaderService: LoaderService,
    private fb: FormBuilder,
    private apiService: ApiService,
    private modalService: NgbModal
  ) {
    this.userId = this.authService.currentUserValue?.user_id;
    this.walletConnectService.isWalletConnected$.subscribe((isWalletConnected) => {
      this.isWalletConnected = isWalletConnected;
    })
    // this.loaderService.showTransactionLoader('eth')
    // this.loaderService.completeAllTransactionSteps('eth')
    this.setPaymentForm = this.fb.group({
      paymentMethod: ['ETH', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.00000000000000000001)]],
    })
    this.setMobileMoneyForm = this.fb.group({
      paymentMethod: ['FCFA', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.00000000000000000001), this.integerValidator]],
    })
    this.setMobileMoneyForm.get('paymentMethod')?.valueChanges.subscribe((paymentMethod) => {
      this.setMobileMoneyForm.patchValue({amount: null})
      this.amountInUsd = null;

      this.setMobileMoneyForm.get('amount')?.updateValueAndValidity();
    });

    this.setPaymentForm.get('paymentMethod')?.valueChanges.subscribe((paymentMethod) => {
      this.setPaymentForm.patchValue({amount: 0})
      this.amountInUsd = 0;

      this.setPaymentForm.get('amount')?.updateValueAndValidity();
    });
    this.walletConnectService.getUserBalance(this.userId);

    this.walletConnectService.ethBalance$.subscribe((ethBalance) => {
      this.ethBalance = ethBalance;
    })
    this.walletConnectService.usdtBalance$.subscribe((usdtBalance) => {
      this.usdtBalance = usdtBalance;
    })
    this.walletConnectService.usdcBalance$.subscribe((usdcBalance) => {
      this.usdcBalance = usdcBalance;
    })
    this.walletConnectService.fcfaBalance$.subscribe((fcfaBalance) => {
      this.fcfaBalance = fcfaBalance;
    })
  }

  ngOnInit(): void {
    this.getGasAndEtherPrice()
  }
  integerValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (Number.isInteger(value)) {
      return null; // valid integer
    } else {
      return {notInteger: true}; // validation error
    }
  }
  get isSetPaymentFormValid() {
    return this.setPaymentForm.valid;
  }
  get issetMobileMoneyFormValid() {
    return this.setMobileMoneyForm.valid;
  }
  convertUsdToMobileMoney(event: any) {
    this.amountInUsd = event.target.value.replace(/^0+/, '');
    let type = this.setMobileMoneyForm.get('paymentMethod')?.value
    if (type == 'FCFA') {
      this.setMobileMoneyForm.patchValue({
        // amount: this.amountInUsd / this.ethToUsd
        amount: Math.round(parseFloat((this.amountInUsd / this.fcfaToUsd).toFixed(5)))
      })
    }

  }
  convertMobileMoneyToUsd(amount: any): any {

    let type = this.setMobileMoneyForm.get('paymentMethod')?.value
    if (type == 'FCFA') {
      return parseFloat((amount * this.fcfaToUsd).toFixed(5))
    }
  }
  navChangeFn() {
    this.setPaymentForm.patchValue({amount: null})
    this.amountInUsd = null;

    this.setPaymentForm.get('amount')?.updateValueAndValidity();
    this.setMobileMoneyForm.patchValue({amount: null})
    this.amountInUsd = null;
    this.setMobileMoneyForm.get('amount')?.updateValueAndValidity();

  }

  mainNavChangeFn() {
    this.subactive = 1;
    this.setPaymentForm.patchValue({amount: null})
    this.amountInUsd = null;
    this.setPaymentForm.get('amount')?.updateValueAndValidity();

    this.setMobileMoneyForm.patchValue({amount: null})
    this.amountInUsd = null;
    this.setMobileMoneyForm.get('amount')?.updateValueAndValidity();


  }

  getGasAndEtherPrice() {
    this.apiService.gasAndEthTracker().subscribe((res) => {
      if (res.status == 'OK' && res.statusCode == 200 && res.body.length > 0) {
        // console.log(res);
        let gasData = res.body.find(x => x.type == 'GAS')
        let ethData = res.body.find(x => x.type == 'ETH')
        let fcfaData = res.body.find(x => x.type == 'XAF')

        if (gasData) {
          this.safeGasPrice = gasData.safeGasPrice
          this.proposeGasPrice = gasData.proposeGasPrice
          this.fastGasPrice = gasData.fastGasPrice
          this.suggestBaseFee = gasData.suggestBaseFee
        }
        if (ethData) {
          this.ethToUsd = ethData.ethUsd
          this.usdcToUsd = ethData.usdc ?? 1
          this.usdtToUsd = ethData.usdt ?? 1
        }
        if (fcfaData) {
          this.fcfaToUsd = fcfaData.ethUsd
        }
      }
    })
  }

  valueChange(data: any) {
    // console.log(data.target.value);
    this.amountInUsd = this.convertEthOrTokenToUsd(data?.target?.value ?? 0);
  }

  convertUsdToEthOrToken(event:any) {
    this.amountInUsd= event.target.value.replace(/^0+/, '');
    let type = this.setPaymentForm.get('paymentMethod')?.value
    if (type == 'ETH') {
      this.setPaymentForm.patchValue({
        // amount: this.amountInUsd / this.ethToUsd
        amount: parseFloat((this.amountInUsd / this.ethToUsd).toFixed(5))
      })
    }
    if (type == 'USDT') {
      this.setPaymentForm.patchValue({
        // amount: this.amountInUsd / this.usdtToUsd
        amount: parseFloat((this.amountInUsd / this.usdtToUsd).toFixed(5))
      })
    }
    if (type == 'USDC') {
      this.setPaymentForm.patchValue({
        // amount: this.amountInUsd / this.usdcToUsd
        amount: parseFloat((this.amountInUsd / this.usdcToUsd).toFixed(5))
      })
    }
    if (type == 'FCFA') {
      this.setPaymentForm.patchValue({
        // amount: this.amountInUsd / this.ethToUsd
        amount: parseFloat((this.amountInUsd / this.fcfaToUsd).toFixed(5))
      })
    }
  }

  convertEthOrTokenToUsd(amount: any): any {

    let type = this.setPaymentForm.get('paymentMethod')?.value
    if (type == 'ETH') {
      // return amount * this.ethToUsd
      return parseFloat((amount * this.ethToUsd).toFixed(5))
    } else if (type == 'USDT') {
      return parseFloat((amount * this.usdtToUsd).toFixed(5))
    } else if (type == 'USDC') {
      return parseFloat((amount * this.usdcToUsd).toFixed(5))
    }else if (type == 'FCFA') {
      return parseFloat((amount * this.fcfaToUsd).toFixed(5))
    }
  }


  async withdrawMoney() {
    try {
      if (this.setPaymentForm.invalid) {
        return;
      }
      let formValue = this.setPaymentForm.value;
      let postData = {
        amount: formValue.amount,
        transactionId: '',
        currencyType: ''
      }
      this.loaderService.showLoader()
      if (formValue.paymentMethod === 'ETH') {
        if (formValue.amount > this.ethBalance) {
          this.loaderService.hideLoader()
          this.toastService.show('Insufficient balance', {
            classname: 'bg-danger text-light',
            delay: 3000,
            autohide: true,
          });
          return
        }
        let transaction = await this.walletConnectService.withdrawEther({
          userId: this.userId,
          amount: formValue.amount,
          token: 'ETH'
        });
        postData.transactionId = transaction;
        postData.currencyType = 'ETH'
      } else if (formValue.paymentMethod === 'USDT') {
        if (formValue.amount > this.usdtBalance) {
          this.loaderService.hideLoader()
          this.toastService.show('Insufficient balance', {
            classname: 'bg-danger text-light',
            delay: 3000,
            autohide: true,
          });
          return
        }
        let transaction = await this.walletConnectService.withdrawUSDT({
          userId: this.userId,
          amount: formValue.amount,
          token: 'USDT'
        });
        postData.transactionId = transaction;
        postData.currencyType = 'USDT'

      } else if (formValue.paymentMethod === 'USDC') {
        if (formValue.amount > this.usdcBalance) {
          this.loaderService.hideLoader()
          this.toastService.show('Insufficient balance', {
            classname: 'bg-danger text-light',
            delay: 3000,
            autohide: true,
          });
          return
        }
        let transaction = await this.walletConnectService.withdrawUSDC({
          userId: this.userId,
          amount: formValue.amount,
          token: 'USDC'
        });
        postData.transactionId = transaction;
        postData.currencyType = 'USDC'
      } else {
        return
      }
      this.apiService.withdrawBalance(postData).subscribe((res) => {
        console.log(res);
        this.loaderService.hideLoader()
        if (res.status == 200 && res.flag) {
          this.walletConnectService.getUserBalance(this.userId);
          this.walletConnectService.getUserBalance(this.userId);
          this.toastService.show('Transaction successful', {
            classname: 'bg-success text-light',
            delay: 3000,
            autohide: true,
          });
        } else {
          this.toastService.show('Something went wrong', {
            classname: 'bg-danger text-light',
            delay: 3000,
            autohide: true,
          });
        }
      }, error => {
        this.loaderService.hideLoader()
        console.log(error);
        this.toastService.show('Something went wrong', {
          classname: 'bg-danger text-light',
          delay: 3000,
          autohide: true,
        });
      })

    } catch (e: any) {
      this.loaderService.hideLoader()
      console.log(e);
      this.toastService.show(e.shortMessage || e.message, {
        classname: 'bg-danger text-light',
        delay: 3000,
        autohide: true,
      });
    }

  }

  async connectWallet() {
    try {
      await this.walletConnectService.web3Modal.openModal()
    } catch (e) {
      console.log(e);
      this.toastService.show('Wallet connection aborted', {
        classname: 'bg-danger text-light',
        delay: 3000,
        autohide: true,
      });
    }
  }

  currencyChange($event: any) {
    console.log($event);
    console.log(this.selectedCurrency);
  }

  getBalanceInSelectedCurrency(currencyId: any) {
    let currency = this.currency.find(x => x.id == currencyId)
    if (currency) {
      if (currency.id == 'ETH') {
        return this.ethBalance ?? 0
      } else if (currency.id == 'USDT') {
        return this.usdtBalance ?? 0
      } else if (currency.id == 'USDC') {
        return this.usdcBalance ?? 0
      }else if (currency.id == 'FCFA') {
        return this.fcfaBalance ?? 0
      }
    }
    return 0
  }

  getCurrencyAvatar(currencyId: any) {
    let currency = this.currency.find(x => x.id == currencyId)
    if (currency) {
      return currency.avatar
    }
    return ''
  }

  getBalanceInUsd(currencyId: any) {
    let currency = this.currency.find(x => x.id == currencyId)
    if (currency) {
      if (currency.id == 'ETH') {
        return parseFloat((this.ethBalance * this.ethToUsd).toFixed(5))
      } else if (currency.id == 'USDT') {
        return parseFloat((this.usdtBalance * this.usdtToUsd).toFixed(5))
      } else if (currency.id == 'USDC') {
        return parseFloat((this.usdcBalance * this.usdcToUsd).toFixed(5))
      }else if (currency.id == 'FCFA') {
        return parseFloat((this.fcfaBalance * this.fcfaToUsd).toFixed(5))
      }
    }
    return 0
  }

  valueChangeMobileMoney(data: any) {
    // console.log(data.target.value);
    this.amountInUsd = this.convertMobileMoneyToUsd(data?.target?.value ?? 0);
  }

  addMobileMoney() {
    if (this.setMobileMoneyForm.invalid) {
      return;
    }
    console.log(this.setMobileMoneyForm.value);
    let modelRef = this.modalService.open(MobileMoneyModelComponent, {
      size: 'md',
      backdrop: 'static',
      modalDialogClass: 'mobile_money_modal',
      keyboard: false
    });
    modelRef.componentInstance.data = this.setMobileMoneyForm.value;
    modelRef.closed.subscribe((res) => {
      this.walletConnectService.getUserBalance(this.userId);
    })
    modelRef.dismissed.subscribe((res) => {
      this.walletConnectService.getUserBalance(this.userId);
    })
  }
}
