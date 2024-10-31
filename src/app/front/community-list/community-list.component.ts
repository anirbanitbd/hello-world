import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BreadcrumbComponent} from "../../shared/components/breadcrumb/breadcrumb.component";
import {Breadcrumb} from "../../shared/types/breadcrumb";
import {ApiService} from "../../shared/services/api.service";
import {HttpParams} from "@angular/common/http";
import {NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";
import {debounceTime, distinctUntilChanged, Subject} from "rxjs";
import {LoaderService} from "../../shared/services/loader.service";
import {ToastService} from "../../shared/services/toast.service";

@Component({
  selector: 'app-community-list',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, NgbPagination, NgSelectModule, FormsModule],
  templateUrl: './community-list.component.html',
  styleUrls: ['./community-list.component.scss']
})
export class CommunityListComponent implements OnInit {
  breadcrumb: Breadcrumb;
  communities: any[] = [];
  accessTypes: any[] = [
    {id: '', name: 'All'},
    {id: 'PUB', name: 'Public'},
    {id: 'PRI', name: 'Private'},
  ];
  selectedAccessType: any = '';
  pageSizeList: any = [10, 20, 50, 100];

  pageData: {
    page: number,
    limit: number,
    total: number
  };
  selectedCommunityAccessTypes:any=''
  private searchTerms = new Subject<string>();
  searchValue: string = '';
  constructor(
    private apiService: ApiService,
    private loaderService: LoaderService,
    private toastService: ToastService
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
          name: 'Communities',
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
    this.getCommunities()
    this.searchTerms.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(term => {
        this.pageData.page = 1;
        this.searchValue = term;
        this.getCommunities();
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
    if (this.selectedCommunityAccessTypes) {
      params = params.set('access_type', this.selectedCommunityAccessTypes);
    }
    return params;
  }
  getCommunities() {
    this.loaderService.showLoader()
    let params = this.setParams();
    this.apiService.getCommunityList(params).subscribe((res) => {
      this.loaderService.hideLoader()
      if (res.status === 200 && res.flag) {
        this.communities = res.data;
        this.communities.forEach((community:any) => {
          community.user_count=0;
          if (community.c_type=='PD'){
            let commUsers = community.community_users??[];
            commUsers=commUsers.filter((user:any)=>user.is_payment_done)
            community.user_count=commUsers.length
          }else {
            community.user_count = community.community_users?.length??0;
          }
        })
        this.pageData.total = res.page_data?.total??0;
      } else {
        this.communities = []
      }
    },error => {
      this.loaderService.hideLoader()
      console.log(error);
    })
  }

  pageChange(event:any) {
    this.pageData.page=event;
    this.getCommunities()

  }

  typeChangeFn(event: any,id:any  ) {
    this.loaderService.showLoader()
    const isChecked = event.target.checked;
    console.log(isChecked,id);
    let data:any = {
      community_id: id,
      access_type: isChecked ? 'PUB' : 'PRI'
    }
    this.apiService.changeAccessType(data).subscribe((res) => {
      console.log(res);
      if (res.status === 200 && res.flag) {
        this.getCommunities()
        this.toastService.show(
          'Access type changed successfully',
          {classname: 'bg-success text-light', delay: 2000}
        )
      }else {
        this.loaderService.hideLoader()
        this.toastService.show(
          'Failed to change access type',
          {classname: 'bg-danger text-light', delay: 2000}
        )
      }
    },error => {
      this.loaderService.hideLoader()
      this.toastService.show(
        'Failed to change access type',
        {classname: 'bg-danger text-light', delay: 2000}
      )
      console.log(error);
    })
  }

  limitChange() {
    this.pageData.page = 1;
    this.getCommunities()
  }

  accessTypesChange() {
    this.pageData.page = 1;
    this.getCommunities()
  }
  search(event: any): void {
    this.searchTerms.next(event.target.value);
  }
}
