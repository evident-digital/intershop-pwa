import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CompleteProfilePageComponent } from './complete-profile-page.component';

const completeProfilePageRoutes: Routes = [{ path: '', component: CompleteProfilePageComponent }];

@NgModule({
  imports: [RouterModule.forChild(completeProfilePageRoutes), SharedModule],
  declarations: [CompleteProfilePageComponent],
})
export class CompleteProfilePageModule {}
