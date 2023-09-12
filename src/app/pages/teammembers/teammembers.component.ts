import { Component, OnInit } from '@angular/core';
import { FakeMembersService } from 'src/app/services/fake-members-api.service';
import { MemberModel, SkillModel } from 'src/app/shared/models/member.model';


@Component({
  selector: 'app-teammembers',
  templateUrl: './teammembers.component.html',
  styleUrls: ['./teammembers.component.css']
})
export class TeammembersComponent implements OnInit {
  
  public members: MemberModel[] = [];

  constructor(private membersService: FakeMembersService) {

  }

  ngOnInit(): void {
    this.membersService.getMemberList().subscribe((members) => {
      this.members = members;
    });
  }

  nameOfSkills(skills: SkillModel[]): string[] {
    return skills.map(s => s.name);
  }
}
