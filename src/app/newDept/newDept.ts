import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-new-dept',
  imports: [CommonModule],
  templateUrl: './newDept.html',
  styleUrl: './newDept.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewDept { 
  @Input() title: string = '';
  @Input() isOpen: boolean = false;
  @Output() closed = new EventEmitter<void>();

  close() { this.closed.emit(); }
}
