import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgClass, NgIf, NgOptimizedImage} from '@angular/common';
import {NgbModal, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {AuthenticationService} from "../../auth/services/authentication.service";
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {LoaderService} from "../../shared/services/loader.service";

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [NgbNavModule, NgClass, RouterLink, NgOptimizedImage, ReactiveFormsModule, NgIf],
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss'],
  providers: []
})
export class LoginRegisterComponent implements OnInit,OnDestroy {
  active = 1;
  show = false;
  show1 = false;
  signupSubmitted = false;
  loginSubmitted = false;
  loginForm: FormGroup;
  errorMessage = '';
  returnUrl: string = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {
    this.loaderService.hideLoader();

    //get return url from route parameters
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '';
    this.loginForm = new FormGroup({
      email_id: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]),
      password: new FormControl('', [Validators.required])
    });

  }

  ngOnInit(): void {
  }

  matchConfirmPassword(control: AbstractControl) {
    if (control && control.parent) {
      const password = control.parent.get('password')?.value;
      const confirmPassword = control.value;

      if (password !== confirmPassword) {
        return {
          mismatchedPasswords: true
        };
      }
    }

    return null;
  }

  async login() {
    this.loginSubmitted = true;
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe((res) => {
        this.loginSubmitted = false;
        // console.log(res);
        this.router.navigateByUrl(this.returnUrl??'/')
        //after login process
      }, (err) => {
        this.loginSubmitted = false;
        console.log(err);
        this.errorMessage = err;
      });
    }
  }




  ngOnDestroy(): void {
    this.loaderService.hideLoader();
  }
}
