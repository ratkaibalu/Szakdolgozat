import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/dashboard/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-learningcategory',
  templateUrl: './learningcategory.component.html',
  styleUrls: ['./learningcategory.component.css']
})
export class LearningcategoryComponent implements OnInit{
  public categoryId: number = 0;
  public categoryName: string = "";
  public categoryLinks: any[] = [];
  public categoryDescription: string[] = [];
  public categorySkills: any[] = [];
  public isEditing: boolean = false;
  public otherLinks: any[] = [];
  public isAdmin: boolean = this.authService.isAdmin();

  constructor(private route: ActivatedRoute, private dataService: DataService, private router: Router, private authService: AuthService){
    this.route.params.subscribe(params => {
      this.categoryId = params['categoryid'];
    })
  }

  ngOnInit(): void {
    this.fetchCategoryData();
    this.fetchCategorySkills();
    this.fetchCategoryLinks();
  }

  fetchCategoryData(){
    
    this.dataService.getCategoryNameAndDesc(this.categoryId).subscribe((data: any) => {
      this.categoryName = data[0].category_name;
      this.categoryDescription = data[0].category_description;
    })
  }

  goToSkillPage(skillId: number,skillName: string){
    this.router.navigate(['/dashboard/learningskill', skillId]);
  }

  fetchCategorySkills(){
    this.dataService.getCategoryWithSkills(this.categoryId).subscribe((data: any) => {
      this.categorySkills = data;
    })
  }

  fetchCategoryLinks(){
    this.dataService.getCategoryLinks(this.categoryId).subscribe((data: any) => {
      this.otherLinks = data;
    })
  }

  addNewSkill(){
    this.dataService.postNewSkill(this.categoryId).subscribe(() => {
      this.fetchCategorySkills();
    });
  }
  
  deleteSkill(skillId:number){
    this.dataService.deleteSkill(skillId).subscribe(() => {
      this.fetchCategorySkills();
    });
  }

  deleteLink(linkId:number){
    this.dataService.deleteCategoryLink(linkId).subscribe(() => {
      this.fetchCategoryLinks();
    });
  }

  addNewLink(){
    this.dataService.postNewCategoryLink(this.categoryId).subscribe(() => {
      this.fetchCategoryLinks();
    });
  }

  toggleEdit(){
    this.isEditing = !this.isEditing;
  }

  saveEdit(){
    this.fetchCategoryData();
    this.fetchCategoryLinks();
    
    this.isEditing = !this.isEditing;
  }

  saveCategoryDescription(event: Event){
    const description = (event.target as HTMLInputElement).value;
    this.dataService.putCategoryDescription(this.categoryId, description).subscribe((data: any) => {
    });
  }

  saveCategoryLinkName(event: Event, linkId: number){
    const linkName = (event.target as HTMLInputElement).value;
    this.dataService.putCategoryLinkName(linkId, linkName).subscribe((data: any) => {
    });
  }

  saveCategoryLink(event: Event, linkId: number){
    const link = (event.target as HTMLInputElement).value;
    this.dataService.putCategoryLink(linkId, link).subscribe((data: any) => {
    });
  }
}
