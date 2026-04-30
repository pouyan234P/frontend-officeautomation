import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { ReferralModel } from '../Model/referralModel';
import { LetterModel } from '../Model/LetterModel';
import { ReferralService } from '../Services/referralService';
import { CookieService } from 'ngx-cookie-service';
import { TypeEnumPipePipe } from '../Pipe/TypeEnumPipe-pipe';
import { PriorityPipe } from '../Pipe/priority-pipe';
import { CorrespondenceService } from '../Services/correspondenceService';
import { DatePipe, NgClass } from '@angular/common';
import { Typeenum } from '../Model/enumletter/Typeenum';
import { Router } from '@angular/router';
import { ApproveConfirmModal } from '../childerenapprovel/approve-confirm-modal/approve-confirm-modal';
import { ApproveSuccessOverlay } from '../childerenapprovel/approve-success-overlay/approve-success-overlay';
import { ReplyPanelComponent } from '../reply-panel.component/reply-panel.component';
import { ApproveSuccessReplay } from '../approve-success-replay/approve-success-replay';
import { RejectPanel } from '../reject-panel/reject-panel';

@Component({
  selector: 'app-letter',
  //standalone: true,
  imports: [TypeEnumPipePipe,PriorityPipe,DatePipe,NgClass,ApproveConfirmModal,ApproveSuccessOverlay,ReplyPanelComponent,ApproveSuccessReplay,RejectPanel],
  templateUrl: './letter.html',
  styleUrl: './letter.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Letter implements OnInit {
   // State Signals
  activeTab = signal<string>('All');
  referrals = signal<ReferralModel[]>([]);
  replyLetter = signal<LetterModel | Partial<LetterModel> | null>(null);
  // Track selections
  selectedReferral = signal<ReferralModel | null>(null);
  selectedLetter = signal<LetterModel | null>(null);
  showConfirm = signal(false);
  showToast = signal(false);
  showSuccess = signal(false);
  animatePop = signal(false);
  animateDraw = signal(false);
  animateText = signal(false);
  animateChips = signal(false);
  showreplaysuccess= signal(false);
  animatePop1 = signal(false);
  animateDraw1 = signal(false);
  animateText1 = signal(false);
  animateChips1 = signal(false);
  showReply = signal<boolean>(false);
  showReject= signal<boolean>(false);
  ngOnInit(): void {
    this.loadReferrals('All');
  }
  constructor(private refservice: ReferralService,private cookie: CookieService,private letterservice: CorrespondenceService,private router: Router,private cdr: ChangeDetectorRef)
  {

  }
  loadReferrals(tabName: string)
  {
    this.activeTab.set(tabName);


    if(tabName=='All')
    {
       this.refservice.getAllByReciver(+this.cookie.get('id')).subscribe(
          {
            next: (data)=>
            {
              this.referrals.set(data);
              console.log("myref: ",this.referrals);
              // Clear the right panel when switching tabs
              this.selectedReferral.set(null);
              this.selectedLetter.set(null);
            },
            error: (err) =>
            {
              console.error('Error loading referrals', err);
            }
          });
    }
    else
    {
      
      this.refservice.getbytyperecvierid(Number(this.cookie.get('id')),tabName as unknown as Typeenum).subscribe(
        {
          next: (data)=>
          {
            this.referrals.set(data);
            this.selectedReferral.set(null);
            this.selectedLetter.set(null);
          },
          error: (err)=>
          {
            console.log(err);
          }
        })
    }

  }

  onReferralClick(referral: ReferralModel)
   {
    this.selectedReferral.set(referral);
    this.letterservice.getLetter(referral.letterID).subscribe(
      {
        next: (data) =>
        {
          this.selectedLetter.set(data);
          if(referral.status.valueOf()==0)
          {
            referral.status=1;
            this.replyLetter.set(data);
          this.refservice.updatereferral(referral).subscribe(
            {
              next: (data)=>
              {
                console.log("finish updating the log");
              },
              error: (err)=>
              {
                console.log(err);
              }
            });
          }
        }
      })
   }
   getStepStatus(currentStatus: number | undefined, stepValue: number): 'done' | 'active' | 'pending' {
    if(this.selectedReferral()?.actionType==0 && this.selectedReferral()?.status!=1)
    {
      currentStatus=currentStatus!+2;
    }
    else
    currentStatus=currentStatus! + 1;
    if (currentStatus === undefined) return 'pending';
    if (currentStatus > stepValue) return 'done';
    if (currentStatus === stepValue) return 'active';
    return 'pending';
  }
 openConfirm() {
  this.showConfirm.set(true);
}

closeConfirm() {
  this.showConfirm.set(false);
}

doApprove() 
{
  
  const currentReferral = this.selectedReferral();

  if (currentReferral?.actionType === 0) {
    // 1. Create an updated copy of the object
    const updatedReferral = { ...currentReferral, status: 3 };
    const todaydate=new Date();
    todaydate.setHours(0,0,0,0);
    updatedReferral.actionDate=todaydate;
    // 2. Update the signal so Angular knows the state has changed
    this.selectedReferral.set(updatedReferral);

    // 3. Pass the actual updated object to the service (not the signal)
    this.refservice.updatereferral(updatedReferral).subscribe({
      next: (data) => {
        console.log("Finish updating the log");
         this.showConfirm.set(false);
        this.showSuccess.set(true);

        setTimeout(() => this.animatePop.set(true), 80);
        setTimeout(() => this.animateDraw.set(true), 150);
        setTimeout(() => this.animateText.set(true), 500);
        setTimeout(() => this.animateChips.set(true), 850);
        this.cdr.markForCheck;
  
      },
      error: (err) => {
        console.error("Approval failed:", err);
        // Add user-facing error handling (like a toast notification) here
      }
    });
  }
  // your API call here
  // this.letterService.approve(this.selectedReferral()!.id).subscribe(...)

}
closeSuccess() {
  this.showSuccess.set(false);
  this.animatePop.set(false);
  this.animateDraw.set(false);
  this.animateText.set(false);
  this.animateChips.set(false);
}
openReply() {
    this.showReply.set(true);
  }

  // 3. Add the method to close the reply panel
  closeReply() {
    this.showReply.set(false);
  }

  // 4. Update your sendReply method to close the panel when done
  sendReply() {
    const currentReferral = this.selectedReferral();

  if (currentReferral?.actionType === 0) {
    // 1. Create an updated copy of the object
    const updatedReferral = { ...currentReferral, status: 2 };

    // 2. Update the signal so Angular knows the state has changed
    this.selectedReferral.set(updatedReferral);

    // 3. Pass the actual updated object to the service (not the signal)
    this.refservice.updatereferral(updatedReferral).subscribe({
      next: (data) => {
        console.log("Finish updating the log");
        this.showReply.set(false);
        this.showreplaysuccess.set(true);
        this.cdr.markForCheck();
        setTimeout(() => this.animatePop1.set(true), 80);
        setTimeout(() => this.animateDraw1.set(true), 150);
        setTimeout(() => this.animateText1.set(true), 500);
        setTimeout(() => this.animateChips1.set(true), 850);
  
      },
      error: (err) => {
        console.error("Approval failed:", err);
        // Add user-facing error handling (like a toast notification) here
      }
    });
  }
  // your API call here
  this.closeReply();
}
closeSuccessreplay() {
  this.showreplaysuccess.set(false);
  this.animatePop1.set(false);
  this.animateDraw1.set(false);
  this.animateText1.set(false);
  this.animateChips1.set(false);
}
openReject()  { this.showReject.set(true); }
closeReject() { this.showReject.set(false); }
doReject() {
  // call your API with reason
  this.showReject.set(false);
}
 }
