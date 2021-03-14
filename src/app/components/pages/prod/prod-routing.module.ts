import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProdComponent } from './prod.component';

const routes: Routes = [{ path: '', component: ProdComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProdRoutingModule { }
