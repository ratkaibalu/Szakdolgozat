import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TeamInfobarComponent } from './components/teaminfobar/teaminfobar.component';
import { TeamCardComponent } from './components/teamcard/teamcard.component';
import { MembercardComponent } from './components/membercard/membercard.component';
import { TeamskillsinfobarComponent } from './components/teamskillsinfobar/teamskillsinfobar.component';
import { SkillTableComponent } from './components/skill-table/skill-table.component';
import { LocalStorageService } from './services/local-storage.service';
import { RouterLink } from '@angular/router';

const COMPONENTS = [
  TeamInfobarComponent,
  TeamCardComponent,
  MembercardComponent,
  TeamskillsinfobarComponent,
  SkillTableComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  exports: [
    FormsModule,
    ...COMPONENTS,
  ],
  declarations: [...COMPONENTS],
  providers: [
    LocalStorageService
  ]
})
export class SharedModule {}
