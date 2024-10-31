import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApiService} from "../../shared/services/api.service";
import {Breadcrumb} from "../../shared/types/breadcrumb";
import {HttpParams} from "@angular/common/http";
import {debounceTime, distinctUntilChanged, Subject} from "rxjs";
import {LoaderService} from "../../shared/services/loader.service";
import {BreadcrumbComponent} from "../../shared/components/breadcrumb/breadcrumb.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {NgbModal, NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {AddBalanceComponent} from "./add-balance/add-balance.component";

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, NgSelectModule, NgbPagination, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  breadcrumb: Breadcrumb;
  pageSizeList: any = [10, 20, 50, 100];
  private searchTerms = new Subject<string>();
  searchValue: string = '';
  pageData: {
    page: number,
    limit: number,
    total: number
  };
  constructor(
    private apiService:ApiService,
    private loaderService: LoaderService,
    private modalService: NgbModal,
  ) {
    this.breadcrumb = {
      type: '',
      links: [
        {
          name: 'Home',
          isLink: true,
          link: '/'
        },
        {
          name: 'Users',
          isLink: false,
        }
      ]
    }
    this.pageData = {
      page: 1,
      limit: 10,
      total: 0
    }
  }

  ngOnInit(): void {
    this.getUsers();
    this.searchTerms.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(term => {
      this.pageData.page = 1;
      this.searchValue = term;
      this.getUsers();
    });
  }
  setParams() {
    console.log(this.pageData);
    let params:any =  new HttpParams()
    params = params.set('page', this.pageData.page);
    params = params.set('limit', this.pageData.limit);
    if (this.searchValue) {
      params = params.set('search', this.searchValue);
    }
    return params;
  }

  getUsers() {
    this.loaderService.showLoader()
    let params = this.setParams();
    this.apiService.getAllUserList(params).subscribe((res) => {
      this.loaderService.hideLoader()
      if (res.status === 200 && res.flag) {
        this.users = res.data;
        this.pageData.total = res.page_data?.total??0;
      } else {
        this.users = []
      }
    },error => {
      this.loaderService.hideLoader()
      console.log(error);
    })
  }
  pageChange(event:any) {
    this.pageData.page=event;
    this.getUsers()
  }
  search(event: any): void {
    this.searchTerms.next(event.target.value);
  }
  limitChange() {
    this.pageData.page = 1;
    this.getUsers()
  }
  openBalanceAddModal(user: any) {
    let modelRef = this.modalService.open(AddBalanceComponent, {
      size: 'md',
      modalDialogClass: 'add-balance-modal',
    });
    modelRef.componentInstance.user = user;
    modelRef.closed.subscribe((res: any) => {
      if (res === 'Close click') {
        this.getUsers()
      }
    })
  }
}
