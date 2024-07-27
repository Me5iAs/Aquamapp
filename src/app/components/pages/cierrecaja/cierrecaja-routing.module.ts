import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CierrecajaComponent } from './cierrecaja.component';

const routes: Routes = [{ path: '', component: CierrecajaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CierrecajaRoutingModule { }
