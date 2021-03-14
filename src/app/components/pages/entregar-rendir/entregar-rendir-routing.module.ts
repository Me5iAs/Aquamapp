import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EntregarRendirComponent } from './entregar-rendir.component';

const routes: Routes = [{ path: '', component: EntregarRendirComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntregarRendirRoutingModule { }
