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
export class TeammembersskillComponent implements OnInit{
  public teamId: number = 0;
  public teamName: string = "";

  constructor(private route: ActivatedRoute, private router: Router, private dataService: DataService) {
    this.route.params.pipe(take(1)).subscribe(params => {
      this.teamId = params['teamid'];
    });
  }

  ngOnInit(): void {
    this.dataService.getTeamById(this.teamId).subscribe((data: any) => {
      this.teamName = data;
    });
  }

  goToTeamMemberView(team_id: number) {
    this.router.navigate(['/dashboard/teammembers', team_id]);
  }
}
