import { Component } from '@angular/core';
import { DataService } from 'src/app/dashboard/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teamtableview',
  templateUrl: './teamtableview.component.html',
  styleUrls: ['./teamtableview.component.css']
})
export class TeamtableviewComponent {

  constructor(private dataService: DataService, private router: Router) {}

  goToTeams(){
    this.router.navigate(['/dashboard/teams']);
  }
}
