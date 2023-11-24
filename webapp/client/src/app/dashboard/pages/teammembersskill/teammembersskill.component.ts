import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { DataService } from 'src/app/dashboard/services/data.service';

@Component({
  selector: 'app-teammembersskill',
  templateUrl: './teammembersskill.component.html',
  styleUrls: ['./teammembersskill.component.css']
})
export class TeammembersskillComponent {
  public team_id: number = 0;
  public team_name: string = "";

  constructor(private route: ActivatedRoute, private router: Router, private dataService: DataService) {
    this.route.params.pipe(take(1)).subscribe(params => {
      this.team_id = params['teamid'];
      this.team_name = this.router.getCurrentNavigation()?.extras.state?.['team_name'];
    })
  }

  goToTeamMemberView(team_id: number) {
    this.router.navigate(['/dashboard/teammembers', team_id]);
  }
}
