import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReggastosComponent } from './reggastos.component';

const routes: Routes = [{ path: '', component: ReggastosComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReggastosRoutingModule { }
