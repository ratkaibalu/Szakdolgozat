import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { routerTransition, fadeRouterTransition } from '../utils/router-transitions';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [routerTransition, fadeRouterTransition]
})
export class DashboardComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {}

  getRouterOutletState(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }
}
