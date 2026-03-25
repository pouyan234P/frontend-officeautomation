import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Newuser } from '../ newuser/ newuser';

@Component({
  selector: 'app-userpage',
  imports: [CommonModule, Newuser],
  templateUrl: './userpage.html',
  styleUrl: './userpage.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Userpage { 
  isModalOpen = false;
  openModal()  { this.isModalOpen = true;  }
  closeModal() { this.isModalOpen = false; }
}
