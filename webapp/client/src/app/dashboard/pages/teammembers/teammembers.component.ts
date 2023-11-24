import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/dashboard/services/data.service';

@Component({
  selector: 'app-teammembers',
  templateUrl: './teammembers.component.html',
  styleUrls: ['./teammembers.component.css']
})
export class TeammembersComponent implements OnInit{
  public teamId: number = 0;
  public members: any[] = [];
  public teamName: string = "";
  public isEditing: boolean = false;
  public dropdownMembers: any[] = [];
  public showDropDown: boolean = false;
  public memberId: number = 0;

  constructor(private route: ActivatedRoute,private dataService: DataService) {
    this.route.params.subscribe(params => {
      this.teamId = params['teamid'];
    })
  }

  ngOnInit() {
    this.dataService.getTeamById(this.teamId).subscribe((data: any) => {
      this.teamName = data;
    });

    this.fetchMembers();
    this.fetchDropdownMembers();
  }

  fetchMembers(){
    this.dataService.getTeamMemberSkills(this.teamId).subscribe((data: any) => {
      this.members = data;
    });
  }

  toggleEditing(status: boolean){
    this.isEditing = status;
  }

  fetchDropdownMembers(){
    this.dataService.getDropdownMembers(this.teamId).subscribe((data: any) => {
      this.dropdownMembers = data;
    });
  }

  addMemberToTeam(event: any){
    const memberId = event.target.value;

    this.dataService.postMemberToTeam(memberId, this.teamId).subscribe((data: any) => {
      this.fetchMembers();
      this.fetchDropdownMembers();
    });
  }
}