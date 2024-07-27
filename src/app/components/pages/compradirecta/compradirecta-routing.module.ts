import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompradirectaComponent } from './compradirecta.component';

const routes: Routes = [{ path: '', component: CompradirectaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompradirectaRoutingModule { }
