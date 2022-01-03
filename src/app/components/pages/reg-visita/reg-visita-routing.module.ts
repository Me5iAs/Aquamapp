import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegVisitaComponent } from './reg-visita.component';

const routes: Routes = [{ path: '', component: RegVisitaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegVisitaRoutingModule { }
