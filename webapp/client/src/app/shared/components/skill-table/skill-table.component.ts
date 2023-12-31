import { Component, Input, OnInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, forkJoin, map, take } from 'rxjs';
import { DataService } from 'src/app/dashboard/services/data.service';
import { MemberCell, MemberModel, SkillModel } from 'src/app/dashboard/models/data.model';
import { ViewportScroller } from '@angular/common';


@Component({
  selector: 'app-skill-table',
  templateUrl: './skill-table.component.html',
  styleUrls: ['./skill-table.component.css']
})
export class SkillTableComponent implements OnInit {
  @Input() teamId: number | null = null;
  @ViewChildren('skillHeader') skillHeaders!: QueryList<ElementRef<HTMLElement>>;

  public allSkills: SkillModel[] = [];
  public inputSkillName: string = "";
  public searchedSkill: string = "";
  private timeoutId: any;
  
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

  searchSkillName(){
    const id = 'skill-name-' + this.inputSkillName.toLowerCase();

    const foundSkill = this.skillHeaders.toArray().find( data => data.nativeElement.id === id);

    if(foundSkill){
      foundSkill.nativeElement.scrollIntoView({ behavior: "smooth", inline: "center"});

        if(this.timeoutId) {
        clearTimeout(this.timeoutId);
      }

      this.searchedSkill = this.inputSkillName.toLowerCase();
      this.timeoutId = setTimeout(() => {
        this.searchedSkill = "";
      }, 3000);
    }
  }

  constructor(private router: Router, private dataService: DataService, private scroller: ViewportScroller) {}

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
