import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Newposition } from '../newposition/newposition';

@Component({
  selector: 'app-position',
  imports: [CommonModule, Newposition],
  templateUrl: './position.html',
  styleUrl: './position.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Position { 
   isModalOpen = false;
  openModal()  { this.isModalOpen = true;  }
  closeModal() { this.isModalOpen = false; }
}
