import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

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

  constructor(private route: ActivatedRoute, private dataService: DataService, private router: Router,private formBuilder: FormBuilder){
    this.route.params.subscribe(params => {
      this.skillId = params['skillid'];
      this.skillName = this.router.getCurrentNavigation()?.extras.state?.['skill_name'];
    })
  }

  ngOnInit(): void {
    this.fetchSkillsLinks();
    this.dataService.getBestMembers(this.skillId).subscribe((data: any) => {
      this.members = data;
      console.log();
      
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

  toggleEdit(){
    this.isEditing = !this.isEditing;
  }

  saveEdit(){
    // SAVE
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
    this.router.navigate(['/profile', member_id]);
  }
}
