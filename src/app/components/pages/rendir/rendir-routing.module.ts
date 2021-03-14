import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RendirComponent } from './rendir.component';

const routes: Routes = [{ path: '', component: RendirComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RendirRoutingModule { }
