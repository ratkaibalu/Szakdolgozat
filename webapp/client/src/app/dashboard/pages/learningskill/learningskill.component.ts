import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/dashboard/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-learningskill',
  templateUrl: './learningskill.component.html',
  styleUrls: ['./learningskill.component.css']
})
export class LearningskillComponent implements OnInit{
  public skillId: number = 0;
  public skillLinks: any[] = [];
  public skillName: string = "";
  public wikiLinks: any[] = [];
  public videoLinks: any[] = [];
  public otherLinks: any[] = [];
  public isEditing: boolean = false;
  public members: any[] = [];
  public isAdmin: boolean = this.authService.isAdmin();

  constructor(private route: ActivatedRoute, private dataService: DataService, private router: Router,private formBuilder: FormBuilder, private authService: AuthService){
    this.route.params.subscribe(params => {
      this.skillId = params['skillid'];
    })
  }

  ngOnInit(): void {
    this.fetchSkillsLinks();
    this.fetchSkillName();
    this.dataService.getBestMembers(this.skillId).subscribe((data: any) => {
      this.members = data;      
    })
  }

  fetchSkillsLinks(){
    this.dataService.getSkillLinks(this.skillId).subscribe((data: any) => {
      this.skillLinks = data;

      this.wikiLinks = this.skillLinks.filter(link => link.skill_type === 1);
      this.videoLinks = this.skillLinks.filter(link => link.skill_type === 2);
      this.otherLinks = this.skillLinks.filter(link => link.skill_type === 3);
    });
  }

  fetchSkillName() {
    this.dataService.getSkillName(this.skillId).subscribe((data: any) => {
      this.skillName = data;
    });
  }

  toggleEdit(){
    this.isEditing = !this.isEditing;
  }

  saveEdit(){
    this.fetchSkillsLinks();
    this.isEditing = !this.isEditing;
  }

  addNewLink(linkType: number){
    this.dataService.postNewLink(this.skillId, linkType).subscribe(() => {
      this.fetchSkillsLinks();
    });
  }

  deleteLink(linkId:number){
    this.dataService.deleteLink(linkId).subscribe(() => {
      this.fetchSkillsLinks();
    });
  }

  goToMemberProfile(member_id: number){
    this.router.navigate(['/dashboard/profile', member_id]);
  }

  saveSkillLinkName(event: Event, linkId: number){
    const linkName = (event.target as HTMLInputElement).value;
    this.dataService.putSkillLinkName(linkId,linkName).subscribe((data: any) => {
    });
  }

  saveSkillLinkUrl(event: Event, linkId: number){
    const linkUrl = (event.target as HTMLInputElement).value;
    this.dataService.putSkillLinkUrl(linkId,linkUrl).subscribe((data: any) => {
    });
  }
}
