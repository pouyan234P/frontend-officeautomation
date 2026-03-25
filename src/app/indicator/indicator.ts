import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-indicator',
  imports: [],
  templateUrl: './indicator.html',
  styleUrl: './indicator.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Indicator { }
