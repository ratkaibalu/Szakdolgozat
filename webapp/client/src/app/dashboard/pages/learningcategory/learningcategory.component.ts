import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/dashboard/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

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

  constructor(private route: ActivatedRoute, private dataService: DataService, private router: Router){
    this.route.params.subscribe(params => {
      this.categoryId = params['categoryid'];
      this.categoryName = this.router.getCurrentNavigation()?.extras.state?.['category_name'];
      this.categoryDescription = this.router.getCurrentNavigation()?.extras.state?.['category_description'];
    })
  }

  ngOnInit(): void {
    this.fetchCategorySkills();
    this.fetchCategoryLinks();
  }

  goToSkillPage(skillId: number,skillName: string){
    this.router.navigate(['/dashboard/learningskill', skillId], {
      state: {
        'skill_name': skillName
      }
    });
  }

  fetchCategorySkills(){
    this.dataService.getCategoryWithSkills(this.categoryId).subscribe((data: any) => {
      this.categorySkills = data;
      console.log(this.categorySkills);
    })
  }

  fetchCategoryLinks(){
    this.dataService.getCategoryLinks(this.categoryId).subscribe((data: any) => {
      this.otherLinks = data;
      console.log(data);
      
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
    // SAVE
    this.isEditing = !this.isEditing;
  }
}
