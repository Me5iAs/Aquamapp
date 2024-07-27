import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PorcobrarComponent } from './porcobrar.component';

const routes: Routes = [{ path: '', component: PorcobrarComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PorcobrarRoutingModule { }
