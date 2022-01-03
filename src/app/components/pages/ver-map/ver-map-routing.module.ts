import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerMapComponent } from './ver-map.component';

const routes: Routes = [{ path: '', component: VerMapComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerMapRoutingModule { }
