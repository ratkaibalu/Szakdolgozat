import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-teamview',
  templateUrl: './teamview.component.html',
  styleUrls: ['./teamview.component.css']
})
export class TeamviewComponent implements OnInit{
  public teams: any[] = [];
  public isEditing: boolean = false;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.fetchTeams();
  }

  toggleEditing(status: boolean){
    this.isEditing = status;
  }
  
  fetchTeams(){
    this.dataService.getTeams().subscribe((data: any) => {
      this.teams = data;
    })
  }

  addTeam(){
    this.dataService.postNewTeam().subscribe(() => {
      this.fetchTeams();
    });
  }
}
