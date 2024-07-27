import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BonoventadetalleComponent } from './bonoventadetalle.component';

const routes: Routes = [{ path: '', component: BonoventadetalleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BonoventadetalleRoutingModule { }
