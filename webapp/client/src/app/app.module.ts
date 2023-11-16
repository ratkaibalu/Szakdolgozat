import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/layout/header/header.component';
import { LearningComponent } from './pages/learning/learning.component';
import { TeamviewComponent } from './pages/teamview/teamview.component';
import { TeamtableviewComponent } from './pages/teamtableview/teamtableview.component';
import { TeammembersComponent } from './pages/teammembers/teammembers.component';
import { TeammembersskillComponent } from './pages/teammembersskill/teammembersskill.component';
import { LearningskillComponent } from './pages/learningskill/learningskill.component';
import { LearningcategoryComponent } from './pages/learningcategory/learningcategory.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { TeamInfobarComponent } from './shared/components/teaminfobar/teaminfobar.component';
import { TeamCardComponent } from './shared/components/teamcard/teamcard.component';
import { MembercardComponent } from './shared/components/membercard/membercard.component';
import { TeamskillsinfobarComponent } from './shared/components/teamskillsinfobar/teamskillsinfobar.component';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './services/data.service';
import { SkillTableComponent } from './shared/components/skill-table/skill-table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LearningComponent,
    TeamviewComponent,
    TeamtableviewComponent,
    TeammembersComponent,
    TeammembersskillComponent,
    LearningskillComponent,
    LearningcategoryComponent,
    ProfileComponent,
    NotfoundComponent,
    TeamInfobarComponent,
    TeamCardComponent,
    MembercardComponent,
    TeamskillsinfobarComponent,
    SkillTableComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    DataService
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
