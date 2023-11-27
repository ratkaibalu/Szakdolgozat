import { NgModule } from '@angular/core';
import { Routes, RouterModule, RouteReuseStrategy } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { TeamviewComponent } from './pages/teamview/teamview.component';
import { TeamtableviewComponent } from './pages/teamtableview/teamtableview.component';
import { LearningComponent } from './pages/learning/learning.component';
import { TeammembersskillComponent } from './pages/teammembersskill/teammembersskill.component';
import { TeammembersComponent } from './pages/teammembers/teammembers.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LearningcategoryComponent } from './pages/learningcategory/learningcategory.component';
import { LearningskillComponent } from './pages/learningskill/learningskill.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'teams', pathMatch: 'full'},
      { path: 'teams', component: TeamviewComponent, data: { title: 'Teams', animation: 'teams' }},
      { path: 'teamtableview', component: TeamtableviewComponent, data: { title: 'Teams table', animation: 'teams-table' }},
      { path: 'learning', component: LearningComponent, data: { title: 'Learning', animation: 'learning' }},
      { path: 'learningskill/:skillid', component: LearningskillComponent, data: { title: 'Learning skill', animation: 'learning-skill' }},
      { path: 'learningcategory/:categoryid', component: LearningcategoryComponent, data: { title: 'Learning category', animation: 'learning-category' }},
      { path: 'profile/:memberId', component: ProfileComponent, data: { title: 'Profile', animation: 'profile' }},
      { path: 'teammembers/:teamid', component: TeammembersComponent, data: { title: 'Team members', animation: 'team-members' }},
      { path: 'teammembersskill/:teamid', component: TeammembersskillComponent, data: { title: 'Team members skill', animation: 'team-members-skill' }},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
