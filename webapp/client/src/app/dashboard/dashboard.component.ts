import { AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';
import { routerTransition, fadeRouterTransition } from '../utils/router-transitions';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [routerTransition, fadeRouterTransition]
})
export class DashboardComponent implements AfterViewInit {

  constructor(private cd: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  getRouterOutletState(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }
}
