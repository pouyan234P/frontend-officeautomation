import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Newposition } from '../newposition/newposition';
import { GetPosition } from '../Model/getPosition';
import { PositionService } from '../Services/positionService';
import { GetDepartmentModel } from '../Model/getDepartmentModel';
import { DepartmentService } from '../Services/departmentService';
import { FormsModule } from '@angular/forms';
import { GetuserModel } from '../Model/getuserModel';
import { UserService } from '../Services/userService';
import { UserModel } from '../Model/userModel';

@Component({
  selector: 'app-position',
  imports: [CommonModule, Newposition,FormsModule],
  templateUrl: './position.html',
  styleUrl: './position.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Position implements OnInit {
  newpos: any={};
   mypos: GetPosition[]=[];
   mydept: GetDepartmentModel[]=[];
   myuser: UserModel[]=[]
   isModalOpen = false;
  openModal()  { this.isModalOpen = true;  }
  closeModal() { this.isModalOpen = false; }
  ngOnInit(): void {
    this.loadPos();
    this.loaddep();
    this.loaduser();
  } 
  constructor(private posservice:PositionService,private cdr: ChangeDetectorRef,private depservice:DepartmentService,private userservice:UserService)
  {

  }

  loadPos()
  {
    this.posservice.getAll().subscribe(
      {
        next:(data)=>
        {
          this.mypos=data;
          console.log(this.mypos);
          this.cdr.markForCheck();
        }
      })
  }
  loaddep()
  {
    this.depservice.getDepartment().subscribe(
      {
        next: (data)=>
        {
          this.mydept=data;
        }
      })
  }
  loaduser()
  {
    this.userservice.getAll().subscribe(
    {
      next: (data) =>
      {
        this.myuser=data;
        console.log("my data:",data);
      }
    })
  }
  onSave()
  {
    this.posservice.addPosition(this.newpos).subscribe(
      {
        next: (data) =>
        {
          console.log(data);
        }
      })
  }

}
