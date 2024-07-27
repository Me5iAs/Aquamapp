import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AtencionComponent } from './atencion.component';

const routes: Routes = [{ path: '', component: AtencionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AtencionRoutingModule { }
