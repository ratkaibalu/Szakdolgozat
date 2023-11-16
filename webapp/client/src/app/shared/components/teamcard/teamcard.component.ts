import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-teamcard',
  templateUrl: './teamcard.component.html',
  styleUrls: ['./teamcard.component.css']
})

export class TeamCardComponent{
  @Input() team_id: number = 0;
  @Input() team_name: string ='';
  @Input() members: any[] = [];
  @Input() isEditing: boolean = false;
  @Output() fetchTeams = new EventEmitter<void>();

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.dataService.getTeamMembers(this.team_id).subscribe((data: any) => {
      this.members = data;
    });
  }
  
  goToTeam(team_id: number) {
    this.router.navigate(['/teammembers', team_id]);
  }

  deleteTeam(teamId: number){
    this.dataService.deleteTeamMembers(teamId).subscribe(() => {
      //this.fetchTeams.emit();
    });
    this.dataService.deleteTeam(teamId).subscribe(() => {
      this.fetchTeams.emit();
    });
  }

  saveTeamName(teamId: number, teamName: string){
    if(teamName !== ""){
      this.dataService.putTeamName(teamId,teamName).subscribe(() => {
        this.fetchTeams.emit();
      });
    }
  }
}
