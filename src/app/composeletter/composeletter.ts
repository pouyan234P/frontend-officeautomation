import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GetDepartmentModel } from '../Model/getDepartmentModel';
import { DepartmentService } from '../Services/departmentService';
import { GetPosition } from '../Model/getPosition';
import { PositionService } from '../Services/positionService';
import { CorrespondenceService } from '../Services/correspondenceService';
import { CookieService } from 'ngx-cookie-service';
import { ReferralService } from '../Services/referralService';
import { actionTypeenum } from '../Model/enumreferral/actionTypeenum';

@Component({
  selector: 'app-composeletter',
  imports: [FormsModule],
  templateUrl: './composeletter.html',
  styleUrl: './composeletter.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Composeletter implements OnInit {
  newletter: any={};
  newreferral: any={};
  deptId: number=0; 
  posidssender: number=0;
  getdept: GetDepartmentModel[]=[];
  getpos: GetPosition | undefined;
  posSender: GetPosition | undefined;
  actiontype: actionTypeenum |undefined;
  ngOnInit(): void {
    this.loaddep();
  }
  constructor(private dep: DepartmentService,private pos: PositionService,private cdr: ChangeDetectorRef,private corresService:CorrespondenceService,private cookieService:CookieService,private refserv: ReferralService)
  {

  }
  sendreferral()
  {
    //this.newletter.bodyHTML="context:"+this.newletter.bodyHTML;
    this.newletter.CreatorPositionID=this.cookieService.get('id');
    this.newletter.isDraft=false;
    this.pos.getPositionbyuser(+this.cookieService.get('id')).subscribe(
      {
        next: (data)=>
        {
          this.posSender=data;
        }
      }
    )
    this.corresService.addLetter(this.newletter).subscribe(
      {
        next: (data)=>
        {
          this.newreferral = 
          {
      "letterID": data.id,
      "letterSubject": data.subject,
      "type": data.type,
      "priority": data.priority,
      "senderPositionID": this.posSender!.userID.id,
      "senderName": this.posSender!.userID.username,
      "senderTitle": this.posSender!.title,
      "receiverPositionID": this.getpos!.userID.id,
      "receiverName": this.getpos!.userID.username,
      "receiverTitle": this.getpos!.title,
      "actionType": this.actiontype,
      "status": 0
        };
         this.refserv.createreferral(this.newreferral,this.deptId).subscribe(
          {
            next: (data)=>
            {
              console.log("finish refferal");
            }
          }
         )
        }
      }
    )
    console.log("send");
  }
  onDepartmentChange(event: Event): void {
    
    // Extract the value from the select element
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    // Check if a valid option was selected (not the "Select..." placeholder)
    if (selectedValue) {
      this.deptId= Number(selectedValue);
      this.loadpos(this.deptId);
      this.cdr.detectChanges();
    } else {
      // Clear the positions if the user selects the default placeholder
      this.getpos = undefined; 
    }
  }
  loaddep()
  {
    this.dep.getDepartment().subscribe(
      {
        next: (data)=>
        {
          this.getdept=data;
          console.log("compose letter:",this.getdept);
        }
      });
  }

  loadpos(id: number)
  {
    console.log("myloadpos",id);
    this.pos.getPositionbyDept(id).subscribe(
      {
        next: (data) =>
        {
          this.getpos=data;
          console.log("mytitle:",data.title);
          
        }
      });
  }
 }
