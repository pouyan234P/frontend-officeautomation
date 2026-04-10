import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TypeEnumPipePipe } from '../../Pipe/TypeEnumPipe-pipe';
import { PriorityPipe } from '../../Pipe/priority-pipe';

@Component({
  selector: 'app-approve-confirm-modal',
  imports: [TypeEnumPipePipe, PriorityPipe],
  templateUrl: './approve-confirm-modal.html',
  styleUrl: './approve-confirm-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproveConfirmModal { 
  @Input() open = false;
  @Input() letterNo = '';
  @Input() senderName = '';
  @Input() type: any;
  @Input() priority: any;

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
}
