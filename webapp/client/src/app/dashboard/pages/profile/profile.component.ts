import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { DataService } from 'src/app/dashboard/services/data.service';
import { SkillMemberModel } from '../../models/data.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit{
// TODO: Kick any!!!!!

  public memberId: number = 0;
  public memberSkills: any[] = [];
  public member: any = "";
  public categoryNames: any[] = [];
  public allSkills: any[] = []; // TODO: change type to SkillMemberModel[]
  public isEditing: boolean = false;
  public memberName: string = "";
  public rolesReadonly: boolean = true;
  public saveIcon: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private dataService: DataService, private cd: ChangeDetectorRef) {
    this.route.params.subscribe(params => {
      this.memberId = params['memberId'];
    })
  }

  ngOnInit(): void {
    this.fetchSpecificMemberSkills();
    this.dataService.getSpecificMember(this.memberId).subscribe((data: any) => {
      this.member = data;
    });

    this.dataService.getAllCategoryNames().subscribe((data: any) => {
      this.categoryNames = data.map((d: any[]) => ({...d, isExpanded: false}));
    });

    this.dataService.getCategoriesWithSkills().subscribe((data: any) => {
      this.allSkills = data;
    });
  }

  fetchSpecificMemberSkills(){
    this.dataService.getSpecificMemberSkills(this.memberId).subscribe((data: any) => {
      this.memberSkills = data;
    });
  }

  getCategorySkills(category_id: number){
    return this.allSkills.filter(skill => skill.category_id === category_id);
  }

  familiarWithSkill(skillId: number): boolean{
    return !!this.memberSkills.find(skill => skill.skill_id === skillId);
  }

  toggleEdit(){
    this.isEditing = !this.isEditing;
  }

  saveEdit(){
    // SAVE
    this.isEditing = !this.isEditing;
  }

  toggleIconState(category: any) {
    category.isExpanded = !category.isExpanded;
  }

  dotColor(skillId: number,index: number): {'background-color': string } {
    let skill_level = 0;

    let curSkill = this.memberSkills.find(skill => skill.skill_id === skillId);
    if(curSkill !== undefined){
      skill_level = curSkill.skill_level;
    }
    
    if ( skill_level === 1) {
      return index === 0 ? {'background-color':'#FC553B' } : {'background-color':'white'};
    } else if (skill_level === 2) {
      return index < 2 ? {'background-color':'#FFC000'} : {'background-color':'white'};
    } else if (skill_level === 3) {
      return index < 3 ? {'background-color':'#93D04F'} : {'background-color':'white'};
    } else if (skill_level === 4) {
      return index < 4 ? {'background-color':'#43A561'} : {'background-color':'white'};
    }else{
      return {'background-color':'white'};
    }
  }

  changeSkillLevel(skillId: number, dotIndex: number) {
    const idx = this.memberSkills.findIndex(skill => skill.skill_id === skillId);
    if (idx >= 0) {
      this.dataService.putMemberSkillLevel(this.memberId, skillId, dotIndex+1).subscribe(() => {
        this.memberSkills[idx].skill_level = dotIndex + 1;
      });
    } else {
      this.dataService.postNewMemberSkillLevel(this.memberId, skillId, dotIndex+1).subscribe(() => {
        this.fetchSpecificMemberSkills();
      });
    }
  }

  deleteMemberSkill(skillId: number){
    this.dataService.deleteMemberSkill(skillId, this.memberId).subscribe( () => {
      this.fetchSpecificMemberSkills();
    });
  }

  toggleReadonly(){
    this.rolesReadonly = !this.rolesReadonly;
    console.log("valami");
  }

  showSaveIcon(){
    this.saveIcon = true;
  }

  trackByFn(idx: number, skill: any) {
    return skill.skill_id;
  }
}
