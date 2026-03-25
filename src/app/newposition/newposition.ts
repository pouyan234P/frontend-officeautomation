import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-newposition',
  imports: [CommonModule],
  templateUrl: './newposition.html',
  styleUrl: './newposition.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Newposition { 
    @Input() title: string = '';
  @Input() isOpen: boolean = false;
  @Output() closed = new EventEmitter<void>();

  close() { this.closed.emit(); }
}
