import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LearningComponent } from './pages/learning/learning.component';
import { TeamviewComponent } from './pages/teamview/teamview.component';
import { TeamtableviewComponent } from './pages/teamtableview/teamtableview.component';
import { TeammembersComponent } from './pages/teammembers/teammembers.component';
import { TeammembersskillComponent } from './pages/teammembersskill/teammembersskill.component';
import { LearningskillComponent } from './pages/learningskill/learningskill.component';
import { LearningcategoryComponent } from './pages/learningcategory/learningcategory.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: '/teams', pathMatch: 'full'},
  { path: 'teams', component: TeamviewComponent},
  { path: 'teamtableview', component: TeamtableviewComponent},
  { path: 'learning', component: LearningComponent},
  { path: 'learningskill/:skillid', component: LearningskillComponent},
  { path: 'learningcategory/:categoryid', component: LearningcategoryComponent},
  { path: 'profile/:memberId', component: ProfileComponent},
  { path: 'teammembers/:teamid', component: TeammembersComponent},
  { path: 'teammembersskill/:teamid', component: TeammembersskillComponent},
  { path: 'login', component: LoginComponent},
  { path: '**', redirectTo: '/teams', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
