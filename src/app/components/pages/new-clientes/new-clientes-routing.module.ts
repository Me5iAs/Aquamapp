import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewClientesComponent } from './new-clientes.component';

const routes: Routes = [{ path: '', component: NewClientesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewClientesRoutingModule { }
