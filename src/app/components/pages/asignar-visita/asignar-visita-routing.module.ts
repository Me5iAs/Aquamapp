import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsignarVisitaComponent } from './asignar-visita.component';

const routes: Routes = [{ path: '', component: AsignarVisitaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsignarVisitaRoutingModule { }
