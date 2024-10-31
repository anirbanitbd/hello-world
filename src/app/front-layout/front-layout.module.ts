import { NgModule } from '@angular/core';
import { FrontLayoutRoutingModule } from './front-layout-routing.module';
import { FrontLayoutComponent } from './front-layout/front-layout.component';
import {SideBarComponent} from "./shared-component/side-bar/side-bar.component";
import {HeaderComponent} from "./shared-component/header/header.component";
import {FooterComponent} from "./shared-component/footer/footer.component";
import {NgClass} from "@angular/common";


@NgModule({
  declarations: [
    FrontLayoutComponent
  ],
  imports: [
    FrontLayoutRoutingModule,
    SideBarComponent,
    HeaderComponent,
    FooterComponent,
    NgClass,
  ]
})
export class FrontLayoutModule { }
