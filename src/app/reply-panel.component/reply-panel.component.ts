import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReferralModel } from '../Model/referralModel';
import { ReferralService } from '../Services/referralService';
import { CorrespondenceService } from '../Services/correspondenceService';
import { CookieService } from 'ngx-cookie-service';
import { DepartmentService } from '../Services/departmentService';
import { PositionService } from '../Services/positionService';

@Component({
  selector: 'app-reply-panel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reply-panel.component.html',
  styleUrl: './reply-panel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReplyPanelComponent implements OnChanges {
  newreferral: any={};
  @Input() show = false;
@Input() letterNo = '';
  @Input() senderName = '';
  @Input() subject = '';
  @Input() originalBodyHTML = '';
  @Input() letterID: number | null = null;
  @Input() myreferral: ReferralModel | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() send = new EventEmitter<any>();

  replyLetter = {
    type: 0,
    priority: 0,
    confidential: 0,
    actiontype: 0,
    subject: '',
    bodyHTML: ''
  };

  ngOnChanges() {
    this.replyLetter.subject = 'Re: ' + this.subject;
  } 
  constructor(private refservice: ReferralService,private letterservice: CorrespondenceService,private cookies: CookieService,private posservice: PositionService)
  {

  }
  onClose() {
    this.close.emit();
  }
  
  onSend(model: any) 
  {
    model.replyToLetterID=this.letterID!;
    model.bodyReplay=this.originalBodyHTML;
    model.isDraft=false;
    const myletter=this.letterservice.addLetter(model).subscribe(
      {
        next: (data)=>
        {
          this.newreferral = 
          {
      "letterID": data.id,
      "letterSubject": data.subject,
      "type": data.type,
      "replayToLetterNo":this.myreferral!.replayToLetterNo,
      "priority": data.priority,
      "senderPositionID": this.cookies.get('id'),
      "senderName": this.cookies.get('name'),
      "senderTitle": this.myreferral!.receiverTitle,
      "receiverPositionID": this.myreferral!.senderPositionID,
      "receiverName": this.myreferral!.senderName,
      "receiverTitle": this.myreferral!.senderTitle,
      "actionType": 2,
      "status": 3
        };
        var deptid: number=0;
        this.posservice.getPositionbyuser(+this.cookies.get('id')).subscribe(
          {
            next: (data)=>
              {
              deptid=data.depID.id;
              }
          });
          console.log("myletter: ",data);
          this.refservice.createreferral(this.newreferral,deptid).subscribe(
            {
              next: (data)=>
                {
                  console.log("myletter: ",data);
                }
            });
        },
        complete: ()=>
        {
          this.send.emit();
        }
      }
    )
    
  }

}
