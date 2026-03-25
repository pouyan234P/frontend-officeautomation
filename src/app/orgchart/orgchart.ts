import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NewDept } from "../newDept/newDept";

@Component({
  selector: 'app-orgchart',
  imports: [CommonModule, NewDept],
  templateUrl: './orgchart.html',
  styleUrl: './orgchart.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Orgchart { 
  isModalOpen = false;
  openModal()  { this.isModalOpen = true;  }
  closeModal() { this.isModalOpen = false; }
}
