import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-approve-success-replay',
  imports: [],
  templateUrl: './approve-success-replay.html',
  styleUrl: './approve-success-replay.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproveSuccessReplay { 
  @Input() showreplaysuccess = false;
  @Input() animatePop1 = false;
  @Input() animateDraw1 = false;
  @Input() animateText1 = false;
  @Input() animateChips1 = false;
  @Input() letterNo = '';
  @Input() recivername = '';
  @Input() sendername = '';

  @Output() close = new EventEmitter<void>();
}
