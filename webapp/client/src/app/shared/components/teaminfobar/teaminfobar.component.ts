import { Component,Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-teaminfobar',
  templateUrl: './teaminfobar.component.html',
  styleUrls: ['./teaminfobar.component.css']
})
export class TeamInfobarComponent {
  @Input() teams: any[] = [];
  @Input() isEditing: boolean = false;
  public isAdmin: boolean = this.authService.isAdmin();
  @Output() toggleEditing = new EventEmitter<boolean>();

  constructor(private router: Router, private authService: AuthService) { 
    console.log(this.isAdmin);
    
  }

  changeStatus(){
    this.isEditing = !this.isEditing;
    this.toggleEditing.emit(this.isEditing);
  }

  goToTableView(){
    this.router.navigate(['/dashboard/teamtableview']);
  }
}
