import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ApiService} from "../../../shared/services/api.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ToastService} from "../../../shared/services/toast.service";

@Component({
  selector: 'app-add-balance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-balance.component.html',
  styleUrls: ['./add-balance.component.scss']
})
export class AddBalanceComponent implements OnInit {
  @Input() user: any;
  sendBalanceForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private apiService: ApiService,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.sendBalanceForm = this.fb.group({
      amount: [null,[Validators.required, Validators.min(0.0001)]],
      user_id: [null,Validators.required],
      currency_type: ['FCFA'],
      balance_type: ['BONUS']
    })
  }

  ngOnInit(): void {
    console.log(this.user);
    this.sendBalanceForm.patchValue({
      user_id: this.user.user_id
    })

  }

  addBalance() {
    if (this.sendBalanceForm.invalid) {
      return;
    }
    this.apiService.addBalance(this.sendBalanceForm.value).subscribe(res => {
      if (res.status === 200 && res.flag) {
        this.activeModal.close('Close click');
        this.toastService.show('Balance added successfully', {classname: 'bg-success text-light', delay: 3000});
      } else {
        this.toastService.show('Something went wrong', {classname: 'bg-danger text-light', delay: 3000});
      }
    }, error => {
      console.log(error);
      this.toastService.show('Something went wrong', {classname: 'bg-danger text-light', delay: 3000});
    })
  }
}
