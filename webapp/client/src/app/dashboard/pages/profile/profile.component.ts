import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { DataService } from 'src/app/dashboard/services/data.service';
import { SkillMemberModel } from '../../models/data.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/auth/models/user.model';
import { first } from 'rxjs';

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
  public isAdmin: boolean = this.authService.isAdmin();
  public user: User | null = this.authService.getUser();

  constructor(private route: ActivatedRoute, private router: Router, private dataService: DataService, private cd: ChangeDetectorRef, private authService: AuthService) {
    this.route.params.pipe(first()).subscribe(params => {
      this.memberId = params['memberId'];
    });
  }

  ngOnInit(): void {
    this.fetchSpecificMemberSkills();
    this.fetchMemberData();

    this.dataService.getAllCategoryNames().subscribe((data: any) => {
      this.categoryNames = data.map((d: any[]) => ({...d, isExpanded: false}));
    });

    this.dataService.getCategoriesWithSkills().subscribe((data: any) => {
      this.allSkills = data;
    });
  }

  canEdit(): boolean{
    if(this.isAdmin){
      return true;
    }else if(this.user?.id == this.memberId){
      return true;
    }else{
      return false;
    }
  }

  fetchMemberData(){
    this.dataService.getSpecificMember(this.memberId).subscribe((data: any) => {
      this.member = data;
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
    this.fetchMemberData();
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
  }

  showSaveIcon(){
    this.saveIcon = true;
  }

  trackByFn(idx: number, skill: any) {
    return skill.skill_id;
  }

  saveMemberName(event: Event){
    const newName = (event.target as HTMLInputElement).value;
    this.dataService.putMemberName(this.memberId, newName).subscribe((data: any) => {
    });
  }

  saveMemberTeamsName(event: Event){
    const newTeamsName = (event.target as HTMLInputElement).value;
    this.dataService.putMemberTeamsName(this.memberId, newTeamsName).subscribe((data: any) => {
    });
  }

  saveMemberEmail(event: Event){
    const newEmail = (event.target as HTMLInputElement).value;
    this.dataService.putMemberEmail(this.memberId, newEmail).subscribe((data: any) => {
    });
  }

  saveMemberRoles(event: Event){
    const newRoles = (event.target as HTMLInputElement).value;
    this.dataService.putMemberRoles(this.memberId, newRoles).subscribe((data: any) => {
    });
  }

  saveMemberAbout(event: Event){
    const newAbout = (event.target as HTMLInputElement).value;
    this.dataService.putMemberAbout(this.memberId, newAbout).subscribe((data: any) => {
    });
  }
}
