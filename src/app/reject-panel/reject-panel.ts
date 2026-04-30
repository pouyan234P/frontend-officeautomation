import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TypeEnumPipePipe } from '../Pipe/TypeEnumPipe-pipe';
import { PriorityPipe } from '../Pipe/priority-pipe';
import { NgClass } from '@angular/common';
import { ReferralModel } from '../Model/referralModel';
import { ReferralService } from '../Services/referralService';
import { CookieService } from 'ngx-cookie-service';
import { PositionService } from '../Services/positionService';

@Component({
  selector: 'app-reject-panel',
  imports: [FormsModule,TypeEnumPipePipe,PriorityPipe,NgClass],
  templateUrl: './reject-panel.html',
  styleUrl: './reject-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RejectPanel implements OnChanges {

  newreferral: any={};
  @Input() open = false;
  @Input() getref: ReferralModel | undefined;
 /* @Input() letterNo = '';
  @Input() senderName = '';
  @Input() priority = 0;
  @Input() type = 0;
  @Input() originalBodyHTML = '';
  @Input() letterSubject=''*/
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<string>();

  rejectReason = '';
  showValidation = false;
  submitted = false;
  activeChip = '';

  quickChips = [
    { label: 'Budget mismatch',       text: 'Budget figures do not match — please revise.' },
    { label: 'Missing signatures',    text: 'Missing required signatures or approvals.' },
    { label: 'Wrong routing',         text: 'Incorrect department routing — please resubmit.' },
    { label: 'Lacking documentation', text: 'Insufficient supporting documentation attached.' },
  ];
   ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }
  constructor(private refservice: ReferralService,private cookies: CookieService,private posservice: PositionService)
  {

  }

  get isValid() { return this.rejectReason.trim().length > 0; }

  get priorityClass() {
    return { 'pri-urgent': this.getref!.priority === 1, 'pri-flash': this.getref!.priority === 2, 'pri-normal': this.getref!.priority === 0 };
  }
  get typeClass() {
    return { 'type-in': this.getref!.type === 0, 'type-out': this.getref!.type === 1, 'type-internal': this.getref!.type === 2 };
  }

  useChip(chip: { label: string; text: string }) {
    this.rejectReason = chip.text;
    this.activeChip = chip.label;
    this.showValidation = false;
  }

  onTextChange() {
    this.activeChip = '';
    if (this.isValid) this.showValidation = false;
  }

  onReject() {
    if (!this.isValid) { this.showValidation = true; return; }
       this.newreferral = 
          {
      "letterID": this.getref!.id,
      "parentReferralId":this.getref!.id,
      "letterSubject": this.getref!.letterSubject,
      "type": this.getref!.type,
      "priority": this.getref!.priority,
      "senderPositionID": this.cookies.get('id'),
      "senderName": this.cookies.get('name'),
      "senderTitle": this.getref!.receiverTitle,
      "receiverPositionID": this.getref!.senderPositionID,
      "receiverName": this.getref!.senderName,
      "receiverTitle": this.getref!.senderTitle,
      "paraph": this.rejectReason,
      "actionType": 2,
      "status": 4
        };
        var deptid: number=0;
         this.posservice.getPositionbyuser(+this.cookies.get('id')).subscribe(
          {
            next: (data)=>
              {
              deptid=data.depID.id;
              }
          });
          this.refservice.createreferral(this.newreferral,deptid).subscribe(
            {
              next: (data)=>
                {
                  console.log("myletter: ",data);
                },
                complete: ()=>
                  {
                    this.submitted = true;
                    this.confirm.emit();
                  }
                });
              }
    onCancel() { this.reset(); this.cancel.emit(); }
    onClose()  { this.reset(); this.cancel.emit(); }
    private reset() {
      this.rejectReason = '';
      this.showValidation = false;
      this.submitted = false;
      this.activeChip = '';
    }
}
