import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {environment} from "../environments/environment";
import {LoaderService, TransactionLoaderSteps} from "./shared/services/loader.service";
import {WalletConnectService} from "./shared/services/wallet-connect.service";
import {Title} from "@angular/platform-browser";
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationSkipped,
  NavigationStart,
  Router
} from "@angular/router";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {
  isLoaderShow: boolean = false;
  isTransactionLoaderShow: boolean = false;
  transactionLoaderStepsForEth: TransactionLoaderSteps[] = [];
  transactionLoaderStepsForTok: TransactionLoaderSteps[] = [];
  isEthTransaction: boolean = false;

  constructor(public loaderService: LoaderService,
              private cdr: ChangeDetectorRef,
              private walletConnectService: WalletConnectService,
              private title: Title,
              private router: Router,
              @Inject(DOCUMENT) private document: Document
  ) {
    console.log('Environment config', environment.production);

  }

  async ngOnInit(): Promise<void> {
    this.loaderService.loaderState().subscribe((state: boolean) => {
      this.isLoaderShow = state;
      this.cdr.detectChanges();
    });
    this.loaderService.transactionLoaderState().subscribe((state: any) => {
      this.isTransactionLoaderShow = state.isActive;
      this.isEthTransaction = state.isEth;
      this.cdr.detectChanges();
    });

    this.loaderService.transactionLoaderStepsStateForEth().subscribe((state) => {
      this.transactionLoaderStepsForEth = state;

    })
    this.loaderService.transactionLoaderStepsStateForToken().subscribe((state) => {
      this.transactionLoaderStepsForTok = state;
    })
    this.handleRouterEvent()
  }

  ngOnDestroy(): void {
  }

  handleRouterEvent() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loaderService.showLoader()
      }
      if (event instanceof NavigationCancel) {
        this.loaderService.hideLoader()
      }
      if (event instanceof NavigationError) {
        this.loaderService.hideLoader()
      }
      if (event instanceof NavigationSkipped) {
        this.loaderService.hideLoader()
      }
      if (event instanceof NavigationEnd) {
        this.loaderService.hideLoader()
        console.log('event', event)
        const title = this.title.getTitle();
        console.log('title', title)

      }
    });
  }

}
