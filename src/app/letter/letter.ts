import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { ReferralModel } from '../Model/referralModel';
import { LetterModel } from '../Model/LetterModel';
import { ReferralService } from '../Services/referralService';
import { CookieService } from 'ngx-cookie-service';
import { TypeEnumPipePipe } from '../Pipe/TypeEnumPipe-pipe';
import { PriorityPipe } from '../Pipe/priority-pipe';
import { CorrespondenceService } from '../Services/correspondenceService';
import { DatePipe, NgClass } from '@angular/common';
import { Typeenum } from '../Model/enumletter/Typeenum';

@Component({
  selector: 'app-letter',
  imports: [TypeEnumPipePipe,PriorityPipe,DatePipe,NgClass],
  templateUrl: './letter.html',
  styleUrl: './letter.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Letter implements OnInit {
   // State Signals
  activeTab = signal<string>('All');
  referrals = signal<ReferralModel[]>([]);
  
  // Track selections
  selectedReferral = signal<ReferralModel | null>(null);
  selectedLetter = signal<LetterModel | null>(null);
   isLoading = false;
  ngOnInit(): void {
    this.loadReferrals('All')
  }
  constructor(private refservice: ReferralService,private cookie: CookieService,private letterservice: CorrespondenceService)
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
    currentStatus=(currentStatus ?? 0) + 1;
    if (currentStatus === undefined) return 'pending';
    if (currentStatus > stepValue) return 'done';
    if (currentStatus === stepValue) return 'active';
    return 'pending';
  }
 }
