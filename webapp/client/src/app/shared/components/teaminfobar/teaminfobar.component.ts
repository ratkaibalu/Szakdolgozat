import { Component,Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teaminfobar',
  templateUrl: './teaminfobar.component.html',
  styleUrls: ['./teaminfobar.component.css']
})
export class TeamInfobarComponent {
  @Input() teams: any[] = [];
  @Input() isEditing: boolean = false;
  @Output() toggleEditing = new EventEmitter<boolean>();

  constructor(private router: Router) { }

  changeStatus(){
    this.isEditing = !this.isEditing;
    this.toggleEditing.emit(this.isEditing);
  }

  goToTableView(){
    this.router.navigate(['/dashboard/teamtableview']);
  }
}
