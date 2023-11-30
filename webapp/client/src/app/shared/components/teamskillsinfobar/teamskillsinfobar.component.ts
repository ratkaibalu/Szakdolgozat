import { Component,Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

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
  public isAdmin: boolean = this.authService.isAdmin();
  
  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService) {
    this.route.params.pipe(first()).subscribe(params => {
      this.team_id = params['teamid'];
    })
  }

  goToTeamTableView(team_id: number) {
    this.router.navigate(['/dashboard/teammembersskill', team_id]);
  }

  changeStatus(){
    this.isEditing = !this.isEditing;
    this.toggleEditing.emit(this.isEditing);
  }
}
