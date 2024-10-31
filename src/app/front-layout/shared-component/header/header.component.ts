import {Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit} from '@angular/core';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {AuthenticationService} from "../../../auth/services/authentication.service";
import {DateAgoPipe} from "../../../shared/pipes/date-ago.pipe";



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgbDropdownModule, RouterLink, NgIf, TitleCasePipe, RouterLinkActive, NgForOf, DateAgoPipe, RouterOutlet],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HeaderComponent implements OnInit ,OnDestroy{
  constructor(private router: Router,
              public authService: AuthenticationService,
  ) {
  }

  ngOnInit(): void {
  }

  async logOut() {
    this.authService.logout();
    await this.router.navigate(['/pages/login-register']);
  }


  toggleSidebar() {
    let isAvailable = document.getElementById('main-content-front')?.classList.contains('vartical-collapsed')
    if (isAvailable) {
      document.getElementById('main-content-front')?.classList.remove('vartical-collapsed')
    } else {
      document.getElementById('main-content-front')?.classList.add('vartical-collapsed')
    }
  }



  ngOnDestroy(): void {
  }

  notificationClick(item: any) {
    this.router.navigateByUrl('/',{skipLocationChange: true}).then(() => {
     this.router.navigate(['/communities/' + item + '/prediction-hub']);
    })

  }
}
