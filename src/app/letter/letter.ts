import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-letter',
  imports: [],
  templateUrl: './letter.html',
  styleUrl: './letter.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Letter { }
