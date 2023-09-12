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
import { InfobarComponent } from './shared/components/infobar/infobar.component';
import { CardComponent } from './shared/components/card/card.component';
import { MembercardComponent } from './shared/components/membercard/membercard.component';

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
    InfobarComponent,
    CardComponent,
    MembercardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
