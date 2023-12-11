import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { User } from 'src/app/auth/models/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DataService } from '../../services/data.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  public user: User | null = null;
  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute,private dataService: DataService) {
    this.route.params.pipe(first()).subscribe(params => {
      const memberId = params['memberId'];
      //console.log(params);
    })
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  goToMemberProfile(){
    this.router.navigate(['/dashboard/profile', this.user!.id]);
  }

  public logout($event: any) {
    $event.preventDefault();
    this.authService.logout();
  }
}
