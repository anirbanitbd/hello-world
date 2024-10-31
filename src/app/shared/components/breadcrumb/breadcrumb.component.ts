import {Component, Input} from '@angular/core';
import {Breadcrumb} from "../../types/breadcrumb";
import {NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouterLink
  ],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {
  @Input() breadcrumb: Breadcrumb | undefined;
  constructor() {
  }



}
