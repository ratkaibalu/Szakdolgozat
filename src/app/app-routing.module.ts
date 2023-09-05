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
import { NotfoundComponent } from './pages/notfound/notfound.component';

const routes: Routes = [
  { path: '', component: TeamviewComponent},
  { path: 'learning', component: LearningComponent},
  { path: 'learningskill', component: LearningskillComponent},
  { path: 'learningcategory', component: LearningcategoryComponent},
  { path: 'profile/:username', component: ProfileComponent},
  { path: 'teammembers', component: TeammembersComponent},
  { path: 'teammembersskill', component: TeammembersskillComponent},
  { path: 'teamtableview', component: TeamtableviewComponent},
  { path: '**', component: NotfoundComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
