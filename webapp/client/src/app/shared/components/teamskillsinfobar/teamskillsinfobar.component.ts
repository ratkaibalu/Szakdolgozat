import { Component,Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-teamskillsinfobar',
  templateUrl: './teamskillsinfobar.component.html',
  styleUrls: ['./teamskillsinfobar.component.css']
})
export class TeamskillsinfobarComponent {
  @Input() team_name: string = "";
  @Input() membersLength: number = 0;
  @Input() team_id: number = 0;
  @Input() isEditing: boolean = false;
  @Output() toggleEditing = new EventEmitter<boolean>();

  constructor(private router: Router, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.team_id = params['teamid'];
    })
  }

  goToTeamTableView(team_id: number) {
    this.router.navigate(['/teammembersskill', team_id], { state: {
      'team_name': this.team_name
    }});
  }

  changeStatus(){
    this.isEditing = !this.isEditing;
    this.toggleEditing.emit(this.isEditing);
  }
}
