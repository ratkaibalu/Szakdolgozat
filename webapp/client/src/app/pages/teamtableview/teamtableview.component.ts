import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-teamtableview',
  templateUrl: './teamtableview.component.html',
  styleUrls: ['./teamtableview.component.css']
})
export class TeamtableviewComponent {

  constructor(private dataService: DataService) {}

}
