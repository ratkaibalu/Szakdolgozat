import { Component, Input, Output, EventEmitter  } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-membercard',
  templateUrl: './membercard.component.html',
  styleUrls: ['./membercard.component.css']
})
export class MembercardComponent {
  @Input() member_name: string = '';
  @Input() skills: any[] = [];
  @Input() member_id: number = 0;
  @Input() team_id: number = 0;
  @Input() isEditing: boolean = false;
  @Output() fetchMembers = new EventEmitter<void>();
  @Output() fetchDropdownMembers = new EventEmitter<void>();

  constructor( private dataService: DataService ,private router: Router) { }

  goToMemberProfile(member_id: number){
    this.router.navigate(['/profile', member_id], { state: {
      'member_name': this.member_name,
      'skills': this.skills
    }});
  }

  deleteMemberFromTeam(teamId: number, memberId: number){
    this.dataService.deleteMembers(teamId,memberId).subscribe(() => {
      this.fetchMembers.emit();
      this.fetchDropdownMembers.emit();
    });
  }
}
