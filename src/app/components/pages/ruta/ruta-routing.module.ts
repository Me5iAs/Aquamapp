import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RutaComponent } from './ruta.component';

const routes: Routes = [{ path: '', component: RutaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RutaRoutingModule { }
