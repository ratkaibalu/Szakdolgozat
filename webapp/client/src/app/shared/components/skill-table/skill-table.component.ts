import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, forkJoin, map, take } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { MemberCell, MemberModel, SkillModel } from 'src/app/shared/models/data.model';


@Component({
  selector: 'app-skill-table',
  templateUrl: './skill-table.component.html',
  styleUrls: ['./skill-table.component.css']
})
export class SkillTableComponent implements OnInit {

  @Input() teamId: number | null = null;

  public allSkills: SkillModel[] = [];

  private readonly cellStyleClasses = ['td_gray', 'td_red', 'td_yellow', 'td_lightgreen', 'td_darkgreen'];
  private readonly maxLevel = 4;
  
  private memberSkills$ = new BehaviorSubject<MemberModel[]>([]);

  public memberTableCells$ = this.memberSkills$.pipe(
    map((members: MemberModel[]): MemberCell[] => {
      const result: MemberCell[] = [];
        
      for (let member of members) {
        const cellMember: MemberCell = {...member, skillCells: []};
        for (let skill of this.allSkills) {
          const existingSkill = member.skills.find((s) => s.skillId === skill.skillId);
          if (existingSkill) {
            const styleIdx = existingSkill.skillLevel;
            cellMember.skillCells.push({content: existingSkill.skillLevel.toString(), cssClass: this.cellStyleClasses[styleIdx]});

          }
          else {
            cellMember.skillCells.push({content: '-', cssClass: this.cellStyleClasses[0]});
          }
        }
        result.push(cellMember);
      }
      return result;
    })
  );

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit() {
    forkJoin({
      skills: this.dataService.getSkillNames(), 
      members: this.teamId != null ? this.dataService.getTeamMemberSkills(this.teamId) : this.dataService.getAllMembersWithSkills()
    })
    .subscribe((result) => {
      this.allSkills = result.skills;
      this.memberSkills$.next(result.members);
    });
  }
}
