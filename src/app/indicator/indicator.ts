import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { IndicatorService } from '../Services/indicatorService';
import { CookieService } from 'ngx-cookie-service';
import { DepartmentService } from '../Services/departmentService';
import { GetDepartmentModel } from '../Model/getDepartmentModel';
import { FormsModule } from '@angular/forms';
import { CorrespondenceService } from '../Services/correspondenceService';
import { LetterModel } from '../Model/LetterModel';
import { Typeenum } from '../Model/enumletter/Typeenum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-indicator',
  imports: [FormsModule, CommonModule],
  templateUrl: './indicator.html',
  styleUrl: './indicator.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Indicator implements OnInit{
  activeTab = signal<string>("Domestic");
  mydept: GetDepartmentModel[]=[];
  mydepid: any={};
  myletter:LetterModel[]=[];
  lastnumber: number|undefined;
  nextnumber: number | undefined;
  ngOnInit(): void {
    this.loadDept();
  }
  constructor(private indiservice: IndicatorService,private cookie:CookieService,private service: DepartmentService,private cdr: ChangeDetectorRef,private letterservice:CorrespondenceService)
  {

  }
   loadDept()
  {
    this.service.getDepartment().subscribe(
      {
        next: (data)=>
        {
          this.mydept=data;
        this.cdr.markForCheck();
      }
  })
  }
  loadReferrals(tabName: string)
    {
      this.activeTab.set(tabName);
      this.myletter=[];
      this.indiservice.getlastNumberbyType(tabName,this.mydepid.depid,2026).subscribe(
        {
          next: (data)=>
          {
            this.lastnumber=data;
            if(data==0)
              this.nextnumber=1;
            else
            this.nextnumber=data +1;
            this.cdr.markForCheck();
          }
        })
        this.letterservice.GetLetterbyType(tabName as unknown as Typeenum).subscribe(
          {
            next:(data)=>
            {
              this.myletter=data;
              this.cdr.markForCheck();
            }
          }
        )
      
    }
  
 }
