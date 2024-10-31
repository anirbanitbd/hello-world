import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../shared/services/api.service";
import {AuthenticationService} from "../../auth/services/authentication.service";
import {CurrencyPipe, DatePipe, DecimalPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {HttpParams} from "@angular/common/http";
import {LoaderService} from "../../shared/services/loader.service";
import {BreadcrumbComponent} from "../../shared/components/breadcrumb/breadcrumb.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe,
    NgClass,
    NgIf,
    BreadcrumbComponent,
    NgSelectModule,
    NgbPagination,
    FormsModule,
    DecimalPipe,
    CurrencyPipe
  ],
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  transactionList: any[] = [];
  pageSizeList: any = [10, 20, 50, 100];
  pageData: {
    page: number,
    limit: number,
    total: number
  };
  selectedFilter: any = '';
  constructor(
    private apiService: ApiService,
    private loaderService: LoaderService,
  ) {
    this.pageData = {
      page: 1,
      limit: 10,
      total: 0
    }
  }

  ngOnInit(): void {
    this.getTransactions();
  }
  setParams() {
    console.log(this.pageData);
    let params:any =  new HttpParams()
    params = params.set('page', this.pageData.page);
    params = params.set('limit', this.pageData.limit);
    if (this.selectedFilter){
      params = params.set('filter', this.selectedFilter);
    }
    return params;
  }
  getTransactions() {
    this.loaderService.showLoader()
    let params = this.setParams();
    this.apiService.getTransactionList(params).subscribe((res) => {
      this.loaderService.hideLoader()
      if (res.status === 200 && res.flag) {
        this.transactionList = res.data;
      }else {
        this.transactionList = [];
      }
      this.pageData.total = res.page_data?.total??0;
    }, (error) => {
      console.log(error);
      this.loaderService.hideLoader()
      this.transactionList = [];
    });
  }
  limitChange() {
    this.pageData.page = 1;
    this.getTransactions()
  }

  pageChange(event:any) {
    this.pageData.page=event;
    this.getTransactions()

  }

  filterChange() {
    this.pageData.page = 1;
    this.getTransactions()
  }
  getTransactionNotes(type: string) {
    if(!type) return '';
    if(type === 'Crypto') {
      return 'Crypto transaction';
    }else if(type === 'P2P_BET_CREATED_COMMISSION' || type === 'P2P_BET_UPDATED_COMMISSION') {
      return 'P2P commission';
    } else if(type === 'P2P_BET_UPDATED_REFUND') {
      return 'P2P commission refund';
    }else if(type === 'COMM_PAYMENT_COMMSSION' || type === 'COMM_PAYMENT_COMMISSION') {
      return 'Com. commission';
    }else if(type === 'ADMIN_WITHDRAW') {
      return 'Withdrawal';
    }else if(type === 'WINNING_ADMIN_TRANSFER') {
      return 'Winning transfer';
    }else if(type === 'BONUS_ADMIN_TRANSFER'){
      return 'Bonus transfer';
    }else if(type === 'MOBILE_MONEY_ADMIN'){
      return 'Add funds';
    }
    return type;
  }
}
