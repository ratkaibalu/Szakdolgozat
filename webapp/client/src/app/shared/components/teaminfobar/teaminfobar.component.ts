import { Component,Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-teaminfobar',
  templateUrl: './teaminfobar.component.html',
  styleUrls: ['./teaminfobar.component.css']
})
export class TeamInfobarComponent {
  @Input() teams: any[] = [];
  @Input() isEditing: boolean = false;
  @Output() toggleEditing = new EventEmitter<boolean>();

  changeStatus(){
    this.isEditing = !this.isEditing;
    this.toggleEditing.emit(this.isEditing);
  }
}
