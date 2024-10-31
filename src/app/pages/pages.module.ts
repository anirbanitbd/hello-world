import { NgModule } from '@angular/core';
import { PagesRoutingModule } from './pages-routing.module';
import { PageComponent } from './page/page.component';


@NgModule({
  declarations: [
    PageComponent
  ],
  imports: [
    PagesRoutingModule
  ]
})
export class PagesModule { }
