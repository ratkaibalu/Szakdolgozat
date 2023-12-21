import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/dashboard/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css']
})
export class LearningComponent implements OnInit{
  public categories: any[] = [];
  public skillNames: string[] = [];

  constructor(private dataService: DataService,private router: Router){}

  ngOnInit(): void {
    this.dataService.getCategories().subscribe((data: any) => {
      this.categories = data;
      // console.log(this.categories);
    });
  }

  goToSkillPage(skillId: number,skillName: string){
    this.router.navigate(['/dashboard/learningskill', skillId]);
  }
  goToCategoryPage(categoryId: number, categoryName: string, categoryDescription: string[], skills : any[]){
    this.router.navigate(['/dashboard/learningcategory', categoryId], {
      state: {
        'category_name': categoryName,
        'category_description': categoryDescription,
        'category_skills': skills,
      }
    })
  }
}
