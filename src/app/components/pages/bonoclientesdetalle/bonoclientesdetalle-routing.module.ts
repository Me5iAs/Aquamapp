import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BonoclientesdetalleComponent } from './bonoclientesdetalle.component';

const routes: Routes = [{ path: '', component: BonoclientesdetalleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BonoclientesdetalleRoutingModule { }
