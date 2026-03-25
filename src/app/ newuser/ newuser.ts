import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app--newuser',
  imports: [CommonModule],
  templateUrl: './newuser.html',
  styleUrl: './newuser.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Newuser { 
  @Input() title: string = '';
  @Input() isOpen: boolean = false;
  @Output() closed = new EventEmitter<void>();

  close() { this.closed.emit(); }
}
