import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-membercard',
  templateUrl: './membercard.component.html',
  styleUrls: ['./membercard.component.css']
})
export class MembercardComponent {
  @Input() name: string = '';
  @Input() tags: string[] = [];

}
