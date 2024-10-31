import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {CdkListbox} from "@angular/cdk/listbox";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ApiService} from "../../../shared/services/api.service";
import {ToastService} from "../../../shared/services/toast.service";
import {interval, switchMap, takeWhile, throwError, timeoutWith} from "rxjs";
import {catchError} from "rxjs/operators";
import {AuthenticationService} from "../../../auth/services/authentication.service";

@Component({
  selector: 'app-mobile-money-model',
  standalone: true,
  imports: [CommonModule, CdkListbox, ReactiveFormsModule],
  templateUrl: './mobile-money-model.component.html',
  styleUrls: ['./mobile-money-model.component.scss']
})
export class MobileMoneyModelComponent implements OnInit {
  @Input() data: any;
  paymentInitForm!: FormGroup;
  // paymentApproveForm!: FormGroup;
  // isApproveScreen = false;
  isLoader = false;
  isLoaderText = false
  transaction_id: any;
  transactionStatus: any = 'PROCESSING'
  userEmail: any;
  userName: any;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastService: ToastService,
    private authService: AuthenticationService
  ) {

    this.userEmail = this.authService.currentUserValue?.email_id;
    this.userName = this.authService.currentUserValue?.user_name;
  }

  ngOnInit(): void {
    console.log(this.data);
    this.paymentInitForm = this.fb.group({
      amount: [this.data.amount, Validators.required],
      number: [null, Validators.required],
      paymentMethod: [this.data.paymentMethod, Validators.required],
      email: [this.userEmail ?? null],
      userName: [this.userName ?? null],
    });
  }

  paymentInit() {
    this.isLoader = true;
    console.log(this.paymentInitForm.value);
    this.apiService.initMobileMoneyPayment(this.paymentInitForm.value).subscribe((res) => {
      console.log(res);
      this.isLoader = false;
      if (res.status === 200 && res.flag) {
        this.transaction_id = res.data?.transaction_id;
        // this.isApproveScreen = true;
        this.getTransactionStatusUntil()
      } else {
        this.activeModal.close();
        this.toastService.show(res.message, {classname: 'bg-danger text-light', delay: 10000});
      }
    }, (error) => {
      this.activeModal.close();
      console.log(error);
      this.toastService.show('Something went wrong!', {classname: 'bg-danger text-light', delay: 10000});
    })
  }


//get transaction status until get response.data.status = 'SUCCESS' or 'FAILED' or 'CANCELLED' but max 2 minutes
  getTransactionStatusUntil() {
    this.isLoader = true;
    this.isLoaderText = true;
    const maxDuration = 3 * 60 * 1000; // 3 minutes in milliseconds
    const intervalTime = 5000; // Interval time in milliseconds (5 seconds)

    const startTime = Date.now();
    interval(intervalTime).pipe(
      switchMap(() => this.apiService.getTransactionStatus(this.transaction_id).pipe(
        catchError(err => {
          console.error('API call failed', err);
          return throwError(err);
        })
      )),
      takeWhile(data => {
        // Check if the desired condition is met
        const isDesiredData = this.isDesiredData(data);
        if (isDesiredData) {
          console.log('Desired data received:', data);
          this.transactionStatus = data.data.status;
          if (data.data.status === 'SUCCESS') {
            this.toastService.show('Transaction success', {classname: 'bg-success text-light', delay: 10000});
            this.activeModal.close();
          } else if (data.data.status === 'FAILED') {
            this.toastService.show('Transaction failed', {classname: 'bg-danger text-light', delay: 10000});
            this.activeModal.close();
          } else if (data.data.status === 'CANCELLED') {
            this.toastService.show('Transaction cancelled', {classname: 'bg-danger text-light', delay: 10000});
          } else if (data.data.status === 'EXPIRED') {
            this.toastService.show('Transaction expired', {classname: 'bg-danger text-light', delay: 10000});
          }
          this.activeModal.close();
        }
        return !isDesiredData && (Date.now() - startTime) < maxDuration;
      }),
      timeoutWith(maxDuration, throwError('Timeout exceeded'))
    ).subscribe({
      next: (data) => {
        // Handle successful data reception
        console.log('Data received:', data);

      },
      error: (error) => {
        // Handle errors and timeout
        console.error('Operation stopped:', error);
        this.activeModal.close();
        this.isLoader = false;
        if (error === 'Timeout exceeded') {
          this.toastService.show('If the transaction is not successful within 2 minutes, it will be settled in 24 hours.', {
            classname: 'bg-danger text-light',
            delay: 10000
          });
        } else {
          this.toastService.show('Transaction failed', {
            classname: 'bg-danger text-light',
            delay: 10000
          });
        }
      },
      complete: () => {
        console.log('Operation complete');
        this.activeModal.close();
        this.isLoader = false;
      }
    });
  }

  isDesiredData(data: any): boolean {
    return data.data.status === 'SUCCESS' || data.data.status === 'FAILED' || data.data.status === 'CANCELLED' || data.data.status === 'EXPIRED';
  }
}
