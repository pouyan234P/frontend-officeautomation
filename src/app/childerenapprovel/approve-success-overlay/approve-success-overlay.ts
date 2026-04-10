import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-approve-success-overlay',
  imports: [],
  templateUrl: './approve-success-overlay.html',
  styleUrl: './approve-success-overlay.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproveSuccessOverlay {
   @Input() show = false;
  @Input() animatePop = false;
  @Input() animateDraw = false;
  @Input() animateText = false;
  @Input() animateChips = false;
  @Input() letterNo = '';
  @Input() senderName = '';

  @Output() close = new EventEmitter<void>();
 }
