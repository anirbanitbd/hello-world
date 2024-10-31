import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import { RouterLink, RouterLinkActive} from '@angular/router';
import {NgClass, NgIf} from "@angular/common";
import {AuthenticationService} from "../../../auth/services/authentication.service";

import {Subject,} from "rxjs";
import {BreakpointObserver} from "@angular/cdk/layout";

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf, NgClass],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit, OnDestroy, AfterViewInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  isSmallScreen: boolean = false;
  constructor(
    private breakpointObserver: BreakpointObserver,
    public authService: AuthenticationService) {

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {

    this.breakpointObserver.observe(['(max-width: 991px)']).subscribe((result) => {
      this.isSmallScreen = result.matches;
    });
  }


  adminToggle(element: HTMLLIElement) {
    if (element.classList.contains('collapsed')) {
      element.classList.remove('collapsed')
    } else {
      element.classList.add('collapsed')
    }
  }

  closeSidebar() {
    if (this.isSmallScreen) {
      document.getElementById('main-content-front')?.classList.remove('vartical-collapsed')
    }
  }

  ngAfterViewInit(): void {

  }
}
